---
title: "Implementation Summary"
description: "The worktree reaper can now remove finished numbered worktrees on request, a throttled session-start sweep runs it in the background, and every git call and process probe it makes is bounded and fails toward keeping."
trigger_phrases:
  - "numbered worktree cleanup implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/006-numbered-worktree-cleanup"
    last_updated_at: "2026-10-27T22:45:00Z"
    last_updated_by: "claude"
    recent_action: "Built the numbered reaper lane, the session-start sweep and the doctor line"
    next_safe_action: "Operator commits the tree, then decides whether to widen the ignored-path allowlist"
    blockers: []
    key_files:
      - ".skilled/bin/worktree-reaper.sh"
      - ".skilled/bin/worktree-guard.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "62098141-a640-42f2-be0a-f0b9b06d61df"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-numbered-worktree-cleanup |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Finished numbered worktrees no longer pile up. `worktree-reaper.sh --numbered` removes a `worktrees/NNN-slug` worktree once its tree is clean, its branch is merged, nothing has touched it for 48 hours, no process works inside it and nothing irreplaceable is ignored in it. The SessionStart guard runs that sweep detached, at most once every six hours, and the doctor counts what a dry run would remove. Both lanes of the reaper also stopped trusting an empty process listing and stopped running unbounded git.

### Phase 6: numbered-worktree-cleanup

**Reaper.** Every keep rule fails toward keeping, and each prints its reason as a `numbered verdict=keep ... reason=...` row (`.skilled/bin/worktree-reaper.sh:362`). The order is: branch and folder form a numbered pair, not locked, newest of the branch reflog, the worktree's `logs/HEAD` and its index older than `--idle-hours`, branch an ancestor of the primary HEAD, no stash entry, empty `git status --porcelain --untracked-files=all`, every ignored path regenerable, and a complete process listing showing nobody inside. Removal runs the sibling fsmonitor reaper, then plain `git worktree remove` and `git branch -d` (`:280`). A refusal by either logs keep and the loop moves on. Unregistered `NNN-*` folders under the base print `orphan path=...` and are left alone (`:434`). The wrapper lane keeps its rules.

**Shared fixes.** The process probe is one bounded `lsof` listing, and an empty or timed-out listing prints `unknown`, which both lanes treat as busy (`:234`). Every git call goes through `git_bounded`, so fsmonitor is off and a hung call costs `SPECKIT_GIT_TIMEOUT` seconds. Records are read on fd 3 so no command in the loop can eat the list.

**Guard.** `worktree-guard.sh` writes `worktree-reaper-numbered.stamp` in the shared git directory and starts `worktree-reaper.sh --numbered` with `nohup` in a subshell, all descriptors redirected (`.skilled/bin/worktree-guard.sh:53`). It stops for `SPECKIT_WORKTREE_AUTOREAP=0`, `SPECKIT_WORKTREE_GUARD=off`, the shared kill-switch and orchestrated children. I also fixed a defect found on the way: outside a git repository the guard exited non-zero instead of 0, because `git rev-parse` failed inside an assignment under `set -e`.

**Doctor.** `numberedWorktreesDetail` (`.skilled/commands/doctor/scripts/git-setup-check.cjs:712`) runs `--numbered --dry-run` under a 45 second bound and adds one line to the worktrees row. It never changes the verdict.

**Docs and follow-ups.** Rule 17, the catalog entry (which wrongly said the reaper only touches `<repo>/.worktrees/`), GIT-034, the five READMEs, `.env.example`, the eleven playbook files with the false catalog line, and phase 003's Known Limitations items 2 and 4.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/worktree-reaper.sh` | Modified | Numbered lane, orphan report, bounded probe and git, refusal handling |
| `.skilled/bin/tests/worktree-reaper.test.sh` | Modified | 63 new assertions: empty-listing wrapper case and the numbered fixture |
| `.skilled/bin/worktree-guard.sh` | Modified | Throttled detached sweep, switch, non-git exit fix |
| `.skilled/bin/tests/worktree-guard.test.sh` | Created | 17 assertions |
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Modified | `numbered worktrees:` line |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | Modified | 3 new cases |
| `.skilled/bin/tests/fsmonitor-daemon-reaper.test.sh` | Modified | Real-daemon case runs only for a daemon that completes a status round trip |
| `.skilled/skills/sk-git/SKILL.md` | Modified | Rule 17 (SKILL.md is at the 5000 word limit) |
| `.skilled/skills/sk-git/README.md`, `feature-catalog/feature-catalog.md`, `feature-catalog/session-lifecycle/worktree-reaper.md` | Modified | Numbered lane, bounded calls, sweep, registry-based claim |
| `.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md` | Modified | Cross-reference row for the guard test |
| `.skilled/skills/sk-git/manual-testing-playbook/owner-first-worktree-tooling/` (12 files) | Modified | GIT-034 numbered dry run; catalog link in 11 files |
| `.skilled/bin/README.md`, `.skilled/scripts/git-hooks/README.md`, `.skilled/scripts/git-hooks/lib/README.md`, `.skilled/scripts/git-hooks/tests/README.md`, `.skilled/hooks/git/README.md` | Modified | Phase 005's listed rows plus the numbered lane |
| `.env.example` | Modified | `SPECKIT_WORKTREE_AUTOREAP`, `SPECKIT_WORKTREE_REAPER`, `SPECKIT_GIT_TIMEOUT`, `SPECKIT_WORKTREE_ADD_TIMEOUT` |
| `specs/sk-git/035-.../003-fsmonitor-daemon-lifecycle/implementation-summary.md` | Modified | Items 2 and 4 point at phase 005 |
| `specs/sk-git/035-.../spec.md` | Modified | Phase 6 map row and handoff row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every suite ran at HEAD first. The new reaper and guard tests were written before the code, and then run against `git show HEAD:` copies of the HEAD scripts placed in a temp tree beside the new tests. Every removal in a test ran in a scratch repository under `$TMPDIR`. The only run against this repository was `--numbered --dry-run`.

**Before and after, every suite run with `/bin/bash` or `node --test`:**

| Suite | HEAD | After |
|-------|------|-------|
| `.skilled/bin/tests/worktree-reaper.test.sh` | PASS=26 FAIL=0, exit 0 | PASS=89 FAIL=0, exit 0 |
| `.skilled/bin/tests/worktree-guard.test.sh` | new | PASS=17 FAIL=0, exit 0 |
| `.skilled/bin/tests/worktree-session.test.sh` | PASS=76 FAIL=0, exit 0 | PASS=76 FAIL=0, exit 0 |
| `.skilled/scripts/git-hooks/tests/bounded-git.test.sh` | PASS=36 FAIL=0, exit 0 | PASS=36 FAIL=0, exit 0 |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | 74 pass, 0 fail, exit 0 | 77 pass, 0 fail, exit 0 |
| `.skilled/bin/tests/fsmonitor-daemon-reaper.test.sh` | PASS=160 FAIL=1, exit 1 (real-daemon case, 1 clean run; a first run with a global fsmonitor override failed the same case) | PASS=159 FAIL=0, exit 0 (3 of 3 runs; the real-daemon case printed SKIP in each) |

**Failing first.** Against the HEAD reaper the new reaper file prints `PASS=57 FAIL=32` (exit 1): the numbered flag is unknown (`unknown flag: --numbered`, exit 2) and the HEAD wrapper lane removes a qualifying worktree when `lsof` prints nothing. Against the HEAD guard the new guard file prints `PASS=3 FAIL=14`. Against the HEAD doctor module, the three new cases each print `not ok`.

**Live dry run.** `bash .skilled/bin/worktree-reaper.sh --numbered --dry-run` in this repository exited 0 in about 1.4 seconds. The hashes of `git worktree list --porcelain` and `git for-each-ref` were equal before and after. All 11 numbered worktrees print `keep ... reason=active within the last 48 hours`. To see the rules behind the idle test, the same command with `WORKTREE_REAPER_NOW` set 30 days ahead (still a dry run, hashes equal) prints, per worktree: 217, 145, 232, 239 and 240 not merged into the live branch; 218, 234, 236 and 237 uncommitted or untracked files; 235 and 238 an ignored path that is not regenerable, `.skilled/skills/sk-vision/hooks/opencode/sk-vision.js`. Nothing in this repository would be removed today.

**README checks (`check_readme_references.py` unresolved / `check_derived_readme_counts.py` failures), before and after:**

| README | Before | After |
|--------|--------|-------|
| `.skilled/bin/README.md` | 0 / 1 | 0 / 1 |
| `.skilled/scripts/git-hooks/lib/README.md` | 2 / 0 | 2 / 0 |
| `.skilled/scripts/git-hooks/README.md` | 5 / 0 | 6 / 0 |
| `.skilled/scripts/git-hooks/tests/README.md` | 0 / 0 | 0 / 0 |
| `.skilled/hooks/git/README.md` | 4 / 0 | 4 / 0 |
| `.skilled/skills/sk-git/README.md` | 0 / 0 | 0 / 0 |

The one new unresolved reference is the `bounded-git.sh` line in the git-hooks tree. The checker resolves tree names against `git ls-files`, and the file is still untracked. With a scratch copy of the index that lists it (the real index was not touched) the count returns to 5. The pre-existing failures are not caused by this phase.

**Item 10, the real-daemon assertion.** The cause was not the suite's 2 second stop bound. A trace of a failing run showed git's `stop` returning at once and the daemon still alive after the reaper's one second wait. Raising `FSMON_STOP_TIMEOUT` to 30 seconds, and then adding a 15 second post-stop wait, left the case failing, so both were backed out. Separately, a fresh daemon in a clean scratch repository left `git status` waiting for over three minutes and survived `git fsmonitor--daemon stop` ("fsmonitor--daemon is not running"); it had to be ended by its pid. That is the wedge the parent packet describes, and the reaper's SIGTERM fallback (`via=term`) is the right response to it. The case now runs only when the real daemon completes a bounded `git status --porcelain` round trip, kills the daemon it started and prints `SKIP` otherwise, so a daemon that answers and is not ended by git's stop still fails. In three consecutive runs after the change, every one printed `SKIP` for that case on this loaded host (PASS=159 FAIL=0), so the `via=stop` path had no real-daemon coverage here; a quiet host runs it. I could not show the case passing on this host.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Idle time is the newest of the branch reflog, the worktree's `logs/HEAD` and its index file, read before `git status` | Each catches a different activity (commit, checkout, edit), and `git status` can rewrite the index and make every worktree look fresh |
| The ignored-path allowlist is by path component, with `specs/` refused first | A nested `node_modules` is as regenerable as a top-level one, and an ignored spec file can never be rebuilt |
| One `lsof` listing per surviving candidate | The process check runs last, so a process that started during the earlier checks is seen |
| The stamp is written before the sweep is spawned | A git directory that cannot be written then spawns nothing, rather than a sweep on every start |
| The doctor reads stdout rows, not log lines | The rows are a stable contract; the stderr text is for people |
| The real-daemon case skips a daemon that fails a status round trip instead of lengthening a bound | Two longer bounds were tried and neither changed the outcome; the cause is a wedged daemon |
| Rule 17 states the lane in about 80 words | `SKILL.md` is at the 5000 word limit its validator enforces, so the detail lives in the catalog entry |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Reaper, guard, session, bounded-git suites and the doctor file | PASS=89, PASS=17, PASS=76, PASS=36, 77 pass; each exit 0 |
| New cases against HEAD copies | reaper PASS=57 FAIL=32, guard PASS=3 FAIL=14, doctor 3 of 3 `not ok` |
| `bash -n` and `shellcheck -x` on the 6 changed shell files | exit 0 each, no output |
| `rg` for phase, task or requirement ids in the changed scripts | no match |
| `worktree-reaper.sh --numbered --dry-run` against this repository | exit 0, registry and refs unchanged, 11 verdict rows |
| `validate-playbook-package.cjs --package .skilled/skills/sk-git/manual-testing-playbook` | `PASS package=sk-git ... violations=0 warnings=0`, exit 0 |
| `validate_skill_package.py .skilled/skills/sk-git` | exit 0 (`package_skill.py --check: PASS`) |
| `validate.sh <this folder> --strict` | `RESULT: PASSED`, Errors: 0, Warnings: 0 (after `repair-derived.cjs --apply` on derived drift) |
| `validate.sh <parent> --recursive` | `RESULT: PASSED` seven times (the parent and its six children), after `repair-derived.cjs --apply` on the parent and on phase 003 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The allowlist keeps most real worktrees here.** Compiled or bundled output that is not under `dist/` or `node_modules/`, such as `.skilled/skills/sk-vision/hooks/opencode/sk-vision.js`, counts as not regenerable, so a worktree holding it is kept for good. Add the paths the operator accepts to `_ignored_is_regenerable`, or list them in `worktree-provision-paths.txt`.
2. **A squash-merged branch is never removed.** It is not an ancestor of the live branch, so the reaper keeps it and the operator removes it.
3. **`bounded-git.sh` and the new guard test are untracked.** The reaper falls back to an unbounded call with fsmonitor off when the library is missing, so commit both with this phase.
4. **Phase 005's documents are stale in places this phase fixed and did not edit.** Its Known Limitations items 1, 4 and 6 and the "README changes recommended, not made" table describe work done here.
5. **The real-daemon case can skip.** On a host where fresh daemons wedge it prints `SKIP` and the reaper's `via=stop` path then has no real-daemon coverage in that run. A wedged daemon can also outlive the case even after the SIGTERM the skip branch sends: one such daemon, watching a deleted scratch repository, was found after the runs and ended by hand by its pid.
6. **`ENV-REFERENCE.md` has no row for `SPECKIT_WORKTREE_AUTOREAP`.** The switch is in `.env.example`, the READMEs and the catalog entry.
<!-- /ANCHOR:limitations -->

---
