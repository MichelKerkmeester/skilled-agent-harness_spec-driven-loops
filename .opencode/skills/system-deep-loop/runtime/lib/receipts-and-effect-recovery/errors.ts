// ───────────────────────────────────────────────────────────────────
// MODULE: Receipt and Effect Recovery Errors
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. ERROR CONTRACT
// ───────────────────────────────────────────────────────────────────

export const ReceiptEffectErrorCodes = {
  INVALID_INPUT: 'INVALID_INPUT',
  UNREGISTERED_BOUNDARY: 'UNREGISTERED_BOUNDARY',
  BOUNDARY_RESULT_MISSING: 'BOUNDARY_RESULT_MISSING',
  BOUNDARY_RESULT_INVALID: 'BOUNDARY_RESULT_INVALID',
  RECEIPT_CONFLICT: 'RECEIPT_CONFLICT',
  RECEIPT_INVALID: 'RECEIPT_INVALID',
  CERTIFICATION_PROVIDER_UNKNOWN: 'CERTIFICATION_PROVIDER_UNKNOWN',
  CERTIFICATION_INVALID: 'CERTIFICATION_INVALID',
  DURABLE_CERTIFICATION_REQUIRED: 'DURABLE_CERTIFICATION_REQUIRED',
  AUTHORIZATION_DENIED: 'AUTHORIZATION_DENIED',
  AUTHORIZED_APPEND_FAILED: 'AUTHORIZED_APPEND_FAILED',
  EFFECT_CONFLICT: 'EFFECT_CONFLICT',
  EFFECT_INTENT_UNRESOLVED: 'EFFECT_INTENT_UNRESOLVED',
  ADAPTER_UNSUPPORTED: 'ADAPTER_UNSUPPORTED',
  EFFECT_EXECUTION_FAILED: 'EFFECT_EXECUTION_FAILED',
  OUTCOME_UNVERIFIED: 'OUTCOME_UNVERIFIED',
  RECOVERY_CLAIM_REJECTED: 'RECOVERY_CLAIM_REJECTED',
  RECOVERY_EXHAUSTED: 'RECOVERY_EXHAUSTED',
  RECOVERY_STATE_INVALID: 'RECOVERY_STATE_INVALID',
  SECRET_MATERIAL_FORBIDDEN: 'SECRET_MATERIAL_FORBIDDEN',
} as const;

export type ReceiptEffectErrorCode =
  typeof ReceiptEffectErrorCodes[keyof typeof ReceiptEffectErrorCodes];

export type ReceiptEffectErrorPhase =
  | 'input'
  | 'receipt'
  | 'certification'
  | 'authorization'
  | 'effect'
  | 'recovery'
  | 'security';

export type ReceiptEffectErrorDetail = string | number | boolean | null;

/** Typed fail-closed failure for receipt issuance and effect recovery. */
export class ReceiptEffectError extends Error {
  public readonly code: ReceiptEffectErrorCode;
  public readonly phase: ReceiptEffectErrorPhase;
  public readonly details: Readonly<Record<string, ReceiptEffectErrorDetail>>;

  public constructor(
    code: ReceiptEffectErrorCode,
    phase: ReceiptEffectErrorPhase,
    message: string,
    details: Readonly<Record<string, ReceiptEffectErrorDetail>> = {},
  ) {
    super(message);
    this.name = 'ReceiptEffectError';
    this.code = code;
    this.phase = phase;
    this.details = Object.freeze({ ...details });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
