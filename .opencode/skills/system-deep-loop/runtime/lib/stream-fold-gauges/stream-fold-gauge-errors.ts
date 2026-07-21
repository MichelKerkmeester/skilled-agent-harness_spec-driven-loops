// ───────────────────────────────────────────────────────────────────
// MODULE: Stream-Fold Gauge Errors
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. ERROR CONTRACT
// ───────────────────────────────────────────────────────────────────

/** Stable fail-closed codes exposed at gauge boundaries. */
export const StreamFoldGaugeErrorCodes = {
  INVALID_INPUT: 'INVALID_INPUT',
  REGISTRY_DUPLICATE: 'REGISTRY_DUPLICATE',
  REGISTRY_INCOMPLETE: 'REGISTRY_INCOMPLETE',
  DEPENDENCY_CYCLE: 'DEPENDENCY_CYCLE',
  AMBIENT_DEPENDENCY: 'AMBIENT_DEPENDENCY',
  STREAM_INTEGRITY: 'STREAM_INTEGRITY',
  UNSUPPORTED_EVENT: 'UNSUPPORTED_EVENT',
  UNSUPPORTED_EVENT_VERSION: 'UNSUPPORTED_EVENT_VERSION',
  INVALID_PAYLOAD: 'INVALID_PAYLOAD',
  INVALID_UNIT: 'INVALID_UNIT',
  REDUCER_FAILURE: 'REDUCER_FAILURE',
  REDUCER_NON_DETERMINISTIC: 'REDUCER_NON_DETERMINISTIC',
  CHECKPOINT_INVALID: 'CHECKPOINT_INVALID',
  REPLAY_FINGERPRINT_MISMATCH: 'REPLAY_FINGERPRINT_MISMATCH',
  SELF_INPUT_FORBIDDEN: 'SELF_INPUT_FORBIDDEN',
  PUBLICATION_DENIED: 'PUBLICATION_DENIED',
  PUBLICATION_FAILED: 'PUBLICATION_FAILED',
} as const;

/** One stable stream-fold gauge refusal code. */
export type StreamFoldGaugeErrorCode =
  typeof StreamFoldGaugeErrorCodes[keyof typeof StreamFoldGaugeErrorCodes];

/** Boundary phase that refused a gauge operation. */
export type StreamFoldGaugeErrorPhase =
  | 'registry'
  | 'stream'
  | 'reducer'
  | 'checkpoint'
  | 'fingerprint'
  | 'comparison'
  | 'publication';

/** Canonical scalar admitted into structured error details. */
export type StreamFoldGaugeErrorDetail = string | number | boolean | null;

/** Typed refusal that never carries a trusted gauge result. */
export class StreamFoldGaugeError extends Error {
  public readonly code: StreamFoldGaugeErrorCode;
  public readonly phase: StreamFoldGaugeErrorPhase;
  public readonly details: Readonly<Record<string, StreamFoldGaugeErrorDetail>>;

  public constructor(
    code: StreamFoldGaugeErrorCode,
    phase: StreamFoldGaugeErrorPhase,
    message: string,
    details: Readonly<Record<string, StreamFoldGaugeErrorDetail>> = {},
  ) {
    super(message);
    this.name = 'StreamFoldGaugeError';
    this.code = code;
    this.phase = phase;
    this.details = Object.freeze({ ...details });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
