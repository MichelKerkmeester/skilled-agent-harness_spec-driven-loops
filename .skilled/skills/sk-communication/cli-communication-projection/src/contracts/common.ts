// ───────────────────────────────────────────────────────────────────
// MODULE: Shared Contract Types
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

/** JSON primitive accepted at every serialized contract boundary. */
export type JsonPrimitive = boolean | null | number | string;

/** Recursively JSON-compatible value. */
export type JsonValue =
  | JsonPrimitive
  | { readonly [key: string]: JsonValue }
  | readonly JsonValue[];

/** JSON object with immutable values. */
export interface JsonObject {
  readonly [key: string]: JsonValue;
}

/** Header shared by every independently versioned contract. */
export interface ContractHeader {
  readonly contractKind: ContractKind;
  readonly schemaVersion: string;
}

/** Provenance attached to every stored fixture. */
export interface FixtureProvenance {
  readonly sourceFamily: string;
  readonly sourceVersion: string;
  readonly captureMethod: CaptureMethod;
  readonly sanitizationStatus: SanitizationStatus;
  readonly capturedAt: string;
}

/** One validation problem at a stable JSON path. */
export interface ValidationIssue {
  readonly path: string;
  readonly code: string;
  readonly message: string;
}

/** Successful validation that returns the unchanged input object. */
export interface ValidationSuccess<TValue> {
  readonly success: true;
  readonly value: TValue;
}

/** Failed validation that retains the original input for in-process diagnosis. */
export interface ValidationFailure {
  readonly success: false;
  readonly issues: readonly ValidationIssue[];
  readonly originalInput: unknown;
}

/** Result returned by runtime contract validators. */
export type ValidationResult<TValue> = ValidationFailure | ValidationSuccess<TValue>;

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** Contract families supported by the first public schema major. */
export const ContractKinds = {
  BENCHMARK: 'benchmark',
  BOUNDED_CONTEXT: 'bounded-context',
  ERROR: 'error',
  EVALUATION: 'evaluation',
  EVENT: 'event',
  EXACT_ORIGINAL: 'exact-original',
  PRIVACY_DECISION: 'privacy-decision',
  PROMPT_PROFILE: 'prompt-profile',
  PROJECTION: 'projection',
  PROVIDER: 'provider',
  TELEMETRY: 'telemetry',
} as const;

/** Supported contract-family identifier. */
export type ContractKind = typeof ContractKinds[keyof typeof ContractKinds];

/** Runtime families covered by the portable contract. */
export const RuntimeIds = {
  CLAUDE: 'claude',
  CODEX: 'codex',
  CURSOR: 'cursor',
  DEVIN: 'devin',
  OPENCODE: 'opencode',
  PI: 'pi',
} as const;

/** Supported runtime identifier. */
export type RuntimeId = typeof RuntimeIds[keyof typeof RuntimeIds];

/** Evidence confidence for version-sensitive runtime and provider facts. */
export const ConfidenceStates = {
  CONFIRMED: 'confirmed',
  INFERRED: 'inferred',
  UNKNOWN: 'unknown',
} as const;

/** Confidence state attached to capability claims. */
export type ConfidenceState = typeof ConfidenceStates[keyof typeof ConfidenceStates];

/** Allowed provenance capture methods. */
export const CaptureMethods = {
  PRIMARY_SOURCE: 'primary-source',
  REDACTED_CAPTURE: 'redacted-capture',
  SYNTHETIC: 'synthetic',
} as const;

/** Fixture capture method. */
export type CaptureMethod = typeof CaptureMethods[keyof typeof CaptureMethods];

/** Sanitization state for stored fixtures. */
export const SanitizationStatuses = {
  IRREVERSIBLY_REDACTED: 'irreversibly-redacted',
  SYNTHETIC: 'synthetic',
} as const;

/** Fixture sanitization state. */
export type SanitizationStatus =
  typeof SanitizationStatuses[keyof typeof SanitizationStatuses];
