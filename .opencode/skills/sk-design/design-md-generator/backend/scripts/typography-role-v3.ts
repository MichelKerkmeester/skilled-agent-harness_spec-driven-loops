// ────────────────────────────────────────────────────────────────
// MODULE: Semantic Typography Role Normalizer
// ────────────────────────────────────────────────────────────────

import { V3_SCHEMA } from './schema-v3';

import type { StyleReferenceSchema } from './schema-v3';
import type { TypographyLevel } from './types';

export interface NormalizedTypographyRole {
  readonly originalLabel: string;
  readonly semanticRole: string;
  readonly normalizedRole: string;
  readonly isExtension: boolean;
}

function roleSlug(value: string): string {
  return value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'unnamed';
}

/** Normalize one source role while retaining its original label. */
export function normalizeTypographyRole(
  sourceLabel: string,
  namespace = V3_SCHEMA.semanticRoles.extensionNamespace,
  schema: StyleReferenceSchema = V3_SCHEMA,
): NormalizedTypographyRole {
  const originalLabel = sourceLabel.trim() || 'unnamed';
  const key = roleSlug(originalLabel);
  const semanticRole = schema.semanticRoles.aliases[key]
    ?? (schema.semanticRoles.core.includes(key) ? key : 'extension');
  if (semanticRole !== 'extension') {
    return { originalLabel, semanticRole, normalizedRole: semanticRole, isExtension: false };
  }
  const safeNamespace = roleSlug(namespace);
  return {
    originalLabel,
    semanticRole,
    normalizedRole: `${safeNamespace}:${key}`,
    isExtension: true,
  };
}

/** Normalize a complete scale and deterministically resolve repeated semantic roles. */
export function normalizeTypographyScale(
  levels: readonly TypographyLevel[],
  schema: StyleReferenceSchema = V3_SCHEMA,
): readonly NormalizedTypographyRole[] {
  const sorted = levels
    .map((level, originalIndex) => ({ level, originalIndex }))
    .sort((left, right) => parseFloat(left.level.fontSize) - parseFloat(right.level.fontSize));
  const normalized = sorted.map(({ level }, index) => {
    const sourceLabel = level.typicalTags?.[0] ?? '';
    if (sourceLabel) return normalizeTypographyRole(sourceLabel, schema.semanticRoles.extensionNamespace, schema);
    const position = sorted.length <= 1 ? 0.4 : index / (sorted.length - 1);
    const fallback = position < 0.15
      ? 'caption'
      : position < 0.55
        ? 'body'
        : position < 0.75
          ? 'subheading'
          : position < 0.95
            ? 'heading'
            : 'display';
    return normalizeTypographyRole(fallback, schema.semanticRoles.extensionNamespace, schema);
  });
  const counts = new Map<string, number>();
  const byOriginalIndex: NormalizedTypographyRole[] = new Array(levels.length);
  normalized.forEach((role, sortedIndex) => {
    const occurrence = (counts.get(role.normalizedRole) ?? 0) + 1;
    counts.set(role.normalizedRole, occurrence);
    const uniqueRole = occurrence === 1
      ? role
      : { ...role, normalizedRole: `${role.normalizedRole}-${occurrence}` };
    byOriginalIndex[sorted[sortedIndex].originalIndex] = uniqueRole;
  });
  return byOriginalIndex;
}
