import React from 'react';
import { Layout } from './Layout';
import { EXPERIENCE_DATA } from '../constants';
import { Calendar, Briefcase, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export const Experience = () => {
  return (
    <Layout title="Mission Log" subtitle="Work History">
      <div className="relative space-y-8 pl-4 sm:pl-0">
        <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500 via-purple-500 to-transparent opacity-30"></div>
        
        {EXPERIENCE_DATA.map((exp, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className={`relative flex flex-col sm:flex-row gap-8 ${idx % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}
          >
            <div className="hidden sm:block w-1/2"></div>
            
            {/* Center Node */}
            <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-4 h-4 bg-black border-2 border-cyan-400 rounded-full shadow-[0_0_10px_#00f0ff] z-10"></div>

            <div className="w-full sm:w-1/2 pl-12 sm:pl-0">
                <div className={`bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md hover:border-cyan-500/40 transition-all group ${idx % 2 === 0 ? 'sm:mr-8' : 'sm:ml-8'}`}>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-orbitron font-bold text-white group-hover:text-cyan-400 transition-colors">{exp.role}</h3>
                        {exp.link && (
                            <a href={exp.link} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-cyan-400">
                                <ExternalLink size={18} />
                            </a>
                        )}
                    </div>
                    <h4 className="text-lg font-rajdhani text-cyan-500 mb-1 flex items-center gap-2">
                        <Briefcase size={16} /> {exp.company}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-slate-400 mb-4 font-mono">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {exp.period}</span>
                        <span className="px-2 py-0.5 bg-white/5 rounded border border-white/10">{exp.type}</span>
                    </div>
                    <ul className="space-y-2">
                        {exp.details.map((detail, dIdx) => (
                            <li key={dIdx} className="text-slate-300 font-rajdhani flex items-start gap-2">
                                <span className="text-cyan-500 mt-1.5 text-[10px]">▶</span> {detail}
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
