// ───────────────────────────────────────────────────────────────────
// MODULE: Trigger Index Freshness
// ───────────────────────────────────────────────────────────────────
// The one definition of a stale trigger-index entry: a document is stale when
// the phrases it declares differ from the phrases the index attributes to its
// path. The save path asks it about one packet and the generator's check mode
// asks it about every document, so the two can never disagree on what stale
// means.
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. ATTRIBUTION
// ───────────────────────────────────────────────────────────────────

/**
 * Per-index inversion from document path to the phrases posted against it.
 * A whole-corpus check compares every document against one index, and
 * rescanning every posting per document would cost the phrase count times the
 * document count, so the inversion is built once per index object.
 *
 * @type {WeakMap<object, Map<string, Set<string>>>}
 */
const phrasesByPathCache = new WeakMap();

/**
 * @param {{ paths: string[], phrases: Record<string, number[]> }} index Parsed trigger index.
 * @returns {Map<string, Set<string>>} Phrases keyed by the document path that owns them.
 */
function phrasesByPath(index) {
  let byPath = phrasesByPathCache.get(index);
  if (byPath) return byPath;

  byPath = new Map();
  for (const [phrase, postings] of Object.entries(index.phrases)) {
    for (const pathId of postings) {
      const owner = index.paths[pathId];
      let owned = byPath.get(owner);
      if (!owned) {
        owned = new Set();
        byPath.set(owner, owned);
      }
      owned.add(phrase);
    }
  }
  phrasesByPathCache.set(index, byPath);
  return byPath;
}

/**
 * The normalized phrases an index attributes to one document.
 *
 * @param {{ paths: string[], phrases: Record<string, number[]> }} index Parsed trigger index.
 * @param {string} documentPath Canonical repo-relative document path.
 * @returns {Set<string>} Attributed phrases, empty when the index does not list the path.
 */
export function indexedPhrasesFor(index, documentPath) {
  return phrasesByPath(index).get(documentPath) ?? new Set();
}

// ───────────────────────────────────────────────────────────────────
// 2. COMPARISON
// ───────────────────────────────────────────────────────────────────

/**
 * Compares a document's declared phrases with what the index attributes to it.
 * Equality is by set, so a one-word change is stale even when the count holds.
 *
 * @param {{ paths: string[], phrases: Record<string, number[]> }} index Parsed trigger index.
 * @param {string} documentPath Canonical repo-relative document path.
 * @param {Iterable<string>} declaredPhrases Normalized phrases the document declares now.
 * @returns {{ added: string[], removed: string[] }} Declared but not indexed, and indexed but no
 *   longer declared, each sorted. Both empty means the entry is fresh.
 */
export function compareDocumentPhrases(index, documentPath, declaredPhrases) {
  const declared = new Set(declaredPhrases);
  const indexed = indexedPhrasesFor(index, documentPath);
  return {
    added: Array.from(declared).filter((phrase) => !indexed.has(phrase)).sort(),
    removed: Array.from(indexed).filter((phrase) => !declared.has(phrase)).sort(),
  };
}
