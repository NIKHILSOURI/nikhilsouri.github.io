import React, { ReactNode, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSound } from './SoundManager';

interface LayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, subtitle }) => {
  const { playSectionChange } = useSound();

  useEffect(() => {
    playSectionChange();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto h-[80vh] flex flex-col"
    >
      {/* Header Bar */}
      <div className="flex items-end border-b border-white/10 pb-4 mb-6 relative">
        <div className="absolute -bottom-[1px] left-0 w-24 h-[3px] bg-cyan-400 shadow-[0_0_10px_#00f0ff]"></div>
        <div>
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white uppercase tracking-wider drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-cyan-400/80 font-rajdhani text-lg mt-1 tracking-[0.2em] uppercase">
              // {subtitle}
            </p>
          )}
        </div>
        <div className="ml-auto flex gap-2">
            <div className="w-2 h-2 bg-cyan-500 animate-pulse rounded-full"></div>
            <div className="w-2 h-2 bg-white/20 rounded-full"></div>
            <div className="w-2 h-2 bg-white/20 rounded-full"></div>
        </div>
      </div>

      {/* Content Area with custom scroll */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative">
        {children}
      </div>
    </motion.div>
  );
};