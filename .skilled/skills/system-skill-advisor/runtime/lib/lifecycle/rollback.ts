// ───────────────────────────────────────────────────────────────
// MODULE: Skill Derived Rollback
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export interface RollbackResult {
  readonly metadata: Record<string, unknown>;
  readonly removedDerived: boolean;
  readonly schemaVersion: 1;
  readonly reindexRequired: boolean;
}

// ───────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ───────────────────────────────────────────────────────────────

export function rollbackDerivedBlock(metadata: Record<string, unknown>): RollbackResult {
  const { derived: _derived, ...rest } = metadata;
  return {
    metadata: {
      ...rest,
      schema_version: 1,
    },
    removedDerived: Object.prototype.hasOwnProperty.call(metadata, 'derived'),
    schemaVersion: 1,
    reindexRequired: true,
  };
}
