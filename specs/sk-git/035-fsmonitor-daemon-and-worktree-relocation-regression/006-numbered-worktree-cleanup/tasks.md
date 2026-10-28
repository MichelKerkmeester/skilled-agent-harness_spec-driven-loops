---
title: "Tasks: Phase 6: numbered-worktree-cleanup"
description: "Ordered tasks for the numbered reaper lane, the throttled session-start sweep, the doctor line, the docs and the phase 005 follow-ups, each with the command that proves it."
trigger_phrases:
  - "numbered worktree cleanup tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: numbered-worktree-cleanup

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

Variables: `R` is `.skilled/bin/worktree-reaper.sh`, `RT` is `.skilled/bin/tests/worktree-reaper.test.sh`, `G` is `.skilled/bin/worktree-guard.sh`, `GT` is `.skilled/bin/tests/worktree-guard.test.sh`, `D` is `.skilled/commands/doctor/scripts/git-setup-check.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run the existing suites at HEAD before any edit (`$RT`, `fsmonitor-daemon-reaper.test.sh`, `worktree-session.test.sh`, `bounded-git.test.sh`, the doctor test file). Verify: the counts and exit codes are in `implementation-summary.md`.
- [x] T002 Count the README reference and derived-count failures of the five READMEs before any edit. Verify: the before counts are in `implementation-summary.md`.
- [x] T003 Read `fsmonitor-daemon-reaper.sh` `run_bounded` and `_cwd_intruder`, `bounded-git.sh`, `worktree-guard.sh`, the detached sweep in `worktree-session.sh`, `checkWorktrees` and `worktree-naming.sh validate-pair`. Verify: the design in `plan.md` section 3 cites each.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the reaper cases first: the empty-listing wrapper case and the numbered fixture (`$RT`). Verify: against `git show HEAD:$R` in a temp copy the suite prints `FAIL=` above zero.
- [x] T005 Source `bounded-git.sh`, route every git call through `git_bounded`, and rewrite `_busy_pid_in` so an empty or timed-out listing prints `unknown` (`$R`). Verify: the empty-listing wrapper case and the wedged-status case pass.
- [x] T006 Read the registry as records and keep the loop alive through a refused `worktree remove` or `branch -d` (`$R`). Verify: the ref-lock case exits 0 and the later worktree is removed.
- [x] T007 Add `--numbered`, `--idle-hours`, `WORKTREE_REAPER_NOW`, the keep rules, the allowlist and the orphan report (`$R`). Verify: every keep case in `$RT` passes and `002-ok` is removed.
- [x] T008 Start the sweep from the guard behind the six-hour stamp, with `SPECKIT_WORKTREE_AUTOREAP` (`$G`). Verify: `$GT` prints `FAIL=0`.
- [x] T009 Write `$GT`. Verify: against `git show HEAD:$G` in a temp copy it prints `FAIL=` above zero.
- [x] T010 Add `numberedWorktreesDetail` to `checkWorktrees` and three cases (`$D`). Verify: the cases fail against the HEAD module and pass now, and the verdict stays PASS.
- [x] T011 [P] Amend sk-git rule 17 and the reaper header comment. Verify: `rg -n 'numbered' .skilled/skills/sk-git/SKILL.md` finds rule 17 naming the flag and the switch.
- [x] T012 [P] Update the catalog entry, the catalog summary, the sk-git README row, GIT-034 and the playbook cross-reference (`.skilled/skills/sk-git/`). Verify: the playbook validator exits 0.
- [x] T013 [P] Replace the false catalog line in the eleven playbook files (`owner-first-worktree-tooling/`). Verify: `rg -n 'No .feature-catalog/. package' .skilled/skills/sk-git` prints nothing.
- [x] T014 [P] Edit the five READMEs and `.env.example`. Verify: no README gains a reference failure beyond the untracked `bounded-git.sh` tree line.
- [x] T015 [P] Update phase 003's Known Limitations items 2 and 4. Verify: both name phase 005.
- [x] T016 Find why the real-daemon assertion flakes and fix it (`fsmonitor-daemon-reaper.test.sh`). Verify: a traced failing run shows git's stop returning at once with the daemon alive, a longer stop bound and a longer wait both leave it failing, and the suite prints `FAIL=0` once the case runs only for an answering daemon.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Run every touched suite and the doctor file. Verify: each exits 0 with the counts in `implementation-summary.md`.
- [x] T018 Run `shellcheck -x` and `bash -n` on every changed shell file. Verify: both exit 0 for each.
- [x] T019 Run `$R --numbered --dry-run` against this repository. Verify: the worktree registry and ref hashes are equal before and after, and one verdict row is printed per live numbered worktree.
- [x] T020 Rerun the README checks. Verify: counts match `implementation-summary.md`.
- [x] T021 Run `validate.sh --strict` on this folder, `--recursive` on the parent, the playbook validator and the skill package validator. Verify: `RESULT: PASSED` twice, and both validators exit 0.
- [x] T022 Compare the fsmonitor daemon and sleep-stub pid lists before and after. Verify: no process this run did not start was signalled.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Follow-up, regenerable ignored files and squash-merged branches

Variables: `L` is `.skilled/skills/sk-git/scripts/worktree-provision-paths.txt`, `N` is `.skilled/skills/sk-git/scripts/worktree-naming.sh`.

- [x] T023 Read every reader of `$L` and prove each skips `#` lines (`$R`, `$N` provision, `$D` `readProvisionEntries`, `worktree-naming.test.sh`, the CI setup action). Verify: `provision` over the edited list in a scratch tree warns 14 times for its 14 entries and never for a directive, and warns 15 times once a plain extra line is appended; the doctor's worktrees row lists the same 14 entries and no directive; `worktree-naming.test.sh` prints `PASS=171 FAIL=0`.
- [x] T024 Write the reaper cases first: two listed regenerable files, a listed file beside an unlisted one, a squash-merged branch and a colliding branch (`$RT`). Verify: against the unchanged reaper and list the suite prints `PASS=96 FAIL=6` and exits 1.
- [x] T025 Read `# regenerable: <path>` comments into the ignored-path allowlist and mark the sk-vision adapter bundle and the spec-kit Node version stamp (`$R`, `$L`). Verify: `$RT` prints `PASS=102 FAIL=0`.
- [x] T026 Keep a branch whose changes are already in the live branch, with a reason that says it was squash-merged (`$R`). Verify: the 016 case reads `branch content already in the live branch (squash-merged); remove by hand`, the colliding 017 case still reads `branch is not merged into the live branch`.
- [x] T027 [P] Add the six-hour sweep and `SPECKIT_WORKTREE_AUTOREAP=0` to rule 17 and trim the same number of words elsewhere (`.skilled/skills/sk-git/SKILL.md`). Verify: `wc -w` and Python `split()` give the HEAD counts (5000 and 4999) and `validate_skill_package.py` exits 0.
- [x] T028 [P] Update the catalog entry and the reaper row in `.skilled/bin/README.md`. Verify: `validate_document.py` reports `Total issues: 0` for both files and the README reference and derived-count checks print `PASS`.
- [x] T029 Write the sk-git v1.11.1.0 changelog entry, raise the `SKILL.md` version and sync the Hermes copy. Verify: `validate_document.py` and `frontmatter-version.mjs verify --skill sk-git` exit 0, and `sync-skills-hermes.cjs --check` prints `PASS: 67 Hermes skill copies in sync`.
- [x] T030 Rerun every touched suite and the live dry run. Verify: the counts and the unchanged registry hash are in `implementation-summary.md`.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the live dry run is recorded in `implementation-summary.md`
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
- [x] CHK-003 [P1] `perl`, `lsof`, `stat` and `awk` are on PATH: `command -v perl lsof stat awk` prints four paths
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `bash -n` exits 0 and `shellcheck -x` prints nothing for every changed shell file
- [x] CHK-011 [P0] Every changed script runs under macOS `bash` 3.2: the suites ran with `/bin/bash`
- [x] CHK-012 [P1] The script has no `--force`, `-D` or `kill` other than `kill -0`: the suite asserts both
- [x] CHK-013 [P1] No comment in a changed script names a packet, phase, task or finding id: `rg -n 'phase 0|T0[0-9][0-9]|REQ-|AC-' <changed scripts>` prints nothing
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Live dry run recorded with the registry and refs unchanged
- [x] CHK-022 [P1] The new reaper cases fail against the HEAD reaper
- [x] CHK-023 [P1] The guard cases fail against the HEAD guard, and the doctor cases against the HEAD module
- [x] CHK-024 [P0] Every reader of the provisioning list skips the `# regenerable:` lines: the provisioner, the doctor, the completeness test and the reaper's own loop were each run over the edited list
- [x] CHK-025 [P1] The follow-up reaper cases fail against the unchanged reaper (`PASS=96 FAIL=6`) and pass after it (`PASS=102 FAIL=0`)
- [x] CHK-026 [P1] No SQLite file and no `.state/` path is on the regenerable list: the live dry run still keeps four worktrees for `.skilled/skills/.state/` files
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class: the weak process probe, the unbounded git calls and the aborting refusal are `class-of-bug` in one script; the numbered lane is a new feature.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `plan.md` section "Affected Surfaces" lists the call-line check and the fallback exception.
- [x] CHK-FIX-003 [P0] Consumer inventory: the doctor is the only reader of the new stdout rows.
- [x] CHK-FIX-004 [P1] Adversarial cases are in the suite: an empty `lsof`, a wedged `git status`, a refused `branch -d`, a stash entry, a locked worktree, an ignored spec file, an orphan folder, a mismatched pair.
- [x] CHK-FIX-005 [P1] Matrix axes: lane (wrapper, numbered), flag (absent, `--numbered`, `--dry-run`), clock (now, later), process listing (complete, empty).
- [x] CHK-FIX-007 [P1] Evidence is pinned to the working tree of this run; nothing is committed.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret is read or written by any changed file
- [x] CHK-031 [P0] No real worktree or branch of this repository was removed, moved or modified; removal ran only in scratch repositories
- [x] CHK-032 [P1] The reaper resolves its helpers from its own directory, not from the repository's tree
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, rule 17, the catalog entry and the READMEs agree on the flags, the 48 hour default, the six hour window and the switch
- [x] CHK-041 [P1] The comments in the changed scripts state the reason, not the history
- [x] CHK-042 [P2] Phase 005's stale Known Limitations lines are listed in `implementation-summary.md`, not edited
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files are under the session scratch directory or `$TMPDIR`
- [x] CHK-051 [P1] No scratch repository or stub process outlives the run
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 16 | 16/16 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-27
<!-- /ANCHOR:summary -->

---
