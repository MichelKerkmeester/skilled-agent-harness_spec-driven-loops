// ───────────────────────────────────────────────────────────────────
// MODULE: Dispatch Receipt Identity
// ───────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';

import {
  DispatchReceiptError,
  DispatchReceiptErrorCodes,
} from './errors.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const STABLE_IDENTITY_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:@-]{0,255}$/;

// ───────────────────────────────────────────────────────────────────
// 2. PUBLIC API
// ───────────────────────────────────────────────────────────────────

/** Require a bounded identity that cannot contain raw structured input. */
export function assertDispatchIdentity(value: unknown, field: string): string {
  if (typeof value !== 'string' || !STABLE_IDENTITY_PATTERN.test(value)) {
    throw new DispatchReceiptError(
      DispatchReceiptErrorCodes.INVALID_INPUT,
      'input',
      'Dispatch identity must be a bounded stable identifier',
      { field },
    );
  }
  return value;
}

/** Derive one stable receipt identity from the authorized dispatch identity. */
export function deriveDispatchReceiptId(dispatchId: string): string {
  const stableDispatchId = assertDispatchIdentity(dispatchId, 'dispatchId');
  const digest = createHash('sha256').update(stableDispatchId).digest('hex');
  return `dispatch-receipt:${digest}`;
}

/** Keep the envelope idempotency key stable while launch facts remain conflict-detecting bytes. */
export function deriveDispatchIdempotencyKey(dispatchId: string): string {
  const stableDispatchId = assertDispatchIdentity(dispatchId, 'dispatchId');
  const digest = createHash('sha256').update(stableDispatchId).digest('hex');
  return `lineage-dispatch-resolved:${digest}`;
}
