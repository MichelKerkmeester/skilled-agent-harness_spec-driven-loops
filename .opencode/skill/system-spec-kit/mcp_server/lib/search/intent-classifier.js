// ───────────────────────────────────────────────────────────────
// SEARCH: INTENT CLASSIFIER (T036-T039)
// Routes queries to task-specific weights based on detected intent
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
────────────────────────────────────────────────────────────────*/

/**
 * T036: 5 Intent Types
 * Each intent represents a distinct task pattern with specific retrieval needs
 */
const INTENT_TYPES = {
  ADD_FEATURE: 'add_feature',
  FIX_BUG: 'fix_bug',
  REFACTOR: 'refactor',
  SECURITY_AUDIT: 'security_audit',
  UNDERSTAND: 'understand',
};

/**
 * T036: Intent descriptions for documentation and debugging
 */
const INTENT_DESCRIPTIONS = {
  [INTENT_TYPES.ADD_FEATURE]: 'Building new functionality - needs patterns, examples, architecture decisions',
  [INTENT_TYPES.FIX_BUG]: 'Debugging issues - needs error history, previous fixes, root cause analysis',
  [INTENT_TYPES.REFACTOR]: 'Restructuring code - needs patterns, architecture, dependency info',
  [INTENT_TYPES.SECURITY_AUDIT]: 'Security review - needs vulnerability history, security patterns, audit records',
  [INTENT_TYPES.UNDERSTAND]: 'Learning/exploring - needs explanations, context, decision rationale',
};

/**
 * T037: Keyword patterns for intent detection
 * Organized by intent type with weighted terms (primary vs secondary)
 */
const INTENT_KEYWORDS = {
  [INTENT_TYPES.ADD_FEATURE]: {
    primary: [
      'add', 'create', 'implement', 'build', 'new feature', 'develop',
      'introduce', 'enable', 'support', 'extend', 'enhance', 'integrate',
      'new api', 'new endpoint', 'new module', 'new component', 'dark mode'
    ],
    secondary: [
      'feature', 'capability', 'functionality', 'module', 'component',
      'api', 'endpoint', 'interface', 'method', 'function', 'registration',
      'authentication', 'payment', 'dashboard', 'flow'
    ],
  },
  [INTENT_TYPES.FIX_BUG]: {
    primary: [
      'fix', 'bug', 'error', 'issue', 'broken', 'crash', 'fail',
      'not working', 'doesn\'t work', 'debug', 'resolve', 'repair',
      'can\'t', 'cannot', 'unable', 'won\'t'
    ],
    secondary: [
      'regression', 'defect', 'problem', 'exception', 'incorrect',
      'unexpected', 'wrong', 'malfunction', 'glitch', 'flaw',
      'login', 'submit', 'anymore', 'stopped'
    ],
  },
  [INTENT_TYPES.REFACTOR]: {
    primary: [
      'refactor', 'restructure', 'reorganize', 'cleanup', 'clean up',
      'improve code', 'optimize', 'simplify', 'modernize', 'migrate',
      'reduce technical debt', 'extract common'
    ],
    secondary: [
      'technical debt', 'code quality', 'architecture', 'pattern',
      'extract', 'rename', 'move', 'consolidate', 'decouple',
      'shared module', 'utility', 'project folder'
    ],
  },
  [INTENT_TYPES.SECURITY_AUDIT]: {
    primary: [
      'security', 'vulnerability', 'exploit', 'attack', 'audit',
      'penetration', 'cve', 'injection', 'xss', 'csrf', 'auth',
      'penetration test', 'security review', 'security check'
    ],
    secondary: [
      'permission', 'access control', 'encryption', 'sanitize',
      'validate', 'threat', 'risk', 'compliance', 'hardening',
      'protection', 'sql injection'
    ],
  },
  [INTENT_TYPES.UNDERSTAND]: {
    primary: [
      'how does', 'what is', 'why', 'explain', 'understand', 'learn',
      'documentation', 'overview', 'context', 'background', 'history',
      'purpose', 'work'
    ],
    secondary: [
      'purpose', 'reason', 'rationale', 'decision', 'design',
      'architecture', 'flow', 'process', 'concept', 'meaning',
      'caching', 'system', 'schema', 'module'
    ],
  },
};

/**
 * T037: Regex patterns for more nuanced intent detection
 */
const INTENT_PATTERNS = {
  [INTENT_TYPES.ADD_FEATURE]: [
    /\badd(?:ing)?\s+(?:a\s+)?(?:new\s+)?(\w+)/i,
    /\bcreate\s+(?:a\s+)?(?:new\s+)?(\w+)/i,
    /\bimplement(?:ing)?\s+(\w+)/i,
    /\bbuild(?:ing)?\s+(?:a\s+)?(?:new\s+)?(\w+)/i,
    /\bnew\s+(?:feature|functionality|capability)/i,
  ],
  [INTENT_TYPES.FIX_BUG]: [
    /\bfix(?:ing)?\s+(?:the\s+)?(\w+)/i,
    /\bbug\s+(?:in|with|fix)/i,
    /\berror\s+(?:in|when|with)/i,
    /\bnot\s+working/i,
    /\bdoesn['']t\s+work/i,
    /\bcrash(?:ing|es)?\b/i,
    /\bfail(?:ing|s|ed)?\b/i,
  ],
  [INTENT_TYPES.REFACTOR]: [
    /\brefactor(?:ing)?\s+(\w+)/i,
    /\bclean(?:ing)?\s*up/i,
    /\brestructur(?:e|ing)\b/i,
    /\bimprove\s+(?:the\s+)?code/i,
    /\btechnical\s+debt/i,
    /\bcode\s+quality/i,
  ],
  [INTENT_TYPES.SECURITY_AUDIT]: [
    /\bsecurity\s+(?:audit|review|check)/i,
    /\bvulnerabilit(?:y|ies)/i,
    /\b(?:cve|cwe)-?\d+/i,
    /\b(?:xss|csrf|sqli|rce)\b/i,
    /\bpenetration\s+test/i,
    /\bauth(?:entication|orization)?\s+(?:issue|problem|bug)/i,
  ],
  [INTENT_TYPES.UNDERSTAND]: [
    /\bhow\s+does\s+(\w+)/i,
    /\bwhat\s+is\s+(?:the\s+)?(\w+)/i,
    /\bwhy\s+(?:does|did|is|was)/i,
    /\bexplain\s+(?:the\s+)?(\w+)/i,
    /\bunderstand(?:ing)?\s+(\w+)/i,
    /\bcontext\s+(?:for|about|on)/i,
  ],
};

/**
 * T038: Intent-specific weight adjustments
 * Modifies composite scoring weights based on detected intent
 *
 * Base weights (from composite-scoring.js):
 *   similarity: 0.30, importance: 0.25, recency: 0.15,
 *   popularity: 0.10, tier_boost: 0.05, retrievability: 0.15
 */
const INTENT_WEIGHT_ADJUSTMENTS = {
  [INTENT_TYPES.ADD_FEATURE]: {
    // Favor patterns and architecture decisions
    similarity: 0.25,
    importance: 0.30,
    recency: 0.10,
    popularity: 0.15,
    tier_boost: 0.05,
    retrievability: 0.15,
  },
  [INTENT_TYPES.FIX_BUG]: {
    // Favor recent fixes and error history
    similarity: 0.35,
    importance: 0.20,
    recency: 0.25,
    popularity: 0.05,
    tier_boost: 0.05,
    retrievability: 0.10,
  },
  [INTENT_TYPES.REFACTOR]: {
    // Favor architecture and dependency info
    similarity: 0.25,
    importance: 0.35,
    recency: 0.10,
    popularity: 0.10,
    tier_boost: 0.10,
    retrievability: 0.10,
  },
  [INTENT_TYPES.SECURITY_AUDIT]: {
    // Favor security-related and high-importance memories
    similarity: 0.30,
    importance: 0.30,
    recency: 0.15,
    popularity: 0.05,
    tier_boost: 0.10,
    retrievability: 0.10,
  },
  [INTENT_TYPES.UNDERSTAND]: {
    // Favor explanations, context, decision rationale
    similarity: 0.35,
    importance: 0.20,
    recency: 0.10,
    popularity: 0.15,
    tier_boost: 0.05,
    retrievability: 0.15,
  },
};

/**
 * Default confidence threshold for intent classification
 * Below this threshold, returns 'understand' as fallback
 */
const DEFAULT_CONFIDENCE_THRESHOLD = 0.25;

/* ─────────────────────────────────────────────────────────────
   2. CLASSIFICATION FUNCTIONS
────────────────────────────────────────────────────────────────*/

/**
 * Calculate keyword match score for a query against an intent
 *
 * @param {string} query - Normalized query string
 * @param {Object} keywords - Intent keywords object with primary/secondary arrays
 * @returns {number} Score between 0 and 1
 */
function calculate_keyword_score(query, keywords) {
  if (!query || !keywords) return 0;

  const query_lower = query.toLowerCase();
  let score = 0;
  let matches = 0;

  // Primary keywords worth 1.0, secondary worth 0.5
  for (const keyword of keywords.primary || []) {
    if (query_lower.includes(keyword.toLowerCase())) {
      score += 1.0;
      matches++;
    }
  }

  for (const keyword of keywords.secondary || []) {
    if (query_lower.includes(keyword.toLowerCase())) {
      score += 0.5;
      matches++;
    }
  }

  const max_score = (keywords.primary?.length || 0) +
                    (keywords.secondary?.length || 0) * 0.5;

  return max_score > 0 ? Math.min(1, score / Math.max(3, max_score * 0.3)) : 0;
}

/**
 * Calculate pattern match score for a query against an intent
 *
 * @param {string} query - Query string
 * @param {RegExp[]} patterns - Array of regex patterns
 * @returns {number} Score between 0 and 1
 */
function calculate_pattern_score(query, patterns) {
  if (!query || !patterns || patterns.length === 0) return 0;

  let matches = 0;
  for (const pattern of patterns) {
    if (pattern.test(query)) {
      matches++;
    }
  }

  return matches > 0 ? Math.min(1, matches * 0.4) : 0;
}

/**
 * T037: Classify query intent using keyword + pattern matching
 *
 * @param {string} query - User query string
 * @param {Object} options - Classification options
 * @param {number} [options.confidenceThreshold] - Minimum confidence for classification
 * @returns {Object} Classification result with intent, confidence, and scores
 */
function classify_intent(query, options = {}) {
  const threshold = options.confidenceThreshold || DEFAULT_CONFIDENCE_THRESHOLD;

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return {
      intent: INTENT_TYPES.UNDERSTAND,
      confidence: 0,
      scores: {},
      fallback: true,
      reason: 'Empty or invalid query',
    };
  }

  const normalized_query = query.trim();
  const scores = {};

  for (const intent of Object.values(INTENT_TYPES)) {
    const keyword_score = calculate_keyword_score(
      normalized_query,
      INTENT_KEYWORDS[intent]
    );
    const pattern_score = calculate_pattern_score(
      normalized_query,
      INTENT_PATTERNS[intent]
    );

    scores[intent] = keyword_score * 0.6 + pattern_score * 0.4;  // 60% keywords, 40% patterns
  }

  let best_intent = INTENT_TYPES.UNDERSTAND;
  let best_score = 0;

  for (const [intent, score] of Object.entries(scores)) {
    if (score > best_score) {
      best_score = score;
      best_intent = intent;
    }
  }

  if (best_score < threshold) {
    return {
      intent: INTENT_TYPES.UNDERSTAND,
      confidence: best_score,
      scores,
      fallback: true,
      reason: `Confidence ${best_score.toFixed(2)} below threshold ${threshold}`,
    };
  }

  return {
    intent: best_intent,
    confidence: best_score,
    scores,
    fallback: false,
    description: INTENT_DESCRIPTIONS[best_intent],
  };
}

/**
 * T037: Quick intent detection for simple classification
 * Returns just the intent type without full scoring breakdown
 *
 * @param {string} query - User query string
 * @returns {string} Intent type from INTENT_TYPES
 */
function detect_intent(query) {
  const result = classify_intent(query);
  return result.intent;
}

/* ─────────────────────────────────────────────────────────────
   3. WEIGHT ADJUSTMENT FUNCTIONS
────────────────────────────────────────────────────────────────*/

/**
 * T038: Get weight adjustments for a specific intent
 *
 * @param {string} intent - Intent type from INTENT_TYPES
 * @returns {Object} Weight adjustments object or null if intent invalid
 */
function get_intent_weights(intent) {
  if (!intent || !INTENT_WEIGHT_ADJUSTMENTS[intent]) {
    return null;
  }
  return { ...INTENT_WEIGHT_ADJUSTMENTS[intent] };
}

/**
 * T038: Apply intent-based weight adjustments to base weights
 *
 * @param {Object} base_weights - Base composite scoring weights
 * @param {string} intent - Intent type to apply
 * @returns {Object} Adjusted weights
 */
function apply_intent_weights(base_weights, intent) {
  const intent_weights = get_intent_weights(intent);

  if (!intent_weights) {
    return base_weights;
  }

  return {
    ...base_weights,
    ...intent_weights,
  };
}

/**
 * T038: Get weight adjustments from a query (combines classification + weights)
 * Convenience function for direct query-to-weights conversion
 *
 * @param {string} query - User query string
 * @param {Object} base_weights - Base composite scoring weights
 * @returns {Object} Result with intent, confidence, and adjusted weights
 */
function get_query_weights(query, base_weights = {}) {
  const classification = classify_intent(query);
  const weights = apply_intent_weights(base_weights, classification.intent);

  return {
    intent: classification.intent,
    confidence: classification.confidence,
    fallback: classification.fallback,
    weights,
  };
}

/* ─────────────────────────────────────────────────────────────
   4. VALIDATION FUNCTIONS
────────────────────────────────────────────────────────────────*/

/**
 * Check if a string is a valid intent type
 *
 * @param {string} intent - String to validate
 * @returns {boolean} True if valid intent type
 */
function is_valid_intent(intent) {
  return Object.values(INTENT_TYPES).includes(intent);
}

/**
 * Get all valid intent types
 *
 * @returns {string[]} Array of valid intent type strings
 */
function get_valid_intents() {
  return Object.values(INTENT_TYPES);
}

/**
 * Get intent description
 *
 * @param {string} intent - Intent type
 * @returns {string|null} Description or null if invalid
 */
function get_intent_description(intent) {
  return INTENT_DESCRIPTIONS[intent] || null;
}

/* ─────────────────────────────────────────────────────────────
   5. MODULE EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  INTENT_TYPES,
  INTENT_DESCRIPTIONS,
  INTENT_KEYWORDS,
  INTENT_PATTERNS,
  INTENT_WEIGHT_ADJUSTMENTS,
  DEFAULT_CONFIDENCE_THRESHOLD,
  classify_intent,
  detect_intent,
  calculate_keyword_score,
  calculate_pattern_score,
  get_intent_weights,
  apply_intent_weights,
  get_query_weights,
  is_valid_intent,
  get_valid_intents,
  get_intent_description,
};
