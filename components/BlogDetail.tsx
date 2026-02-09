import Link from 'next/link';

interface BlogDetailProps {
  title: string;
  category: string;
  date: string;
  author?: string;
  readTime?: string;
  content: string;
  tags?: string[];
  relatedPosts?: Array<{
    title: string;
    excerpt: string;
    href: string;
  }>;
}

export default function BlogDetail({
  title,
  category,
  date,
  author = "AI Blog Team",
  readTime = "5 min read",
  content,
  tags = [],
  relatedPosts = [],
}: BlogDetailProps) {
  const categoryColors: Record<string, string> = {
    AI: "bg-blue-100 text-blue-800",
    "Generative AI": "bg-purple-100 text-purple-800",
    ChatGPT: "bg-green-100 text-green-800",
    Gemini: "bg-orange-100 text-orange-800",
  };

  const categoryColor = categoryColors[category] || "bg-gray-100 text-gray-800";

  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${categoryColor}`}>
            {category}
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600 text-sm">{readTime}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {title}
        </h1>

        <div className="flex items-center space-x-4 text-gray-600 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {author.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{author}</p>
              <p className="text-gray-500">{date}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image Placeholder */}
      <div className="mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤖</div>
          <p className="text-gray-600 font-medium">Featured Image</p>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none mb-12">
        <div className="text-gray-700 leading-relaxed space-y-6">
          {content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-lg">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mb-12 pb-8 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {relatedPosts.map((post, index) => (
              <Link
                key={index}
                href={post.href}
                className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h4>
                <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
                <div className="mt-4 text-blue-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read article <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Want to stay updated?
        </h3>
        <p className="text-gray-600 mb-6">
          Subscribe to our newsletter for the latest AI insights and updates.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
            Subscribe
          </button>
        </div>
      </div>
    </article>
  );
}
