// ───────────────────────────────────────────────────────────────────
// MODULE: Cross-Mode Closure Errors
// ───────────────────────────────────────────────────────────────────

export const CrossModeClosureErrorCodes = Object.freeze({
  INVALID_CONTEXT: 'INVALID_CONTEXT',
  INVALID_OVERRIDE: 'INVALID_OVERRIDE',
  NON_DETERMINISTIC_OVERRIDE: 'NON_DETERMINISTIC_OVERRIDE',
  SEALED_REFERENCE_REJECTED: 'SEALED_REFERENCE_REJECTED',
  AUTHORIZED_FACT_REQUIRED: 'AUTHORIZED_FACT_REQUIRED',
  RECEIPT_ORDER_VIOLATION: 'RECEIPT_ORDER_VIOLATION',
  LOCAL_ADJUDICATION_REDUCTION_FORBIDDEN: 'LOCAL_ADJUDICATION_REDUCTION_FORBIDDEN',
  ADJUDICATION_RESULT_INVALID: 'ADJUDICATION_RESULT_INVALID',
  BUDGET_DENIED: 'BUDGET_DENIED',
  PROJECTION_REJECTED: 'PROJECTION_REJECTED',
  MANIFEST_INCOMPLETE: 'MANIFEST_INCOMPLETE',
  COMMON_PIPELINE_INVALID: 'COMMON_PIPELINE_INVALID',
} as const);

export type CrossModeClosureErrorCode =
  typeof CrossModeClosureErrorCodes[keyof typeof CrossModeClosureErrorCodes];

/** Bounded failure surfaced by a shared closure contract. */
export class CrossModeClosureError extends Error {
  public readonly code: CrossModeClosureErrorCode;
  public readonly details: Readonly<Record<string, unknown>>;

  public constructor(
    code: CrossModeClosureErrorCode,
    message: string,
    details: Readonly<Record<string, unknown>> = {},
  ) {
    super(message);
    this.name = 'CrossModeClosureError';
    this.code = code;
    this.details = Object.freeze({ ...details });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
