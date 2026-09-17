// ───────────────────────────────────────────────────────────────────
// MODULE: Result Envelope Errors
// ──────────────────────────────────────────────────────────────────

export const ResultEnvelopeErrorCodes = Object.freeze({
  CONFLICT: 'RESULT_ENVELOPE_CONFLICT',
  INVALID_INPUT: 'RESULT_ENVELOPE_INVALID_INPUT',
  MISSING_DISPATCH_RECEIPT: 'RESULT_ENVELOPE_MISSING_DISPATCH_RECEIPT',
  RECOVERY_EVIDENCE_INVALID: 'RESULT_ENVELOPE_RECOVERY_EVIDENCE_INVALID',
  UNTRUSTED_LEDGER: 'RESULT_ENVELOPE_UNTRUSTED_LEDGER',
} as const);

export type ResultEnvelopeErrorCode =
  typeof ResultEnvelopeErrorCodes[keyof typeof ResultEnvelopeErrorCodes];

export class ResultEnvelopeError extends Error {
  public readonly code: ResultEnvelopeErrorCode;
  public readonly details: Readonly<Record<string, string | number | boolean | null>>;

  public constructor(
    code: ResultEnvelopeErrorCode,
    message: string,
    details: Readonly<Record<string, string | number | boolean | null>> = {},
  ) {
    super(message);
    this.name = 'ResultEnvelopeError';
    this.code = code;
    this.details = Object.freeze({ ...details });
  }
}
