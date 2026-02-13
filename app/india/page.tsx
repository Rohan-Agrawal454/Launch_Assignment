import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getHomepage } from "@/lib/contentstack";
import type { Metadata } from "next";

// Helper function to get color classes
const getColorClasses = (colour: string) => {
  const colors: Record<string, { border: string; bg: string; text: string }> = {
    blue: {
      border: 'border-blue-100',
      bg: 'from-blue-100 to-blue-200',
      text: 'text-blue-600'
    },
    purple: {
      border: 'border-purple-100',
      bg: 'from-purple-100 to-purple-200',
      text: 'text-purple-600'
    },
    green: {
      border: 'border-green-100',
      bg: 'from-green-100 to-green-200',
      text: 'text-green-600'
    },
    orange: {
      border: 'border-orange-100',
      bg: 'from-orange-100 to-orange-200',
      text: 'text-orange-600'
    }
  };
  return colors[colour] || colors.blue;
};

// Generate metadata from CMS for India
export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepage('hi-in');

  return {
    title: homepage?.seo?.meta_title || homepage?.title || 'AI Blog Platform - India',
    description: homepage?.seo?.meta_description || homepage?.hero_section.subtitle || 'Your premier AI blog platform',
  };
}

export default async function IndiaPage() {
  // Force Hindi locale for India page
  const locale = 'hi-in';
  
  // Fetch homepage content from Contentstack with Hindi locale
  const homepage = await getHomepage(locale);

  // If CMS data is not available, show loading or fallback
  if (!homepage) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">लोड हो रहा है...</h1>
          <p className="text-gray-600">CMS से सामग्री प्राप्त की जा रही है</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-green-50">
      <Navbar />

      {/* Language Switcher - Fixed Position */}
      <div className="fixed top-20 right-4 z-50">
        <LanguageSwitcher currentLocale={locale} />
      </div>

      {/* Hero Section with India Flag Colors Accent */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-6xl">🇮🇳</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            {homepage.hero_section.title}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {homepage.hero_section.subtitle}
          </p>
          <div className="flex gap-4 justify-center">
            <a 
              href={homepage.hero_section.primary_cta.link}
              className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
            >
              {homepage.hero_section.primary_cta.text}
            </a>
            <a 
              href={homepage.hero_section.secondary_cta.link}
              className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg border-2 border-orange-200 transition-colors"
            >
              {homepage.hero_section.secondary_cta.text}
            </a>
          </div>
        </div>

        {/* Categories Grid - Fetched from CMS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {homepage.featured_categories.map((category, index) => {
            const colors = getColorClasses(category.colour);
            return (
              <a 
                key={category._metadata?.uid || index} 
                href={category.link} 
                className="group animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className={`bg-white rounded-xl shadow-md p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border ${colors.border}`}>
                  <div className={`w-14 h-14 bg-linear-to-br ${colors.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm`}>
                    <span className="text-3xl">{category.icon}</span>
                  </div>
                  <h3 className={`text-xl font-semibold text-gray-900 mb-2 group-hover:${colors.text} transition-colors`}>
                    {category.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {category.description}
                  </p>
                  <div className={`mt-4 ${colors.text} font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1`}>
                    Explore <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Features Section - Fetched from CMS */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {homepage.features_section.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {homepage.features_section.features_group.map((feature, index) => (
              <div key={feature._metadata?.uid || index} className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tools Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <a href="/author-tools" className="bg-linear-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-8 text-white hover:shadow-2xl transition-shadow">
            <h3 className="text-2xl font-bold mb-2">Author Tools</h3>
            <p className="mb-4 opacity-90">Access writing resources, manage drafts, and track your content performance</p>
            <span className="text-orange-100 font-medium">Explore Tools →</span>
          </a>

          <a href="/editor-dashboard" className="bg-linear-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-8 text-white hover:shadow-2xl transition-shadow">
            <h3 className="text-2xl font-bold mb-2">Editor Dashboard</h3>
            <p className="mb-4 opacity-90">Review submissions, manage publications, and oversee content quality</p>
            <span className="text-green-100 font-medium">Open Dashboard →</span>
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
