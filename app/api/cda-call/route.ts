import { NextResponse } from "next/server";
import { getHomepage } from "@/lib/contentstack";

let requestCounter = 0;

export async function GET() {
  requestCounter++;
  const reqId = requestCounter;

  console.log(`[SDK-${reqId}] Making 10 concurrent SDK calls...`);

  const promises = Array.from({ length: 10 }, async (_, i) => {
    try {
      const homepage = await getHomepage('en-us');
      
      console.log(`[SDK-${reqId}.${i + 1}] ✅`);
      return homepage;
      
    } catch (err) {
      const error = err as { code?: string; message?: string };
      console.log(`[SDK-${reqId}.${i + 1}] ❌ ${error?.code}: ${error?.message}`);
      
      if (error?.code === 'ETIMEDOUT') {
        console.log(`[SDK-${reqId}.${i + 1}] 🎯 ETIMEDOUT ERROR!`);
      }
      
      return null;
    }
  });

  const results = await Promise.allSettled(promises);
  
  return NextResponse.json({ results });
}
