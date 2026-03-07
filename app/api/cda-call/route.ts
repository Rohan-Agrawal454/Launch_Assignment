import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const cdaUrl = `https://cdn.contentstack.io/v3/content_types/homepage/entries?environment=dev`;
  
  console.log('[CDA CALL] Fetching from CMS...');
  
  try {
    const data = await fetch(cdaUrl, {
      headers: {
        'api_key': process.env.CONTENTSTACK_API_KEY || '',
        'access_token': process.env.CONTENTSTACK_DELIVERY_TOKEN || ''
      }
    });
    
    console.log('[CDA CALL] ✅ Success');
    const json = await data.json();
    
    return NextResponse.json(json);
    
  } catch (err: any) {
    console.log('[CDA CALL] ❌ ERROR:');
    console.log('[CDA CALL] Error Message:', err?.message);
    console.log('[CDA CALL] Error Code:', err?.code);
    console.log('[CDA CALL] Error Cause:', err?.cause);
    console.log('[CDA CALL] Full Error:', err);
    
    return NextResponse.json({
      error: err?.message,
      code: err?.code,
      cause: err?.cause
    }, { status: 500 });
  }
}
