import { Project, Experience, Education } from './types';
import { 
  Code2, 
  Server, 
  Terminal, 
  Cpu, 
  Globe, 
  Database,
  Layout,
  Gamepad2
} from 'lucide-react';

export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/in/nikhil-souri",
  github: "https://github.com/NIKHILSOURI",
  instagram: "https://www.instagram.com/nikhil_souri",
  email: "mailto:mymedia.yns@gmail.com",
  phone: "tel:+918519980985",
  resume: "/resume-sweden.pdf" // Place your resume PDF in the public folder
};

export const SKILLS_DATA = [
  { name: "C/C++", level: 90, icon: Code2 },
  { name: "Python", level: 85, icon: Terminal },
  { name: "Java", level: 70, icon: Server },
  { name: "JavaScript", level: 70, icon: Globe },
  { name: "Docker & K8s", level: 75, icon: Cpu },
  { name: "Linux", level: 80, icon: Terminal },
  { name: "Node.js", level: 75, icon: Server },
  { name: "SQL/DBMS", level: 80, icon: Database },
];

export const EXPERIENCE_DATA: Experience[] = [
  {
    role: "Associate Software Engineer Intern",
    company: "Accenture India",
    period: "May 2025 – July 2025",
    type: "On-site",
    details: [
      "Worked on Rapid Data Loader (RDL) for streamlined data migration.",
      "Supported SAP ERP deployment through testing and on-site collaboration."
    ],
    link: "https://drive.google.com/file/d/1e_GGj6yGgubaQDFAwuJ89yw1RYdsKSZJ/view"
  },
  {
    role: "SDE Intern",
    company: "Bluestock",
    period: "Apr 2025 – May 2025",
    type: "Remote",
    details: [
      "Built scalable backend APIs with Node.js emphasizing performance and security.",
      "Contributed to IPO Web App features and integration across the stack."
    ],
    link: "https://drive.google.com/file/d/19Y6luL2K2dFC4Ui4IGdiPRRCDachsZoA/view"
  },
  {
    role: "Intern Instructor",
    company: "TICT Computers",
    period: "Jun 2023 – Jan 2024",
    type: "On-site",
    details: [
      "Taught C and Java fundamentals with hands-on labs."
    ],
    link: "https://drive.google.com/file/d/1rxdrLaGClo1W-f4oG4SkPvlKqXAunkde/view"
  }
];

export const EDUCATION_DATA: Education[] = [
  {
    degree: "B.Sc. in Computer Science",
    school: "Blekinge Institute of Technology, Sweden",
    period: "2025 – 2026 (Pursuing)",
    details: "Dual Degree Program"
  },
  {
    degree: "B.Tech in CSE",
    school: "JNTU College of Engineering, India",
    period: "2022 – 2026 (Pursuing)"
  },
  {
    degree: "Intermediate (MPC)",
    school: "Narayana Junior College",
    period: "2020 – 2022",
    details: "70.8%"
  }
];

export const PROJECTS_DATA: Project[] = [
  {
    title: "Blink-Based Cognitive Load Detection",
    category: "AI / Research",
    description: "AI pipeline using MediaPipe & EAR metrics for cognitive load detection under noisy visual conditions. Research conducted at BTH Sweden.",
    link: "https://github.com/NIKHILSOURI/Blink-Detection-in-Noisy-Environments"
  },
  {
    title: "Obstacle Course (UE5)",
    category: "Game Dev",
    description: "3D obstacle course game in Unreal Engine 5 using Blueprint scripting. Implemented physics, collisions, and level design.",
    link: "https://github.com/NIKHILSOURI/ObstacleCourse"
  },
  {
    title: "ML Inference DevOps Pipeline",
    category: "DevOps / Cloud",
    description: "Containerized ML app with Docker, deployed on AWS EC2, and automated via Jenkins CI/CD, reducing deployment time by 60%.",
    link: "https://github.com/NIKHILSOURI/DevOps-Mini-Project-"
  },
  {
    title: "AI Crowd Flow System",
    category: "AI / Cloud",
    description: "Real-time system for queue optimization using streaming analytics and Dockerized microservices.",
    link: "https://github.com/NIKHILSOURI/AI-Powered-Queue-Management/"
  },
  {
    title: "TICT Computers Webpage",
    category: "Full Stack",
    description: "Responsive company website with dynamic backend for course management.",
    live: "https://tictcomputers.onrender.com"
  },
  {
    title: "Faculty LMS Portal",
    category: "Full Stack",
    description: "Web app for faculty leave/attendance using Node.js, Express, MySQL.",
    link: "https://github.com/NIKHILSOURI/leave_system"
  }
];