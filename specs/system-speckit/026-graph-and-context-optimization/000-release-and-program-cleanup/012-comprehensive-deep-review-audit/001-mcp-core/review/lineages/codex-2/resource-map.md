# Deep Review Resource Map

Phase-5 augmentation from converged review deltas.

## Reviewed Implementation Paths
- `.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts` - shared post-mutation cache hook.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts` - metadata update handler.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts` - single and folder delete handler.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts` - tier bulk delete handler.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` - save orchestration and atomic save entry point.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts` - atomic write/index helper.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/save/create-record.ts` - persisted record creation.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-embedding-reconcile.ts` - MCP reconcile handler.
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts` - reconcile bucket and apply logic.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts` - cached entity-density signal.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts` - low-level update/delete mutations.

## Finding Map
| Finding | Primary Path | Iteration |
|---|---|---:|
| F001 | `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts` | 1 |
| F002 | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts` | 1 |
| F003 | `.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts` | 4 |
| F004 | `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | 3 |
| F005 | `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | 3 |

## Resource Map Coverage Gate
- touched entries: no target `resource-map.md` existed at init, so no declared map entries could be touched.
- untouched entries (`expected-by-scope` vs `gap`): N/A because the target packet has no resource map.
- implementation paths absent from the map: N/A because the target packet has no resource map.
