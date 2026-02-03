// ───────────────────────────────────────────────────────────────
// SEARCH: FUZZY MATCH
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION

   Fuzzy matching for query expansion with typo tolerance.
   REQ-018: Query Expansion - Typo tolerance via Levenshtein (max 2)
   REQ-027: Fuzzy Acronym Matching - ACRONYM_MAP with fuzzy lookup
────────────────────────────────────────────────────────────────*/

const MAX_EDIT_DISTANCE = 2;

const MIN_FUZZY_TERM_LENGTH = 3;

const ENABLE_FUZZY_MATCH = process.env.ENABLE_FUZZY_MATCH !== 'false';

// Stop words excluded from fuzzy acronym matching (e.g., "not" -> "HOT" false positive)
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
  'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
  'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can',
  'need', 'dare', 'ought', 'used', 'it', 'its', 'this', 'that', 'these',
  'those', 'what', 'which', 'who', 'whom', 'whose', 'where', 'when',
  'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most',
  'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
  'so', 'than', 'too', 'very', 'just', 'also', 'now', 'here', 'there',
]);

/* ─────────────────────────────────────────────────────────────
   2. ACRONYM MAP

   Technical acronyms and their expansions for query enhancement.
   Format: { acronym: [expansion, ...aliases] }
────────────────────────────────────────────────────────────────*/

const ACRONYM_MAP = {
  // Search & Retrieval
  'RRF': ['Reciprocal Rank Fusion', 'rank fusion'],
  'BM25': ['Best Matching 25', 'Okapi BM25', 'keyword search'],
  'FTS': ['Full Text Search', 'fulltext'],
  'FTS5': ['Full Text Search 5', 'SQLite FTS5'],
  'TF-IDF': ['Term Frequency Inverse Document Frequency', 'tfidf'],
  'RAG': ['Retrieval Augmented Generation', 'retrieval augmented'],

  // Machine Learning & AI
  'LLM': ['Large Language Model', 'language model'],
  'NLP': ['Natural Language Processing', 'text processing'],
  'ML': ['Machine Learning', 'model training'],
  'AI': ['Artificial Intelligence', 'intelligent system'],
  'GPT': ['Generative Pre-trained Transformer', 'transformer model'],
  'MCP': ['Model Context Protocol', 'context protocol'],
  'FSRS': ['Free Spaced Repetition Scheduler', 'spaced repetition', 'memory decay'],

  // Memory & Context
  'ANCHOR': ['memory anchor', 'context anchor', 'section marker'],
  'HOT': ['hot memory', 'active memory', 'high attention'],
  'WARM': ['warm memory', 'recent memory', 'moderate attention'],
  'COLD': ['cold memory', 'old memory', 'low attention'],
  'TTL': ['Time To Live', 'expiration time', 'cache duration'],

  // Development & Tools
  'API': ['Application Programming Interface', 'web service', 'endpoint'],
  'CLI': ['Command Line Interface', 'terminal', 'command line'],
  'SDK': ['Software Development Kit', 'dev kit'],
  'IDE': ['Integrated Development Environment', 'code editor'],
  'VSC': ['Visual Studio Code', 'VS Code', 'vscode'],
  'JSON': ['JavaScript Object Notation', 'json data'],
  'YAML': ['YAML Ain\'t Markup Language', 'yaml config'],
  'SQL': ['Structured Query Language', 'database query'],
  'DB': ['Database', 'data storage'],
  'ORM': ['Object Relational Mapping', 'database mapper'],

  // Web & Frontend
  'CSS': ['Cascading Style Sheets', 'styles', 'stylesheet'],
  'HTML': ['HyperText Markup Language', 'markup', 'web page'],
  'JS': ['JavaScript', 'ECMAScript'],
  'TS': ['TypeScript', 'typed javascript'],
  'DOM': ['Document Object Model', 'page elements'],
  'CDN': ['Content Delivery Network', 'asset hosting'],
  'URL': ['Uniform Resource Locator', 'web address', 'link'],
  'HTTP': ['HyperText Transfer Protocol', 'web protocol'],
  'HTTPS': ['HTTP Secure', 'secure http'],
  'REST': ['Representational State Transfer', 'rest api'],

  // SpecKit Specific
  'CHK': ['checklist item', 'verification check'],
  'REQ': ['requirement', 'specification requirement'],
  'ADR': ['Architecture Decision Record', 'decision record'],
  'P0': ['Priority Zero', 'blocker', 'critical priority'],
  'P1': ['Priority One', 'high priority', 'required'],
  'P2': ['Priority Two', 'medium priority', 'optional'],
  'LOC': ['Lines of Code', 'code size'],
  'KPI': ['Key Performance Indicator', 'metric', 'success metric'],

  // Error & Status Codes
  'E001': ['embedding failed', 'embedding error'],
  'E040': ['search failed', 'query too long'],
  'E050': ['API key invalid', 'authentication error'],

  // Architecture & Patterns
  'DDD': ['Domain Driven Design', 'domain design'],
  'TDD': ['Test Driven Development', 'test first'],
  'SOLID': ['Single responsibility Open-closed Liskov Interface Dependency', 'design principles'],
  'DRY': ['Don\'t Repeat Yourself', 'avoid duplication'],
  'KISS': ['Keep It Simple Stupid', 'simplicity'],
  'YAGNI': ['You Ain\'t Gonna Need It', 'avoid overengineering'],
};

/* ─────────────────────────────────────────────────────────────
   3. LEVENSHTEIN DISTANCE

   Calculates minimum edit operations (insert, delete, substitute).
   Time: O(m*n), Space: O(min(m,n)) with single-row optimization
────────────────────────────────────────────────────────────────*/

function levenshtein_distance(a, b) {
  if (!a || !b) return (a || b || '').length;
  if (a === b) return 0;

  const str_a = a.toLowerCase();
  const str_b = b.toLowerCase();

  if (str_a.length > str_b.length) {
    return levenshtein_distance(b, a);
  }

  const len_a = str_a.length;
  const len_b = str_b.length;

  // Single-row DP: O(min(m,n)) space optimization
  let prev_row = new Array(len_a + 1);
  let curr_row = new Array(len_a + 1);

  for (let i = 0; i <= len_a; i++) {
    prev_row[i] = i;
  }

  for (let j = 1; j <= len_b; j++) {
    curr_row[0] = j;

    for (let i = 1; i <= len_a; i++) {
      const cost = str_a[i - 1] === str_b[j - 1] ? 0 : 1;

      curr_row[i] = Math.min(
        prev_row[i] + 1,
        curr_row[i - 1] + 1,
        prev_row[i - 1] + cost
      );
    }

    [prev_row, curr_row] = [curr_row, prev_row];
  }

  return prev_row[len_a];
}

function is_fuzzy_match(a, b, max_distance = MAX_EDIT_DISTANCE) {
  const len_diff = Math.abs(a.length - b.length);
  if (len_diff > max_distance) return false;

  return levenshtein_distance(a, b) <= max_distance;
}

/* ─────────────────────────────────────────────────────────────
   4. FUZZY ACRONYM LOOKUP
────────────────────────────────────────────────────────────────*/

function find_fuzzy_acronym(term, max_distance = 1) {
  if (!term || term.length < 2) return [];

  if (STOP_WORDS.has(term.toLowerCase())) return [];

  const upper_term = term.toUpperCase();
  const results = [];

  for (const [acronym, expansions] of Object.entries(ACRONYM_MAP)) {
    // Short acronyms (<=4) require exact length; longer allow +/- 1
    const len_diff = Math.abs(upper_term.length - acronym.length);
    const max_len_diff = acronym.length <= 4 ? 0 : 1;

    if (len_diff > max_len_diff) continue;

    if (is_fuzzy_match(upper_term, acronym, max_distance)) {
      results.push(...expansions);
    }
  }

  return results;
}

function get_acronym_expansion(term) {
  if (!term) return [];
  const upper_term = term.toUpperCase();
  return ACRONYM_MAP[upper_term] || [];
}

/* ─────────────────────────────────────────────────────────────
   5. QUERY EXPANSION
────────────────────────────────────────────────────────────────*/

function expand_query_with_fuzzy(query, options = {}) {
  if (!ENABLE_FUZZY_MATCH || !query || typeof query !== 'string') {
    return {
      original: query || '',
      expanded: query || '',
      expansions: [],
      acronyms_found: [],
      fuzzy_matches: [],
    };
  }

  const {
    includeAcronyms = true,
    includeFuzzy = true,
    maxDistance = MAX_EDIT_DISTANCE,
  } = options;

  const terms = query
    .split(/\s+/)
    .filter(t => t.length >= MIN_FUZZY_TERM_LENGTH);

  const expansions = [];
  const acronyms_found = [];
  const fuzzy_matches = [];

  for (const term of terms) {
    if (includeAcronyms) {
      const exact_expansions = get_acronym_expansion(term);
      if (exact_expansions.length > 0) {
        acronyms_found.push({ term, expansions: exact_expansions });
        expansions.push(...exact_expansions);
        continue;
      }
    }

    if (includeAcronyms && includeFuzzy && term.length >= 3) {
      const fuzzy_acronym_expansions = find_fuzzy_acronym(term, 1);
      if (fuzzy_acronym_expansions.length > 0) {
        fuzzy_matches.push({ term, type: 'acronym', matches: fuzzy_acronym_expansions });
        expansions.push(...fuzzy_acronym_expansions);
      }
    }

    if (includeFuzzy && term.length >= 4) {
      for (const [acronym, values] of Object.entries(ACRONYM_MAP)) {
        for (const value of values) {
          const words = value.toLowerCase().split(/\s+/);
          for (const word of words) {
            if (word.length >= 4 && is_fuzzy_match(term, word, maxDistance)) {
              fuzzy_matches.push({ term, type: 'term', match: value, acronym });
              if (!expansions.includes(acronym)) {
                expansions.push(acronym);
              }
              break;
            }
          }
        }
      }
    }
  }

  const unique_expansions = [...new Set(expansions)];
  const expanded = unique_expansions.length > 0
    ? `${query} ${unique_expansions.join(' ')}`
    : query;

  return {
    original: query,
    expanded,
    expansions: unique_expansions,
    acronyms_found,
    fuzzy_matches,
  };
}

/* ─────────────────────────────────────────────────────────────
   6. COMMON TYPO CORRECTIONS

   Pre-defined corrections for commonly misspelled technical terms.
────────────────────────────────────────────────────────────────*/

const COMMON_TYPOS = {
  'reciporcal': 'reciprocal',
  'recripocal': 'reciprocal',
  'levenstein': 'levenshtein',
  'levinstein': 'levenshtein',
  'javascript': 'JavaScript',
  'javscript': 'JavaScript',
  'javasript': 'JavaScript',
  'typescipt': 'TypeScript',
  'typscript': 'TypeScript',
  'embbeding': 'embedding',
  'embedidng': 'embedding',
  'embeding': 'embedding',
  'retreival': 'retrieval',
  'retieval': 'retrieval',
  'retireval': 'retrieval',
  'seach': 'search',
  'serach': 'search',
  'qeury': 'query',
  'qurey': 'query',
  'databse': 'database',
  'datbase': 'database',
  'memeory': 'memory',
  'memroy': 'memory',
  'fucntion': 'function',
  'funciton': 'function',
  'implemnt': 'implement',
  'implment': 'implement',
  'configration': 'configuration',
  'configuraiton': 'configuration',
  'initalize': 'initialize',
  'intiialize': 'initialize',
  'asyncronous': 'asynchronous',
  'asynchornous': 'asynchronous',
  'promies': 'promise',
  'promse': 'promise',
};

function correct_typo(term) {
  if (!term) return null;
  const lower = term.toLowerCase();
  return COMMON_TYPOS[lower] || null;
}

function correct_query_typos(query) {
  if (!query || typeof query !== 'string') {
    return { original: query || '', corrected: query || '', corrections: [] };
  }

  const terms = query.split(/\s+/);
  const corrections = [];
  const corrected_terms = terms.map(term => {
    const correction = correct_typo(term);
    if (correction) {
      corrections.push({ original: term, corrected: correction });
      return correction;
    }
    return term;
  });

  return {
    original: query,
    corrected: corrected_terms.join(' '),
    corrections,
  };
}

/* ─────────────────────────────────────────────────────────────
   7. EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // Core functions (CHK-137, CHK-139)
  levenshtein_distance,
  is_fuzzy_match,
  expand_query_with_fuzzy,

  // Acronym lookup (CHK-138)
  find_fuzzy_acronym,
  get_acronym_expansion,
  ACRONYM_MAP,

  // Typo correction (CHK-140)
  correct_typo,
  correct_query_typos,
  COMMON_TYPOS,

  // Configuration
  MAX_EDIT_DISTANCE,
  MIN_FUZZY_TERM_LENGTH,
  ENABLE_FUZZY_MATCH,
  STOP_WORDS,

  // Legacy camelCase aliases for backward compatibility
  levenshteinDistance: levenshtein_distance,
  isFuzzyMatch: is_fuzzy_match,
  expandQueryWithFuzzy: expand_query_with_fuzzy,
  findFuzzyAcronym: find_fuzzy_acronym,
  getAcronymExpansion: get_acronym_expansion,
  correctTypo: correct_typo,
  correctQueryTypos: correct_query_typos,
};
