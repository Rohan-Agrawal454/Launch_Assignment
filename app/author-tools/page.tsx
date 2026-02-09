import type { Metadata } from "next";
import RenderingBadge from "@/components/RenderingBadge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Author Tools | AI Blog Platform",
  description: "Tools and resources for content authors",
};

// Server-Side Rendering (SSR) - Personalized content
export const dynamic = 'force-dynamic';

export default async function AuthorToolsPage() {
  // TODO: Fetch user-specific data from Contentstack
  // This would typically include authentication and user context
  
  const authorStats = {
    publishedPosts: 24,
    draftPosts: 5,
    totalViews: 12845,
    lastPublished: "2026-02-08"
  };

  const recentDrafts = [
    {
      id: 1,
      title: "AI Ethics in Modern Applications",
      lastEdited: "2026-02-09",
      status: "Draft"
    },
    {
      id: 2,
      title: "Neural Networks Deep Dive",
      lastEdited: "2026-02-08",
      status: "Review"
    },
    {
      id: 3,
      title: "Practical Guide to Prompt Engineering",
      lastEdited: "2026-02-07",
      status: "Draft"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Author Tools</h1>
          <p className="text-lg text-gray-600">
            Manage your content, track performance, and access writing resources.
          </p>
        </div>

        {/* Author Stats */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-all border border-blue-200 group">
            <h3 className="text-sm font-semibold text-blue-700 mb-1">Published Posts</h3>
            <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mt-2">{authorStats.publishedPosts}</p>
            <div className="mt-2 text-xs text-blue-600 group-hover:translate-x-1 transition-transform">View all →</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-all border border-yellow-200 group">
            <h3 className="text-sm font-semibold text-yellow-700 mb-1">Draft Posts</h3>
            <p className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent mt-2">{authorStats.draftPosts}</p>
            <div className="mt-2 text-xs text-yellow-600 group-hover:translate-x-1 transition-transform">View drafts →</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-all border border-green-200 group">
            <h3 className="text-sm font-semibold text-green-700 mb-1">Total Views</h3>
            <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mt-2">{authorStats.totalViews.toLocaleString()}</p>
            <div className="mt-2 text-xs text-green-600 group-hover:translate-x-1 transition-transform">Analytics →</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-all border border-purple-200 group">
            <h3 className="text-sm font-semibold text-purple-700 mb-1">Last Published</h3>
            <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mt-2">{authorStats.lastPublished}</p>
            <div className="mt-2 text-xs text-purple-600 group-hover:translate-x-1 transition-transform">View post →</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 group">
              <span className="text-xl">+</span>
              <span>New Post</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
            <button className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-semibold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-1 border border-gray-300">
              📊 View Analytics
            </button>
            <button className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-semibold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-1 border border-gray-300">
              📖 Guidelines
            </button>
          </div>
        </div>

        {/* Recent Drafts */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Drafts</h2>
          <div className="space-y-4">
            {recentDrafts.map((draft) => (
              <div 
                key={draft.id} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{draft.title}</h3>
                  <p className="text-sm text-gray-500">Last edited: {draft.lastEdited}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    {draft.status}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    Edit →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <RenderingBadge strategy="SSR" />
      </div>
      <Footer />
    </div>
  );
}
