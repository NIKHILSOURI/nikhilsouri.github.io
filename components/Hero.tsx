import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Instagram, Download } from 'lucide-react';
import { SOCIAL_LINKS } from '../constants';

export const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-cyan-500/30 p-2 mb-8 relative group"
      >
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin-slow shadow-[0_0_30px_rgba(0,240,255,0.2)]"></div>
        <img 
            src="https://nikhilsouri.github.io/assets/images/avatar.jpg" 
            alt="Nikhil" 
            className="w-full h-full object-cover rounded-full filter grayscale group-hover:grayscale-0 transition-all duration-500"
        />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-cyan-400 font-rajdhani text-xl tracking-[0.3em] uppercase mb-2">System Online</p>
        <h1 className="text-5xl md:text-7xl font-orbitron font-black text-white mb-4 tracking-tight drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
          NIKHIL SOURI
        </h1>
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-6"></div>
      </motion.div>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-slate-300 max-w-2xl text-lg md:text-xl font-rajdhani leading-relaxed mb-8"
      >
        <span className="text-cyan-300">Backend & DevOps Engineer.</span><br/>
        Final-year Computer Science student bridging Sweden & India. 
        Building reliable systems with <span className="text-white font-bold">C++</span>, <span className="text-white font-bold">Python</span>, and Cloud Technologies.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex gap-6"
      >
        <SocialButton href={SOCIAL_LINKS.github} icon={Github} />
        <SocialButton href={SOCIAL_LINKS.linkedin} icon={Linkedin} />
        <SocialButton href={SOCIAL_LINKS.instagram} icon={Instagram} />
        <a 
            href={SOCIAL_LINKS.resume} 
            download 
            className="flex items-center gap-2 px-6 py-3 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 rounded-full hover:bg-cyan-500 hover:text-black transition-all duration-300 font-orbitron text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.1)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)]"
        >
            <Download size={18} /> Resume
        </a>
      </motion.div>
    </div>
  );
};

const SocialButton = ({ href, icon: Icon }: { href: string, icon: any }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="p-3 rounded-full border border-white/10 bg-white/5 text-white hover:bg-cyan-500 hover:text-black hover:border-cyan-500 transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)]"
  >
    <Icon size={24} />
  </a>
);
