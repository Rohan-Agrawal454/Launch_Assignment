// Debug Cloud Function - Test Environment Variables

export default async function handler(req, res) {
  console.log('[DEBUG] Environment variables check');
  
  return res.status(200).json({
    message: 'Environment Variables Debug',
    env: {
      GITHUB_TOKEN: process.env.GITHUB_TOKEN || 'NOT_SET',
      GITHUB_OWNER: process.env.GITHUB_OWNER || 'NOT_SET',
      GITHUB_REPO: process.env.GITHUB_REPO || 'NOT_SET',
      GITHUB_BRANCH: process.env.GITHUB_BRANCH || 'NOT_SET',
      NODE_ENV: process.env.NODE_ENV || 'NOT_SET',
    }
  });
}
