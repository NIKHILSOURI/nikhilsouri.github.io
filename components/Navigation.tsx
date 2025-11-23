import React from 'react';
import { Section } from '../types';
import { Home, User, Cpu, Briefcase, FolderGit2, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSound } from './SoundManager';

interface NavigationProps {
  currentSection: Section;
  setSection: (section: Section) => void;
}

const navItems = [
  { id: Section.HOME, icon: Home, label: 'Home' },
  { id: Section.ABOUT, icon: User, label: 'Profile' },
  { id: Section.SKILLS, icon: Cpu, label: 'Tech' },
  { id: Section.EXPERIENCE, icon: Briefcase, label: 'Ops' },
  { id: Section.PROJECTS, icon: FolderGit2, label: 'Missions' },
  { id: Section.CONTACT, icon: Mail, label: 'Comm' },
];

export const Navigation: React.FC<NavigationProps> = ({ currentSection, setSection }) => {
  const { playHover, playClick } = useSound();

  const handleNavClick = (id: Section) => {
    playClick();
    setSection(id);
  };

  return (
    <div className="fixed bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-2 sm:px-4">
      <div className="relative backdrop-blur-md bg-black/60 border border-white/10 rounded-xl sm:rounded-2xl px-1 sm:px-2 py-2 sm:py-3 shadow-[0_0_20px_rgba(0,240,255,0.2)] flex justify-between items-center overflow-x-auto overflow-y-hidden scrollbar-hide">
        {/* Decorative holographic lines */}
        <div className="absolute top-0 left-2 sm:left-4 right-2 sm:right-4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30"></div>
        
        {navItems.map((item) => {
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              onMouseEnter={() => playHover()}
              className={`relative group flex flex-col items-center justify-center min-w-[48px] sm:min-w-[56px] h-12 sm:h-14 rounded-lg sm:rounded-xl transition-all duration-300 touch-manipulation ${
                isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-white active:text-cyan-300'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-cyan-500/10 rounded-lg sm:rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              {/* Hover Glow Effect for Non-Active Items */}
              {!isActive && (
                 <div className="absolute inset-0 bg-white/5 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_10px_rgba(255,255,255,0.1)]"></div>
              )}

              <item.icon size={18} className={`sm:w-5 sm:h-5 z-10 mb-0.5 sm:mb-1 transition-transform duration-300 group-hover:scale-110 group-active:scale-95 ${isActive ? 'drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]' : 'group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]'}`} />
              <span className="text-[9px] sm:text-[10px] font-orbitron uppercase tracking-wider sm:tracking-widest z-10 opacity-70 group-hover:opacity-100 transition-opacity">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
