import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to AI Blog Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your premier destination for the latest insights, tutorials, and news about artificial intelligence, 
            machine learning, and emerging AI technologies.
          </p>
          <div className="flex gap-4 justify-center">
            <a 
              href="/blog/latest" 
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Explore Latest Articles
            </a>
            <a 
              href="/author-tools" 
              className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg border-2 border-gray-200 transition-colors"
            >
              Author Tools
            </a>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <a href="/blog/ai" className="group animate-fade-in">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-blue-100">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Artificial Intelligence</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Explore AI fundamentals, applications, and innovations</p>
              <div className="mt-4 text-blue-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                Explore <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          </a>

          <a href="/blog/generativeai" className="group animate-fade-in" style={{animationDelay: '0.1s'}}>
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-purple-100">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">Generative AI</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Discover LLMs, image generation, and creative AI</p>
              <div className="mt-4 text-purple-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                Explore <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          </a>

          <a href="/blog/chatgpt" className="group animate-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-green-100">
              <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">ChatGPT</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Master ChatGPT usage and prompt engineering</p>
              <div className="mt-4 text-green-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                Explore <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          </a>

          <a href="/blog/gemini" className="group animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-orange-100">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
                <span className="text-3xl">🔷</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">Gemini AI</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Learn about Google&apos;s multimodal AI model</p>
              <div className="mt-4 text-orange-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                Explore <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          </a>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Platform Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">High Performance</h3>
              <p className="text-gray-600">Optimized with SSG, ISR, and SSR for blazing-fast load times</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Management</h3>
              <p className="text-gray-600">Powered by Contentstack CMS for seamless content delivery</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Edge & Cloud Functions</h3>
              <p className="text-gray-600">Leveraging Contentstack Launch for advanced deployments</p>
            </div>
          </div>
        </div>

        {/* Tools Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <a href="/author-tools" className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-8 text-white hover:shadow-2xl transition-shadow">
            <h3 className="text-2xl font-bold mb-2">Author Tools</h3>
            <p className="mb-4 opacity-90">Access writing resources, manage drafts, and track your content performance</p>
            <span className="text-blue-100 font-medium">Explore Tools →</span>
          </a>

          <a href="/editor-dashboard" className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-8 text-white hover:shadow-2xl transition-shadow">
            <h3 className="text-2xl font-bold mb-2">Editor Dashboard</h3>
            <p className="mb-4 opacity-90">Review submissions, manage publications, and oversee content quality</p>
            <span className="text-purple-100 font-medium">Open Dashboard →</span>
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
