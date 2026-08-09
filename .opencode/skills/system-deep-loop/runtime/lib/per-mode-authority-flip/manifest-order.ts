// ───────────────────────────────────────────────────────────────────
// MODULE: Per-Mode Authority Flip — Manifest Order Guard
// ───────────────────────────────────────────────────────────────────

import {
  AUTHORITY_FLIP_COMMON_MODE,
  AUTHORITY_FLIP_COMMON_VARIANTS,
  AUTHORITY_FLIP_MODE_ORDER,
} from './types.js';

import type { AuthorityFlipDenialReasonCode, CutoverCertificateMode } from './types.js';

const MODE_SET: ReadonlySet<string> = new Set(AUTHORITY_FLIP_MODE_ORDER);

export type ModeOrderCheck =
  | Readonly<{ verdict: 'ok' }>
  | Readonly<{ verdict: 'denied'; reasonCode: AuthorityFlipDenialReasonCode }>;

/**
 * A cutover request names exactly one mode from the frozen manifest, and a
 * benchmark variant may not flip before its shared common workstream has
 * already reached a dark-authoritative state.
 */
export function checkManifestOrder(
  requestedModes: readonly unknown[],
  alreadyFlippedModes: ReadonlySet<CutoverCertificateMode>,
): ModeOrderCheck {
  if (requestedModes.length !== 1) {
    return Object.freeze({ verdict: 'denied', reasonCode: 'MULTI_MODE_REQUEST_REJECTED' });
  }
  const [mode] = requestedModes;
  if (typeof mode !== 'string' || !MODE_SET.has(mode)) {
    return Object.freeze({ verdict: 'denied', reasonCode: 'UNKNOWN_MODE' });
  }
  if (
    AUTHORITY_FLIP_COMMON_VARIANTS.has(mode as CutoverCertificateMode)
    && !alreadyFlippedModes.has(AUTHORITY_FLIP_COMMON_MODE)
  ) {
    return Object.freeze({ verdict: 'denied', reasonCode: 'MODE_ORDER_VIOLATION' });
  }
  return Object.freeze({ verdict: 'ok' });
}
