import jwt from '@tsndr/cloudflare-worker-jwt';

export default async function handler(request, context) {
  // ============================================
  // IP WHITELISTING - Check before any other logic
  // ============================================
  
  // Define whitelisted IPs (add your device IP here)
  if (request.url.includes('/editor-dashboard')) {
  const allowedIPs = [
    "127.0.0.1",           // Localhost IPv4
    "::1",                 // Localhost IPv6
    "154.84.245.58",       // Your local network IP (from terminal output)
    "27.107.90.206",       
  ];
  
  // Get the client's IP address from headers
  const clientIP = request.headers.get("x-forwarded-for") || "";
  
  const clientIPList = clientIP.split(",").map(ip => ip.trim());
  
  // Check if any forwarded IP is in the allowed list
  const allowed = clientIPList.some(ip => allowedIPs.includes(ip)) || 
                  allowedIPs.includes(clientIPList[0]); // Check first IP in chain
  
  console.log("Access allowed:", allowed, "- IP:", clientIPList[0]);
  
  if (!allowed) {
    console.log("Access denied - IP not in whitelist:", clientIPList[0]);
    return new Response(
      JSON.stringify({
        error: "Forbidden",
        message: "Your IP address is not in the whitelist.",
        your_ip: clientIPList[0],
        timestamp: new Date().toISOString()
      }), 
      { 
        status: 403,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
  return fetch(request);
  }

  // ============================================
  // REWRITE LOGIC - ONLY for production domain
  // ============================================
  
  // Define test/preview domains (where rewrite should NOT apply)
  const testDomains = [
    "launchassignment-preview.contentstackapps.com"
  ];
  
  // Check if this is a production domain
  const isProductionDomain = !testDomains.some(domain => hostname.includes(domain));
  
  // Rewrite /latest → /blog/latest (only on production)
  if (url.pathname === '/latest' && isProductionDomain) {
    console.log(`[Rewrite] Applying rewrite: /latest → /blog/latest on production domain: ${hostname}`);
    
    // Create new URL with rewritten path
    const rewriteUrl = new URL(request.url);
    rewriteUrl.pathname = '/blog/latest';
    
    // Fetch the rewritten URL
    return fetch(new Request(rewriteUrl, request));
  } else if (url.pathname === '/latest' && !isProductionDomain) {
    console.log(`[Rewrite] Skipping rewrite on test/preview domain: ${hostname}`);
  }
  
  // ============================================
  // OAUTH SSO AUTHENTICATION (for /author-tools)
  // ============================================
  
  const oauthCredentials = {
    OAUTH_CLIENT_ID: context.env.OAUTH_CLIENT_ID,
    OAUTH_CLIENT_SECRET: context.env.OAUTH_CLIENT_SECRET,
    OAUTH_REDIRECT_URI: context.env.OAUTH_REDIRECT_URI,
    OAUTH_TOKEN_URL: context.env.OAUTH_TOKEN_URL
  };

  const url = new URL(request.url);

  // Skip authentication for static assets
  if (request.url.includes('_next') || request.url.includes('favicon.ico')) {
    return fetch(request);
  }

  // Allow login page without authentication
  if (request.url.includes('/login')) {
    return fetch(request);
  }

  // Handle OAuth callback
  if (request.url.includes('/oauth/callback')) {
    const authCode = url.searchParams.get('code');
    if (authCode) {
      const tokens = await exchangeAuthCodeForTokens(authCode, oauthCredentials);
      const jwtToken = await createJwtToken(tokens, oauthCredentials);
      const response = redirectTo('/author-tools');
      const modifiedResponse = setCookie(response, 'jwt', jwtToken);
      return modifiedResponse;
    }
  }

  // ⭐ ONLY protect /author-tools route
  if (!request.url.includes('/author-tools')) {
    // Not a protected route → Allow access
    return fetch(request);
  }

  // /author-tools requires authentication - check for JWT token
  const cookies = parseCookies(request.headers.get('cookie') || '');
  const jwtToken = cookies['jwt'];

  if (jwtToken) {
    try {
      const verified = await jwt.verify(jwtToken, oauthCredentials.OAUTH_CLIENT_SECRET);
      if (verified) {
        // Valid token → Allow access to /author-tools
        return fetch(request);
      } else {
        const decoded = jwt.decode(jwtToken);
        if (decoded.payload.exp < timeNow()) {
          // Token expired → Try to refresh
          const newToken = await refreshJwtToken(decoded.payload.refreshToken, oauthCredentials);

          const response = await fetch(request);
          const modifiedResponse = setCookie(response, 'jwt', newToken);
          return modifiedResponse;
        }
      }
    } catch (err) {
      console.log(err);
      return redirectToLogin();
    }
  }
  
  // No valid token → Redirect to login
  return redirectToLogin();
}

function parseCookies(cookieString) {
  return cookieString.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.split('=').map(c => c.trim());
    acc[key] = value;
    return acc;
  }, {});
}

function setCookie(response, name, value) {
  const modifiedResponse = new Response(response.body, response);
  modifiedResponse.headers.set('Set-Cookie', `${name}=${value}; Path=/; HttpOnly`);
  return modifiedResponse;
}

function redirectToLogin() {
  return redirectTo('/login');
}

function timeNow() {
  return Math.floor(Date.now() / 1000);
}

function redirectTo(path) {
  const response = new Response(undefined, {
    status: 307,
    headers: {
      'Location': path
    }
  });
  return response;
}

async function exchangeAuthCodeForTokens(authCode, oauthCredentials) {
  const response = await fetch(oauthCredentials.OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: oauthCredentials.OAUTH_CLIENT_ID,
      client_secret: oauthCredentials.OAUTH_CLIENT_SECRET,
      code: authCode,
      redirect_uri: oauthCredentials.OAUTH_REDIRECT_URI,
      grant_type: 'authorization_code'
    })
  });
  const tokens = response.json();
  if (!response.ok) {
    throw new Error(tokens);
  }

  return tokens;
}

async function createJwtToken({ access_token, refresh_token, expires_in }, oauthCredentials) {
  const exp = timeNow() + expires_in;
  return jwt.sign({ accessToken: access_token, refreshToken: refresh_token, exp }, oauthCredentials.OAUTH_CLIENT_SECRET);
}

async function refreshJwtToken(refreshToken, oauthCredentials) {
  const response = await fetch(oauthCredentials.OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: oauthCredentials.OAUTH_CLIENT_ID,
      client_secret: oauthCredentials.OAUTH_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    })
  });
  const tokens = await response.json();
  if (!response.ok) {
    throw new Error(tokens);
  }
  return createJwtToken(tokens, oauthCredentials);
}
