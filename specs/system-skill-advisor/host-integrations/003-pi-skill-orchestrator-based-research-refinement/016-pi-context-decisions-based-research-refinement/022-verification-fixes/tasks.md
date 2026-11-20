---
title: "Tasks: Phase 22: verification-fixes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "verification fixes tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 22: verification-fixes

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

`R` is `.skilled/skills/system-skill-advisor/runtime`. `V` is `npx vitest run` run from `R`. `B` is the bin suite, `vitest run --config vitest.config.bin.ts` run from `.skilled`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create the worktree through sk-git and provision it. Verify: `worktree-naming.sh create advisor-verification-fixes main` prints the worktree path. Evidence: `worktrees/489-advisor-verification-fixes` at `24749648b24`, 10 installed, 5 built, 0 failed.
- [x] T002 Record the baseline after `skill_graph_scan --trusted`. Verify: `V` prints its totals. Evidence: 195 files, 2559 passed, 8 skipped.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add two suspension tests, then skip one check after a gap above two intervals (`.skilled/bin/launcher-heartbeat-watchdog.vitest.ts`, `.skilled/bin/system-skill-advisor-launcher.cjs`). Verify: both fail first, then `B` on the file passes. Evidence: old source sent SIGTERM on wake, 2 failed; after the fix 13 passed.
- [x] T004 Add the early-PID test, then pass `parentPid` read at the top of `main()` (`R/tests/daemon/liveness.vitest.ts`, `R/lib/daemon/liveness.ts`, `R/advisor-server.ts`). Verify: fails first, then passes. Evidence: 1 failed on the old source, then 4 passed.
- [x] T005 Add three lane tests, then share one coverage gate, check it before the embed and keep the zero-weight reason on a stale index (`R/tests/semantic-lane-weight-zero.vitest.ts`, `R/lib/scorer/lanes/semantic-shadow.ts`, `R/lib/scorer/fusion.ts`, `R/handlers/advisor-recommend.ts`). Verify: all three fail first, then pass. Evidence: old source gave `projection_embedding_stale`, 1 embed call and 1 exact match; after the fix 5 passed.
- [x] T006 Move the stale telemetry assertion to the live-weight staleness test (`R/tests/scorer/semantic-shadow-ablation.vitest.ts`, `R/tests/scorer/projection-embedding-staleness.vitest.ts`). Verify: both files pass. Evidence: 13 passed, 2 skipped across the three lane files.
- [x] T007 Add the throw-with-queue test, then catch per pass (`R/tests/skill-graph/refresh-in-background.vitest.ts`, `R/lib/skill-graph/skill-graph-db.ts`). Verify: fails first, then passes. Evidence: old source rejected with `probe exploded`; after the fix 8 passed.
- [x] T008 Add the disabled-crash test, then return `{}` from the catch when the hook is disabled (`R/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`, `hooks/claude/user-prompt-submit.ts`). Verify: fails first, then the hook suites pass. Evidence: old source returned the outage line; after the fix and a rebuild 254 passed.
- [x] T009 Add two DSH tests, then drop the route receipt at a boundary and hold the next turn (`hooks/tests/dsh-prompt-advisor.test.mjs`, `hooks/dsh/prompt-advisor.mjs`). Verify: both fail first, then `node --test` passes. Evidence: old source ran the advisor before the rotation and had no `dropRouteReceipt`; after the fix 20 passed.
- [x] T010 Add the behavioral watcher refresh test (`R/tests/daemon/watcher-embedding-refresh.vitest.ts`). Verify: passes, and fails with the refresh call removed. Evidence: 2 passed; with the call replaced both failed; `watcher.ts` restored with no diff.
- [x] T011 [P] Correct the two vector-writer comments and the two stale-vector comments (`R/advisor-server.ts`, `R/lib/embedders/schema.ts`, `R/lib/skill-graph/skill-graph-db.ts`). Verify: `rg -n "written only by a trusted"` under `R` prints nothing. Evidence: no match.
- [x] T012 [P] Pin the last-marker case with its `ideal` answer (`R/tests/fixtures/pasted-reply-strip-cases.json`). Verify: the TypeScript and Python readers pass. Evidence: 34 passed and `pass=123, fail=0`.
- [x] T013 [P] Update the catalog, reference and playbook lines (`feature-catalog/daemon-and-freshness/lifecycle.md`, `background-vector-refresh.md`, `scorer-fusion/five-lane-fusion.md`, `hooks-and-plugin/weak-follow-up-route-receipt-guard.md`, `references/scoring/advisor-scorer.md`, `manual-testing-playbook/auto-update-daemon/daemon-lifecycle-shutdown.md`). Verify: each states the shipped behavior. Evidence: six pages updated in the worktree diff.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Rebuild, type-check and rescan. Verify: `npm run build`, `npm run typecheck` and `skill_graph_scan --trusted` exit 0. Evidence: build=0, typecheck=0, scan=0.
- [x] T015 Run the full runtime suite. Verify: `V` reports no failure absent from the baseline. Evidence: 196 files, 2570 passed, 8 skipped.
- [x] T016 Run the bin, DSH and Python suites. Verify: each reports 0 failures. Evidence: bin 97 passed, DSH 20 passed, Python `pass=123, fail=0`.
- [x] T018 Close the three review gaps, each test first: the failed-pass warning, the other pre-score refusals and the launcher pid at spawn (`R/lib/skill-graph/skill-graph-db.ts`, `R/handlers/advisor-recommend.ts`, `.skilled/bin/system-skill-advisor-launcher.cjs`, `R/lib/daemon/liveness.ts`, `R/advisor-server.ts`, their tests, `lifecycle.md`, `background-vector-refresh.md`, `five-lane-fusion.md`, `advisor-scorer.md`). Verify: the four new cases fail first, then pass. Evidence: empty warnings, `dim_mismatch` unmerged, no `resolveLauncherPid` and no launcher pid in the child env before; after the fixes 142 passed and bin 97 passed. The four `launcher-bootstrap.vitest.ts` child-env cases now expect the launcher pid, 21 passed.
- [x] T017 Validate the packet. Verify: `validate.sh <022> --strict` prints `RESULT: PASSED`. Evidence: see implementation-summary.md Verification.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Each new behavior test was seen failing before its fix
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Findings**: `../021-epic-verification/evidence/report.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md Evidence: spec.md REQ-001 to REQ-012.
- [x] CHK-002 [P0] Technical approach defined in plan.md Evidence: plan.md sections 3 and FIX ADDENDUM.
- [x] CHK-003 [P1] Baseline recorded (T002) Evidence: 2559 passed, 8 skipped.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `npm run typecheck` in the runtime exits 0 Evidence: typecheck=0.
- [x] CHK-011 [P0] Every suite prints no failure Evidence: runtime 2570, bin 97, DSH 20, Python 123, all 0 failed.
- [x] CHK-012 [P1] An independent review returns no unresolved P0 or P1 Evidence: @review APPROVED, 0 P0, 0 P1, 4 P2; three fixed in T018, the startup-gate test left out of scope in spec.md.
- [x] CHK-013 [P1] Code comments state the reason, with no packet or finding ids Evidence: new comments explain sleep, adoption, gate sharing and the DSH wait with no ids.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: acceptance-criteria.md, every row Met.
- [x] CHK-021 [P0] Each new behavior test seen failing with the old source Evidence: T003 to T005 and T007 to T009 each failed first; T010 failed under mutation.
- [x] CHK-022 [P1] Full runtime suite has no new failure Evidence: 2570 passed against the 2559 baseline, 0 failed.
- [x] CHK-023 [P1] The existing watchdog and refresh tests still pass Evidence: watchdog 13 passed, refresh 8 passed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class from the 021 report Evidence: plan.md FIX ADDENDUM.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: the coverage readers share one helper. Evidence: `rg -n "embeddingCoverage\(" R/lib/scorer` prints one line, `semantic-shadow.ts:164`.
- [x] CHK-FIX-003 [P0] Consumer inventory for the changed symbols Evidence: plan.md Required inventories; the DSH adapter is a symlink from `.dsh/plugins/repo-guards/adapters/`, whose bundle test passes 5 of 5.
- [x] CHK-FIX-004 [P0] N/A: no path, parser or redaction fix. Evidence: N/A.
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.md Evidence: plan.md Required inventories.
- [x] CHK-FIX-006 [P1] Tests that stub env or spy on `process.cwd` restore it Evidence: `vi.unstubAllEnvs` and `mockRestore` in `finally` or `afterEach`.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the fix commit Evidence: fix commit `d35466eb1d8` on `worktrees/489-advisor-verification-fixes`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets, URLs or credentials added Evidence: the diff adds no URL other than a relative module path.
- [x] CHK-031 [P1] N/A: no auth surface Evidence: N/A.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same eleven fixes Evidence: REQ-001 to REQ-011, the plan's surface table and T003 to T012.
- [x] CHK-041 [P2] The changed docs state the shipped behavior Evidence: T013.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in the session scratchpad only Evidence: the watcher backup lived in the scratchpad.
- [x] CHK-051 [P1] scratch/ cleaned before completion Evidence: `scratch/` holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-20
<!-- /ANCHOR:summary -->

---
