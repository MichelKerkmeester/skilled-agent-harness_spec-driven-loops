// ───────────────────────────────────────────────────────────────
// MODULE: Active Row Predicate
// ───────────────────────────────────────────────────────────────

import { getSearchableTiersFilter } from '../scoring/importance-tiers.js';
import { isArchivedRetrievalIncludedByDefault } from './search-flags.js';

export type ActiveRowLane = 'ranked' | 'constitutional';

export interface ActiveRowPredicateOptions {
  includeArchived?: boolean;
  includeCold?: boolean;
  lane?: ActiveRowLane;
}

export type ActiveRowLike = {
  deleted_at?: unknown;
  deletedAt?: unknown;
  importance_tier?: unknown;
  importanceTier?: unknown;
};

function validateAlias(alias: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(alias)) {
    throw new Error(`Invalid SQL alias for active row predicate: ${alias}`);
  }
  return alias;
}

function resolveLane(lane: ActiveRowPredicateOptions['lane']): ActiveRowLane {
  if (lane === undefined) return 'ranked';
  if (lane !== 'ranked' && lane !== 'constitutional') {
    throw new Error(`Invalid active row lane: ${String(lane)}`);
  }
  return lane;
}

function resolveIncludeCold(options: ActiveRowPredicateOptions): boolean {
  return options.includeCold ?? isArchivedRetrievalIncludedByDefault();
}

export function ACTIVE_ROW_SQL(alias: string, options: ActiveRowPredicateOptions = {}): string {
  const safeAlias = validateAlias(alias);
  const tombstoneClause = `${safeAlias}.deleted_at IS NULL`;
  if (resolveLane(options.lane) === 'constitutional') {
    return tombstoneClause;
  }

  return `${tombstoneClause} AND ${getSearchableTiersFilter({
    alias: safeAlias,
    includeArchived: options.includeArchived,
    includeCold: resolveIncludeCold(options),
    includeConstitutional: false,
  })}`;
}

export function ACTIVE_POPULATION_SQL(alias: string): string {
  const safeAlias = validateAlias(alias);
  return `${safeAlias}.deleted_at IS NULL AND ${getSearchableTiersFilter({
    alias: safeAlias,
    includeCold: false,
    includeConstitutional: true,
  })}`;
}

export function isActiveRow(row: ActiveRowLike, options: ActiveRowPredicateOptions = {}): boolean {
  const deletedAt = row.deleted_at ?? row.deletedAt;
  if (deletedAt !== null && deletedAt !== undefined && String(deletedAt).length > 0) {
    return false;
  }

  if (resolveLane(options.lane) === 'constitutional') {
    return true;
  }

  const tierValue = row.importance_tier ?? row.importanceTier;
  if (tierValue === null || tierValue === undefined || String(tierValue).length === 0) {
    return true;
  }

  const tier = String(tierValue).toLowerCase();
  if (tier === 'constitutional') return false;
  if (resolveIncludeCold(options)) return true;
  if (tier === 'deprecated') return false;
  if (tier === 'archived' && !options.includeArchived) return false;
  return true;
}
