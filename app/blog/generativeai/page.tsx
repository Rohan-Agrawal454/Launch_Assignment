import type { Metadata } from "next";
import RenderingBadge from "@/components/RenderingBadge";
import BlogCard from "@/components/BlogCard";
import RevalidateCacheButton from "@/components/RevalidateCacheButton";
import { getBlogPostsByCategory } from "@/lib/contentstack";

export const metadata: Metadata = {
  title: "Generative AI | AI Blog Platform",
  description: "Latest articles on generative AI, LLMs, and creative AI applications",
};

// Incremental Static Regeneration (ISR) - Revalidate every 60 seconds
export const revalidate = 60;

export default async function GenerativeAIPage() {
  // Fetch posts from Contentstack (category is "GenerativeAI" in CMS)
  const posts = await getBlogPostsByCategory('GenerativeAI');

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Generative AI</h1>
        <RevalidateCacheButton />
      </div>
      <p className="text-lg text-gray-600 mb-8">
        Explore the cutting-edge world of generative AI, from language models to image generation.
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
              category="Generative AI"
              href={`/blog/generativeai/${post.slug}`}
              views={post.view_count}
              accentColor="purple"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No posts found. Please add content in Contentstack CMS.</p>
        </div>
      )}

      <RenderingBadge strategy="ISR" />
    </div>
  );
}
