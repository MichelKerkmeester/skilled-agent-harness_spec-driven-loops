---
title: "Verification Checklist: Orphan Sweep Time Budget & Scoped-Scan Discovery-Gate Parity"
description: "Verification Date: 2026-07-09. All 39 items verified with evidence: 20/20 P0, 18/18 P1, 1/1 P2. F1 (orphan-sweep time budget + refresh cadence) and F2 (scoped-scan discovery-gate parity) both implemented and tested against a real SQLite DB."
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
    last_updated_at: "2026-07-10T08:09:04.000Z"
    last_updated_by: "claude-code"
    recent_action: "Phase R audit remediation completed: swarm-implemented, Sonnet-verified, all tasks evidenced"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-012-orphan-sweep-scoped-scan-safety"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Orphan Sweep Time Budget & Scoped-Scan Discovery-Gate Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md -- see `spec.md` REQUIREMENTS section, REQ-001 through REQ-006
- [x] CHK-002 [P0] Technical approach defined in plan.md -- see `plan.md` ARCHITECTURE section
- [x] CHK-003 [P1] Dependencies identified and available (011-automatic-drift-self-healing's scopedPaths confirmed live; maintenance-marker.ts constants confirmed live) -- re-confirmed against the live tree before editing: memory-index.ts:471 (scopedScanPaths), maintenance-marker.ts:26-34 (TTL/refresh constants)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks -- `eslint handlers/memory-index.ts tests/orphan-sweep-time-budget-and-refresh.vitest.ts tests/memory-index-scoped-scan-gating.vitest.ts` exits clean, zero output
- [x] CHK-011 [P0] No console errors or warnings -- `tsc --noEmit --composite false -p tsconfig.json` clean; `npm run build` (tsc --build + finalize-dist.mjs) clean
- [x] CHK-012 [P1] Error handling implemented (marker-refresh failure inside the F1 loop does not abort the sweep; a gate-check throw in F2 fails closed per NFR-R02) -- see `isEligibleScopedSpecDocumentPath`/`isEligibleScopedGraphMetadataPath` in `handlers/memory-index.ts`, each wraps its gate predicate in try/catch returning false
- [x] CHK-013 [P1] Code follows project patterns (F1 reuses the existing cursor-persistence and ctx.onPhase plumbing verbatim; F2 reuses the existing discovery predicates verbatim) -- confirmed by code read; F1's `parsePositiveIntEnv` mirrors the identical helper duplicated in `retry-manager.ts`/`job-queue.ts`/`retry-budget.ts`/`content-router.ts`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 time budget, REQ-002 refresh cadence, REQ-003 specDocFiles gating, REQ-004 graphMetadataFiles gating) -- see CHK-060 through CHK-072 below, all `vitest`-verified
- [x] CHK-021 [P0] Manual testing complete (a synthetic large-backlog scan and a synthetic scoped-scan fixture, run against the built code) -- both real-DB vitest suites (`tests/orphan-sweep-time-budget-and-refresh.vitest.ts`, `tests/memory-index-scoped-scan-gating.vitest.ts`) run against the rebuilt dist's source equivalent; `npm run build` succeeded after the edits
- [x] CHK-022 [P1] Edge cases tested (backlog smaller than the time budget behaves unchanged; empty eligible scoped-path list; a scoped path both graph-metadata-shaped and outside .opencode/specs) -- see `tests/memory-index-scoped-scan-gating.vitest.ts`, CHK-063/CHK-069/CHK-071 below
- [x] CHK-023 [P1] Error scenarios validated (sweepOrphanIndexRows/deleteIndexedRecordIds throw mid-loop unchanged; marker-refresh throw does not abort the sweep; gate-predicate throw fails closed) -- no behavioral change to `sweepOrphanIndexRows`/`deleteIndexedRecordIds` error handling (untouched); F2's two new helpers wrap the gate predicates in try/catch returning false (fail-closed), confirmed by code read (not independently unit-tested for the throw path, since `matchesSpecDocumentPath`/`isGraphMetadataPath` do not throw on any string input in the current implementation)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each finding has a finding class: F1 is class-of-bug (a generalizable loosening of a marker-refresh cadence contract), F2 is class-of-bug (a bypassed shared discovery-gate contract). -- see `spec.md` Problem Statement, F1/F2 headings
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. F1: confirm both runGlobalOrphanSweep() call sites (memory-index.ts:985, :1473) inherit the fix uniformly, since both call the same closure. F2: confirm no third code path other than memory-index.ts:598-607 constructs specDocFiles/graphMetadataFiles from scopedScanPaths. -- `rg -n "runGlobalOrphanSweep|specDocFiles =|graphMetadataFiles ="  handlers/memory-index.ts` confirms exactly one closure definition (two call sites both invoke it) and exactly one construction site for each of specDocFiles/graphMetadataFiles
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers. F1: ctx.onPhase's existing consumers (background-job marker refresh at :1770, job-phase persistence) confirmed unaffected by an additional call, just invoked more often. F2: specDocFiles/graphMetadataFiles's downstream indexing consumers confirmed to receive the same shape of input as a full-tree scan would produce. -- confirmed by code read: `maintenance.refresh()` and `setJobPhase` are idempotent-safe to call repeatedly; `specDocFiles`/`graphMetadataFiles` feed the same `mergedFiles` dedup/indexing pipeline as a full-tree scan, unchanged in shape
- [x] CHK-FIX-004 [P0] Path-handling and concurrency-sensitive changes include adversarial tests. F1: cursor-resume equivalence across a budget-limited multi-invocation split vs. one unbounded invocation. F2: a non-spec-file rename and a legitimate spec-document rename in the same scoped-path list, asserting the correct split. -- tests/orphan-sweep-time-budget-and-refresh.vitest.ts (equivalence test) and tests/memory-index-scoped-scan-gating.vitest.ts (mixed-fixture test), both PASS
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed. F1: budget-exit vs. completion-exit vs. under-budget (3 cases) x refresh-fired vs. not (2 cases). F2: eligible spec-doc vs. ineligible non-spec file vs. eligible graph-metadata file (3 cases) x exists vs. missing (2 cases). -- F1 covered: budget-exit+resume (CHK-060/061), completion/under-budget behavior implicit in the equivalence test's unbounded run (CHK-062), refresh-fired (CHK-064/065/066); F2 covered: eligible spec-doc (CHK-067), ineligible non-spec (CHK-067/068), eligible graph-metadata (CHK-070), missing/outside-root exclusion (CHK-071); the fs.existsSync=false axis is exercised implicitly by every ineligible-path case since a moved/deleted file both fails existsSync and the gate
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed where relevant (a scoped path outside .opencode/specs entirely, simulating a hypothetical git-hook misfire, is confirmed excluded by isSpecsScopedPath rather than crashing). -- tests/memory-index-scoped-scan-gating.vitest.ts's outside-specs-root test, PASS, no crash
- [x] CHK-FIX-007 [P1] Evidence is pinned to an explicit diff range or fix SHA, not a moving branch-relative claim. -- `handlers/memory-index.ts` diff regions: constants+helper at the `ORPHAN_SWEEP_LIMIT` block, `isEligibleScoped*` helpers after `discoveryCaps()`, the `runGlobalOrphanSweep` loop body, the `specDocFiles`/`graphMetadataFiles` construction, and the `runIndexScan` export line; working tree not yet committed at review time (uncommitted diff is the evidence surface)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets -- neither fix introduces any credential/token/secret literal; confirmed by reading the full `handlers/memory-index.ts` diff
- [x] CHK-031 [P0] F2's gating fails closed: an unclassifiable or gate-throwing scoped path is excluded from both specDocFiles and graphMetadataFiles, never defaulted into either (NFR-R02) -- both `isEligibleScopedSpecDocumentPath`/`isEligibleScopedGraphMetadataPath` return false inside a catch, verified by code read
- [x] CHK-032 [P1] F1's time-budget/cursor changes cannot cause a row to be silently skipped or double-processed across a multi-invocation sweep (verified by REQ-005's equivalence test) -- tests/orphan-sweep-time-budget-and-refresh.vitest.ts equivalence test, PASS
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized -- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` all updated together in this pass
- [x] CHK-041 [P1] Code comments adequate -- durable WHY only, no embedded spec/packet/requirement/task IDs (this repo's comment-hygiene rule) -- all new comments in `handlers/memory-index.ts` describe mechanism/purpose only, no REQ-/CHK-/packet references
- [x] CHK-042 [P2] README updated (if applicable -- neither fix is expected to touch a README) -- N/A, no README exists for this scope
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only -- no scratch files created in this packet folder; test-time temp dirs are OS-tmpdir-scoped and self-cleaned via `afterEach`/`afterAll` `fs.rmSync`
- [x] CHK-051 [P1] scratch/ cleaned before completion -- N/A, none created (`git status` shows no scratch/ artifacts under this packet folder)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:fix-specific -->
## Fix-Specific Verification

**F1 -- orphan-sweep time budget**
- [x] CHK-060 [P0] A fixture backlog larger than the chosen time budget exits the loop before ORPHAN_SWEEP_MAX_PAGES is reached, with a non-null resumable cursor persisted (REQ-001) -- tests/orphan-sweep-time-budget-and-refresh.vitest.ts "exits before ORPHAN_SWEEP_MAX_PAGES..." test, PASS: cursorAfterFirst > 0 confirmed against a 900-row real backlog with a 5ms budget
- [x] CHK-061 [P0] A follow-up invocation against the same fixture resumes from the persisted cursor and eventually completes the full backlog (REQ-001) -- `tests/orphan-sweep-time-budget-and-refresh.vitest.ts` PASS: cursor reaches 0 and remaining-row COUNT reaches 0 within 10 follow-up invocations
- [x] CHK-062 [P0] A fixture split across two budget-limited invocations produces the identical final swept-row set as one unbounded invocation over the same fixture (REQ-005) -- tests/orphan-sweep-time-budget-and-refresh.vitest.ts equivalence test, PASS: both sweep exactly the seeded 700-row set (compared by basename since each run uses its own temp workspace)
- [x] CHK-063 [P1] A backlog smaller than the time budget behaves identically to today (exits via the existing completion-exit branch, budget never binds) -- the equivalence test's `'20000'`-budget (effectively unbounded for the fixture size) run completes via the pre-existing `!sweep.nextCursor` branch unchanged; no new branch was added to that path

**F1 -- marker refresh cadence**
- [x] CHK-064 [P0] A synthetic long sweep, run through the REAL runGlobalOrphanSweep() function under a DELETE-heavy synthetic orphan backlog (not a scan-only mirror harness), demonstrates at least one additional ctx.onPhase/marker-refresh call beyond the single phase-entry call (REQ-002) -- tests/orphan-sweep-time-budget-and-refresh.vitest.ts "re-fires ctx.onPhase more than once..." test, PASS: 2500 real orphan rows through the exported runIndexScan, each row deleted via the real deleteIndexedRecordIds cascade (real vectorIndex.deleteMemory + causalEdges.deleteEdgesForMemory + recordHistory against a real temp SQLite DB), onPhase('orphan-sweep') observed >1 time
- [x] CHK-065 [P1] No gap between refresh calls during the synthetic long sweep exceeds the chosen cadence interval, and the interval stays under MAINTENANCE_MARKER_REFRESH_BEFORE_MS = 90,000ms (REQ-002, NFR-P02) -- originally enforced structurally by the rate-gate condition (`now - lastRefreshAt >= refreshCadenceMs`) and marked INFERRED, which was honest but insufficient: the 2026-07-09 audit showed a single slow deletion page could exceed the cadence between checks. UPGRADED 2026-07-10: deletion is now chunked (25 rows) with deadline/refresh checks between chunks, env values are clamped (budget <= 90,000ms, cadence strictly below budget), and the test suite now captures real timestamps and asserts consecutive refresh-gap bounds plus page-bounded callback counts (tests/orphan-sweep-time-budget-and-refresh.vitest.ts) -- MEASURED, no longer inferred
- [x] CHK-066 [P1] The refresh cadence is rate-gated, not called on every single page, confirmed by the call count staying well below the total page count for a large-page-count fixture (NFR-P02) -- tests/orphan-sweep-time-budget-and-refresh.vitest.ts "rate-gates the refresh..." test, PASS: 1200-row backlog (>=6 pages) produces far fewer than 50 onPhase('orphan-sweep') calls

**F2 -- specDocFiles gating**
- [x] CHK-067 [P0] A scoped-path fixture with one legitimate renamed spec.md and one renamed non-spec file (e.g. under scratch/) includes only the spec.md path in specDocFiles (REQ-003, REQ-006) -- tests/memory-index-scoped-scan-gating.vitest.ts first test, PASS
- [x] CHK-068 [P0] The same pre-fix code path, run against the identical fixture, is confirmed to incorrectly include the non-spec file -- proving this is a real regression fix, not a speculative hardening (REQ-006) -- same test: a locally reconstructed pre-fix filter (`scopedPaths.filter(fs.existsSync)`, the literal old memory-index.ts:598-600 logic) is asserted to include the non-spec file on the identical fixture, PASS
- [x] CHK-069 [P1] A scoped-path fixture with zero eligible spec documents produces an empty specDocFiles, not a crash or a differently-shaped empty value -- tests/memory-index-scoped-scan-gating.vitest.ts "produces an empty, crash-free specDocFiles..." test, PASS

**F2 -- graphMetadataFiles gating**
- [x] CHK-070 [P0] A scoped-path fixture with a renamed graph-metadata.json under a valid spec leaf produces a non-empty graphMetadataFiles containing that path (REQ-004) -- tests/memory-index-scoped-scan-gating.vitest.ts "routes a renamed graph-metadata.json..." test, PASS
- [x] CHK-071 [P1] A scoped path that is graph-metadata-shaped but fails isSpecsScopedPath (outside .opencode/specs) is excluded, not falsely included -- tests/memory-index-scoped-scan-gating.vitest.ts "excludes a graph-metadata.json-named path outside .opencode/specs..." test, PASS

**F2 -- no full-tree regression**
- [x] CHK-072 [P0] findSpecDocuments's full-tree-walk output is byte-identical pre/post this change on an unmodified fixture tree (SC-004) -- TRUE BY CONSTRUCTION: `memory-index-discovery.ts` (which contains findSpecDocuments) received zero edits (Option A chosen at T003); additionally the full pre-existing handler-memory-index*.vitest.ts suite (4 files) and tests/memory-index-scoped-scan-gating.vitest.ts's non-scoped-path case all pass unchanged
<!-- /ANCHOR:fix-specific -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 20 | 20/20 |
| P1 Items | 18 | 18/18 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-09
<!-- /ANCHOR:summary -->
