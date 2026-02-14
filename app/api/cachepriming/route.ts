import { NextRequest, NextResponse } from 'next/server';

// Next.js API Route - Cache Priming Webhook Handler
// Receives webhook from Contentstack Automate and updates GitHub repository

export async function POST(request: NextRequest) {
  console.log('[CACHE PRIMING] Request received');

  try {
    // Parse request body
    const body = await request.json();
    const { urls } = body;

    console.log('[CACHE PRIMING] Request body:', body);

    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json(
        { error: 'Invalid request: urls array required' },
        { status: 400 }
      );
    }

    console.log('[CACHE PRIMING] Received raw URLs:', urls);

    // Parse URLs from the format: ["<p>/ /blog/latest /blog/ai</p>"]
    let parsedUrls: string[] = [];
    
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
      return NextResponse.json(
        { error: 'No valid URLs provided' },
        { status: 400 }
      );
    }

    const validUrls = parsedUrls;

    // Get GitHub credentials from environment variables
    const githubToken = process.env.GITHUB_TOKEN;
    const githubOwner = process.env.GITHUB_OWNER;
    const githubRepo = process.env.GITHUB_REPO;
    const githubBranch = process.env.GITHUB_BRANCH || 'main';

    console.log('[CACHE PRIMING] Environment check:', {
      hasToken: !!githubToken,
      hasOwner: !!githubOwner,
      hasRepo: !!githubRepo,
      branch: githubBranch
    });

    if (!githubToken || !githubOwner || !githubRepo) {
      return NextResponse.json(
        { error: 'Missing GitHub configuration in environment variables' },
        { status: 500 }
      );
    }

    const filePath = 'launch.json';

    // Step 1: Get current launch.json from GitHub
    const getFileUrl = `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${filePath}?ref=${githubBranch}`;
    
    const getResponse = await fetch(getFileUrl, {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Contentstack-Cache-Priming'
      }
    });

    if (!getResponse.ok) {
      throw new Error(`Failed to fetch launch.json: ${getResponse.status}`);
    }

    const fileData = await getResponse.json();
    
    // Decode base64 content
    const currentContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
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
        'User-Agent': 'Contentstack-Cache-Priming'
      },
      body: JSON.stringify({
        message: `chore: update cache priming URLs via Contentstack Automate\n\nURLs: ${validUrls.join(', ')}`,
        content: Buffer.from(updatedContent).toString('base64'),
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
    return NextResponse.json({
      success: true,
      message: 'Cache priming URLs updated successfully',
      urls: validUrls,
      commit: commitData.commit.sha,
      commitUrl: commitData.commit.html_url
    });

  } catch (error) {
    console.error('[CACHE PRIMING] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update cache priming URLs',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
