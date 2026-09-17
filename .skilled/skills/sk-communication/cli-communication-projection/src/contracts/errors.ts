// ───────────────────────────────────────────────────────────────────
// MODULE: Contract Errors
// ───────────────────────────────────────────────────────────────────

import type { ValidationIssue } from './common.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** Stable error codes exposed to package consumers. */
export const ContractErrorCodes = {
  INVALID_CONTRACT: 'INVALID_CONTRACT',
  UNSUPPORTED_SCHEMA_MAJOR: 'UNSUPPORTED_SCHEMA_MAJOR',
} as const;

/** Public contract-error code. */
export type ContractErrorCode =
  typeof ContractErrorCodes[keyof typeof ContractErrorCodes];

// ───────────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/** Typed exception raised when a caller opts into throwing validation. */
export class ContractValidationError extends Error {
  public readonly code: ContractErrorCode;
  public readonly issues: readonly ValidationIssue[];
  public readonly originalInput: unknown;

  /** Create a validation error without serializing the rejected input. */
  public constructor(
    code: ContractErrorCode,
    message: string,
    issues: readonly ValidationIssue[],
    originalInput: unknown,
  ) {
    super(message);
    this.name = 'ContractValidationError';
    this.code = code;
    this.issues = issues;
    this.originalInput = originalInput;
    Object.setPrototypeOf(this, ContractValidationError.prototype);
  }
}
