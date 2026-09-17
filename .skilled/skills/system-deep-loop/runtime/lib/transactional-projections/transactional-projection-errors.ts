// ───────────────────────────────────────────────────────────────────
// MODULE: Transactional Projection Errors
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. ERROR CONTRACT
// ───────────────────────────────────────────────────────────────────

export const TransactionalProjectionErrorCodes = {
  INVALID_INPUT: 'INVALID_INPUT',
  REGISTRY_DUPLICATE: 'REGISTRY_DUPLICATE',
  REGISTRY_INCOMPLETE: 'REGISTRY_INCOMPLETE',
  DEPENDENCY_CYCLE: 'DEPENDENCY_CYCLE',
  LEDGER_CORRUPTION: 'LEDGER_CORRUPTION',
  SEQUENCE_GAP: 'SEQUENCE_GAP',
  UNSUPPORTED_EVENT: 'UNSUPPORTED_EVENT',
  UNSUPPORTED_EVENT_VERSION: 'UNSUPPORTED_EVENT_VERSION',
  REDUCER_FAILURE: 'REDUCER_FAILURE',
  CONSTRAINT_VIOLATION: 'CONSTRAINT_VIOLATION',
  IDEMPOTENCY_CONFLICT: 'IDEMPOTENCY_CONFLICT',
  WATERMARK_MISMATCH: 'WATERMARK_MISMATCH',
  WATERMARK_INVALID: 'WATERMARK_INVALID',
  WRITER_CONFLICT: 'WRITER_CONFLICT',
  GENERATION_CONFLICT: 'GENERATION_CONFLICT',
  GENERATION_INVALID: 'GENERATION_INVALID',
  MIXED_CUTOFF: 'MIXED_CUTOFF',
  REBUILD_REQUIRED: 'REBUILD_REQUIRED',
  PUBLICATION_FAILED: 'PUBLICATION_FAILED',
} as const;

export type TransactionalProjectionErrorCode =
  typeof TransactionalProjectionErrorCodes[keyof typeof TransactionalProjectionErrorCodes];

export type TransactionalProjectionErrorPhase =
  | 'registry'
  | 'ledger'
  | 'reducer'
  | 'transaction'
  | 'watermark'
  | 'generation'
  | 'snapshot'
  | 'publication';

export type TransactionalProjectionErrorDetail = string | number | boolean | null;

/** Typed fail-closed refusal that never carries partially prepared state. */
export class TransactionalProjectionError extends Error {
  public readonly code: TransactionalProjectionErrorCode;
  public readonly phase: TransactionalProjectionErrorPhase;
  public readonly details: Readonly<Record<string, TransactionalProjectionErrorDetail>>;

  public constructor(
    code: TransactionalProjectionErrorCode,
    phase: TransactionalProjectionErrorPhase,
    message: string,
    details: Readonly<Record<string, TransactionalProjectionErrorDetail>> = {},
  ) {
    super(message);
    this.name = 'TransactionalProjectionError';
    this.code = code;
    this.phase = phase;
    this.details = Object.freeze({ ...details });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
