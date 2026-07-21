// ───────────────────────────────────────────────────────────────────
// MODULE: Next Focus Errors
// ───────────────────────────────────────────────────────────────────

/** Stable failure codes for selection, recording, and replay boundaries. */
export const NextFocusErrorCodes = {
  INVALID_INPUT: 'INVALID_INPUT',
  INVALID_SIGNAL: 'INVALID_SIGNAL',
  MIXED_SNAPSHOT: 'MIXED_SNAPSHOT',
  CONFLICTING_REPLAY: 'CONFLICTING_REPLAY',
  REPLAY_INTEGRITY: 'REPLAY_INTEGRITY',
} as const;

export type NextFocusErrorCode =
  typeof NextFocusErrorCodes[keyof typeof NextFocusErrorCodes];

/** Typed fail-closed error for next-focus decisions. */
export class NextFocusError extends Error {
  public readonly code: NextFocusErrorCode;
  public readonly details: Readonly<Record<string, string | number | boolean | null>>;

  public constructor(
    code: NextFocusErrorCode,
    message: string,
    details: Readonly<Record<string, string | number | boolean | null>> = {},
  ) {
    super(message);
    this.name = 'NextFocusError';
    this.code = code;
    this.details = Object.freeze({ ...details });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
