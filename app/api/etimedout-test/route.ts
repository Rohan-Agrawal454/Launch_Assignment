import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  
  // These IPs are designed to cause ETIMEDOUT:
  // - 10.255.255.1: Non-routable private IP (packets get dropped)
  // - 192.0.2.1: TEST-NET-1 (RFC 5737) - reserved for documentation, packets dropped
  // - 198.51.100.1: TEST-NET-2 (RFC 5737) - reserved for documentation
  const timeoutTargets = [
    'http://10.255.255.1:81',           // Non-routable IP
    'http://192.0.2.1:80',              // TEST-NET-1 (documentation only)
    'http://198.51.100.1:80',           // TEST-NET-2 (documentation only)
    'http://203.0.113.1:80',            // TEST-NET-3 (documentation only)
    'http://240.0.0.1:80',              // Reserved IP block (Class E)
  ];
  
  const targetIndex = parseInt(url.searchParams.get('target') || '0', 10);
  const targetUrl = timeoutTargets[targetIndex] || timeoutTargets[0];
  
  console.log('='.repeat(80));
  console.log('[ETIMEDOUT TEST] Starting network request...');
  console.log('[ETIMEDOUT TEST] Target URL:', targetUrl);
  console.log('[ETIMEDOUT TEST] Timestamp:', new Date().toISOString());
  console.log('[ETIMEDOUT TEST] Available targets:');
  timeoutTargets.forEach((target, idx) => {
    console.log(`  [${idx}] ${target}`);
  });
  console.log('='.repeat(80));
  
  try {
    // No custom timeout - let it naturally timeout
    // Node.js default timeout varies but typically 2-5 minutes for connection attempts
    console.log('[ETIMEDOUT TEST] Attempting fetch (this will take a while)...');
    
    const startTime = Date.now();
    const response = await fetch(targetUrl);
    const duration = Date.now() - startTime;
    
    console.log(`[ETIMEDOUT TEST] ⚠️ Unexpected success after ${duration}ms`);
    console.log('[ETIMEDOUT TEST] Status:', response.status);
    
    return NextResponse.json({
      success: true,
      message: 'Request succeeded unexpectedly',
      target: targetUrl,
      status: response.status,
      duration_ms: duration
    });
    
  } catch (err: any) {
    const duration = Date.now() - Date.now();
    
    console.log('='.repeat(80));
    console.log('[ETIMEDOUT TEST] ❌ ERROR CAUGHT!');
    console.log('[ETIMEDOUT TEST] Error Type:', err?.constructor?.name || 'Unknown');
    console.log('[ETIMEDOUT TEST] Error Name:', err?.name || 'N/A');
    console.log('[ETIMEDOUT TEST] Error Message:', err?.message || 'N/A');
    console.log('[ETIMEDOUT TEST] Error Code:', err?.code || 'N/A');
    console.log('[ETIMEDOUT TEST] Error Cause:', err?.cause || 'N/A');
    console.log('[ETIMEDOUT TEST] Full Error Object:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    console.log('='.repeat(80));
    
    // Check if it's the specific error we're looking for
    const isEtimeout = err?.code === 'ETIMEDOUT' || 
                       err?.cause?.code === 'ETIMEDOUT' ||
                       (err?.cause instanceof AggregateError);
    
    if (isEtimeout) {
      console.log('✅ SUCCESS! ETIMEDOUT error reproduced!');
    }
    
    return NextResponse.json({
      success: false,
      error_reproduced: isEtimeout,
      error: {
        type: err?.constructor?.name || 'Unknown',
        name: err?.name || 'N/A',
        message: err?.message || 'N/A',
        code: err?.code || 'N/A',
        cause: err?.cause ? {
          name: err.cause?.constructor?.name,
          code: err.cause?.code,
          message: err.cause?.message,
          errors: err.cause?.errors || []
        } : 'N/A'
      },
      target: targetUrl,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const customTarget = body.target;
  const timeout = body.timeout || 10000; // 10 second timeout for POST
  
  console.log('='.repeat(80));
  console.log('[ETIMEDOUT TEST] POST - Starting network request...');
  console.log('[ETIMEDOUT TEST] POST - Custom target:', customTarget);
  console.log('[ETIMEDOUT TEST] POST - Timeout:', timeout, 'ms');
  console.log('='.repeat(80));
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('[ETIMEDOUT TEST] POST - Aborting due to timeout...');
      controller.abort();
    }, timeout);
    
    const startTime = Date.now();
    const response = await fetch(customTarget, {
      method: 'POST',
      signal: controller.signal,
      headers: body.headers || { 'Content-Type': 'application/json' },
      body: body.data ? JSON.stringify(body.data) : undefined
    });
    
    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;
    
    console.log(`[ETIMEDOUT TEST] POST - Unexpected success after ${duration}ms`);
    
    return NextResponse.json({
      success: true,
      message: 'POST request succeeded unexpectedly',
      target: customTarget,
      status: response.status,
      duration_ms: duration
    });
    
  } catch (err: any) {
    console.log('='.repeat(80));
    console.log('[ETIMEDOUT TEST] POST - ❌ ERROR CAUGHT!');
    console.log('[ETIMEDOUT TEST] POST - Error Type:', err?.constructor?.name);
    console.log('[ETIMEDOUT TEST] POST - Error Name:', err?.name);
    console.log('[ETIMEDOUT TEST] POST - Error Message:', err?.message);
    console.log('[ETIMEDOUT TEST] POST - Error Code:', err?.code);
    console.log('[ETIMEDOUT TEST] POST - Error Cause:', err?.cause);
    console.log('='.repeat(80));
    
    const isEtimeout = err?.code === 'ETIMEDOUT' || 
                       err?.cause?.code === 'ETIMEDOUT' ||
                       (err?.cause instanceof AggregateError);
    
    if (isEtimeout) {
      console.log('✅ SUCCESS! ETIMEDOUT error reproduced via POST!');
    }
    
    return NextResponse.json({
      success: false,
      error_reproduced: isEtimeout,
      error: {
        type: err?.constructor?.name || 'Unknown',
        name: err?.name || 'N/A',
        message: err?.message || 'N/A',
        code: err?.code || 'N/A',
        cause: err?.cause ? {
          name: err.cause?.constructor?.name,
          code: err.cause?.code,
          message: err.cause?.message
        } : 'N/A'
      },
      target: customTarget,
      received_body: body,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
