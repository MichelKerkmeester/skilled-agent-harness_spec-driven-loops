/**
 * Trigger Phrase Extractor
 *
 * Extracts trigger phrases from memory content using TF-IDF + N-gram hybrid algorithm.
 * Implements FR-012 from spec.md for proactive memory surfacing.
 *
 * Algorithm:
 * 1. Preprocessing - Clean markdown, tokenize, filter stop words
 * 2. N-gram extraction - Unigrams, bigrams, trigrams
 * 3. Problem term extraction - Detect error/issue keywords (highest priority)
 * 4. Technical term extraction - Function names, camelCase, snake_case
 * 5. Decision pattern extraction - "chose X", "selected Y", "implemented Z"
 * 6. TF-IDF scoring with length bonus (1.0 / 1.5 / 1.8) + priority bonuses
 * 7. Deduplication - Remove substrings of higher-scoring phrases
 * 8. Tech filtering - Remove common programming terms
 *
 * Performance target: <100ms for typical content (<10KB)
 *
 * @module lib/trigger-extractor
 * @version 11.0.0
 */

'use strict';

// ───────────────────────────────────────────────────────────────
// STOP WORD LISTS
// ───────────────────────────────────────────────────────────────

/**
 * English stop words - common words with low semantic value
 */
const STOP_WORDS_ENGLISH = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'to', 'of',
  'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through',
  'during', 'before', 'after', 'above', 'below', 'between', 'under',
  'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where',
  'why', 'how', 'all', 'each', 'few', 'more', 'most', 'other', 'some',
  'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too',
  'very', 'just', 'also', 'now', 'this', 'that', 'these', 'those', 'what',
  'which', 'who', 'whom', 'whose', 'i', 'you', 'he', 'she', 'it', 'we',
  'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its',
  'our', 'their', 'and', 'but', 'or', 'if', 'because', 'about', 'any',
  'both', 'over', 'out', 'up', 'down', 'off', 'while', 'until', 'since'
]);

/**
 * Tech stop words - common programming terms with low discriminative value
 * Also includes placeholder terms that indicate poor quality extraction
 */
const STOP_WORDS_TECH = new Set([
  'function', 'variable', 'const', 'let', 'var', 'class', 'method',
  'file', 'folder', 'directory', 'code', 'line', 'object', 'array',
  'string', 'number', 'boolean', 'null', 'undefined', 'true', 'false',
  'return', 'import', 'export', 'require', 'module', 'default', 'async',
  'await', 'promise', 'callback', 'parameter', 'argument', 'value',
  'type', 'interface', 'enum', 'struct', 'void', 'static', 'public',
  'private', 'protected', 'extends', 'implements', 'super', 'this',
  'new', 'delete', 'typeof', 'instanceof', 'try', 'catch', 'throw',
  'finally', 'break', 'continue', 'switch', 'case', 'else', 'error',
  'data', 'result', 'response', 'request', 'input', 'output', 'path',
  'name', 'index', 'item', 'list', 'node', 'element', 'component',
  // Placeholder and fallback terms (indicate extraction from poor quality data)
  'placeholder', 'simulation', 'simulated', 'fallback', 'unknown',
  'message', 'user', 'assistant', 'processed', 'initiated', 'conversation'
]);

/**
 * Artifact stop words - content-specific terms from markdown artifacts
 */
const STOP_WORDS_ARTIFACTS = new Set([
  'section', 'chapter', 'example', 'note', 'warning', 'info', 'tip',
  'todo', 'fixme', 'hack', 'bug', 'issue', 'feature', 'update',
  'created', 'modified', 'updated', 'version', 'date', 'author',
  'summary', 'overview', 'description', 'details', 'context',
  'related', 'reference', 'source', 'target', 'link', 'anchor'
]);

// ───────────────────────────────────────────────────────────────
// CONFIGURATION
// ───────────────────────────────────────────────────────────────

const CONFIG = {
  MIN_PHRASE_COUNT: 8,      // Minimum phrases to extract (increased from 5)
  MAX_PHRASE_COUNT: 25,     // Maximum phrases to extract (increased from 15)
  MIN_WORD_LENGTH: 3,       // Minimum word length to consider
  MIN_CONTENT_LENGTH: 50,   // Minimum content length to process
  MIN_FREQUENCY: 1,         // Minimum frequency (reduced from 2 to catch unique terms)
  LENGTH_BONUS: {
    UNIGRAM: 1.0,
    BIGRAM: 1.5,
    TRIGRAM: 1.8,
    QUADGRAM: 2.0           // Added 4-gram support
  },
  // Priority bonuses for different phrase types
  PRIORITY_BONUS: {
    PROBLEM_TERM: 3.0,      // Highest priority - error/issue keywords
    TECHNICAL_TERM: 2.5,    // High priority - function names, technical terms
    DECISION_TERM: 2.0,     // Medium-high - decisions made
    ACTION_TERM: 1.5,       // Medium - action verbs with objects
    COMPOUND_NOUN: 1.3      // Multi-word noun phrases
  }
};

// ───────────────────────────────────────────────────────────────
// PREPROCESSING
// ───────────────────────────────────────────────────────────────

/**
 * Remove markdown formatting from text
 * @param {string} text - Raw markdown text
 * @returns {string} - Cleaned text
 */
function removeMarkdown(text) {
  return text
    // Remove code blocks (fenced)
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`[^`]+`/g, '')
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove headers markers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic/strikethrough
    .replace(/[*_~]+/g, ' ')
    // Remove blockquotes
    .replace(/^>\s*/gm, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, '')
    // Remove HTML tags
    .replace(/<[^>]+>/g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Tokenize text into words, with sentence boundary markers
 * @param {string} text - Cleaned text
 * @returns {string[]} - Array of lowercase tokens (with __BREAK__ markers for sentence boundaries)
 */
function tokenize(text) {
  // First, mark sentence boundaries to prevent N-grams crossing them
  const withBreaks = text
    .replace(/[.!?]+\s+/g, ' __BREAK__ ')
    .replace(/\n+/g, ' __BREAK__ ');

  return withBreaks
    .toLowerCase()
    // Split on whitespace and common punctuation (but keep __BREAK__ markers)
    .split(/[\s,;:()\[\]{}"'<>]+/)
    // Filter short words and numbers, keep break markers
    .filter(token =>
      token === '__break__' ||
      (token.length >= CONFIG.MIN_WORD_LENGTH &&
       !/^\d+$/.test(token) &&
       !/^[^a-z_]+$/.test(token))
    );
}

/**
 * Filter out stop words from token array (preserves __break__ markers)
 * @param {string[]} tokens - Array of tokens
 * @returns {string[]} - Filtered tokens
 */
function filterStopWords(tokens) {
  return tokens.filter(token =>
    token === '__break__' || // Preserve break markers for N-gram boundary detection
    (!STOP_WORDS_ENGLISH.has(token) &&
     !STOP_WORDS_ARTIFACTS.has(token))
  );
}

// ───────────────────────────────────────────────────────────────
// N-GRAM EXTRACTION
// ───────────────────────────────────────────────────────────────

/**
 * Extract n-grams from token array, respecting sentence boundaries
 * @param {string[]} tokens - Array of tokens (may contain __break__ markers)
 * @param {number} n - N-gram size (1=unigram, 2=bigram, 3=trigram)
 * @returns {Map<string, number>} - Map of n-gram to frequency count
 */
function extractNgrams(tokens, n) {
  const ngrams = new Map();

  if (tokens.length < n) {
    return ngrams;
  }

  for (let i = 0; i <= tokens.length - n; i++) {
    const slice = tokens.slice(i, i + n);

    // Skip N-grams that cross sentence boundaries
    if (slice.some(t => t === '__break__')) {
      continue;
    }

    const ngram = slice.join(' ');
    ngrams.set(ngram, (ngrams.get(ngram) || 0) + 1);
  }

  return ngrams;
}

/**
 * Count all n-grams and return as array of objects
 * @param {string[]} tokens - Array of tokens
 * @param {number} n - N-gram size
 * @returns {Array<{phrase: string, count: number}>} - Sorted by count descending
 */
function countNgrams(tokens, n) {
  const ngrams = extractNgrams(tokens, n);

  return Array.from(ngrams.entries())
    .map(([phrase, count]) => ({ phrase, count }))
    .filter(item => item.count >= CONFIG.MIN_FREQUENCY)
    .sort((a, b) => b.count - a.count);
}

// ───────────────────────────────────────────────────────────────
// PROBLEM TERM EXTRACTION (NEW)
// ───────────────────────────────────────────────────────────────

/**
 * Problem/error indicator words - these signal issues worth remembering
 */
const PROBLEM_INDICATORS = new Set([
  'short', 'missing', 'broken', 'failed', 'error', 'bug', 'issue',
  'wrong', 'incorrect', 'invalid', 'unexpected', 'crash', 'timeout',
  'slow', 'stuck', 'blocked', 'regression', 'corrupt', 'leak',
  'overflow', 'underflow', 'null', 'undefined', 'empty', 'truncated'
]);

/**
 * State/mode keywords that often describe important conditions
 */
const STATE_KEYWORDS = new Set([
  'simulation', 'placeholder', 'fallback', 'mock', 'stub', 'fake',
  'debug', 'verbose', 'silent', 'readonly', 'disabled', 'enabled',
  'pending', 'stale', 'cached', 'expired', 'deprecated', 'legacy'
]);

/**
 * Extract problem terms from text using pattern matching
 * Returns high-value phrases describing issues/problems
 * @param {string} text - Cleaned text content
 * @returns {Array<{phrase: string, score: number, type: string}>}
 */
function extractProblemTerms(text) {
  const results = [];
  const seen = new Set();
  const lowerText = text.toLowerCase();

  // Pattern 1: "[word] [problem_indicator]" or "[problem_indicator] [word]"
  // e.g., "short output", "missing data", "error handling"
  const problemPatterns = [
    // word + problem indicator
    /\b(\w{3,})\s+(short|missing|broken|failed|error|bug|issue|wrong|incorrect|invalid|unexpected|crash|timeout|slow|stuck|blocked|empty|truncated)\b/gi,
    // problem indicator + word
    /\b(short|missing|broken|failed|error|bug|issue|wrong|incorrect|invalid|unexpected|crash|timeout|slow|stuck|blocked|empty|truncated)\s+(\w{3,})\b/gi,
    // "not working" patterns
    /\b(\w{3,})\s+not\s+working\b/gi,
    /\bnot\s+(\w{3,}ing?)\b/gi,
    // "X fails" or "X failed"
    /\b(\w{3,})\s+fail(?:s|ed|ing)?\b/gi
  ];

  for (const pattern of problemPatterns) {
    let match;
    while ((match = pattern.exec(lowerText)) !== null) {
      const phrase = match[0].toLowerCase().trim();
      if (!seen.has(phrase) && phrase.length >= 5) {
        seen.add(phrase);
        results.push({
          phrase,
          score: CONFIG.PRIORITY_BONUS.PROBLEM_TERM,
          type: 'problem'
        });
      }
    }
  }

  // Pattern 2: State/mode compound terms
  // e.g., "simulation mode", "placeholder data", "fallback behavior"
  const statePatterns = [
    /\b(simulation|placeholder|fallback|mock|stub|fake|debug|verbose|silent|readonly|disabled|enabled|pending|stale|cached|expired|deprecated|legacy)\s+(mode|data|value|state|behavior|response|output|result|content)\b/gi,
    /\b(mode|data|value|state|behavior|response|output|result|content)\s+(simulation|placeholder|fallback|mock|stub|fake|debug|verbose|silent|readonly|disabled|enabled|pending|stale|cached|expired|deprecated|legacy)\b/gi
  ];

  for (const pattern of statePatterns) {
    let match;
    while ((match = pattern.exec(lowerText)) !== null) {
      const phrase = match[0].toLowerCase().trim();
      if (!seen.has(phrase) && phrase.length >= 5) {
        seen.add(phrase);
        results.push({
          phrase,
          score: CONFIG.PRIORITY_BONUS.PROBLEM_TERM * 0.9, // Slightly lower than direct problems
          type: 'state'
        });
      }
    }
  }

  return results;
}

// ───────────────────────────────────────────────────────────────
// TECHNICAL TERM EXTRACTION (NEW)
// ───────────────────────────────────────────────────────────────

/**
 * Extract technical terms: function names, camelCase, snake_case, file paths
 * @param {string} text - Original text (before markdown removal for code blocks)
 * @returns {Array<{phrase: string, score: number, type: string}>}
 */
function extractTechnicalTerms(text) {
  const results = [];
  const seen = new Set();

  // Pattern 1: camelCase and PascalCase identifiers
  // e.g., "generateContext", "TriggerExtractor", "handleError"
  const camelCasePattern = /\b([a-z][a-zA-Z0-9]*[A-Z][a-zA-Z0-9]*)\b/g;
  let match;
  while ((match = camelCasePattern.exec(text)) !== null) {
    const term = match[1];
    // Convert to space-separated for better matching: generateContext -> "generate context"
    const spacedTerm = term.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
    if (!seen.has(spacedTerm) && spacedTerm.length >= 5) {
      seen.add(spacedTerm);
      results.push({
        phrase: spacedTerm,
        score: CONFIG.PRIORITY_BONUS.TECHNICAL_TERM,
        type: 'technical'
      });
      // Also add original for exact matching
      if (!seen.has(term.toLowerCase())) {
        seen.add(term.toLowerCase());
        results.push({
          phrase: term.toLowerCase(),
          score: CONFIG.PRIORITY_BONUS.TECHNICAL_TERM * 0.8,
          type: 'technical'
        });
      }
    }
  }

  // Pattern 2: snake_case identifiers
  // e.g., "trigger_extractor", "memory_search"
  const snakeCasePattern = /\b([a-z][a-z0-9]*(?:_[a-z0-9]+)+)\b/gi;
  while ((match = snakeCasePattern.exec(text)) !== null) {
    const term = match[1].toLowerCase();
    // Convert to space-separated: trigger_extractor -> "trigger extractor"
    const spacedTerm = term.replace(/_/g, ' ');
    if (!seen.has(spacedTerm) && spacedTerm.length >= 5) {
      seen.add(spacedTerm);
      results.push({
        phrase: spacedTerm,
        score: CONFIG.PRIORITY_BONUS.TECHNICAL_TERM,
        type: 'technical'
      });
    }
  }

  // Pattern 3: Function calls - functionName()
  const functionPattern = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
  while ((match = functionPattern.exec(text)) !== null) {
    const funcName = match[1].toLowerCase();
    if (!seen.has(funcName) && funcName.length >= 4 && !STOP_WORDS_TECH.has(funcName)) {
      seen.add(funcName);
      results.push({
        phrase: funcName,
        score: CONFIG.PRIORITY_BONUS.TECHNICAL_TERM * 0.9,
        type: 'function'
      });
    }
  }

  // Pattern 4: File paths and script names
  // e.g., "generate-context.js", "trigger-extractor"
  const filePattern = /\b([a-z][a-z0-9]*(?:-[a-z0-9]+)+)(?:\.[a-z]+)?\b/gi;
  while ((match = filePattern.exec(text)) !== null) {
    const fileName = match[1].toLowerCase();
    // Convert hyphens to spaces for matching
    const spacedName = fileName.replace(/-/g, ' ');
    if (!seen.has(spacedName) && spacedName.length >= 5) {
      seen.add(spacedName);
      results.push({
        phrase: spacedName,
        score: CONFIG.PRIORITY_BONUS.TECHNICAL_TERM * 0.85,
        type: 'filename'
      });
    }
  }

  return results;
}

// ───────────────────────────────────────────────────────────────
// DECISION PATTERN EXTRACTION (NEW)
// ───────────────────────────────────────────────────────────────

/**
 * Extract decision patterns: "chose X", "selected Y", "implemented Z"
 * These capture important choices made during sessions
 * @param {string} text - Cleaned text content
 * @returns {Array<{phrase: string, score: number, type: string}>}
 */
function extractDecisionTerms(text) {
  const results = [];
  const seen = new Set();
  const lowerText = text.toLowerCase();

  // Decision verb patterns
  const decisionPatterns = [
    // "chose/selected/picked X" patterns
    /\b(?:chose|selected|picked|decided\s+on|opted\s+for|went\s+with)\s+([a-z][a-z0-9\s]{2,25}?)(?:\s+(?:for|because|since|as|over|instead)|[.,;]|$)/gi,
    // "implemented/created/built X" patterns
    /\b(?:implemented|created|built|developed|added|introduced)\s+(?:a\s+|an\s+|the\s+)?([a-z][a-z0-9\s]{2,25}?)(?:\s+(?:for|to|that|which)|[.,;]|$)/gi,
    // "switched to/from X" patterns
    /\b(?:switched|changed|moved|migrated)\s+(?:to|from)\s+([a-z][a-z0-9\s]{2,20}?)(?:\s+(?:for|because|since)|[.,;]|$)/gi,
    // "using X instead of Y" - capture X
    /\busing\s+([a-z][a-z0-9\s]{2,20}?)\s+instead\s+of/gi,
    // "replaced X with Y" - capture both
    /\breplaced\s+([a-z][a-z0-9\s]{2,20}?)\s+with\s+([a-z][a-z0-9\s]{2,20}?)(?:[.,;]|$)/gi
  ];

  for (const pattern of decisionPatterns) {
    let match;
    while ((match = pattern.exec(lowerText)) !== null) {
      // Extract captured groups (may have 1 or 2)
      for (let i = 1; i < match.length; i++) {
        if (match[i]) {
          const phrase = match[i].trim().replace(/\s+/g, ' ');
          if (!seen.has(phrase) && phrase.length >= 3 && phrase.split(' ').length <= 4) {
            seen.add(phrase);
            results.push({
              phrase,
              score: CONFIG.PRIORITY_BONUS.DECISION_TERM,
              type: 'decision'
            });
          }
        }
      }
    }
  }

  return results;
}

// ───────────────────────────────────────────────────────────────
// COMPOUND NOUN EXTRACTION (NEW)
// ───────────────────────────────────────────────────────────────

/**
 * Extract meaningful compound nouns (2-4 word noun phrases)
 * @param {string} text - Cleaned text content
 * @returns {Array<{phrase: string, score: number, type: string}>}
 */
function extractCompoundNouns(text) {
  const results = [];
  const seen = new Set();
  const lowerText = text.toLowerCase();

  // Common compound patterns in technical content
  const compoundPatterns = [
    // "X system", "X service", "X handler", etc.
    /\b([a-z]{3,})\s+(system|service|handler|manager|controller|processor|extractor|generator|validator|parser|builder|factory|provider|adapter|wrapper|helper|utility|config|configuration|settings|options|parameters)\b/gi,
    // "X extraction", "X processing", etc. (noun + gerund noun)
    /\b([a-z]{3,})\s+(extraction|processing|handling|validation|generation|parsing|building|caching|logging|testing|debugging|monitoring)\b/gi,
    // "memory X", "context X", "trigger X" (common prefixes)
    /\b(memory|context|trigger|session|spec|workflow|semantic|search|index)\s+([a-z]{3,})\b/gi,
    // Three-word compounds
    /\b([a-z]{3,})\s+([a-z]{3,})\s+(system|service|handler|extraction|processing|workflow)\b/gi
  ];

  for (const pattern of compoundPatterns) {
    let match;
    while ((match = pattern.exec(lowerText)) !== null) {
      const phrase = match[0].trim();
      if (!seen.has(phrase) && phrase.length >= 6) {
        // Filter out if all words are stop words
        const words = phrase.split(' ');
        const hasContent = words.some(w =>
          !STOP_WORDS_ENGLISH.has(w) &&
          !STOP_WORDS_ARTIFACTS.has(w)
        );
        if (hasContent) {
          seen.add(phrase);
          results.push({
            phrase,
            score: CONFIG.PRIORITY_BONUS.COMPOUND_NOUN,
            type: 'compound'
          });
        }
      }
    }
  }

  return results;
}

// ───────────────────────────────────────────────────────────────
// ACTION TERM EXTRACTION (NEW)
// ───────────────────────────────────────────────────────────────

/**
 * Extract action verb + object patterns
 * e.g., "fix bug", "add feature", "update config"
 * @param {string} text - Cleaned text content
 * @returns {Array<{phrase: string, score: number, type: string}>}
 */
function extractActionTerms(text) {
  const results = [];
  const seen = new Set();
  const lowerText = text.toLowerCase();

  // Action verbs commonly used in development
  const actionPattern = /\b(fix|add|update|remove|delete|create|implement|refactor|optimize|debug|test|verify|check|validate|configure|setup|install|deploy|migrate|upgrade|downgrade|revert|rollback|merge|split|extract|inject|wrap|unwrap)\s+(?:the\s+|a\s+|an\s+)?([a-z][a-z0-9\s]{2,20}?)(?:\s+(?:for|to|from|in|on|with|by)|[.,;:!?]|$)/gi;

  let match;
  while ((match = actionPattern.exec(lowerText)) !== null) {
    const action = match[1];
    const object = match[2].trim().replace(/\s+/g, ' ');
    const phrase = `${action} ${object}`;

    if (!seen.has(phrase) && object.length >= 3 && phrase.split(' ').length <= 4) {
      // Filter out generic objects
      if (!STOP_WORDS_ARTIFACTS.has(object) && object !== 'it' && object !== 'this') {
        seen.add(phrase);
        results.push({
          phrase,
          score: CONFIG.PRIORITY_BONUS.ACTION_TERM,
          type: 'action'
        });
      }
    }
  }

  return results;
}

// ───────────────────────────────────────────────────────────────
// TF-IDF SCORING
// ───────────────────────────────────────────────────────────────

/**
 * Calculate TF-IDF-like scores with length bonus
 * @param {Array<{phrase: string, count: number}>} ngrams - N-gram frequency data
 * @param {number} lengthBonus - Multiplier for longer phrases
 * @param {number} totalTokens - Total token count for normalization
 * @returns {Array<{phrase: string, score: number, count: number}>}
 */
function scoreNgrams(ngrams, lengthBonus, totalTokens) {
  if (ngrams.length === 0) return [];

  const maxCount = ngrams[0].count; // Already sorted descending

  return ngrams.map(item => {
    // TF: Term frequency normalized by max frequency
    const tf = item.count / maxCount;

    // Length-adjusted score
    // Longer phrases get bonus for being more specific
    const score = tf * lengthBonus;

    return {
      phrase: item.phrase,
      score: score,
      count: item.count
    };
  });
}

// ───────────────────────────────────────────────────────────────
// DEDUPLICATION
// ───────────────────────────────────────────────────────────────

/**
 * Remove phrases that are substrings of higher-scoring phrases
 * @param {Array<{phrase: string, score: number}>} candidates - Scored candidates
 * @returns {Array<{phrase: string, score: number}>} - Deduplicated candidates
 */
function deduplicateSubstrings(candidates) {
  // Sort by score descending
  const sorted = [...candidates].sort((a, b) => b.score - a.score);
  const result = [];
  const seen = new Set();

  for (const candidate of sorted) {
    const phrase = candidate.phrase;

    // Check if this phrase is a substring of any already-selected phrase
    let isSubstring = false;
    for (const existing of result) {
      if (existing.phrase.includes(phrase) || phrase.includes(existing.phrase)) {
        // If current phrase contains existing (and is longer), replace it
        if (phrase.includes(existing.phrase) && phrase.length > existing.phrase.length) {
          // Skip - keep the shorter, higher-scoring one
          isSubstring = true;
          break;
        }
        isSubstring = true;
        break;
      }
    }

    if (!isSubstring && !seen.has(phrase)) {
      result.push(candidate);
      seen.add(phrase);
    }
  }

  return result;
}

/**
 * Filter out phrases composed entirely of tech stop words
 * @param {Array<{phrase: string, score: number}>} candidates - Candidates to filter
 * @returns {Array<{phrase: string, score: number}>} - Filtered candidates
 */
function filterTechStopWords(candidates) {
  return candidates.filter(candidate => {
    const words = candidate.phrase.split(' ');
    // Keep if at least one word is NOT a tech stop word
    return !words.every(word => STOP_WORDS_TECH.has(word));
  });
}

// ───────────────────────────────────────────────────────────────
// MAIN EXTRACTION
// ───────────────────────────────────────────────────────────────

/**
 * Extract trigger phrases from memory content using TF-IDF + N-gram hybrid
 * with enhanced problem term, technical term, and decision pattern extraction.
 * Implements FR-012 algorithm from spec.md.
 *
 * @param {string} text - Full memory content (markdown)
 * @returns {string[]} - Array of 8-25 normalized trigger phrases
 *
 * Performance: <100ms for typical content (<10KB) per FR-012b
 */
function extractTriggerPhrases(text) {
  // Validation
  if (!text || typeof text !== 'string') {
    return [];
  }

  if (text.length < CONFIG.MIN_CONTENT_LENGTH) {
    return [];
  }
  
  // Pre-filter: Check if content is mostly placeholder/simulation data
  // If so, return empty to avoid extracting meaningless triggers
  const lowerText = text.toLowerCase();
  const placeholderIndicators = [
    'simulation mode',
    '[response]',
    'placeholder data',
    'fallback data',
    'no real conversation data',
    'simulated user message',
    'simulated assistant response'
  ];
  
  const placeholderCount = placeholderIndicators.filter(p => lowerText.includes(p)).length;
  if (placeholderCount >= 2) {
    // Content is primarily placeholder/simulation - don't extract triggers
    return [];
  }

  // STEP 1: Preprocessing
  const cleaned = removeMarkdown(text);
  const tokens = tokenize(cleaned);
  const filtered = filterStopWords(tokens);

  if (filtered.length < CONFIG.MIN_WORD_LENGTH) {
    return [];
  }

  // STEP 2: Extract N-grams (traditional approach)
  const unigrams = countNgrams(filtered, 1);
  const bigrams = countNgrams(filtered, 2);
  const trigrams = countNgrams(filtered, 3);
  const quadgrams = countNgrams(filtered, 4); // NEW: 4-grams

  // STEP 3: Score N-grams with length bonus
  const totalTokens = filtered.length;
  const scoredUnigrams = scoreNgrams(unigrams, CONFIG.LENGTH_BONUS.UNIGRAM, totalTokens);
  const scoredBigrams = scoreNgrams(bigrams, CONFIG.LENGTH_BONUS.BIGRAM, totalTokens);
  const scoredTrigrams = scoreNgrams(trigrams, CONFIG.LENGTH_BONUS.TRIGRAM, totalTokens);
  const scoredQuadgrams = scoreNgrams(quadgrams, CONFIG.LENGTH_BONUS.QUADGRAM, totalTokens);

  // STEP 4: NEW - Extract priority terms (problem, technical, decision, action, compound)
  // These run on original/cleaned text to catch patterns N-grams miss
  const problemTerms = extractProblemTerms(cleaned);
  const technicalTerms = extractTechnicalTerms(text); // Use original to catch code
  const decisionTerms = extractDecisionTerms(cleaned);
  const actionTerms = extractActionTerms(cleaned);
  const compoundNouns = extractCompoundNouns(cleaned);

  // STEP 5: Combine all candidates with their scores
  const allCandidates = [
    // Priority extractions first (already have priority bonus in score)
    ...problemTerms,
    ...technicalTerms,
    ...decisionTerms,
    ...actionTerms,
    ...compoundNouns,
    // Then N-gram based extractions
    ...scoredUnigrams,
    ...scoredBigrams,
    ...scoredTrigrams,
    ...scoredQuadgrams
  ];

  // STEP 6: Deduplicate
  const deduplicated = deduplicateSubstrings(allCandidates);

  // STEP 7: Filter tech stop words
  const techFiltered = filterTechStopWords(deduplicated);

  // STEP 8: Final scoring and selection
  // Sort by score and take top N
  const topPhrases = techFiltered
    .sort((a, b) => b.score - a.score)
    .slice(0, CONFIG.MAX_PHRASE_COUNT)
    .map(item => item.phrase.toLowerCase().trim())
    // Final dedup on exact strings
    .filter((phrase, index, arr) => arr.indexOf(phrase) === index);

  // Ensure minimum count if we have candidates
  if (topPhrases.length < CONFIG.MIN_PHRASE_COUNT && deduplicated.length > 0) {
    // If we don't have enough, relax the tech filter
    const relaxed = deduplicated
      .sort((a, b) => b.score - a.score)
      .slice(0, CONFIG.MAX_PHRASE_COUNT)
      .map(item => item.phrase.toLowerCase().trim())
      .filter((phrase, index, arr) => arr.indexOf(phrase) === index);
    return relaxed;
  }

  return topPhrases;
}

/**
 * Extract trigger phrases with additional metadata and breakdown by type
 * @param {string} text - Full memory content
 * @returns {Object} - { phrases: string[], stats: object, breakdown: object }
 */
function extractTriggerPhrasesWithStats(text) {
  const startTime = Date.now();

  const cleaned = removeMarkdown(text || '');
  const tokens = tokenize(cleaned);
  const filtered = filterStopWords(tokens);

  // Get breakdown by extraction type
  const problemTerms = extractProblemTerms(cleaned);
  const technicalTerms = extractTechnicalTerms(text || '');
  const decisionTerms = extractDecisionTerms(cleaned);
  const actionTerms = extractActionTerms(cleaned);
  const compoundNouns = extractCompoundNouns(cleaned);

  const phrases = extractTriggerPhrases(text);
  const elapsed = Date.now() - startTime;

  return {
    phrases,
    stats: {
      inputLength: (text || '').length,
      cleanedLength: cleaned.length,
      tokenCount: tokens.length,
      filteredTokenCount: filtered.length,
      phraseCount: phrases.length,
      extractionTimeMs: elapsed
    },
    breakdown: {
      problemTerms: problemTerms.length,
      technicalTerms: technicalTerms.length,
      decisionTerms: decisionTerms.length,
      actionTerms: actionTerms.length,
      compoundNouns: compoundNouns.length,
      // Sample of each type for debugging
      samples: {
        problem: problemTerms.slice(0, 3).map(t => t.phrase),
        technical: technicalTerms.slice(0, 3).map(t => t.phrase),
        decision: decisionTerms.slice(0, 3).map(t => t.phrase),
        action: actionTerms.slice(0, 3).map(t => t.phrase),
        compound: compoundNouns.slice(0, 3).map(t => t.phrase)
      }
    }
  };
}

// ───────────────────────────────────────────────────────────────
// EXPORTS
// ───────────────────────────────────────────────────────────────

module.exports = {
  extractTriggerPhrases,
  extractTriggerPhrasesWithStats,
  // Expose internals for testing
  removeMarkdown,
  tokenize,
  filterStopWords,
  extractNgrams,
  countNgrams,
  scoreNgrams,
  deduplicateSubstrings,
  filterTechStopWords,
  // NEW: Priority extractors
  extractProblemTerms,
  extractTechnicalTerms,
  extractDecisionTerms,
  extractActionTerms,
  extractCompoundNouns,
  // Configuration
  CONFIG,
  STOP_WORDS_ENGLISH,
  STOP_WORDS_TECH,
  STOP_WORDS_ARTIFACTS,
  // NEW: Priority indicators
  PROBLEM_INDICATORS,
  STATE_KEYWORDS
};
