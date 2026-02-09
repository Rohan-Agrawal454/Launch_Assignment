import type { Metadata } from "next";
import RenderingBadge from "@/components/RenderingBadge";
import BlogCard from "@/components/BlogCard";
import { getBlogPostsByCategory } from "@/lib/contentstack";

export const metadata: Metadata = {
  title: "AI Blog | AI Blog Platform",
  description: "Explore articles about artificial intelligence and machine learning",
};

// Static Site Generation (SSG) - Evergreen content
export default async function AIBlogPage() {
  // Fetch posts from Contentstack
  const posts = await getBlogPostsByCategory('AI');

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">AI Blog</h1>
      <p className="text-lg text-gray-600 mb-8">
        Dive deep into the world of artificial intelligence with our comprehensive articles and tutorials.
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
              href={`/blog/ai/${post.slug}`}
              views={post.view_count}
              accentColor="blue"
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
