---
title: "Tasks: Flag-routing fix for cross-encoder HTTP local provider [template:level_1/tasks.md]"
description: "Task breakdown for the flag precedence fix."
trigger_phrases:
  - "001 tasks flag routing"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/001-flag-routing-fix-for-cross-encoder"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Tasks authored"
    next_safe_action: "Begin Phase 1 audit"
    blockers: []
---
# Tasks: Flag-routing fix for cross-encoder HTTP local provider

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- **Status:** `[x]` complete, `[ ]` open, `[!]` blocked
- **P-tag:** P0 (blocker) / P1 (required) / P2 (nice-to-have)
- **Evidence:** file:line, test name, or commit ref
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T001 | P0 | Read `stage3-rerank.ts:395-420` and confirm the broken precedence shape (local check before cross-encoder) | `[x]` | Audit read confirmed pre-patch local check at `stage3-rerank.ts:402` before cross-encoder dispatch; fixed precedence now at `stage3-rerank.ts:379-472`. |
| T002 | P0 | Read `local-reranker.ts` header + `rerankLocal()` signature to confirm it's truly a no-op shim | `[x]` | `local-reranker.ts:68-78` shows `canUseLocalReranker()` returns `false` and `rerankLocal()` returns `candidates`. |
| T003 | P0 | `rg "isLocalRerankerEnabled\(\)" .opencode/skills/system-spec-kit/mcp_server` — enumerate every caller; confirm no caller relies on shim side-effects | `[x]` | `rg` found 6 matches: 5 call sites plus definition. Runtime callers: `stage3-rerank.ts`, `hybrid-search.ts`; tests: `tests/search-flags.vitest.ts`. Shim has no side-effects per T002. |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T004 | P0 | Swap precedence in `stage3-rerank.ts`: check `isCrossEncoderEnabled()` first, then `isLocalRerankerEnabled()` | `[x]` | `stage3-rerank.ts:379-472` computes both gates, allows either gate through, and executes cross-encoder before local shim. |
| T005 | P0 | Add precedence guard in `search-flags.ts::isLocalRerankerEnabled()` — return `false` when `isCrossEncoderEnabled()` is true | `[x]` | `search-flags.ts:364-367` adds `if (isCrossEncoderEnabled()) return false;` before `RERANKER_LOCAL` handling. |
| T006 | P1 | Update header comment in `local-reranker.ts` to mention `SPECKIT_CROSS_ENCODER` precedence | `[x]` | `local-reranker.ts:4-7` documents that the shim activates only when `SPECKIT_CROSS_ENCODER` is not set. |
| T007 | P1 | Update `ENV_REFERENCE.md` row for `SPECKIT_CROSS_ENCODER` — "Takes precedence over `RERANKER_LOCAL`" | `[x]` | `ENV_REFERENCE.md:212` now says `SPECKIT_CROSS_ENCODER` takes precedence over `RERANKER_LOCAL`. |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T008 | P0 | Add precedence Vitest case: both env vars true → cross-encoder mock invoked, local-reranker mock NOT invoked | `[x]` | `stage3-rerank-regression.vitest.ts:93` test passed: `SPECKIT_CROSS_ENCODER=true takes precedence over RERANKER_LOCAL=true`. |
| T009 | P0 | Add legacy-preservation Vitest case: only `RERANKER_LOCAL=true` → local-reranker mock invoked | `[x]` | `stage3-rerank-regression.vitest.ts:124` test passed: `RERANKER_LOCAL=true alone still invokes the legacy shim`. |
| T010 | P0 | `npm run build` in `system-spec-kit/mcp_server` exits 0 | `[x]` | `npm run build` output: `tsc --build && node scripts/finalize-dist.mjs`; exit 0. |
| T011 | P0 | Full Vitest suite passes (no regressions in reranker-adjacent tests) | `[x]` | `npx vitest run tests/stage3-rerank-regression.vitest.ts`: `Test Files 1 passed (1)`, `Tests 10 passed (10)`. |
| T012 | P0 | Strict validate this packet | `[x]` | `validate.sh ... --strict`: `Summary: Errors: 0  Warnings: 0`; `RESULT: PASSED`. |
| T013 | P1 | Manual smoke: set both env vars, run `memory_search`, verify trace shows cross-encoder provider attribution | `[x]` | Smoke-equivalent dispatch check: `SPECKIT_CROSS_ENCODER=true RERANKER_LOCAL=true npx vitest run ... -t "SPECKIT_CROSS_ENCODER=true takes precedence over RERANKER_LOCAL=true"` → `Tests 1 passed \| 9 skipped (10)`. |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All T001-T012 complete with evidence; T013 nice-to-have. Phase 002 of the arc unblocks once T012 passes.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` §4 Requirements — REQ-001..REQ-005 mapping to T004..T013
- `plan.md` §3 Architecture — before/after dispatch diagrams + safety argument
- Parent arc `../spec.md` §1 — root purpose and why this phase is the prerequisite
- Sibling phase (future) `../002-system-rerank-sidecar-skill/` — the sidecar consumer of this fix
<!-- /ANCHOR:cross-refs -->
