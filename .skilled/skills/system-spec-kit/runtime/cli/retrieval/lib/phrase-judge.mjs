// The phrase judge: the one place that says which trigger phrases the
// convention rejects. It depends on nothing but the normalizer, so the index
// generator can count phrase quality without importing the retrofit and
// validation machinery around it, and the retrofit pipeline and the validator
// re-export it from here so every enforcer keeps the same verdict.

import { normalizeTriggerText } from './normalize.mjs';

/** Generic workflow words rejected as trigger phrases, verbatim from the convention. */
export const GENERIC_TRIGGER_WORDS = Object.freeze(new Set([
  'session', 'context', 'memory', 'summary', 'feature', 'update', 'file', 'document', 'section',
]));

/**
 * The two phrases `ensureMinTriggerPhrases` falls back to when a document
 * yields nothing else. They are generic words too, but they are reported under
 * their own reason because naming the producer is what lets a reader tell an
 * author's word from an editor's default.
 */
export const EDITOR_FALLBACK_WORDS = Object.freeze(new Set(['session', 'context']));

/**
 * Function words used only by the stop-word-only negative. Kept short and
 * explicit: a long borrowed list would silently reject real domain phrases, and
 * this class only has to catch a phrase that carries no content word at all.
 */
export const STOP_WORDS = Object.freeze(new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'from', 'has', 'have',
  'how', 'in', 'into', 'is', 'it', 'its', 'of', 'on', 'or', 'that', 'the', 'then',
  'this', 'to', 'was', 'were', 'what', 'when', 'where', 'which', 'who', 'why', 'will', 'with',
]));

/**
 * Token budget for the whole-prose-sentence negative. Deliberately separate from
 * MAX_PHRASE_LENGTH: that character budget decides the `oversized` variant, and
 * folding the two together would report one defect under the other's label.
 */
export const MAX_PHRASE_TOKENS = 10;

/**
 * Judges one phrase against the convention's negative classes. The judgement is
 * reported, and it gates what may be written; it never rewrites what an author
 * already declared, because deleting an author's phrase is a content decision
 * the convention does not authorize.
 *
 * A phrase's provenance is not recoverable from the finished document, so the
 * two fallback shapes the frontmatter editor actually produces are matched by
 * shape and named in the reason rather than asserted as fact: the terminal
 * `session` and `context` pair, and a single token echoing the packet folder.
 * The folder-token rule will sometimes name a phrase an author chose, which is
 * why the row is a warning that reports the resemblance rather than an error
 * that claims to know where the phrase came from.
 *
 * @param {string} phrase Raw phrase text.
 * @param {{ folderTokens?: ReadonlyArray<string> }} [context] Packet-folder tokens.
 * @returns {{ negativeClass: string, reason: string } | null} Rejection, or null when admissible.
 */
export function judgeTriggerPhrase(phrase, context = {}) {
  const normalized = normalizeTriggerText(phrase);
  if (!normalized) {
    return { negativeClass: 'generic-workflow-word', reason: 'phrase normalizes to nothing' };
  }

  if (EDITOR_FALLBACK_WORDS.has(normalized)) {
    return {
      negativeClass: 'editor-fallback',
      reason: `"${normalized}" is a terminal fallback phrase of the frontmatter editor's ensureMinTriggerPhrases, not an author choice`,
    };
  }

  if (GENERIC_TRIGGER_WORDS.has(normalized)) {
    return { negativeClass: 'generic-workflow-word', reason: `generic workflow word "${normalized}"` };
  }

  const tokens = normalized.split(' ').filter(Boolean);
  if (tokens.length > 0 && tokens.every((token) => STOP_WORDS.has(token))) {
    return { negativeClass: 'stop-word-only', reason: 'every token is a stop word' };
  }

  if (tokens.length > 0 && tokens.every((token) => /^[0-9]+$/.test(token))) {
    return {
      negativeClass: 'numeric-only',
      reason: `"${normalized}" is only numbers, the shape a packet id or a date leaves behind rather than a concept a prompt would name`,
    };
  }

  if (/[.!?](\s|$)/.test(phrase.trim()) || tokens.length > MAX_PHRASE_TOKENS) {
    return {
      negativeClass: 'prose-sentence',
      reason: tokens.length > MAX_PHRASE_TOKENS
        ? `phrase carries ${tokens.length} tokens, above the ${MAX_PHRASE_TOKENS}-token budget`
        : 'phrase carries sentence punctuation',
    };
  }

  const folderTokens = context.folderTokens ?? [];
  if (tokens.length === 1 && folderTokens.includes(tokens[0])) {
    return {
      negativeClass: 'folder-token-fallback',
      reason: `single token "${tokens[0]}" repeats a token of its own packet folder, the shape the frontmatter editor's folder-token fallback produces`,
    };
  }

  if (tokens.length === 1) {
    return {
      negativeClass: 'single-token',
      reason: `single token "${tokens[0]}" can only match by exact equality and never ranks against a longer prompt; declare phrases of two or more tokens`,
    };
  }

  return null;
}
