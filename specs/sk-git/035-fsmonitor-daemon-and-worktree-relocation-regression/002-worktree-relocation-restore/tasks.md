---
title: "Tasks: Phase 2: worktree-relocation-restore"
description: "Ordered tasks for the worktree base write-back guard, the doctor in-checkout warning, and the operator-confirmed move of existing worktrees."
trigger_phrases:
  - "worktree relocation restore tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: worktree-relocation-restore

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

**Task Format**: each line starts with a `T` number, adds `[P]` when the task can run in parallel, then gives one action, its file in parentheses, and a `Verify:` clause with the command and its expected output.

The tasks use three shell variables. `CHECKOUT` is the repository root, `WS` is `.skilled/bin/worktree-session.sh`, and `DOC` is `.skilled/commands/doctor/scripts/git-setup-check.cjs`. Run every command from `CHECKOUT`.

Every command in this list runs with `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false` in the environment, so no child git call reads the fsmonitor daemon.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the base resolver and the write-back guard in `WS` (lines 219-227 and 293-295), and the tool versions. Verify: `sed -n '293,295p' .skilled/bin/worktree-session.sh` prints the `if ! git -C "$MAIN_ROOT" config --get speckit.worktreeBase` guard, and `git --version` prints 2.30 or later.
- [ ] T002 Record the wrapper suite baseline (`.skilled/bin/tests/worktree-session.test.sh`). Verify: `bash .skilled/bin/tests/worktree-session.test.sh` prints a summary ending `FAIL=0` before any edit.
- [ ] T003 [P] Record the doctor suite and the naming suite baselines (`.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs`, `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh`). Verify: `node --test --test-reporter=tap .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` prints `# fail 0`, and `bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` exits 0.
- [ ] T004 [P] Read the live key state and the worktree count, with no writes. Verify: `git config --get speckit.worktreeBase; echo "exit=$?"` prints `exit=1`, and `git worktree list --porcelain | grep -c '^worktree .*/\.worktrees/'` prints the count written in `spec.md` Measured Behavior. If it differs, update that block first.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Record the base source in `WS` next to the resolver (lines 219-227), so the write-back knows whether a non-empty `SPECKIT_WORKTREE_BASE` was set. Verify: `bash -n .skilled/bin/worktree-session.sh` exits 0, and `grep -c 'WT_BASE_SOURCE' .skilled/bin/worktree-session.sh` prints 3 or more.
- [ ] T006 Guard the write-back in `WS` (lines 293-295) so it writes only when the source is `SPECKIT_WORKTREE_BASE` and the key is unset. Otherwise log that the in-checkout default is in effect and name the variable that moves it. Verify: `bash -n .skilled/bin/worktree-session.sh` exits 0, and `grep -c 'in-checkout default' .skilled/bin/worktree-session.sh` prints 1.
- [ ] T007 Add the in-checkout check to `checkWorktrees` in `DOC` (lines 677-725). It returns DEGRADED with the existing repair string `WORKTREE_REPAIR` (`git-setup-check.cjs:86`) when the base sits inside the checkout and more than three linked worktrees exist. Verify: `node --check .skilled/commands/doctor/scripts/git-setup-check.cjs` exits 0.
- [ ] T008 Update `.skilled/bin/tests/worktree-session.test.sh`. Keep the env-base case (lines 146-167). Add a default-path case with no env variable and no key, asserting no key is written and the log line appears. Add an empty-variable case that gives the same result. Verify: `bash .skilled/bin/tests/worktree-session.test.sh` prints a summary ending `FAIL=0` that includes the two new cases.
- [ ] T009 Add doctor cases to `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` beside the base tests (lines 1037-1090). Cover: four or more linked worktrees inside the checkout (DEGRADED); three or fewer (PASS); a base outside the checkout (PASS); a sibling folder whose name starts with the checkout name (not inside); a symlink into the checkout (inside). Verify: `node --test --test-reporter=tap .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` prints `# fail 0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run the wrapper suite once after the last edit. Verify: `bash .skilled/bin/tests/worktree-session.test.sh` prints a summary ending `FAIL=0`.
- [ ] T011 Run the doctor suite once after the last edit, with the hostile variable cases. Verify: `SPECKIT_WORKTREE_BASE='' node --test --test-reporter=tap .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` and `SPECKIT_WORKTREE_BASE='../escape' node --test --test-reporter=tap .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` each print `# fail 0`.
- [ ] T012 Run the naming suite once more, against the baseline from T003. Verify: `bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` exits 0 with the same result as T003.
- [ ] T013 Read the doctor battery against this checkout, read-only. Verify: `node .skilled/commands/doctor/scripts/git-setup-check.cjs --json` prints a `worktrees` row with result DEGRADED, because the base sits inside the checkout and 11 linked worktrees exist.
- [ ] T014 Check CI for an exit-code gate on the doctor battery before merge. Verify: `grep -rln 'git-setup-check' .github 2>/dev/null || true` prints nothing, or each file it names is read and its exit-code use is written in `spec.md` section 10.
- [ ] T015 [Operator] Confirm in writing, for each idle worktree, that no runtime session is live in it. Verify: `ls "$(git rev-parse --git-common-dir)/worktree-sessions/" 2>/dev/null` lists the session markers, and `kill -0 "$PID"` fails for each marker's PID. Record the output of `ps -axo pid,command | grep 'fsmonitor--daemon' | grep -v grep` in the notes. Do not stop any daemon here.
- [ ] T016 [Operator] Save the rollback snapshot outside the checkout. Verify: `git worktree list --porcelain > "$HOME/worktrees-before-move.txt"` exits 0, and `wc -l < "$HOME/worktrees-before-move.txt"` prints a count above 0.
- [ ] T017 [Operator] Create the target folder and confirm it shares a device with the checkout, so each move is a rename. Verify: `mkdir -p "$HOME/worktrees/public" && df -P "$HOME" "$CHECKOUT" | awk 'NR>1 {print $1}' | sort -u | wc -l` prints 1.
- [ ] T018 [Operator] Set the key before any move, so no new worktree lands inside the checkout. Verify: `git config speckit.worktreeBase "~/worktrees/public"`, then `git config --get speckit.worktreeBase` prints `~/worktrees/public`.
- [ ] T019 [Operator] Move each confirmed idle worktree, one at a time, then repair it. Verify: `git worktree move "$OLD" "$NEW"` exits 0, `git worktree repair "$NEW"` exits 0, where `OLD` is the worktree's current path and `NEW` is its folder under `$HOME/worktrees/public` (both taken from the T016 list), and `git worktree list --porcelain` lists the new path. Record the PID from T015 that was watching the old path, for phase 003.
- [ ] T020 [Operator] Verify the end state after the last move. Verify: `git worktree list --porcelain | grep -c '^worktree .*/\.worktrees/'` prints 0, and each moved worktree still lists its branch.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, except the operator tasks T015 to T020, which close with their evidence or with a recorded deferral
- [ ] No `[B]` blocked tasks remaining
- [ ] Verification passed: T010, T011, T012 and T013 each show their expected output
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

- [ ] CHK-001 [P0] `spec.md` and `plan.md` name the same files and line ranges (`grep -n 'worktree-session.sh' spec.md plan.md` shows the same ranges).
- [ ] CHK-002 [P0] The research amendment in `spec.md` section 10 is accepted, or the wording in `research.md` section 6 is corrected before implementation.
- [ ] CHK-003 [P1] Baselines from T002 and T003 are recorded in the notes.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `bash -n .skilled/bin/worktree-session.sh` and `node --check .skilled/commands/doctor/scripts/git-setup-check.cjs` both exit 0.
- [ ] CHK-011 [P0] The explicit-env path prints no new warning on stderr. Verify: the env-base case in the wrapper suite still passes.
- [ ] CHK-012 [P1] The doctor change stays read-only. Verify: `grep -n "'config'" .skilled/commands/doctor/scripts/git-setup-check.cjs` shows only `--get` reads in the new code.
- [ ] CHK-013 [P1] The new result uses the existing DEGRADED vocabulary, and the repair string matches `WORKTREE_REPAIR` (`git-setup-check.cjs:86`).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] The wrapper suite ends `FAIL=0` with the default-path case included (`spec.md` SC-001).
- [ ] CHK-021 [P0] The doctor suite prints `# fail 0` (`spec.md` SC-002).
- [ ] CHK-022 [P1] Matrix rows 1, 3 and 5 in `plan.md` section 5 each have a test that names the row.
- [ ] CHK-023 [P1] The path containment cases in T009 pass: inside, outside, prefix sibling, and symlink.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] The finding class is `class-of-bug`: any launch path that persists a defaulted value to config (research.md section 5 Q1).
- [ ] CHK-FIX-002 [P0] The same-class producer inventory is complete. Verify: `grep -rn 'speckit.worktreeBase' .skilled/bin .skilled/skills/sk-git/scripts .skilled/commands/doctor` shows `worktree-session.sh:294` as the only config write.
- [ ] CHK-FIX-003 [P0] The consumer inventory is complete for the resolver, the reaper, the doctor and the docs (`plan.md` FIX ADDENDUM table).
- [ ] CHK-FIX-004 [P0] The path containment cases are tested: base equal to the checkout root, prefix sibling, outside root, and symlink into the checkout (T009).
- [ ] CHK-FIX-005 [P1] The matrix rows are listed in `plan.md` section 5 before implementation, with six rows.
- [ ] CHK-FIX-006 [P1] The hostile environment variants run in T011: an empty value and a value of `../escape`.
- [ ] CHK-FIX-007 [P1] The evidence is pinned to the fix commit SHA in `implementation-summary.md` once the change is committed, not to a moving branch range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential is read or written. The config key holds a directory path only.
- [ ] CHK-031 [P0] The doctor and the wrapper resolve the env value with the existing expansion rules (`~` and `~/`), and no new shell evaluation is added.

N/A for auth and authz: this is a local git tool that runs as the local user, with no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` name the same REQ and AC ids.
- [ ] CHK-041 [P1] Any code comment added names only the durable reason (why an explicit base is the only one persisted). It names no spec path, phase number or REQ id.
- [ ] CHK-042 [P2] The sk-git README needs no change: `.skilled/skills/sk-git/README.md:125` describes the override and the default, not the write-back.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Test fixtures live under the suites' temp roots, not in the checkout.
- [ ] CHK-051 [P1] The rollback snapshot from T016 stays outside the checkout.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-27
<!-- /ANCHOR:summary -->

---
