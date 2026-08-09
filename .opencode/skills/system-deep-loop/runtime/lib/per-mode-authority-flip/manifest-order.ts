// ───────────────────────────────────────────────────────────────────
// MODULE: Per-Mode Authority Flip — Manifest Order Guard
// ───────────────────────────────────────────────────────────────────
//
// The eight-mode cutover order is a strict, gap-free prefix: a mode may
// flip only once every mode ordered before it in `AUTHORITY_FLIP_MODE_ORDER`
// already shows a dark-authoritative durable state. The "already flipped"
// set this guard checks against must always be derived fresh from the
// durable authority registry (`deriveFlippedModes`) — never trusted from a
// caller-supplied claim — so a forged predecessor set cannot admit an
// out-of-order flip.

import { AUTHORITY_FLIP_MODE_ORDER } from './types.js';

import type { AuthorityRegistry } from './authority-registry.js';
import type { AuthorityFlipDenialReasonCode, CutoverCertificateMode } from './types.js';

const MODE_SET: ReadonlySet<string> = new Set(AUTHORITY_FLIP_MODE_ORDER);

/** Durable states that mean a mode's canonical writer has already moved off legacy. */
const FLIPPED_STATES: ReadonlySet<string> = new Set([
  'new_authoritative_reversible',
  'new_authoritative_final',
]);

export type ModeOrderCheck =
  | Readonly<{ verdict: 'ok' }>
  | Readonly<{ verdict: 'denied'; reasonCode: AuthorityFlipDenialReasonCode }>;

/**
 * A cutover request names exactly one mode from the frozen manifest, and
 * that mode must be the exact next unflipped entry in the frozen order —
 * every mode ordered before it must already appear in `flippedModes`. This
 * enforces the full eight-mode prefix (not only "variants after common"),
 * matching the frozen manifest-order contract.
 */
export function checkManifestOrder(
  requestedModes: readonly unknown[],
  flippedModes: ReadonlySet<CutoverCertificateMode>,
): ModeOrderCheck {
  if (requestedModes.length !== 1) {
    return Object.freeze({ verdict: 'denied', reasonCode: 'MULTI_MODE_REQUEST_REJECTED' });
  }
  const [mode] = requestedModes;
  if (typeof mode !== 'string' || !MODE_SET.has(mode)) {
    return Object.freeze({ verdict: 'denied', reasonCode: 'UNKNOWN_MODE' });
  }
  const index = AUTHORITY_FLIP_MODE_ORDER.indexOf(mode as CutoverCertificateMode);
  const requiredPredecessors = AUTHORITY_FLIP_MODE_ORDER.slice(0, index);
  const missingPredecessor = requiredPredecessors.some((predecessor) => !flippedModes.has(predecessor));
  if (missingPredecessor) {
    return Object.freeze({ verdict: 'denied', reasonCode: 'MODE_ORDER_VIOLATION' });
  }
  return Object.freeze({ verdict: 'ok' });
}

/**
 * Derive the "already flipped" predecessor set from the live durable
 * registry rather than any caller claim. A mode counts as flipped only
 * once its own durable record shows a dark-authoritative state
 * (`new_authoritative_reversible` or `new_authoritative_final`); a
 * `rollback_pending` or still-legacy mode is not.
 */
export function deriveFlippedModes(registry: AuthorityRegistry): ReadonlySet<CutoverCertificateMode> {
  const flipped = new Set<CutoverCertificateMode>();
  for (const mode of AUTHORITY_FLIP_MODE_ORDER) {
    const record = registry.read(mode);
    if (FLIPPED_STATES.has(record.state)) flipped.add(mode);
  }
  return flipped;
}
