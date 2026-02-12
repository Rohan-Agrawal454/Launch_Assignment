import jwt from '@tsndr/cloudflare-worker-jwt';

export default async function handler(request, context) {

  const url = new URL(request.url);
  const hostname = url.hostname;
  const pathname = url.pathname;

  // ============================================
  // BASIC AUTH FOR NON-PRODUCTION DOMAINS
  // ============================================

  const testDomains = [
    "launchassignment-test.contentstackapps.com"
  ];

  const USERNAME = context.env.BASIC_AUTH_USER;
  const PASSWORD = context.env.BASIC_AUTH_PASS;

  const isTestDomain = testDomains.some(domain => hostname.includes(domain));

  // Password-protect root route on non-production domains
  if (pathname === "/" && isTestDomain) {
    const auth = request.headers.get("authorization");
    
    if (!auth) {
      return new Response("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Protected Site"',
          "Content-Type": "text/plain"
        },
      });
    }

    const isValid = isBasicAuthValid(auth, USERNAME, PASSWORD);

    if (!isValid) {
      return new Response("Invalid credentials", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Protected Site"',
          "Content-Type": "text/plain"
        },
      });
    }

    console.log(`[AUTH] Authentication successful, proceeding...`);
  }

  // ============================================
  // LOCALE DETECTION (BASED ON COUNTRY & LANGUAGE)
  // ============================================

  /*
  const acceptLanguage = request.headers.get("accept-language") || "en";
  const country = request.headers.get("visitor-ip-country") || "US";

  let locale = acceptLanguage.split(",")[0].split("-")[0]; // "fr", "en", "ja"

  // Override locale based on country
  if (country === "FR") locale = "fr";
  if (country === "JP") locale = "ja";
  if (country === "IN") locale = "en";

  console.log(`[LOCALE] Detected country: ${country}, locale: ${locale}`);
  */

  // ============================================
  // SMART CACHING POLICY (TOP LEVEL)
  // ============================================

  let cacheControl = null;

  if (pathname === "/blog/latest") {
    cacheControl = "public, max-age=30, stale-while-revalidate=30";
  }
  else if (pathname.startsWith("/blog/") && pathname !== "/blog/latest") {
    cacheControl = "public, max-age=600, stale-while-revalidate=300";
  }

  // ============================================
  // TRIGGER CONTENTSTACK AUTOMATE FROM BUTTON
  // ============================================

  if (url.pathname === "/automate/trigger" && request.method === "POST") {

    const pathToRevalidate = url.searchParams.get("path");

    if (!pathToRevalidate) {
      return new Response(
        JSON.stringify({ error: "Missing path parameter" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("[AUTOMATE] Triggering webhook for:", pathToRevalidate);

    await fetch(
      "https://app.contentstack.com/automations-api/run/d457657f24f847458b7d62c48008228a",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: pathToRevalidate })
      }
    );

    return new Response(
      JSON.stringify({
        message: `Automate triggered for ${pathToRevalidate}`
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  // ============================================
  // IP WHITELISTING (ONLY FOR /editor-dashboard)
  // ============================================

  if (request.url.includes('/editor-dashboard')) {

    const allowedIPs = [
      "127.0.0.1",
      "::1",
      "154.84.245.58",
      "27.107.90.206"
    ];

    const clientIP = request.headers.get("x-forwarded-for") || "";
    const clientIPList = clientIP.split(",").map(ip => ip.trim());

    const allowed = clientIPList.some(ip => allowedIPs.includes(ip));

    if (!allowed) {
      return new Response(
        JSON.stringify({
          error: "Forbidden",
          message: "Your IP address is not in the whitelist.",
          your_ip: clientIPList[0],
          timestamp: new Date().toISOString()
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    return fetchWithCache(request, cacheControl);
  }

  // ============================================
  // REWRITE LOGIC - ONLY FOR PRODUCTION DOMAIN
  // ============================================

  if (pathname === "/latest" && isProductionDomain) {
    const rewriteUrl = new URL(request.url);
    rewriteUrl.pathname = "/blog/latest";
    return fetchWithCache(new Request(rewriteUrl, request), cacheControl);
  }

  // ============================================
  // CDN ASSET PROXY (/cdn-assets/* -> Contentstack)
  // ============================================

  if (pathname.startsWith("/cdn-assets/")) {
    // Extract filename from path: /cdn-assets/logo.png -> logo.png
    const filename = pathname.replace("/cdn-assets/", "");

    // Construct Contentstack asset URL
    const targetImage =
      `https://images.contentstack.io/v3/assets/${filename}`;

    console.log(`[CDN PROXY] Fetching: ${filename} from Contentstack`);

    try {
      const res = await fetch(targetImage);

      if (!res.ok) {
        console.error(`[CDN PROXY] Failed to fetch ${filename}: ${res.status}`);
        return new Response('Asset not found', { status: 404 });
      }

      return new Response(res.body, {
        status: 200,
        headers: {
          "Content-Type": res.headers.get("Content-Type") || "image/png",
          "Cache-Control": "no-cache",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (error) {
      console.error(`[CDN PROXY] Error fetching ${filename}:`, error);
      return new Response('Error fetching asset', { status: 502 });
    }
  }

  // ============================================
  // OAUTH CREDENTIALS
  // ============================================

  const oauthCredentials = {
    OAUTH_CLIENT_ID: context.env.OAUTH_CLIENT_ID,
    OAUTH_CLIENT_SECRET: context.env.OAUTH_CLIENT_SECRET,
    OAUTH_REDIRECT_URI: context.env.OAUTH_REDIRECT_URI,
    OAUTH_TOKEN_URL: context.env.OAUTH_TOKEN_URL
  };

  // Skip auth for static assets
  if (request.url.includes("_next") || request.url.includes("favicon.ico")) {
    return fetchWithCache(request, cacheControl);
  }

  // Allow login page
  if (request.url.includes("/login")) {
    return fetchWithCache(request, cacheControl);
  }

  // Handle OAuth callback
  if (request.url.includes("/oauth/callback")) {
    const authCode = url.searchParams.get("code");

    if (authCode) {
      const tokens = await exchangeAuthCodeForTokens(authCode, oauthCredentials);
      const jwtToken = await createJwtToken(tokens, oauthCredentials);
      const response = redirectTo("/author-tools");
      return setCookie(response, "jwt", jwtToken);
    }
  }

  // Allow all non-protected routes
  if (!request.url.includes("/author-tools")) {
    return fetchWithCache(request, cacheControl);
  }

  // ============================================
  // PROTECT /author-tools WITH JWT
  // ============================================

  const cookies = parseCookies(request.headers.get("cookie") || "");
  const jwtToken = cookies["jwt"];

  if (jwtToken) {
    try {
      const verified = await jwt.verify(
        jwtToken,
        oauthCredentials.OAUTH_CLIENT_SECRET
      );

      if (verified) {
        return fetchWithCache(request, cacheControl);
      }
    } catch (err) {
      console.log("JWT error:", err);
      return redirectToLogin();
    }
  }

  return redirectToLogin();
}

// =====================
// HELPER FUNCTIONS
// =====================

function isBasicAuthValid(authHeader, username, password) {
  try {
    
    // Expected format: "Basic <base64>"
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Basic") {
      return false;
    }

    const base64Credentials = parts[1];
    
    // Decode base64 - try different methods for edge environment
    let decoded;
    try {
      // Try atob first (standard in web environments)
      decoded = atob(base64Credentials);
    } catch {
      try {
        // Fallback: manual base64 decode for edge environments
        decoded = decodeBase64(base64Credentials);
      } catch (e2) {
        return false;
      }
    }
      
    const colonIndex = decoded.indexOf(":");
    if (colonIndex === -1) {
      return false;
    }
    
    const user = decoded.substring(0, colonIndex);
    const pass = decoded.substring(colonIndex + 1);
    
    console.log(`[AUTH] Parsed username: "${user}" (expected: "${username}")`);
    console.log(`[AUTH] Password match: ${pass === password}`);
    
    return user === username && pass === password;
  } catch (error) {
    console.error("[AUTH] Error validating credentials:", error);
    return false;
  }
}

// Fallback base64 decoder for edge environments
function decodeBase64(str) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  
  str = str.replace(/[^A-Za-z0-9\+\/\=]/g, '');
  
  for (let i = 0; i < str.length; i += 4) {
    const enc1 = chars.indexOf(str.charAt(i));
    const enc2 = chars.indexOf(str.charAt(i + 1));
    const enc3 = chars.indexOf(str.charAt(i + 2));
    const enc4 = chars.indexOf(str.charAt(i + 3));
    
    const chr1 = (enc1 << 2) | (enc2 >> 4);
    const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    const chr3 = ((enc3 & 3) << 6) | enc4;
    
    output += String.fromCharCode(chr1);
    if (enc3 !== 64) output += String.fromCharCode(chr2);
    if (enc4 !== 64) output += String.fromCharCode(chr3);
  }
  
  return output;
}

async function fetchWithCache(request, cacheControl) {
  const response = await fetch(request);

  if (!cacheControl) return response;

  const modified = new Response(response.body, response);
  modified.headers.set("Cache-Control", cacheControl);
  return modified;
}

function parseCookies(cookieString) {
  return cookieString.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=").map(c => c.trim());
    acc[key] = value;
    return acc;
  }, {});
}

function setCookie(response, name, value) {
  const modified = new Response(response.body, response);
  modified.headers.set("Set-Cookie", `${name}=${value}; Path=/; HttpOnly`);
  return modified;
}

function redirectToLogin() {
  return redirectTo("/login");
}

function timeNow() {
  return Math.floor(Date.now() / 1000);
}

function redirectTo(path) {
  return new Response(null, {
    status: 307,
    headers: { Location: path }
  });
}

async function exchangeAuthCodeForTokens(authCode, creds) {
  const res = await fetch(creds.OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: creds.OAUTH_CLIENT_ID,
      client_secret: creds.OAUTH_CLIENT_SECRET,
      code: authCode,
      redirect_uri: creds.OAUTH_REDIRECT_URI,
      grant_type: "authorization_code"
    })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data);
  return data;
}

async function createJwtToken({ access_token, refresh_token, expires_in }, creds) {
  const exp = timeNow() + expires_in;
  return jwt.sign(
    { accessToken: access_token, refreshToken: refresh_token, exp },
    creds.OAUTH_CLIENT_SECRET
  );
}