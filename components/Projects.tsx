import React, { useState, useEffect } from 'react';
import { Layout } from './Layout';
import { PROJECTS_DATA, SOCIAL_LINKS } from '../constants';
import { Project } from '../types';
import { motion } from 'framer-motion';
import { Github, Globe, ExternalLink, Loader2 } from 'lucide-react';

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  language: string | null;
  stargazers_count: number;
  fork: boolean;
}

export const Projects = () => {
  const [projects, setProjects] = useState<Project[]>(PROJECTS_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGitHubRepos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Extract username from GitHub URL
        const githubUrl = SOCIAL_LINKS.github;
        const username = githubUrl.split('/').pop() || 'NIKHILSOURI';
        
        // Fetch repositories from GitHub API
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100&type=all`);
        
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const repos: GitHubRepo[] = await response.json();
        
        // Filter out forks and convert to Project format
        const githubProjects: Project[] = repos
          .filter(repo => !repo.fork && repo.name !== 'nikhilsouri.github.io') // Exclude forks and portfolio repo
          .map(repo => {
            // Determine category from topics or language
            let category = 'Development';
            if (repo.topics.length > 0) {
              const firstTopic = repo.topics[0];
              if (firstTopic.includes('ai') || firstTopic.includes('ml')) category = 'AI / ML';
              else if (firstTopic.includes('web') || firstTopic.includes('frontend') || firstTopic.includes('backend')) category = 'Full Stack';
              else if (firstTopic.includes('devops') || firstTopic.includes('docker') || firstTopic.includes('kubernetes')) category = 'DevOps / Cloud';
              else if (firstTopic.includes('game')) category = 'Game Dev';
              else category = firstTopic.charAt(0).toUpperCase() + firstTopic.slice(1);
            } else if (repo.language) {
              if (repo.language === 'Python') category = 'AI / Research';
              else if (repo.language === 'JavaScript' || repo.language === 'TypeScript') category = 'Full Stack';
              else category = repo.language;
            }
            
            return {
              title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              category: category,
              description: repo.description || 'No description available',
              link: repo.html_url,
              live: repo.homepage || undefined
            };
          });
        
        // Merge static projects with GitHub projects, avoiding duplicates by title
        const staticProjectTitles = new Set(PROJECTS_DATA.map(p => p.title.toLowerCase()));
        const newGitHubProjects = githubProjects.filter(
          p => !staticProjectTitles.has(p.title.toLowerCase())
        );
        
        // Combine: static projects first, then GitHub projects
        setProjects([...PROJECTS_DATA, ...newGitHubProjects]);
      } catch (err) {
        console.error('Error fetching GitHub repos:', err);
        setError('Failed to load GitHub projects. Showing static projects only.');
        setProjects(PROJECTS_DATA); // Fallback to static projects
      } finally {
        setIsLoading(false);
      }
    };

    fetchGitHubRepos();
  }, []);

  return (
    <Layout title="Project Database" subtitle="Selected Works">
      {error && (
        <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm font-rajdhani">
          {error}
        </div>
      )}
      
      {isLoading && (
        <div className="mb-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 text-sm font-rajdhani flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading additional projects from GitHub...</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 pb-4 sm:pb-6 md:pb-8">
        {projects.map((project, idx) => (
          <motion.div
            key={project.title + idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: Math.min(idx * 0.05, 1) }}
            className="group relative bg-black/60 border border-white/10 rounded-lg sm:rounded-xl overflow-hidden hover:border-cyan-500/50 active:border-cyan-500/70 transition-all duration-300 flex flex-col h-full touch-manipulation"
          >
            {/* Top decorative bar */}
            <div className="h-1 w-full bg-gradient-to-r from-cyan-500 to-purple-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2 sm:mb-3 gap-2">
                    <span className="text-[10px] sm:text-xs font-mono text-cyan-400 border border-cyan-500/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-cyan-500/10 flex-shrink-0">
                        {project.category}
                    </span>
                    <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                        {project.link && (
                            <a href={project.link} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white active:text-cyan-400 transition-colors touch-manipulation" aria-label="View on GitHub">
                                <Github size={16} className="sm:w-[18px] sm:h-[18px]" />
                            </a>
                        )}
                        {project.live && (
                            <a href={project.live} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-400 active:text-cyan-300 transition-colors touch-manipulation" aria-label="View live site">
                                <Globe size={16} className="sm:w-[18px] sm:h-[18px]" />
                            </a>
                        )}
                    </div>
                </div>

                <h3 className="text-base sm:text-lg md:text-xl font-orbitron text-white mb-2 group-hover:text-cyan-400 transition-colors break-words">
                    {project.title}
                </h3>
                
                <p className="text-slate-400 font-rajdhani text-xs sm:text-sm leading-relaxed flex-1 mb-3 sm:mb-4">
                    {project.description}
                </p>

                <div className="mt-auto pt-3 sm:pt-4 border-t border-white/10">
                     <a 
                        href={project.link || project.live} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 text-xs sm:text-sm text-cyan-500 hover:text-cyan-300 active:text-cyan-200 transition-colors uppercase font-bold tracking-wider touch-manipulation"
                    >
                        View System <ExternalLink size={12} className="sm:w-3.5 sm:h-3.5" />
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
