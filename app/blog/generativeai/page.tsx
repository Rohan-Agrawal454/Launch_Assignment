import type { Metadata } from "next";
import RenderingBadge from "@/components/RenderingBadge";

export const metadata: Metadata = {
  title: "Generative AI | AI Blog Platform",
  description: "Latest articles on generative AI, LLMs, and creative AI applications",
};

// Static Site Generation (SSG) - Evergreen content
export default async function GenerativeAIPage() {
  // TODO: Fetch content from Contentstack
  const posts = [
    {
      id: 1,
      title: "Introduction to Generative AI",
      excerpt: "Understanding how generative models create new content",
      date: "2026-02-05",
      slug: "intro-to-generative-ai"
    },
    {
      id: 2,
      title: "Large Language Models Explained",
      excerpt: "A deep dive into LLM architecture and training",
      date: "2026-02-02",
      slug: "llms-explained"
    },
    {
      id: 3,
      title: "Creative Applications of AI",
      excerpt: "How generative AI is transforming art and design",
      date: "2026-01-30",
      slug: "creative-applications-generative-ai"
    }
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Generative AI</h1>
      <p className="text-lg text-gray-600 mb-8">
        Explore the cutting-edge world of generative AI, from language models to image generation.
      </p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article 
            key={post.id} 
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-purple-100 group"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
              {post.title}
            </h2>
            <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <time className="text-sm text-gray-500">{post.date}</time>
              <a 
                href={`/blog/generativeai/${post.slug}`}
                className="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
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
