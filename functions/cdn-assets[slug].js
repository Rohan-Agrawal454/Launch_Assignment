// Contentstack Launch Cloud Function - CDN Asset Proxy
// Proxies assets from Contentstack Images API

export default async function handler(req, res) {
    console.log('[CDN PROXY] Slug:', req.params.slug);
    
    try {
      const slug = req.params.slug;
      
      if (!slug) {
        return res.status(400).json({ error: 'Asset slug is required' });
      }
  
      // Base URL for Contentstack asset
      const baseUrl = 'https://images.contentstack.io/v3/assets/bltd932e43f7244d14c/blt4d63bba14a3eb134';
      
      // Construct full asset URL by appending slug
      const assetUrl = `${baseUrl}/${slug}`;
      
      console.log('[CDN PROXY] Fetching from:', assetUrl);
  
      // Fetch the asset from Contentstack
      const assetResponse = await fetch(assetUrl);
  
      if (!assetResponse.ok) {
        return res.status(404).json({ error: 'Asset not found' });
      }
  
      // Get the asset data
      const assetData = await assetResponse.arrayBuffer();
      
      // Send the asset directly (rewrite/mask the URL)
      return res.status(200).send(Buffer.from(assetData));
  
    } catch (error) {
      console.error('[CDN PROXY] Error:', error);
      return res.status(500).json({ error: 'Failed to proxy asset' });
    }
  }
  