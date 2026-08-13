// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Route Exclusions
// ───────────────────────────────────────────────────────────────
//
// Operator-adjustable denylist of skill ids the advisor must never route.
// A committed default list (config/route-exclusions.json) is the shared knob;
// editing that file adds or removes exclusions for everyone. An optional,
// gitignored local override (config/route-exclusions.local.json) FULLY REPLACES
// the committed list when present, so a single machine can privately re-enable
// or change exclusions (including an empty list). Loading is fail-safe: a
// missing or malformed file resolves to an empty set and never throws, so a
// broken config can only stop excluding a skill — it can never crash the
// advisor or hide an active skill by accident.

import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { readJsonObject } from '../utils/json-guard.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export interface RouteExclusionsConfig {
  readonly excludedSkillIds: readonly string[];
}

// ───────────────────────────────────────────────────────────────
// 2. CONFIG-DIR RESOLUTION
// ───────────────────────────────────────────────────────────────

const HERE = dirname(fileURLToPath(import.meta.url));

const COMMITTED_FILE = 'route-exclusions.json';
const LOCAL_OVERRIDE_FILE = 'route-exclusions.local.json';

// The committed config/ dir lives at the mcp-server root and is NOT copied into
// dist. This module resolves to it from both the TypeScript source layout
// (mcp-server/lib/routing) and the compiled dist layout
// (mcp-server/dist/mcp-server/lib/routing) — dist nests inside mcp-server, so a
// deeper relative walk reaches the same real config/. The first existing
// candidate wins.
const CONFIG_DIR_CANDIDATES: readonly string[] = [
  join(HERE, '..', '..', 'config'),             // source: lib/routing -> mcp-server/config
  join(HERE, '..', '..', '..', '..', 'config'), // dist: dist/mcp-server/lib/routing -> mcp-server/config
];

function resolveDefaultConfigDir(): string {
  const override = process.env.SPECKIT_ADVISOR_ROUTE_EXCLUSIONS_DIR;
  if (override && override.length > 0) return override;
  return CONFIG_DIR_CANDIDATES.find((dir) => existsSync(dir)) ?? CONFIG_DIR_CANDIDATES[0];
}

// ───────────────────────────────────────────────────────────────
// 3. LOADING
// ───────────────────────────────────────────────────────────────

function extractExcludedIds(parsed: Record<string, unknown> | null): ReadonlySet<string> {
  const ids = parsed?.excludedSkillIds;
  if (!Array.isArray(ids)) return new Set();
  return new Set(ids.filter((id): id is string => typeof id === 'string' && id.length > 0));
}

/**
 * Resolve the excluded-skill-id set from a specific config directory. When a
 * local override file exists it fully replaces the committed list (a present
 * override with an empty or malformed list yields an empty set — it never falls
 * back to the committed file). Never throws: any read or parse failure resolves
 * to an empty set.
 */
export function loadRouteExclusionsFromDir(configDir: string): ReadonlySet<string> {
  try {
    const localPath = join(configDir, LOCAL_OVERRIDE_FILE);
    const sourcePath = existsSync(localPath) ? localPath : join(configDir, COMMITTED_FILE);
    return extractExcludedIds(readJsonObject(sourcePath));
  } catch {
    return new Set();
  }
}

// ───────────────────────────────────────────────────────────────
// 4. RUNTIME ACCESSORS (cached)
// ───────────────────────────────────────────────────────────────

let cachedExcludedIds: ReadonlySet<string> | null = null;

/** Resolved excluded-skill-id set for the runtime's default config dir (cached). */
export function getRouteExcludedSkillIds(): ReadonlySet<string> {
  if (cachedExcludedIds === null) {
    cachedExcludedIds = loadRouteExclusionsFromDir(resolveDefaultConfigDir());
  }
  return cachedExcludedIds;
}

/** True when `skillId` is on the resolved routing-exclusion denylist. */
export function isRouteExcludedSkillId(skillId: string): boolean {
  return getRouteExcludedSkillIds().has(skillId);
}

/** Test seam: drop the cached resolution so the next read re-loads config. */
export function resetRouteExclusionsCache(): void {
  cachedExcludedIds = null;
}
