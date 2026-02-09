import type { Metadata } from "next";
import RenderingBadge from "@/components/RenderingBadge";
import BlogCard from "@/components/BlogCard";

export const metadata: Metadata = {
  title: "AI Blog | AI Blog Platform",
  description: "Explore articles about artificial intelligence and machine learning",
};

// Static Site Generation (SSG) - Evergreen content
export default async function AIBlogPage() {
  // TODO: Fetch content from Contentstack
  const posts = [
    {
      id: 1,
      title: "Understanding Artificial Intelligence",
      excerpt: "A comprehensive guide to AI fundamentals and applications",
      date: "2026-02-01",
      slug: "understanding-ai"
    },
    {
      id: 2,
      title: "Machine Learning Best Practices",
      excerpt: "Essential practices for building robust ML models",
      date: "2026-01-28",
      slug: "ml-best-practices"
    },
    {
      id: 3,
      title: "The Future of AI Technology",
      excerpt: "Exploring upcoming trends and innovations in AI",
      date: "2026-01-25",
      slug: "future-of-ai"
    }
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">AI Blog</h1>
      <p className="text-lg text-gray-600 mb-8">
        Dive deep into the world of artificial intelligence with our comprehensive articles and tutorials.
      </p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard
            key={post.id}
            id={post.id}
            title={post.title}
            excerpt={post.excerpt}
            date={post.date}
            slug={post.slug}
            href={`/blog/ai/${post.slug}`}
            accentColor="blue"
          />
        ))}
      </div>

      <RenderingBadge strategy="SSG" />
    </div>
  );
}
