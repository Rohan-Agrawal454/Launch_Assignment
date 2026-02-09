import type { Metadata } from "next";
import BlogDetail from "@/components/BlogDetail";
import { notFound } from "next/navigation";
import type { BlogPostDetail } from "@/types/blog";

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | AI Blog Platform`,
    description: post.excerpt,
  };
}

// Dummy blog data - In production, fetch from Contentstack
function getBlogPost(slug: string): BlogPostDetail | null {
  const posts: Record<string, BlogPostDetail> = {
    "understanding-ai": {
      title: "Understanding Artificial Intelligence: A Comprehensive Guide",
      excerpt: "A comprehensive guide to AI fundamentals and applications",
      category: "AI",
      date: "February 1, 2026",
      author: "Dr. Sarah Johnson",
      readTime: "8 min read",
      content: `Artificial Intelligence (AI) has become one of the most transformative technologies of our time, reshaping industries and redefining what's possible in computing. From powering virtual assistants to enabling autonomous vehicles, AI is everywhere.

At its core, AI is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction. The field encompasses various subfields, including machine learning, deep learning, natural language processing, and computer vision.

Machine learning, a subset of AI, enables systems to learn and improve from experience without being explicitly programmed. Deep learning, inspired by the structure of the human brain, uses neural networks with multiple layers to analyze various factors of data.

The applications of AI are vast and growing. In healthcare, AI algorithms can analyze medical images to detect diseases earlier and more accurately than human doctors. In finance, AI powers fraud detection systems and algorithmic trading. In transportation, self-driving cars use AI to navigate roads and make split-second decisions.

However, with great power comes great responsibility. As AI systems become more sophisticated, we must address ethical concerns around privacy, bias, job displacement, and the potential for misuse. The development of AI must be guided by principles that ensure it benefits humanity as a whole.

The future of AI is incredibly promising. As computing power increases and algorithms become more sophisticated, we'll see AI tackle increasingly complex problems. From climate change to disease eradication, AI has the potential to help solve some of humanity's greatest challenges.`,
      tags: ["artificial intelligence", "machine learning", "deep learning", "neural networks", "AI ethics"],
    },
    "ml-best-practices": {
      title: "Machine Learning Best Practices for 2026",
      excerpt: "Essential practices for building robust ML models",
      category: "AI",
      date: "January 28, 2026",
      author: "Michael Chen",
      readTime: "6 min read",
      content: `Building production-ready machine learning systems requires more than just training models. It demands a comprehensive approach that encompasses data quality, model evaluation, deployment strategies, and continuous monitoring.

Data is the foundation of any ML system. Before diving into model training, ensure your data is clean, representative, and properly labeled. Implement robust data validation pipelines to catch issues early. Remember: garbage in, garbage out.

When it comes to model selection, don't always reach for the latest deep learning architecture. Start simple with baseline models like logistic regression or decision trees. Complex models should only be used when simpler approaches fail to meet requirements.

Feature engineering remains one of the most impactful aspects of ML. Understanding your domain and creating meaningful features often yields better results than throwing more data at a complex model. Document your feature engineering process thoroughly.

Model evaluation goes beyond accuracy metrics. Consider precision, recall, F1 score, and business-specific metrics. Always validate on data that mimics production conditions. Cross-validation helps ensure your model generalizes well.

Deployment is where many ML projects fail. Use containerization (Docker, Kubernetes) for reproducible deployments. Implement A/B testing to safely roll out new models. Monitor model performance continuously and have rollback strategies ready.

MLOps practices are essential for maintaining ML systems at scale. Version control your data, code, and models. Automate training pipelines. Set up alerts for model drift and performance degradation.

Finally, remember that ML models are not set-it-and-forget-it solutions. They require ongoing maintenance, retraining with new data, and continuous improvement. Build this into your project timeline and resource planning.`,
      tags: ["machine learning", "MLOps", "best practices", "model deployment", "data science"],
    },
    "future-of-ai": {
      title: "The Future of AI: Predictions and Trends",
      excerpt: "Exploring upcoming AI trends that will shape the next decade",
      category: "AI",
      date: "January 25, 2026",
      author: "Dr. Sarah Johnson",
      readTime: "7 min read",
      content: `The artificial intelligence landscape is evolving at an unprecedented pace. As we look toward the future, several key trends are emerging that will shape how we interact with and benefit from AI technology.

Multimodal AI systems that can process and understand multiple types of input simultaneously—text, images, audio, and video—are becoming increasingly sophisticated. These systems will enable more natural and intuitive human-AI interactions.

Edge AI is moving computation from the cloud to local devices. This shift reduces latency, enhances privacy, and enables AI applications in environments with limited connectivity. Expect to see more powerful AI running directly on smartphones, IoT devices, and embedded systems.

Explainable AI (XAI) is addressing the "black box" problem. As AI systems make increasingly important decisions, the ability to understand and explain their reasoning becomes critical. New techniques are making AI models more interpretable and trustworthy.

AI-assisted creativity is flourishing. From generating art and music to assisting with writing and design, AI is becoming a powerful creative partner. These tools augment human creativity rather than replace it.

Quantum computing and AI are converging. When quantum computers mature, they could revolutionize AI by solving optimization problems that are currently intractable, leading to breakthrough in drug discovery, materials science, and more.

The democratization of AI continues. Low-code and no-code AI platforms are making advanced AI capabilities accessible to non-experts. This democratization will accelerate AI adoption across industries and unlock new applications.

However, challenges remain. Addressing AI bias, ensuring data privacy, managing AI's environmental impact, and establishing appropriate governance frameworks are critical priorities that must be tackled as the technology advances.`,
      tags: ["future tech", "AI trends", "predictions", "innovation", "emerging technology"],
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
      title: "Machine Learning Best Practices",
      excerpt: "Essential practices for building robust ML models",
      href: "/blog/ai/ml-best-practices",
    },
    {
      title: "Introduction to Deep Learning",
      excerpt: "Understanding neural networks and their applications",
      href: "/blog/ai/deep-learning-intro",
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
