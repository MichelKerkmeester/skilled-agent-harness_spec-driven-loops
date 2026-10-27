---
title: "Implementation Plan: Phase 5: reaper-hardening"
description: "Three guards and an orphans mode in the shell reaper, plus one shared bounded-git helper sourced by the pre-commit and pre-push hooks and the launcher, each proven by a test that fails against HEAD."
trigger_phrases:
  - "reaper hardening plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: reaper-hardening

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2 (macOS), with `perl` for the fork and wait bound |
| **Framework** | None |
| **Storage** | None; one temp directory per hook run holds the timeout record |
| **Testing** | The shell suites named in `tasks.md`, run with `/bin/bash` |

### Overview
The reaper keeps the daemon list it read at the start and rechecks each pid's command line and start time before it signals. Git's `stop` is used only when one daemon watches the worktree, and a stray is confirmed against a fresh worktree list. `--orphans` adds one class for daemons whose root is gone. A new `lib/bounded-git.sh` gives the hooks and the launcher `git_bounded`, which runs git with fsmonitor off under a bound and records a timeout in a file, so the hook's exit trap can refuse. Proof is a test per fix that fails against `git show HEAD:<file>`, the existing suites before and after, and the GIT-047 scenario in scratch repositories.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md` sections 2 and 3)
- [x] Success criteria measurable (`spec.md` section 5)
- [x] Dependencies identified (`spec.md` Phase Context)

### Definition of Done
- [x] All acceptance criteria met: no row in `acceptance-criteria.md` is `Unmet`
- [x] `/bin/bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh` prints `FAIL=0`
- [x] `/bin/bash .skilled/scripts/git-hooks/tests/bounded-git.test.sh` prints `FAIL=0`, and every suite listed in `tasks.md` T017 matches its HEAD result
- [x] `validate.sh <packet folder> --strict` prints `RESULT: PASSED`
- [x] Docs updated (spec, plan and tasks agree on the flags and the call sites)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a guarded subprocess runner with an exit-trap verdict.

### Key Components
- **`_daemon_state` in the reaper**: returns `live`, `changed` or `gone` for a listed pid by comparing the command line and the `lstart` the run recorded. `_end_daemon` signals only on `live`.
- **`_other_daemon_watches`**: lists the daemons afresh and reports whether any other pid has the worktree as its lowest DIR descriptor. Git's `stop` runs only when none does.
- **Fresh list for strays**: before a stray is ended, `git worktree list --porcelain` is read again into `REGISTERED`. A registered path is skipped.
- **`orphan` class**: an `out-of-scope` daemon whose root is deleted or not a directory, only under `--orphans`. The root is tested again immediately before the signal.
- **`lib/bounded-git.sh`**: `bounded_run` (the reaper's fork and wait pattern, SIGTERM then SIGKILL after 3 seconds), `git_bounded` (fsmonitor off, 20 seconds by default), `git_bound_arm` and `git_bound_finish`.

### Data Flow
A hook sources the helper from its own directory and arms it, which creates a temp directory. Each `git_bounded` call that expires writes `timeout` into that directory and prints one line. The hook's EXIT trap calls `git_bound_finish <status>`, which exits 1 with `BLOCKED [gate:git-timeout]` when the file exists and otherwise exits with the hook's own status. The record is a file because most calls run inside `$(...)` or `<(...)`, where a variable write or an `exit` would be lost.

### Decisions
- **D1, record plus exit trap rather than a check at each call site.** The hooks have 25 call lines inside command substitutions and process substitutions, many followed by `|| true`. One trap covers all of them and any later one.
- **D2, SIGTERM before SIGKILL in the shared helper.** `git add` and `git commit` write the index lock; a hard kill leaves it. The reaper keeps its own immediate-kill `run_bounded` because its calls only read.
- **D3, the reaper does not source the helper.** It is a standalone script that other tools copy and call by path. The pattern is copied once, not shared.
- **D4, no `perl` means no bound, not an error.** A hook that fails on a host without `perl` breaks every commit there. The call still runs with fsmonitor off.
- **D5, helper loaded from the hook's own directory.** The hooks run for every repository on the machine and the repository controls its own `.skilled`; the hook directory is the trusted one.
- **D6, `--orphans` rejects `--worktree`.** One narrows the run to a registered worktree and the other ranges over daemons outside any repository.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/bin/fsmonitor-daemon-reaper.sh` | Owns the identity check, the escalation and the classes | update | `fsmonitor-daemon-reaper.test.sh` new cases fail at HEAD |
| `.skilled/scripts/git-hooks/pre-commit` | 25 index-reading call lines | update | `bounded-git.test.sh` hung-git case, `pre-commit.test.sh` unchanged count |
| `.skilled/scripts/git-hooks/pre-push` and `lib/mass-deletion-guard.sh` | Deletion count and two diffs on every update push | update | `bounded-git.test.sh` hung-git case, `pre-push.test.sh` unchanged count |
| `.skilled/hooks/git/pre-commit` | Legacy helper, 4 call lines | update | `bash -n`, `pre-commit.test.sh` legacy cases |
| `.skilled/bin/worktree-session.sh` | `worktree add` at launch | update | `worktree-session.test.sh` F15 cases |
| `.skilled/scripts/git-hooks/post-commit`, `post-merge`, `post-rewrite`, `commit-msg`, `prepare-commit-msg` | `rev-parse`, `config`, object reads | not a consumer | `rg -n '\bgit (diff\|ls-files\|show\|add\|status)\b'` finds no call line outside `echo` |
| `fsmonitor-daemon-reaper` callers (`worktree-session.sh`, `worktree-reaper.sh`, `git-setup-check.cjs`) | Run the reaper with `--apply`, `--worktree`, `--idle-hours` and no summary parser | unchanged | `rg -n 'signalled=\|stray='` finds no parser |

Required inventories:
- Same-class producers: `rg -n '\bgit (-C "\$[A-Z_]+" )?(diff|ls-files|show|add|status|check-ignore|commit)\b' .skilled/scripts/git-hooks .skilled/hooks/git .skilled/bin/worktree-session.sh` after the change lists no call line outside `echo` and comments that skips `git_bounded`.
- Consumers of the changed reaper output: only the new `skipped` and `orphan` lines are added; every old line keeps its shape, and the summary gains `orphan=<n>` only under `--orphans`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup records the baselines, Implementation takes the reaper, the helper and the docs in that order, and Verification reruns every suite and the GIT-047 scenario.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Reaper guards and `--orphans` with stub daemons in scratch repositories; `bounded_run` and `git_bounded` with a `git` shim | `/bin/bash` suites |
| Integration | Real pre-commit and pre-push hook files against a hanging `git` shim; `worktree-session.sh` against a hanging `worktree add` | `/bin/bash` suites |
| Manual | GIT-047 in scratch repositories with real daemons | the playbook table, run as written |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `perl` | External | Green | The bound is skipped; the call runs unbounded with fsmonitor off |
| `lsof`, `ps` | External | Green | The reaper reports nothing attributable |
| Phase 003 reaper and its suite | Internal | Green | This phase edits that file |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A hook refuses a healthy commit or push, or the reaper signals a process it should not.
- **Procedure**: Revert the commit that carries this phase. To stop the bound without reverting, set `SPECKIT_GIT_TIMEOUT` high; to stop only the new reaper behaviour, omit `--orphans`.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
