export enum Section {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  SKILLS = 'SKILLS',
  EXPERIENCE = 'EXPERIENCE',
  PROJECTS = 'PROJECTS',
  CONTACT = 'CONTACT'
}

export interface Project {
  title: string;
  category: string;
  description: string;
  link?: string;
  live?: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  type: string;
  details: string[];
  link?: string;
}

export interface Education {
  degree: string;
  school: string;
  period: string;
  details?: string;
}