// ───────────────────────────────────────────────────────────────────
// MODULE: Context Types
// ───────────────────────────────────────────────────────────────────
// Single source of truth for context type definitions, canonical
// values, and legacy alias mappings. Used across shared/,
// runtime/, and runtime/cli/.
//
// The document values and the importance tiers live in
// sk-create-frontmatter's frontmatter-values.json so every checker
// reads one list; the session list stays here because it classifies
// saves.
// ───────────────────────────────────────────────────────────────────

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** One value list with the spellings accepted in its place. */
interface FrontmatterValueList {
  readonly canonical: readonly string[];
  readonly aliases: Readonly<Record<string, string>>;
}

/** Shape of sk-create-frontmatter's frontmatter-values.json. */
interface FrontmatterValues {
  readonly contextType: FrontmatterValueList;
  readonly importanceTier: FrontmatterValueList;
}

const FRONTMATTER_VALUES_JSON = path.join(
  'sk-doc', 'sk-create-frontmatter', 'assets', 'frontmatter-values.json',
);

function loadFrontmatterValues(): FrontmatterValues {
  let currentDir = path.dirname(fileURLToPath(import.meta.url));
  while (currentDir !== path.dirname(currentDir)) {
    const candidate = path.join(currentDir, FRONTMATTER_VALUES_JSON);
    if (existsSync(candidate)) {
      return JSON.parse(readFileSync(candidate, 'utf8')) as FrontmatterValues;
    }
    currentDir = path.dirname(currentDir);
  }

  throw new Error('frontmatter value list not found: sk-doc/sk-create-frontmatter/assets/frontmatter-values.json');
}

const VALUES: FrontmatterValues = loadFrontmatterValues();

/** The 4 canonical context types after the decision/discovery migration. */
export type CanonicalContextType = 'implementation' | 'research' | 'planning' | 'general';

/** All accepted context types including legacy aliases still in the DB. */
export type ContextType = CanonicalContextType | 'decision' | 'discovery';

/** Set of the 4 canonical context types. */
export const CANONICAL_CONTEXT_TYPES: ReadonlySet<CanonicalContextType> = new Set(
  VALUES.contextType.canonical as readonly CanonicalContextType[],
);

/**
 * Legacy context type aliases that map to canonical types.
 * These values predate the canonical context-type set and may still appear in
 * older database rows or frontmatter.
 */
export const LEGACY_CONTEXT_TYPE_ALIASES: Readonly<Record<string, CanonicalContextType>> = {
  decision: 'planning',
  discovery: 'general',
};

/**
 * Every spelling a document may carry in place of a canonical value, mapped to
 * that value. A superset of LEGACY_CONTEXT_TYPE_ALIASES: checkers accept these,
 * while migration keeps rewriting only the legacy pair.
 */
export const DOCUMENT_CONTEXT_TYPE_ALIASES: Readonly<Record<string, CanonicalContextType>> =
  VALUES.contextType.aliases as Readonly<Record<string, CanonicalContextType>>;

/**
 * Context types a save payload may declare. These classify the session, and
 * values such as `debugging` and `review` drive project phase and memory type.
 */
export const SESSION_CONTEXT_TYPES: ReadonlySet<string> = new Set([
  'implementation',
  'research',
  'debugging',
  'review',
  'planning',
  'decision',
  'architecture',
  'configuration',
  'documentation',
  'general',
  'discovery',
]);

/** The canonical importance tiers. */
export const IMPORTANCE_TIERS: ReadonlySet<string> = new Set(VALUES.importanceTier.canonical);

/** Importance-tier spellings accepted in frontmatter, mapped to their canonical tier. */
export const IMPORTANCE_TIER_ALIASES: Readonly<Record<string, string>> = VALUES.importanceTier.aliases;

/**
 * Normalize any context type string to its canonical form.
 * Returns the canonical type if recognized, or null if unknown.
 */
export function resolveCanonicalContextType(value: string): CanonicalContextType | null {
  const lower = value.toLowerCase().trim();
  if (CANONICAL_CONTEXT_TYPES.has(lower as CanonicalContextType)) {
    return lower as CanonicalContextType;
  }
  return LEGACY_CONTEXT_TYPE_ALIASES[lower] ?? null;
}

/**
 * Check whether a context type value is a legacy alias.
 */
export function isLegacyContextType(value: string): boolean {
  return value in LEGACY_CONTEXT_TYPE_ALIASES;
}
