# Contentstack Setup Guide

This directory contains all the necessary files to set up your Contentstack CMS with content models and sample entries.

## 📁 Directory Structure

```
contentstack-setup/
├── content-models/       # JSON schemas for content types
│   ├── blog-post.json   # Blog post content model
│   └── author.json      # Author content model
├── sample-entries/      # Sample data for each category
│   ├── ai-posts.json
│   ├── generative-ai-posts.json
│   ├── chatgpt-posts.json
│   ├── gemini-posts.json
│   └── authors.json
└── README.md           # This file
```

## 🚀 Quick Setup

### Option 1: Manual Setup (Recommended for Learning)

#### Step 1: Create Content Models

1. Log in to your Contentstack account
2. Navigate to your stack
3. Go to "Content Models" in the sidebar
4. Click "New Content Type"
5. Choose "Import from file" and upload:
   - `content-models/blog-post.json`
   - `content-models/author.json`

#### Step 2: Create Author Entries

1. Go to "Entries" > "Author"
2. Click "Create New"
3. Use data from `sample-entries/authors.json` to create 5 author profiles
4. Publish each author entry

#### Step 3: Create Blog Post Entries

1. Go to "Entries" > "Blog Post"
2. Click "Create New"
3. Use data from the following files to create posts:
   - `sample-entries/ai-posts.json` (3 posts)
   - `sample-entries/generative-ai-posts.json` (3 posts)
   - `sample-entries/chatgpt-posts.json` (3 posts)
   - `sample-entries/gemini-posts.json` (3 posts)
4. For each post:
   - Copy the fields from the JSON
   - Select an author (reference field)
   - Publish the entry

### Option 2: Using Contentstack CLI (Faster)

```bash
# Install Contentstack CLI
npm install -g @contentstack/cli

# Login to your stack
csdx auth:login

# Set your stack
csdx cm:stacks:export --alias <your-stack-alias>

# Import content types
csdx cm:export-to-stack --data-dir ./content-models

# Import entries
csdx cm:entries:publish --content-types author,blog_post
```

### Option 3: Using Management API (Programmatic)

You can use the Contentstack Management API to programmatically create content types and entries.

See the API documentation: https://www.contentstack.com/docs/developers/apis/content-management-api/

## 📝 Content Models Details

### Blog Post Content Model

**UID:** `blog_post`

**Fields:**
- `title` (Text) - Required
- `slug` (Text) - Required, Unique
- `excerpt` (Text) - Required
- `content` (Rich Text) - Required
- `category` (Select) - AI, Generative AI, ChatGPT, Gemini
- `author` (Reference to Author) - Optional
- `featured_image` (File) - Optional
- `tags` (Tags) - Optional
- `published_date` (Date) - Required
- `seo_metadata` (Group) - Meta title, description, keywords
- `status` (Select) - Draft, Review, Published
- `is_trending` (Boolean) - Optional
- `view_count` (Number) - Optional

### Author Content Model

**UID:** `author`

**Fields:**
- `name` (Text) - Required
- `bio` (Text) - Optional
- `avatar` (File) - Optional
- `email` (Text) - Optional
- `social_links` (Group, Multiple) - Platform and URL

## 🎯 Sample Data Overview

### Authors (5 profiles)
- Dr. Sarah Johnson - AI Researcher
- Michael Chen - ML Engineer
- Emily Rodriguez - Tech Writer
- Dr. James Wilson - Medical AI Specialist
- Alex Thompson - Full-stack Developer

### Blog Posts (12 total)
- **AI Category** (3 posts)
  - Understanding AI
  - ML Best Practices
  - Future of AI
  
- **Generative AI Category** (3 posts)
  - Introduction to Generative AI
  - LLMs Explained
  - Creative Applications
  
- **ChatGPT Category** (3 posts)
  - Getting Started with ChatGPT
  - Advanced Prompting
  - ChatGPT for Business
  
- **Gemini Category** (3 posts)
  - Introducing Gemini
  - Gemini vs GPT-4
  - Building with Gemini API

## ⚙️ Environment Configuration

After creating your content in Contentstack, update your `.env.local` file:

```bash
# Copy the example file
cp ../apps/blog/.env.example ../apps/blog/.env.local

# Edit with your Contentstack credentials
CONTENTSTACK_API_KEY=your_api_key_here
CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token_here
CONTENTSTACK_ENVIRONMENT=production
CONTENTSTACK_REGION=us
```

## 🔍 Finding Your Credentials

1. **API Key & Delivery Token:**
   - Go to Settings > Tokens
   - Copy your Delivery Token
   - API Key is in Settings > Stack Details

2. **Environment:**
   - Default is usually "production"
   - Check Settings > Environments

3. **Region:**
   - North America: `us`
   - Europe: `eu`
   - Azure NA: `azure-na`
   - Azure EU: `azure-eu`
   - GCP NA: `gcp-na`

## ✅ Verification

After setup, verify everything is working:

```bash
# Run the development server
npm run dev

# Visit these pages and check for content:
# - http://localhost:3000/blog/ai
# - http://localhost:3000/blog/generativeai
# - http://localhost:3000/blog/chatgpt
# - http://localhost:3000/blog/gemini
# - http://localhost:3000/blog/latest
```

## 📚 Additional Resources

- [Contentstack Documentation](https://www.contentstack.com/docs/)
- [Content Modeling Best Practices](https://www.contentstack.com/docs/content-managers/content-modeling/)
- [Contentstack CLI Guide](https://www.contentstack.com/docs/developers/cli/)
- [Management API Reference](https://www.contentstack.com/docs/developers/apis/content-management-api/)

## 🆘 Troubleshooting

**Issue: Content not appearing**
- Verify entries are published
- Check environment configuration
- Ensure API keys are correct

**Issue: Reference field not working**
- Create author entries first
- Publish author entries before creating blog posts

**Issue: Import errors**
- Ensure JSON files are valid
- Check Contentstack CLI is latest version
- Verify stack permissions

## 📞 Support

For issues with this setup, please refer to:
- [Contentstack Community](https://www.contentstack.com/community/)
- [GitHub Issues](https://github.com/contentstack)
