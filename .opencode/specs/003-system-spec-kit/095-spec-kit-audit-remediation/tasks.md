# Tasks: System Spec-Kit Code Audit & Remediation

## Status: COMPLETED

## Task Summary

| # | Task | Status | Phase | Agent(s) |
|---|------|--------|-------|----------|
| 1 | Critical bug fixes | DONE | 2 | 2 parallel |
| 2 | P0 standards violations | DONE | 3 | 4 parallel |
| 3 | P1 standards violations | DONE | 4 | 3 parallel |
| 4 | Shared/ provider fixes | DONE | 5 | 2 parallel |
| 5 | Shell script fixes | DONE | 6 | 3 parallel |
| 6 | Python test fixes | DONE | 6 | 1 |
| 10 | HIGH severity bugs (deep audit) | DONE | 7 | 2 parallel |
| 20 | Shell [ ] → [[ ]] completion | DONE | 8 | 1 |
| 21 | Scripts TS P0 headers (43 files) | DONE | 8 | 1 |
| 22 | MemoryRow interface consolidation | DONE | 8 | 1 |
| 23 | Duplicate function consolidation | DONE | 8 | 1 |
| 24 | Missing return types audit | DONE | 8 | 1 (no changes needed) |
| 25 | Default exports + import ordering | DONE | 8 | 1 |

> **Note:** Task IDs #7-9 and #11-19 were used for sub-tasks and agent dispatches during the audit sessions but are not listed separately as they were absorbed into their parent tasks.

## Detailed Task Log

### Task 1: Critical Bug Fixes
**Priority:** CRITICAL
**Files Modified:**
- `mcp_server/context-server.ts` — `flushAccessCounts()` → `reset()` in shutdown handlers
- `mcp_server/handlers/memory-save.ts` — BM25 3-arg bug fix, `console.log` → `console.error`

### Task 2: P0 Standards Violations
**Priority:** P0 (Hard Blocker)
**Agents:** 4 parallel
- Agent 1: Em-dash headers in `lib/cognitive/` (6 files)
- Agent 2: Em-dash headers in `lib/search/` (4 files)
- Agent 3: Em-dash headers in `lib/storage/` (4 files)
- Agent 4: Headers + console.log in core, handlers, formatters

**Files Modified (30+):**
- All handler files: header format, `console.log` → `console.error`, `checkDatabaseUpdated()` calls
- `lib/cognitive/*`: em-dash → standard dash headers
- `lib/search/*`: em-dash → standard dash headers
- `lib/storage/*`: em-dash → standard dash headers
- `lib/cache/tool-cache.ts`: header, console.log, `as string` casts
- `lib/architecture/layer-definitions.ts`: dual exports removed
- `lib/validation/preflight.ts`: dual exports removed
- `formatters/index.ts`: header standardized
- `handlers/memory-context.ts`: response envelope pattern

### Task 3: P1 Standards Violations
**Priority:** P1
**Agents:** 3 parallel
- BM25 camelCase rename (5 methods)
- Test file updates (32 method call renames across 2 test files)
- `require()` pattern documentation in `errors/core.ts`

### Task 4: Shared/ Provider Fixes
**Priority:** P0/P1 mixed
**Agents:** 2 parallel
**Files Modified:**
- `shared/embeddings/providers/openai.ts` — `total_tokens` bug, header, method rename, console.log
- `shared/embeddings/providers/voyage.ts` — `total_tokens` bug, header, snake_case params, method rename, console.log
- `shared/embeddings/providers/hf-local.ts` — header, snake_case, `Function` → `PipelineFactory` cast, console.log
- `shared/embeddings/factory.ts` — header
- `shared/embeddings/profile.ts` — header
- `shared/scoring/folder-scoring.ts` — header
- `shared/utils/retry.ts` — header
- `shared/utils/path-security.ts` — header

### Task 5: Shell Script Fixes
**Priority:** P0/P1 mixed
**Agents:** 3 parallel
**Files Modified:**
- `scripts/tests/test-validation.sh` — strict mode, TTY detection, `[ ] → [[ ]]`
- `scripts/tests/test-validation-extended.sh` — strict mode, TTY detection, `[ ] → [[ ]]`
- `scripts/setup/rebuild-native-modules.sh` — header
- `scripts/setup/check-native-modules.sh` — header
- `scripts/rules/check-anchors.sh` — temp cleanup trap
- `scripts/spec/create.sh` — local declarations

### Task 6: Python Test Fixes
**Priority:** P0/P1
**Files Modified:**
- `scripts/tests/test_dual_threshold.py` — COMPONENT header, `-> None` on 71 methods

### Task 10: HIGH Severity Bugs
**Priority:** HIGH
**Agents:** 2 parallel

**context-server.ts bugs:**
- BUG-3+4: autoSurfaceMemories wrapped in non-fatal try-catch
- BUG-6: Dead `warmup_succeeded` variable removed (3 locations)
- BUG-8: Single try-catch split into 5 independent try-catches in uncaughtException handler

**MCP lib bugs:**
- BUG-001: Cross-encoder cache eviction (MAX_CACHE_ENTRIES=200)
- BUG-002: Archival error array cap (MAX_ERROR_LOG=100)
- BUG-003: co-activation.ts actual embedding lookup replacing empty Float32Array
- BUG-004: attention-decay.ts `calculateUsageScore()` signature fix
- BUG-007: archival-manager.ts `.unref()` on setInterval
- BUG-012: archival-manager.ts OR → AND logic fix

### Task 20: Shell [ ] → [[ ]] Completion
**Files Modified:**
- `test-validation.sh` (~20 instances)
- `test-validation-extended.sh` (~40 instances)

### Task 21: Scripts TS P0 Headers
**Files Modified:** 43 TypeScript files across `scripts/src/`
- All renamed from `CATEGORY: DESCRIPTION` to `MODULE: Title Case Name` format

### Task 22: MemoryRow Consolidation
**Files Modified:**
- `shared/types.ts` — canonical MemoryRow added (30+ fields superset)
- `mcp_server/lib/cognitive/tier-classifier.ts` — imports from canonical
- `mcp_server/lib/scoring/composite-scoring.ts` — imports from canonical
- `mcp_server/lib/providers/retry-manager.ts` — RetryMemoryRow extends MemoryRow

### Task 23: Duplicate Function Consolidation
**Files Modified:**
- `scripts/lib/semantic-summarizer.ts` — removed duplicate `cleanDescription()`, imports from canonical
- Cross-reference comments added to 6 files for intentionally different implementations

### Task 24: Missing Return Types
**Result:** All 625 exported functions already have return types. No changes needed.

### Task 25: Default Exports + Import Ordering
**Files Modified:**
- All `export default` blocks removed (retry-manager.ts was the last one)
- Import ordering fixed in 7 files with group comments and blank lines
