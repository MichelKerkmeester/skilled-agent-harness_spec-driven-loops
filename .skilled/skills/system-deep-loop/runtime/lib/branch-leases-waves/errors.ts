// ───────────────────────────────────────────────────────────────────
// MODULE: Branch Leases and Waves Errors
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. ERROR CONTRACT
// ───────────────────────────────────────────────────────────────────

export const BranchOrchestrationErrorCodes = {
  AMBIGUOUS_LEASE_STATE: 'AMBIGUOUS_LEASE_STATE',
  BRANCH_ID_COLLISION: 'BRANCH_ID_COLLISION',
  BRANCH_NOT_FOUND: 'BRANCH_NOT_FOUND',
  BRANCH_REGISTRATION_CONFLICT: 'BRANCH_REGISTRATION_CONFLICT',
  DUPLICATE_COORDINATES: 'DUPLICATE_COORDINATES',
  INVALID_COORDINATES: 'INVALID_COORDINATES',
  INVALID_MUTATION: 'INVALID_MUTATION',
  LEDGER_HEAD_CONFLICT: 'LEDGER_HEAD_CONFLICT',
  MANIFEST_DRIFT: 'MANIFEST_DRIFT',
  RUN_ID_CONFLICT: 'RUN_ID_CONFLICT',
  UNKNOWN_DERIVATION_VERSION: 'UNKNOWN_DERIVATION_VERSION',
  WAVE_NOT_AUTHORIZED: 'WAVE_NOT_AUTHORIZED',
  WAVE_PLAN_DRIFT: 'WAVE_PLAN_DRIFT',
  WAVE_STATE_CONFLICT: 'WAVE_STATE_CONFLICT',
} as const;

export type BranchOrchestrationErrorCode =
  typeof BranchOrchestrationErrorCodes[keyof typeof BranchOrchestrationErrorCodes];

export type BranchOrchestrationErrorPhase =
  | 'identity'
  | 'ledger'
  | 'lease'
  | 'manifest'
  | 'mutation'
  | 'replay'
  | 'wave';

/** Typed fail-closed error for durable fan-out admission and ownership. */
export class BranchOrchestrationError extends Error {
  public readonly code: BranchOrchestrationErrorCode;
  public readonly phase: BranchOrchestrationErrorPhase;
  public readonly details: Readonly<Record<string, unknown>>;

  public constructor(
    code: BranchOrchestrationErrorCode,
    phase: BranchOrchestrationErrorPhase,
    message: string,
    details: Readonly<Record<string, unknown>> = {},
  ) {
    super(message);
    this.name = 'BranchOrchestrationError';
    this.code = code;
    this.phase = phase;
    this.details = Object.freeze({ ...details });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
