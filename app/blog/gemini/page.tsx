import type { Metadata } from "next";
import RenderingBadge from "@/components/RenderingBadge";
import BlogCard from "@/components/BlogCard";
import { getBlogPostsByCategory } from "@/lib/contentstack";

export const metadata: Metadata = {
  title: "Gemini AI | AI Blog Platform",
  description: "Explore articles about Google's Gemini AI and multimodal models",
};

// Static Site Generation (SSG) - Evergreen content
export default async function GeminiPage() {
  // Fetch posts from Contentstack
  const posts = await getBlogPostsByCategory('Gemini');

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Gemini AI</h1>
      <p className="text-lg text-gray-600 mb-8">
        Discover the power of Google Gemini and explore multimodal AI capabilities.
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
              href={`/blog/gemini/${post.slug}`}
              views={post.view_count}
              accentColor="orange"
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
