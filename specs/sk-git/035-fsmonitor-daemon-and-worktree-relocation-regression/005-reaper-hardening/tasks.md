---
title: "Tasks: Phase 5: reaper-hardening"
description: "Ordered tasks for the three reaper guards, the orphans mode, the shared bounded-git helper and the sk-git docs, each with the command that proves it."
trigger_phrases:
  - "reaper hardening tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: reaper-hardening

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

Variables: `R` is `.skilled/bin/fsmonitor-daemon-reaper.sh`, `RT` is `.skilled/bin/tests/fsmonitor-daemon-reaper.test.sh`, `H` is `.skilled/scripts/git-hooks`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the daemon pid list before any run (`ps -axo pid=,command=`). Verify: the list is saved in `implementation-summary.md` and has 4 pids.
- [x] T002 Run the existing suites at HEAD (`$RT`, the nine `$H/tests/*.test.sh` files, `.skilled/hooks/git/install-hooks.test.sh`, `worktree-session.test.sh`, `check-git-hooks.test.sh`, `worktree-reaper.test.sh`). Verify: every one exits 0, and `$RT` prints `PASS=126 FAIL=0`.
- [x] T003 Read `003-fsmonitor-daemon-lifecycle/implementation-summary.md` Known Limitations. Verify: items 2 and 4 are the scope in `spec.md` section 3.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the three failing-first reaper cases and the `--orphans` cases (`$RT`). Verify: against `git show HEAD:$R` in a temp copy the suite prints `FAIL=` above zero for the new cases.
- [x] T005 Recheck the start time with the command line before each signal (`$R` `_daemon_state`, `_end_daemon`). Verify: the start-time case passes and the stray survives.
- [x] T006 Use git's `stop` only when no other daemon watches the worktree (`$R` `_other_daemon_watches`). Verify: the twin-daemon case leaves the stop log empty while two daemons run.
- [x] T007 Read the worktree list again before a stray is ended (`$R`). Verify: the mid-run case prints `reason=registered-mid-run` and the stub survives.
- [x] T008 Add `--orphans` and the `orphan` class (`$R`). Verify: dry run prints `class=orphan` and `orphan=1`, `--apply` ends only the orphan, `--worktree` exits 2.
- [x] T009 Bound the real-daemon calls in the reaper suite, and filter the process list in the orphan runs to the suite's own stubs (`$RT`). Verify: a hung real-daemon `status` no longer stalls the suite, and no stranger's daemon is in the orphan run.
- [x] T010 Create `$H/lib/bounded-git.sh` with `bounded_run`, `git_bounded`, `git_bound_arm` and `git_bound_finish`. Verify: `bounded-git.test.sh` helper cases pass.
- [x] T011 Route the 25 index-reading call lines in `$H/pre-commit` and the 4 in `.skilled/hooks/git/pre-commit` through `git_bounded`, and add the exit trap. Verify: a hung `git diff` makes `$H/pre-commit` exit 1 with `BLOCKED [gate:git-timeout]`.
- [x] T012 Route the 2 call lines in `$H/pre-push` and the 2 in `$H/lib/mass-deletion-guard.sh` through `git_bounded`, and add the exit trap. Verify: the same for a hung update push.
- [x] T013 Run `worktree add` in `.skilled/bin/worktree-session.sh` under `git_bounded` with a 60 second bound. Verify: `worktree-session.test.sh` F15 cases pass.
- [x] T014 [P] Replace the false catalog line in GIT-034 and GIT-043 with the catalog link (`manual-testing-playbook/owner-first-worktree-tooling/`). Verify: `rg -n 'No .feature-catalog/. package' <both files>` prints nothing.
- [x] T015 [P] Add the new flags to `feature-catalog/session-lifecycle/fsmonitor-daemon-reaper.md`, the one summary sentence in `feature-catalog.md`, and the orphan and stale-state checks to GIT-047. Verify: `rg -n -- '--orphans' <the three files>` prints a line in each.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Run `$RT`. Verify: `PASS=<n> FAIL=0`, with `n` above the HEAD count of 126.
- [x] T017 Rerun every suite from T002 plus `bounded-git.test.sh`. Verify: each exits 0 and no count dropped from its HEAD value.
- [x] T018 Run GIT-047 as written in scratch repositories, then the supplemental checks. Verify: a pass or fail per step is recorded in `implementation-summary.md`.
- [x] T019 Time `git status --porcelain` five times with fsmonitor off and five with it on, 60 second cap. Verify: the median and maximum of each are in `implementation-summary.md`.
- [x] T020 Run `shellcheck -S warning` and `bash -n` on every changed shell file. Verify: both exit 0 for each.
- [x] T021 Run `validate.sh --strict` on this folder and `--recursive` on the parent, and the playbook validator. Verify: `RESULT: PASSED` twice, and `validate-playbook-package.cjs --package .skilled/skills/sk-git/manual-testing-playbook` exits 0.
- [x] T022 Compare the daemon pid list with T001. Verify: no pid from T001 is gone, and every pid this run started is gone.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the GIT-047 results are in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
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

- [x] CHK-001 [P0] Requirements documented in `spec.md` section 4
- [x] CHK-002 [P0] Technical approach defined in `plan.md` section 3
- [x] CHK-003 [P1] `perl`, `lsof` and `ps` are on PATH: `command -v perl lsof ps` prints three paths
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `bash -n` exits 0 and `shellcheck -S warning` prints nothing for every changed shell file
- [x] CHK-011 [P0] Every changed script runs under `/bin/bash` 3.2: the suites ran with `/bin/bash`
- [x] CHK-012 [P1] A timeout fails closed: the hung-git cases for pre-commit and pre-push exit 1
- [x] CHK-013 [P1] No comment in a changed script names a packet, phase, task or finding id: `rg -n 'phase 00|T0[0-9][0-9]|REQ-|AC-' <changed scripts>` prints nothing
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] GIT-047 run recorded with a result per step
- [x] CHK-022 [P1] The new reaper cases fail against the HEAD reaper
- [x] CHK-023 [P1] The hung-git hook cases fail against the HEAD hooks
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class: start-time recheck, single-owner stop and mid-run registration are `class-of-bug` in one function family; orphans is `matrix/evidence`; the hook calls are `cross-consumer`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `plan.md` section "Affected Surfaces" lists the call-line `rg` and its result.
- [x] CHK-FIX-003 [P0] Consumer inventory: the reaper's three callers parse none of the changed lines.
- [x] CHK-FIX-004 [P1] Adversarial cases are in the suite: a recycled pid, two daemons on one worktree, a worktree added mid-run, a root that exists, `--orphans --worktree`.
- [x] CHK-FIX-005 [P1] Matrix axes: pid identity (live, changed, gone), daemons per worktree (1, 2), worktree list (stale, fresh), root (exists, deleted), flag combination (`--orphans` alone, with `--apply`, with `--worktree`).
- [x] CHK-FIX-007 [P1] Evidence is pinned to the working tree of this run; nothing is committed.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret is read or written by any changed file
- [x] CHK-031 [P0] The reaper signals a pid only after its command line and start time match; `--orphans --apply` rechecks the root first
- [x] CHK-032 [P1] The helper loads from the hook's own directory, not from the repository's tree
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` agree on the flags, skip reasons and call counts
- [x] CHK-041 [P1] The comments in the changed scripts state the reason, not the history
- [x] CHK-042 [P2] README changes are listed in `implementation-summary.md`, not made
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files are under the session scratch directory or `$TMPDIR`
- [x] CHK-051 [P1] No scratch repository or stub daemon outlives the run
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 15 | 15/15 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-27
<!-- /ANCHOR:summary -->

---
