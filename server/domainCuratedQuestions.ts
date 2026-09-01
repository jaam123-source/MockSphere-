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
      question: `In ${domainName}, what are the fundamental concepts and working principles behind ${t.name}? Explain how ${t.concept} operates in standard environments.`,
      expected_key_points: [
        `Clear definition of ${t.name}`,
        `Core mechanism governing ${t.concept}`,
        `Standard implementation patterns and common use cases`,
        `Key benefits and potential pitfalls`,
      ],
      improved_answer: `In ${domainName}, ${t.name} represents a foundational pillar. It operates by establishing predictable abstractions over ${t.concept}. Developers leverage this to enforce maintainability, reduce runtime anomalies, and ensure system consistency across environments.`,
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
        ? `Analyze the following ${domainName} code snippet. Explain the execution flow, memory allocations, and exact output behavior.`
        : isDebugging
        ? `Identify the runtime bottleneck or logical bug in the following ${domainName} module. Explain why it fails under high load and how to fix it.`
        : `Compare the primary approaches for ${t.name} in ${domainName}. Under what specific engineering conditions would you choose one approach over the other?`,
      code_snippet_display: isCodeOutput
        ? `// Code Analysis Example in ${domainName}\nfunction processTransaction(payload) {\n  console.log('Validating payload...');\n  const result = executeStep(payload);\n  console.log('Completed step with status:', result.status);\n  return result;\n}`
        : isDebugging
        ? `// Defective Routine in ${domainName}\nasync function handleBatchRequests(items) {\n  // Bug: unbounded parallel promises without throttling\n  return Promise.all(items.map(item => fetchItem(item.id)));\n}`
        : undefined,
      expected_key_points: [
        `Detailed architectural evaluation of ${t.name}`,
        `Analysis of trade-offs (time vs space, throughput vs latency)`,
        `Concrete technical justification with edge case considerations`,
      ],
      improved_answer: `When evaluating ${t.name} in ${domainName}, engineering trade-offs govern the optimal decision. Key considerations include asymptotic overhead, network/disk latency, memory pressure, and fault recovery boundaries. Prioritizing decoupled abstractions ensures resilient scaling.`,
    });
  });

  // LEVEL 3: PRACTICAL / CODING / PROBLEM SOLVING (10 Questions)
  const l3Topics = [
    { name: 'Core Algorithm & Data Pipeline Implementation', type: 'coding', lang: 'typescript' },
    { name: 'High-Throughput Distributed System Design', type: 'scenario', lang: undefined },
    { name: 'Fault-Tolerant Asynchronous Workflow', type: 'coding', lang: 'typescript' },
    { name: 'Real-Time Telemetry & Monitoring Architecture', type: 'scenario', lang: undefined },
    { name: 'Defect Analysis & Root-Cause Mitigation', type: 'debugging', lang: 'typescript' },
    { name: 'Secure Authentication & Access Control Pipeline', type: 'coding', lang: 'typescript' },
    { name: 'Data Consistency & Distributed Conflict Resolution', type: 'scenario', lang: undefined },
    { name: 'Custom LRU / LFU Cache Engine Implementation', type: 'coding', lang: 'typescript' },
    { name: 'Zero-Downtime Infrastructure Migration Strategy', type: 'scenario', lang: undefined },
    { name: 'Production Disaster Recovery & Chaos Engineering', type: 'scenario', lang: undefined },
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
        ? `Implement a production-ready solution in ${domainName} for "${t.name}". Ensure robust input validation, boundary condition handling, and optimal asymptotic time/space efficiency.`
        : isDebugging
        ? `Analyze a severe production outage caused by "${t.name}" in ${domainName}. How would you isolate the root cause, mitigate immediate business impact, and architect a permanent safeguard?`
        : `Design a comprehensive production system in ${domainName} addressing "${t.name}". Detail the component topology, data flow, failure recovery, caching layer, and scaling bottlenecks.`,
      code_template: isCoding
        ? `// ${domainName} Implementation: ${t.name}\nexport function executeTask<T>(input: T): { success: boolean; data: any } {\n  // Implement your algorithm or business logic\n  return { success: true, data: null };\n}`
        : undefined,
      expected_key_points: [
        `Production-grade architecture / implementation for ${t.name}`,
        `Edge-case and error recovery handling`,
        `Computational complexity and scalability analysis`,
      ],
      improved_answer: `For ${t.name} in ${domainName}, the optimal architecture balances modularity, fault isolation, and low operational latency. By introducing idempotent pipelines, rate limiting, and structured telemetry, the system achieves enterprise-grade reliability and seamless horizontal scaling.`,
    });
  });

  return questions;
}
