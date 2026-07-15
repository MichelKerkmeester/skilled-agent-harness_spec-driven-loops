# Review Resource Map - codex-4

The target spec did not contain `resource-map.md` during init, so the formal Resource Map Coverage Gate was skipped.

## Evidence Map

| Finding | Primary Files | Iteration |
|---|---|---|
| F001 | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts`; `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts` | iteration-001 |
| F002 | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts`; `.opencode/skills/system-spec-kit/mcp_server/tests/vector-coverage-hygiene.vitest.ts` | iteration-001 |
| F003 | `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md`; `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md`; `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`; `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts` | iteration-003 |
| F004 | `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`; `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`; `.opencode/skills/system-spec-kit/mcp_server/tools/types.ts`; `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts` | iteration-003 |

## Scope Coverage

| Scope Entry | Status | Notes |
|---|---|---|
| `handlers/mutation-hooks.ts` | reviewed | Missing entity-density invalidation in shared hook contract. |
| `handlers/memory-save.ts` | reviewed | Save invalidation present. |
| `handlers/save/` | reviewed | No new findings. |
| `handlers/memory-crud-update.ts` | reviewed | F001 active. |
| `handlers/memory-crud-delete.ts` | reviewed | Delete invalidation counterevidence checked. |
| `handlers/memory-bulk-delete.ts` | reviewed | Explicit invalidation checked. |
| `handlers/memory-embedding-reconcile.ts` | reviewed | F003 evidence for mode contract. |
| `lib/embedders/embedding-reconcile.ts` | reviewed | F002/F004 active. |
| `lib/search/entity-density.ts` | reviewed | TTL/cache source confirmed. |
