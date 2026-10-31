---
title: "Tasks: advisor lease reclaim flake"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "advisor lease reclaim flake tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: advisor lease reclaim flake

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

`L` is `.skilled/bin/system-skill-advisor-launcher.cjs`. `O` is `tests/skill-advisor-launcher-orphan-reaping.vitest.ts` and `U` is `tests/launcher-reap-pid-reuse.vitest.ts`, both under `.skilled/skills/system-skill-advisor/runtime`, where every `npx vitest` command runs. `S` is the session scratchpad: it holds the HEAD launcher and test from `git show HEAD:`, the round-0 launcher, and the forced copies, which sit in `tests/` only while they run.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the CI failure. Verify: `gh run view 40596294785 --attempt 1 --log-failed` prints `AssertionError: expected null to deeply equal Any<Number>` at `skill-advisor-launcher-orphan-reaping.vitest.ts:429:37` after 1120 ms.
- [x] T002 Log both launchers' stderr from a diagnostic copy of the test, 12 runs on the HEAD code (`S`). Verify: 5 runs show a loser naming its own pid as the live owner and reaping it, 3 show both launchers claiming, and 4 show the loser reaping the starting winner.
- [x] T003 Force a slow child: a 400 ms busy wait ahead of the fixture daemon's pid write, HEAD test with HEAD launcher (`S`). Verify: 0 of 10 pass, 10 of 10 fail with `expected null to deeply equal Any<Number>`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Publish the owner lease through a temp file and `linkSync` (`L`, `writeOwnerLeaseFileExclusive`). Verify: `node --check L` exits 0.
- [x] T005 Split `parseOwnerLease` from `readOwnerLeaseFile`; make `acquireOwnerLeaseFile` read once, reclaim an unparseable lease and re-read the winner after a lost claim, at most 3 times (`L`). Verify: `rg -n "holder \|\| lease" L` prints nothing.
- [x] T006 Make the stale-reclaimer test wait for a live child that matches the lease's `childPid`, and assert the single-writer state (`O`). Verify: `npx vitest run O` passes.
- [x] T007 Add the empty-lease and half-written-lease tests (`U`). Verify: on the HEAD launcher both fail (`expected 97276 not to be 97276`, `expected [ 'unreadable' ] to not include 'unreadable'`); on `L` both pass.
- [x] T008 Reclaim through `setAsideOwnerLease`: rename aside, compare with the text read, restore a changed lease with `link()` (`L`). Verify: `rg -n "unlinkSync\(currentOwnerLeasePath" L` prints nothing.
- [x] T009 Add the peer-published-lease test, which writes a live lease right after the claim's first read (`U`). Verify: on the round-0 launcher it fails with `expected true to be false`; on `L` it passes.
- [x] T010 Add `waitForStartingHolderSocket` before the bridge decision, with `leaseStartupGraceMs` (default 7000, clamp 30000) (`L`). Verify: `node --check L` exits 0.
- [x] T011 Let the fixture daemon open its socket after a delay; add the starting-owner bridge test; give the missing-socket respawn test a 1500 ms grace and assert its wait log; give the stale-reclaimer test a daemon that opens its socket (`O`). Verify: on the round-0 launcher the starting-owner test fails and its log shows `reaping recorded skill-advisor daemon pid 80454` with the child replaced by 80472; on `L` all 9 pass.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Forced races on the final code, 10 runs each (`S`). Verify: HEAD pair under the 400 ms child delay 0 of 10 with the CI message; fixed pair 10 of 10; fixed pair with the launcher slowed 300 ms before the bootstrap lock 10 of 10; fixed launcher with the readiness wait removed 10 of 10.
- [x] T013 Run `O` 20 times in a row. Verify: 20 of 20 exit 0 with `Tests  9 passed (9)`.
- [x] T014 Run `O` 20 times, four at a time in five rounds. Verify: 20 of 20 exit 0 with `Tests  9 passed (9)`.
- [x] T015 Run the advisor default suite after `npm run build` and `node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted --format text`. Verify: `Test Files  153 passed (153)`, `Tests  1305 passed | 8 skipped (1313)`, exit 0.
- [x] T016 Run the advisor stress suite as CI does. Verify: `npm run test:stress -- --config vitest.stress.config.ts` prints `Test Files  21 passed (21)`, `Tests  65 passed (65)`, exit 0.
- [x] T017 Run the two system-spec-kit tests that load `L`. Verify: `npx vitest run tests/launcher-session-proxy.vitest.ts tests/embedders/hf-local-client.vitest.ts` prints `Tests  57 passed (57)`.
- [x] T018 Run the quality gate on the three code files. Verify: `quality-gate.cjs --files ... --lines changed` prints `gate=NO_BLOCKER_FOUND` and `findings: 0`.
- [x] T019 Update the changelog and keep the version. Verify: `validate_document.py` on `changelog/v0.17.17.0.md` prints `"total_issues": 0`, and `sync-skills-hermes.cjs` exits 0.
- [x] T020 Validate the folders. Verify: `validate.sh --recursive --strict` on this folder and on the parent print `RESULT: PASSED`.
- [x] T021 Skip the startup wait when `SPECKIT_LAUNCHER_BRIDGE_DISABLED=1`, and add the bridge-disabled test (`L`, `O`). Verify: with the guard removed the test fails in 7203 ms (`expected '[system-skill-advisor-launcher] liveO…' not to contain 'is still starting'`); with it the test passes in 315 ms.
- [x] T022 Rerun with the HEAD launcher swapped into the worktree, then restore it (`L`). Verify: the three new unit tests and the starting-owner test fail 4 of 4 on HEAD (`expected 84767 not to be 84767`, `expected true to be false`, `expected [ 'unreadable' ] to not include 'unreadable'`, `Timed out waiting for startup wait log`); `cmp` on the restored file exits 0; on the restored launcher those four and the bridge-disabled test pass 5 of 5, exit 0.
- [x] T023 Rerun `O` 10 times in a row and the default suite after `npm run build`. Verify: 10 of 10 with `Tests  10 passed (10)`; `Test Files  153 passed (153)`, 1306 passed and 8 skipped of 1314, exit 0.
- [x] T024 Scan the added code comments for ephemeral ids. Verify: the id pattern matches none of the 61 added comment lines (exit 1), and the gate's comment-hygiene check prints `RAN_CLEAN`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Each forced race fails the old code and passes the fixed code, and 40 unforced runs pass
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Closure gate**: See `acceptance-criteria.md`
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

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-006 in spec.md section 4.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan.md section 3 names the four changed functions.
- [x] CHK-003 [P1] The CI symptom reproduced before any change. Evidence: T003, 10 of 10 with the CI message.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Syntax and gate checks pass. Evidence: `node --check L` exits 0; T018 `gate=NO_BLOCKER_FOUND`, 0 findings.
- [x] CHK-011 [P0] No new warning in the suites. Evidence: T015 and T016 exit 0.
- [x] CHK-012 [P1] Error handling implemented. Evidence: non-`ENOENT` read errors and non-`EEXIST` restore errors rethrow; three lost claims throw a named error (T005, T008).
- [x] CHK-013 [P1] Code follows project patterns. Evidence: the publish and restore mirror `writeLoopLockExclusive` and `restoreReclaimedLoopLock` in `loop-lock.ts`.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: every row in `acceptance-criteria.md` is `Met`.
- [x] CHK-021 [P0] Each fix fails before and passes after. Evidence: T003 and T012 (child read), T007 (torn read), T009 (blind reclaim), T011 (starting owner).
- [x] CHK-022 [P1] Edge cases tested. Evidence: empty lease (T007), peer lease after read (T009), holder past the grace still respawned (T011), bridge disabled (T021).
- [x] CHK-023 [P1] Load tested. Evidence: T014, 20 of 20 four at a time.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class. Evidence: the child read is `test-isolation`; the torn read, the blind reclaim and the starting-owner reap are `class-of-bug` in the claim and bridge path.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: plan.md affected surfaces; no delete by path remains (T008).
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: plan.md lists the claim, both exclusive writes, the four bridge call sites and `hf-local.ts` (T017 passes).
- [x] CHK-FIX-004 [P0] Adversarial cases for the lease parser. Evidence: empty file, live lease injected after the read, and a half-written file observed mid-claim (T007, T009).
- [x] CHK-FIX-005 [P1] Matrix axes listed. Evidence: plan.md affected surfaces, matrix axes line.
- [x] CHK-FIX-006 [P1] Hostile env variant run. Evidence: `SPECKIT_LEASE_STARTUP_GRACE_MS=1500` in the missing-socket test; out-of-range values clamp per spec.md edge cases.
- [x] CHK-FIX-007 [P1] Evidence pinned. Evidence: all runs are on the uncommitted diff over `b2823d726a`.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: T018 secrets check `RAN_CLEAN`.
- [x] CHK-031 [P0] Input validation implemented. Evidence: the grace override is parsed as an integer, a negative or bad value falls back and the value is clamped to 30000.
- [x] CHK-032 [P1] File modes kept. Evidence: the temp lease is opened `0o600`; the set-aside file keeps the lease's own mode.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized. Evidence: T020 `RESULT: PASSED`.
- [x] CHK-041 [P1] Code comments give the reason. Evidence: T018 comment-hygiene `RAN_CLEAN`.
- [x] CHK-042 [P2] Changelog updated. Evidence: T019, 0 issues.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files outside the repo. Evidence: forced copies lived in the session scratchpad and in `tests/` only while they ran.
- [x] CHK-051 [P1] Scratch cleaned before completion. Evidence: `ls tests | grep zz-` prints nothing; the upgrade backup folder is removed.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-28
<!-- /ANCHOR:summary -->

---
