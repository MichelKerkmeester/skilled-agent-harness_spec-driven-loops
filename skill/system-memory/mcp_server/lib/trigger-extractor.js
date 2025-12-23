/**
 * Trigger Phrase Extractor
 *
 * Extracts trigger phrases from memory content using TF-IDF + N-gram hybrid algorithm.
 * Implements FR-012 from spec.md for proactive memory surfacing.
 *
 * Algorithm:
 * 1. Preprocessing - Clean markdown, tokenize, filter stop words
 * 2. N-gram extraction - Unigrams, bigrams, trigrams
 * 3. TF-IDF scoring with length bonus (1.0 / 1.5 / 1.8)
 * 4. Deduplication - Remove substrings of higher-scoring phrases
 * 5. Tech filtering - Remove common programming terms
 *
 * Performance target: <100ms for typical content (<10KB)
 *
 * @module lib/trigger-extractor
 * @version 10.0.0
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
  'name', 'index', 'item', 'list', 'node', 'element', 'component'
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
  MIN_PHRASE_COUNT: 5,      // Minimum phrases to extract
  MAX_PHRASE_COUNT: 15,     // Maximum phrases to extract
  MIN_WORD_LENGTH: 3,       // Minimum word length to consider
  MIN_CONTENT_LENGTH: 50,   // Minimum content length to process
  MIN_FREQUENCY: 2,         // Minimum frequency for a phrase to be considered
  LENGTH_BONUS: {
    UNIGRAM: 1.0,
    BIGRAM: 1.5,
    TRIGRAM: 1.8
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
 * Tokenize text into words
 * @param {string} text - Cleaned text
 * @returns {string[]} - Array of lowercase tokens
 */
function tokenize(text) {
  return text
    .toLowerCase()
    // Split on whitespace and common punctuation
    .split(/[\s,;:!?()\[\]{}"'<>]+/)
    // Filter short words and numbers
    .filter(token =>
      token.length >= CONFIG.MIN_WORD_LENGTH &&
      !/^\d+$/.test(token) &&
      !/^[^a-z\u00C0-\u024F\u1E00-\u1EFF]+$/i.test(token)  // Skip tokens with no Latin letters (including accented)
    );
}

/**
 * Filter out stop words from token array
 * @param {string[]} tokens - Array of tokens
 * @returns {string[]} - Filtered tokens
 */
function filterStopWords(tokens) {
  return tokens.filter(token =>
    !STOP_WORDS_ENGLISH.has(token) &&
    !STOP_WORDS_ARTIFACTS.has(token)
  );
}

// ───────────────────────────────────────────────────────────────
// N-GRAM EXTRACTION
// ───────────────────────────────────────────────────────────────

/**
 * Extract n-grams from token array
 * @param {string[]} tokens - Array of tokens
 * @param {number} n - N-gram size (1=unigram, 2=bigram, 3=trigram)
 * @returns {Map<string, number>} - Map of n-gram to frequency count
 */
function extractNgrams(tokens, n) {
  const ngrams = new Map();

  if (tokens.length < n) {
    return ngrams;
  }

  for (let i = 0; i <= tokens.length - n; i++) {
    const ngram = tokens.slice(i, i + n).join(' ');
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
// TF-IDF SCORING
// ───────────────────────────────────────────────────────────────

/**
 * Calculate TF-IDF-like scores with length bonus
 * @param {Array<{phrase: string, count: number}>} ngrams - N-gram frequency data
 * @param {number} lengthBonus - Multiplier for longer phrases
 * @param {number} totalTokens - Total token count for normalization (reserved for future IDF implementation)
 * @returns {Array<{phrase: string, score: number, count: number}>}
 */
function scoreNgrams(ngrams, lengthBonus, totalTokens = 0) {
  // Note: totalTokens reserved for future IDF implementation
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
  // Sort by score descending, then by length descending (prefer longer phrases)
  candidates.sort((a, b) => {
    const scoreDiff = b.score - a.score;
    if (Math.abs(scoreDiff) > 0.1) return scoreDiff;  // If score difference is significant, use score
    return b.phrase.length - a.phrase.length;  // Otherwise prefer longer phrases
  });

  const deduplicated = [];
  for (const candidate of candidates) {
    const phrase = candidate.phrase;
    let isRedundant = false;

    for (const existing of deduplicated) {
      // Check if one contains the other
      const existingContainsCandidate = existing.phrase.includes(phrase);
      const candidateContainsExisting = phrase.includes(existing.phrase);

      if (existingContainsCandidate) {
        // Current phrase is a substring of existing - skip it
        isRedundant = true;
        break;
      }

      if (candidateContainsExisting) {
        // Current phrase contains existing - keep the longer one (current)
        // Don't mark as redundant, but we might want to remove the shorter existing one
        // For now, skip to avoid complexity - the sort order handles most cases
        continue;
      }
    }

    if (!isRedundant) {
      deduplicated.push(candidate);
    }
  }

  return deduplicated;
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
 * Extract trigger phrases from memory content using TF-IDF + N-gram hybrid.
 * Implements FR-012 algorithm from spec.md.
 *
 * @param {string} text - Full memory content (markdown)
 * @returns {string[]} - Array of 5-15 normalized trigger phrases
 *
 * Performance: <100ms for typical content (<10KB) per FR-012b
 */
function extractTriggerPhrases(text) {
  // Validation
  if (!text || typeof text !== 'string' || text.constructor !== String) {
    return [];
  }

  if (text.length < CONFIG.MIN_CONTENT_LENGTH) {
    return [];
  }

  // STEP 1: Preprocessing
  const cleaned = removeMarkdown(text);
  const tokens = tokenize(cleaned);
  const filtered = filterStopWords(tokens);

  if (filtered.length < CONFIG.MIN_WORD_LENGTH) {
    return [];
  }

  // STEP 2: Extract N-grams
  const unigrams = countNgrams(filtered, 1);
  const bigrams = countNgrams(filtered, 2);
  const trigrams = countNgrams(filtered, 3);

  // STEP 3: Score with length bonus
  const totalTokens = filtered.length;
  const scoredUnigrams = scoreNgrams(unigrams, CONFIG.LENGTH_BONUS.UNIGRAM, totalTokens);
  const scoredBigrams = scoreNgrams(bigrams, CONFIG.LENGTH_BONUS.BIGRAM, totalTokens);
  const scoredTrigrams = scoreNgrams(trigrams, CONFIG.LENGTH_BONUS.TRIGRAM, totalTokens);

  // Combine all candidates
  const allCandidates = [
    ...scoredUnigrams,
    ...scoredBigrams,
    ...scoredTrigrams
  ];

  // STEP 4: Deduplicate
  const deduplicated = deduplicateSubstrings(allCandidates);

  // STEP 5: Filter tech stop words and limit
  const techFiltered = filterTechStopWords(deduplicated);

  // Sort by score and take top N
  const topPhrases = techFiltered
    .sort((a, b) => b.score - a.score)
    .slice(0, CONFIG.MAX_PHRASE_COUNT)
    .map(item => item.phrase.toLowerCase().trim());

  // Ensure minimum count if we have candidates
  if (topPhrases.length < CONFIG.MIN_PHRASE_COUNT && techFiltered.length > 0) {
    // If we don't have enough, relax the tech filter
    const relaxed = deduplicated
      .sort((a, b) => b.score - a.score)
      .slice(0, CONFIG.MAX_PHRASE_COUNT)
      .map(item => item.phrase.toLowerCase().trim());
    return relaxed;
  }

  return topPhrases;
}

/**
 * Extract trigger phrases with additional metadata
 * @param {string} text - Full memory content
 * @returns {Object} - { phrases: string[], stats: object }
 */
function extractTriggerPhrasesWithStats(text) {
  const startTime = Date.now();

  const cleaned = removeMarkdown(text || '');
  const tokens = tokenize(cleaned);
  const filtered = filterStopWords(tokens);

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
  // Configuration
  CONFIG,
  STOP_WORDS_ENGLISH,
  STOP_WORDS_TECH,
  STOP_WORDS_ARTIFACTS
};
