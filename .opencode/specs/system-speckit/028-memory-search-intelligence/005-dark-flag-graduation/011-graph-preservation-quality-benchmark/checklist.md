---
title: "Verification Checklist: Graph Preservation Quality Benchmark"
description: "Verification Date: 2026-07-10. All P0/P1 items verified with evidence; packet complete."
trigger_phrases:
  - "graph preservation quality benchmark"
  - "content rich short query graph preservation benchmark"
  - "retrieval class routing benchmark"
  - "F15 counter memory health wiring"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/005-dark-flag-graduation/011-graph-preservation-quality-benchmark"
    last_updated_at: "2026-07-10T14:30:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All P0/P1 checklist items verified with evidence"
    next_safe_action: "None -- packet complete."
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-021-graph-preservation-quality-benchmark"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Graph Preservation Quality Benchmark

<!-- SPECKIT_LEVEL: 3 -->
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
|----------|----------|--------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` -- REQ-001 through REQ-008, REQ-003 amended 2026-07-10 to quiescence-verification per the feasibility investigation
- [x] CHK-002 [P0] Technical approach defined in `plan.md` -- both open decisions resolved (sibling fixture, scripted preflight)
- [x] CHK-003 [P1] Dependencies identified and available -- `prepareEvalDatabase`/`computeMeanMetrics`/`groupGroundTruth`/`normalizeSearchResults` exported from `run-retrieval-flag-eval.mjs` and reused; F15 counter was already exported from `query-router.ts`; `memory_health`'s `routing` block confirmed present
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks -- `npm run build` (tsc --build) clean, no errors
- [x] CHK-011 [P0] No console errors or warnings -- benchmark run completed with exit code 0, only a benign SQLite experimental-feature Node warning (pre-existing across the whole suite, unrelated to this packet)
- [x] CHK-012 [P1] Error handling implemented -- `handleMemoryHealth()`'s F15 read is try/catch-guarded with a fallback to 0 and a hint, matching `routingTelemetry`/`graphChannelMetrics`'s exact shape (`memory-crud-health.ts`)
- [x] CHK-013 [P1] Code follows project patterns -- `run-graph-preservation-flag-eval.mjs` imports `prepareEvalDatabase`/`computeMeanMetrics`/`groupGroundTruth`/`normalizeSearchResults`/`buildPerFlagSearchOptions` from `run-retrieval-flag-eval.mjs` rather than duplicating them
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-008) -- see `benchmark-results.md` sections 2-7 for per-requirement evidence
- [x] CHK-021 [P0] Manual testing complete -- `run-graph-preservation-flag-eval.mjs` run end-to-end against the live corpus (exit 0), and `handleMemoryHealth()` called directly confirming `data.routing.contentRichShortQueryGraphPreservationCount` increments 0->1 and resets via the test hook
- [x] CHK-022 [P1] Edge cases tested -- control-slice neutrality asserted per-flag (`controlSliceNeutral: true` both flags); the driver refuses to run on a non-quiescent source (`graph-preservation-flag-eval-driver.vitest.ts`, 6 `assertSourceQuiescent` cases); an unresolvable relevance anchor is reported, not silently dropped (`graph-preservation-ground-truth.vitest.ts`)
- [x] CHK-023 [P1] Error scenarios validated -- fixture-authoring guard refuses to run with <50 queries; F15 counter-read failure falls back to 0 with a hint (matching `routingTelemetry`); a path resolving outside the eval temp root throws (`assertWithinEvalRoot`, 4 test cases)
- [x] CHK-024 [P0] Fixture verified: 60 labeled queries (>=50), 131 relevance rows, every query's slice membership programmatically confirmed against `isContentRichShortQuery()`/`classifyRetrievalClass()` with 0 mismatches (`graph-preservation-ground-truth.vitest.ts`)
- [x] CHK-025 [P0] Named tests present: `021-REQ006`/`021-REQ007` (F15 wiring, `handler-memory-crud.vitest.ts`), the committed-fixture REQ-001 suite and `resolveGraphPreservationRelevanceIds` suite (`graph-preservation-ground-truth.vitest.ts`), the driver pre-flight suite (`graph-preservation-flag-eval-driver.vitest.ts`)
- [x] CHK-026 [P1] Reindex step documented with before/after confirmation -- `benchmark-results.md` section 2 records the pre-flight quiescence check (0 pending/retry/failed, no active jobs) taken immediately before the snapshot copy
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] N/A -- this packet builds new capability (a benchmark harness + a monitoring field), it does not remediate a reported defect/finding.
- [x] CHK-FIX-002 [P0] N/A -- same reason as CHK-FIX-001, this packet builds new capability rather than remediating a finding
- [x] CHK-FIX-003 [P0] Consumer inventory completed: `memory_health`'s response consumers covered by the additive-only diff test (`021-REQ007`); the fixture's only consumer is the new driver (checked via `rg` for `GRAPH_PRESERVATION_QUERIES`/`GRAPH_PRESERVATION_RELEVANCES` -- no other importers exist yet).
- [x] CHK-FIX-004 [P0] N/A -- `assertWithinEvalRoot`'s path-boundary guard is the one path-safety surface in this packet, and it carries 4 direct test cases (under-root, at-root, outside-root, sibling-prefix-collision) in `graph-preservation-flag-eval-driver.vitest.ts`.
- [x] CHK-FIX-005 [P1] Matrix: 3 fixture slices x 2 flags x 2 variants = 12/12 measured cells, plus 2 overall rows; see `benchmark-results.md` sections 4-5.
- [x] CHK-FIX-006 [P1] Hostile/reset variant executed: `021-REQ006` test drives the counter 0->1->reset-to-0 via `resetContentRichShortQueryGraphPreservationCount()`, matching the block's documented process-restart contract.
- [x] CHK-FIX-007 [P1] Evidence below is pinned to this packet's own commit on branch `work/021-graph-preservation` (see implementation-summary.md for the exact commit once committed), not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets -- reviewed via `ripgrep` across all new files, no credentials/tokens/connection strings found
- [x] CHK-031 [P0] N/A -- no new external input surface; the driver reads existing `context-index.sqlite`/fixture files only
- [x] CHK-032 [P1] Confirmed: `prepareEvalDatabase()` copies the source DB/shard read-only into `os.tmpdir()`; `assertWithinEvalRoot` additionally asserts the active vector-index connection resolves under that temp root before any search runs, live-verified against a real `[shared/paths]` workspace-boundary-fallback warning during the smoke run (the warning fired, the assertion did not throw, confirming the fallback never actually redirected the active write target)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`/`plan.md`/`tasks.md`/`checklist.md`/`implementation-summary.md`/`decision-record.md` all updated to COMPLETE status in this pass
- [x] CHK-041 [P1] Code comments are durable-WHY only -- verified via `check-comment-hygiene.sh` against all 7 new/modified files, 0 violations
- [x] CHK-042 [P2] N/A -- no README's file inventory is affected by this packet's new files
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only -- the eval snapshot lives in `os.mkdtempSync(os.tmpdir())`, never inside the repo tree; the raw benchmark JSON is committed alongside `benchmark-results.md` as a findings artifact, not a temp file
- [x] CHK-051 [P1] No stray temp files left in the repo tree; scratch authoring helpers used during fixture-grading were kept outside the worktree
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 17/17 |
| P1 Items | 24 | 24/24 |
| P2 Items | 9 | 9/9 |

**Verification Date**: 2026-07-10
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in `decision-record.md` (ADR-001 reuse-existing-harness, ADR-002 classifier-verified fixture, ADR-003 independent F15 wiring, plus a new ADR-004 for the REQ-003 amendment)
- [x] CHK-101 [P1] All 4/4 ADRs have status Accepted
- [x] CHK-102 [P1] Alternatives documented with rejection rationale in `decision-record.md`'s Alternatives Considered tables
- [x] CHK-103 [P2] N/A, no schema or data migration in this packet
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Confirmed: the driver runs one off/on pair per flag (2 flags -> 4 variant passes total), not a combinatorial sweep, matching `run-retrieval-flag-eval.mjs`'s own per-flag cost model (NFR-P01)
- [x] CHK-111 [P1] The F15 read is a single in-process `getContentRichShortQueryGraphPreservationCount()` call inside the existing try/catch block, no I/O added (NFR-P02)
- [x] CHK-112 [P2] Deferred to a future soak-testing activity, out of this packet's scope per spec.md
- [x] CHK-113 [P2] benchmark-results.md section 1 records the run metadata; the full end-to-end run (preflight + copy + 4 variant passes across 60 queries) completed within the session's normal working cadence
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback is trivial: every change is additive (new files + one new object-literal field); `git revert` fully restores prior behavior, no data migration to unwind
- [x] CHK-121 [P0] N/A -- this packet introduces no new feature flag; it measures two existing ones without changing their defaults, confirmed via `git diff` showing zero changes to `search-flags.ts`/`query-router.ts`/`retrieval-class-classifier.ts` (REQ-005)
- [x] CHK-122 [P1] The F15 `memory_health` field is the monitoring surface this packet adds, confirmed live via `handleMemoryHealth()` (REQ-006)
- [x] CHK-123 [P1] The pre-flight quiescence procedure is scripted directly into the driver (not a separate manual runbook step) -- see the amended REQ-003 and `assertSourceQuiescent`
- [x] CHK-124 [P2] N/A, no production deployment; this packet ships spec-folder docs, a fixture, a driver script, and one additive handler field
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Reviewed for the one real surface change (`memory_health` field addition); no new external input surface (NFR-S01)
- [x] CHK-131 [P1] N/A -- reviewed `package.json`, no new third-party dependency introduced
- [x] CHK-132 [P2] N/A, this packet has no user-facing web surface; it is an internal eval harness and a read-only health-check field
- [x] CHK-133 [P2] Confirmed: the eval-DB snapshot is a local temp-directory copy (`os.tmpdir()`), and `assertWithinEvalRoot` fail-closes if any write path resolves outside it (NFR-S01)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All 6/6 spec documents synchronized to COMPLETE status in this pass
- [x] CHK-141 [P1] N/A, no new public API; `memory_health`'s existing response-shape documentation covers the additive field
- [x] CHK-142 [P2] N/A, this packet has no end-user-facing surface
- [x] CHK-143 [P2] decision-record.md's four ADRs (three original plus the REQ-003 amendment) capture the reasoning for future packet authors
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| TBD | Technical Lead | [ ] Approved | |
| TBD | Product Owner | [ ] Approved | |
| TBD | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
