import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Blog Platform - Latest AI News, Tutorials & Insights",
  description: "Your premier destination for artificial intelligence, machine learning, ChatGPT, Gemini AI, and generative AI content.",
  keywords: ["AI", "Artificial Intelligence", "Machine Learning", "ChatGPT", "Gemini AI", "Generative AI", "Blog"],
  authors: [{ name: "AI Blog Platform Team" }],
  openGraph: {
    title: "AI Blog Platform",
    description: "Latest AI News, Tutorials & Insights",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
