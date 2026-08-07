# Review Resource Map

## Reviewed Target Files
| File | Role |
|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Search handler, cursor entry/exit, cache key, response shaping |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts` | Unified context handler, session lifecycle, mode routing |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts` | Trigger matcher handler, scoped trigger filtering |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts` | Causal graph read, stats, link, unlink handlers |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts` | Parsed causal-link resolution and edge insertion |

## Supporting Evidence Files
| File | Finding |
|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts` | F002 |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | F003 |
| `.opencode/skills/system-spec-kit/mcp_server/tools/types.ts` | F003 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` | F003 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/progressive-disclosure.vitest.ts` | F002 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts` | F001 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-integration.vitest.ts` | F001 |

## Finding Map
| Finding | Primary File | Dimension |
|---|---|---|
| F001 | `causal-links-processor.ts` | correctness |
| F002 | `progressive-disclosure.ts` via `memory-search.ts` | security |
| F003 | `causal-graph.ts` | security |
| F004 | `memory-search.ts`, `memory-context.ts`, `memory-triggers.ts` | maintainability |
