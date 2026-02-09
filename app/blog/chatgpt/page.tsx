import type { Metadata } from "next";
import RenderingBadge from "@/components/RenderingBadge";

export const metadata: Metadata = {
  title: "ChatGPT | AI Blog Platform",
  description: "Articles, tutorials, and insights about ChatGPT and conversational AI",
};

// Static Site Generation (SSG) - Evergreen content
export default async function ChatGPTPage() {
  // TODO: Fetch content from Contentstack
  const posts = [
    {
      id: 1,
      title: "Getting Started with ChatGPT",
      excerpt: "A beginner's guide to using ChatGPT effectively",
      date: "2026-02-06",
      slug: "getting-started-chatgpt"
    },
    {
      id: 2,
      title: "Advanced ChatGPT Prompting Techniques",
      excerpt: "Master the art of prompt engineering",
      date: "2026-02-03",
      slug: "advanced-prompting"
    },
    {
      id: 3,
      title: "ChatGPT for Business",
      excerpt: "How enterprises are leveraging ChatGPT",
      date: "2026-01-29",
      slug: "chatgpt-for-business"
    }
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">ChatGPT</h1>
      <p className="text-lg text-gray-600 mb-8">
        Learn everything about ChatGPT, from basic usage to advanced applications.
      </p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article 
            key={post.id} 
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-green-100 group"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
              {post.title}
            </h2>
            <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <time className="text-sm text-gray-500">{post.date}</time>
              <a 
                href={`/blog/chatgpt/${post.slug}`}
                className="text-green-600 hover:text-green-800 font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
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
