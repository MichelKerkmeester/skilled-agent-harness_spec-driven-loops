// ───────────────────────────────────────────────────────────────
// MODULE: Canonical Fingerprint
// ───────────────────────────────────────────────────────────────
import { createHash } from 'node:crypto';

type CanonicalJson = null | boolean | number | string | CanonicalJson[] | { [key: string]: CanonicalJson };

function normalizeString(value: string): string {
  return value.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function normalizeNumber(value: number): number {
  if (!Number.isFinite(value)) {
    throw new TypeError('Cannot fingerprint non-finite numbers');
  }
  return Object.is(value, -0) ? 0 : value;
}

// Contract (mirrors JSON.stringify so the fingerprint matches its serialized
// form): undefined / function / symbol are non-JSON values handled uniformly —
// dropped as object keys and coerced to null as array elements. Any remaining
// unfingerprintable type (e.g. bigint) throws in every container, so the failure
// mode never depends on whether the value sits in an object or an array.
function isNonJsonValue(value: unknown): boolean {
  return typeof value === 'undefined' || typeof value === 'function' || typeof value === 'symbol';
}

function toCanonicalJson(value: unknown): CanonicalJson {
  if (value === null || typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return normalizeString(value);
  }

  if (typeof value === 'number') {
    return normalizeNumber(value);
  }

  if (isNonJsonValue(value)) {
    return null;
  }

  if (Array.isArray(value)) {
    return value.map((item) => (isNonJsonValue(item) ? null : toCanonicalJson(item)));
  }

  if (typeof value === 'object') {
    const input = value as Record<string, unknown>;
    const normalized: { [key: string]: CanonicalJson } = {};
    for (const key of Object.keys(input).sort()) {
      const child = input[key];
      if (isNonJsonValue(child)) {
        continue;
      }
      normalized[key] = toCanonicalJson(child);
    }
    return normalized;
  }

  throw new TypeError(`Cannot fingerprint value of type ${typeof value}`);
}

export function canonicalizeInput(value: unknown): string {
  return JSON.stringify(toCanonicalJson(value));
}

export function sha256Hex(value: string | Buffer): string {
  return createHash('sha256').update(value).digest('hex');
}

export function canonicalFingerprint(value: unknown): string {
  return sha256Hex(canonicalizeInput(value));
}

export function codeHash(parts: readonly string[]): string {
  const normalizedParts = parts.map((part) => normalizeString(part));
  return sha256Hex(canonicalizeInput(normalizedParts));
}
