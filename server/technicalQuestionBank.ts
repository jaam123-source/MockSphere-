import { TechnicalDomainId, TechnicalDomainInfo, TechnicalQuestion } from '../src/types';
import { FULLSTACK_QUESTIONS } from './questions/fullstackQuestions';
import { GENAI_QUESTIONS } from './questions/genaiQuestions';
import { CLOUD_QUESTIONS } from './questions/cloudQuestions';
import { DATASCIENCE_QUESTIONS } from './questions/datascienceQuestions';
import { CYBERSECURITY_QUESTIONS } from './questions/cybersecurityQuestions';

export const TECHNICAL_DOMAINS_LIST: TechnicalDomainInfo[] = [
  {
    id: 'fullstack',
    name: 'Full Stack Development',
    category: 'Software Engineering',
    description: 'End-to-end web architectures, React/Next.js, Node.js, REST & GraphQL APIs, microservices, and state management.',
    topics: ['React & DOM', 'JavaScript & Event Loop', 'REST & GraphQL', 'State Management', 'Fullstack Security', 'Databases & Caching'],
    icon: 'Layers',
  },
  {
    id: 'genai',
    name: 'Generative AI & LLM Engineering',
    category: 'AI & Machine Learning',
    description: 'Transformer architectures, RAG pipelines, vector databases, prompt engineering, fine-tuning, and AI agents.',
    topics: ['LLM Fundamentals', 'Retrieval-Augmented Generation (RAG)', 'Vector Databases', 'Prompt Engineering', 'Hallucination Mitigation', 'AI Agents'],
    icon: 'Sparkles',
  },
  {
    id: 'cloud',
    name: 'Cloud & DevOps Engineering',
    category: 'Cloud & Infrastructure',
    description: 'Docker containers, Kubernetes, CI/CD automation, Terraform IaC, cloud networking, and SRE observability.',
    topics: ['Docker & Containers', 'Kubernetes Pods & Services', 'CI/CD Pipelines', 'Infrastructure as Code', 'Cloud VPC & Networking', 'Monitoring & SRE'],
    icon: 'Cloud',
  },
  {
    id: 'datascience',
    name: 'Data Science & Machine Learning',
    category: 'Data & Analytics',
    description: 'Supervised & unsupervised learning, statistical testing, feature engineering, tree ensembles, and MLOps.',
    topics: ['ML Fundamentals', 'Hypothesis Testing & p-values', 'Data Cleaning & Scaling', 'Random Forest & Boosting', 'Model Evaluation', 'Model Drift'],
    icon: 'BarChart2',
  },
  {
    id: 'cybersecurity',
    name: 'Cyber Security & Zero Trust',
    category: 'Security & Infrastructure',
    description: 'Threat modeling, OWASP Top 10, Zero Trust architectures, encryption protocols, and incident response.',
    topics: ['CIA Triad & Authentication', 'OWASP Top 10 (SQLi/XSS/CSRF)', 'Encryption (Symmetric & Asymmetric)', 'Network Security & Firewalls', 'Zero Trust Architecture', 'Incident Response'],
    icon: 'ShieldCheck',
  },
];

// Curated 30 questions per domain (Level 1: 10, Level 2: 10, Level 3: 10)
// Questions are kept simple, concise, and realistic, matching actual technical interview rounds
export const TECHNICAL_QUESTION_BANK: Record<TechnicalDomainId, TechnicalQuestion[]> = {
  fullstack: FULLSTACK_QUESTIONS,
  genai: GENAI_QUESTIONS,
  cloud: CLOUD_QUESTIONS,
  datascience: DATASCIENCE_QUESTIONS,
  cybersecurity: CYBERSECURITY_QUESTIONS,
};
