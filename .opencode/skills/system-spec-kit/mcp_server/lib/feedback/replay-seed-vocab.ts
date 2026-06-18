// ───────────────────────────────────────────────────────────────
// MODULE: Replay Seed Vocabulary
// ───────────────────────────────────────────────────────────────
// Single audit-stable source for the static intent seed phrases the
// synthetic replay corpus is allowed to emit. Re-exported (not redefined)
// from the intent classifier so the corpus and the classifier can never
// drift to two different vocabularies. Every phrase here is a compiled
// constant — never user-derived — which is exactly what lets the corpus
// privacy guard treat seed-pool membership as proof that no raw query
// text was smuggled into a synthetic string.

import { INTENT_CENTROID_SEEDS } from '../search/intent-classifier.js';

/**
 * Static intent → seed-phrase pools. Typed with a string index so the corpus
 * can look up by a telemetry intent value without a closed-union cast; the
 * values are still the same compiled constants and never contain PII.
 */
export const INTENT_REPLAY_SEEDS: Record<string, string[]> = INTENT_CENTROID_SEEDS;

/** Closed set of coarse result-count buckets used as the secondary class axis. */
export const RESULT_COUNT_CLASSES = ['zero', 'low', 'mid', 'high'] as const;

/** True only for intents that carry a static seed pool — the closed-vocab gate. */
export function isKnownIntent(x: string): boolean {
  return Object.hasOwn(INTENT_REPLAY_SEEDS, x)
    && Array.isArray(INTENT_REPLAY_SEEDS[x])
    && INTENT_REPLAY_SEEDS[x].length > 0;
}
