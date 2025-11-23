import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { StarBackground } from './components/StarBackground';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Section } from './types';
import { AnimatePresence } from 'framer-motion';
import { SoundProvider, useSound } from './components/SoundManager';
import { LoadingScreen } from './components/LoadingScreen';

const Content = () => {
  const [currentSection, setCurrentSection] = useState<Section>(Section.HOME);
  const [isLoading, setIsLoading] = useState(true);
  const { playAmbientInteract } = useSound();

  const renderSection = () => {
    switch (currentSection) {
      case Section.HOME:
        return <Hero />;
      case Section.ABOUT:
        return <About />;
      case Section.SKILLS:
        return <Skills />;
      case Section.EXPERIENCE:
        return <Experience />;
      case Section.PROJECTS:
        return <Projects />;
      case Section.CONTACT:
        return <Contact />;
      default:
        return <Hero />;
    }
  };

  return (
    <div className="w-full h-screen relative bg-[#050b14] text-white overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200 overscroll-none">
      
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* 3D Background Layer - Loaded behind loading screen */}
      <div 
        className="absolute inset-0 z-0 cursor-move" 
        onPointerDown={() => playAmbientInteract()}
      >
        <Canvas camera={{ position: [0, 2, 18], fov: 45 }}>
          <Suspense fallback={null}>
            <StarBackground />
          </Suspense>
        </Canvas>
      </div>

      {/* Decorative Overlays (Scanlines, Vignette) */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/80"></div>

      {/* Main UI Layer - Reveal after loading */}
      {!isLoading && (
        <>
          <main className="relative z-20 h-full w-full flex flex-col items-center p-2 sm:p-4 pointer-events-none overflow-y-auto pb-[72px] sm:pb-[96px]">
            <div className="pointer-events-auto w-full max-w-5xl py-4 sm:py-6 md:py-8 min-h-full flex items-center">
                <AnimatePresence mode="wait">
                {renderSection()}
                </AnimatePresence>
            </div>
          </main>

          <Navigation currentSection={currentSection} setSection={setCurrentSection} />
          
          <div className="absolute bottom-4 right-4 sm:right-6 z-20 hidden md:block text-[10px] text-slate-500 font-mono">
            SYS.VER.2.0.24 // ONLINE
          </div>
        </>
      )}
    </div>
  );
};

export default function App() {
  return (
    <SoundProvider>
      <Content />
    </SoundProvider>
  );
}
