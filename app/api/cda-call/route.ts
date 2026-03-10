import { NextRequest, NextResponse } from "next/server";

let requestCounter = 0;

export async function GET(request: NextRequest) {
  requestCounter++;
  const reqId = requestCounter;
  
  const cdaUrl = `https://cdn.contentstack.io/v3/content_types/homepage/entries`;
  const fetchCount = 10;

  const results = {
    successful: 0,
    failed: 0,
    etimedout: 0,
    errors: []
  };

  const fetchPromises = Array.from({ length: fetchCount }, async (_, i) => {
    const subReqId = `${reqId}.${i + 1}`;
    
    try {
      const startTime = Date.now();
      
      const data = await fetch(cdaUrl, {
        headers: {
          api_key: process.env.CONTENTSTACK_API_KEY || "",
          access_token: process.env.CONTENTSTACK_DELIVERY_TOKEN || "",
        },
      });

      const duration = Date.now() - startTime;
      const json = await data.json();
      
      results.successful++;
      console.log(`[CDA-${subReqId}] ✅ ${duration}ms`);
      
      return { id: subReqId, status: 'success', duration, data: json };
      
    } catch (err: any) {
      results.failed++;
      
      const isEtimeout = err?.code === 'ETIMEDOUT';
      if (isEtimeout) {
        results.etimedout++;
        console.log(`[CDA-${subReqId}] 🎯 ETIMEDOUT ERROR!`);
      } else {
        console.log(`[CDA-${subReqId}] ❌ ${err?.code}`);
      }
      
      results.errors.push({
        id: subReqId,
        code: err?.code,
        message: err?.message
      });
      
      return { id: subReqId, status: 'error', error: err?.code };
    }
  });

  const allResults = await Promise.allSettled(fetchPromises);

  return NextResponse.json({
    success: results.failed === 0,
    summary: results,
    results: allResults.map(r => r.status === 'fulfilled' ? r.value : { status: 'rejected' })
  });
}
