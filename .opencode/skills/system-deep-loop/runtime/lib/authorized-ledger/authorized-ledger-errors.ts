// ───────────────────────────────────────────────────────────────────
// MODULE: Authorized Ledger Errors
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

export const AuthorizedLedgerErrorCodes = {
  INPUT_INVALID: 'INPUT_INVALID',
  PATH_INVALID: 'PATH_INVALID',
  STORAGE_FAILURE: 'STORAGE_FAILURE',
  LOCK_TIMEOUT: 'LOCK_TIMEOUT',
  LOCK_LOST: 'LOCK_LOST',
  FRAME_MALFORMED: 'FRAME_MALFORMED',
  FRAME_UNSUPPORTED_VERSION: 'FRAME_UNSUPPORTED_VERSION',
  FRAME_SEQUENCE_MISMATCH: 'FRAME_SEQUENCE_MISMATCH',
  FRAME_HASH_MISMATCH: 'FRAME_HASH_MISMATCH',
  FRAME_EVENT_HASH_MISMATCH: 'FRAME_EVENT_HASH_MISMATCH',
  FRAME_INSERTION_DETECTED: 'FRAME_INSERTION_DETECTED',
  FRAME_FORK_DETECTED: 'FRAME_FORK_DETECTED',
  TORN_TAIL: 'TORN_TAIL',
  RECOVERY_NOT_ALLOWED: 'RECOVERY_NOT_ALLOWED',
  EXPECTED_HEAD_MISMATCH: 'EXPECTED_HEAD_MISMATCH',
  EVENT_ID_CONFLICT: 'EVENT_ID_CONFLICT',
  AUTHORIZATION_REQUIRED: 'AUTHORIZATION_REQUIRED',
  AUTHORIZATION_INVALID: 'AUTHORIZATION_INVALID',
  AUTHORIZATION_STALE: 'AUTHORIZATION_STALE',
  AUTHORIZATION_ALREADY_USED: 'AUTHORIZATION_ALREADY_USED',
  AUDIT_EVENT_INVALID: 'AUDIT_EVENT_INVALID',
  AUDIT_STORAGE_FAILURE: 'AUDIT_STORAGE_FAILURE',
  REPLAY_AUTHORIZATION_MISSING: 'REPLAY_AUTHORIZATION_MISSING',
  REPLAY_DENIED_EVENT_FOUND: 'REPLAY_DENIED_EVENT_FOUND',
  REPLAY_POLICY_DIVERGENCE: 'REPLAY_POLICY_DIVERGENCE',
  REDUCER_MISSING: 'REDUCER_MISSING',
  REDUCER_NON_DETERMINISTIC: 'REDUCER_NON_DETERMINISTIC',
} as const;

export type AuthorizedLedgerErrorCode =
  typeof AuthorizedLedgerErrorCodes[keyof typeof AuthorizedLedgerErrorCodes];

export type AuthorizedLedgerErrorPhase =
  | 'input'
  | 'storage'
  | 'lock'
  | 'integrity'
  | 'authorization'
  | 'replay'
  | 'reducer';

export type AuthorizedLedgerErrorDetail = string | number | boolean | null;

// ───────────────────────────────────────────────────────────────────
// 2. ERROR CLASS
// ───────────────────────────────────────────────────────────────────

/** Typed fail-closed error shared by the ledger, gateway, and replay boundary. */
export class AuthorizedLedgerError extends Error {
  public readonly code: AuthorizedLedgerErrorCode;
  public readonly phase: AuthorizedLedgerErrorPhase;
  public readonly details: Readonly<Record<string, AuthorizedLedgerErrorDetail>>;

  public constructor(
    code: AuthorizedLedgerErrorCode,
    phase: AuthorizedLedgerErrorPhase,
    message: string,
    details: Readonly<Record<string, AuthorizedLedgerErrorDetail>> = {},
  ) {
    super(message);
    this.name = 'AuthorizedLedgerError';
    this.code = code;
    this.phase = phase;
    this.details = Object.freeze({ ...details });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
