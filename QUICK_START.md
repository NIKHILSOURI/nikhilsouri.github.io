# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```

## ✅ What's Been Fixed

- ✅ Fixed `index.html` - Removed duplicate scripts and CDN imports
- ✅ Installed all dependencies
- ✅ Enhanced contact form with validation and user feedback
- ✅ Configured GitHub Pages deployment
- ✅ Created GitHub Actions workflow for automatic deployment
- ✅ Set up proper project structure

## 📝 Before Deploying

1. **Add your resume**: Place `resume-sweden.pdf` in the `public/` folder
2. **Verify avatar image**: The avatar is loaded from `https://nikhilsouri.github.io/assets/images/avatar.jpg`
   - Either place it in `public/assets/images/avatar.jpg` or update the URL in `components/Hero.tsx`

## 🧪 Testing Checklist

- [ ] All sections load correctly (Home, About, Skills, Experience, Projects, Contact)
- [ ] Navigation works between sections
- [ ] Contact form validates email and shows success/error messages
- [ ] Social media links work
- [ ] Resume download works (after adding the PDF)
- [ ] 3D background is interactive
- [ ] Sound effects work (toggle with volume button)
- [ ] Responsive design works on mobile

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy:**
1. Push to GitHub: `git push origin main`
2. Enable GitHub Pages in repository settings (use GitHub Actions)
3. Wait for deployment to complete
4. Visit `https://nikhilsouri.github.io`

## 🎨 Customization

- Update personal info in `constants.ts`
- Modify colors in component files (search for `cyan-500`, `#00f0ff`, etc.)
- Change fonts in `index.html` (Orbitron, Rajdhani)
- Adjust 3D galaxy in `components/StarBackground.tsx`

## 🐛 Troubleshooting

**Port already in use?**
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Build errors?**
- Clear cache: `rm -rf node_modules dist && npm install`
- Check Node.js version: `node --version` (should be 20+)

**Contact form not working?**
- The form uses `mailto:` links - ensure you have an email client configured
- Test in different browsers

## 📚 Documentation

- [README.md](./README.md) - Project overview
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment guide

