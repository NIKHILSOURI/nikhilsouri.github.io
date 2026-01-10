import React from 'react';
import { Layout } from './Layout';
import { PUBLICATIONS_DATA } from '../constants';
import { motion } from 'framer-motion';
import { FileText, ExternalLink, Calendar, Building2 } from 'lucide-react';

export const Publications = () => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Paper':
        return 'bg-cyan-900/30 text-cyan-300 border-cyan-500/30';
      case 'Seminar':
        return 'bg-purple-900/30 text-purple-300 border-purple-500/30';
      case 'Thesis':
        return 'bg-green-900/30 text-green-300 border-green-500/30';
      case 'Conference':
        return 'bg-orange-900/30 text-orange-300 border-orange-500/30';
      default:
        return 'bg-slate-900/30 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <Layout title="Publications & Research" subtitle="Academic Contributions">
      <div className="space-y-4 sm:space-y-6">
        {PUBLICATIONS_DATA.map((pub, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-black/40 border border-white/10 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl backdrop-blur-md hover:border-cyan-500/40 transition-all duration-300 relative overflow-hidden"
          >
            {/* Decorative accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-cyan-500/10 rounded-lg sm:rounded-xl flex items-center justify-center border border-cyan-500/30 group-hover:bg-cyan-500/20 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all">
                  <FileText size={24} className="text-cyan-400" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-orbitron font-bold text-white group-hover:text-cyan-400 transition-colors break-words flex-1">
                    {pub.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-lg border text-xs sm:text-sm font-rajdhani font-semibold flex-shrink-0 ${getTypeColor(pub.type)}`}>
                    {pub.type}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-slate-400 mb-3">
                  <span className="flex items-center gap-1.5">
                    <Building2 size={14} className="text-cyan-500 flex-shrink-0" />
                    <span className="font-rajdhani">{pub.venue}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-cyan-500 flex-shrink-0" />
                    <span className="font-rajdhani font-mono">{pub.date}</span>
                  </span>
                </div>

                {pub.doi && (
                  <div className="mb-3">
                    <a 
                      href={pub.doi} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-mono break-all"
                    >
                      {pub.doi.replace('https://doi.org/', 'DOI: ')}
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <a
                    href={pub.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-400 rounded-lg transition-all duration-300 font-orbitron text-xs sm:text-sm uppercase tracking-wider group-hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] touch-manipulation"
                  >
                    <ExternalLink size={16} />
                    View Publication
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Layout>
  );
};

