import type { Metadata } from "next";
import RenderingBadge from "@/components/RenderingBadge";
import BlogCard from "@/components/BlogCard";
import { getBlogPostsByCategory } from "@/lib/contentstack";

export const metadata: Metadata = {
  title: "ChatGPT | AI Blog Platform",
  description: "Articles, tutorials, and insights about ChatGPT and conversational AI",
};

// Static Site Generation (SSG) - Evergreen content
export default async function ChatGPTPage() {
  // Fetch posts from Contentstack
  const posts = await getBlogPostsByCategory('ChatGPT');

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">ChatGPT</h1>
      <p className="text-lg text-gray-600 mb-8">
        Learn everything about ChatGPT, from basic usage to advanced applications.
      </p>
      
      {posts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard
              key={post.uid}
              id={post.uid}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              date={post.publish_details?.time || post.created_at || ''}
              category={post.category}
              href={`/blog/chatgpt/${post.slug}`}
              views={post.view_count}
              accentColor="green"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No posts found. Please add content in Contentstack CMS.</p>
        </div>
      )}

      <RenderingBadge strategy="SSG" />
    </div>
  );
}
