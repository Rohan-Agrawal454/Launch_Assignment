import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">AI</span>
              </div>
              <span className="text-lg font-bold">AI Blog Platform</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your source for AI insights, tutorials, and the latest innovations in artificial intelligence.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/blog/ai" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Artificial Intelligence
                </Link>
              </li>
              <li>
                <Link href="/blog/generativeai" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Generative AI
                </Link>
              </li>
              <li>
                <Link href="/blog/chatgpt" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  ChatGPT
                </Link>
              </li>
              <li>
                <Link href="/blog/gemini" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Gemini AI
                </Link>
              </li>
              <li>
                <Link href="/blog/latest" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Latest Posts
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/author-tools" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Author Tools
                </Link>
              </li>
              <li>
                <Link href="/editor-dashboard" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Editor Dashboard
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  API Reference
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Built With</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Next.js 16+</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>Contentstack CMS</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                <span>Contentstack Launch</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                <span>TypeScript</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                <span>Tailwind CSS</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} AI Blog Platform. Built with Next.js and Contentstack.
            </p>
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                Privacy Policy
              </Link>
              <Link href="/" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                Terms of Service
              </Link>
              <Link href="/" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
