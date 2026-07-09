---
title: "Implementation Summary: Orphan Sweep Time Budget & Scoped-Scan Discovery-Gate Parity"
description: "Status IMPLEMENTED. F1 (orphan-sweep time budget + marker-refresh cadence) and F2 (scoped-scan discovery-gate parity) are both shipped in handlers/memory-index.ts and verified against a real SQLite DB with a DELETE-heavy synthetic orphan backlog. validate.sh --strict PASSED."
trigger_phrases:
  - "orphan sweep time budget"
  - "maintenance marker refresh cadence"
  - "scoped scan discovery gate parity"
  - "drift marker specDocFiles gating"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/012-orphan-sweep-scoped-scan-safety"
    last_updated_at: "2026-07-09T17:40:46Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "F1+F2 implemented+tested against real SQLite DB; validate.sh --strict PASSED"
    next_safe_action: "Packet complete; no further action required"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/orphan-sweep-time-budget-and-refresh.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/memory-index-scoped-scan-gating.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-012-orphan-sweep-scoped-scan-safety"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
answered_questions:
  - "F1 time budget = 45,000ms default, refresh cadence = 20,000ms default, both env-overridable."
  - "F2 chose Option A (direct predicate import), not Option B (shared helper) -- keeps findSpecDocuments untouched."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-orphan-sweep-scoped-scan-safety |
| **Status** | IMPLEMENTED |
| **Completed** | 2026-07-09 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Both findings from plan.md are shipped in one file, in two disjoint, additive code regions.

### F1 -- orphan-sweep time budget + marker-refresh cadence (`handlers/memory-index.ts`)

Inside `runGlobalOrphanSweep()`'s loop:
- A `loopStartedAt` timestamp captured before the loop; each iteration (after a page's scan+delete work,
  before the next page) checks elapsed time against a wall-clock budget. On budget-exceeded, the loop
  `break`s with `nextCursor` left at whatever the just-completed page set it to (a real, resumable value) --
  distinct from the pre-existing completion-exit branch, which explicitly nulls the cursor.
- A `lastRefreshAt` timestamp, checked each iteration against a refresh-cadence interval; when exceeded,
  `ctx.onPhase?.('orphan-sweep')` is re-fired (the same callback `timedPhase` already calls once at phase
  entry) and `lastRefreshAt` resets. Rate-gated, not called every page.
- Both intervals are read via a `parsePositiveIntEnv(name, fallback)` helper (the same pattern already
  duplicated in four other files under `mcp_server/lib/`: `retry-manager.ts`, `job-queue.ts`,
  `retry-budget.ts`, `content-router.ts`), with defaults **45,000ms** (time budget) and **20,000ms**
  (refresh cadence, matching the maintenance marker's own passive refresh interval), overridable via
  `SPECKIT_ORPHAN_SWEEP_TIME_BUDGET_MS`/`SPECKIT_ORPHAN_SWEEP_REFRESH_CADENCE_MS`. The override exists so a
  test can shrink both intervals to make a DELETE-heavy real backlog cross the cadence fast and
  deterministically, without needing a production-scale (tens-of-seconds) backlog inside a unit test --
  production behavior is unaffected unless the env vars are explicitly set.
- `sweepOrphanIndexRows()`, the cursor-persistence functions, and `ORPHAN_SWEEP_LIMIT`/`ORPHAN_SWEEP_MAX_PAGES`
  are all unchanged, exactly as scoped.

### F2 -- scoped-scan discovery-gate parity (`handlers/memory-index.ts`)

Two new private helpers, `isEligibleScopedSpecDocumentPath(filePath)` and
`isEligibleScopedGraphMetadataPath(filePath)`, each wrapping `fs.existsSync` plus the same predicates the
full-tree walker (`findSpecDocuments`, `memory-index-discovery.ts`) already calls --
`SPEC_DOCUMENT_FILENAMES`/`matchesSpecDocumentPath` for spec docs, `isGraphMetadataPath` for graph metadata
-- imported directly from `lib/config/spec-doc-paths.ts` (**Option A**: minimal-diff, direct import, not a
shared helper factored into `memory-index-discovery.ts`; see Key Decisions). Both fail closed (return
`false`) inside a `try`/`catch`, per NFR-R02. The scoped-scan branches of `specDocFiles`/`graphMetadataFiles`
construction (`memory-index.ts:598-607`) now filter through these helpers instead of `fs.existsSync` alone /
an unconditional empty assignment. `findSpecDocuments`/`memory-index-discovery.ts` received **zero edits**.

`runIndexScan` (previously module-private) is now exported, comment-documented as test-only: it is the
seam plan.md's own testing strategy names for driving `runGlobalOrphanSweep()`/the scoped-scan gating with a
spy in `ctx`, without standing up the full background job-queue/maintenance-marker plumbing
`handleMemoryIndexScan`'s `background: true` path uses.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/handlers/memory-index.ts` | Modified | F1 (time budget + refresh cadence) and F2 (scoped-scan gating) both shipped here; `runIndexScan` exported for tests |
| `mcp_server/tests/orphan-sweep-time-budget-and-refresh.vitest.ts` | Created | F1 real-DB integration tests (REQ-001, REQ-002, REQ-005) |
| `mcp_server/tests/memory-index-scoped-scan-gating.vitest.ts` | Created | F2 mocked-DB gating tests (REQ-003, REQ-004, REQ-006, SC-004 spot-check) |
| spec.md / plan.md / tasks.md / checklist.md | Updated | Status flipped to Implemented/complete, evidence attached per item |

No other file was touched. `memory-index-discovery.ts`, `spec-doc-paths.ts`, `maintenance-marker.ts`,
`incremental-index.ts` -- all read-only dependencies -- are byte-identical to before this packet.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented directly against the live tree (both findings confirmed at the cited file:line before editing),
then verified with two new vitest suites and the full pre-existing adjacent-consumer suite, then built
(`tsc --build && finalize-dist.mjs`) and linted clean. No `git commit` was made (per the task's constraint);
all changes are in the working tree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| F1 time budget = 45,000ms, refresh cadence = 20,000ms, both env-overridable (`SPECKIT_ORPHAN_SWEEP_TIME_BUDGET_MS`/`SPECKIT_ORPHAN_SWEEP_REFRESH_CADENCE_MS`) | 45s leaves 2x headroom under the 90s `MAINTENANCE_MARKER_REFRESH_BEFORE_MS` bound while still letting one invocation clear a sizeable backlog, matching the intent behind the 1000-page cap; 20s matches the marker's own existing passive-refresh interval (`MAINTENANCE_MARKER_REFRESH_MS`), a natural, already-precedented value in the same file. Env-overridability follows an existing 4x-duplicated codebase pattern (`parsePositiveIntEnv`) and is what makes REQ-002's DELETE-heavy real-function test (T007) tractable inside vitest's default 30s test timeout, without changing production behavior when the vars are unset. |
| Reuse `ctx.onPhase` for the mid-loop refresh instead of threading a new callback | `runGlobalOrphanSweep()` is already a closure inside `runIndexScan(args, ctx)`, so `ctx.onPhase` is already reachable; for background scans it already resolves to `maintenance.refresh()`, so repeating the same call needs no new plumbing. |
| F2: Option A (direct predicate import) over Option B (shared helper factored into `memory-index-discovery.ts`) | Both satisfy every REQ/SC per plan.md. Option B would additionally refactor `findSpecDocuments`'s own working, already-tested per-entry gate loop to call the same shared helper -- correct in principle, but it touches code SC-004 explicitly protects (byte-identical full-tree output) for no requirement-level gain. Option A keeps the diff to two new, wholly-additive private functions plus the two construction-site edits, with zero risk to the tree-walker. |
| Export `runIndexScan` (test-only) rather than testing through the mocked `handleMemoryIndexScan({background:true})` path | plan.md's own Phase 2 task (T007) and Affected-Surfaces table name this exact seam ("a spy on the `onPhase` callback passed into `runIndexScan`'s `ctx`"). The background-job path wires `ctx.onPhase` to `maintenance.refresh()` + `setJobPhase`, which is real but adds an unrelated job-queue dependency; the direct export lets the test spy on `onPhase` with zero extra scaffolding while still exercising the real `runGlobalOrphanSweep()` closure. |
| DELETE-heavy F1 tests mock only scan-lease/checkpoint/embedding-profile scaffolding, leaving `incremental-index`, `vector-index`, `causal-edges`, `history` all real | REQ-002's corrected acceptance criteria explicitly rejects a scan-only mirror harness and requires the real per-row DELETE cascade (`vectorIndex.deleteMemory` + `causalEdges.deleteEdgesForMemory` + `recordHistory`) to actually run. The four mocked concerns are orthogonal to the orphan-sweep path (none of them are touched by `runGlobalOrphanSweep`) and are the same four mocks every pre-existing test of this handler already applies -- there is no precedent anywhere in this codebase for wiring `core/db-state`'s real lease DI in a unit test, and doing so was judged out of proportion to this packet's two-region diff. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `tsc --noEmit --composite false -p tsconfig.json` (typecheck) | CONFIRMED PASS, clean, zero output |
| `npm run build` (`tsc --build && finalize-dist.mjs`) | CONFIRMED PASS, clean, zero output |
| `eslint handlers/memory-index.ts` + both new test files | CONFIRMED PASS, clean, zero output |
| `tests/orphan-sweep-time-budget-and-refresh.vitest.ts` (F1, real DB) | CONFIRMED PASS, 4/4 tests, ~28s |
| `tests/memory-index-scoped-scan-gating.vitest.ts` (F2, mocked DB) | CONFIRMED PASS, 5/5 tests, <1s |
| Adjacent-consumer regression sweep (11 pre-existing files: `orphan-sweep-corpus-repair`, `memory-drift-healing`, `handler-memory-index{,-needs-rebuild,-scan-jobs,-async-scan,-cooldown}`, `launcher-stop-hook-orphan-sweep`, `orphan-sweeper-ipc-preserve`, plus the 2 new files) | CONFIRMED PASS, 51 passed / 28 intentionally-skipped (fixture-gated), 0 failed |
| Full monorepo suite (682 files, `vitest run`, `fileParallelism: false`) | PARTIAL -- see Known Limitations. A pre-change baseline run and a post-change run were each attempted; both covered several hundred files before being time-boxed out (this repo's serial suite includes individual files that alone take 100+ seconds, e.g. `progressive-validation.vitest.ts`, and the shared machine had other concurrent sessions' vitest runs competing for CPU). Every failure observed in the post-change partial run was cross-checked against either (a) the pre-change baseline log (verbatim-identical failure, same test names) or (b) a file this packet never touched, confirming each is pre-existing and unrelated -- not independently re-verified against a from-scratch clean-tree baseline for the unreached remainder. |
| `bash validate.sh --strict 012-orphan-sweep-scoped-scan-safety` | CONFIRMED PASS -- `Errors: 0`, `Warnings: 0`, `RESULT: PASSED`, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Full 682-file monorepo suite not exhaustively re-run to completion post-change.** This repo's vitest
   suite runs all files serially (`fileParallelism: false`) and includes at least one file
   (`progressive-validation.vitest.ts`) that alone takes ~110s; the shared execution environment also had
   other concurrent sessions' vitest processes competing for CPU during this work, further slowing wall-clock
   progress. What IS confirmed: (a) every test file that imports or exercises
   `handlers/memory-index.ts`/its direct consumers passes cleanly (11 files, 79 tests, 0 failures); (b)
   `tsc`/`eslint`/`npm run build` are all clean; (c) a partial pre-change baseline and a partial post-change
   run each covered several hundred files, and every failure in both was either byte-identical between the
   two runs or in a subsystem this packet's diff never touches (e.g. `db-state-graph-reinit.vitest.ts`,
   `embedder-reindex.vitest.ts`, `incremental-index-move-reconcile.vitest.ts` -- the latter fails on
   `no such column: anchor_id` because `incremental-index.ts` was already dirty with an unrelated, uncommitted
   change from a different concurrent session before this packet's work began, confirmed via `git status`).
   What is NOT confirmed: the exact pass/fail delta for the ~150-250 files neither partial run reached (both
   runs together appear to have covered most, but not verifiably all, of the 682 files, and file ordering
   was not strictly deterministic between the two runs, so a residual gap cannot be ruled out with certainty).
2. **`memory-index.js`'s modularization line-count check (`modularization.vitest.ts`) was already failing
   before this packet**, at 1472-1473 lines against an 810-line documented threshold (comment: "actual: 795",
   itself stale). This and 6 sibling module line-count checks are PRE-EXISTING failures (confirmed identical
   in the pre-change baseline), not introduced by this packet. This packet's own addition (~55 net lines to
   `memory-index.ts`) makes an already-failing check's margin larger, not newly-failing -- out of this
   packet's scope to fix (SCOPE LOCK; the threshold table itself needs a separate remediation pass).
3. **CHK-065's "no gap exceeds the cadence interval" is enforced structurally, not independently
   timestamp-measured in the test.** The rate-gate condition (`now - lastRefreshAt >= refreshCadenceMs`) makes
   a violation structurally impossible by construction; the test confirms the callback fires more than once
   and stays well below a per-page 1:1 ratio, but does not separately assert on captured wall-clock gaps
   between consecutive `onPhase` calls. INFERRED safe from the code structure, not independently measured.
4. **F3-F16 from the same review round remain explicitly out of scope**, tracked separately per spec.md's
   Out of Scope section.
<!-- /ANCHOR:limitations -->
