---
title: "Tasks: Phase 11: ci-health-followups"
description: "Ordered tasks for the goal-core and watcher flake fixes and the pi-coding-agent bump measurement, each with the command that proved it."
trigger_phrases:
  - "ci health followups tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 11: ci-health-followups

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Scaffold this phase child (`011-ci-health-followups/`). Verify: `create.sh --phase --parent ... --phase-names ci-health-followups --level 2` created the folder; observed `ls` lists it.
- [x] T002 Baseline both extensions at 0.75.3 (`.pi/extensions/*/`). Verify: `npm ci && npm test && npm audit`; observed pass 118 / fail 0 and 81 passed, `1 high severity vulnerability` in each.
- [x] T003 [P] Baseline the watcher test (`tests/daemon-watcher-new-root-ingestion.vitest.ts`). Verify: 3 runs; observed 2 failed (`× discovers a newborn skill ... 5181ms`, `5174ms`), 1 passed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Assert on `basename(scope.statePath)` (`.skilled/hooks/goal/lib/goal-core.test.cjs`). Verify: `node --test .skilled/hooks/goal/lib/goal-core.test.cjs`; observed `ℹ pass 98`, `ℹ fail 0`.
- [x] T005 Add the `ready` promise (`runtime/lib/daemon/watcher.ts`). Verify: `npm run typecheck`; observed exit 0.
- [x] T006 Replace the 150 ms sleep with `await watcher.ready` plus the probe handshake (`runtime/tests/daemon-watcher-new-root-ingestion.vitest.ts`). Verify: 5 runs; observed `Tests  5 passed (5)` each, exit 0.
- [B] T007 Bump pi-coding-agent to 0.79.0 in both lockfiles (`.pi/extensions/*/package-lock.json`). Verify: lockfiles resolve 0.79.0, `npm test` and typecheck pass; observed `npm audit` prints `6 vulnerabilities (1 moderate, 5 high)` in each, against 1 high before. Held out of the commit until the version is decided.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T008 Rerun the 3 sibling watcher suites (`runtime/tests/`). Verify: `npx vitest run tests/daemon-watcher-resource-leaks-049-005.vitest.ts tests/lifecycle-derived-metadata.vitest.ts tests/daemon-freshness-foundation.vitest.ts`; observed `Tests  47 passed (47)`.
- [x] T009 Run the goal-core edge case (`goal-core.test.cjs`). Verify: `TMPDIR=<scratch>/pi-tmp node --test --test-name-pattern "scope paths hash"`; observed the HEAD copy `fail 1`, the fixed file `pass 1`.
- [x] T010 Record the phase in the parent map (`../spec.md`). Verify: `rg -n "011-ci-health-followups" ../spec.md` prints the phase row and the transition row.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]` (T007 is open)
- [ ] No `[B]` blocked tasks remaining (T007 waits on the version decision)
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 to REQ-003)
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available (registry reachable, chokidar resolved)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] Code passes lint/format checks: advisor `npm run typecheck` exit 0
- [x] CHK-011 [P0] No console errors or warnings in the goal-core and watcher runs
- [x] CHK-012 [P1] Error handling implemented: an undelivered probe fails `expect(probeSeen).toBe(true)`
- [x] CHK-013 [P1] Code follows project patterns: listener map fakes untouched, comments carry the WHY only
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [ ] CHK-020 [P0] All acceptance criteria met: AC-003 is unmet
- [x] CHK-021 [P0] Manual testing complete
- [x] CHK-022 [P1] Edge cases tested: `pi`-bearing `TMPDIR`
- [x] CHK-023 [P1] Error scenarios validated: the traced failing run shows `ready` then no event
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] Finding classes: goal-core is `test-isolation`, the watcher flake is `test-isolation` (event delivery after `ready`).
- [x] CHK-FIX-002 [P0] Same-class producers: `rg -n "statePath.includes" .skilled/hooks/goal` shows one assertion.
- [x] CHK-FIX-003 [P0] Consumers of `SkillGraphWatcher`: all built by `createSkillGraphWatcher`; 47 sibling tests pass.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix.
- [x] CHK-FIX-005 [P1] N/A: no input matrix.
- [x] CHK-FIX-006 [P1] Hostile env variant run: `TMPDIR` containing `pi`.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the phase commit named in `implementation-summary.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No hardcoded secrets in the changed files
- [x] CHK-031 [P0] N/A: no new input surface
- [x] CHK-032 [P1] N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] Spec/plan/tasks synchronized on the held lockfiles
- [x] CHK-041 [P1] Code comments adequate: both new comments state why
- [x] CHK-042 [P2] N/A: no README covers these tests
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Temp files outside the repo only: the debug test copy and the HEAD test copy were deleted after use
- [x] CHK-051 [P1] scratch/ holds only `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-27
<!-- /ANCHOR:summary -->

---



