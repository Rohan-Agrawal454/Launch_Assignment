/**
 * Contentstack SDK Configuration and Utility Functions
 * 
 * This module provides the configuration for Contentstack SDK and
 * utility functions to fetch content from Contentstack CMS.
 */

import Contentstack from 'contentstack';

// Initialize Contentstack Stack
const Stack = Contentstack.Stack({
  api_key: process.env.CONTENTSTACK_API_KEY || '',
  delivery_token: process.env.CONTENTSTACK_DELIVERY_TOKEN || '',
  environment: process.env.CONTENTSTACK_ENVIRONMENT || 'production',
  region: (process.env.CONTENTSTACK_REGION || 'us') as any
});

/**
 * Blog Post Type Definition
 */
export interface BlogPost {
  uid: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author?: Author;
  featured_image?: {
    url: string;
    title: string;
  };
  tags?: string[];
  published_date: string;
  seo_metadata?: {
    meta_title: string;
    meta_description: string;
    meta_keywords: string[];
  };
  status: 'Draft' | 'Review' | 'Published';
  is_trending: boolean;
  view_count: number;
}

/**
 * Author Type Definition
 */
export interface Author {
  uid: string;
  name: string;
  bio?: string;
  avatar?: {
    url: string;
    title: string;
  };
  email?: string;
  social_links?: Array<{
    platform: string;
    url: string;
  }>;
}

/**
 * Fetch blog posts by category
 * @param category - Category slug (e.g., 'AI', 'Generative AI', 'ChatGPT', 'Gemini')
 * @returns Array of blog posts
 */
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    const query = Stack.ContentType('blog_post').Query();
    
    const result = await query
      .where('category', category)
      .where('status', 'Published')
      .descending('published_date')
      .includeReference('author')
      .toJSON()
      .find();
      
    return result[0] || [];
  } catch (error) {
    console.error(`Error fetching posts for category ${category}:`, error);
    return [];
  }
}

/**
 * Fetch all published blog posts
 * @param limit - Maximum number of posts to fetch (default: 50)
 * @returns Array of blog posts
 */
export async function getAllBlogPosts(limit: number = 50): Promise<BlogPost[]> {
  try {
    const query = Stack.ContentType('blog_post').Query();
    
    const result = await query
      .where('status', 'Published')
      .descending('published_date')
      .limit(limit)
      .includeReference('author')
      .toJSON()
      .find();
      
    return result[0] || [];
  } catch (error) {
    console.error('Error fetching all posts:', error);
    return [];
  }
}

/**
 * Fetch trending blog posts
 * @param limit - Maximum number of trending posts (default: 5)
 * @returns Array of trending blog posts
 */
export async function getTrendingPosts(limit: number = 5): Promise<BlogPost[]> {
  try {
    const query = Stack.ContentType('blog_post').Query();
    
    const result = await query
      .where('status', 'Published')
      .where('is_trending', true)
      .descending('view_count')
      .limit(limit)
      .includeReference('author')
      .toJSON()
      .find();
      
    return result[0] || [];
  } catch (error) {
    console.error('Error fetching trending posts:', error);
    return [];
  }
}

/**
 * Fetch a single blog post by slug
 * @param slug - Post slug
 * @returns Single blog post or null
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const query = Stack.ContentType('blog_post').Query();
    
    const result = await query
      .where('slug', slug)
      .where('status', 'Published')
      .includeReference('author')
      .toJSON()
      .find();
      
    return result[0]?.[0] || null;
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch all authors
 * @returns Array of authors
 */
export async function getAllAuthors(): Promise<Author[]> {
  try {
    const query = Stack.ContentType('author').Query();
    
    const result = await query
      .toJSON()
      .find();
      
    return result[0] || [];
  } catch (error) {
    console.error('Error fetching authors:', error);
    return [];
  }
}

/**
 * Fetch posts by author
 * @param authorUid - Author UID
 * @returns Array of blog posts by the author
 */
export async function getPostsByAuthor(authorUid: string): Promise<BlogPost[]> {
  try {
    const query = Stack.ContentType('blog_post').Query();
    
    const result = await query
      .where('author', authorUid)
      .where('status', 'Published')
      .descending('published_date')
      .includeReference('author')
      .toJSON()
      .find();
      
    return result[0] || [];
  } catch (error) {
    console.error(`Error fetching posts by author ${authorUid}:`, error);
    return [];
  }
}

export { Stack };
