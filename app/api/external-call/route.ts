import { NextRequest, NextResponse } from "next/server";

let requestCounter = 0;

export async function GET(request: NextRequest) {
  requestCounter++;
  const reqId = requestCounter;
  
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('target') || 'https://jsonplaceholder.typicode.com/posts/1';
  
  console.log(`[EXT-${reqId}] 📥 START - Target: ${targetUrl}`);
  
  try {
    const startTime = Date.now();
    
    const response = await fetch(targetUrl);
    
    const duration = Date.now() - startTime;
    const data = await response.json();
    
    console.log(`[EXT-${reqId}] ✅ SUCCESS ${duration}ms (Status: ${response.status})`);
    
    return NextResponse.json({
      success: true,
      data: data,
      duration_ms: duration,
      status: response.status
    });
    
  } catch (err: any) {
    console.log(`[EXT-${reqId}] ❌ ERROR: ${err?.code} - ${err?.message}`);
    
    if (err?.code === 'ETIMEDOUT') {
      console.log(`[EXT-${reqId}] 🎯🎯🎯 ETIMEDOUT ERROR! 🎯🎯🎯`);
    }
    
    console.log(`[EXT-${reqId}] Cause:`, err?.cause);
    
    return NextResponse.json({
      success: false,
      error: err?.message,
      code: err?.code,
      cause: err?.cause
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  requestCounter++;
  const reqId = requestCounter;
  
  const body = await request.json();
  const targetUrl = body.target || 'https://jsonplaceholder.typicode.com/posts';
  
  console.log(`[EXT-${reqId}] 📥 POST START - Target: ${targetUrl}`);
  
  try {
    const startTime = Date.now();
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...body.headers
      },
      body: JSON.stringify(body.data || {})
    });
    
    const duration = Date.now() - startTime;
    const data = await response.json();
    
    console.log(`[EXT-${reqId}] ✅ POST SUCCESS ${duration}ms (Status: ${response.status})`);
    
    return NextResponse.json({
      success: true,
      data: data,
      duration_ms: duration,
      status: response.status
    });
    
  } catch (err: any) {
    console.log(`[EXT-${reqId}] ❌ POST ERROR: ${err?.code} - ${err?.message}`);
    
    if (err?.code === 'ETIMEDOUT') {
      console.log(`[EXT-${reqId}] 🎯 ETIMEDOUT ERROR IN POST!`);
    }
    
    console.log(`[EXT-${reqId}] Cause:`, err?.cause);
    
    return NextResponse.json({
      success: false,
      error: err?.message,
      code: err?.code,
      cause: err?.cause
    }, { status: 500 });
  }
}
