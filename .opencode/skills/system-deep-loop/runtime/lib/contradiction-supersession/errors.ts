// ───────────────────────────────────────────────────────────────────
// MODULE: Contradiction and Supersession Errors
// ───────────────────────────────────────────────────────────────────

import type { JsonValue } from '../event-envelope/index.js';

export const ClaimRelationshipErrorCodes = {
  INVALID_INPUT: 'INVALID_INPUT',
  REFERENCE_MISSING: 'REFERENCE_MISSING',
  SELF_RELATION: 'SELF_RELATION',
  NON_CANONICAL_PAIR: 'NON_CANONICAL_PAIR',
  RELATIONSHIP_ID_MISMATCH: 'RELATIONSHIP_ID_MISMATCH',
  DUPLICATE_ACTIVE_RELATION: 'DUPLICATE_ACTIVE_RELATION',
  AMBIGUOUS_WITHDRAWAL: 'AMBIGUOUS_WITHDRAWAL',
  COMPETING_SUCCESSOR: 'COMPETING_SUCCESSOR',
  SUPERSESSION_CYCLE: 'SUPERSESSION_CYCLE',
  EVENT_ID_CONFLICT: 'EVENT_ID_CONFLICT',
  AUTHORIZATION_DENIED: 'AUTHORIZATION_DENIED',
  FINGERPRINT_MISMATCH: 'FINGERPRINT_MISMATCH',
  REPLAY_INVALID: 'REPLAY_INVALID',
} as const;

export type ClaimRelationshipErrorCode =
  typeof ClaimRelationshipErrorCodes[keyof typeof ClaimRelationshipErrorCodes];

/** Stable fail-closed error for candidate, append, fold, and replay boundaries. */
export class ClaimRelationshipError extends Error {
  public readonly code: ClaimRelationshipErrorCode;
  public readonly details: Readonly<Record<string, JsonValue>>;

  public constructor(
    code: ClaimRelationshipErrorCode,
    message: string,
    details: Readonly<Record<string, JsonValue>> = {},
  ) {
    super(message);
    this.name = 'ClaimRelationshipError';
    this.code = code;
    this.details = Object.freeze({ ...details });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
