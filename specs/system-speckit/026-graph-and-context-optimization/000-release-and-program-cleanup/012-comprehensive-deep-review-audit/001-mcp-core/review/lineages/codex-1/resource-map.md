# Review Evidence Resource Map

The source spec folder did not include a `resource-map.md`, so the mandatory Resource Map Coverage Gate was skipped. This emitted map records the converged review evidence discovered by the lineage.

## Reviewed Implementation Surfaces

| Surface | Evidence |
|---|---|
| Mutation hook cache clearing | `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:20`, `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:97` |
| Memory update mutation path | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:151`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:304` |
| Memory delete mutation path | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:98`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:244` |
| Memory bulk delete mutation path | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:30`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:257` |
| Save pipeline cache invalidation | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:197`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2703`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2854` |
| Entity-density cache contract | `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:136`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:159` |
| Reconcile dry-run/apply predicates | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:281`, `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:409` |
| Reconcile public schema | `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:341`, `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:306`, `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:583` |

## Finding Links

| Finding | Iterations | Source Evidence |
|---|---|---|
| F001 | 001, 005 | Mutation hook lacks entity-density invalidation while update/delete rely on it. |
| F002 | 001, 005 | Dry-run success-coverage count uses rowid-only absence; apply repair uses rowid OR dimension-table absence. |
| F003 | 003, 005 | Install guide and feature catalog use stale `dryRun:false` wording while schema/handler use `mode`. |
| F004 | 003, 005 | `activeOnly` appears in public schema/type surfaces but is not read by the implementation. |

## Phase-5 Augmentation

No additional novel logic gaps were found during the stabilization pass. Active findings remained stable at P0:0, P1:3, P2:1.
