# Review Resource Map

## Target
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/002-mcp-retrieval-causal`

The target packet had no source `resource-map.md` at initialization, so the review resource map records evidence gathered during this lineage only.

## Primary Files Reviewed
| File | Coverage |
|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Security, correctness, session state, community fallback |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts` | Trusted-session comparison and L1 orchestration behavior |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts` | Scope filtering, trusted-session comparison, limit contract |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts` | Causal read path and input limits |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-links-processor.ts` | Relation mapping, reference resolution, edge insertion |

## Supporting Files Reviewed
| File | Why |
|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/community-search.ts` | Community fallback source for F001 |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Default-on community fallback flags |
| `.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts` | Default-on feature flag policy |
| `.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts` | Content exposure path for fallback rows |
| `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts` | Trusted-session resolver used by neighboring handlers |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Public MCP contract for F002/F003 comparison |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Runtime validation contract |
| `.opencode/skills/system-spec-kit/mcp_server/tools/causal-tools.ts` | Causal dispatcher validation |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Main governance scope filtering comparison |

## Tests Consulted
| File | Why |
|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts` | Trigger handler scope and limit tests |
| `.opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-integration.vitest.ts` | Causal relation orientation regression |
| `.opencode/skills/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts` | Trusted-session behavior |

## Findings Map
| Finding | Files |
|---|---|
| F001 | `memory-search.ts`, `community-search.ts`, `search-flags.ts`, `rollout-policy.ts`, `search-results.ts` |
| F002 | `memory-search.ts`, `memory-context.ts`, `memory-triggers.ts`, `session-manager.ts`, `tool-schemas.ts` |
| F003 | `tool-schemas.ts`, `tool-input-schemas.ts`, `memory-triggers.ts`, `handler-memory-triggers.vitest.ts` |

## Coverage Notes
Code Graph was unavailable for this lineage. Coverage was reconstructed with direct file reads and `rg` over reviewed handlers, supporting libraries, and tests.
