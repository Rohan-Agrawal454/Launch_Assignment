import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('target') || 'http://10.255.255.1:81';
  const timeout = parseInt(url.searchParams.get('timeout') || '5000', 10);
  
  console.log(`[NETWORK ERROR TEST] Attempting to fetch: ${targetUrl}`);
  console.log(`[NETWORK ERROR TEST] Timeout set to: ${timeout}ms`);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(targetUrl, {
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    console.log(`[NETWORK ERROR TEST] Unexpected success - Status: ${response.status}`);
    
    return NextResponse.json({
      success: true,
      message: 'Request succeeded unexpectedly',
      status: response.status,
      target: targetUrl
    });
    
  } catch (err) {
    console.error('[NETWORK ERROR TEST] Error caught:');
    console.error('[NETWORK ERROR TEST] Error name:', err instanceof Error ? err.name : 'Unknown');
    console.error('[NETWORK ERROR TEST] Error message:', err instanceof Error ? err.message : String(err));
    console.error('[NETWORK ERROR TEST] Full error:', err);
    
    const errorDetails = {
      name: err instanceof Error ? err.name : 'Unknown',
      message: err instanceof Error ? err.message : String(err),
      code: (err as any).code || 'N/A',
      cause: (err as any).cause || 'N/A'
    };
    
    return NextResponse.json({
      success: false,
      error: 'Network request failed',
      target: targetUrl,
      details: errorDetails,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const targetUrl = body.target || 'http://10.255.255.1:81';
  const timeout = body.timeout || 5000;
  
  console.log(`[NETWORK ERROR TEST] POST - Attempting to fetch: ${targetUrl}`);
  console.log(`[NETWORK ERROR TEST] POST - Request body:`, body);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      signal: controller.signal,
      headers: body.headers || {},
      body: body.data ? JSON.stringify(body.data) : undefined
    });
    
    clearTimeout(timeoutId);
    
    console.log(`[NETWORK ERROR TEST] POST - Unexpected success - Status: ${response.status}`);
    
    return NextResponse.json({
      success: true,
      message: 'POST request succeeded unexpectedly',
      status: response.status,
      target: targetUrl
    });
    
  } catch (err) {
    console.error('[NETWORK ERROR TEST] POST - Error caught:');
    console.error('[NETWORK ERROR TEST] POST - Error name:', err instanceof Error ? err.name : 'Unknown');
    console.error('[NETWORK ERROR TEST] POST - Error message:', err instanceof Error ? err.message : String(err));
    console.error('[NETWORK ERROR TEST] POST - Full error:', err);
    
    const errorDetails = {
      name: err instanceof Error ? err.name : 'Unknown',
      message: err instanceof Error ? err.message : String(err),
      code: (err as any).code || 'N/A',
      cause: (err as any).cause || 'N/A'
    };
    
    return NextResponse.json({
      success: false,
      error: 'Network POST request failed',
      target: targetUrl,
      details: errorDetails,
      received_body: body,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}


