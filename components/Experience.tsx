import React from 'react';
import { Layout } from './Layout';
import { EXPERIENCE_DATA } from '../constants';
import { Calendar, Briefcase, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export const Experience = () => {
  return (
    <Layout title="Mission Log" subtitle="Work History">
      <div className="relative space-y-6 sm:space-y-8 pb-4 min-w-0">
        {/* Timeline line - positioned relative to content, not fixed */}
        <div className="hidden sm:block absolute left-1/2 top-0 w-px bg-gradient-to-b from-cyan-500 via-purple-500 to-transparent opacity-30 -translate-x-1/2 pointer-events-none" style={{ height: '100%', minHeight: 'calc(100% + 2rem)' }}></div>
        <div className="block sm:hidden absolute left-4 top-0 w-px bg-gradient-to-b from-cyan-500 via-purple-500 to-transparent opacity-30 pointer-events-none" style={{ height: '100%', minHeight: 'calc(100% + 2rem)' }}></div>
        
        {EXPERIENCE_DATA.map((exp, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className={`relative flex flex-col sm:flex-row gap-4 sm:gap-8 min-w-0 ${idx % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}
          >
            <div className="hidden sm:block w-1/2 flex-shrink-0"></div>
            
            {/* Center Node - positioned relative to container */}
            <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-black border-2 border-cyan-400 rounded-full shadow-[0_0_10px_#00f0ff] z-10 flex-shrink-0" style={{ top: '0.5rem' }}></div>

            <div className="w-full sm:w-1/2 pl-10 sm:pl-0 flex-shrink-0 min-w-0">
                <div className={`bg-black/40 border border-white/10 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl backdrop-blur-md hover:border-cyan-500/40 transition-all group ${idx % 2 === 0 ? 'sm:mr-4 md:mr-8' : 'sm:ml-4 md:ml-8'} w-full min-w-0`}>
                    <div className="flex justify-between items-start mb-2 gap-2 min-w-0">
                        <h3 className="text-base sm:text-lg md:text-xl font-orbitron font-bold text-white group-hover:text-cyan-400 transition-colors break-words min-w-0 flex-1">{exp.role}</h3>
                        {exp.link && (
                            <a href={exp.link} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-cyan-400">
                                <ExternalLink size={18} />
                            </a>
                        )}
                    </div>
                    <h4 className="text-sm sm:text-base md:text-lg font-rajdhani text-cyan-500 mb-1 flex items-center gap-2">
                        <Briefcase size={14} className="sm:w-4 sm:h-4 flex-shrink-0" /> <span className="break-words">{exp.company}</span>
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4 font-mono">
                        <span className="flex items-center gap-1"><Calendar size={12} className="sm:w-3.5 sm:h-3.5" /> {exp.period}</span>
                        <span className="px-2 py-0.5 bg-white/5 rounded border border-white/10 text-xs">{exp.type}</span>
                    </div>
                    <ul className="space-y-1.5 sm:space-y-2">
                        {exp.details.map((detail, dIdx) => (
                            <li key={dIdx} className="text-slate-300 font-rajdhani text-sm sm:text-base flex items-start gap-2">
                                <span className="text-cyan-500 mt-1 sm:mt-1.5 text-[10px] flex-shrink-0">▶</span> <span className="break-words">{detail}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Layout>
  );
};
