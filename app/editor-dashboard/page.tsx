import type { Metadata } from "next";
import RenderingBadge from "@/components/RenderingBadge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Editor Dashboard | AI Blog Platform",
  description: "Editorial dashboard for content management and review",
};

// Server-Side Rendering (SSR) - Personalized content
export const dynamic = 'force-dynamic';

export default async function EditorDashboardPage() {
  // TODO: Fetch editor-specific data from Contentstack
  // This would typically include authentication and role-based access
  
  const dashboardStats = {
    pendingReview: 8,
    scheduledPosts: 12,
    totalAuthors: 15,
    publishedToday: 3
  };

  const pendingArticles = [
    {
      id: 1,
      title: "The Evolution of AI Models",
      author: "Sarah Johnson",
      submittedDate: "2026-02-09",
      category: "AI",
      priority: "High"
    },
    {
      id: 2,
      title: "Understanding Transformer Architecture",
      author: "Michael Chen",
      submittedDate: "2026-02-09",
      category: "Generative AI",
      priority: "Medium"
    },
    {
      id: 3,
      title: "ChatGPT API Best Practices",
      author: "Emily Rodriguez",
      submittedDate: "2026-02-08",
      category: "ChatGPT",
      priority: "High"
    }
  ];

  const scheduledPosts = [
    {
      id: 1,
      title: "AI in Healthcare: Future Perspectives",
      author: "Dr. James Wilson",
      publishDate: "2026-02-10 09:00 AM",
      category: "AI"
    },
    {
      id: 2,
      title: "Gemini Pro Tips and Tricks",
      author: "Alex Thompson",
      publishDate: "2026-02-11 02:00 PM",
      category: "Gemini"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Editor Dashboard</h1>
          <p className="text-lg text-gray-600">
            Review submissions, manage publications, and oversee content quality.
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-all border border-orange-200 group cursor-pointer">
            <h3 className="text-sm font-semibold text-orange-700 mb-1">Pending Review</h3>
            <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mt-2">{dashboardStats.pendingReview}</p>
            <div className="mt-2 text-xs text-orange-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              Needs attention
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-all border border-blue-200 group cursor-pointer">
            <h3 className="text-sm font-semibold text-blue-700 mb-1">Scheduled Posts</h3>
            <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-2">{dashboardStats.scheduledPosts}</p>
            <div className="mt-2 text-xs text-blue-600 group-hover:translate-x-1 transition-transform">View calendar →</div>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-all border border-gray-200 group cursor-pointer">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Active Authors</h3>
            <p className="text-4xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mt-2">{dashboardStats.totalAuthors}</p>
            <div className="mt-2 text-xs text-gray-600 group-hover:translate-x-1 transition-transform">Manage authors →</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-all border border-green-200 group cursor-pointer">
            <h3 className="text-sm font-semibold text-green-700 mb-1">Published Today</h3>
            <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-2">{dashboardStats.publishedToday}</p>
            <div className="mt-2 text-xs text-green-600 group-hover:translate-x-1 transition-transform">View posts →</div>
          </div>
        </div>

        {/* Pending Review Queue */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Pending Review</h2>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {pendingArticles.map((article) => (
              <div 
                key={article.id} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="font-medium text-gray-900">{article.title}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      article.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {article.priority}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>By {article.author}</span>
                    <span>•</span>
                    <span>{article.category}</span>
                    <span>•</span>
                    <span>Submitted {article.submittedDate}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                    Approve
                  </button>
                  <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors">
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Posts */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Scheduled Posts</h2>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              View Calendar →
            </button>
          </div>
          <div className="space-y-4">
            {scheduledPosts.map((post) => (
              <div 
                key={post.id} 
                className="flex items-center justify-between p-4 bg-blue-50 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{post.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <span>By {post.author}</span>
                    <span>•</span>
                    <span>{post.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{post.publishDate}</p>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1">
                    Edit Schedule
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
