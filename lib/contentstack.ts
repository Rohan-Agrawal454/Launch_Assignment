/**
 * Contentstack Delivery SDK Configuration and Utility Functions
 *
 * This module provides the configuration for Contentstack Delivery SDK and
 * utility functions to fetch content from Contentstack CMS.
 */

import contentstack, { QueryOperation } from '@contentstack/delivery-sdk';

// Type for Contentstack region
type Region = 'US' | 'EU' | 'AZURE_NA' | 'AZURE_EU' | 'GCP_NA';

// Initialize Contentstack Stack with Delivery SDK
const Stack = contentstack.stack({
  apiKey: process.env.CONTENTSTACK_API_KEY || '',
  deliveryToken: process.env.CONTENTSTACK_DELIVERY_TOKEN || '',
  environment: process.env.CONTENTSTACK_ENVIRONMENT || 'production',
  region: (process.env.CONTENTSTACK_REGION || 'US') as Region
});

/**
 * Homepage Type Definition (matches Contentstack response)
 */
export interface Homepage {
  uid: string;
  title: string;
  locale?: string;
  _version?: number;
  created_at?: string;
  updated_at?: string;
  hero_section: {
    title: string;
    subtitle: string;
    primary_cta: {
      text: string;
      link: string;
    };
    secondary_cta: {
      text: string;
      link: string;
    };
  };
  featured_categories: Array<{
    title: string;
    description: string;
    icon: string;
    link: string;
    colour: string; // Note: Contentstack uses 'colour' not 'color'
    _metadata?: {
      uid: string;
    };
  }>;
  features_section: {
    title: string; // Note: It's 'title' not 'section_title'
    features_group: Array<{ // Note: It's 'features_group' not 'features'
      icon: string;
      title: string;
      description: string;
      _metadata?: {
        uid: string;
      };
    }>;
  };
  seo?: {
    meta_title: string;
    meta_description: string;
  };
}

/**
 * Blog Post Type Definition (matches Contentstack response)
 */
export interface BlogPost {
  uid: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'AI' | 'GenerativeAI' | 'ChatGPT' | 'Gemini';
  post_tags?: string;
  status: 'Draft' | 'Review' | 'Published';
  is_trending: boolean;
  view_count: number;
  locale?: string;
  _version?: number;
  created_at?: string;
  updated_at?: string;
  publish_details?: {
    time: string;
    user: string;
    environment: string;
    locale: string;
  };
}



/**
 * Fetch homepage content (singleton)
 * @param locale - Locale code (e.g., 'en-us', 'fr-fr', 'ja-jp')
 * @returns Homepage content or null
 */
export async function getHomepage(locale: string = 'en-us'): Promise<Homepage | null> {
  try {
    console.log(`🔵 Fetching homepage from Contentstack for locale: ${locale}`);
    const result = await Stack.contentType('homepage')
      .entry()
      .locale(locale)
      .find<Homepage>();

    // Since homepage is a singleton, get the first entry
    if (!result.entries || result.entries.length === 0) {
      console.log(`⚠️ No homepage entries found for locale: ${locale}`);
      return null;
    }

    const entry = result.entries[0];
    console.log('✅ Homepage fetched successfully:', entry.title, `(locale: ${locale})`);
    return entry;
  } catch (error) {
    console.error(`❌ Error fetching homepage for locale ${locale}:`, error);
    return null;
  }
}

/**
 * Fetch all blog posts
 * @param limit - Maximum number of posts to fetch
 * @returns Array of blog posts
 */
export async function getAllBlogPosts(limit: number = 5): Promise<BlogPost[]> {
  try {
    console.log('🔵 Fetching all blog posts from Contentstack...');
    const result = await Stack.contentType('blog_post')
      .entry()
      .query()
      .where('status', QueryOperation.EQUALS, 'Published')
      .limit(limit)
      .find<BlogPost>();
      
    if (!result.entries || result.entries.length === 0) {
      console.log('⚠️ No blog posts found in Contentstack');
      return [];
    }
    
    console.log(`✅ Fetched ${result.entries.length} blog posts`);
    return result.entries;
  } catch (error) {
    console.error('❌ Error fetching blog posts:', error);
    return [];
  }
}

/**
 * Fetch blog posts by category
 * @param category - Category name
 * @param limit - Maximum number of posts to fetch
 * @returns Array of blog posts
 */
export async function getBlogPostsByCategory(
  category: string
): Promise<BlogPost[]> {
  try {
    console.log(`🔵 Fetching blog posts for category: ${category}`);
    
    const result = await Stack.contentType('blog_post')
      .entry()
      .query()
      .where('status', QueryOperation.EQUALS, 'Published')
      .where('category', QueryOperation.EQUALS, category)
      .find<BlogPost>();
    
    if (!result.entries || result.entries.length === 0) {
      console.log(`⚠️ No posts found for category: ${category}`);
      return [];
    }
    
    console.log(`✅ Found ${result.entries.length} posts for category: ${category}`);
    return result.entries;
  } catch (error) {
    console.error(`❌ Error fetching posts for category ${category}:`, error);
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
    const result = await Stack.contentType('blog_post')
      .entry()
      .query()
      .where('slug', QueryOperation.EQUALS, slug)
      .where('status', QueryOperation.EQUALS, 'Published')
      .find<BlogPost>();
      
    if (!result.entries || result.entries.length === 0) {
      return null;
    }
    
    return result.entries[0];
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch trending blog posts
 * @param limit - Maximum number of trending posts
 * @returns Array of trending blog posts
 */
export async function getTrendingPosts(limit: number = 5): Promise<BlogPost[]> {
  try {
    const result = await Stack.contentType('blog_post')
      .entry()
      .query()
      .where('status', QueryOperation.EQUALS, 'Published')
      .where('is_trending', QueryOperation.EQUALS, true)
      .limit(limit)
      .find<BlogPost>();
      
    if (!result.entries || result.entries.length === 0) {
      return [];
    }
    
    return result.entries;
  } catch (error) {
    console.error('Error fetching trending posts:', error);
    return [];
  }
}

export { Stack };
