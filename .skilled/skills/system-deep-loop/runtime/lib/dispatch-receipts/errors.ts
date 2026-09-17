// ───────────────────────────────────────────────────────────────────
// MODULE: Dispatch Receipt Errors
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

export const DispatchReceiptErrorCodes = {
  INVALID_INPUT: 'INVALID_INPUT',
  INVOCATION_FINGERPRINT_CONFLICT: 'INVOCATION_FINGERPRINT_CONFLICT',
  DISPATCH_ID_CONFLICT: 'DISPATCH_ID_CONFLICT',
  DURABLE_APPEND_FAILED: 'DURABLE_APPEND_FAILED',
  RECEIPT_EVIDENCE_CORRUPT: 'RECEIPT_EVIDENCE_CORRUPT',
  MAC_PROFILE_INVALID: 'MAC_PROFILE_INVALID',
  MAC_VERIFICATION_FAILED: 'MAC_VERIFICATION_FAILED',
  RECOVERY_ROUTING_FAILED: 'RECOVERY_ROUTING_FAILED',
} as const;

export type DispatchReceiptErrorCode =
  typeof DispatchReceiptErrorCodes[keyof typeof DispatchReceiptErrorCodes];

export type DispatchReceiptErrorPhase =
  | 'append'
  | 'fingerprint'
  | 'input'
  | 'integrity'
  | 'recovery'
  | 'resume';

export type DispatchReceiptErrorDetail = boolean | null | number | string;

// ───────────────────────────────────────────────────────────────────
// 2. ERROR CLASS
// ───────────────────────────────────────────────────────────────────

/** Bounded fail-closed error that never retains raw launch material. */
export class DispatchReceiptError extends Error {
  public readonly code: DispatchReceiptErrorCode;
  public readonly phase: DispatchReceiptErrorPhase;
  public readonly details: Readonly<Record<string, DispatchReceiptErrorDetail>>;

  public constructor(
    code: DispatchReceiptErrorCode,
    phase: DispatchReceiptErrorPhase,
    message: string,
    details: Readonly<Record<string, DispatchReceiptErrorDetail>> = {},
  ) {
    super(message);
    this.name = 'DispatchReceiptError';
    this.code = code;
    this.phase = phase;
    this.details = Object.freeze({ ...details });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
