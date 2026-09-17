// ───────────────────────────────────────────────────────────────────
// MODULE: Locks and Fencing Errors
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. ERROR CONTRACT
// ───────────────────────────────────────────────────────────────────

export const LocksAndFencingErrorCodes = {
  EVIDENCE_DENIED: 'EVIDENCE_DENIED',
  FENCE_OVERFLOW: 'FENCE_OVERFLOW',
  HEAD_CONFLICT: 'HEAD_CONFLICT',
  IDENTITY_CONFLICT: 'IDENTITY_CONFLICT',
  INVALID_RESOURCE: 'INVALID_RESOURCE',
  LEASE_LOST: 'LEASE_LOST',
  LOCK_ORDER_VIOLATION: 'LOCK_ORDER_VIOLATION',
  LOCK_TIMEOUT: 'LOCK_TIMEOUT',
  MALFORMED_STATE: 'MALFORMED_STATE',
  STALE_FENCE: 'STALE_FENCE',
  TOKEN_ROLLBACK: 'TOKEN_ROLLBACK',
  UNSUPPORTED_ATOMICITY_DOMAIN: 'UNSUPPORTED_ATOMICITY_DOMAIN',
  VERSION_CONFLICT: 'VERSION_CONFLICT',
} as const;

export type LocksAndFencingErrorCode =
  typeof LocksAndFencingErrorCodes[keyof typeof LocksAndFencingErrorCodes];

export type LocksAndFencingErrorPhase =
  | 'acquire'
  | 'evidence'
  | 'guard'
  | 'mutation'
  | 'recovery'
  | 'release'
  | 'renew'
  | 'resource'
  | 'storage';

/** Typed fail-closed result for every concurrency-safety boundary. */
export class LocksAndFencingError extends Error {
  public readonly code: LocksAndFencingErrorCode;
  public readonly phase: LocksAndFencingErrorPhase;
  public readonly details: Readonly<Record<string, unknown>>;

  public constructor(
    code: LocksAndFencingErrorCode,
    phase: LocksAndFencingErrorPhase,
    message: string,
    details: Readonly<Record<string, unknown>> = {},
  ) {
    super(message);
    this.name = 'LocksAndFencingError';
    this.code = code;
    this.phase = phase;
    this.details = Object.freeze({ ...details });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

