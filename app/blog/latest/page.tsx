import type { Metadata } from "next";
import RenderingBadge from "@/components/RenderingBadge";
import BlogCard from "@/components/BlogCard";
import { getAllBlogPosts, getTrendingPosts } from "@/lib/contentstack";

export const metadata: Metadata = {
  title: "Latest AI Articles | AI Blog Platform",
  description: "The latest and trending articles on AI, ML, and emerging technologies",
};

// Incremental Static Regeneration (ISR) - Revalidate every 60 seconds
export const revalidate = 60;

export default async function LatestBlogPage() {
  // Fetch posts from Contentstack
  const trendingPosts = await getTrendingPosts(2);
  const allPosts = await getAllBlogPosts(5);
  
  const currentTime = new Date().toLocaleString();

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
      {trendingPosts.length > 0 ? (
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900">Trending Now</h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            {trendingPosts.map((post) => {
              const categoryPath = post.category === 'GenerativeAI' ? 'generativeai' : post.category.toLowerCase();
              return (
                <BlogCard
                  key={post.uid}
                  id={post.uid}
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  date={post.publish_details?.time || post.created_at || ''}
                  category={post.category === 'GenerativeAI' ? 'Generative AI' : post.category}
                  views={post.view_count}
                  variant="trending"
                  href={`/blog/${categoryPath}/${post.slug}`}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900">Trending Now</h2>
          </div>
          <p className="text-gray-600 text-center py-8">No trending posts found. Please add content in Contentstack CMS.</p>
        </div>
      )}

      {/* Recent Posts */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Posts</h2>
        {allPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allPosts.filter(p => !p.is_trending).map((post) => {
              const categoryPath = post.category === 'GenerativeAI' ? 'generativeai' : post.category.toLowerCase();
              return (
                <BlogCard
                  key={post.uid}
                  id={post.uid}
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  date={post.publish_details?.time || post.created_at || ''}
                  category={post.category === 'GenerativeAI' ? 'Generative AI' : post.category}
                  views={post.view_count}
                  href={`/blog/${categoryPath}/${post.slug}`}
                  accentColor="blue"
                />
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No recent posts found. Please add content in Contentstack CMS.</p>
        )}
      </div>

      <RenderingBadge strategy="ISR" revalidate={60} />
    </div>
  );
}
