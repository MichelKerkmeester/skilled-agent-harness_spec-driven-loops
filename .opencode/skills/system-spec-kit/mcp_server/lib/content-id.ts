// ───────────────────────────────────────────────────────────────
// MODULE: Content Identity
// ───────────────────────────────────────────────────────────────
import { createHash } from 'node:crypto';

/** Normalizes an input while preserving the caller's hash identity semantics. */
export type JsonHashNormalizer = (value: unknown) => unknown;

function sha256Hex(input: string): string {
  return createHash('sha256').update(input, 'utf-8').digest('hex');
}

const ZERO_CONTINUITY_FINGERPRINT = 'sha256:0000000000000000000000000000000000000000000000000000000000000000';
const ZERO_CONTINUITY_TIMESTAMP = '0000-00-00T00:00:00.000Z';

function indentationOf(line: string): number {
  return line.length - line.trimStart().length;
}

function isBlockBoundary(line: string, indent: number): boolean {
  const trimmed = line.trim();
  return trimmed.length > 0 && !trimmed.startsWith('#') && indentationOf(line) <= indent;
}

/** Normalize markdown bytes that do not change durable document identity. */
export function normalizeContentHashInput(content: string): string {
  const normalizedLines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const inYamlFrontmatter = normalizedLines[0]?.replace(/^\uFEFF/u, '') === '---';
  let frontmatterClosed = !inYamlFrontmatter;
  let inMemoryBlock = false;
  let memoryIndent = -1;
  let inContinuityBlock = false;
  let continuityIndent = -1;

  return normalizedLines
    .map((line, index) => {
      if (index > 0 && !frontmatterClosed && line.trim() === '---') {
        frontmatterClosed = true;
        return line.trimEnd();
      }

      if (frontmatterClosed) {
        return line.trimEnd();
      }

      const trimmed = line.trim();
      const indent = indentationOf(line);
      if (/^_memory:\s*$/u.test(trimmed)) {
        inMemoryBlock = true;
        memoryIndent = indent;
        inContinuityBlock = false;
        return line.trimEnd();
      }

      if (inMemoryBlock && isBlockBoundary(line, memoryIndent)) {
        inMemoryBlock = false;
        inContinuityBlock = false;
      }

      if (inMemoryBlock && /^continuity:\s*$/u.test(trimmed) && indent > memoryIndent) {
        inContinuityBlock = true;
        continuityIndent = indent;
        return line.trimEnd();
      }

      if (inContinuityBlock && isBlockBoundary(line, continuityIndent)) {
        inContinuityBlock = false;
      }

      if (inContinuityBlock && /^last_updated_at:\s*/u.test(trimmed)) {
        return line.replace(/^(\s*last_updated_at:\s*).*/u, `$1"${ZERO_CONTINUITY_TIMESTAMP}"`).trimEnd();
      }

      if (inContinuityBlock && /^fingerprint:\s*/u.test(trimmed)) {
        return line.replace(/^(\s*fingerprint:\s*).*/u, `$1"${ZERO_CONTINUITY_FINGERPRINT}"`).trimEnd();
      }

      return line.trimEnd();
    })
    .join('\n');
}

/** Hash a raw content body without adding a namespace or prefix. */
export function hashContentBody(content: string): string {
  return sha256Hex(content);
}

/** Return the normalized content hash written by new save-path rows. */
export function hashNormalizedContentBody(content: string): string {
  return hashContentBody(normalizeContentHashInput(content));
}

/** Return accepted hashes for matching rows written before and after normalization. */
export function contentHashVariants(content: string): readonly string[] {
  return [...new Set([hashNormalizedContentBody(content), hashContentBody(content)])];
}

/** Compare content against either normalized or legacy raw stored hashes. */
export function hashesMatch(content: string, storedHash: string | null | undefined): boolean {
  return typeof storedHash === 'string' && contentHashVariants(content).includes(storedHash);
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
