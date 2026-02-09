export interface BlogPostDetail {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  content: string;
  tags: string[];
}

export interface RelatedPost {
  title: string;
  excerpt: string;
  href: string;
}
