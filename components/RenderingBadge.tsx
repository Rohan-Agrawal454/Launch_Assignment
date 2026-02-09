interface RenderingBadgeProps {
  strategy: 'SSG' | 'ISR' | 'SSR';
  revalidate?: number;
}

export default function RenderingBadge({ strategy, revalidate }: RenderingBadgeProps) {
  const badges = {
    SSG: {
      bgColor: 'bg-gradient-to-r from-green-500 to-emerald-600',
      shadowColor: 'shadow-green-500/30',
      icon: '⚡',
      title: 'Static Site Generation',
      description: 'Pre-rendered at build time for maximum performance'
    },
    ISR: {
      bgColor: 'bg-gradient-to-r from-orange-500 to-amber-600',
      shadowColor: 'shadow-orange-500/30',
      icon: '🔄',
      title: 'Incremental Static Regeneration',
      description: revalidate 
        ? `Revalidates every ${revalidate} seconds for fresh content`
        : 'Automatically updates with fresh content'
    },
    SSR: {
      bgColor: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      shadowColor: 'shadow-blue-500/30',
      icon: '🖥️',
      title: 'Server-Side Rendering',
      description: 'Rendered on each request for real-time data'
    }
  };

  const badge = badges[strategy];

  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className={`${badge.bgColor} ${badge.shadowColor} text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-md flex-shrink-0 transition-transform duration-300 hover:scale-105`}>
          <span>{badge.icon}</span>
          <span>{strategy}</span>
          {revalidate && <span className="text-xs opacity-90">({revalidate}s)</span>}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{badge.title}</h3>
          <p className="text-sm text-gray-600">{badge.description}</p>
        </div>
      </div>
      <div className="mt-4 text-xs text-gray-500">
        <details className="cursor-pointer group">
          <summary className="font-medium hover:text-gray-700 transition-colors duration-200 list-none flex items-center gap-2">
            <span className="inline-block transition-transform duration-200 group-open:rotate-90">▶</span>
            Learn more about rendering strategies
          </summary>
          <div className="mt-3 pl-4 border-l-2 border-gray-300 text-gray-600 leading-relaxed animate-in fade-in duration-300">
            {strategy === 'SSG' && (
              <p>
                <strong className="text-green-600">SSG</strong> pages are generated at build time and served as static HTML. 
                This provides the fastest possible page loads. Perfect for content that doesn&apos;t change frequently.
              </p>
            )}
            {strategy === 'ISR' && (
              <p>
                <strong className="text-orange-600">ISR</strong> combines the benefits of SSG with the ability to update content. 
                Pages are generated statically but can be regenerated in the background at specified intervals.
              </p>
            )}
            {strategy === 'SSR' && (
              <p>
                <strong className="text-blue-600">SSR</strong> renders pages on each request on the server. 
                Use this for personalized content or when you need real-time data on every page load.
              </p>
            )}
          </div>
        </details>
      </div>
    </div>
  );
}
