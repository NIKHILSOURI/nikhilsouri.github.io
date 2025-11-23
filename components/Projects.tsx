import React from 'react';
import { Layout } from './Layout';
import { PROJECTS_DATA } from '../constants';
import { motion } from 'framer-motion';
import { Github, Globe, ExternalLink } from 'lucide-react';

export const Projects = () => {
  return (
    <Layout title="Project Database" subtitle="Selected Works">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {PROJECTS_DATA.map((project, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative bg-black/60 border border-white/10 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 flex flex-col h-full"
          >
            {/* Top decorative bar */}
            <div className="h-1 w-full bg-gradient-to-r from-cyan-500 to-purple-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-mono text-cyan-400 border border-cyan-500/30 px-2 py-1 rounded bg-cyan-500/10">
                        {project.category}
                    </span>
                    <div className="flex gap-2">
                        {project.link && (
                            <a href={project.link} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                                <Github size={18} />
                            </a>
                        )}
                        {project.live && (
                            <a href={project.live} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors">
                                <Globe size={18} />
                            </a>
                        )}
                    </div>
                </div>

                <h3 className="text-xl font-orbitron text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {project.title}
                </h3>
                
                <p className="text-slate-400 font-rajdhani text-sm leading-relaxed flex-1">
                    {project.description}
                </p>

                <div className="mt-4 pt-4 border-t border-white/10">
                     <a 
                        href={project.link || project.live} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm text-cyan-500 hover:text-cyan-300 transition-colors uppercase font-bold tracking-wider"
                    >
                        View System <ExternalLink size={14} />
                     </a>
                </div>
            </div>
            
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>
          </motion.div>
        ))}
      </div>
    </Layout>
  );
};
