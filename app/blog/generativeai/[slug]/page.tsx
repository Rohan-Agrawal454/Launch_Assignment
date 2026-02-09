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
    "intro-to-generative-ai": {
      title: "Introduction to Generative AI: Creating the Future",
      excerpt: "Understanding how generative models create new content",
      category: "Generative AI",
      date: "February 5, 2026",
      author: "Emily Rodriguez",
      readTime: "10 min read",
      content: `Generative AI represents a paradigm shift in artificial intelligence, moving beyond analysis and prediction to creation. These systems can generate entirely new content—text, images, music, code—that didn't exist before.

At the heart of generative AI are models trained on vast amounts of data, learning the patterns and structures that define different types of content. Large Language Models (LLMs) like GPT-4 learn from text, while diffusion models like DALL-E and Stable Diffusion learn from images.

The transformer architecture, introduced in 2017, revolutionized generative AI. Its attention mechanism allows models to understand context and relationships in data, enabling them to generate coherent, contextually appropriate content.

Text generation has come remarkably far. Modern LLMs can write essays, code, poetry, and even complete books. They understand nuance, follow complex instructions, and adapt their style based on context. This has applications in content creation, customer service, education, and more.

Image generation has exploded in popularity. Text-to-image models can create stunning artwork from simple descriptions. These tools are transforming creative industries, enabling rapid prototyping in design, and opening new possibilities for artistic expression.

Code generation is changing software development. AI assistants can write functions, debug code, and even architect entire applications. While they don't replace developers, they significantly boost productivity and help with repetitive tasks.

The potential applications are boundless. In drug discovery, generative AI designs new molecular structures. In architecture, it explores design possibilities. In entertainment, it creates game assets and animations. The technology is democratizing creativity and accelerating innovation.

However, generative AI raises important questions. Issues of copyright, authenticity, misinformation, and the impact on creative professions must be addressed thoughtfully. As these tools become more powerful, developing ethical guidelines and appropriate safeguards becomes increasingly important.`,
      tags: ["generative AI", "LLMs", "image generation", "content creation", "AI ethics"],
    },
    "llms-explained": {
      title: "Large Language Models Explained: Architecture and Training",
      excerpt: "A deep dive into LLM architecture and training methodologies",
      category: "Generative AI",
      date: "February 2, 2026",
      author: "Michael Chen",
      readTime: "12 min read",
      content: `Large Language Models (LLMs) have transformed natural language processing, enabling machines to understand and generate human-like text with unprecedented quality. But how do these remarkable systems work?

LLMs are built on the transformer architecture, which uses self-attention mechanisms to process text. Unlike earlier recurrent models, transformers can process entire sequences in parallel, making them faster to train and better at capturing long-range dependencies.

The attention mechanism is the key innovation. It allows the model to focus on relevant parts of the input when processing each word, similar to how humans pay attention to specific words when understanding a sentence. Multi-head attention enables the model to attend to different aspects simultaneously.

Training an LLM involves two main phases: pre-training and fine-tuning. During pre-training, the model learns from massive text corpora, predicting missing words or next words in sequences. This unsupervised learning helps the model develop a broad understanding of language.

Fine-tuning adapts the pre-trained model for specific tasks. Using smaller, task-specific datasets, the model's parameters are adjusted to excel at particular applications like question answering, translation, or summarization.

The scale of modern LLMs is staggering. Models like GPT-4 have hundreds of billions of parameters and are trained on trillions of words. This scale requires enormous computational resources—training can take weeks or months on clusters of thousands of GPUs.

Reinforcement Learning from Human Feedback (RLHF) has become crucial for aligning LLMs with human values and preferences. Human trainers rank model outputs, and the model learns to generate responses that humans prefer. This makes models more helpful, harmless, and honest.

Prompt engineering has emerged as a critical skill. The way you formulate prompts significantly affects output quality. Techniques like few-shot learning, chain-of-thought prompting, and system messages help extract better performance from LLMs.

Looking ahead, research focuses on improving efficiency, reducing hallucinations, enhancing reasoning capabilities, and developing models that can learn continuously from new information. The field is advancing rapidly, with new breakthroughs emerging regularly.`,
      tags: ["LLMs", "transformers", "NLP", "deep learning", "neural networks"],
    },
    "creative-applications-generative-ai": {
      title: "Creative Applications of AI",
      excerpt: "How artists and designers are leveraging generative AI",
      category: "Generative AI",
      date: "January 30, 2026",
      author: "Alex Thompson",
      readTime: "8 min read",
      content: `Generative AI is revolutionizing creative industries, empowering artists, designers, and creators with powerful new tools. From visual art to music composition, AI is becoming an indispensable creative partner.

In visual arts, AI image generators have democratized digital art creation. Artists use tools like Midjourney, DALL-E, and Stable Diffusion to explore ideas quickly, generate references, and create finished pieces. The technology enables experimentation at a pace impossible with traditional methods.

Graphic designers leverage AI for rapid prototyping and iteration. Logo design, poster creation, and marketing materials can be generated and refined quickly. AI assists with tasks like background removal, style transfer, and image enhancement, freeing designers to focus on creative direction.

Music composition has been transformed by AI. Systems can generate melodies, harmonies, and entire arrangements in various styles. Musicians use AI for inspiration, to overcome creative blocks, and to explore new sonic territories. AI-assisted music production tools help with mixing, mastering, and sound design.

In gaming and 3D design, AI generates textures, models, and environments. This accelerates development pipelines and enables smaller teams to create rich, detailed worlds. Procedural generation powered by AI creates unique content for each player.

Video and animation production benefit from AI-powered tools for rotoscoping, deepfakes (used ethically), and special effects. AI can generate synthetic footage, animate still images, and assist with color grading and editing.

Writing and content creation have been fundamentally changed. Authors use AI for brainstorming, drafting, and editing. While the human creative vision remains essential, AI handles routine writing tasks and helps overcome writer's block.

Fashion design is being revolutionized. AI generates clothing designs, predicts trends, and even creates virtual fashion for digital spaces. Designers explore variations and combinations impossible to manually iterate through.

The key to successful creative AI use is treating it as a collaborator, not a replacement. The most impressive work combines human creativity, taste, and direction with AI's generative power and speed. This partnership amplifies human creativity rather than replacing it.`,
      tags: ["AI art", "creative AI", "design", "innovation", "digital creativity"],
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
      title: "LLMs Explained",
      excerpt: "Understanding large language model architecture",
      href: "/blog/generativeai/llms-explained",
    },
    {
      title: "Prompt Engineering Guide",
      excerpt: "Master the art of crafting effective AI prompts",
      href: "/blog/generativeai/prompt-engineering",
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
