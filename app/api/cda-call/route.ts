import { NextResponse } from "next/server";

let requestCounter = 0;

export async function GET() {
  requestCounter++;
  const reqId = requestCounter;
  
  const cdaUrl = `https://cdn.contentstack.io/v3/content_types/homepage/entries`;

  const promises = Array.from({ length: 10 }, async (_, i) => {
    try {
      const response = await fetch(cdaUrl, {
        headers: {
          api_key: process.env.CONTENTSTACK_API_KEY || "",
          access_token: process.env.CONTENTSTACK_DELIVERY_TOKEN || "",
        },
      });
      
      console.log(`[CDA-${reqId}.${i + 1}] ✅`);
      return await response.json();
      
    } catch (err) {
      const error = err as { code?: string; message?: string };
      console.log(`[CDA-${reqId}.${i + 1}] ❌ ${error?.code}: ${error?.message}`);
      
      if (error?.code === 'ETIMEDOUT') {
        console.log(`[CDA-${reqId}.${i + 1}] 🎯 ETIMEDOUT ERROR!`);
      }
      
      return null;
    }
  });

  const results = await Promise.allSettled(promises);
  
  return NextResponse.json({ results });
}
