// ───────────────────────────────────────────────────────────────────
// MODULE: Compatibility Shadow Errors
// ───────────────────────────────────────────────────────────────────

import { EventEnvelopeError } from '../event-envelope/index.js';

// ───────────────────────────────────────────────────────────────────
// 1. ERROR CODES
// ───────────────────────────────────────────────────────────────────

export const CompatibilityErrorCodes = {
  REGISTRY_INVALID_DEFINITION: 'COMPATIBILITY_REGISTRY_INVALID_DEFINITION',
  REGISTRY_DUPLICATE_RECORD_TYPE: 'COMPATIBILITY_REGISTRY_DUPLICATE_RECORD_TYPE',
  REGISTRY_DUPLICATE_VERSION: 'COMPATIBILITY_REGISTRY_DUPLICATE_VERSION',
  REGISTRY_INVALID_VERSION: 'COMPATIBILITY_REGISTRY_INVALID_VERSION',
  REGISTRY_DUPLICATE_UPCASTER: 'COMPATIBILITY_REGISTRY_DUPLICATE_UPCASTER',
  REGISTRY_NON_ADJACENT_UPCASTER: 'COMPATIBILITY_REGISTRY_NON_ADJACENT_UPCASTER',
  REGISTRY_UPCASTER_GAP: 'COMPATIBILITY_REGISTRY_UPCASTER_GAP',
  REGISTRY_UPCASTER_CYCLE: 'COMPATIBILITY_REGISTRY_UPCASTER_CYCLE',
  UNKNOWN_RECORD_TYPE: 'COMPATIBILITY_UNKNOWN_RECORD_TYPE',
  SOURCE_LIMIT_EXCEEDED: 'COMPATIBILITY_SOURCE_LIMIT_EXCEEDED',
  SOURCE_INVALID_UTF8: 'COMPATIBILITY_SOURCE_INVALID_UTF8',
  SOURCE_INVALID_JSON: 'COMPATIBILITY_SOURCE_INVALID_JSON',
  SOURCE_INVALID_SHAPE: 'COMPATIBILITY_SOURCE_INVALID_SHAPE',
  CODEC_REJECTED: 'COMPATIBILITY_CODEC_REJECTED',
  CODEC_NON_DETERMINISTIC: 'COMPATIBILITY_CODEC_NON_DETERMINISTIC',
  CODEC_MUTATED_INPUT: 'COMPATIBILITY_CODEC_MUTATED_INPUT',
  AMBIGUOUS_UNVERSIONED_STATE: 'COMPATIBILITY_AMBIGUOUS_UNVERSIONED_STATE',
  FUTURE_STATE_VERSION: 'COMPATIBILITY_FUTURE_STATE_VERSION',
  UNSUPPORTED_STATE_VERSION: 'COMPATIBILITY_UNSUPPORTED_STATE_VERSION',
  STATE_VALIDATION_FAILED: 'COMPATIBILITY_STATE_VALIDATION_FAILED',
  UPCAST_EXECUTION_FAILED: 'COMPATIBILITY_UPCAST_EXECUTION_FAILED',
  UPCAST_NON_DETERMINISTIC: 'COMPATIBILITY_UPCAST_NON_DETERMINISTIC',
  UPCAST_MUTATED_INPUT: 'COMPATIBILITY_UPCAST_MUTATED_INPUT',
  UPCAST_INVALID_OUTPUT: 'COMPATIBILITY_UPCAST_INVALID_OUTPUT',
  UPCAST_IDENTITY_MUTATION: 'COMPATIBILITY_UPCAST_IDENTITY_MUTATION',
  UPCAST_LOSSY_CONVERSION: 'COMPATIBILITY_UPCAST_LOSSY_CONVERSION',
  COMPARISON_TOKEN_INVALID: 'COMPATIBILITY_COMPARISON_TOKEN_INVALID',
} as const;

export type CompatibilityErrorCode =
  typeof CompatibilityErrorCodes[keyof typeof CompatibilityErrorCodes];

export type CompatibilityErrorDetails = Readonly<
  Record<string, boolean | null | number | string>
>;

// ───────────────────────────────────────────────────────────────────
// 2. ERROR TYPE
// ───────────────────────────────────────────────────────────────────

/** Typed fail-closed error that never includes source payload values. */
export class CompatibilityError extends Error {
  public readonly code: CompatibilityErrorCode;
  public readonly details: CompatibilityErrorDetails;

  public constructor(
    code: CompatibilityErrorCode,
    message: string,
    details: CompatibilityErrorDetails = {},
  ) {
    super(message);
    this.name = 'CompatibilityError';
    this.code = code;
    this.details = Object.freeze({ ...details });
    Object.setPrototypeOf(this, CompatibilityError.prototype);
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. BOUNDED FAILURE HELPERS
// ───────────────────────────────────────────────────────────────────

const BOUNDED_ERROR_CODE_PATTERN = /^[A-Z][A-Z0-9_]{0,95}$/;

/** Reduce arbitrary failures to a bounded code without copying messages or payloads. */
export function boundedErrorCode(error: unknown): string {
  if (error === null || typeof error !== 'object') return 'UNEXPECTED_FAILURE';
  const code = (error as { readonly code?: unknown }).code;
  return typeof code === 'string' && BOUNDED_ERROR_CODE_PATTERN.test(code)
    ? code
    : 'UNEXPECTED_FAILURE';
}

/** Identify failures that mean a source could not become a current effective model. */
export function isCompatibilityResolutionFailure(error: unknown): boolean {
  return error instanceof CompatibilityError
    || error instanceof EventEnvelopeError;
}
