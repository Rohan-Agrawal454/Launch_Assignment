'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/blog/ai', label: 'AI' },
    { href: '/blog/generativeai', label: 'Generative AI' },
    { href: '/blog/chatgpt', label: 'ChatGPT' },
    { href: '/blog/gemini', label: 'Gemini' },
    { href: '/blog/latest', label: 'Latest' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 flex items-center justify-center">
              <span className="text-white text-xl font-bold">AI</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
              AI Blog Platform
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 group ${
                  isActive(link.href)
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                {isActive(link.href) && (
                  <span className="absolute inset-0 bg-blue-50 rounded-lg animate-fade-in"></span>
                )}
                {!isActive(link.href) && (
                  <span className="absolute inset-0 bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Right Section - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/author-tools"
              className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-all duration-300"
            >
              Author Tools
            </Link>
            <Link
              href="/editor-dashboard"
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              Editor Dashboard
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  isActive(link.href)
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-3 border-t border-gray-200 space-y-2">
              <Link
                href="/author-tools"
                className="block px-4 py-3 text-gray-700 hover:bg-gray-100 font-medium rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                ✍️ Author Tools
              </Link>
              <Link
                href="/editor-dashboard"
                className="block px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-md text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                📊 Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
