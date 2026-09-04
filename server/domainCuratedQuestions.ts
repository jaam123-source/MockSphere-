import { TechnicalDomainId, TechnicalQuestion } from '../src/types';
import { TECHNICAL_DOMAINS_LIST, TECHNICAL_QUESTION_BANK } from './technicalQuestionBank';

// Curated question templates per domain and level
export function getCuratedDomainQuestions(domain: TechnicalDomainId): TechnicalQuestion[] {
  // If fullstack already populated in bank
  if (TECHNICAL_QUESTION_BANK[domain] && TECHNICAL_QUESTION_BANK[domain].length >= 30) {
    return TECHNICAL_QUESTION_BANK[domain];
  }

  const domainMeta = TECHNICAL_DOMAINS_LIST.find((d) => d.id === domain) || TECHNICAL_DOMAINS_LIST[0];
  const domainName = domainMeta.name;
  const topics = domainMeta.topics;

  const questions: TechnicalQuestion[] = [];

  // LEVEL 1: BASIC / FUNDAMENTALS (10 Questions)
  const l1Topics = [
    { name: `${topics[0] || 'Core'} Fundamentals`, concept: `core definitions and architectural principles of ${domainName}` },
    { name: `${topics[1] || 'Syntax'} Basics`, concept: `standard syntax, keywords, and primitives in ${domainName}` },
    { name: 'Standard Lifecycles', concept: `execution lifecycle, runtime environments, and core workflows` },
    { name: 'Data Types & Structures', concept: `fundamental data representations, typing rules, and memory representations` },
    { name: 'Standard Protocols & APIs', concept: `standard interfaces, protocols, and standard library conventions` },
    { name: 'Error Handling Foundations', concept: `exception handling, common error codes, and recovery patterns` },
    { name: 'Configuration & Tooling', concept: `package managers, build tools, and development environment setup` },
    { name: 'Basic Security Principles', concept: `fundamental security considerations, input sanitation, and credential handling` },
    { name: 'Testing Foundations', concept: `unit testing, assertions, and test harness execution` },
    { name: 'Best Practices & Conventions', concept: `idiomatic conventions, readability guidelines, and standard style patterns` },
  ];

  l1Topics.forEach((t, i) => {
    questions.push({
      question_id: `${domain}_l1_q${i + 1}`,
      domain,
      level: 1,
      level_name: 'Level 1 — Basic',
      topic: t.name,
      difficulty: 'Easy',
      type: 'conceptual',
      question: `What is ${t.name} in ${domainName}, and why is it important?`,
      expected_key_points: [
        `Clear, simple definition of ${t.name}`,
        `Core mechanism governing ${t.concept}`,
        `Practical use cases and benefits`,
      ],
      improved_answer: `In ${domainName}, ${t.name} refers to ${t.concept}. It provides clean abstractions that make applications reliable, maintainable, and easy to scale.`,
    });
  });

  // LEVEL 2: INTERMEDIATE / UNDERSTANDING & REASONING (10 Questions)
  const l2Topics = [
    { name: `${topics[2] || 'Advanced'} Deep Dive`, type: 'conceptual', diff: 'Medium' },
    { name: 'Performance Optimization & Tradeoffs', type: 'conceptual', diff: 'Medium' },
    { name: 'Concurrency & State Synchronization', type: 'conceptual', diff: 'Medium' },
    { name: 'Code Output Analysis & Execution Order', type: 'code_output', diff: 'Medium' },
    { name: 'Debugging & Defect Remediation', type: 'debugging', diff: 'Medium' },
    { name: 'Architectural Pattern Comparison', type: 'conceptual', diff: 'Medium' },
    { name: 'Memory & Resource Management', type: 'conceptual', diff: 'Medium' },
    { name: 'Resilience & Fault Tolerance', type: 'scenario', diff: 'Medium' },
    { name: 'Data Pipeline & Query Efficiency', type: 'conceptual', diff: 'Medium' },
    { name: 'Scalability & Load Handling', type: 'conceptual', diff: 'Medium' },
  ];

  l2Topics.forEach((t, i) => {
    const isCodeOutput = t.type === 'code_output';
    const isDebugging = t.type === 'debugging';

    questions.push({
      question_id: `${domain}_l2_q${i + 1}`,
      domain,
      level: 2,
      level_name: 'Level 2 — Intermediate',
      topic: t.name,
      difficulty: 'Medium',
      type: t.type as any,
      question: isCodeOutput
        ? `What is the output and execution order of this code snippet in ${domainName}?`
        : isDebugging
        ? `What is the bug in this code snippet and how would you fix it?`
        : `What is the difference between the main approaches for ${t.name} in ${domainName}?`,
      code_snippet_display: isCodeOutput
        ? `// Code Analysis in ${domainName}\nfunction calculate(data) {\n  console.log('Processing:', data);\n  return data ? true : false;\n}`
        : isDebugging
        ? `// Debugging task in ${domainName}\nasync function fetchAll(ids) {\n  // What bug happens here if ids has 10,000 items?\n  return Promise.all(ids.map(id => fetchItem(id)));\n}`
        : undefined,
      expected_key_points: [
        `Clear explanation of ${t.name}`,
        `Understanding of tradeoffs and edge cases`,
        `Direct, actionable answer`,
      ],
      improved_answer: `In ${domainName}, ${t.name} requires balancing simplicity, performance, and reliability based on specific project needs.`,
    });
  });

  // LEVEL 3: PRACTICAL / CODING / PROBLEM SOLVING (10 Questions)
  const l3Topics = [
    { name: 'Data Processing Function', type: 'coding', lang: 'typescript' },
    { name: 'System Scaling Strategy', type: 'scenario', lang: undefined },
    { name: 'Asynchronous Task Handler', type: 'coding', lang: 'typescript' },
    { name: 'Monitoring & Alerting Setup', type: 'scenario', lang: undefined },
    { name: 'Fixing Unhandled Errors', type: 'debugging', lang: 'typescript' },
    { name: 'Secure API Authentication', type: 'scenario', lang: undefined },
    { name: 'Database Query Optimization', type: 'scenario', lang: undefined },
    { name: 'Simple LRU Cache', type: 'coding', lang: 'typescript' },
    { name: 'Zero-Downtime Deployment', type: 'scenario', lang: undefined },
    { name: 'Disaster Recovery Plan', type: 'scenario', lang: undefined },
  ];

  l3Topics.forEach((t, i) => {
    const isCoding = t.type === 'coding';
    const isDebugging = t.type === 'debugging';

    questions.push({
      question_id: `${domain}_l3_q${i + 1}`,
      domain,
      level: 3,
      level_name: 'Level 3 — Practical',
      topic: t.name,
      difficulty: 'Hard',
      type: t.type as any,
      language: t.lang || 'typescript',
      question: isCoding
        ? `Write a clean function in ${domainName} to implement "${t.name}".`
        : isDebugging
        ? `How would you diagnose and fix a critical issue with "${t.name}" in ${domainName}?`
        : `How would you design a simple, reliable solution for "${t.name}" in ${domainName}?`,
      code_template: isCoding
        ? `// Implement ${t.name}\nexport function solve(input: any) {\n  // Write your code here\n}`
        : undefined,
      expected_key_points: [
        `Practical approach for ${t.name}`,
        `Handling edge cases and errors`,
        `Clean, readable code or explanation`,
      ],
      improved_answer: `For ${t.name} in ${domainName}, focus on clean architecture, proper error handling, and robust edge-case validation.`,
    });
  });

  return questions;
}
