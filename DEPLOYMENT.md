# Deployment Guide

## Quick Deploy to Vercel

This project is configured and ready to deploy to [Vercel](https://vercel.com). 

### Option 1: One-Click Deploy
Click the button below to deploy instantly:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2FDSA_Map)

### Option 2: Manual Deployment

1. Push your code to GitHub, GitLab, or Bitbucket
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New... > Project"
4. Import your repository
5. Configure environment variables (if needed):
   - `NEXT_PUBLIC_USER_NAME`: Display name for the dashboard greeting (default: "there")
6. Click "Deploy"

Vercel will automatically:
- Build your Next.js application
- Generate static pages and optimize dynamic routes
- Deploy to a global CDN with auto-scaling

### Environment Variables

Set these in your Vercel project settings:

- **NEXT_PUBLIC_USER_NAME** (optional): Display name for the user greeting. Default is "there". Example: "Ankit"

### Production Checklist

- ✅ TypeScript strict mode enabled
- ✅ ESLint configured with Next.js best practices
- ✅ Security headers configured
- ✅ Metadata optimized for SEO
- ✅ Image optimization enabled
- ✅ Build optimization with SWC minification

### Local Development

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your values:
   ```
   NEXT_PUBLIC_USER_NAME=Your Name
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

### Build & Test

Before deploying, test the production build locally:

```bash
npm run build
npm start
```

### Monitoring & Logs

After deployment:
- View deployment logs in Vercel Dashboard
- Monitor performance in Vercel Analytics
- Check Real Experience Scores (Web Vitals)

### Rollback

To rollback to a previous deployment:
1. Go to Vercel Dashboard
2. Select your project
3. Go to "Deployments"
4. Click the three dots on a previous deployment
5. Select "Promote to Production"

### Custom Domain

To add a custom domain:
1. Go to Project Settings > Domains
2. Enter your custom domain
3. Update your domain's DNS records according to Vercel's instructions
4. Vercel will auto-generate an SSL certificate

### Support

For deployment issues:
- Check [Vercel Docs](https://vercel.com/docs)
- Review [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
