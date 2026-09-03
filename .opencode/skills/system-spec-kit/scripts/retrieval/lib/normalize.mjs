// ───────────────────────────────────────────────────────────────
// MODULE: Trigger Text Normalization
// ───────────────────────────────────────────────────────────────
// Mirrors the substring trigger lane in
// mcp-server/lib/search/hybrid-search.ts (normalizeTriggerText,
// triggerQueryTokens, computeTriggerMatchScore) so the generated index and
// the SQL lane admit and rank the same candidates. Any change here changes
// the relation the two lanes are compared on, so the two must move together.
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────

/** Scoring-side token floor: the phrase/query token filter inside the score function. */
export const MIN_TOKEN_LENGTH = 2;

/** Candidate-gate token floor: the SQL entry point drops shorter tokens before building LIKE terms. */
export const MIN_QUERY_TOKEN_LENGTH = 3;

/** Candidate-gate token cap: the SQL entry point keeps only this many LIKE terms. */
export const MAX_QUERY_TOKENS = 8;

/** Raw phrases longer than this are truncated and reported rather than dropped. */
export const MAX_PHRASE_LENGTH = 120;

/**
 * Serialized contract shipped inside the artifact so a reader can tell what the
 * stored keys mean without re-deriving it from this module.
 */
export const NORMALIZATION = Object.freeze({
  case: 'lower',
  maxPhraseLength: MAX_PHRASE_LENGTH,
  maxQueryTokens: MAX_QUERY_TOKENS,
  minQueryTokenLength: MIN_QUERY_TOKEN_LENGTH,
  separators: 'non-ascii-alnum-to-space',
  stemming: 'none',
  stopWords: [],
});

/** Ordered best-to-worst; index doubles as the tie-break rank. */
export const MATCH_CLASSES = Object.freeze([
  'exact',
  'phrase-containment',
  'query-containment',
  'token-overlap',
  'partial',
]);

// ───────────────────────────────────────────────────────────────
// 2. NORMALIZATION
// ───────────────────────────────────────────────────────────────

/**
 * Lowercase, collapse every run of non-ASCII-alphanumeric characters to one
 * space, collapse whitespace, trim. Lowercasing runs first, so non-ASCII
 * characters survive the case fold only to be replaced by the separator pass.
 *
 * @param {unknown} value Raw phrase or prompt text.
 * @returns {string} Normalized text, or the empty string for non-strings.
 */
export function normalizeTriggerText(value) {
  if (typeof value !== 'string') return '';
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Deduplicated tokens at the scoring floor. Used for phrase tokens and for the
 * coverage denominator, both of which sit below the candidate-gate floor.
 *
 * @param {string} text Raw or normalized text.
 * @returns {string[]} Tokens in first-seen order.
 */
export function triggerTokens(text) {
  return Array.from(new Set(
    normalizeTriggerText(text)
      .split(/\s+/)
      .filter((token) => token.length >= MIN_TOKEN_LENGTH),
  ));
}

/**
 * Candidate-gate tokens: dedupe, drop tokens below the floor, keep the first
 * few. Everything dropped is returned so a caller can show why a prompt
 * matched less than the operator expected.
 *
 * @param {string} query Raw prompt text.
 * @returns {{ tokens: string[], discardedTokens: Array<{ reason: string, token: string }> }}
 */
export function queryTokens(query) {
  const all = Array.from(new Set(
    normalizeTriggerText(query).split(/\s+/).filter(Boolean),
  ));

  const discardedTokens = [];
  const eligible = [];
  for (const token of all) {
    if (token.length < MIN_QUERY_TOKEN_LENGTH) {
      discardedTokens.push({ reason: 'below-min-token-length', token });
      continue;
    }
    eligible.push(token);
  }

  for (const token of eligible.slice(MAX_QUERY_TOKENS)) {
    discardedTokens.push({ reason: 'beyond-max-query-tokens', token });
  }

  return { discardedTokens, tokens: eligible.slice(0, MAX_QUERY_TOKENS) };
}

// ───────────────────────────────────────────────────────────────
// 3. SCORING
// ───────────────────────────────────────────────────────────────

/**
 * Reproduces computeTriggerMatchScore. A phrase carrying fewer than two tokens
 * can only ever match by exact equality, which is why the size guard sits
 * between the equality test and the containment tests.
 *
 * @param {string} normalizedQuery Normalized prompt text.
 * @param {string} normalizedPhrase Normalized phrase text.
 * @returns {{ matchClass: string, score: number } | null} Null when the phrase does not score.
 */
export function scorePhrase(normalizedQuery, normalizedPhrase) {
  if (!normalizedQuery || !normalizedPhrase) return null;
  if (normalizedPhrase === normalizedQuery) return { matchClass: 'exact', score: 1 };

  const phraseTokenSet = new Set(triggerTokens(normalizedPhrase));
  if (phraseTokenSet.size < 2) return null;

  if (normalizedPhrase.includes(normalizedQuery)) {
    return { matchClass: 'phrase-containment', score: 0.94 };
  }
  if (normalizedQuery.includes(normalizedPhrase)) {
    return { matchClass: 'query-containment', score: 0.88 };
  }

  const tokens = triggerTokens(normalizedQuery);
  if (tokens.length === 0) return null;

  const overlap = tokens.filter((token) => phraseTokenSet.has(token)).length;
  const coverage = overlap / tokens.length;
  if (coverage < 0.8) return null;

  return { matchClass: 'token-overlap', score: coverage * 0.75 };
}

/**
 * Rank of a match class for tie-breaking. Unknown classes sort last.
 *
 * @param {string} matchClass One of MATCH_CLASSES.
 * @returns {number} Zero-based rank.
 */
export function matchClassRank(matchClass) {
  const rank = MATCH_CLASSES.indexOf(matchClass);
  return rank === -1 ? MATCH_CLASSES.length : rank;
}

/**
 * Code-unit comparison. Locale-aware collation is deliberately avoided so the
 * emitted artifact is byte-identical on every machine.
 *
 * @param {string} a Left operand.
 * @param {string} b Right operand.
 * @returns {number} Negative, zero, or positive.
 */
export function compareCodeUnits(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}
