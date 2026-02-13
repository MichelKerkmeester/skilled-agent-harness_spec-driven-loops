# Plan: Spec Kit Test Coverage

## Approach
Write new test files and expand existing test files to close coverage gaps identified in the audit.

## Wave Execution Strategy
- **Wave 1** (HIGH priority): context-server, session-manager, memory-save, memory-crud, bm25-index
- **Wave 2** (MEDIUM-HIGH): vector-index-impl, incremental-index, cross-encoder, access-tracker, checkpoints
- **Wave 3** (MEDIUM): scripts gaps (cleanup-orphaned-vectors, embeddings, retry-manager)

## Test Pattern
All tests use the custom runner pattern:
- File: mcp_server/tests/[name].test.ts
- Pattern: process.exit(), assert, console.log
- Runner: `cd mcp_server && node tests/run-tests.js`
- Individual: `npx tsx tests/[name].test.ts`

## Verified Module Paths (from audit)
### MCP Server (base: mcp_server/)
| Module | Source Path | Existing Test | Current Coverage |
|--------|-----------|---------------|-----------------|
| context-server | context-server.ts | NONE | 0% |
| vector-index-impl | lib/search/vector-index-impl.js | NONE | 0% |
| session-manager | lib/session/session-manager.ts | tests/session-manager.test.ts | ~36% |
| memory-save | handlers/memory-save.ts | tests/handler-memory-save.test.ts | ~40% |
| memory-crud | handlers/memory-crud.ts | tests/handler-memory-crud.test.ts | ~45% |
| incremental-index | lib/storage/incremental-index.ts | tests/incremental-index.test.js | ~0% (API drift) |
| bm25-index | lib/search/bm25-index.ts | tests/bm25-index.test.ts | ~75% |
| cross-encoder | lib/search/cross-encoder.ts | tests/cross-encoder.test.ts | ~65% |
| access-tracker | lib/storage/access-tracker.ts | tests/access-tracker.test.ts | ~65% |
| checkpoints handler | handlers/checkpoints.ts | tests/handler-checkpoints.test.ts | ~60% |

### Scripts (base: scripts/)
| Module | Source Path | Existing Test | Current Coverage |
|--------|-----------|---------------|-----------------|
| cleanup-orphaned-vectors | memory/cleanup-orphaned-vectors.ts | NONE | 0% |
| embeddings | lib/embeddings.ts | PARTIAL in test-scripts-modules.js | ~20% |
| retry-manager | lib/retry-manager.ts | PARTIAL in test-scripts-modules.js | ~20% |

## Success Criteria
- All new tests pass via custom runner
- No existing tests broken
- Each targeted module reaches ≥70% function coverage

## Addendum: Scope Expansion

**Original scope:** 13 gap modules identified in the initial audit (10 MCP server + 3 scripts), targeting ≥70% coverage for each.

**Expanded scope:** ~50 modules across 6 execution waves, covering the full MCP server and shared modules codebase.

**Rationale:** During wave execution, coverage analysis revealed significant numbers of additional untested or under-tested modules beyond the original 13. Each completed wave surfaced further gaps in adjacent code paths, handlers, and utility modules.

**Approach change:** The strategy shifted from targeted gap-filling (fix 13 known gaps) to comprehensive wave-based coverage (systematically cover all modules). Waves 4-6 were added to address the newly discovered gaps:
- **Waves 1-3** (original): Focused on the 13 modules listed above
- **Waves 4-6** (expanded): Extended to remaining handlers, search modules, storage layers, utility libraries, and integration points

**Final result:** 104 test files created, providing comprehensive coverage across the full MCP server and shared modules. The 4x scope expansion (13 → ~50 modules) was completed within the same spec folder rather than spawning separate specs, as all work served the single objective of test coverage.
