// Debug Cloud Function - Test Environment Variables

export default async function handler(req, res) {
  console.log('[DEBUG] Environment variables check');
  
  return res.status(200).json({
    message: 'Environment Variables Debug',
    env: {
      CONTENTSTACK_API_KEY: process.env.CONTENTSTACK_API_KEY ? 'SET' : 'NOT_SET',
      CONTENTSTACK_DELIVERY_TOKEN: process.env.CONTENTSTACK_DELIVERY_TOKEN ? 'SET' : 'NOT_SET',
      CONTENTSTACK_ENVIRONMENT: process.env.CONTENTSTACK_ENVIRONMENT ? 'SET' : 'NOT_SET',
      CONTENTSTACK_REGION: process.env.CONTENTSTACK_REGION ? 'SET' : 'NOT_SET',
      OAUTH_CLIENT_ID: process.env.OAUTH_CLIENT_ID ? 'SET' : 'NOT_SET',
      OAUTH_CLIENT_SECRET: process.env.OAUTH_CLIENT_SECRET ? 'SET' : 'NOT_SET',
      OAUTH_REDIRECT_URI: process.env.OAUTH_REDIRECT_URI ? 'SET' : 'NOT_SET',
      OAUTH_TOKEN_URL: process.env.OAUTH_TOKEN_URL ? 'SET' : 'NOT_SET',
      GITHUB_TOKEN: process.env.GITHUB_TOKEN ? 'SET' : 'NOT_SET',
      GITHUB_OWNER: process.env.GITHUB_OWNER ? 'SET' : 'NOT_SET',
      GITHUB_REPO: process.env.GITHUB_REPO ? 'SET' : 'NOT_SET',
      GITHUB_BRANCH: process.env.GITHUB_BRANCH ? 'SET' : 'NOT_SET',
    }
  });
}
