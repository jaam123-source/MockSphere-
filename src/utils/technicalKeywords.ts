import { TechnicalQuestion } from '../types';

// Common general words that should not count as standalone technical keywords
const STOP_WORDS = new Set([
  'what', 'which', 'explain', 'describe', 'difference', 'differences', 'how', 'when',
  'where', 'why', 'with', 'from', 'this', 'that', 'these', 'those', 'have', 'been',
  'using', 'used', 'make', 'makes', 'made', 'does', 'doing', 'into', 'onto', 'about',
  'after', 'before', 'between', 'under', 'over', 'more', 'most', 'some', 'such', 'only',
  'first', 'second', 'their', 'there', 'they', 'them', 'then', 'than', 'will', 'would',
  'could', 'should', 'might', 'must', 'each', 'every', 'both', 'either', 'neither',
  'main', 'basic', 'basics', 'core', 'standard', 'common', 'simple', 'overall', 'general',
  'and', 'are', 'was', 'were', 'the', 'for', 'not', 'but', 'via', 'all', 'any', 'can',
  'step', 'steps', 'point', 'points', 'representation', 'overview', 'details', 'detail',
  'concept', 'concepts', 'answer', 'question', 'various', 'understanding', 'working',
  'without', 'within', 'having', 'being', 'between', 'across', 'give', 'given', 'taking'
]);

/**
 * Normalizes a term for matching (lowercase, trimmed, strip extraneous quotes)
 */
function normalizeTerm(term: string): string {
  return term.toLowerCase().replace(/['"`,.:;()?!]/g, '').trim();
}

/**
 * Extracts and canonicalizes the primary technical keywords for a question.
 */
export function extractQuestionKeywords(question: Partial<TechnicalQuestion>): string[] {
  if (question.keywords && question.keywords.length > 0) {
    return Array.from(new Set(question.keywords.map(k => k.trim()).filter(Boolean)));
  }

  const keywordSet = new Set<string>();

  // 1. Extract from topic
  if (question.topic) {
    const topicParts = question.topic.split(/[&/\\,+-]/);
    for (const part of topicParts) {
      const clean = part.trim();
      if (clean.length > 2 && !STOP_WORDS.has(clean.toLowerCase())) {
        keywordSet.add(clean);
      }
    }
  }

  // 2. Extract technical terms from expected_key_points
  if (question.expected_key_points && Array.isArray(question.expected_key_points)) {
    for (const point of question.expected_key_points) {
      // Look for parenthesized terms, quotes, code words, or capitalized technical terms
      const matches = point.match(/\b([A-Z]{2,}|[A-Za-z]+(?:[A-Z][a-z]+)+|[A-Za-z0-9_-]{3,})\b/g) || [];
      for (const m of matches) {
        const lower = m.toLowerCase();
        if (!STOP_WORDS.has(lower) && m.length > 2 && !/^\d+$/.test(m)) {
          keywordSet.add(m);
        }
      }

      // Specific known multi-word phrases
      const phrases = [
        'event loop', 'thread pool', 'libuv', 'virtual dom', 'dom tree', 'render tree',
        'box model', 'temporal dead zone', 'status code', 'idempotent', 'idempotency',
        'hoisting', 'closure', 'middleware', 'immutability', 'pure function', 'dependency injection',
        'indexing', 'foreign key', 'race condition', 'deadlock', 'asynchronous', 'promise',
        'concurrency', 'serialization', 'localstorage', 'sessionstorage', 'cookies',
        'tokenization', 'cssom', 'hydration', 'reconciliation', 'memoization'
      ];

      const lowerPoint = point.toLowerCase();
      for (const phrase of phrases) {
        if (lowerPoint.includes(phrase)) {
          keywordSet.add(phrase);
        }
      }
    }
  }

  // 3. Extract technical terms from question statement
  if (question.question) {
    const qMatches = question.question.match(/\b([A-Z]{2,}|`[^`]+`|[A-Za-z]{3,})\b/g) || [];
    for (const raw of qMatches) {
      const clean = raw.replace(/`/g, '');
      const lower = clean.toLowerCase();
      if (!STOP_WORDS.has(lower) && clean.length > 2 && !/^\d+$/.test(clean)) {
        // Only add if it looks like an acronym or domain keyword
        if (/[A-Z]{2,}/.test(clean) || ['get', 'post', 'put', 'delete', 'dom', 'var', 'let', 'const', 'props', 'state', 'sql', 'nosql', 'node', 'react', 'jwt', 'rest', 'api'].includes(lower)) {
          keywordSet.add(clean);
        }
      }
    }
  }

  // Ensure we have at least 3 keywords by falling back to topic words
  if (keywordSet.size < 2 && question.topic) {
    const words = question.topic.split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w.toLowerCase()));
    words.forEach(w => keywordSet.add(w));
  }

  return Array.from(keywordSet).slice(0, 10);
}

export interface KeywordDetectionResult {
  detectedKeywords: string[];
  detectedCount: number;
  requiredKeywords: string[];
  hasAtLeastTwoKeywords: boolean;
  missingCount: number;
}

/**
 * Checks if a candidate's answer contains at least 2 keywords for the given question.
 */
export function detectKeywordsInAnswer(
  answer: string,
  question: Partial<TechnicalQuestion>
): KeywordDetectionResult {
  const targetKeywords = extractQuestionKeywords(question);
  if (!answer || !answer.trim() || targetKeywords.length === 0) {
    return {
      detectedKeywords: [],
      detectedCount: 0,
      requiredKeywords: targetKeywords,
      hasAtLeastTwoKeywords: false,
      missingCount: 2,
    };
  }

  const normalizedAnswer = normalizeTerm(answer);
  const detectedList: string[] = [];

  for (const kw of targetKeywords) {
    const normalizedKw = normalizeTerm(kw);
    if (!normalizedKw || normalizedKw.length < 2) continue;

    // Check multi-word phrase or single word with stem flexibility
    if (normalizedKw.includes(' ')) {
      if (normalizedAnswer.includes(normalizedKw)) {
        detectedList.push(kw);
      }
    } else {
      // Regex word boundary matching or stemming check
      // For example, "idempotent" matches "idempotent" or "idempotency"
      // "hoist" matches "hoist", "hoisting", "hoisted"
      const stem = normalizedKw.length > 5 ? normalizedKw.slice(0, 5) : normalizedKw;
      const regex = new RegExp(`\\b${escapeRegExp(normalizedKw)}\\b|\\b${escapeRegExp(stem)}[a-z]*\\b`, 'i');
      if (regex.test(normalizedAnswer) || normalizedAnswer.includes(normalizedKw)) {
        detectedList.push(kw);
      }
    }
  }

  const uniqueDetected = Array.from(new Set(detectedList));
  const detectedCount = uniqueDetected.length;

  return {
    detectedKeywords: uniqueDetected,
    detectedCount,
    requiredKeywords: targetKeywords,
    hasAtLeastTwoKeywords: detectedCount >= 2,
    missingCount: Math.max(0, 2 - detectedCount),
  };
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
