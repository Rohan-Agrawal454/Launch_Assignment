import type { Metadata } from "next";
import RenderingBadge from "@/components/RenderingBadge";
import BlogCard from "@/components/BlogCard";

export const metadata: Metadata = {
  title: "Latest AI Articles | AI Blog Platform",
  description: "The latest and trending articles on AI, ML, and emerging technologies",
};

// Incremental Static Regeneration (ISR) - Revalidate every 60 seconds
export const revalidate = 60;

export default async function LatestBlogPage() {
  // TODO: Fetch latest content from Contentstack
  // This data will be refreshed every 60 seconds
  
  const currentTime = new Date().toLocaleString();
  
  const latestPosts = [
    {
      id: 1,
      title: "Breaking: New AI Model Achieves State-of-the-Art Performance",
      excerpt: "Researchers unveil groundbreaking architecture that outperforms existing models",
      category: "AI",
      date: "2026-02-09",
      views: 2845,
      trending: true,
      slug: "new-ai-model-sota"
    },
    {
      id: 2,
      title: "ChatGPT Update: Enhanced Reasoning Capabilities",
      excerpt: "Latest update brings significant improvements to logical reasoning",
      category: "ChatGPT",
      date: "2026-02-09",
      views: 1923,
      trending: true,
      slug: "chatgpt-enhanced-reasoning"
    },
    {
      id: 3,
      title: "Generative AI in Creative Industries",
      excerpt: "How artists and designers are leveraging AI for innovation",
      category: "Generative AI",
      date: "2026-02-08",
      views: 1456,
      trending: false,
      slug: "generative-ai-creative"
    },
    {
      id: 4,
      title: "Gemini Pro: Advanced Use Cases",
      excerpt: "Exploring enterprise applications of Google's Gemini Pro",
      category: "Gemini",
      date: "2026-02-08",
      views: 1289,
      trending: false,
      slug: "gemini-pro-use-cases"
    },
    {
      id: 5,
      title: "The Ethics of AI Development",
      excerpt: "Important considerations for responsible AI innovation",
      category: "AI",
      date: "2026-02-07",
      views: 987,
      trending: false,
      slug: "ai-ethics-development"
    },
    {
      id: 6,
      title: "Fine-tuning LLMs: Best Practices",
      excerpt: "A comprehensive guide to customizing language models",
      category: "Generative AI",
      date: "2026-02-07",
      views: 856,
      trending: false,
      slug: "finetuning-llms"
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Latest Articles</h1>
        <p className="text-lg text-gray-600">
          Stay up-to-date with the newest content and trending articles across all AI topics.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Last updated: {currentTime}
        </p>
      </div>

      {/* Trending Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-900">Trending Now</h2>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {latestPosts.filter(post => post.trending).map((post) => (
            <BlogCard
              key={post.id}
              id={post.id}
              title={post.title}
              excerpt={post.excerpt}
              date={post.date}
              slug={post.slug}
              category={post.category}
              views={post.views}
              trending={true}
              variant="trending"
              href={`/blog/latest/${post.slug}`}
            />
          ))}
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Posts</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latestPosts.filter(post => !post.trending).map((post) => (
            <BlogCard
              key={post.id}
              id={post.id}
              title={post.title}
              excerpt={post.excerpt}
              date={post.date}
              slug={post.slug}
              category={post.category}
              views={post.views}
              href={`/blog/latest/${post.slug}`}
              accentColor="blue"
            />
          ))}
        </div>
      </div>

      <RenderingBadge strategy="ISR" revalidate={60} />
    </div>
  );
}
