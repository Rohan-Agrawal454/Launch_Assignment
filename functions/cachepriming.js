// Contentstack Launch Cloud Function
// Receives webhook from Contentstack Automate and updates GitHub repository

export default async function handler(request, context) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }), 
      { 
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    // Parse request body
    const body = await request.json();
    const { urls } = body;

    if (!urls || !Array.isArray(urls)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: urls array required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('[CACHE PRIMING] Received raw URLs:', urls);

    // Parse URLs from the format: ["<p>/ /blog/latest /blog/ai</p>"]
    let parsedUrls = [];
    
    if (urls.length > 0 && typeof urls[0] === 'string') {
      // Remove HTML tags (e.g., <p>, </p>)
      const cleanedString = urls[0].replace(/<[^>]*>/g, '').trim();
      
      console.log('[CACHE PRIMING] Cleaned string:', cleanedString);
      
      // Split by whitespace and filter valid paths
      parsedUrls = cleanedString
        .split(/\s+/)
        .map(url => url.trim())
        .filter(url => url.length > 0 && url.startsWith('/'));
    }

    console.log('[CACHE PRIMING] Parsed URLs:', parsedUrls);

    if (parsedUrls.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid URLs provided' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const validUrls = parsedUrls;

    // Get GitHub credentials from environment
    const githubToken = context.env.GITHUB_TOKEN;
    const githubOwner = context.env.GITHUB_OWNER;
    const githubRepo = context.env.GITHUB_REPO;
    const githubBranch = context.env.GITHUB_BRANCH || 'main';

    if (!githubToken || !githubOwner || !githubRepo) {
      throw new Error('Missing GitHub configuration in environment variables');
    }

    const filePath = 'launch.json';

    // Step 1: Get current launch.json from GitHub
    const getFileUrl = `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${filePath}?ref=${githubBranch}`;
    
    const getResponse = await fetch(getFileUrl, {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Contentstack-Launch-Function'
      }
    });

    if (!getResponse.ok) {
      throw new Error(`Failed to fetch launch.json: ${getResponse.status}`);
    }

    const fileData = await getResponse.json();
    
    // Decode base64 content
    const currentContent = atob(fileData.content);
    const launchConfig = JSON.parse(currentContent);

    // Step 2: Update cache priming URLs
    if (!launchConfig.cache) {
      launchConfig.cache = {};
    }
    if (!launchConfig.cache.cachePriming) {
      launchConfig.cache.cachePriming = {};
    }
    launchConfig.cache.cachePriming.urls = validUrls;

    // Convert back to JSON with formatting
    const updatedContent = JSON.stringify(launchConfig, null, 2);

    // Step 3: Commit updated file to GitHub
    const updateFileUrl = `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${filePath}`;
    
    const updateResponse = await fetch(updateFileUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Contentstack-Launch-Function'
      },
      body: JSON.stringify({
        message: `chore: update cache priming URLs via Contentstack Automate\n\nURLs: ${validUrls.join(', ')}`,
        content: btoa(updatedContent),
        sha: fileData.sha,
        branch: githubBranch
      })
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      throw new Error(`Failed to update launch.json: ${JSON.stringify(errorData)}`);
    }

    const commitData = await updateResponse.json();

    console.log('[CACHE PRIMING] Successfully updated launch.json');
    console.log('[CACHE PRIMING] Commit SHA:', commitData.commit.sha);

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Cache priming URLs updated successfully',
        urls: validUrls,
        commit: commitData.commit.sha,
        commitUrl: commitData.commit.html_url
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('[CACHE PRIMING] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to update cache priming URLs',
        details: error.message 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
