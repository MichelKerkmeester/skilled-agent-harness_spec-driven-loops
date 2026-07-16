# Review Resource Map - codex-3

The target spec folder did not contain `resource-map.md` at initialization, so the resource-map coverage gate was skipped.

## Reviewed Scope

- `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/save/`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts`

## Phase-5 Augmentation

Novel logic gaps recorded by this lineage:

- F001: `memory_update` entity-density cache invalidation gap.
- F002: reconcile dry-run/apply success-coverage predicate mismatch.
- F003: public repair command drift from live schema.
- F004: inert `activeOnly` option.
