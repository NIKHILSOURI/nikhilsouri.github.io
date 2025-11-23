import React from 'react';
import { Layout } from './Layout';
import { SKILLS_DATA } from '../constants';
import { motion } from 'framer-motion';

export const Skills = () => {
  return (
    <Layout title="Tech Stack" subtitle="Proficiency Analysis">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {SKILLS_DATA.map((skill, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-black/40 border border-white/10 p-4 rounded-xl hover:border-cyan-500/50 transition-colors relative overflow-hidden"
          >
             {/* Holographic BG glow */}
             <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <skill.icon className="text-cyan-400" size={24} />
                <span className="text-white font-orbitron tracking-wider">{skill.name}</span>
              </div>
              <span className="text-cyan-500 font-mono">{skill.level}%</span>
            </div>
            
            {/* Custom Progress Bar */}
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 1, delay: 0.5 + idx * 0.1, ease: "easeOut" }}
                className="h-full bg-cyan-500 shadow-[0_0_10px_#00f0ff] relative"
              >
                  <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white shadow-[0_0_5px_#fff]"></div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border border-white/10 rounded-xl bg-gradient-to-br from-white/5 to-transparent">
            <h3 className="text-xl font-orbitron text-white mb-4">Core Competencies</h3>
            <div className="flex flex-wrap gap-2">
                {['OOP', 'DSA', 'DBMS', 'Operating Systems', 'Computer Networks', 'Software Engineering'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-cyan-900/30 text-cyan-300 border border-cyan-500/30 rounded text-sm font-rajdhani font-semibold">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
        
        <div className="p-6 border border-white/10 rounded-xl bg-gradient-to-br from-white/5 to-transparent">
             <h3 className="text-xl font-orbitron text-white mb-4">Tools & Platforms</h3>
             <div className="flex flex-wrap gap-2">
                {['Git', 'VS Code', 'Unreal Engine 5', 'Jenkins', 'AWS', 'Postman'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-purple-900/30 text-purple-300 border border-purple-500/30 rounded text-sm font-rajdhani font-semibold">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
      </div>
    </Layout>
  );
};
