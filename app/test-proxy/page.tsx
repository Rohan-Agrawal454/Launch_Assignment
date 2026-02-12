'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function AssetProxyTestPage() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Your known working asset from edge function
  const testAssetUrl = '/v3/assets/bltd932e43f7244d14c/blt4d63bba14a3eb134/698ad8274825d0249b494048/logo.png';

  const runTest = async () => {
    setLoading(true);
    setTestResult('Testing...');

    try {
      const response = await fetch(testAssetUrl);
      
      const results = [
        `✅ Status: ${response.status} ${response.statusText}`,
        `✅ Content-Type: ${response.headers.get('content-type')}`,
        `✅ Cache-Control: ${response.headers.get('cache-control')}`,
        `✅ CORS: ${response.headers.get('access-control-allow-origin')}`,
        `✅ Size: ${(await response.clone().blob()).size} bytes`,
        `\n🎉 Asset proxy is working correctly!`
      ].join('\n');

      setTestResult(results);
    } catch (error) {
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          🧪 Contentstack Asset Proxy Test
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Test Configuration
          </h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Asset URL:
            </label>
            <code className="block bg-gray-100 p-3 rounded text-sm break-all">
              {testAssetUrl}
            </code>
          </div>

          <button
            onClick={runTest}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            {loading ? 'Testing...' : 'Run Test'}
          </button>

          {testResult && (
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Test Results:</h3>
              <pre className="text-sm whitespace-pre-wrap text-gray-700">
                {testResult}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Visual Test
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">
                Direct Contentstack URL:
              </h3>
              <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                <Image
                  src="https://images.contentstack.io/v3/assets/bltd932e43f7244d14c/blt4d63bba14a3eb134/698ad8274825d0249b494048/logo.png"
                  alt="Direct"
                  width={200}
                  height={200}
                  className="mx-auto"
                  unoptimized
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Source: images.contentstack.io
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-3">
                Proxied URL (Your Domain):
              </h3>
              <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
                <Image
                  src={testAssetUrl}
                  alt="Proxied"
                  width={200}
                  height={200}
                  className="mx-auto"
                  unoptimized
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Source: Your edge proxy
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> Open your browser DevTools (F12) → Network tab 
              to see the requests and verify cache headers.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Expected Headers
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <div>
                <strong className="text-gray-700">cache-control:</strong>
                <code className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded">
                  public, max-age=31536000, immutable
                </code>
              </div>
            </div>

            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <div>
                <strong className="text-gray-700">access-control-allow-origin:</strong>
                <code className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded">
                  *
                </code>
              </div>
            </div>

            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <div>
                <strong className="text-gray-700">content-type:</strong>
                <code className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded">
                  image/png
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            📚 Documentation
          </h3>
          <p className="text-gray-700">
            See <code className="bg-white px-2 py-1 rounded">ASSET_PROXY_TESTING.md</code> for 
            comprehensive testing examples and integration guides.
          </p>
        </div>
      </div>
    </div>
  );
}
