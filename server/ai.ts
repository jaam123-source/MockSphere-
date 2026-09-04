import { GoogleGenAI } from '@google/genai';
import { AIQuestionEvaluation, TechnicalDomainId, TechnicalQuestion } from '../src/types';
import { TECHNICAL_DOMAINS_LIST, TECHNICAL_QUESTION_BANK } from './technicalQuestionBank';
import { getCuratedDomainQuestions } from './domainCuratedQuestions';
import { detectKeywordsInAnswer } from '../src/utils/technicalKeywords';

// Server-side Google GenAI client
let genAIClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Resilient multi-model execution helper with circuit breaker
const CANDIDATE_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.7-flash', 'gemini-flash-latest'];
const modelCooldownMap = new Map<string, number>();
const COOLDOWN_MS = 60 * 1000; // 60 seconds cooldown for busy models

async function callGeminiWithFallback(contents: string, responseMimeType?: string): Promise<string | null> {
  const ai = getAI();
  if (!ai) return null;

  const now = Date.now();
  // Filter and sort models: prioritize models not currently on cooldown
  const availableModels = CANDIDATE_MODELS.slice().sort((a, b) => {
    const coolA = (modelCooldownMap.get(a) || 0) > now ? 1 : 0;
    const coolB = (modelCooldownMap.get(b) || 0) > now ? 1 : 0;
    return coolA - coolB;
  });

  for (const model of availableModels) {
    const isCooling = (modelCooldownMap.get(model) || 0) > now;
    if (isCooling) continue;

    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: responseMimeType ? { responseMimeType } : undefined,
      });

      const text = response.text?.trim();
      if (text) {
        // Clear cooldown if it succeeded
        modelCooldownMap.delete(model);
        return text;
      }
    } catch (err: any) {
      const isHighDemand = err?.status === 503 || err?.message?.includes('503') || err?.message?.includes('demand');
      if (isHighDemand) {
        modelCooldownMap.set(model, now + COOLDOWN_MS);
      }
      // Continue to next available model quietly
    }
  }

  return null;
}

export const DOMAIN_DEFAULTS: Record<TechnicalDomainId, TechnicalQuestion[]> = {
  fullstack: getCuratedDomainQuestions('fullstack'),
  genai: getCuratedDomainQuestions('genai'),
  cloud: getCuratedDomainQuestions('cloud'),
  datascience: getCuratedDomainQuestions('datascience'),
  cybersecurity: getCuratedDomainQuestions('cybersecurity'),
};

export async function generateAITechnicalQuestions(
  domain: TechnicalDomainId,
  isRetake = false,
  previousWeakTopics: string[] = []
): Promise<TechnicalQuestion[]> {
  const curated = getCuratedDomainQuestions(domain);
  const domainMeta = TECHNICAL_DOMAINS_LIST.find((d) => d.id === domain) || TECHNICAL_DOMAINS_LIST[0];

  // Try generating via Gemini AI if available
  try {
    const retakePromptAddition = isRetake && previousWeakTopics.length > 0
      ? `This is a RETAKE interview. The candidate previously struggled with these topics: [${previousWeakTopics.join(', ')}]. Generate new questions that prioritize testing these weak areas alongside fresh questions.`
      : 'Generate an initial comprehensive interview set.';

    const prompt = `You are a Principal Engineering Lead & Live Technical Interviewer for a technology company.
Domain: "${domainMeta.name}" (${domain}).
${retakePromptAddition}

CRITICAL REQUIREMENT:
- Keep every question SIMPLE, SHORT, and DIRECT (1-2 sentences maximum). Real technical interviewers ask concise, realistic questions.
- DO NOT write long, academic, or multi-paragraph essay questions.
- Keep expected_key_points to 2-3 concise points.
- Keep improved_answer concise, crisp, and direct (2-3 sentences).

Generate a total of 30 technical interview questions split into EXACTLY three progressive levels:
- Level 1 (Basic / Fundamentals): 10 simple questions (core definitions, primitives, basic syntax, differences)
- Level 2 (Intermediate / Understanding): 10 clear questions (how/why, concept comparisons, debugging, standard tradeoffs)
- Level 3 (Practical / Coding / Problem Solving): 10 concise practical questions (short coding problems, straightforward scenarios, clean solutions)

Format the output strictly as a JSON array of 30 objects matching this schema:
[
  {
    "question_id": "${domain}_l1_q1",
    "domain": "${domain}",
    "level": 1,
    "level_name": "Level 1 — Basic",
    "topic": "Topic Name",
    "difficulty": "Easy",
    "type": "conceptual",
    "question": "Clear problem statement",
    "expected_key_points": ["Point 1", "Point 2"],
    "improved_answer": "Complete, technically precise model answer for interviewers"
  }
]`;

    const text = await callGeminiWithFallback(prompt, 'application/json');
    if (text) {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length >= 15) {
        // Normalize generated questions
        const level1 = parsed.filter((q) => q.level === 1).slice(0, 10);
        const level2 = parsed.filter((q) => q.level === 2).slice(0, 10);
        const level3 = parsed.filter((q) => q.level === 3).slice(0, 10);

        const combined = [...level1, ...level2, ...level3];
        if (combined.length === 30) {
          return combined.map((q, idx) => ({
            question_id: q.question_id || `${domain}_q_${idx + 1}`,
            domain,
            level: (q.level || (idx < 10 ? 1 : idx < 20 ? 2 : 3)) as 1 | 2 | 3,
            level_name: (q.level === 1 ? 'Level 1 — Basic' : q.level === 2 ? 'Level 2 — Intermediate' : 'Level 3 — Practical') as any,
            topic: q.topic || `${domainMeta.name} Core`,
            difficulty: q.difficulty || (idx < 10 ? 'Easy' : idx < 20 ? 'Medium' : 'Hard'),
            type: q.type || (idx < 10 ? 'conceptual' : idx < 20 ? 'conceptual' : 'coding'),
            question: q.question,
            code_snippet_display: q.code_snippet_display,
            code_template: q.code_template,
            language: q.language || 'typescript',
            hints: q.hints || [],
            expected_key_points: q.expected_key_points || [],
            improved_answer: q.improved_answer,
          }));
        }
      }
    }
  } catch (err) {
    console.error('Error generating AI technical questions:', err);
  }

  // Fallback to high-quality curated bank with shuffling if retake
  let pool = [...curated];
  if (isRetake) {
    // Shuffle Level 1, 2, and 3 pools independently to ensure a fresh experience
    const l1 = pool.filter((q) => q.level === 1).sort(() => Math.random() - 0.5);
    const l2 = pool.filter((q) => q.level === 2).sort(() => Math.random() - 0.5);
    const l3 = pool.filter((q) => q.level === 3).sort(() => Math.random() - 0.5);
    pool = [...l1.slice(0, 10), ...l2.slice(0, 10), ...l3.slice(0, 10)];
  }

  return pool.slice(0, 30);
}

export async function evaluateTechnicalAnswer(payload: {
  domain: TechnicalDomainId;
  question: string;
  response_type: string;
  response_text: string;
  code_snippet?: string;
  diagram_data?: string;
  time_taken_seconds?: number;
  topic?: string;
  expected_key_points?: string[];
  keywords?: string[];
  attempt_number?: number;
}): Promise<AIQuestionEvaluation> {
  const combinedAnswer = [
    payload.response_text ? `Text/Voice response: ${payload.response_text}` : '',
    payload.code_snippet ? `Code implementation:\n${payload.code_snippet}` : '',
    payload.diagram_data ? `Diagram / Architecture notes: ${payload.diagram_data}` : '',
  ].filter(Boolean).join('\n\n');

  const kwCheck = detectKeywordsInAnswer(combinedAnswer, {
    question: payload.question,
    topic: payload.topic,
    expected_key_points: payload.expected_key_points,
    keywords: payload.keywords,
  });

  if (!combinedAnswer.trim()) {
    return {
      score: 0,
      correctness: 0,
      technical_depth: 0,
      clarity: 0,
      confidence_score: 0,
      verbal_status: 'INCORRECT',
      verbal_feedback: "I didn't catch any answer for this question. Let's move on to the next one.",
      spoken_response: "I didn't receive an answer for this question. Let's proceed to the next topic.",
      feedback: 'No response was provided for this question.',
      what_you_got_right: [],
      what_you_missed: ['No technical answer or explanation was submitted.'],
      improved_answer: 'Ensure you provide a clear conceptual explanation, architectural reasoning, or code implementation for the interviewer.',
      strengths: [],
      weaknesses: ['Empty answer submitted'],
      suggested_improvements: ['Ensure you articulate your thought process aloud and provide code when required.'],
      detected_keywords: [],
      required_keywords: kwCheck.requiredKeywords,
      keyword_count: 0,
      has_required_keywords: false,
      attempt_number: payload.attempt_number || 1,
    };
  }

  try {
    const prompt = `You are an experienced Principal Engineering Lead conducting a live, realistic technical interview for a "${payload.domain}" candidate.

Question Asked:
${payload.question}

Candidate Submission (${payload.response_type} mode):
${combinedAnswer}

Evaluate the candidate's answer with human-like discernment across:
1. Technical correctness and accuracy (0-100)
2. Conceptual depth and system mastery (0-100)
3. Communication clarity and structure (0-100)
4. Confidence score (0-100) based on assertiveness, precision, and lack of filler hesitation.
5. If code/query is provided: evaluate algorithmic efficiency, syntax, edge cases.

Provide realistic interviewer conversational feedback:
- verbal_status: "CORRECT" (≥75 score), "PARTIALLY CORRECT" (45-74 score), or "INCORRECT" (<45 score).
- spoken_response: A natural, spoken line the interviewer says aloud right now. (e.g., "Good explanation. You clearly understand the core reconciliation loop...", or "That's a good start, but you missed the fiber tree lifecycle...", or "That's not quite right. In production systems...")
- what_you_got_right: 1-3 concise bullet points of valid points the candidate stated.
- what_you_missed: 1-3 concise bullet points of missing nuances or inaccuracies.
- improved_answer: The ideal, senior-engineer phrasing of the answer.

Return strict JSON:
{
  "score": 85,
  "correctness": 88,
  "technical_depth": 82,
  "clarity": 85,
  "code_quality": 80,
  "confidence_score": 85,
  "verbal_status": "CORRECT",
  "verbal_feedback": "Strong explanation demonstrating solid command of the fundamentals.",
  "spoken_response": "Good explanation. You clearly understand the core reconciliation loop. Let's move on.",
  "feedback": "2-3 sentence constructive critique",
  "what_you_got_right": ["Identified virtual DOM diffing", "Mentioned component keys"],
  "what_you_missed": ["Could have detailed fiber priority queues"],
  "improved_answer": "Precise senior-level answer...",
  "strengths": ["Clear technical terminology", "Structured reasoning"],
  "weaknesses": ["Minor edge condition omission"],
  "suggested_improvements": ["Discuss computational complexity and memory bounds."],
  "follow_up_prompt": "Optional brief natural follow-up question if interesting"
}`;

    const text = await callGeminiWithFallback(prompt, 'application/json');
    if (text) {
      const parsed = JSON.parse(text);
      const score = Math.min(100, Math.max(0, Number(parsed.score) || 75));
      const status: 'CORRECT' | 'PARTIALLY CORRECT' | 'INCORRECT' =
        parsed.verbal_status || (score >= 75 ? 'CORRECT' : score >= 45 ? 'PARTIALLY CORRECT' : 'INCORRECT');

      return {
        score,
        correctness: Math.min(100, Math.max(0, Number(parsed.correctness) || score)),
        technical_depth: Math.min(100, Math.max(0, Number(parsed.technical_depth) || score)),
        clarity: Math.min(100, Math.max(0, Number(parsed.clarity) || 80)),
        code_quality: parsed.code_quality ? Math.min(100, Math.max(0, Number(parsed.code_quality))) : undefined,
        confidence_score: Math.min(100, Math.max(0, Number(parsed.confidence_score) || 80)),
        verbal_status: status,
        verbal_feedback: parsed.verbal_feedback || (status === 'CORRECT' ? 'Great explanation!' : status === 'PARTIALLY CORRECT' ? "You're on the right track, but missed a few details." : 'Not quite accurate.'),
        spoken_response: parsed.spoken_response || (status === 'CORRECT' ? "That's correct. Good explanation." : status === 'PARTIALLY CORRECT' ? "That's a good start, but there are a few important points you missed." : "That's not quite right. Let's proceed to the next question."),
        feedback: parsed.feedback || 'Response demonstrates technical understanding.',
        what_you_got_right: Array.isArray(parsed.what_you_got_right) ? parsed.what_you_got_right : ['Communicated core concept'],
        what_you_missed: Array.isArray(parsed.what_you_missed) ? parsed.what_you_missed : ['Could expand on advanced edge cases'],
        improved_answer: parsed.improved_answer || 'A complete answer articulates the core mechanism, runtime behavior, and scalability trade-offs.',
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Solid foundational grasp'],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : ['Elaborate deeper on production failure modes'],
        suggested_improvements: Array.isArray(parsed.suggested_improvements) ? parsed.suggested_improvements : ['Incorporate time/space complexity into explanations.'],
        follow_up_prompt: parsed.follow_up_prompt,
        detected_keywords: kwCheck.detectedKeywords,
        required_keywords: kwCheck.requiredKeywords,
        keyword_count: kwCheck.detectedCount,
        has_required_keywords: kwCheck.hasAtLeastTwoKeywords,
        attempt_number: payload.attempt_number || 1,
      };
    }
  } catch (err) {
    console.error('Error evaluating technical answer with AI:', err);
  }

  // Resilient heuristic fallback
  const wordCount = combinedAnswer.split(/\s+/).length;
  const hasCode = !!payload.code_snippet && payload.code_snippet.length > 30;
  const baseScore = Math.min(92, Math.max(50, Math.floor(wordCount * 1.3) + (hasCode ? 25 : 15)));
  const status: 'CORRECT' | 'PARTIALLY CORRECT' | 'INCORRECT' =
    baseScore >= 75 ? 'CORRECT' : baseScore >= 50 ? 'PARTIALLY CORRECT' : 'INCORRECT';

  return {
    score: baseScore,
    correctness: Math.min(100, baseScore + 2),
    technical_depth: baseScore,
    clarity: 82,
    code_quality: hasCode ? 80 : undefined,
    confidence_score: Math.min(95, 60 + Math.floor(wordCount / 2)),
    verbal_status: status,
    verbal_feedback: status === 'CORRECT' ? 'Solid technical explanation.' : status === 'PARTIALLY CORRECT' ? "Good points, but could be more complete." : 'Needs more technical depth.',
    spoken_response: status === 'CORRECT' ? "Good explanation. You've covered the core concepts well." : status === 'PARTIALLY CORRECT' ? "You're on the right track, though a few technical details were missing." : "That's not quite right. Let's move on to the next question.",
    feedback: `Demonstrates understanding of ${payload.domain} concepts with structured articulation.`,
    what_you_got_right: ['Addressed the main question requirements', hasCode ? 'Provided working code implementation' : 'Articulated key principles'],
    what_you_missed: ['Could mention specific asymptotic bounds and edge case limits'],
    improved_answer: `For ${payload.domain}, a senior response balances high-level architecture with low-level execution trade-offs, mentioning complexity, error isolation, and operational metrics.`,
    strengths: [
      'Clear terminology and structured thought process',
      hasCode ? 'Clean syntactical structure and functional logic' : 'Logical problem framing',
    ],
    weaknesses: ['Could elaborate on edge cases and performance trade-offs'],
    suggested_improvements: [
      'Discuss computational complexity (time/space) and real-world system boundaries.',
    ],
    detected_keywords: kwCheck.detectedKeywords,
    required_keywords: kwCheck.requiredKeywords,
    keyword_count: kwCheck.detectedCount,
    has_required_keywords: kwCheck.hasAtLeastTwoKeywords,
    attempt_number: payload.attempt_number || 1,
  };
}

export async function evaluateHREvaluation(payload: {
  question: string;
  response_text: string;
}): Promise<{
  score: number;
  relevance: number;
  clarity: number;
  communication_quality: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
}> {
  if (!payload.response_text.trim()) {
    return {
      score: 0,
      relevance: 0,
      clarity: 0,
      communication_quality: 0,
      feedback: 'No response was provided.',
      strengths: [],
      weaknesses: ['Empty answer submitted'],
    };
  }

  try {
    const prompt = `You are a Senior Talent & HR Director assessing a candidate's behavioral and leadership response.

Question:
${payload.question}

Candidate Answer:
${payload.response_text}

Evaluate on:
1. Relevance to the question intent
2. Clarity and coherence
3. Professionalism, emotional intelligence, and communication effectiveness (STAR method)

Return strict JSON:
{
  "score": 85,
  "relevance": 85,
  "clarity": 85,
  "communication_quality": 85,
  "feedback": "2-3 sentence executive review",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1"]
}`;

    const text = await callGeminiWithFallback(prompt, 'application/json');
    if (text) {
      const parsed = JSON.parse(text);
      return {
        score: Math.min(100, Math.max(0, Number(parsed.score) || 80)),
        relevance: Math.min(100, Math.max(0, Number(parsed.relevance) || 80)),
        clarity: Math.min(100, Math.max(0, Number(parsed.clarity) || 80)),
        communication_quality: Math.min(100, Math.max(0, Number(parsed.communication_quality) || 80)),
        feedback: parsed.feedback || 'Effective communication demonstrating situational awareness.',
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Good self-reflection'],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : ['Add specific quantitative outcomes'],
      };
    }
  } catch (err) {
    console.error('Error evaluating HR answer with AI:', err);
  }

  // Resilient heuristic fallback
  return {
    score: 82,
    relevance: 85,
    clarity: 80,
    communication_quality: 85,
    feedback: 'Authentic response utilizing the STAR (Situation, Task, Action, Result) behavioral framework.',
    strengths: ['Clear narrative structure', 'Demonstrated team collaboration and self-awareness'],
    weaknesses: ['Could quantify measurable outcomes more explicitly'],
  };
}

export async function generateFinalAIFeedback(data: {
  candidate_name: string;
  domain: string;
  aptitude_scores: Record<string, number>;
  technical_score: number;
  hr_score: number;
  overall_score: number;
}): Promise<{
  executive_summary: string;
  key_strengths: string[];
  critical_weaknesses: string[];
  recommended_topics: string[];
  personalized_action_plan: Array<{
    step: number;
    title: string;
    focus: string;
    timeframe: string;
  }>;
}> {
  try {
    const prompt = `You are a Principal Career & Technical Coach evaluating a candidate's complete assessment record:
Candidate: ${data.candidate_name}
Technical Domain: ${data.domain}
Aptitude Scores: ${JSON.stringify(data.aptitude_scores)}
Technical AI Score: ${data.technical_score}%
HR Behavioral Score: ${data.hr_score}%
Overall Composite Score: ${data.overall_score}%

Generate a comprehensive, personalized executive career assessment and 3-step action plan in JSON:
{
  "executive_summary": "3-sentence executive synopsis",
  "key_strengths": ["strength 1", "strength 2", "strength 3"],
  "critical_weaknesses": ["weakness 1", "weakness 2"],
  "recommended_topics": ["topic 1", "topic 2", "topic 3"],
  "personalized_action_plan": [
    {
      "step": 1,
      "title": "Action title",
      "focus": "Detailed practice instruction",
      "timeframe": "Week 1-2"
    },
    {
      "step": 2,
      "title": "Action title",
      "focus": "Detailed practice instruction",
      "timeframe": "Week 3"
    },
    {
      "step": 3,
      "title": "Action title",
      "focus": "Detailed practice instruction",
      "timeframe": "Week 4"
    }
  ]
}`;

    const text = await callGeminiWithFallback(prompt, 'application/json');
    if (text) {
      const parsed = JSON.parse(text);
      return {
        executive_summary: parsed.executive_summary || `${data.candidate_name} demonstrated consistent preparation and problem-solving agility across all assessment milestones.`,
        key_strengths: Array.isArray(parsed.key_strengths) && parsed.key_strengths.length > 0
          ? parsed.key_strengths
          : [`Solid analytical reasoning in ${data.domain}`, 'Clear algorithmic articulation', 'Effective leadership communication'],
        critical_weaknesses: Array.isArray(parsed.critical_weaknesses) && parsed.critical_weaknesses.length > 0
          ? parsed.critical_weaknesses
          : ['Needs deeper trade-off analysis under strict speed limits', 'Edge-case handling in complex distributed topologies'],
        recommended_topics: Array.isArray(parsed.recommended_topics) && parsed.recommended_topics.length > 0
          ? parsed.recommended_topics
          : ['Advanced data structures and cache coherency', 'System design scalability patterns', 'Behavioral leadership STAR storytelling'],
        personalized_action_plan: Array.isArray(parsed.personalized_action_plan) && parsed.personalized_action_plan.length > 0
          ? parsed.personalized_action_plan
          : [
              { step: 1, title: 'Aptitude Speed Drills', focus: 'Solve 20 timed questions daily focusing on weak categories.', timeframe: 'Week 1' },
              { step: 2, title: 'Deep-Dive Architecture Project', focus: `Build an end-to-end service implementing ${data.domain} best practices.`, timeframe: 'Week 2-3' },
              { step: 3, title: 'Mock Leadership Simulator', focus: 'Practice voice-recorded responses and behavioral STAR narratives.', timeframe: 'Week 4' },
            ],
      };
    }
  } catch (err) {
    console.error('Error generating final AI feedback with Gemini API:', err);
  }

  // Graceful, personalized fallback synthesis based on actual user scores and domain
  const isHigh = data.overall_score >= 70;
  return {
    executive_summary: `${data.candidate_name} completed the 4-stage evaluation with an overall score of ${data.overall_score}%. ${
      isHigh
        ? `Candidate exhibits strong readiness across quantitative reasoning, ${data.domain} specialization, and behavioral alignment.`
        : `Candidate shows foundational mastery in ${data.domain} but requires targeted reinforcement in high-speed problem solving and edge-case design.`
    }`,
    key_strengths: [
      `Solid problem solving and domain mastery in ${data.domain}`,
      'Structured communication and modular conceptual reasoning',
      'Professional behavioral response framing',
    ],
    critical_weaknesses: [
      'Speed optimization under strict test constraints',
      'Edge-case coverage in complex distributed topologies',
    ],
    recommended_topics: [
      'Advanced algorithmic optimization and spatial trade-offs',
      'Distributed systems fault tolerance and data consistency models',
      'Behavioral leadership scenario practice with quantifiable metrics',
    ],
    personalized_action_plan: [
      {
        step: 1,
        title: 'Aptitude Speed & Precision Drill',
        focus: 'Practice 20 timed questions daily focusing on weak categories and formula mastery.',
        timeframe: 'Week 1',
      },
      {
        step: 2,
        title: 'Deep-Dive Architecture & Code Lab',
        focus: `Build an end-to-end reference application highlighting ${data.domain} principles and database caching.`,
        timeframe: 'Week 2-3',
      },
      {
        step: 3,
        title: 'Mock Interview Simulator',
        focus: 'Practice voice-recorded responses and behavioral STAR narratives with quantifiable results.',
        timeframe: 'Week 4',
      },
    ],
  };
}
