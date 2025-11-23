<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Galactic Portfolio - Nikhil Souri

A futuristic, space-themed portfolio website built with React, TypeScript, Three.js, and Framer Motion.

## Features

- 🚀 **3D Interactive Galaxy Background** - Powered by React Three Fiber
- 🎨 **Modern UI/UX** - Futuristic design with smooth animations
- 📱 **Fully Responsive** - Works on all devices
- 🎵 **Sound Effects** - Optional ambient sounds and interactions
- 📧 **Contact Form** - Integrated contact form with email functionality
- ⚡ **Fast & Optimized** - Built with Vite for optimal performance

## Run Locally

**Prerequisites:** Node.js 20+ and npm

1. Clone the repository:
   ```bash
   git clone https://github.com/NIKHILSOURI/nikhilsouri.github.io.git
   cd nikhilsouri.github.io
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deploy to GitHub Pages

### Automatic Deployment (Recommended)

1. Go to your repository settings on GitHub
2. Navigate to **Pages** under **Settings**
3. Under **Source**, select **GitHub Actions**
4. Push to the `main` branch - the GitHub Actions workflow will automatically build and deploy your site

The workflow is already configured in `.github/workflows/deploy.yml`

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Push the `dist` folder to the `gh-pages` branch:
   ```bash
   git subtree push --prefix dist origin gh-pages
   ```

   Or use the `gh-pages` package:
   ```bash
   npm install -g gh-pages
   gh-pages -d dist
   ```

## Project Structure

```
├── components/          # React components
│   ├── About.tsx       # About section
│   ├── Contact.tsx     # Contact form
│   ├── Experience.tsx  # Work experience
│   ├── Hero.tsx        # Landing section
│   ├── Projects.tsx    # Projects showcase
│   ├── Skills.tsx      # Skills display
│   └── ...
├── constants.ts        # Data constants
├── types.ts           # TypeScript types
└── vite.config.ts     # Vite configuration
```

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Three.js / React Three Fiber** - 3D graphics
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Contact Form

The contact form uses a `mailto:` link that opens the user's default email client with pre-filled information. Make sure to test this functionality in your browser.

## License

This project is open source and available under the MIT License.
