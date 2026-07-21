// ───────────────────────────────────────────────────────────────────
// MODULE: Write-Set Conflict Graph Errors
// ───────────────────────────────────────────────────────────────────

export const WriteSetGraphErrorCodes = {
  INVALID_MANIFEST_NODE_SET: 'INVALID_MANIFEST_NODE_SET',
  INVALID_MODE_DECLARATIONS: 'INVALID_MODE_DECLARATIONS',
  INVALID_POLICY: 'INVALID_POLICY',
} as const;

export type WriteSetGraphErrorCode =
  typeof WriteSetGraphErrorCodes[keyof typeof WriteSetGraphErrorCodes];

export class WriteSetGraphValidationError extends Error {
  public readonly code: WriteSetGraphErrorCode;
  public readonly details: Readonly<Record<string, unknown>>;

  public constructor(
    code: WriteSetGraphErrorCode,
    message: string,
    details: Readonly<Record<string, unknown>> = {},
  ) {
    super(message);
    this.name = 'WriteSetGraphValidationError';
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, WriteSetGraphValidationError.prototype);
  }
}
