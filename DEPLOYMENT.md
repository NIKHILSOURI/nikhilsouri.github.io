# Deployment Guide

This guide will help you deploy your portfolio to GitHub Pages.

## Prerequisites

1. A GitHub account
2. A repository named `nikhilsouri.github.io` (or your username)
3. Node.js and npm installed

## Step-by-Step Deployment

### 1. Prepare Your Repository

1. Make sure all your changes are committed:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   ```

2. Push to GitHub:
   ```bash
   git push origin main
   ```

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings**
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. Save the settings

### 3. Automatic Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:
- Build your project when you push to `main`
- Deploy it to GitHub Pages
- Make it available at `https://nikhilsouri.github.io`

### 4. Verify Deployment

1. Go to the **Actions** tab in your repository
2. You should see a workflow run called "Deploy to GitHub Pages"
3. Wait for it to complete (green checkmark)
4. Visit `https://nikhilsouri.github.io` to see your portfolio

## Manual Deployment (Alternative)

If you prefer to deploy manually:

1. Build the project:
   ```bash
   npm run build
   ```

2. Install gh-pages:
   ```bash
   npm install -g gh-pages
   ```

3. Deploy:
   ```bash
   gh-pages -d dist
   ```

## Important Notes

### Base Path Configuration

The `vite.config.ts` is configured for a repository named `username.github.io`. If your repo has a different name, update the `base` path in `vite.config.ts`:

```typescript
base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
```

### Static Assets

- Place your resume PDF in the `public` folder as `resume-sweden.pdf`
- The avatar image is currently loaded from `https://nikhilsouri.github.io/assets/images/avatar.jpg`
  - Either place it in `public/assets/images/avatar.jpg` or update the URL in `components/Hero.tsx`

### Contact Form

The contact form uses `mailto:` links which will open the user's default email client. This works on all platforms but requires the user to have an email client configured.

## Troubleshooting

### Build Fails

- Check that all dependencies are installed: `npm install`
- Verify Node.js version is 20+: `node --version`
- Check the Actions tab for error messages

### Site Not Loading

- Verify the base path in `vite.config.ts` matches your repository name
- Check that GitHub Pages is enabled in repository settings
- Wait a few minutes for DNS propagation

### Images Not Showing

- Ensure image paths are correct (use `/` for root-relative paths)
- Check that images are in the `public` folder or properly imported
- Verify the build output includes your assets

## Updating Your Portfolio

Simply push changes to the `main` branch, and GitHub Actions will automatically rebuild and redeploy your site.

