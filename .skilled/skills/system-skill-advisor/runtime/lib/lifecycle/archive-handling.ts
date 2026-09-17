// ───────────────────────────────────────────────────────────────
// MODULE: Archive And Future Handling
// ───────────────────────────────────────────────────────────────

import { isRouteExcludedSkillId } from '../routing/route-exclusions.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export type IndexLifecycleStatus = 'active' | 'archived' | 'future';

export interface IndexRoutePolicy {
  readonly lifecycleStatus: IndexLifecycleStatus;
  readonly structurallyIndexed: boolean;
  readonly defaultRoutable: boolean;
  readonly includeInCorpusStats: boolean;
}

// ───────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ───────────────────────────────────────────────────────────────

export function lifecycleStatusForPath(filePath: string): IndexLifecycleStatus {
  const normalized = filePath.replace(/\\/g, '/');
  if (normalized.includes('/z_archive/')) return 'archived';
  if (normalized.includes('/z-future/')) return 'future';
  return 'active';
}

export function routePolicyForPath(filePath: string): IndexRoutePolicy {
  const lifecycleStatus = lifecycleStatusForPath(filePath);
  const isActive = lifecycleStatus === 'active';
  return {
    lifecycleStatus,
    structurallyIndexed: true,
    defaultRoutable: isActive,
    includeInCorpusStats: isActive,
  };
}

// An entry stays routable only when its path is lifecycle-active AND its skill
// id (when the entry carries one) is not on the operator exclusion denylist.
// Entries without a `skillId` are governed by lifecycle alone, preserving the
// prior path-only behavior for callers that do not track ids here.
export function filterDefaultRoutable<T extends { sourcePath: string; skillId?: string }>(entries: readonly T[]): T[] {
  return entries.filter((entry) =>
    routePolicyForPath(entry.sourcePath).defaultRoutable
    && !(entry.skillId !== undefined && isRouteExcludedSkillId(entry.skillId)));
}

export function filterCorpusStatEligible<T extends { sourcePath: string }>(entries: readonly T[]): T[] {
  return entries.filter((entry) => routePolicyForPath(entry.sourcePath).includeInCorpusStats);
}

