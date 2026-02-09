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
    "getting-started-chatgpt": {
      title: "Getting Started with ChatGPT: A Beginner's Guide",
      excerpt: "Everything you need to know to start using ChatGPT effectively",
      category: "ChatGPT",
      date: "February 6, 2026",
      author: "Emily Rodriguez",
      readTime: "9 min read",
      content: `ChatGPT has become an essential tool for millions of users worldwide. Whether you're a student, professional, or creative, understanding how to use ChatGPT effectively can dramatically boost your productivity.

ChatGPT is a large language model developed by OpenAI, trained on vast amounts of text data. It can understand and generate human-like text, making it useful for a wide range of tasks from answering questions to helping with creative writing.

Getting started is simple. Visit the ChatGPT website, create an account, and you're ready to go. The free tier provides access to GPT-3.5, while ChatGPT Plus ($20/month) offers GPT-4, faster responses, and priority access during peak times.

The key to getting good results from ChatGPT is writing clear, specific prompts. Instead of asking "Tell me about AI," try "Explain artificial intelligence in simple terms suitable for a 10-year-old." The more context and detail you provide, the better the response.

ChatGPT excels at many tasks. It can explain complex concepts, write and debug code, draft emails, brainstorm ideas, summarize long texts, translate languages, and much more. Experiment to discover what works best for your needs.

Understanding ChatGPT's limitations is important. It can sometimes provide incorrect information (hallucinations), has a knowledge cutoff date, cannot browse the internet (in the base version), and should not be relied upon for medical, legal, or financial advice.

For best results, iterate on your prompts. If the first response isn't quite right, ask follow-up questions or request revisions. ChatGPT maintains conversation context, so you can have natural back-and-forth exchanges.

Privacy and ethical use are important considerations. Don't share sensitive personal information. Be aware that conversations may be reviewed to improve the system. Always verify important information from authoritative sources.

Advanced users can leverage techniques like role-playing (asking ChatGPT to act as an expert), providing examples (few-shot learning), and breaking complex tasks into steps. These approaches significantly improve output quality.

The future of ChatGPT and similar tools is exciting. As the technology improves, we'll see more capable, reliable, and specialized versions. Learning to work effectively with AI assistants is becoming an essential skill for the modern world.`,
      tags: ["ChatGPT", "beginners guide", "AI assistant", "OpenAI", "productivity"],
    },
    "advanced-prompting": {
      title: "Advanced ChatGPT Prompting Techniques",
      excerpt: "Master the art of prompt engineering to get better results",
      category: "ChatGPT",
      date: "February 3, 2026",
      author: "Dr. Sarah Johnson",
      readTime: "11 min read",
      content: `Prompt engineering is the art and science of crafting inputs that elicit the best possible outputs from language models like ChatGPT. Mastering these techniques can dramatically improve your results.

Start with clear role assignment. Begin your prompt by asking ChatGPT to assume a specific role: "You are an expert Python developer" or "Act as a marketing strategist." This context helps the model frame its responses appropriately.

Few-shot learning is powerful. Instead of just describing what you want, provide examples of input-output pairs. This shows ChatGPT exactly what format and style you're looking for, leading to more consistent results.

Chain-of-thought prompting improves reasoning. Add "Let's think step by step" or "Explain your reasoning" to your prompts. This encourages the model to break down complex problems and show its work, often leading to more accurate answers.

Use system messages effectively. In API usage or advanced interfaces, system messages set the behavior and personality of the assistant. These are processed before user messages and have a strong influence on responses.

Constrain outputs when needed. Specify desired length, format, or structure. "Respond in exactly 3 bullet points" or "Write a JSON object with these specific keys" helps ensure you get usable output.

Iterative refinement is key. Start with a basic prompt, review the output, then ask follow-up questions to refine the response. "Make it more concise," "Add more technical details," or "Rephrase for a younger audience" helps hone in on exactly what you need.

Temperature and other parameters (in API usage) control randomness. Lower temperature (0.1-0.3) gives consistent, focused outputs. Higher temperature (0.7-1.0) increases creativity and variation. Adjust based on your use case.

For complex tasks, break them down. Instead of one massive prompt, create a sequence of prompts that build on each other. This multi-turn approach helps manage complexity and maintains coherence.

Negative prompting specifies what to avoid. "Explain quantum computing without using mathematical equations" or "Summarize the article but don't include the author's opinions" helps filter unwanted content.

Always validate critical outputs. ChatGPT can be confidently wrong. For important decisions or factual claims, verify information from authoritative sources. Use ChatGPT as a starting point, not the final authority.`,
      tags: ["prompt engineering", "ChatGPT", "advanced techniques", "productivity", "AI"],
    },
    "chatgpt-for-business": {
      title: "ChatGPT for Business: Enterprise Use Cases",
      excerpt: "How businesses are leveraging ChatGPT for productivity",
      category: "ChatGPT",
      date: "January 29, 2026",
      author: "Alex Thompson",
      readTime: "10 min read",
      content: `Businesses worldwide are discovering ChatGPT's potential to transform operations, boost productivity, and enhance customer experiences. Here's how enterprises are successfully deploying AI assistants.

Customer support has been revolutionized. ChatGPT-powered chatbots handle common inquiries, provide instant responses 24/7, and escalate complex issues to human agents. This reduces response times and support costs while improving customer satisfaction.

Content creation and marketing teams use ChatGPT to generate blog posts, social media content, email campaigns, and ad copy. While human oversight remains essential, AI accelerates the creation process and helps overcome creative blocks.

Sales teams leverage ChatGPT for personalizing outreach, drafting proposals, and preparing for client meetings. The AI can analyze customer data and suggest tailored talking points, improving conversion rates.

Human resources departments use ChatGPT for drafting job descriptions, screening applications, onboarding materials, and internal communications. This frees HR professionals to focus on strategic initiatives and employee engagement.

Software development teams integrate ChatGPT for code generation, documentation, bug fixing, and code review. Developers report significant productivity gains, especially for boilerplate code and repetitive tasks.

Data analysis becomes more accessible. ChatGPT can help interpret data, suggest analysis approaches, and even generate code for data processing. Non-technical team members can extract insights without deep statistical knowledge.

Legal and compliance teams use AI for document review, contract analysis, and research. While not replacing lawyers, ChatGPT accelerates initial reviews and helps identify relevant precedents and regulations.

Training and education benefit immensely. ChatGPT creates personalized learning materials, answers employee questions, and provides on-demand explanations of complex topics. This supports continuous learning cultures.

Security and privacy are paramount in enterprise deployment. Use ChatGPT Enterprise or Azure OpenAI Service for enhanced data protection. Implement clear usage policies regarding sensitive information.

Best practices for business adoption include starting with pilot projects, gathering user feedback, providing training, measuring ROI, and scaling gradually. Successful implementations balance automation with human oversight.`,
      tags: ["ChatGPT", "business", "enterprise", "productivity", "AI adoption"],
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
      title: "Advanced Prompting Techniques",
      excerpt: "Master the art of prompt engineering",
      href: "/blog/chatgpt/advanced-prompting",
    },
    {
      title: "ChatGPT API Integration",
      excerpt: "Build applications with ChatGPT API",
      href: "/blog/chatgpt/api-integration",
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
