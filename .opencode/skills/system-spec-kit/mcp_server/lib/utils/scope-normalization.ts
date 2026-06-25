// ───────────────────────────────────────────────────────────────
// MODULE: Scope Normalization
// ───────────────────────────────────────────────────────────────

/**
 * Canonical single-string scope normalizer.
 *
 * @param value - Arbitrary input.
 * @returns Trimmed non-empty string, or null for blank/non-string input.
 */
export function normalizeStringScopeId(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
