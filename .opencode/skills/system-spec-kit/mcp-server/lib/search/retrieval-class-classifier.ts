// ───────────────────────────────────────────────────────────────
// MODULE: Retrieval Class Classifier
// ───────────────────────────────────────────────────────────────
// Pure query-shape classifier used by routing before channel expansion.

type RetrievalClass = 'Neutral' | 'SingleHop' | 'MultiHop' | 'Temporal' | 'Entity' | 'Quote';

type RetrievalClassConfidence = 'high' | 'medium' | 'low' | 'neutral';

interface RetrievalClassResult {
  retrievalClass: RetrievalClass;
  confidence: RetrievalClassConfidence;
  matchedSignals: string[];
}

const NEUTRAL_RETRIEVAL_CLASS: RetrievalClass = 'Neutral';
const RETRIEVAL_CLASS_PRECEDENCE: readonly RetrievalClass[] = [
  'Quote',
  'Temporal',
  'MultiHop',
  'Entity',
  'SingleHop',
] as const;

const QUOTE_PATTERNS: readonly RegExp[] = [
  /"[^"]+"/,
  /`[^`]+`/,
  /\b(?:quote|quoted|verbatim|exact wording|exact phrase|literal text)\b/i,
  /\bwhat\s+did\s+.+\s+say\b/i,
];

const TEMPORAL_PATTERNS: readonly RegExp[] = [
  /\b(?:latest|current|recent|newest|oldest|history|timeline)\b/i,
  /\b(?:when|before|after|since|until|during)\b/i,
  /\b(?:today|yesterday|tomorrow|last\s+\w+|next\s+\w+)\b/i,
  /\b\d{4}-\d{2}-\d{2}\b/,
];

const MULTI_HOP_PATTERNS: readonly RegExp[] = [
  /\b(?:why|how)\s+(?:did|does|do|is|are|was|were|would|could|should)\b/i,
  /\b(?:trace|impact|dependency|dependencies|depends|relationship|related|cause|effect)\b/i,
  /\b(?:rationale|alternative|tradeoff|trade-off|compare|between|across|integrat(?:e|es|ion)|flow|chain)\b/i,
];

const ENTITY_PATTERNS: readonly RegExp[] = [
  /\b\d{3}-[a-z0-9]+(?:-[a-z0-9]+)*\b/i,
  /\b[A-Z]{2,}-[A-Z0-9-]+\b/,
  /\b[A-Z][A-Za-z0-9]+(?:[A-Z][A-Za-z0-9]+)+\b/,
  /\b[\w.-]+\.(?:ts|tsx|js|mjs|cjs|json|md|py|sh)\b/i,
  /\b(?:class|function|module|handler|packet|spec folder|file)\s+[\w./-]+\b/i,
];

const SINGLE_HOP_PATTERNS: readonly RegExp[] = [
  /^(?:find|show|get|locate|open|list|lookup)\b/i,
  /^(?:where|which|who)\b/i,
  /^what\s+(?:is|are|was|were)\b/i,
  /\b(?:find|show|get|locate)\s+(?:the\s+)?(?:spec|plan|task|checklist|file|record)\b/i,
];

function normalizeQuery(query: string): string {
  return query.trim().replace(/\s+/g, ' ');
}

function matchPatterns(query: string, patterns: readonly RegExp[]): string[] {
  const matches: string[] = [];
  for (const pattern of patterns) {
    if (pattern.test(query)) {
      matches.push(pattern.source);
    }
  }
  return matches;
}

function scoreClass(query: string, retrievalClass: RetrievalClass): string[] {
  switch (retrievalClass) {
    case 'Quote':
      return matchPatterns(query, QUOTE_PATTERNS);
    case 'Temporal':
      return matchPatterns(query, TEMPORAL_PATTERNS);
    case 'MultiHop':
      return matchPatterns(query, MULTI_HOP_PATTERNS);
    case 'Entity':
      return matchPatterns(query, ENTITY_PATTERNS);
    case 'SingleHop':
      return matchPatterns(query, SINGLE_HOP_PATTERNS);
    case 'Neutral':
      return [];
  }
  return [];
}

function confidenceForMatch(
  retrievalClass: RetrievalClass,
  matchedSignals: string[],
): RetrievalClassConfidence {
  if (retrievalClass === 'Neutral') return 'neutral';
  if (matchedSignals.length >= 2) return 'high';
  return retrievalClass === 'SingleHop' ? 'medium' : 'high';
}

function classifyRetrievalClass(query: string): RetrievalClassResult {
  if (typeof query !== 'string') {
    return { retrievalClass: NEUTRAL_RETRIEVAL_CLASS, confidence: 'neutral', matchedSignals: [] };
  }

  const normalized = normalizeQuery(query);
  if (normalized.length === 0) {
    return { retrievalClass: NEUTRAL_RETRIEVAL_CLASS, confidence: 'neutral', matchedSignals: [] };
  }

  for (const retrievalClass of RETRIEVAL_CLASS_PRECEDENCE) {
    const matchedSignals = scoreClass(normalized, retrievalClass);
    if (matchedSignals.length > 0) {
      return {
        retrievalClass,
        confidence: confidenceForMatch(retrievalClass, matchedSignals),
        matchedSignals,
      };
    }
  }

  return { retrievalClass: NEUTRAL_RETRIEVAL_CLASS, confidence: 'neutral', matchedSignals: [] };
}

function isSingleHopRetrieval(retrievalClass: RetrievalClass): boolean {
  return retrievalClass === 'SingleHop';
}

export {
  NEUTRAL_RETRIEVAL_CLASS,
  RETRIEVAL_CLASS_PRECEDENCE,
  classifyRetrievalClass,
  isSingleHopRetrieval,
};

export type {
  RetrievalClass,
  RetrievalClassResult,
  RetrievalClassConfidence,
};
