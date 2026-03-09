import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const delay = parseInt(url.searchParams.get('delay') || '65000', 10);
  
  console.log(`[TIMEOUT TEST] Starting ${delay}ms delay...`);
  
  try {
    await new Promise(resolve => setTimeout(resolve, delay));
    
    console.log(`[TIMEOUT TEST] Delay completed successfully after ${delay}ms`);
    
    return NextResponse.json({
      success: true,
      message: 'Task completed successfully',
      delayed_for_ms: delay,
      timestamp: new Date().toISOString()
    }, { status: 200 });
    
  } catch (error) {
    console.error('[TIMEOUT TEST] Error occurred:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Task failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const delay = body.delay || 65000;
  
  console.log(`[TIMEOUT TEST] POST request - Starting ${delay}ms delay...`);
  
  try {
    await new Promise(resolve => setTimeout(resolve, delay));
    
    console.log(`[TIMEOUT TEST] POST delay completed successfully after ${delay}ms`);
    
    return NextResponse.json({
      success: true,
      message: 'Task completed successfully',
      delayed_for_ms: delay,
      timestamp: new Date().toISOString(),
      received_data: body
    }, { status: 200 });
    
  } catch (error) {
    console.error('[TIMEOUT TEST] POST Error occurred:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Task failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
