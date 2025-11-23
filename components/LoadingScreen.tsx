import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading sequence
    const timer = setInterval(() => {
      setProgress((prev) => {
        // Random increment for more natural feel
        const increment = Math.random() * 8 + 2;
        const newProgress = prev + increment;
        
        if (newProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return newProgress;
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 800); // Short delay at 100% before transition
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-[#050b14] flex flex-col items-center justify-center font-orbitron text-cyan-400"
    >
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Main Spinner Animation */}
      <div className="relative mb-12">
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.2)]"
        />
        
        {/* Middle Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 border border-cyan-300/10 border-b-cyan-300 rounded-full"
        />

        {/* Center Rocket */}
        <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
                animate={{ 
                    y: [0, -4, 0],
                    filter: ["drop-shadow(0 0 0px #00f0ff)", "drop-shadow(0 0 10px #00f0ff)", "drop-shadow(0 0 0px #00f0ff)"]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                <Rocket size={40} className="text-white fill-white/10 rotate-45" />
            </motion.div>
        </div>
      </div>

      {/* Loading Status */}
      <div className="w-72 space-y-3 z-10">
        <div className="flex justify-between items-end text-xs tracking-widest uppercase text-cyan-300/70 font-mono">
            <span>System Initialization</span>
            <span className="text-lg font-bold text-white">{Math.min(100, Math.floor(progress))}%</span>
        </div>
        
        {/* Progress Bar Container */}
        <div className="h-1 bg-white/10 rounded-full overflow-hidden border border-white/5">
            <motion.div 
                className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_10px_#00f0ff]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", bounce: 0 }}
            />
        </div>

        {/* Terminal Text */}
        <div className="h-6 flex items-center justify-center">
             <span className="text-[10px] text-cyan-500/60 font-mono tracking-wider">
                {progress < 30 && "> MOUNTING FILE SYSTEM..."}
                {progress >= 30 && progress < 50 && "> ESTABLISHING UPLINK..."}
                {progress >= 50 && progress < 70 && "> CALIBRATING SENSORS..."}
                {progress >= 70 && progress < 90 && "> RENDERING NEBULA..."}
                {progress >= 90 && "> STARTUP SEQUENCE COMPLETE"}
             </span>
        </div>
      </div>
    </motion.div>
  );
};