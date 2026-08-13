// ───────────────────────────────────────────────────────────────────
// MODULE: Error Outcome Contract
// ───────────────────────────────────────────────────────────────────

import type { ContractHeader, JsonObject } from './common.js';

/** Serializable typed failure that never requires logging its source content. */
export interface ContractErrorRecord extends ContractHeader {
  readonly contractKind: 'error';
  readonly errorId: string;
  readonly code: ErrorOutcomeCode;
  readonly message: string;
  readonly retryable: boolean;
  readonly fallback: 'exact-original' | 'none';
  readonly details: JsonObject;
}

/** Stable failure codes shared by provider, validation, and assembly boundaries. */
export const ErrorOutcomeCodes = {
  CANCELLED: 'cancelled',
  INVALID_INPUT: 'invalid-input',
  PRIVACY_DENIED: 'privacy-denied',
  PROVIDER_FAILED: 'provider-failed',
  TIMEOUT: 'timeout',
  UNSUPPORTED_CONTROL: 'unsupported-control',
  UNSUPPORTED_SCHEMA: 'unsupported-schema',
  VALIDATION_FAILED: 'validation-failed',
} as const;

/** Serializable failure code. */
export type ErrorOutcomeCode =
  typeof ErrorOutcomeCodes[keyof typeof ErrorOutcomeCodes];
