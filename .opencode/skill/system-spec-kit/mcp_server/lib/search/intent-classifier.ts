// ---------------------------------------------------------------
// MODULE: Intent Classifier
// 7 intent types with keyword/pattern scoring
// ---------------------------------------------------------------

/* -----------------------------------------------------------
   1. TYPES & CONSTANTS
----------------------------------------------------------------*/

type IntentType = 'add_feature' | 'fix_bug' | 'refactor' | 'security_audit' | 'understand' | 'find_spec' | 'find_decision';

interface IntentResult {
  intent: IntentType;
  confidence: number;
  scores: Record<IntentType, number>;
  keywords: string[];
}

interface IntentWeights {
  recency: number;
  importance: number;
  similarity: number;
  contextType: string | null;
}

const INTENT_TYPES: Record<string, IntentType> = {
  ADD_FEATURE: 'add_feature',
  FIX_BUG: 'fix_bug',
  REFACTOR: 'refactor',
  SECURITY_AUDIT: 'security_audit',
  UNDERSTAND: 'understand',
  FIND_SPEC: 'find_spec',
  FIND_DECISION: 'find_decision',
} as const;

const INTENT_KEYWORDS: Record<IntentType, string[]> = {
  add_feature: [
    'add', 'create', 'new', 'implement', 'build', 'feature', 'extend',
    'introduce', 'support', 'enable', 'integrate', 'develop',
  ],
  fix_bug: [
    'fix', 'bug', 'error', 'issue', 'broken', 'crash', 'fail', 'wrong',
    'problem', 'debug', 'patch', 'resolve', 'repair', 'incorrect',
  ],
  refactor: [
    'refactor', 'clean', 'improve', 'optimize', 'restructure', 'simplify',
    'reorganize', 'consolidate', 'migrate', 'modernize', 'rename',
  ],
  security_audit: [
    'security', 'vulnerability', 'exploit', 'injection', 'xss', 'csrf',
    'authentication', 'authorization', 'permission', 'audit', 'pentest',
    'sanitize', 'validate', 'encrypt', 'decrypt',
  ],
  understand: [
    'understand', 'explain', 'describe', 'overview',
    'architecture', 'design', 'flow', 'documentation', 'guide',
    'learn',
  ],
  find_spec: [
    'spec', 'specification', 'requirements', 'scope', 'feature',
    'plan', 'tasks', 'checklist', 'implementation',
  ],
  find_decision: [
    'decision', 'why', 'chose', 'rationale', 'alternative',
    'trade-off', 'tradeoff', 'adr', 'decision-record',
  ],
};

const INTENT_PATTERNS: Record<IntentType, RegExp[]> = {
  add_feature: [
    /add\s+(?:a\s+)?(?:new\s+)?/i,
    /create\s+(?:a\s+)?/i,
    /implement\s+/i,
    /build\s+(?:a\s+)?/i,
    /introduce\s+/i,
  ],
  fix_bug: [
    /fix\s+(?:the\s+)?/i,
    /debug\s+/i,
    /(?:is|are)\s+(?:broken|failing|crashing)/i,
    /(?:not|doesn't|won't)\s+(?:work|function|run)/i,
    /error\s+(?:in|with|when)/i,
    /how\s+to\s+fix/i,
  ],
  refactor: [
    /refactor\s+/i,
    /clean\s*up\s+/i,
    /improve\s+(?:the\s+)?/i,
    /optimize\s+/i,
    /migrate\s+(?:from|to)\s+/i,
  ],
  security_audit: [
    /security\s+(?:audit|review|check)/i,
    /vulnerabilit(?:y|ies)/i,
    /(?:sql|xss|csrf)\s+(?:injection|attack)/i,
    /pentest/i,
    /authentication\s+(?:issue|problem|bug)/i,
  ],
  understand: [
    /explain\s+(?:the\s+|how\s+|why\s+)/i,
    /(?:tell|show)\s+me\s+(?:about|how)/i,
    /give\s+(?:me\s+)?(?:an?\s+)?overview/i,
    /describe\s+(?:the\s+)?(?:architecture|design|flow)/i,
    /how\s+does\s+(?:the\s+|this\s+)/i,
    /what\s+is\s+(?:the\s+|this\s+)/i,
  ],
  find_spec: [
    /(?:find|show|get)\s+(?:the\s+)?spec/i,
    /what\s+(?:are|were)\s+the\s+requirements/i,
    /what\s+(?:is|was)\s+the\s+(?:scope|plan)/i,
    /spec(?:ification)?\s+for\s+/i,
    /what\s+(?:did|does)\s+(?:the\s+)?(?:spec|plan)\s+say/i,
  ],
  find_decision: [
    /why\s+(?:did|do)\s+we\s+(?:choose|pick|select|decide)/i,
    /what\s+(?:was|were)\s+the\s+(?:decision|rationale)/i,
    /decision\s+(?:record|log|history)/i,
    /(?:find|show|get)\s+(?:the\s+)?decision/i,
    /what\s+alternatives?\s+(?:were|was)\s+considered/i,
  ],
};

/**
 * P3-12: Negative patterns — when matched, penalize the given intent.
 * E.g., "how to fix" should not score for "understand".
 */
const INTENT_NEGATIVE_PATTERNS: Partial<Record<IntentType, RegExp[]>> = {
  understand: [
    /how\s+to\s+(?:fix|add|create|implement|build|repair|patch)/i,
    /what\s+(?:is\s+)?(?:wrong|broken|failing|the\s+error|the\s+bug)/i,
    /why\s+(?:is\s+it\s+)?(?:broken|failing|crashing|not\s+working)/i,
  ],
};

/** P3-12: Minimum confidence threshold below which "general" style fallback is used */
const MIN_CONFIDENCE_THRESHOLD = 0.08;

const INTENT_WEIGHT_ADJUSTMENTS: Record<IntentType, IntentWeights> = {
  add_feature: { recency: 0.3, importance: 0.4, similarity: 0.3, contextType: 'implementation' },
  fix_bug: { recency: 0.5, importance: 0.2, similarity: 0.3, contextType: 'implementation' },
  refactor: { recency: 0.2, importance: 0.3, similarity: 0.5, contextType: 'implementation' },
  security_audit: { recency: 0.1, importance: 0.5, similarity: 0.4, contextType: 'research' },
  understand: { recency: 0.2, importance: 0.3, similarity: 0.5, contextType: null },
  find_spec: { recency: 0.1, importance: 0.5, similarity: 0.4, contextType: 'decision' },
  find_decision: { recency: 0.1, importance: 0.5, similarity: 0.4, contextType: 'decision' },
};

/* -----------------------------------------------------------
   2. SCORING FUNCTIONS
----------------------------------------------------------------*/

function calculateKeywordScore(query: string, intent: IntentType): { score: number; matches: string[] } {
  const lower = query.toLowerCase();
  const keywords = INTENT_KEYWORDS[intent];
  const matches: string[] = [];
  let score = 0;

  for (const keyword of keywords) {
    if (lower.includes(keyword)) {
      score += 1;
      matches.push(keyword);
    }
  }

  // P3-12: Require at least 2 keyword matches for a meaningful keyword score.
  // A single generic keyword match produces a heavily discounted score.
  if (matches.length === 1) {
    score *= 0.3;
  }

  // Normalize by keyword count
  return {
    score: keywords.length > 0 ? score / keywords.length : 0,
    matches,
  };
}

function calculatePatternScore(query: string, intent: IntentType): number {
  const patterns = INTENT_PATTERNS[intent];
  let matches = 0;

  for (const pattern of patterns) {
    if (pattern.test(query)) {
      matches++;
    }
  }

  return patterns.length > 0 ? matches / patterns.length : 0;
}

/* -----------------------------------------------------------
   3. CLASSIFICATION
----------------------------------------------------------------*/

function classifyIntent(query: string): IntentResult {
  if (!query || typeof query !== 'string') {
    return {
      intent: 'understand',
      confidence: 0,
      scores: { add_feature: 0, fix_bug: 0, refactor: 0, security_audit: 0, understand: 0, find_spec: 0, find_decision: 0 },
      keywords: [],
    };
  }

  const scores: Record<IntentType, number> = {
    add_feature: 0,
    fix_bug: 0,
    refactor: 0,
    security_audit: 0,
    understand: 0,
    find_spec: 0,
    find_decision: 0,
  };

  const allKeywords: string[] = [];

  for (const intent of Object.values(INTENT_TYPES)) {
    const { score: keywordScore, matches } = calculateKeywordScore(query, intent);
    const patternScore = calculatePatternScore(query, intent);

    let combined = (keywordScore * 0.6) + (patternScore * 0.4);

    // P3-12: Apply negative pattern penalties
    const negPatterns = INTENT_NEGATIVE_PATTERNS[intent];
    if (negPatterns) {
      for (const neg of negPatterns) {
        if (neg.test(query)) {
          combined *= 0.3; // Heavy penalty when negative pattern matches
          break;
        }
      }
    }

    scores[intent] = combined;
    allKeywords.push(...matches);
  }

  // Find top intent
  let topIntent: IntentType = 'understand';
  let topScore = 0;

  for (const [intent, score] of Object.entries(scores)) {
    if (score > topScore) {
      topScore = score;
      topIntent = intent as IntentType;
    }
  }

  // P3-12: If top score is below minimum confidence, return "understand" with low confidence
  // This prevents weak single-keyword matches from dominating classification.
  if (topScore < MIN_CONFIDENCE_THRESHOLD) {
    return {
      intent: 'understand',
      confidence: topScore,
      scores,
      keywords: [...new Set(allKeywords)],
    };
  }

  return {
    intent: topIntent,
    confidence: Math.min(1, topScore),
    scores,
    keywords: [...new Set(allKeywords)],
  };
}

/**
 * Detect intent (alias for classifyIntent).
 */
function detectIntent(query: string): IntentResult {
  return classifyIntent(query);
}

/**
 * Get weight adjustments for an intent.
 */
function getIntentWeights(intent: IntentType): IntentWeights {
  return INTENT_WEIGHT_ADJUSTMENTS[intent] || INTENT_WEIGHT_ADJUSTMENTS.understand;
}

/**
 * Apply intent-based weight adjustments to search results.
 */
function applyIntentWeights(
  results: Array<Record<string, unknown>>,
  intent: IntentType
): Array<Record<string, unknown>> {
  const weights = getIntentWeights(intent);

  return results.map(r => ({
    ...r,
    intentAdjustedScore:
      (((r.similarity as number) || 0) / 100) * weights.similarity +
      ((r.importance_weight as number) || 0.5) * weights.importance,
  })).sort((a, b) =>
    ((b.intentAdjustedScore as number) || 0) - ((a.intentAdjustedScore as number) || 0)
  );
}

/**
 * Get search query weights based on detected intent.
 */
function getQueryWeights(query: string): IntentWeights {
  const result = classifyIntent(query);
  return getIntentWeights(result.intent);
}

/**
 * Check if an intent type is valid.
 */
function isValidIntent(intent: string): intent is IntentType {
  return Object.values(INTENT_TYPES).includes(intent as IntentType);
}

/**
 * Get all valid intent types.
 */
function getValidIntents(): IntentType[] {
  return Object.values(INTENT_TYPES);
}

/**
 * Get human-readable description for an intent.
 */
function getIntentDescription(intent: IntentType): string {
  const descriptions: Record<IntentType, string> = {
    add_feature: 'Adding a new feature or capability',
    fix_bug: 'Fixing a bug or error',
    refactor: 'Refactoring or improving existing code',
    security_audit: 'Security audit or vulnerability assessment',
    understand: 'Understanding or exploring the codebase',
    find_spec: 'Finding spec documents, requirements, or plans',
    find_decision: 'Finding decision records or rationale',
  };
  return descriptions[intent] || 'Unknown intent';
}

/* -----------------------------------------------------------
   4. EXPORTS
----------------------------------------------------------------*/

/**
 * C138: Intent-to-MMR-lambda mapping.
 * Controls the trade-off between relevance and diversity for each intent.
 * Lower lambda → more diversity. Higher lambda → more relevance.
 * Per spec: understand→0.5 (diversity), fix_bug→0.85 (relevance).
 */
const INTENT_LAMBDA_MAP: Readonly<Record<string, number>> = {
  understand: 0.5,
  fix_bug: 0.85,
  find_spec: 0.5,
  find_decision: 0.5,
  add_feature: 0.7,
  refactor: 0.6,
  security_audit: 0.75,
} as const;

export {
  INTENT_TYPES,
  INTENT_KEYWORDS,
  INTENT_PATTERNS,
  INTENT_WEIGHT_ADJUSTMENTS,
  INTENT_LAMBDA_MAP,

  // Scoring
  calculateKeywordScore,
  calculatePatternScore,

  // Classification
  classifyIntent,
  detectIntent,
  getIntentWeights,
  applyIntentWeights,
  getQueryWeights,
  isValidIntent,
  getValidIntents,
  getIntentDescription,
};

export type {
  IntentType,
  IntentResult,
  IntentWeights,
};
