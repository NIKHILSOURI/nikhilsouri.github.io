# GitHub Pages Setup Instructions

## ✅ Code Successfully Pushed!

Your portfolio code has been pushed to GitHub. Now you need to enable GitHub Pages.

## Step-by-Step Setup

### 1. Enable GitHub Pages

1. Go to: https://github.com/NIKHILSOURI/nikhilsouri.github.io/settings/pages
2. Under **Source**, select **GitHub Actions** (NOT "Deploy from a branch")
3. Click **Save**

### 2. Check Deployment Status

1. Go to the **Actions** tab: https://github.com/NIKHILSOURI/nikhilsouri.github.io/actions
2. You should see a workflow run called "Deploy to GitHub Pages"
3. Wait for it to complete (green checkmark = success)

### 3. Your Site Will Be Live At

**https://nikhilsouri.github.io**

It may take 1-2 minutes after the workflow completes for the site to be accessible.

## Troubleshooting

### If the workflow fails:
- Check the Actions tab for error messages
- Make sure Node.js version is compatible (workflow uses Node 20)
- Verify all files were committed correctly

### If the site doesn't load:
- Wait a few minutes for DNS propagation
- Clear your browser cache
- Check the Actions tab to ensure deployment succeeded

### If you see a 404:
- Make sure GitHub Pages is enabled with **GitHub Actions** as the source
- Check that the workflow completed successfully
- Try accessing the site in an incognito/private window

## Next Steps

Once your site is live:
- Test the contact form
- Verify all links work
- Check mobile responsiveness
- Share your portfolio URL!

## Updating Your Portfolio

Simply push changes to the `main` branch:
```bash
git add .
git commit -m "Update portfolio"
git push
```

The workflow will automatically rebuild and redeploy your site.

