---
title: "Implementation Plan: Phase 6: numbered-worktree-cleanup"
description: "One new lane in the shell reaper, built on the phase 005 bounded-git helper, started by a throttled detached call in the SessionStart guard and counted by an informational doctor line, each proven by a test that fails against HEAD."
trigger_phrases:
  - "numbered worktree cleanup plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: numbered-worktree-cleanup

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2 (macOS) with `perl` for the bound, Node for the doctor module |
| **Framework** | None; `node:test` for the doctor |
| **Storage** | One stamp file and one log file in the repository's shared git directory |
| **Testing** | The shell suites and the doctor test file named in `tasks.md`, run in scratch repositories |

### Overview
`worktree-reaper.sh` reads git's registry as records, sends a `worktrees/NNN-slug` worktree through an ordered list of keep rules when `--numbered` is given, and removes it with plain git commands only when none fires. The guard starts that sweep detached behind a six-hour stamp. The doctor runs a dry run and counts the verdict rows. Every rule fails toward keeping, and every removal in a test happens in a scratch repository.
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
- [x] `bash .skilled/bin/tests/worktree-reaper.test.sh`, `worktree-guard.test.sh`, `fsmonitor-daemon-reaper.test.sh`, `worktree-session.test.sh` and `bounded-git.test.sh` print `FAIL=0`, and the doctor file passes
- [x] The new reaper, guard and doctor cases fail against HEAD copies
- [x] `validate.sh <packet folder> --strict` prints `RESULT: PASSED`
- [x] Docs updated (spec, plan and tasks agree on the flags, switches and rules)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: an ordered keep-rule list with a dry-run-aware action wrapper.

### Key Components
- **`_worktree_records`**: turns `git worktree list --porcelain` into one record per worktree (path, branch, detached, locked), joined by the unit separator because paths hold spaces. It reads the listing first and returns git's status when the read fails, so a failed or timed-out registry is never an empty one: the caller then judges nothing, reports no orphan and removes no marker or socket dir. The loop reads the records on fd 3 so no command inside the loop can consume them.
- **`_numbered_keep_reason`**: prints the first reason to keep, in the order pair, locked, idle, merged, stash, status, ignored paths, process; it prints nothing when the worktree may go. The three activity times are read before `git status`, which can rewrite the index, and status runs with `--no-optional-locks`.
- **`_ignored_is_regenerable`**: allows `node_modules`, `dist`, `build` and the usual tool caches by path component, the outputs `worktree-provision-paths.txt` names, and links (or folders of links) into the primary checkout. It refuses anything under `specs/`, any path component that is a SQLite name or `.state`, and a wholly ignored folder that holds one of those names anywhere inside it.
- **`_branch_content_in_live`**: merges the branch into the live tip in memory and compares trees, with the merge's object writes redirected to a throwaway directory that reads through to the repository's objects and is deleted afterwards.
- **`_busy_pid_in`**: one bounded `lsof -nP -d cwd -Fpn` listing; an empty listing, a timed-out one and one that exits non-zero all print `unknown` and the caller keeps.
- **`_remove_worktree`**: ends the daemon through the sibling reaper, then `git worktree remove`, then `git branch -d`, all through `act` so `--dry-run` prints them; a refusal returns non-zero and the loop moves on.
- **`__guard_sweep_numbered`** in `worktree-guard.sh`: checks the switch, the stamp age and the reaper path, writes the stamp, then starts the sweep with `nohup` in a subshell with all descriptors redirected.
- **`numberedWorktreesDetail`** in the doctor: runs `--numbered --dry-run` under a 45 second bound and counts `numbered verdict=` and `orphan path=` rows.

### Data Flow
The reaper prints human log lines on stderr and machine rows on stdout: `numbered verdict=<would-reap|reaped|keep> worktree=... branch=... reason=...` and `orphan path=...`. The doctor reads only stdout. The guard sends both streams to `worktree-reaper-numbered.log` in the shared git directory.

### Decisions
- **D1, the idle clock is the newest of three files' mtimes.** The branch reflog catches commits, the worktree's own `logs/HEAD` catches checkouts and resets, and the index catches edits and `git add`. One missing file is skipped; all three missing keeps the worktree.
- **D2, merged means an ancestor of the primary checkout's HEAD.** It is the rule the wrapper lane already uses. A squash-merged branch is not an ancestor and is kept.
- **D3, the allowlist is by path component, not a pattern list of whole paths.** A `node_modules` nested three folders down is still regenerable, and `specs/` is checked first so nothing under it can pass. Names that can hold session state (`*.sqlite`, `*.sqlite3`, `*.db`, `*-wal`, `*-shm`, `.state`) are refused next, before any component can vouch for a path, because git reports a wholly ignored folder as one entry and `dist` would otherwise hide a database inside it.
- **D4, one `lsof` per surviving candidate, not a shared listing.** The listing is taken last, just before removal, so a process that started during the earlier checks is seen.
- **D5, the default lane runs with `--numbered` too.** The sweep command is `worktree-reaper.sh --numbered`; the wrapper lane is conservative already and the prune of stale sockets and markers is wanted at the same moment.
- **D6, the stamp is written before the spawn.** A stamp that cannot be written spawns nothing, so a read-only git directory cannot cause a sweep on every start.
- **D7, skip the real-daemon case when the daemon does not answer, rather than lengthen a bound.** A trace of a failing run showed git's `stop` returning at once with the daemon still alive. Raising the suite's stop timeout to 30 seconds and the post-stop wait to 15 seconds both left the failure in place, and a fresh daemon in a clean scratch repository left `git status` waiting for over three minutes. The daemon had wedged, which git's stop cannot reach, so the reaper correctly fell back to SIGTERM.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/bin/worktree-reaper.sh` | Wrapper lane, socket and marker sweep | update | `worktree-reaper.test.sh` new cases fail at HEAD |
| `.skilled/bin/worktree-guard.sh` | SessionStart warning | update | `worktree-guard.test.sh` fails at HEAD |
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Worktree base check and the daemon line | update | three new cases fail at HEAD |
| `.skilled/bin/worktree-session.sh` | Starts the fsmonitor sweep, creates worktrees | not a consumer | `worktree-session.test.sh` unchanged count |
| `.claude/hooks/worktree-guard.sh` and the Codex, Cursor and Devin entries | Symlinks to the guard | not a consumer | `ls -l` shows each resolves to `.skilled/bin/worktree-guard.sh` |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Lists hook kill-switches | update | rows for the worktree and git timeout settings; the Variable-column count is 197 and the drift guard passes |

Required inventories:
- Same-class producers: every `git` call line in `worktree-reaper.sh` after the change goes through `git_bounded`; the one raw `git -c core.fsmonitor=false` is the fallback definition when the library is missing.
- Consumers of the reaper's stdout: the doctor (new) and nothing else; the wrapper lane's `DRY_RUN would:` lines keep their shape.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup records the baselines, Implementation takes the reaper, its tests, the guard, the doctor and the docs in that order, and Verification reruns every suite and the validators.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Reaper lanes in scratch repositories: one worktree per keep rule, a stub `lsof`, a stub `git` that wedges `status`, a ref lock that makes `branch -d` refuse | `bash` suite |
| Integration | The real guard against a scratch repository with a stub reaper that records each start | `bash` suite |
| Integration | The doctor's worktree row with a stub reaper script | `node --test` |
| Live | `worktree-reaper.sh --numbered --dry-run` against this repository, registry and refs hashed before and after | the command |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `bounded-git.sh` (phase 005) | Internal | Green, untracked until committed | Falls back to an unbounded call with fsmonitor off |
| `fsmonitor-daemon-reaper.sh` | Internal | Green | A failure is logged and removal continues |
| `worktree-naming.sh validate-pair` | Internal | Green | A missing validator keeps every numbered worktree |
| `perl`, `lsof`, `stat` | External | Green | No `perl` means no bound; no `lsof` or `/proc` means every worktree is kept |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The sweep removes a worktree the operator wanted, or the hook delays a session start.
- **Procedure**: Set `SPECKIT_WORKTREE_AUTOREAP=0` at once. A removed worktree's branch is deleted only by `branch -d` after the merge check, so its commits are reachable from the branch it merged into; `git worktree add` recreates the folder. To undo the code, revert the commit that carries this phase.
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
