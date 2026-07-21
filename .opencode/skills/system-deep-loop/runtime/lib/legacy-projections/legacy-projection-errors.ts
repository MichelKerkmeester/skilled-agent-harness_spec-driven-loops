// ───────────────────────────────────────────────────────────────────
// MODULE: Legacy Projection Errors
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. ERROR CONTRACT
// ───────────────────────────────────────────────────────────────────

/** Stable failure codes emitted by the shadow legacy-projection boundary. */
export const LegacyProjectionErrorCodes = {
  INVALID_INPUT: 'INVALID_INPUT',
  MANIFEST_INVALID: 'MANIFEST_INVALID',
  CONTRACT_UNREGISTERED: 'CONTRACT_UNREGISTERED',
  LEDGER_INVALID: 'LEDGER_INVALID',
  LEDGER_HEAD_MISMATCH: 'LEDGER_HEAD_MISMATCH',
  REPLAY_FINGERPRINT_MISMATCH: 'REPLAY_FINGERPRINT_MISMATCH',
  REDUCER_VERSION_MISMATCH: 'REDUCER_VERSION_MISMATCH',
  EVENT_UNSUPPORTED: 'EVENT_UNSUPPORTED',
  REDUCER_NONDETERMINISTIC: 'REDUCER_NONDETERMINISTIC',
  SERIALIZER_NONDETERMINISTIC: 'SERIALIZER_NONDETERMINISTIC',
  BASE_MISMATCH: 'BASE_MISMATCH',
  BYTE_PARITY_MISMATCH: 'BYTE_PARITY_MISMATCH',
  PATH_ESCAPE: 'PATH_ESCAPE',
  SYMLINK_ESCAPE: 'SYMLINK_ESCAPE',
  LIVE_TARGET_REJECTED: 'LIVE_TARGET_REJECTED',
  WATERMARK_INVALID: 'WATERMARK_INVALID',
  WATERMARK_REGRESSION: 'WATERMARK_REGRESSION',
  PUBLICATION_FAILED: 'PUBLICATION_FAILED',
} as const;

/** Programmatic shadow-projection failure code. */
export type LegacyProjectionErrorCode =
  typeof LegacyProjectionErrorCodes[keyof typeof LegacyProjectionErrorCodes];

/** Typed failure carrying bounded diagnostic context and no projected payload. */
export class LegacyProjectionError extends Error {
  public readonly code: LegacyProjectionErrorCode;
  public readonly artifactId: string;
  public readonly ledgerSequence: number | null;
  public readonly projectionVersion: string | null;
  public readonly invariant: string;
  public readonly details: Readonly<Record<string, string | number | boolean | null>>;

  public constructor(
    code: LegacyProjectionErrorCode,
    message: string,
    context: Readonly<{
      artifactId?: string;
      ledgerSequence?: number | null;
      projectionVersion?: string | null;
      invariant?: string;
      details?: Readonly<Record<string, string | number | boolean | null>>;
    }> = {},
  ) {
    super(message);
    this.name = 'LegacyProjectionError';
    this.code = code;
    this.artifactId = context.artifactId ?? 'unknown';
    this.ledgerSequence = context.ledgerSequence ?? null;
    this.projectionVersion = context.projectionVersion ?? null;
    this.invariant = context.invariant ?? 'unspecified';
    this.details = Object.freeze({ ...context.details });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
