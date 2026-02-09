import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import BlogDetail from '@/components/BlogDetail';
import { getBlogPostBySlug } from '@/lib/contentstack';
import type { BlogPostDetail } from '@/types/blog';

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found'
    };
  }

  return {
    title: `${post.title} | AI Blog Platform`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  // Fetch from Contentstack
  const cmsPost = await getBlogPostBySlug(slug);

  if (!cmsPost) {
    notFound();
  }

  // Transform CMS data to match BlogDetail component
  const formattedDate = new Date(cmsPost.publish_details?.time || cmsPost.created_at || '').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const tags = cmsPost.post_tags ? cmsPost.post_tags.split(',').map((t: string) => t.trim()) : [];

  const relatedPosts = [
    {
      title: "Advanced ChatGPT Prompting",
      excerpt: "Master prompt engineering",
      href: "/blog/chatgpt/advanced-prompting",
    },
    {
      title: "ChatGPT for Business",
      excerpt: "Enterprise applications",
      href: "/blog/chatgpt/chatgpt-for-business",
    },
  ];

  return <BlogDetail 
    title={cmsPost.title}
    category={cmsPost.category}
    date={formattedDate}
    author="AI Research Team"
    readTime="5 min read"
    content={cmsPost.content}
    tags={tags}
    relatedPosts={relatedPosts}
  />;
}
