// ───────────────────────────────────────────────────────────────
// MODULE: Lexical Normalizer
// ───────────────────────────────────────────────────────────────

interface NormalizedLexicalQueryTokens {
  fts: string;
  bm25: string[];
  synonyms: string[];
}

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'it', 'as', 'was', 'are', 'be',
  'has', 'had', 'have', 'been', 'were', 'will', 'would', 'could', 'should',
  'may', 'might', 'can', 'this', 'that', 'these', 'those', 'not', 'no',
  'do', 'does', 'did', 'so', 'if', 'then', 'than', 'too', 'very',
]);

const LEXICAL_QUERY_SYNONYMS: Record<string, string[]> = {
  ephemeral: ['temporary', 'short-term', 'transient'],
  temporary: ['ephemeral', 'short-term', 'transient'],
  transient: ['ephemeral', 'temporary', 'short-term'],
  short: ['ephemeral', 'temporary'],
  term: ['ephemeral', 'temporary'],
  constitutional: ['always-surface', 'pinned', 'critical'],
  always: ['constitutional', 'pinned', 'critical'],
  surface: ['constitutional', 'pinned', 'critical'],
  pinned: ['constitutional', 'always-surface'],
  critical: ['constitutional', 'always-surface'],
  tier: ['importance', 'priority'],
  importance: ['tier', 'priority'],
  priority: ['tier', 'importance'],
  memory: ['context', 'knowledge'],
  memories: ['memory', 'context', 'knowledge'],
  retrieval: ['search', 'query'],
  search: ['retrieval', 'query'],
  query: ['search', 'retrieval'],
};

function simpleStem(word: string): string {
  let stem = word.toLowerCase();
  let suffixRemoved = false;

  if (stem.endsWith('ing') && stem.length > 5) { stem = stem.slice(0, -3); suffixRemoved = true; }
  else if (stem.endsWith('tion') && stem.length > 6) { stem = stem.slice(0, -4); suffixRemoved = true; }
  else if (stem.endsWith('ed') && stem.length > 4) { stem = stem.slice(0, -2); suffixRemoved = true; }
  else if (stem.endsWith('ly') && stem.length > 4) { stem = stem.slice(0, -2); suffixRemoved = true; }
  else if (stem.endsWith('es') && stem.length > 4) { stem = stem.slice(0, -2); suffixRemoved = true; }
  else if (stem.endsWith('s') && stem.length > 3) { stem = stem.slice(0, -1); suffixRemoved = true; }

  if (suffixRemoved && stem.length >= 3) {
    const last = stem[stem.length - 1];
    if (last === stem[stem.length - 2] && !/[aeiou]/.test(last)) {
      stem = stem.slice(0, -1);
    }
  }

  return stem;
}

function splitLexicalFragments(text: string): string[] {
  if (!text || typeof text !== 'string') return [];

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, ' ')
    .split(/\s+/)
    .map(t => t.trim())
    .filter(Boolean);
}

function tokenize(text: string): string[] {
  return splitLexicalFragments(text)
    .filter(t => t.length >= 2 && !STOP_WORDS.has(t))
    .map(simpleStem);
}

function sanitizeQueryTokens(query: string): string[] {
  if (query.length > 2000) {
    query = query.substring(0, 2000);
  }

  let sanitized = query
    .replace(/\bNEAR\b/gi, '')
    .replace(/\bNOT\b/gi, '')
    .replace(/\bAND\b/gi, '')
    .replace(/\bOR\b/gi, '');

  sanitized = sanitized.replace(/\/\d+/g, ' ');
  sanitized = sanitized
    .replace(/[*^(){}[\]"]/g, '')
    .replace(/:/g, ' ')
    .trim();

  return sanitized
    .split(/\s+/)
    .filter(Boolean);
}

function quoteFtsToken(token: string): string {
  return (token.startsWith('"') && token.endsWith('"')) ? token : `"${token}"`;
}

function normalizeLexicalQueryTokens(query: string): NormalizedLexicalQueryTokens {
  const sharedTokens = sanitizeQueryTokens(query)
    .flatMap((token) => splitLexicalFragments(token));
  const synonyms = Array.from(new Set(
    sharedTokens.flatMap((token) => LEXICAL_QUERY_SYNONYMS[token] ?? [])
  ));
  const expandedTokens = Array.from(new Set([
    ...sharedTokens,
    ...synonyms,
  ]));
  const phraseToken = sharedTokens.length >= 2
    ? [`"${sharedTokens.join(' ')}"`]
    : [];
  const ftsTokens = [...expandedTokens, ...phraseToken];

  return {
    fts: ftsTokens.map(quoteFtsToken).join(' OR '),
    bm25: expandedTokens
      .filter((token) => token.length >= 2 && !STOP_WORDS.has(token))
      .map(simpleStem),
    synonyms,
  };
}

function sanitizeFTS5Query(query: string): string {
  return sanitizeQueryTokens(query)
    .map(t => `"${t}"`)
    .join(' ');
}

/**
 * Tolerant FTS5 MATCH string for verbose natural-language queries.
 *
 * The strict variant above joins quoted tokens with spaces, which FTS5
 * treats as implicit AND — one absent token zeroes the whole result set.
 * This variant drops stop words and ORs the remaining quoted tokens so a
 * verbose query still matches rows containing any informative token. When
 * every token is a stop word, the full token set is used instead.
 */
function sanitizeFTS5QueryOr(query: string): string {
  const tokens = sanitizeQueryTokens(query);
  if (tokens.length === 0) return '';

  const informative = tokens.filter((token) => !STOP_WORDS.has(token.toLowerCase()));
  const kept = informative.length > 0 ? informative : tokens;

  return Array.from(new Set(kept.map((token) => `"${token}"`))).join(' OR ');
}

export {
  LEXICAL_QUERY_SYNONYMS,
  STOP_WORDS,
  normalizeLexicalQueryTokens,
  sanitizeFTS5Query,
  sanitizeFTS5QueryOr,
  sanitizeQueryTokens,
  simpleStem,
  splitLexicalFragments,
  tokenize,
};

export type {
  NormalizedLexicalQueryTokens,
};
