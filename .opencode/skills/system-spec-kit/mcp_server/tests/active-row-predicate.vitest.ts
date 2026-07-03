import { describe, expect, it } from 'vitest';

import { ACTIVE_POPULATION_SQL, ACTIVE_ROW_SQL, isActiveRow } from '../lib/search/active-row-predicate.js';
import { getSearchableTiersFilter, IMPORTANCE_TIERS, VALID_TIERS } from '../lib/scoring/importance-tiers.js';

describe('active row predicate', () => {
  it('builds the hard ranked SQL predicate with NULL guard and constitutional exclusion', () => {
    expect(ACTIVE_ROW_SQL('m', { includeCold: false })).toBe(
      "m.deleted_at IS NULL AND (m.importance_tier IS NULL OR lower(m.importance_tier) NOT IN ('deprecated','archived','constitutional'))",
    );
  });

  it('keeps cold-tier inclusion graduated without admitting constitutional ranked rows', () => {
    expect(ACTIVE_ROW_SQL('m', { includeCold: true })).toBe(
      "m.deleted_at IS NULL AND (m.importance_tier IS NULL OR lower(m.importance_tier) NOT IN ('constitutional'))",
    );
  });

  it('applies tombstone and tier semantics to hydrated rows', () => {
    expect(isActiveRow({ deleted_at: null, importance_tier: null }, { includeCold: false })).toBe(true);
    expect(isActiveRow({ deleted_at: null, importance_tier: 'Deprecated' }, { includeCold: false })).toBe(false);
    expect(isActiveRow({ deleted_at: null, importance_tier: 'archived' }, { includeCold: false })).toBe(false);
    expect(isActiveRow({ deleted_at: null, importance_tier: 'constitutional' }, { includeCold: true })).toBe(false);
    expect(isActiveRow({ deleted_at: '2026-07-03T00:00:00Z', importance_tier: 'normal' }, { includeCold: true })).toBe(false);
    expect(isActiveRow({ deleted_at: null, importance_tier: 'constitutional' }, { lane: 'constitutional' })).toBe(true);
  });

  it('reports active population without excluding constitutional rows', () => {
    expect(ACTIVE_POPULATION_SQL('m')).toBe(
      "m.deleted_at IS NULL AND (m.importance_tier IS NULL OR lower(m.importance_tier) NOT IN ('deprecated','archived'))",
    );
  });
});

describe('archived tier configuration', () => {
  it('derives archived from IMPORTANCE_TIERS into VALID_TIERS', () => {
    expect(VALID_TIERS).toContain('archived');
    expect(IMPORTANCE_TIERS.archived).toMatchObject({
      value: 0.2,
      searchBoost: 0.0,
      decay: false,
      autoExpireDays: null,
    });
  });

  it('uses the canonical searchable tier SQL helper', () => {
    expect(getSearchableTiersFilter({ alias: 'm', includeCold: false })).toBe(
      "(m.importance_tier IS NULL OR lower(m.importance_tier) NOT IN ('deprecated','archived','constitutional'))",
    );
  });
});
