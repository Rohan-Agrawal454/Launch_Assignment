import Link from 'next/link';

interface BlogCardProps {
  id?: number | string; // Support both number and string (uid from CMS)
  title: string;
  excerpt: string;
  date: string;
  slug?: string;
  category?: string;
  views?: number;
  trending?: boolean;
  href: string;
  variant?: 'default' | 'trending';
  accentColor?: 'blue' | 'purple' | 'green' | 'orange' | 'red';
}

export default function BlogCard({
  title,
  excerpt,
  date,
  href,
  category,
  views,
  trending = false,
  variant = 'default',
  accentColor = 'blue',
}: BlogCardProps) {
  const colorVariants = {
    blue: {
      border: 'border-blue-100',
      hoverText: 'group-hover:text-blue-600',
      linkText: 'text-blue-600 hover:text-blue-800',
      badge: 'bg-blue-100 text-blue-800',
    },
    purple: {
      border: 'border-purple-100',
      hoverText: 'group-hover:text-purple-600',
      linkText: 'text-purple-600 hover:text-purple-800',
      badge: 'bg-purple-100 text-purple-800',
    },
    green: {
      border: 'border-green-100',
      hoverText: 'group-hover:text-green-600',
      linkText: 'text-green-600 hover:text-green-800',
      badge: 'bg-green-100 text-green-800',
    },
    orange: {
      border: 'border-orange-100',
      hoverText: 'group-hover:text-orange-600',
      linkText: 'text-orange-600 hover:text-orange-800',
      badge: 'bg-orange-100 text-orange-800',
    },
    red: {
      border: 'border-red-100',
      hoverText: 'group-hover:text-red-600',
      linkText: 'text-red-600 hover:text-red-800',
      badge: 'bg-red-100 text-red-800',
    },
  };

  const colors = colorVariants[accentColor];

  if (variant === 'trending') {
    return (
      <article className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 rounded-xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-2 border-orange-300 group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-2xl -mr-16 -mt-16"></div>
        <div className="relative">
          <div className="flex items-center space-x-2 mb-3">
            {category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-200 text-orange-900 shadow-sm">
                {category}
              </span>
            )}
            {trending && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 shadow-sm animate-pulse">
                🔥 Trending
              </span>
            )}
          </div>
          <Link href={href}>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-700 transition-colors cursor-pointer">
              {title}
            </h3>
          </Link>
          <p className="text-gray-700 mb-4 line-clamp-2">{excerpt}</p>
          <div className="flex items-center justify-between pt-4 border-t border-orange-200">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <time className="font-medium">{date}</time>
              {views !== undefined && (
                <>
                  <span className="text-orange-400">•</span>
                  <span className="font-medium">{views.toLocaleString()} views</span>
                </>
              )}
            </div>
            <Link 
              href={href}
              className="text-orange-600 hover:text-orange-800 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all"
            >
              Read more <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={`bg-white rounded-xl shadow-md p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border ${colors.border} group`}>
      {category && (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colors.badge} mb-3 shadow-sm`}>
          {category}
        </span>
      )}
      <Link href={href}>
        <h2 className={`text-2xl font-semibold text-gray-900 mb-2 ${colors.hoverText} transition-colors cursor-pointer`}>
          {title}
        </h2>
      </Link>
      <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <time>{date}</time>
          {views !== undefined && (
            <>
              <span>•</span>
              <span>{views.toLocaleString()} views</span>
            </>
          )}
        </div>
        <Link 
          href={href}
          className={`${colors.linkText} font-medium flex items-center gap-1 group-hover:gap-2 transition-all`}
        >
          Read <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </article>
  );
}
