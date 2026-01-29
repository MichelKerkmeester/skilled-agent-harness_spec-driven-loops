// ───────────────────────────────────────────────────────────────
// SHARED: TRIGGER PHRASE EXTRACTOR
// ───────────────────────────────────────────────────────────────
'use strict';

/* ───────────────────────────────────────────────────────────────
   1. STOP WORD LISTS
   ─────────────────────────────────────────────────────────────── */

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
  'both', 'over', 'out', 'up', 'down', 'off', 'while', 'until', 'since',
]);

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
  'placeholder', 'simulation', 'simulated', 'fallback', 'unknown',
  'message', 'user', 'assistant', 'processed', 'initiated', 'conversation',
]);

const STOP_WORDS_ARTIFACTS = new Set([
  'section', 'chapter', 'example', 'note', 'warning', 'info', 'tip',
  'todo', 'fixme', 'hack', 'bug', 'issue', 'feature', 'update',
  'created', 'modified', 'updated', 'version', 'date', 'author',
  'summary', 'overview', 'description', 'details', 'context',
  'related', 'reference', 'source', 'target', 'link', 'anchor',
]);

/* ───────────────────────────────────────────────────────────────
   2. CONFIGURATION
   ─────────────────────────────────────────────────────────────── */

const CONFIG = {
  MIN_PHRASE_COUNT: 8,
  MAX_PHRASE_COUNT: 25,
  MIN_WORD_LENGTH: 3,
  MIN_CONTENT_LENGTH: 50,
  MIN_FREQUENCY: 1,
  LENGTH_BONUS: {
    UNIGRAM: 1.0,
    BIGRAM: 1.5,
    TRIGRAM: 1.8,
    QUADGRAM: 2.0,
  },
  PRIORITY_BONUS: {
    PROBLEM_TERM: 3.0,
    TECHNICAL_TERM: 2.5,
    DECISION_TERM: 2.0,
    ACTION_TERM: 1.5,
    COMPOUND_NOUN: 1.3,
  },
};

/* ───────────────────────────────────────────────────────────────
   3. PREPROCESSING
   ─────────────────────────────────────────────────────────────── */

/** Remove markdown formatting from text */
function remove_markdown(text) {
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~]+/g, ' ')
    .replace(/^>\s*/gm, '')
    .replace(/^[-*_]{3,}\s*$/gm, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Tokenize text into words with sentence boundary markers */
function tokenize(text) {
  const with_breaks = text
    .replace(/[.!?]+\s+/g, ' __BREAK__ ')
    .replace(/\n+/g, ' __BREAK__ ');

  return with_breaks
    .toLowerCase()
    .split(/[\s,;:()\[\]{}"'<>]+/)
    .filter(token =>
      token === '__break__' ||
      (token.length >= CONFIG.MIN_WORD_LENGTH &&
       !/^\d+$/.test(token) &&
       !/^[^a-z_]+$/.test(token))
    );
}

/** Filter out stop words (preserves __break__ markers) */
function filter_stop_words(tokens) {
  return tokens.filter(token =>
    token === '__break__' ||
    (!STOP_WORDS_ENGLISH.has(token) &&
     !STOP_WORDS_ARTIFACTS.has(token))
  );
}

/* ───────────────────────────────────────────────────────────────
   4. N-GRAM EXTRACTION
   ─────────────────────────────────────────────────────────────── */

/** Extract n-grams respecting sentence boundaries */
function extract_ngrams(tokens, n) {
  const ngrams = new Map();

  if (tokens.length < n) {
    return ngrams;
  }

  for (let i = 0; i <= tokens.length - n; i++) {
    const slice = tokens.slice(i, i + n);
    if (slice.some(t => t === '__break__')) {
      continue;
    }
    const ngram = slice.join(' ');
    ngrams.set(ngram, (ngrams.get(ngram) || 0) + 1);
  }

  return ngrams;
}

/** Count n-grams and return sorted by frequency */
function count_ngrams(tokens, n) {
  const ngrams = extract_ngrams(tokens, n);

  return Array.from(ngrams.entries())
    .map(([phrase, count]) => ({ phrase, count }))
    .filter(item => item.count >= CONFIG.MIN_FREQUENCY)
    .sort((a, b) => b.count - a.count);
}

/* ───────────────────────────────────────────────────────────────
   5. PROBLEM TERM EXTRACTION
   ─────────────────────────────────────────────────────────────── */

const PROBLEM_INDICATORS = new Set([
  'short', 'missing', 'broken', 'failed', 'error', 'bug', 'issue',
  'wrong', 'incorrect', 'invalid', 'unexpected', 'crash', 'timeout',
  'slow', 'stuck', 'blocked', 'regression', 'corrupt', 'leak',
  'overflow', 'underflow', 'null', 'undefined', 'empty', 'truncated',
]);

const STATE_KEYWORDS = new Set([
  'simulation', 'placeholder', 'fallback', 'mock', 'stub', 'fake',
  'debug', 'verbose', 'silent', 'readonly', 'disabled', 'enabled',
  'pending', 'stale', 'cached', 'expired', 'deprecated', 'legacy',
]);

/** Extract problem terms using pattern matching */
function extract_problem_terms(text) {
  const results = [];
  const seen = new Set();
  const lower_text = text.toLowerCase();

  const problem_patterns = [
    /\b(\w{3,})\s+(short|missing|broken|failed|error|bug|issue|wrong|incorrect|invalid|unexpected|crash|timeout|slow|stuck|blocked|empty|truncated)\b/gi,
    /\b(short|missing|broken|failed|error|bug|issue|wrong|incorrect|invalid|unexpected|crash|timeout|slow|stuck|blocked|empty|truncated)\s+(\w{3,})\b/gi,
    /\b(\w{3,})\s+not\s+working\b/gi,
    /\bnot\s+(\w{3,}ing?)\b/gi,
    /\b(\w{3,})\s+fail(?:s|ed|ing)?\b/gi,
  ];

  for (const pattern of problem_patterns) {
    let match;
    while ((match = pattern.exec(lower_text)) !== null) {
      const phrase = match[0].toLowerCase().trim();
      if (!seen.has(phrase) && phrase.length >= 5) {
        seen.add(phrase);
        results.push({
          phrase,
          score: CONFIG.PRIORITY_BONUS.PROBLEM_TERM,
          type: 'problem',
        });
      }
    }
  }

  const state_patterns = [
    /\b(simulation|placeholder|fallback|mock|stub|fake|debug|verbose|silent|readonly|disabled|enabled|pending|stale|cached|expired|deprecated|legacy)\s+(mode|data|value|state|behavior|response|output|result|content)\b/gi,
    /\b(mode|data|value|state|behavior|response|output|result|content)\s+(simulation|placeholder|fallback|mock|stub|fake|debug|verbose|silent|readonly|disabled|enabled|pending|stale|cached|expired|deprecated|legacy)\b/gi,
  ];

  for (const pattern of state_patterns) {
    let match;
    while ((match = pattern.exec(lower_text)) !== null) {
      const phrase = match[0].toLowerCase().trim();
      if (!seen.has(phrase) && phrase.length >= 5) {
        seen.add(phrase);
        results.push({
          phrase,
          score: CONFIG.PRIORITY_BONUS.PROBLEM_TERM * 0.9,
          type: 'state',
        });
      }
    }
  }

  return results;
}

/* ───────────────────────────────────────────────────────────────
   6. TECHNICAL TERM EXTRACTION
   ─────────────────────────────────────────────────────────────── */

/** Extract technical terms: function names, camelCase, snake_case, file paths */
function extract_technical_terms(text) {
  const results = [];
  const seen = new Set();

  // camelCase and PascalCase
  const camel_case_pattern = /\b([a-z][a-zA-Z0-9]*[A-Z][a-zA-Z0-9]*)\b/g;
  let match;
  while ((match = camel_case_pattern.exec(text)) !== null) {
    const term = match[1];
    const spaced_term = term.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
    if (!seen.has(spaced_term) && spaced_term.length >= 5) {
      seen.add(spaced_term);
      results.push({
        phrase: spaced_term,
        score: CONFIG.PRIORITY_BONUS.TECHNICAL_TERM,
        type: 'technical',
      });
      if (!seen.has(term.toLowerCase())) {
        seen.add(term.toLowerCase());
        results.push({
          phrase: term.toLowerCase(),
          score: CONFIG.PRIORITY_BONUS.TECHNICAL_TERM * 0.8,
          type: 'technical',
        });
      }
    }
  }

  // snake_case
  const snake_case_pattern = /\b([a-z][a-z0-9]*(?:_[a-z0-9]+)+)\b/gi;
  while ((match = snake_case_pattern.exec(text)) !== null) {
    const term = match[1].toLowerCase();
    const spaced_term = term.replace(/_/g, ' ');
    if (!seen.has(spaced_term) && spaced_term.length >= 5) {
      seen.add(spaced_term);
      results.push({
        phrase: spaced_term,
        score: CONFIG.PRIORITY_BONUS.TECHNICAL_TERM,
        type: 'technical',
      });
    }
  }

  // Function calls
  const function_pattern = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
  while ((match = function_pattern.exec(text)) !== null) {
    const func_name = match[1].toLowerCase();
    if (!seen.has(func_name) && func_name.length >= 4 && !STOP_WORDS_TECH.has(func_name)) {
      seen.add(func_name);
      results.push({
        phrase: func_name,
        score: CONFIG.PRIORITY_BONUS.TECHNICAL_TERM * 0.9,
        type: 'function',
      });
    }
  }

  // File paths with hyphens
  const file_pattern = /\b([a-z][a-z0-9]*(?:-[a-z0-9]+)+)(?:\.[a-z]+)?\b/gi;
  while ((match = file_pattern.exec(text)) !== null) {
    const file_name = match[1].toLowerCase();
    const spaced_name = file_name.replace(/-/g, ' ');
    if (!seen.has(spaced_name) && spaced_name.length >= 5) {
      seen.add(spaced_name);
      results.push({
        phrase: spaced_name,
        score: CONFIG.PRIORITY_BONUS.TECHNICAL_TERM * 0.85,
        type: 'filename',
      });
    }
  }

  return results;
}

/* ───────────────────────────────────────────────────────────────
   7. DECISION PATTERN EXTRACTION
   ─────────────────────────────────────────────────────────────── */

/** Extract decision patterns: "chose X", "selected Y", "implemented Z" */
function extract_decision_terms(text) {
  const results = [];
  const seen = new Set();
  const lower_text = text.toLowerCase();

  // BUG-010 FIX: Replaced lazy quantifiers {n,m}? with bounded greedy to prevent ReDoS
  // Original: [a-z0-9\s]{2,25}? causes catastrophic backtracking
  // Fixed: [a-z0-9][a-z0-9 ]{0,24} - greedy with explicit space, bounded
  const decision_patterns = [
    /\b(?:chose|selected|picked|decided\s+on|opted\s+for|went\s+with)\s+([a-z][a-z0-9 ]{1,24})(?:\s+(?:for|because|since|as|over|instead)|[.,;]|$)/gi,
    /\b(?:implemented|created|built|developed|added|introduced)\s+(?:a\s+|an\s+|the\s+)?([a-z][a-z0-9 ]{1,24})(?:\s+(?:for|to|that|which)|[.,;]|$)/gi,
    /\b(?:switched|changed|moved|migrated)\s+(?:to|from)\s+([a-z][a-z0-9 ]{1,19})(?:\s+(?:for|because|since)|[.,;]|$)/gi,
    /\busing\s+([a-z][a-z0-9 ]{1,19})\s+instead\s+of/gi,
    /\breplaced\s+([a-z][a-z0-9 ]{1,19})\s+with\s+([a-z][a-z0-9 ]{1,19})(?:[.,;]|$)/gi,
  ];

  for (const pattern of decision_patterns) {
    let match;
    while ((match = pattern.exec(lower_text)) !== null) {
      for (let i = 1; i < match.length; i++) {
        if (match[i]) {
          const phrase = match[i].trim().replace(/\s+/g, ' ');
          if (!seen.has(phrase) && phrase.length >= 3 && phrase.split(' ').length <= 4) {
            seen.add(phrase);
            results.push({
              phrase,
              score: CONFIG.PRIORITY_BONUS.DECISION_TERM,
              type: 'decision',
            });
          }
        }
      }
    }
  }

  return results;
}

/* ───────────────────────────────────────────────────────────────
   8. COMPOUND NOUN EXTRACTION
   ─────────────────────────────────────────────────────────────── */

/** Extract meaningful compound nouns (2-4 word noun phrases) */
function extract_compound_nouns(text) {
  const results = [];
  const seen = new Set();
  const lower_text = text.toLowerCase();

  const compound_patterns = [
    /\b([a-z]{3,})\s+(system|service|handler|manager|controller|processor|extractor|generator|validator|parser|builder|factory|provider|adapter|wrapper|helper|utility|config|configuration|settings|options|parameters)\b/gi,
    /\b([a-z]{3,})\s+(extraction|processing|handling|validation|generation|parsing|building|caching|logging|testing|debugging|monitoring)\b/gi,
    /\b(memory|context|trigger|session|spec|workflow|semantic|search|index)\s+([a-z]{3,})\b/gi,
    /\b([a-z]{3,})\s+([a-z]{3,})\s+(system|service|handler|extraction|processing|workflow)\b/gi,
  ];

  for (const pattern of compound_patterns) {
    let match;
    while ((match = pattern.exec(lower_text)) !== null) {
      const phrase = match[0].trim();
      if (!seen.has(phrase) && phrase.length >= 6) {
        const words = phrase.split(' ');
        const has_content = words.some(w =>
          !STOP_WORDS_ENGLISH.has(w) &&
          !STOP_WORDS_ARTIFACTS.has(w)
        );
        if (has_content) {
          seen.add(phrase);
          results.push({
            phrase,
            score: CONFIG.PRIORITY_BONUS.COMPOUND_NOUN,
            type: 'compound',
          });
        }
      }
    }
  }

  return results;
}

/* ───────────────────────────────────────────────────────────────
   9. ACTION TERM EXTRACTION
   ─────────────────────────────────────────────────────────────── */

/** Extract action verb + object patterns (e.g., "fix bug", "add feature") */
function extract_action_terms(text) {
  const results = [];
  const seen = new Set();
  const lower_text = text.toLowerCase();

  // BUG-010 FIX: Replaced lazy quantifier {2,20}? with bounded greedy to prevent ReDoS
  const action_pattern = /\b(fix|add|update|remove|delete|create|implement|refactor|optimize|debug|test|verify|check|validate|configure|setup|install|deploy|migrate|upgrade|downgrade|revert|rollback|merge|split|extract|inject|wrap|unwrap)\s+(?:the\s+|a\s+|an\s+)?([a-z][a-z0-9 ]{1,19})(?:\s+(?:for|to|from|in|on|with|by)|[.,;:!?]|$)/gi;

  let match;
  while ((match = action_pattern.exec(lower_text)) !== null) {
    const action = match[1];
    const object = match[2].trim().replace(/\s+/g, ' ');
    const phrase = `${action} ${object}`;

    if (!seen.has(phrase) && object.length >= 3 && phrase.split(' ').length <= 4) {
      if (!STOP_WORDS_ARTIFACTS.has(object) && object !== 'it' && object !== 'this') {
        seen.add(phrase);
        results.push({
          phrase,
          score: CONFIG.PRIORITY_BONUS.ACTION_TERM,
          type: 'action',
        });
      }
    }
  }

  return results;
}

/* ───────────────────────────────────────────────────────────────
   10. TF-IDF SCORING
   ─────────────────────────────────────────────────────────────── */

/** Calculate TF-IDF-like scores with length bonus */
function score_ngrams(ngrams, length_bonus, total_tokens) {
  if (ngrams.length === 0) return [];

  const max_count = ngrams[0].count;

  return ngrams.map(item => {
    const tf = item.count / max_count;
    const score = tf * length_bonus;

    return {
      phrase: item.phrase,
      score: score,
      count: item.count,
    };
  });
}

/* ───────────────────────────────────────────────────────────────
   11. DEDUPLICATION
   ─────────────────────────────────────────────────────────────── */

/** Remove phrases that are substrings of higher-scoring phrases */
function deduplicate_substrings(candidates) {
  const sorted = [...candidates].sort((a, b) => b.score - a.score);
  const result = [];
  const seen = new Set();

  for (const candidate of sorted) {
    const phrase = candidate.phrase;

    let is_substring = false;
    for (const existing of result) {
      if (existing.phrase.includes(phrase) || phrase.includes(existing.phrase)) {
        if (phrase.includes(existing.phrase) && phrase.length > existing.phrase.length) {
          is_substring = true;
          break;
        }
        is_substring = true;
        break;
      }
    }

    if (!is_substring && !seen.has(phrase)) {
      result.push(candidate);
      seen.add(phrase);
    }
  }

  return result;
}

/** Filter out phrases composed entirely of tech stop words */
function filter_tech_stop_words(candidates) {
  return candidates.filter(candidate => {
    const words = candidate.phrase.split(' ');
    return !words.every(word => STOP_WORDS_TECH.has(word));
  });
}

/* ───────────────────────────────────────────────────────────────
   12. MAIN EXTRACTION
   ─────────────────────────────────────────────────────────────── */

/**
 * Extract trigger phrases from memory content using TF-IDF + N-gram hybrid
 * with problem, technical, and decision pattern extraction.
 * Implements FR-012. Performance: <100ms for typical content (<10KB).
 */
function extract_trigger_phrases(text) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  if (text.length < CONFIG.MIN_CONTENT_LENGTH) {
    return [];
  }
  
  const lower_text = text.toLowerCase();
  const placeholder_indicators = [
    'simulation mode',
    '[response]',
    'placeholder data',
    'fallback data',
    'no real conversation data',
    'simulated user message',
    'simulated assistant response',
  ];
  
  const placeholder_count = placeholder_indicators.filter(p => lower_text.includes(p)).length;
  if (placeholder_count >= 2) {
    return [];
  }

  const cleaned = remove_markdown(text);
  const tokens = tokenize(cleaned);
  const filtered = filter_stop_words(tokens);

  if (filtered.length < CONFIG.MIN_WORD_LENGTH) {
    return [];
  }

  const unigrams = count_ngrams(filtered, 1);
  const bigrams = count_ngrams(filtered, 2);
  const trigrams = count_ngrams(filtered, 3);
  const quadgrams = count_ngrams(filtered, 4);

  const total_tokens = filtered.length;
  const scored_unigrams = score_ngrams(unigrams, CONFIG.LENGTH_BONUS.UNIGRAM, total_tokens);
  const scored_bigrams = score_ngrams(bigrams, CONFIG.LENGTH_BONUS.BIGRAM, total_tokens);
  const scored_trigrams = score_ngrams(trigrams, CONFIG.LENGTH_BONUS.TRIGRAM, total_tokens);
  const scored_quadgrams = score_ngrams(quadgrams, CONFIG.LENGTH_BONUS.QUADGRAM, total_tokens);

  const problem_terms = extract_problem_terms(cleaned);
  const technical_terms = extract_technical_terms(text);
  const decision_terms = extract_decision_terms(cleaned);
  const action_terms = extract_action_terms(cleaned);
  const compound_nouns = extract_compound_nouns(cleaned);

  const all_candidates = [
    ...problem_terms,
    ...technical_terms,
    ...decision_terms,
    ...action_terms,
    ...compound_nouns,
    ...scored_unigrams,
    ...scored_bigrams,
    ...scored_trigrams,
    ...scored_quadgrams,
  ];

  const deduplicated = deduplicate_substrings(all_candidates);
  const tech_filtered = filter_tech_stop_words(deduplicated);

  const top_phrases = tech_filtered
    .sort((a, b) => b.score - a.score)
    .slice(0, CONFIG.MAX_PHRASE_COUNT)
    .map(item => item.phrase.toLowerCase().trim())
    .filter((phrase, index, arr) => arr.indexOf(phrase) === index);

  if (top_phrases.length < CONFIG.MIN_PHRASE_COUNT && deduplicated.length > 0) {
    const relaxed = deduplicated
      .sort((a, b) => b.score - a.score)
      .slice(0, CONFIG.MAX_PHRASE_COUNT)
      .map(item => item.phrase.toLowerCase().trim())
      .filter((phrase, index, arr) => arr.indexOf(phrase) === index);
    return relaxed;
  }

  return top_phrases;
}

/** Extract trigger phrases with metadata and breakdown by type */
function extract_trigger_phrases_with_stats(text) {
  const start_time = Date.now();

  const cleaned = remove_markdown(text || '');
  const tokens = tokenize(cleaned);
  const filtered = filter_stop_words(tokens);

  const problem_terms = extract_problem_terms(cleaned);
  const technical_terms = extract_technical_terms(text || '');
  const decision_terms = extract_decision_terms(cleaned);
  const action_terms = extract_action_terms(cleaned);
  const compound_nouns = extract_compound_nouns(cleaned);

  const phrases = extract_trigger_phrases(text);
  const elapsed = Date.now() - start_time;

  return {
    phrases,
    stats: {
      input_length: (text || '').length,
      cleaned_length: cleaned.length,
      token_count: tokens.length,
      filtered_token_count: filtered.length,
      phrase_count: phrases.length,
      extraction_time_ms: elapsed,
    },
    breakdown: {
      problem_terms: problem_terms.length,
      technical_terms: technical_terms.length,
      decision_terms: decision_terms.length,
      action_terms: action_terms.length,
      compound_nouns: compound_nouns.length,
      samples: {
        problem: problem_terms.slice(0, 3).map(t => t.phrase),
        technical: technical_terms.slice(0, 3).map(t => t.phrase),
        decision: decision_terms.slice(0, 3).map(t => t.phrase),
        action: action_terms.slice(0, 3).map(t => t.phrase),
        compound: compound_nouns.slice(0, 3).map(t => t.phrase),
      },
    },
  };
}

/* ───────────────────────────────────────────────────────────────
   13. EXPORTS
   ─────────────────────────────────────────────────────────────── */

module.exports = {
  // Snake_case exports (original)
  extract_trigger_phrases,
  extract_trigger_phrases_with_stats,
  remove_markdown,
  tokenize,
  filter_stop_words,
  extract_ngrams,
  count_ngrams,
  score_ngrams,
  deduplicate_substrings,
  filter_tech_stop_words,
  extract_problem_terms,
  extract_technical_terms,
  extract_decision_terms,
  extract_action_terms,
  extract_compound_nouns,
  CONFIG,
  STOP_WORDS_ENGLISH,
  STOP_WORDS_TECH,
  STOP_WORDS_ARTIFACTS,
  PROBLEM_INDICATORS,
  STATE_KEYWORDS,
  // CamelCase aliases (for generate-context.js compatibility)
  extractTriggerPhrases: extract_trigger_phrases,
  extractTriggerPhrasesWithStats: extract_trigger_phrases_with_stats,
  removeMarkdown: remove_markdown,
  filterStopWords: filter_stop_words,
  extractNgrams: extract_ngrams,
  countNgrams: count_ngrams,
  scoreNgrams: score_ngrams,
  deduplicateSubstrings: deduplicate_substrings,
  filterTechStopWords: filter_tech_stop_words,
  extractProblemTerms: extract_problem_terms,
  extractTechnicalTerms: extract_technical_terms,
  extractDecisionTerms: extract_decision_terms,
  extractActionTerms: extract_action_terms,
  extractCompoundNouns: extract_compound_nouns,
};
