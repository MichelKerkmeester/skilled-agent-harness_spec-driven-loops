// ───────────────────────────────────────────────────────────────────
// MODULE: Stable Graph Digest
// ───────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';

export function compareStableText(left: string, right: string): number {
  if (left === right) return 0;
  return left < right ? -1 : 1;
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((entry) => canonicalize(entry));
  if (value === null || typeof value !== 'object') return value;

  const record = value as Readonly<Record<string, unknown>>;
  return Object.fromEntries(
    Object.keys(record)
      .sort(compareStableText)
      .map((key) => [key, canonicalize(record[key])]),
  );
}

export function stableStringify(value: unknown): string {
  return JSON.stringify(canonicalize(value));
}

export function stableDigest(value: unknown): string {
  return `sha256:${createHash('sha256').update(stableStringify(value)).digest('hex')}`;
}
