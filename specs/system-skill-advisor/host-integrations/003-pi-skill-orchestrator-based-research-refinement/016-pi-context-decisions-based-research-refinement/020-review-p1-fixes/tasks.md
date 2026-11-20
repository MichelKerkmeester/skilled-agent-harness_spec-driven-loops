---
title: "Tasks: Phase 20: review-p1-fixes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "review p1 fixes tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 20: review-p1-fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`R` is `.skilled/skills/system-skill-advisor/runtime`. `V` is `npx vitest run` run from `R`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Open the worktree on the existing branch `worktrees/480-ollama-lane-honest-and-closeout` and bring it to main. Verify: `git -C <worktree> log -1 --format=%h` prints main's head. Evidence: Worktree 480 reopened on its branch and fast-forwarded; HEAD matched main `1653734af7d` before commit.
- [x] T002 Record the baseline of the three suites (`R/tests`). Verify: `V tests/skill-graph/refresh-in-background.vitest.ts tests/scorer/semantic-shadow-cosine.vitest.ts tests/handlers/advisor-status.vitest.ts` prints its pass count. Evidence: 3 files, 46 passed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add a test that indexes a second skill while the first refresh pass is embedding and asserts full coverage after the run (`R/tests/skill-graph/refresh-in-background.vitest.ts`). Verify: it fails before T004. Evidence: Failed on the old source: 2 skills, 1 current.
- [x] T004 Add a request flag and drain loop to `refreshEmbeddingsInBackground` (`R/lib/skill-graph/skill-graph-db.ts`). Verify: `V tests/skill-graph/refresh-in-background.vitest.ts` passes. Evidence: `refresh-in-background.vitest.ts` 7 passed.
- [x] T005 Add a test that scores with no read-write handle open and asserts none is open after (`R/tests/scorer/semantic-shadow-cosine.vitest.ts`). Verify: it fails before T006. Evidence: Failed on the old source: `readonly` false.
- [x] T006 Read coverage through `getDbReadOnly()` and fail closed on null (`R/lib/scorer/lanes/semantic-shadow.ts`). Verify: `V tests/scorer/semantic-shadow-cosine.vitest.ts` passes. Evidence: `semantic-shadow-cosine.vitest.ts` 8 passed.
- [x] T007 Change the status test to expect `incomplete_skill_vectors` and `laneEnabled: false` on incomplete coverage (`R/tests/handlers/advisor-status.vitest.ts`). Verify: it fails before T008. Evidence: Failed on the old source: `laneEnabled` true.
- [x] T008 Add the `incomplete_skill_vectors` branch to the status reason chain (`R/handlers/advisor-status.ts`). Verify: `V tests/handlers/advisor-status.vitest.ts` passes. Evidence: `advisor-status.vitest.ts` 35 passed.
- [x] T009 [P] Update the two catalog pages (`.skilled/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/background-vector-refresh.md`, `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-status.md`). Verify: `rg -n "one more pass|incomplete_skill_vectors"` prints a line in each. Evidence: `background-vector-refresh.md:22` and `advisor-status.md:31`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the three suites. Verify: `V` on the three files prints no failure. Evidence: 3 files, 50 passed.
- [x] T011 Run the full runtime suite after `node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted`. Verify: `V` reports no failure absent from the baseline. Evidence: Exit 0 after build and scan: 195 files, 2559 passed, 8 skipped.
- [x] T012 Type-check the runtime. Verify: `npx tsc --noEmit -p R` exits 0. Evidence: `npm run typecheck` exit 0, 0 errors.
- [x] T013 Validate the packet. Verify: `validate.sh <020> --strict` prints `RESULT: PASSED`. Evidence: `RESULT: PASSED`, 0 errors, 0 warnings.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Each new test was seen failing before its fix
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Review**: `../019-ollama-lane-honest-and-closeout/review/review-report.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

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

- [x] CHK-001 [P0] Requirements documented in spec.md Evidence: spec.md REQ-001 to REQ-005.
- [x] CHK-002 [P0] Technical approach defined in plan.md Evidence: plan.md sections 3 and FIX ADDENDUM.
- [x] CHK-003 [P1] Baseline of the three suites recorded (T002) Evidence: T002: 46 passed.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `npx tsc --noEmit` in the runtime exits 0 Evidence: `npm run typecheck` exit 0.
- [x] CHK-011 [P0] The three suites print no failure Evidence: 50 passed.
- [x] CHK-012 [P1] A refresh pass that throws clears the in-flight slot Evidence: The throw-path test passes; the slot clears in the run's `finally`.
- [x] CHK-013 [P1] The drain loop follows the watcher's `drainPending` shape Evidence: One slot promise plus a drained pending marker, as `flushPending`/`drainPending` in `watcher.ts:636-651`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: acceptance-criteria.md: 5 of 5 Met.
- [x] CHK-021 [P0] Each new test seen failing with the old source Evidence: T003, T005 and T007 each failed on the old source.
- [x] CHK-022 [P1] Full runtime suite has no new failure Evidence: 2559 passed; the 6 pre-scan failures also failed on HEAD source.
- [x] CHK-023 [P1] The shared-run refresh test still passes Evidence: `shares one refresh run across concurrent callers` passes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class: refresh `algorithmic`, coverage read `instance-only`, status `cross-consumer`. Evidence: Classes recorded in plan.md FIX ADDENDUM.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: the lane is the only `embeddingCoverage` caller without a handle. Evidence: No `embeddingCoverage()` call without a handle remains outside tests (review scope check).
- [x] CHK-FIX-003 [P0] Consumer inventory completed for `refreshEmbeddingsInBackground`, `incomplete_skill_vectors` and `laneEnabled`. Evidence: plan.md affected-surfaces table; other docs already matched.
- [x] CHK-FIX-004 [P0] N/A: no path, parser or redaction fix. Evidence: N/A.
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.md before completion. Evidence: plan.md Required inventories.
- [x] CHK-FIX-006 [P1] Tests that stub `VITEST` or the lane weight restore the environment. Evidence: `advisor-status.vitest.ts:293-294` unstubs in `afterEach`; the cosine test unstubs in `finally`.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the fix commit. Evidence: Fix commit `c411bcc842c`, merged as `1bb38778a03`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets, URLs or credentials added Evidence: quality-gate.cjs: 0 findings on changed files and on the 207 review files.
- [x] CHK-031 [P0] The recommend path opens no read-write handle Evidence: Cosine test: `getDbReadOnly()?.readonly` true after scoring.
- [x] CHK-032 [P1] N/A: no auth surface Evidence: N/A.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same three fixes Evidence: Three fixes named alike in spec.md, plan.md and tasks.md.
- [x] CHK-041 [P1] Code comments state the reason, with no packet or finding ids Evidence: New comments state the reason with no ids; quality gate 0 findings.
- [x] CHK-042 [P2] The two catalog pages state the shipped behavior Evidence: T009.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence: Temporary files kept in the session scratchpad.
- [x] CHK-051 [P1] scratch/ cleaned before completion Evidence: `scratch/` holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-20
<!-- /ANCHOR:summary -->

---
