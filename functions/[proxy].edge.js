import jwt from '@tsndr/cloudflare-worker-jwt';

export default async function handler(request, context) {

  const url = new URL(request.url);
  const hostname = url.hostname;
  const pathname = url.pathname;

  // ============================================
  // SMART CACHING POLICY (TOP LEVEL)
  // ============================================

  let cacheControl = null;

  if (pathname === "/blog/latest") {
    cacheControl = "public, max-age=30, stale-while-revalidate=30";
  }
  else if (pathname.startsWith("/blog/") && pathname !== "/blog/latest" && pathname !== "/blog/generativeai") {
    cacheControl = "public, max-age=600, stale-while-revalidate=300";
  }
  else if (pathname.startsWith("/cdn-assets/")) {
    cacheControl = "public, max-age=86400";
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

  const testDomains = [
    "launchassignment-preview.contentstackapps.com"
  ];

  const isProductionDomain =
    !testDomains.some(domain => hostname.includes(domain));

  if (pathname === "/latest" && isProductionDomain) {
    const rewriteUrl = new URL(request.url);
    rewriteUrl.pathname = "/blog/latest";
    return fetchWithCache(new Request(rewriteUrl, request), cacheControl);
  }

  // ============================================
  // CDN ASSET REWRITE (/cdn-assets/logo.png)
  // ============================================

  if (pathname === "/cdn-assets/logo.png") {

    const targetImage =
      "https://images.contentstack.io/v3/assets/bltd932e43f7244d14c/blt4d63bba14a3eb134/698ad8274825d0249b494048/logo.png";

    const res = await fetch(targetImage);

    return new Response(res.body, {
      status: 200,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "image/png",
        "Cache-Control": cacheControl || "public, max-age=86400"
      }
    });
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