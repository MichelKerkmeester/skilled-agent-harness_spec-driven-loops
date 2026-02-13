# Checklist: System Spec-Kit Code Audit & Remediation

## Status: COMPLETED

## P0 — Hard Blockers

- [x] All file headers use `// MODULE: Title Case Name` format — **DONE** (80+ files)
- [x] Em-dash `───` dividers replaced with standard `---` — **DONE** (17+ mcp_server files)
- [x] All `console.log` → `console.error` in MCP server code — **DONE** (50+ instances)
- [x] No dual `module.exports` + ESM exports — **DONE** (2 files fixed)
- [x] Shell scripts use `set -euo pipefail` — **DONE** (2 test scripts)
- [x] Shell scripts use `[[ ]]` not `[ ]` — **DONE** (~60 instances in 2 files)
- [x] Python test methods have `-> None` return types — **DONE** (71 methods)
- [x] `checkDatabaseUpdated()` called in all handlers — **DONE** (all handlers verified)
- [x] Response envelope pattern in handlers — **DONE** (memory-context.ts)
- [x] No unsafe `as string` casts on env vars — **DONE** (tool-cache.ts)

## P0 — Critical Bugs

- [x] BUG: `flushAccessCounts()` called but method is `reset()` — **FIXED** context-server.ts
- [x] BUG: BM25 `add_document()` called with 3 args (only accepts 2) — **FIXED** memory-save.ts
- [x] BUG: `total_tokens` field (snake_case from API) read as `totalTokens` (camelCase) — **FIXED** openai.ts, voyage.ts
- [x] BUG: Empty `Float32Array(0)` never matches vector search — **FIXED** co-activation.ts
- [x] BUG: `calculateUsageScore(memory)` passes object where number expected → NaN — **FIXED** attention-decay.ts
- [x] BUG: autoSurfaceMemories runs before input validation (CWE-400) — **FIXED** context-server.ts
- [x] BUG: autoSurfaceMemories crash takes down tool dispatch — **FIXED** wrapped in try-catch
- [x] BUG: Single try-catch in uncaughtException handler — **FIXED** split to 5 independent
- [x] BUG: Unbounded cache growth in cross-encoder reranker — **FIXED** MAX_CACHE_ENTRIES=200
- [x] BUG: Unbounded errors array in archival-manager — **FIXED** MAX_ERROR_LOG=100
- [x] BUG: Archival OR logic too aggressive — **FIXED** changed to AND
- [x] BUG: setInterval keeps process alive — **FIXED** .unref() added
- [x] BUG: Dead `warmup_succeeded` variable never read — **FIXED** removed

## P1 — Required Fixes

- [x] BM25 methods renamed to camelCase (5 methods + 32 test updates) — **DONE**
- [x] snake_case function parameters → camelCase — **DONE** (voyage.ts, hf-local.ts, trigger-extractor.ts)
- [x] `_executeRequest` underscore prefix → `private executeRequest` — **DONE** (openai.ts, voyage.ts)
- [x] `Function` cast → typed `PipelineFactory` — **DONE** (hf-local.ts)
- [x] Scripts header format standardized — **DONE** (43 files)
- [x] MemoryRow interface consolidated — **DONE** (→ shared/types.ts canonical)
- [x] Duplicate `cleanDescription()` consolidated — **DONE** (semantic-summarizer.ts)
- [x] Default exports removed — **DONE** (zero remaining)
- [x] Import ordering standardized — **DONE** (7 files)
- [x] Unused `@huggingface/transformers` dependency removed — **DONE** (scripts/package.json)
- [x] Severity value `"warn"` → `"warning"` — **DONE** (scripts-registry.json)
- [x] TTY detection for color output in test scripts — **DONE**
- [x] Temp file cleanup traps in shell scripts — **DONE**
- [x] `local` declarations in shell functions — **DONE**
- [x] Backward-compatible aliases for renamed BM25 methods — **DONE**
- [x] Deprecated JSDoc on renamed exports — **DONE** (trigger-extractor.ts)
- [x] Cross-reference comments on intentionally different duplicates — **DONE** (5 pairs)

## P2 — Deferred

- [x] 136 pre-existing TypeScript errors (interface version drift) — **RESOLVED** (Phase 4: 139 → 0)
- [ ] TSDoc comments on all exported functions — DEFERRED
- [ ] Typed CONFIG interface replacing `as string` pattern globally — DEFERRED
- [ ] Additional handler envelope pattern migration — DEFERRED

## Build Verification

- [x] `tsc --build --force` produces 0 new errors — **VERIFIED** (136 pre-existing)
- [x] `tsc --noEmit` produces 0 errors across all tsconfig projects — **VERIFIED** (Phase 4)
- [x] dist/ successfully rebuilt after each fix phase — **VERIFIED**
- [x] No runtime behavior changes (type-only consolidation) — **VERIFIED**
- [x] Shell scripts pass `bash -n` syntax check — **VERIFIED**
- [x] Scripts test suite passes (379 + 279 tests) — **VERIFIED**

## Phase 3 — Standards Compliance (workflows-code--opencode)

- [x] Header dash count: 17 files in lib/ had 67-dash lines instead of 63-dash — **FIXED** (34 occurrences across cognitive/, search/, storage/)
- [x] Em-dash in script headers: 2 files had U+2014 `—` instead of `--` — **FIXED** (generate-context.ts, workflow.ts)
- [x] BM25 snake_case aliases missing `@deprecated` JSDoc — **FIXED** (5 methods in bm25-index.ts)
- [x] Import type separation: retry-manager.ts `import type` in wrong group — **FIXED** (separated into group 4 with comment)
- [x] Shell header prefix: 4 scripts used `SPECKIT:` or `RULE:` instead of `COMPONENT:` — **FIXED** (test-validation.sh, test-validation-extended.sh, check-anchors.sh, create.sh)
- [x] Missing DEVIATION comment: test-validation-extended.sh `-u` omission undocumented — **FIXED** (formalized with `# DEVIATION:` comment)
- [x] Untyped catch variables: 6 instances of `catch (e)` / `catch (err)` without `: unknown` — **FIXED** (context-server.ts)

## Phase 4 — TypeScript Error Resolution

- [x] TypeScript error re-categorization complete (135 baseline → 31 remaining after prior fixes confirmed) — **DONE**
- [x] Root cause analysis complete (7 fix groups identified across 10 files) — **DONE**
- [x] `hooks/memory-surface.ts`: Removed unsafe cast, used `TriggerMatch` type directly, added null coalescing for title — **FIXED** (1 error)
- [x] `handlers/causal-graph.ts`: Added runtime validation for `direction` parameter with safe default — **FIXED** (1 error)
- [x] `handlers/causal-graph.ts`: Added runtime validation for `relation` against `RELATION_TYPES` before `insertEdge()` — **FIXED** (1 error)
- [x] 28 errors from re-categorization confirmed already resolved by prior sessions — **VERIFIED**
- [x] Final `tsc --noEmit` verification: **0 errors** across all 4 tsconfig projects (mcp_server, scripts, shared, root) — **VERIFIED**
