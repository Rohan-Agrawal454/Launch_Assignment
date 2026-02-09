# Next.js Rendering Strategies Guide

This document explains how to identify and differentiate between SSG, SSR, and ISR in your Next.js application.

## 📋 Quick Reference Table

| Strategy | Full Name | When Used | Revalidation | Performance | Use Case |
|----------|-----------|-----------|--------------|-------------|----------|
| **SSG** | Static Site Generation | Build time | No | Fastest | Evergreen content |
| **ISR** | Incremental Static Regeneration | Build time + Revalidation | Yes (configurable) | Very Fast | Frequently updated content |
| **SSR** | Server-Side Rendering | Every request | N/A | Slower | Personalized/Real-time data |

---

## 🎯 How to Identify Rendering Strategies

### Method 1: Look at the Page Code

#### SSG (Static Site Generation)
```typescript
// app/blog/ai/page.tsx
export default async function AIBlogPage() {
  // No special configuration
  // Rendered at BUILD TIME
  return <div>Content</div>
}
```

**Characteristics:**
- ✅ No `export const dynamic` or `export const revalidate`
- ✅ Built once at `npm run build`
- ✅ Served as static HTML
- ✅ Fastest performance

**Pages using SSG in this project:**
- `/blog/ai`
- `/blog/generativeai`
- `/blog/chatgpt`
- `/blog/gemini`
- `/` (homepage)

---

#### ISR (Incremental Static Regeneration)
```typescript
// app/blog/latest/page.tsx
export const revalidate = 60; // Revalidate every 60 seconds

export default async function LatestBlogPage() {
  const currentTime = new Date().toLocaleString();
  // Content is regenerated every 60 seconds
  return <div>Last updated: {currentTime}</div>
}
```

**Characteristics:**
- ✅ Has `export const revalidate = <seconds>`
- ✅ Built at build time, then regenerated on interval
- ✅ Still serves cached version while regenerating
- ✅ Balance between fresh data and performance

**Pages using ISR in this project:**
- `/blog/latest` (revalidates every 60 seconds)

---

#### SSR (Server-Side Rendering)
```typescript
// app/author-tools/page.tsx
export const dynamic = 'force-dynamic';

export default async function AuthorToolsPage() {
  // Rendered on EVERY REQUEST
  // Can access request-specific data
  return <div>User-specific content</div>
}
```

**Characteristics:**
- ✅ Has `export const dynamic = 'force-dynamic'`
- ✅ Rendered fresh on every request
- ✅ Can access cookies, headers, user sessions
- ✅ Slowest but most dynamic

**Pages using SSR in this project:**
- `/author-tools`
- `/editor-dashboard`

---

## 🔍 Method 2: Check Build Output

Run `npm run build` and look at the output:

```bash
npm run build
```

**Output Example:**
```
Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB         87.3 kB
├ ○ /blog/ai                            1.5 kB         88.6 kB
├ ○ /blog/chatgpt                       1.6 kB         88.7 kB
├ ○ /blog/gemini                        1.5 kB         88.6 kB
├ ○ /blog/generativeai                  1.6 kB         88.7 kB
├ ƒ /blog/latest                        2.1 kB         89.2 kB
├ ƒ /author-tools                       3.2 kB         90.3 kB
└ ƒ /editor-dashboard                   3.5 kB         90.6 kB

Legend:
○ (Static)  = pre-rendered as static content (SSG)
ƒ (Dynamic) = server-rendered on demand (SSR or ISR)
```

**How to Read:**
- `○` (circle) = **SSG** - Static pages generated at build time
- `ƒ` (lambda) = **SSR or ISR** - Dynamically rendered

To differentiate ISR from SSR in the build output, check the page code for `revalidate` export.

---

## 🧪 Method 3: Test at Runtime

### Test SSG:
1. Build the application: `npm run build`
2. Start production server: `npm start`
3. Visit `/blog/ai` multiple times
4. **Result**: Content never changes (until rebuild)
5. Check Network tab: Response time ~10-20ms

### Test ISR:
1. Build and start: `npm run build && npm start`
2. Visit `/blog/latest`
3. Note the "Last updated" timestamp
4. Wait 60+ seconds and refresh
5. **Result**: Timestamp updates!
6. Check Network tab: First request ~10-20ms, after revalidation same speed

### Test SSR:
1. Build and start: `npm run build && npm start`
2. Visit `/author-tools`
3. Check Network tab: Response time ~50-200ms (slower)
4. **Result**: Fresh data on every request

---

## 📊 Method 4: Check Response Headers

Use browser DevTools Network tab:

### SSG Response:
```
Cache-Control: public, max-age=0, must-revalidate
X-Nextjs-Cache: HIT (from static generation)
```

### ISR Response:
```
Cache-Control: s-maxage=60, stale-while-revalidate
X-Nextjs-Cache: HIT (or STALE if regenerating)
```

### SSR Response:
```
Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate
X-Nextjs-Cache: MISS (always fresh)
```

---

## 🎨 Method 5: Visual Indicators (On the Page)

This project includes visual badges on each page showing the rendering strategy:

### Green Badge = SSG
```tsx
<div className="badge-ssg">
  ⚡ SSG - Static Site Generation
</div>
```

### Orange Badge = ISR
```tsx
<div className="badge-isr">
  🔄 ISR - Revalidates every 60s
</div>
```

### Blue Badge = SSR
```tsx
<div className="badge-ssr">
  🖥️ SSR - Server-Side Rendered
</div>
```

---

## 🔧 How to Change Rendering Strategy

### Convert SSG → ISR:
```typescript
// Add this line to your page:
export const revalidate = 60; // seconds
```

### Convert SSG → SSR:
```typescript
// Add this line to your page:
export const dynamic = 'force-dynamic';
```

### Convert SSR → SSG:
```typescript
// Remove this line:
// export const dynamic = 'force-dynamic';
```

### Convert ISR → SSG:
```typescript
// Remove this line:
// export const revalidate = 60;
```

---

## 🎯 Decision Matrix: Which Strategy to Use?

| Content Type | Update Frequency | User-Specific? | Best Strategy | Example |
|--------------|-----------------|----------------|---------------|---------|
| About Page | Rarely | No | SSG | Company info |
| Blog Posts | Weekly | No | SSG | Tutorials, guides |
| News Feed | Hourly | No | ISR | Latest news |
| Product Prices | Frequently | No | ISR | E-commerce prices |
| User Dashboard | Real-time | Yes | SSR | Personal data |
| Search Results | Real-time | No | SSR | Dynamic queries |

---

## 💡 Pro Tips

1. **Start with SSG** - It's the fastest. Only use SSR/ISR when needed.

2. **ISR is powerful** - Use it for content that updates regularly but doesn't need to be real-time.

3. **SSR for personalization** - Only use SSR when you need user-specific data or real-time information.

4. **Combine strategies** - Different pages can use different strategies!

5. **Monitor performance** - Use Next.js Analytics to see actual performance.

---

## 🔍 Debugging Tips

### Check which strategy is being used:
```bash
# Build your app
npm run build

# Look for the legend in the output:
# ○ = SSG
# ƒ = SSR/ISR (check code for revalidate)
```

### Test ISR revalidation:
```typescript
// Add timestamp to see revalidation
const timestamp = new Date().toISOString();
console.log('Page rendered at:', timestamp);
```

### Force revalidation:
- For ISR pages, wait for the revalidate time
- Or use On-Demand Revalidation (advanced feature)

---

## 📚 Additional Resources

- [Next.js Data Fetching Docs](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Incremental Static Regeneration](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)
- [Server and Client Components](https://nextjs.org/docs/app/building-your-application/rendering)
