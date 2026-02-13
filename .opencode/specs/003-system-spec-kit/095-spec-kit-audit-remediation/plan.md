# Plan: System Spec-Kit Code Audit & Remediation

## Status: COMPLETED

## Approach

Multi-phase parallel audit using 10 Opus 4.6 agents, followed by systematic remediation in priority order (critical bugs -> P0 -> P1 -> P2).

## Phase 1: Audit (10 Parallel Agents)

| Agent    | Scope                                                | Files |
| -------- | ---------------------------------------------------- | ----- |
| Agent 1  | mcp_server core (context-server.ts, db-state.ts)     | 2     |
| Agent 2  | mcp_server handlers (all 13 handler files)           | 13    |
| Agent 3  | mcp_server utils + formatters                        | 6     |
| Agent 4  | scripts/src TypeScript source                        | 43    |
| Agent 5  | shared/ TypeScript source                            | 13    |
| Agent 6  | Shell scripts                                        | 8     |
| Agent 7  | Python + config files                                | 5     |
| Agent 8  | Deep context-server.ts audit                         | 1     |
| Agent 9  | mcp_server lib modules (cognitive, search, storage)  | 20+   |
| Agent 10 | Root configs, SKILL.md, workspace                    | 6     |

## Phase 2: Critical Bug Fixes (Task #1)

- `flushAccessCounts()` -> `reset()` in shutdown handlers
- BM25 `add_document()` 3-arg signature bug
- Memory save handler crash on malformed input

## Phase 3: P0 Standards Fixes (Task #2)

- Em-dash `---` -> standard dash `---` headers (17+ files)
- `console.log` -> `console.error` (50+ instances across 13+ files)
- Handler header format: `SERVER:` -> `MODULE:`
- `checkDatabaseUpdated()` calls in all handlers
- Dual `module.exports` removal
- Response envelope pattern adoption

## Phase 4: P1 Standards Fixes (Task #3)

- BM25 snake_case -> camelCase (5 methods + 32 test updates)
- `require()` pattern documentation for cross-workspace paths
- `as string` casts -> `|| 'default'` pattern

## Phase 5: Shared/ Fixes (Task #4)

- `total_tokens` API response field fix (OpenAI + Voyage)
- Provider headers standardized
- `_executeRequest` -> `private executeRequest`
- `Function` cast -> typed `PipelineFactory`
- `console.log` -> `console.error` in providers

## Phase 6: Shell Script Fixes (Task #5)

- `set -euo pipefail` strict mode
- `[ ] -> [[ ]]` migration (~60 instances)
- TTY detection for color output
- Temp file cleanup traps
- `local` declarations in functions

## Phase 7: HIGH Severity Bug Fixes (Task #10)

- context-server.ts: autoSurfaceMemories non-fatal wrapping, dead code removal, uncaughtException handler split
- cross-encoder.ts: cache eviction (MAX_CACHE_ENTRIES=200)
- archival-manager.ts: error array cap, `.unref()`, AND logic fix
- co-activation.ts: actual embedding lookup
- attention-decay.ts: signature fix

## Phase 8: Remaining P1/P2 (Tasks #20-25)

- Shell `[ ] -> [[ ]]` completion
- 43 scripts/src/ headers -> `MODULE:` format
- MemoryRow interface consolidation (-> shared/types.ts)
- Duplicate function consolidation (cleanDescription)
- Default export removal (all removed)
- Import ordering standardization (7 files)
- Cross-reference comments on intentionally different duplicate functions

## Risk Mitigation

- Build verified after each phase (0 new errors)
- Backward-compatible aliases for renamed methods
- `require()` kept where TypeScript can't resolve cross-workspace paths
- Pre-existing 136 TS errors documented as out of scope

## Dependencies

- workflows-code--opencode skill (standards reference)
- TypeScript composite build system
- MCP stdio protocol constraints
