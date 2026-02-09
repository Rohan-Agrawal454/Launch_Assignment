import type { Metadata } from "next";
import RenderingBadge from "@/components/RenderingBadge";

export const metadata: Metadata = {
  title: "Gemini AI | AI Blog Platform",
  description: "Explore articles about Google's Gemini AI and multimodal models",
};

// Static Site Generation (SSG) - Evergreen content
export default async function GeminiPage() {
  // TODO: Fetch content from Contentstack
  const posts = [
    {
      id: 1,
      title: "Introducing Google Gemini",
      excerpt: "An overview of Google's latest multimodal AI",
      date: "2026-02-07",
      slug: "introducing-gemini"
    },
    {
      id: 2,
      title: "Gemini vs Other AI Models",
      excerpt: "Comparing capabilities and use cases",
      date: "2026-02-04",
      slug: "gemini-comparison"
    },
    {
      id: 3,
      title: "Building with Gemini API",
      excerpt: "A developer's guide to integrating Gemini",
      date: "2026-01-31",
      slug: "building-with-gemini"
    }
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Gemini AI</h1>
      <p className="text-lg text-gray-600 mb-8">
        Discover the power of Google Gemini and explore multimodal AI capabilities.
      </p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article 
            key={post.id} 
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-orange-100 group"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
              {post.title}
            </h2>
            <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <time className="text-sm text-gray-500">{post.date}</time>
              <a 
                href={`/blog/gemini/${post.slug}`}
                className="text-orange-600 hover:text-orange-800 font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
              >
                Read more <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
          </article>
        ))}
      </div>

      <RenderingBadge strategy="SSG" />
    </div>
  );
}
