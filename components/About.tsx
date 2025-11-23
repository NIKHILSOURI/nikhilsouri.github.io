import React from 'react';
import { Layout } from './Layout';
import { EDUCATION_DATA } from '../constants';
import { MapPin, Mail, GraduationCap } from 'lucide-react';

export const About = () => {
  return (
    <Layout title="Personnel Data" subtitle="Background & Education">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {/* Biography Panel */}
        <div className="p-4 sm:p-6 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 sm:p-4 opacity-20 group-hover:opacity-40 transition-opacity">
            <div className="text-6xl sm:text-7xl md:text-9xl font-orbitron text-white font-bold select-none">ID</div>
          </div>
          <h3 className="text-xl sm:text-2xl font-orbitron text-cyan-400 mb-3 sm:mb-4">Profile Summary</h3>
          <p className="text-slate-300 font-rajdhani text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6">
            I specialize in building backend systems and practical tools that solve real problems.
            Currently pursuing a dual degree in Sweden and India, I have developed a strong foundation in Systems Programming,
            RESTful design, and CI/CD pipelines.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/80">
                <MapPin className="text-cyan-500" /> Karlskrona, Sweden
            </div>
            <div className="flex items-center gap-3 text-white/80">
                <Mail className="text-cyan-500" /> mymedia.yns@gmail.com
            </div>
          </div>
        </div>

        {/* Education Timeline */}
        <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xl sm:text-2xl font-orbitron text-white mb-3 sm:mb-4 flex items-center gap-2">
                <GraduationCap className="text-cyan-400 w-5 h-5 sm:w-6 sm:h-6" /> Academic Log
            </h3>
            {EDUCATION_DATA.map((edu, idx) => (
                <div key={idx} className="relative pl-5 sm:pl-6 border-l-2 border-cyan-500/30 pb-4 sm:pb-6 last:pb-0">
                    <div className="absolute top-0 -left-[7px] sm:-left-[9px] w-3 h-3 sm:w-4 sm:h-4 bg-black border-2 border-cyan-500 rounded-full"></div>
                    <div className="bg-white/5 border border-white/10 p-3 sm:p-4 rounded-lg sm:rounded-xl hover:bg-white/10 transition-colors">
                        <h4 className="text-base sm:text-lg md:text-xl font-bold text-white font-rajdhani">{edu.degree}</h4>
                        <p className="text-cyan-400 text-xs sm:text-sm font-orbitron">{edu.school}</p>
                        <p className="text-slate-400 text-xs sm:text-sm mt-1">{edu.period}</p>
                        {edu.details && <p className="text-slate-500 text-xs sm:text-sm mt-2 italic border-t border-white/5 pt-2">{edu.details}</p>}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </Layout>
  );
};
