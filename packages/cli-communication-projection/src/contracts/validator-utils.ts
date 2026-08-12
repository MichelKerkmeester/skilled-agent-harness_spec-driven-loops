// ───────────────────────────────────────────────────────────────────
// MODULE: Runtime Validator Utilities
// ───────────────────────────────────────────────────────────────────

import { assessSchemaCompatibility } from '../versioning/compatibility.js';

import type {
  ContractKind,
  JsonValue,
  ValidationIssue,
  ValidationResult,
} from './common.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;

// ───────────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/** Collect validation issues without mutating or normalizing the input. */
export class ValidationCollector {
  private readonly _issues: ValidationIssue[] = [];

  /** Add one validation issue when a required invariant is false. */
  public require(
    condition: boolean,
    path: string,
    code: string,
    message: string,
  ): void {
    if (!condition) {
      this._issues.push({ path, code, message });
    }
  }

  /** Append issues produced by a nested validator under a new path. */
  public append(path: string, issues: readonly ValidationIssue[]): void {
    for (const issue of issues) {
      const suffix = issue.path === '$' ? '' : issue.path.slice(1);
      this._issues.push({ ...issue, path: `${path}${suffix}` });
    }
  }

  /** Return the original input reference on both success and failure. */
  public result<TValue>(input: unknown): ValidationResult<TValue> {
    if (this._issues.length > 0) {
      return {
        success: false,
        issues: Object.freeze([...this._issues]),
        originalInput: input,
      };
    }

    return { success: true, value: input as TValue };
  }
}

/** Narrow an unknown input to a non-array record. */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Validate recursively that a value can be serialized as JSON. */
export function isJsonValue(value: unknown, seen = new WeakSet<object>()): value is JsonValue {
  if (value === null || typeof value === 'boolean' || typeof value === 'string') {
    return true;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value);
  }

  if (typeof value !== 'object') {
    return false;
  }

  if (seen.has(value)) {
    return false;
  }
  seen.add(value);

  const isValid = Array.isArray(value)
    ? value.every((entry) => isJsonValue(entry, seen))
    : Object.values(value).every((entry) => isJsonValue(entry, seen));
  seen.delete(value);
  return isValid;
}

/** Require a record and report the type mismatch at the supplied path. */
export function expectRecord(
  value: unknown,
  path: string,
  collector: ValidationCollector,
): Record<string, unknown> | null {
  collector.require(isRecord(value), path, 'type', 'Expected an object.');
  return isRecord(value) ? value : null;
}

/** Require a non-empty string property. */
export function expectString(
  record: Record<string, unknown>,
  key: string,
  path: string,
  collector: ValidationCollector,
): string | null {
  const value = record[key];
  const isValid = typeof value === 'string' && value.length > 0;
  collector.require(isValid, `${path}.${key}`, 'type', 'Expected a non-empty string.');
  return isValid ? value : null;
}

/** Require a nullable string property. */
export function expectNullableString(
  record: Record<string, unknown>,
  key: string,
  path: string,
  collector: ValidationCollector,
): void {
  const value = record[key];
  collector.require(
    value === null || (typeof value === 'string' && value.length > 0),
    `${path}.${key}`,
    'type',
    'Expected null or a non-empty string.',
  );
}

/** Require a finite number property within optional bounds. */
export function expectNumber(
  record: Record<string, unknown>,
  key: string,
  path: string,
  collector: ValidationCollector,
  minimum = Number.NEGATIVE_INFINITY,
  maximum = Number.POSITIVE_INFINITY,
): number | null {
  const value = record[key];
  const isValid = typeof value === 'number'
    && Number.isFinite(value)
    && value >= minimum
    && value <= maximum;
  collector.require(isValid, `${path}.${key}`, 'range', 'Expected a finite number in range.');
  return isValid ? value : null;
}

/** Require a non-negative integer property. */
export function expectNonNegativeInteger(
  record: Record<string, unknown>,
  key: string,
  path: string,
  collector: ValidationCollector,
): number | null {
  const value = expectNumber(record, key, path, collector, 0);
  if (value !== null) {
    collector.require(
      Number.isInteger(value),
      `${path}.${key}`,
      'integer',
      'Expected a non-negative integer.',
    );
  }
  return value !== null && Number.isInteger(value) ? value : null;
}

/** Require one literal value from an allowlist. */
export function expectEnum(
  record: Record<string, unknown>,
  key: string,
  allowed: readonly string[],
  path: string,
  collector: ValidationCollector,
): string | null {
  const value = record[key];
  const isValid = typeof value === 'string' && allowed.includes(value);
  collector.require(isValid, `${path}.${key}`, 'enum', `Expected one of: ${allowed.join(', ')}.`);
  return isValid ? value : null;
}

/** Require a strict UTC ISO timestamp. */
export function expectIsoDate(
  record: Record<string, unknown>,
  key: string,
  path: string,
  collector: ValidationCollector,
  allowNull = false,
): void {
  const value = record[key];
  const isValid = allowNull && value === null
    ? true
    : typeof value === 'string'
      && ISO_DATE_PATTERN.test(value)
      && !Number.isNaN(Date.parse(value));
  collector.require(isValid, `${path}.${key}`, 'date', 'Expected a UTC ISO-8601 timestamp.');
}

/** Validate a contract header and reject unsupported schema majors. */
export function validateHeader(
  record: Record<string, unknown>,
  expectedKind: ContractKind,
  path: string,
  collector: ValidationCollector,
): void {
  const kind = expectString(record, 'contractKind', path, collector);
  collector.require(
    kind === expectedKind,
    `${path}.contractKind`,
    'contract_kind',
    `Expected contract kind ${expectedKind}.`,
  );

  const version = expectString(record, 'schemaVersion', path, collector);
  if (version !== null) {
    const compatibility = assessSchemaCompatibility(expectedKind, version);
    collector.require(
      compatibility.supported,
      `${path}.schemaVersion`,
      compatibility.behavior === 'breaking' ? 'unsupported_major' : 'version',
      compatibility.reason,
    );
  }
}

/** Require that a record contains no keys outside a security allowlist. */
export function expectOnlyKeys(
  record: Record<string, unknown>,
  allowed: readonly string[],
  path: string,
  collector: ValidationCollector,
): void {
  for (const key of Object.keys(record)) {
    collector.require(
      allowed.includes(key),
      `${path}.${key}`,
      'unknown_key',
      'Field is not permitted by this closed contract.',
    );
  }
}
