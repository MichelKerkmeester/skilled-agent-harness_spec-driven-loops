// ───────────────────────────────────────────────────────────────
// MODULE: Content Identity
// ───────────────────────────────────────────────────────────────
import { createHash } from 'node:crypto';

/** Normalizes an input while preserving the caller's hash identity semantics. */
export type JsonHashNormalizer = (value: unknown) => unknown;

function sha256Hex(input: string): string {
  return createHash('sha256').update(input, 'utf-8').digest('hex');
}

/** Hash a raw content body without adding a namespace or prefix. */
export function hashContentBody(content: string): string {
  return sha256Hex(content);
}

/** Hash a normalized JSON value without changing the caller's identity rules. */
export function hashCanonicalJson(value: unknown, normalize: JsonHashNormalizer): string {
  const serialized = JSON.stringify(normalize(value));
  if (serialized === undefined) {
    throw new TypeError('Cannot hash a value without a JSON representation');
  }
  return sha256Hex(serialized);
}

export const DERIVED_CAUSAL_EDGE_KIND = 'causal-edge';
export const DEFAULT_DERIVED_CAUSAL_EDGE_RULE_VERSION = 'causal-edge:v1';
export const LEGACY_DERIVED_CAUSAL_EDGE_RULE_VERSION = 'legacy-pre-derived-id';

export interface CausalEdgeDerivedIdInput {
  readonly sourceId: string | number;
  readonly targetId: string | number;
  readonly relation: string;
  readonly sourceAnchor?: string | null;
  readonly targetAnchor?: string | null;
  readonly source: string;
  readonly ruleVersion: string;
}

function normalizeIdentityField(value: unknown, fallback: string): string {
  if (value === null || value === undefined) {
    return fallback;
  }
  const normalized = String(value).trim();
  return normalized.length > 0 ? normalized : fallback;
}

function normalizeAnchor(value: unknown): string {
  return value === null || value === undefined ? '' : String(value);
}

function normalizeCausalEdgeDerivedIdentity(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object') {
    throw new TypeError('Causal edge derived identity input must be an object');
  }

  const input = value as CausalEdgeDerivedIdInput;
  return {
    kind: DERIVED_CAUSAL_EDGE_KIND,
    source_id: normalizeIdentityField(input.sourceId, ''),
    target_id: normalizeIdentityField(input.targetId, ''),
    relation: normalizeIdentityField(input.relation, ''),
    source_anchor: normalizeAnchor(input.sourceAnchor),
    target_anchor: normalizeAnchor(input.targetAnchor),
    source: normalizeIdentityField(input.source, 'unknown'),
    rule_version: normalizeIdentityField(input.ruleVersion, LEGACY_DERIVED_CAUSAL_EDGE_RULE_VERSION),
  };
}

/** Derive a stable identity for a generated causal edge from its canonical fields. */
export function deriveCausalEdgeDerivedId(input: CausalEdgeDerivedIdInput): string {
  return hashCanonicalJson(input, normalizeCausalEdgeDerivedIdentity);
}
