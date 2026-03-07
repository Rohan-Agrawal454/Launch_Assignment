import { NextRequest, NextResponse } from 'next/server';
import http from 'http';
import https from 'https';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  
  // Targets that cause real ETIMEDOUT errors
  const timeoutTargets = [
    { url: 'http://10.255.255.1:81', protocol: 'http' },
    { url: 'http://192.0.2.1:80', protocol: 'http' },
    { url: 'https://192.0.2.1:443', protocol: 'https' },
  ];
  
  const targetIndex = parseInt(url.searchParams.get('target') || '0', 10);
  const target = timeoutTargets[targetIndex] || timeoutTargets[0];
  const customTimeout = parseInt(url.searchParams.get('timeout') || '5000', 10);
  
  console.log('='.repeat(80));
  console.log('[REAL ETIMEDOUT TEST] Starting HTTP request with native module...');
  console.log('[REAL ETIMEDOUT TEST] Target:', target.url);
  console.log('[REAL ETIMEDOUT TEST] Protocol:', target.protocol);
  console.log('[REAL ETIMEDOUT TEST] Timeout:', customTimeout, 'ms');
  console.log('[REAL ETIMEDOUT TEST] Timestamp:', new Date().toISOString());
  console.log('='.repeat(80));
  
  return new Promise((resolve) => {
    const parsedUrl = new URL(target.url);
    const httpModule = target.protocol === 'https' ? https : http;
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (target.protocol === 'https' ? 443 : 80),
      path: parsedUrl.pathname || '/',
      method: 'GET',
      timeout: customTimeout,
    };
    
    console.log('[REAL ETIMEDOUT TEST] Request options:', options);
    
    const req = httpModule.request(options, (res) => {
      console.log('[REAL ETIMEDOUT TEST] ⚠️ Unexpected response received!');
      console.log('[REAL ETIMEDOUT TEST] Status:', res.statusCode);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(NextResponse.json({
          success: true,
          message: 'Request succeeded unexpectedly',
          target: target.url,
          status: res.statusCode,
          data: data.substring(0, 500)
        }));
      });
    });
    
    // Handle socket timeout
    req.on('timeout', () => {
      console.log('='.repeat(80));
      console.log('[REAL ETIMEDOUT TEST] ⏰ Socket TIMEOUT event fired!');
      console.log('[REAL ETIMEDOUT TEST] Destroying socket...');
      console.log('='.repeat(80));
      req.destroy();
    });
    
    // Handle errors - THIS IS WHERE ETIMEDOUT APPEARS
    req.on('error', (err: any) => {
      console.log('='.repeat(80));
      console.log('[REAL ETIMEDOUT TEST] ❌ ERROR CAUGHT!');
      console.log('[REAL ETIMEDOUT TEST] Error Type:', err?.constructor?.name || 'Unknown');
      console.log('[REAL ETIMEDOUT TEST] Error Name:', err?.name || 'N/A');
      console.log('[REAL ETIMEDOUT TEST] Error Message:', err?.message || 'N/A');
      console.log('[REAL ETIMEDOUT TEST] Error Code:', err?.code || 'N/A');
      console.log('[REAL ETIMEDOUT TEST] Error Errno:', err?.errno || 'N/A');
      console.log('[REAL ETIMEDOUT TEST] Error Syscall:', err?.syscall || 'N/A');
      console.log('[REAL ETIMEDOUT TEST] Error Address:', err?.address || 'N/A');
      console.log('[REAL ETIMEDOUT TEST] Error Port:', err?.port || 'N/A');
      console.log('[REAL ETIMEDOUT TEST] Full Error:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
      console.log('='.repeat(80));
      
      const isEtimeout = err?.code === 'ETIMEDOUT';
      
      if (isEtimeout) {
        console.log('✅ ✅ ✅ SUCCESS! ETIMEDOUT ERROR REPRODUCED! ✅ ✅ ✅');
      }
      
      resolve(NextResponse.json({
        success: false,
        error_reproduced: isEtimeout,
        error: {
          type: err?.constructor?.name || 'Unknown',
          name: err?.name || 'N/A',
          message: err?.message || 'N/A',
          code: err?.code || 'N/A',
          errno: err?.errno || 'N/A',
          syscall: err?.syscall || 'N/A',
          address: err?.address || 'N/A',
          port: err?.port || 'N/A',
        },
        target: target.url,
        timestamp: new Date().toISOString()
      }, { status: 500 }));
    });
    
    console.log('[REAL ETIMEDOUT TEST] Sending request...');
    req.end();
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const targetUrl = body.target || 'http://10.255.255.1:81';
  const customTimeout = body.timeout || 5000;
  
  console.log('='.repeat(80));
  console.log('[REAL ETIMEDOUT TEST] POST - Starting HTTP request...');
  console.log('[REAL ETIMEDOUT TEST] POST - Target:', targetUrl);
  console.log('[REAL ETIMEDOUT TEST] POST - Timeout:', customTimeout, 'ms');
  console.log('='.repeat(80));
  
  return new Promise((resolve) => {
    const parsedUrl = new URL(targetUrl);
    const httpModule = parsedUrl.protocol === 'https:' ? https : http;
    
    const postData = JSON.stringify(body.data || { test: 'data' });
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname || '/',
      method: 'POST',
      timeout: customTimeout,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...body.headers
      }
    };
    
    const req = httpModule.request(options, (res) => {
      console.log('[REAL ETIMEDOUT TEST] POST - Response received:', res.statusCode);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(NextResponse.json({
          success: true,
          message: 'POST request succeeded unexpectedly',
          target: targetUrl,
          status: res.statusCode
        }));
      });
    });
    
    req.on('timeout', () => {
      console.log('[REAL ETIMEDOUT TEST] POST - Socket timeout! Destroying...');
      req.destroy();
    });
    
    req.on('error', (err: any) => {
      console.log('='.repeat(80));
      console.log('[REAL ETIMEDOUT TEST] POST - ❌ ERROR CAUGHT!');
      console.log('[REAL ETIMEDOUT TEST] POST - Error Code:', err?.code);
      console.log('[REAL ETIMEDOUT TEST] POST - Error Message:', err?.message);
      console.log('[REAL ETIMEDOUT TEST] POST - Full Error:', err);
      console.log('='.repeat(80));
      
      const isEtimeout = err?.code === 'ETIMEDOUT';
      
      if (isEtimeout) {
        console.log('✅ SUCCESS! ETIMEDOUT ERROR REPRODUCED VIA POST!');
      }
      
      resolve(NextResponse.json({
        success: false,
        error_reproduced: isEtimeout,
        error: {
          type: err?.constructor?.name || 'Unknown',
          name: err?.name || 'N/A',
          message: err?.message || 'N/A',
          code: err?.code || 'N/A',
          syscall: err?.syscall || 'N/A'
        },
        target: targetUrl,
        timestamp: new Date().toISOString()
      }, { status: 500 }));
    });
    
    req.write(postData);
    req.end();
  });
}
