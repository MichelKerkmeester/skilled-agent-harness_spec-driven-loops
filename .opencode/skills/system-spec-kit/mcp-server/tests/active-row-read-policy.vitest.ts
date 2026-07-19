// ───────────────────────────────────────────────────────────────
// MODULE: Active Row Read Policy Tests
// ───────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';

import { ACTIVE_ROW_SQL, isActiveRow } from '../lib/search/active-row-predicate.js';
import { isArchivedVectorInclusionEnabled } from '../lib/search/search-flags.js';
import { TOOL_DEFINITIONS } from '../tool-schemas.js';

const COLD_FLAG = 'SPECKIT_INCLUDE_ARCHIVED_DEFAULT';
const VECTOR_FLAG = 'SPECKIT_INCLUDE_ARCHIVED_VECTOR';
const originalColdFlag = process.env[COLD_FLAG];
const originalVectorFlag = process.env[VECTOR_FLAG];

afterEach(() => {
  if (originalColdFlag === undefined) {
    delete process.env[COLD_FLAG];
  } else {
    process.env[COLD_FLAG] = originalColdFlag;
  }
  if (originalVectorFlag === undefined) {
    delete process.env[VECTOR_FLAG];
  } else {
    process.env[VECTOR_FLAG] = originalVectorFlag;
  }
});

describe('active row read policy', () => {
  it('fails closed when tier relaxations are omitted and honors explicit overrides', () => {
    const memorySearch = TOOL_DEFINITIONS.find((definition) => definition.name === 'memory_search');
    const properties = memorySearch?.inputSchema.properties as Record<string, Record<string, unknown>>;
    expect(properties.includeArchived).toMatchObject({ type: 'boolean', default: false });
    expect(properties.includeArchived.description).toContain('excluded from ranked reads by default');
    expect(properties.tier.description).toContain('archived');

    const coldFlagValues = [undefined, 'true', 'false'] as const;

    for (const coldFlagValue of coldFlagValues) {
      if (coldFlagValue === undefined) {
        delete process.env[COLD_FLAG];
      } else {
        process.env[COLD_FLAG] = coldFlagValue;
      }

      expect(ACTIVE_ROW_SQL('m')).toBe(
        "m.deleted_at IS NULL AND (m.importance_tier IS NULL OR lower(m.importance_tier) NOT IN ('deprecated','archived','constitutional'))",
      );
      expect(ACTIVE_ROW_SQL('m', { includeArchived: false })).toBe(
        "m.deleted_at IS NULL AND (m.importance_tier IS NULL OR lower(m.importance_tier) NOT IN ('deprecated','archived','constitutional'))",
      );
      expect(ACTIVE_ROW_SQL('m', { includeArchived: true })).toBe(
        "m.deleted_at IS NULL AND (m.importance_tier IS NULL OR lower(m.importance_tier) NOT IN ('constitutional'))",
      );

      for (const importanceTier of ['archived', 'deprecated']) {
        const row = { deleted_at: null, importance_tier: importanceTier };
        expect(isActiveRow(row)).toBe(false);
        expect(isActiveRow(row, { includeCold: false })).toBe(false);
        expect(isActiveRow(row, { includeCold: true })).toBe(true);
        expect(isActiveRow(row, { includeArchived: true })).toBe(true);
      }
    }
  });

  it('threads the archived vector flag through the active-row query policy', () => {
    const archivedRow = { deleted_at: null, importance_tier: 'archived' };

    for (const [flagValue, expectedInclusion] of [
      [undefined, true],
      ['true', true],
      ['false', false],
    ] as const) {
      if (flagValue === undefined) {
        delete process.env[VECTOR_FLAG];
      } else {
        process.env[VECTOR_FLAG] = flagValue;
      }

      const includeCold = isArchivedVectorInclusionEnabled();
      const sql = ACTIVE_ROW_SQL('m', { includeCold });

      expect(sql.includes("'archived'"), flagValue ?? 'unset').toBe(!expectedInclusion);
      expect(isActiveRow(archivedRow, { includeCold }), flagValue ?? 'unset').toBe(expectedInclusion);
      expect(isActiveRow(
        { deleted_at: null, importance_tier: 'constitutional' },
        { includeCold },
      )).toBe(false);
    }
  });
});
