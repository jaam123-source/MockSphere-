import { AptitudeQuestion, AptitudeTopicId } from '../src/types';
import { getQuantitativeQuestions } from './questions/quantitative';
import { getLogicalQuestions } from './questions/logical';
import { getVerbalQuestions } from './questions/verbal';
import { getSpecializedQuestions } from './questions/specialized';

export const TOPICS_META: Record<AptitudeTopicId, { name: string; icon: string; description: string }> = {
  quantitative: {
    name: 'Quantitative Aptitude',
    icon: 'Calculator',
    description: 'Master mathematical calculations, arithmetic, algebra, probability, and numerical problem-solving.',
  },
  logical: {
    name: 'Logical & Analytical Reasoning',
    icon: 'BrainCircuit',
    description: 'Sharpen your analytical deductions, patterns, seating puzzles, syllogisms, and critical reasoning.',
  },
  verbal: {
    name: 'Verbal Ability',
    icon: 'BookOpenCheck',
    description: 'Enhance your English vocabulary, grammar precision, error analysis, and comprehension mastery.',
  },
  specialized: {
    name: 'Specialized & Technical Aptitude',
    icon: 'Cpu',
    description: 'Core computer science foundations, algorithms, data structures, OS, DBMS, networking, and system design.',
  },
};

export const CONCEPT_TIPS: Record<string, string> = {
  Percentages: 'Remember that X% of Y is (X/100) * Y. For percentage change, calculate ((New - Old) / Old) * 100.',
  Fractions: 'Find the lowest common denominator (LCM) when adding/subtracting fractions, and invert the divisor when dividing.',
  'Profit & Loss': 'Profit% = (Profit / CP) * 100. Selling Price (SP) = CP * (1 + Profit% / 100). Cost Price is always the baseline.',
  Discounts: 'Single equivalent discount for successive discounts d1 and d2 = d1 + d2 - (d1 * d2)/100.',
  'Simple Interest': 'SI = (P * R * T) / 100. Principal remains constant throughout the tenure.',
  'Compound Interest': 'Amount = P * (1 + R/100)^T. CI = Amount - P. Note the compounding frequency (annual, semi-annual).',
  'Ratio & Proportion': 'If A:B = m:n and B:C = p:q, scale B to equal values or compute A:B:C = (m*p) : (n*p) : (n*q).',
  'Mixtures & Alligation': 'Use the alligation rule: (Cheaper Quantity / Dearer Quantity) = (Dearer Price - Mean Price) / (Mean Price - Cheaper Price).',
  'Time & Work': 'If A finishes work in X days, 1 day work = 1/X. Combined 1-day work = 1/A + 1/B.',
  'Pipes & Cisterns': 'Inlet pipes do positive work (+1/X), outlet/leak pipes do negative work (-1/Y).',
  'Speed & Distance': 'Speed = Distance / Time. To convert km/h to m/s, multiply by 5/18. For m/s to km/h, multiply by 18/5.',
  'Trains & Streams': 'When crossing a pole, distance = train length. Downstream speed = u + v, Upstream speed = u - v.',
  'Number System': 'Divisibility by 9: sum of digits divisible by 9. Remainder cycles: powers repeat in cyclic patterns modulo n.',
  'HCF & LCM': 'Product of two numbers = HCF * LCM. HCF of fractions = HCF(numerators) / LCM(denominators).',
  'Permutations & Combinations': 'Arrangements where order matters: nPr = n! / (n - r)!. Selections where order does NOT matter: nCr = n! / (r! * (n - r)!).',
  Probability: 'Probability = (Favorable Outcomes) / (Total Possible Outcomes). P(At least 1) = 1 - P(None).',
  Mensuration: 'Rectangle Area = L * W; Circle Area = pi * r^2; Cylinder Volume = pi * r^2 * h; Sphere Volume = 4/3 * pi * r^3.',
  Geometry: 'Pythagoras theorem: a^2 + b^2 = c^2. Interior angles of n-sided polygon = (n - 2) * 180 degrees.',
  Algebra: 'Use identities: (a+b)^2 = a^2 + 2ab + b^2, (a-b)^2 = a^2 - 2ab + b^2, a^2 - b^2 = (a+b)(a-b).',
  'Data Interpretation': 'Carefully read axis labels, percentage bases, and relative growth formulas.',
  'Number Series': 'Examine consecutive differences (+d), second differences, prime sequences, or square/cube patterns.',
  'Letter Series': 'Map letters to alphabetical numerical positions (A=1 ... Z=26) to decode shifts.',
  'Blood Relations': 'Map generation levels vertically and siblings horizontally. Watch for "only son/daughter".',
  'Coding-Decoding': 'Inspect constant forward/backward shifts, letter position reversals, or vowel/consonant rules.',
  'Direction Sense': 'Draw a standard 4-quadrant compass (N, S, E, W). Right turn from North is East; from South is West.',
  Syllogisms: 'Venn diagrams clarify "All A are B", "Some A are B", "No A is B". Only choose conclusions that are universally valid.',
  'Seating Arrangement': 'Identify absolute fixed positions first (corners, direct opposites), then place relative constraints.',
  'Clocks & Calendars': 'Hour hand moves 0.5 deg/min; Minute hand moves 6 deg/min. Angle between hands = |30*H - 5.5*M|.',
  'Statements & Assumptions': 'An assumption is an unstated premise taken for granted by the speaker.',
  Synonyms: 'Consider the word\'s connotation (positive, negative, neutral) and contextual grammatical function.',
  Antonyms: 'Eliminate words with similar meanings to the root word first; select the direct contradictory opposite.',
  Grammar: 'Ensure subject-verb agreement (singular subjects like "each", "either", "neither" require singular verbs).',
  'Error Spotting': 'Inspect verb tenses, pronoun antecedents, dangling modifiers, and preposition usage.',
  Idioms: 'Idiomatic expressions have metaphorical rather than literal meanings.',
  'Data Structures': 'Understand trade-offs: Arrays offer O(1) random access; Linked Lists offer O(1) insertion/deletion at pointers.',
  Algorithms: 'Analyze time/space complexity invariants. Divide & conquer divides into subproblems; Greedy makes local optimal choices.',
  'Operating Systems': 'Coffman deadlock conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.',
  DBMS: 'Normal forms eliminate redundancies (1NF atomic, 2NF no partial dependency, 3NF no transitive dependency).',
  'Computer Networks': 'Remember OSI layers: Physical, Data Link, Network (IP), Transport (TCP/UDP), Session, Presentation, Application.',
  OOP: 'Encapsulation bundles data; Inheritance enables code reuse; Polymorphism supports dynamic dispatch; Abstraction hides implementation.',
  'System Design': 'CAP theorem states you can only guarantee 2 of Consistency, Availability, and Partition Tolerance.',
};

export function normalizeQuestionText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s%]/g, '');
}

export function generateDefaultQuestionBank(): AptitudeQuestion[] {
  const bank: AptitudeQuestion[] = [];
  const seenIds = new Set<string>();
  const seenTexts = new Set<string>();

  // 1. Gather all modularized learning questions
  const learningQuestions: AptitudeQuestion[] = [
    ...getQuantitativeQuestions(),
    ...getLogicalQuestions(),
    ...getVerbalQuestions(),
    ...getSpecializedQuestions(),
  ];

  for (const q of learningQuestions) {
    const norm = normalizeQuestionText(q.question);
    if (!seenIds.has(q.question_id) && !seenTexts.has(norm)) {
      seenIds.add(q.question_id);
      seenTexts.add(norm);
      bank.push(q);
    }
  }

  // 2. Assessment pools for Milestone Test 1 (Levels 1-5), Test 2 (Levels 6-10), and Final Capstone
  let qCounter = 0;
  const addTestQ = (
    topic_id: AptitudeTopicId,
    category: string,
    difficulty: 'Easy' | 'Medium' | 'Hard',
    question: string,
    correctText: string,
    distractor1: string,
    distractor2: string,
    distractor3: string,
    exp: string,
    pool_type: 'test1' | 'test2' | 'final'
  ) => {
    qCounter++;
    const norm = normalizeQuestionText(question);
    const qId = `q_${topic_id}_l0_${pool_type}_${qCounter}`;

    if (seenIds.has(qId) || seenTexts.has(norm)) return;
    seenIds.add(qId);
    seenTexts.add(norm);

    const posIndex = (qCounter - 1) % 4;
    const posLetters: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];
    const correctLetter = posLetters[posIndex];

    const distractors = [distractor1, distractor2, distractor3];
    if (qCounter % 2 === 1) {
      const temp = distractors[0];
      distractors[0] = distractors[1];
      distractors[1] = temp;
    }

    const optionsMap: Record<'A' | 'B' | 'C' | 'D', string> = {
      A: '',
      B: '',
      C: '',
      D: '',
    };
    optionsMap[correctLetter] = correctText;
    let distIdx = 0;
    for (const ltr of posLetters) {
      if (ltr !== correctLetter) {
        optionsMap[ltr] = distractors[distIdx++] || 'Alternative option';
      }
    }

    bank.push({
      question_id: qId,
      topic_id,
      level_id: 0,
      category,
      concept: category,
      difficulty,
      question,
      option_a: optionsMap.A,
      option_b: optionsMap.B,
      option_c: optionsMap.C,
      option_d: optionsMap.D,
      correct_answer: correctLetter,
      explanation: exp,
      pool_type,
    });
  };

  const topicsList: AptitudeTopicId[] = ['quantitative', 'logical', 'verbal', 'specialized'];

  // Test 1 (Levels 1-5 synthesis)
  topicsList.forEach((tId) => {
    const topicLearningQs = bank.filter((q) => q.topic_id === tId && q.level_id >= 1 && q.level_id <= 5);
    for (let i = 0; i < 30; i++) {
      const base = topicLearningQs[i % topicLearningQs.length];
      if (base) {
        addTestQ(
          tId,
          `Test 1 Milestone (${base.category})`,
          'Medium',
          `[Milestone Assessment 1 - Q${i + 1}] Review question in ${base.category}:\n${base.question}`,
          base.correct_answer === 'A' ? base.option_a : base.correct_answer === 'B' ? base.option_b : base.correct_answer === 'C' ? base.option_c : base.option_d,
          base.option_a !== (base.correct_answer === 'A' ? base.option_a : base.option_b) ? base.option_a : base.option_c,
          base.option_b !== (base.correct_answer === 'B' ? base.option_b : base.option_a) ? base.option_b : base.option_d,
          base.option_d !== (base.correct_answer === 'D' ? base.option_d : base.option_c) ? base.option_d : base.option_b,
          `Milestone solution: ${base.explanation}`,
          'test1'
        );
      }
    }
  });

  // Test 2 (Levels 6-10 synthesis)
  topicsList.forEach((tId) => {
    const topicLearningQs = bank.filter((q) => q.topic_id === tId && q.level_id >= 6 && q.level_id <= 10);
    for (let i = 0; i < 30; i++) {
      const base = topicLearningQs[i % topicLearningQs.length];
      if (base) {
        addTestQ(
          tId,
          `Test 2 Mastery (${base.category})`,
          'Hard',
          `[Mastery Assessment 2 - Q${i + 1}] Advanced problem in ${base.category}:\n${base.question}`,
          base.correct_answer === 'A' ? base.option_a : base.correct_answer === 'B' ? base.option_b : base.correct_answer === 'C' ? base.option_c : base.option_d,
          base.option_a !== (base.correct_answer === 'A' ? base.option_a : base.option_b) ? base.option_a : base.option_c,
          base.option_b !== (base.correct_answer === 'B' ? base.option_b : base.option_a) ? base.option_b : base.option_d,
          base.option_d !== (base.correct_answer === 'D' ? base.option_d : base.option_c) ? base.option_d : base.option_b,
          `Mastery solution: ${base.explanation}`,
          'test2'
        );
      }
    }
  });

  // Final Capstone Assessment (All levels synthesis)
  topicsList.forEach((tId) => {
    const topicLearningQs = bank.filter((q) => q.topic_id === tId && q.level_id >= 1 && q.level_id <= 10);
    for (let i = 0; i < 15; i++) {
      const base = topicLearningQs[(i * 2) % topicLearningQs.length];
      if (base) {
        addTestQ(
          tId,
          `Final Capstone (${base.category})`,
          'Hard',
          `[Final Comprehensive Capstone Q${i + 1}] Comprehensive synthesis in ${base.category}:\n${base.question}`,
          base.correct_answer === 'A' ? base.option_a : base.correct_answer === 'B' ? base.option_b : base.correct_answer === 'C' ? base.option_c : base.option_d,
          base.option_a !== (base.correct_answer === 'A' ? base.option_a : base.option_b) ? base.option_a : base.option_c,
          base.option_b !== (base.correct_answer === 'B' ? base.option_b : base.option_a) ? base.option_b : base.option_d,
          base.option_d !== (base.correct_answer === 'D' ? base.option_d : base.option_c) ? base.option_d : base.option_b,
          `Comprehensive Capstone solution: ${base.explanation}`,
          'final'
        );
      }
    }
  });

  return bank;
}
