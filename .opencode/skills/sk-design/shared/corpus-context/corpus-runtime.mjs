// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Corpus Runtime Guards                                                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝

const RETRIEVAL_UNAVAILABLE_CODES = Object.freeze(new Set([
  'manifest-missing',
  'manifest-stale',
  'corpus-changing',
  'ENOENT',
]));

function deepFreeze(value, seen = new Set()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const key of Reflect.ownKeys(value)) deepFreeze(value[key], seen);
  return Object.freeze(value);
}

/**
 * Capture caller-owned input before asynchronous retrieval can observe mutations.
 *
 * @param {Object} value - Validated request data.
 * @returns {Object} Detached deeply frozen snapshot.
 */
export function immutableSnapshot(value) {
  return deepFreeze(structuredClone(value));
}

/**
 * Classify retrieval failures that must become accepted negative evidence.
 *
 * @param {Error} error - Retrieval error.
 * @returns {boolean} Whether the consumer must normalize the error.
 */
export function isRetrievalUnavailableError(error) {
  return error instanceof SyntaxError || RETRIEVAL_UNAVAILABLE_CODES.has(error?.code);
}

/**
 * Resolve plan states that prohibit corpus hydration.
 *
 * @param {Object} contextPlan - Validated neutral context plan.
 * @returns {string|null} Closed negative outcome or null.
 */
export function blockingPlanOutcome(contextPlan) {
  if (
    contextPlan.generationIdentity.state === 'mismatch'
    || contextPlan.proofPlan.outcome === 'generation-mismatch'
  ) {
    return 'generation-mismatch';
  }
  if (
    contextPlan.generationIdentity.state === 'unavailable'
    || contextPlan.proofPlan.outcome === 'unavailable'
    || contextPlan.availability === 'unavailable'
  ) {
    return 'unavailable';
  }
  return null;
}
