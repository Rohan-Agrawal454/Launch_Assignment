import type { Metadata } from "next";
import BlogDetail from "@/components/BlogDetail";
import { notFound } from "next/navigation";
import type { BlogPostDetail } from "@/types/blog";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  
  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} | AI Blog Platform`,
    description: post.excerpt,
  };
}

function getBlogPost(slug: string): BlogPostDetail | null {
  const posts: Record<string, BlogPostDetail> = {
    "introducing-gemini": {
      title: "Introducing Google Gemini: The Multimodal AI Revolution",
      excerpt: "An in-depth look at Google's Gemini AI and its capabilities",
      category: "Gemini",
      date: "February 7, 2026",
      author: "Dr. James Wilson",
      readTime: "10 min read",
      content: `Google Gemini represents a significant leap forward in AI capabilities, offering true multimodal understanding that processes text, images, audio, and video seamlessly. This comprehensive guide explores what makes Gemini special.

Gemini comes in three sizes: Nano (for on-device use), Pro (for general-purpose applications), and Ultra (for highly complex tasks). This tiered approach ensures optimal performance across different use cases and computing environments.

The multimodal nature is Gemini's standout feature. Unlike earlier models that bolt together separate systems for different modalities, Gemini was trained from the ground up on multimodal data. This enables more natural understanding of relationships between different types of information.

Visual understanding in Gemini is remarkably advanced. It can analyze complex images, understand spatial relationships, read text in images, and even reason about visual information. This opens possibilities for applications in education, accessibility, and creative tools.

Code generation and understanding is a key strength. Gemini excels at generating, explaining, and debugging code across multiple programming languages. Its deep understanding of programming concepts makes it valuable for developers at all skill levels.

Reasoning capabilities set Gemini apart. The model can tackle complex mathematical problems, scientific questions, and logical puzzles. Its chain-of-thought reasoning is more sophisticated than previous models, leading to more accurate and explainable outputs.

Integration with Google products makes Gemini highly accessible. It powers features in Google Search, Gmail, Docs, and other services. This seamless integration means millions of users benefit from Gemini without explicit setup.

API access enables developers to build custom applications. Google Cloud provides robust APIs for integrating Gemini into applications, with comprehensive documentation and examples. Rate limits and pricing are competitive with other leading AI services.

Safety and responsibility are built in. Gemini includes extensive safeguards against harmful outputs, bias mitigation, and content filtering. Google has implemented rigorous testing and red-teaming to ensure responsible deployment.

Looking ahead, Gemini's capabilities will continue expanding. Future versions promise even better multimodal understanding, longer context windows, and improved reasoning. The model represents Google's vision for the future of AI assistants.`,
      tags: ["Gemini", "Google AI", "multimodal AI", "AI models", "machine learning"],
    },
    "gemini-comparison": {
      title: "Gemini vs GPT-4: Comparing Top AI Models",
      excerpt: "A detailed comparison of capabilities and use cases",
      category: "Gemini",
      date: "February 4, 2026",
      author: "Michael Chen",
      readTime: "9 min read",
      content: `The AI landscape features two powerful contenders: Google Gemini and OpenAI's GPT-4. Understanding their strengths and differences helps choose the right tool for your needs.

Performance on benchmarks shows both models excel, with different strengths. Gemini Ultra matches or exceeds GPT-4 on many academic benchmarks, particularly in multimodal tasks. GPT-4 still leads in certain language understanding tasks.

Multimodal capabilities differ significantly. Gemini was designed as multimodal from the start, processing images, audio, and video natively. GPT-4's vision capabilities, while impressive, were added after initial training.

Code generation quality is comparable but with subtle differences. Gemini often produces more concise code and better handles low-resource languages. GPT-4 excels at explaining code and suggesting refactoring improvements.

Context window sizes matter for long-form tasks. GPT-4 Turbo offers up to 128K tokens. Gemini models currently support up to 32K tokens, though this is being expanded. Longer contexts enable processing entire documents or codebases.

Pricing structures differ. OpenAI's pricing is per-token with different rates for input and output. Google's pricing is similar but often more competitive for high-volume use. Both offer tiered pricing based on model size.

Integration ecosystems are distinct strengths. GPT-4 powers ChatGPT, Microsoft Copilot, and countless third-party applications. Gemini integrates deeply with Google Workspace and Cloud services. Choose based on your existing toolchain.

Response speed varies by model version. GPT-4 Turbo is optimized for speed while maintaining quality. Gemini Pro offers fast responses, with Ultra sacrificing some speed for maximum capability.

Safety and alignment approaches differ philosophically. Both companies invest heavily in AI safety, but with different methodologies. OpenAI uses RLHF extensively, while Google employs a combination of techniques including their proprietary safety systems.

API features and developer experience are both excellent but different. OpenAI's API is more mature with extensive third-party tooling. Google Cloud's API benefits from integration with GCP services.

The best choice depends on your specific needs. For Google Workspace integration and multimodal tasks, Gemini excels. For ecosystem maturity and certain language tasks, GPT-4 leads. Many developers use both, choosing based on the specific task.`,
      tags: ["Gemini", "GPT-4", "AI comparison", "model evaluation", "benchmarking"],
    },
    "building-with-gemini": {
      title: "Building Applications with Gemini API",
      excerpt: "A developer's guide to integrating Gemini",
      category: "Gemini",
      date: "January 31, 2026",
      author: "Alex Thompson",
      readTime: "12 min read",
      content: `Building with Gemini API opens powerful possibilities for developers. This comprehensive guide covers setup, best practices, and common patterns for creating Gemini-powered applications.

Setup begins with Google Cloud Platform. Create a project, enable the Generative AI API, and generate API credentials. The Google Cloud Console provides clear documentation and setup wizards.

Authentication uses standard GCP patterns. Service accounts work for backend applications, while OAuth2 is appropriate for user-facing applications. API keys are simplest for development but service accounts are recommended for production.

The Python SDK provides the most mature development experience. Install it via pip, initialize with your credentials, and you're ready to make API calls. JavaScript/TypeScript and other language SDKs are also available.

Making your first API call is straightforward. Initialize the model, provide your prompt, and await the response. The API handles tokenization, model selection, and response generation automatically.

Multimodal inputs are Gemini's superpower. You can include images, audio, or video alongside text prompts. The API accepts various formats, including URLs, base64-encoded data, or Google Cloud Storage references.

Streaming responses improve user experience. Instead of waiting for complete generation, stream tokens as they're generated. This makes applications feel more responsive, especially for long outputs.

Error handling is crucial for robust applications. The API returns detailed error messages. Implement retry logic with exponential backoff for transient failures. Rate limiting requires request throttling and queuing.

Prompt optimization significantly impacts results and costs. Craft clear, specific prompts. Use system instructions to set behavior. Experiment with temperature and top-p settings to control randomness and creativity.

Caching frequently used contexts reduces costs and latency. If you repeatedly use the same system message or large context, leverage caching to avoid reprocessing.

Safety settings allow customization. Configure thresholds for different content categories. Balance safety with your application's needs, being more restrictive for user-generated content.

Monitoring and analytics are essential. Log API calls, track usage, monitor latency, and analyze costs. Google Cloud's operations suite provides comprehensive monitoring capabilities.

Best practices include validating inputs, sanitizing outputs, implementing fallbacks, testing thoroughly, and staying updated with API changes. Regular testing ensures your application remains robust as the API evolves.`,
      tags: ["Gemini API", "development", "integration", "tutorial", "Google Cloud"],
    },
  };

  return posts[slug] || null;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = [
    {
      title: "Gemini vs GPT-4 Comparison",
      excerpt: "Compare the leading AI models",
      href: "/blog/gemini/gemini-comparison",
    },
    {
      title: "Multimodal AI Explained",
      excerpt: "Understanding multimodal AI systems",
      href: "/blog/gemini/multimodal-explained",
    },
  ];

  return (
    <BlogDetail
      title={post.title}
      category={post.category}
      date={post.date}
      author={post.author}
      readTime={post.readTime}
      content={post.content}
      tags={post.tags}
      relatedPosts={relatedPosts}
    />
  );
}
