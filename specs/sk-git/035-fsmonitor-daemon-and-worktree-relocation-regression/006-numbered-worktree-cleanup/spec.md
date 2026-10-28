---
title: "Feature Specification: Phase 6: numbered-worktree-cleanup"
description: "Adds an opt-in numbered lane to the worktree reaper that removes merged, idle, empty-handed sk-git worktrees, starts it from a throttled SessionStart sweep, and bounds every git call and process probe the reaper makes."
trigger_phrases:
  - "numbered worktree cleanup"
  - "phase 6 numbered worktree cleanup"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: numbered-worktree-cleanup

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-reaper-hardening |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met, the reaper, guard, session, bounded-git and doctor suites pass, and the new reaper, guard and doctor cases fail against HEAD. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the fsmonitor daemon leak and worktree relocation regression specification. Phases 1 to 5 stopped daemons from outliving their worktree. This phase removes the worktrees themselves once they are finished, because every live worktree keeps a daemon, a `node_modules` tree and a watcher load alive, and finished numbered worktrees stay until someone removes them by hand.

**Scope Boundary**: The worktree reaper and its test, the SessionStart guard and a new test for it, the doctor's worktree check and its test, and the sk-git and bin docs that describe them. The wrapper lane's rules, the allocator and the finish workflow are not changed.

**Dependencies**:
- Phase 005 for `lib/bounded-git.sh`, which every reaper git call now goes through.
- Phase 003 for `fsmonitor-daemon-reaper.sh`, which the reaper runs before each removal.
- macOS `bash` 3.2, `perl` for the bound, `lsof`, `stat`, `awk`. No new package.

**Deliverables**:
- `worktree-reaper.sh --numbered`, with `--idle-hours` and an injectable clock, and the shared fixes for both lanes.
- A throttled, detached sweep started by `worktree-guard.sh`, with a `SPECKIT_WORKTREE_AUTOREAP=0` switch.
- An informational `numbered worktrees:` line in the doctor's worktree check.
- Updated sk-git rule 17, catalog entry, playbook GIT-034 and the five READMEs phase 005 listed but did not edit, plus four phase-005 follow-ups.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The reaper only removes launch-wrapper worktrees. The sk-git numbered worktrees (`worktrees/NNN-slug`) that sessions create are report-only, so they pile up: this repository has 11 linked worktrees registered today, each with its own fsmonitor daemon and dependency tree. The reaper's own checks are also weaker than the rest of the toolchain after phase 005: its process probe treats an empty `lsof` listing as "no process inside", its git calls are unbounded and run with fsmonitor on, and, read from the code, one refused `worktree remove` aborts the whole run under `set -e`.

### Purpose
A numbered worktree whose work is merged, whose tree holds nothing the operator could lose, and which nothing has touched for 48 hours is removed by a throttled background sweep, and every doubt (a stash entry, an ignored spec file, a locked tree, a silent process listing) keeps it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Commands run read-only at HEAD before any change, with verbatim output:

```text
$ git show HEAD:.skilled/bin/worktree-reaper.sh > $T/worktree-reaper.sh; bash $T/worktree-reaper.sh --numbered --dry-run
unknown flag: --numbered
exit=2

$ git show HEAD:.skilled/bin/worktree-reaper.sh | grep -v '^\s*#' | grep -E '\bgit( |$)' | wc -l
13
$ git show HEAD:.skilled/bin/worktree-reaper.sh | grep -v '^\s*#' | grep -E '\bgit( |$)' | grep -c core.fsmonitor
0

$ git -c core.fsmonitor=false worktree list | wc -l
12
```

Reading: HEAD has no numbered lane, none of its 13 git call lines bounds the call or turns fsmonitor off, and 11 linked worktrees are registered beside the primary checkout. Against the HEAD reaper, a wrapper worktree that qualifies for removal is removed even when the process listing is empty: the new empty-listing case in `worktree-reaper.test.sh` fails there (32 failing assertions in all, see `implementation-summary.md`).
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `--numbered`, `--idle-hours <n>` and `WORKTREE_REAPER_NOW` to `worktree-reaper.sh`: remove a registered numbered worktree only when it passes every keep rule, with `git worktree remove` then `git branch -d`, never forced.
- Report unregistered `NNN-*` folders under the worktree base, and touch none of them.
- Fix both lanes: bounded process probe where an empty or timed-out listing means busy, every git call through `git_bounded`, and a refused remove or branch delete logs keep and the loop continues.
- Start `worktree-reaper.sh --numbered` from `worktree-guard.sh` detached, at most once every six hours per repository, with `SPECKIT_WORKTREE_AUTOREAP=0` as the off switch.
- Add a `numbered worktrees:` line to the doctor's worktree check from a dry run, informational only.
- Update sk-git rule 17, the reaper catalog entry, GIT-034 and its playbook cross-reference, `.env.example`, and the five README files phase 005 listed.
- Close four phase-005 follow-ups: eleven playbook files with the false catalog line, phase 003's Known Limitations items 2 and 4, and the load-sensitive real-daemon assertion in the fsmonitor reaper suite.

### Out of Scope
- Removing detached or locked worktrees, other branch patterns, orphan folders or the main checkout - the reaper reports them and the operator decides.
- Squash-merged branches - they are not ancestors of the live branch, so they are kept; the operator removes them.
- Moving the worktrees out of the checkout (phase 002) and the checkout's own `core.fsmonitor` setting.
- Editing phase 005's documents - their stale Known Limitations lines are listed in `implementation-summary.md`.
- `system-deep-loop` files - another session edits them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/worktree-reaper.sh` | Modify | Numbered lane, orphan report, bounded probe and git calls, refusal handling |
| `.skilled/bin/tests/worktree-reaper.test.sh` | Modify | Empty-listing wrapper case and the numbered fixture: one worktree per keep rule |
| `.skilled/bin/worktree-guard.sh` | Modify | Throttled detached sweep, `SPECKIT_WORKTREE_AUTOREAP`, non-git exit fix |
| `.skilled/bin/tests/worktree-guard.test.sh` | Create | Returns at once, one sweep per window, each switch |
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Modify | `numberedWorktreesDetail` line in `checkWorktrees` |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | Modify | Three cases for the new line |
| `.skilled/bin/tests/fsmonitor-daemon-reaper.test.sh` | Modify | Real-daemon case runs only when the daemon answers a status request |
| `.skilled/skills/sk-git/SKILL.md` | Modify | Rule 17 states the numbered lane and its safety rules |
| `.skilled/skills/sk-git/feature-catalog/session-lifecycle/worktree-reaper.md` | Modify | Numbered lane, bounded calls, sweep; fix the `.worktrees/`-only claim |
| `.skilled/skills/sk-git/feature-catalog/feature-catalog.md` | Modify | Summary of the reaper entry |
| `.skilled/skills/sk-git/README.md` | Modify | Reaper row |
| `.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md` | Modify | Cross-reference row for the guard test |
| `.skilled/skills/sk-git/manual-testing-playbook/owner-first-worktree-tooling/reaper-dry-run-no-mutation.md` | Modify | GIT-034 numbered dry run |
| `.skilled/skills/sk-git/manual-testing-playbook/owner-first-worktree-tooling/*.md` (11 files) | Modify | Replace the false catalog line with the catalog link |
| `.skilled/bin/README.md`, `.skilled/scripts/git-hooks/README.md`, `.skilled/scripts/git-hooks/lib/README.md`, `.skilled/scripts/git-hooks/tests/README.md`, `.skilled/hooks/git/README.md` | Modify | The rows and sentences phase 005 listed, plus the numbered lane |
| `.env.example` | Modify | `SPECKIT_WORKTREE_AUTOREAP` and the timeout variables |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modify | Rows for the worktree and git timeout settings and for `SPECKIT_PRIVATE_SKILL_ROOTS`, and the recounted totals |
| `.skilled/commands/doctor/assets/doctor-git-setup.yaml` | Modify | The worktrees leg names the numbered worktrees line |
| `.skilled/changelog/skilled/v4.0.0.16.md` | Modify | The numbered sweep in the Git Worktrees section |
| `.skilled/skills/sk-git/changelog/v1.11.2.0.md` | Create | Release entry for the alignment fixes |
| `specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/003-fsmonitor-daemon-lifecycle/implementation-summary.md` | Modify | Known Limitations items 2 and 4 point at phase 005 |
| `specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/spec.md` | Modify | Phase 6 map row and handoff row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | With `--numbered`, a registered, unlocked, non-detached `worktrees/NNN-slug` worktree whose folder is `NNN-slug`, with an empty `git status --porcelain --untracked-files=all`, only regenerable ignored paths, a merged branch, no stash entry, no process inside and 48 idle hours is removed along with its branch; without the flag it is untouched. |
| REQ-002 | Each of these keeps a worktree, with the reason printed: fresh branch reflog, an ignored file under `specs/`, an ignored file off the allowlist, one untracked file, one unmerged commit, a live process inside, an empty process listing, a locked worktree, a stash entry for the branch, a branch and folder that do not form a numbered pair. |
| REQ-003 | The main checkout, detached worktrees, other branch patterns, unregistered folders and broken symlinks are never removed; an unregistered `NNN-*` folder is reported as `orphan path=...`. |
| REQ-004 | Removal is plain `git worktree remove` then `git branch -d`, never `--force` or `-D`; a refusal by either logs keep and the run continues with the next worktree and exits 0. |
| REQ-005 | `--dry-run` changes nothing in either lane and prints a `numbered verdict=would-reap` row per qualifying worktree. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Every git call in the reaper runs through `git_bounded` (fsmonitor off, `SPECKIT_GIT_TIMEOUT`), and a `git status` that never returns costs one bound and keeps the worktree. |
| REQ-007 | An empty or timed-out `lsof` listing counts as busy in both lanes. |
| REQ-008 | `worktree-guard.sh` returns before the sweep finishes, a second start inside six hours spawns nothing, the window is shared by all worktrees of one repository, and `SPECKIT_WORKTREE_AUTOREAP=0`, `SPECKIT_WORKTREE_GUARD=off`, the hook kill-switch and `AI_SESSION_CHILD=1` each stop it. |
| REQ-009 | The doctor's worktree check prints `numbered worktrees: <n> would reap, <n> keep, <n> orphan folders` from a dry run, shows `not checked (...)` on failure, and never changes the verdict. |
| REQ-010 | sk-git rule 17, the catalog entry, GIT-034, `.env.example` and the five READMEs describe the lane, the sweep and the switch, and the eleven playbook files and phase 003's items 2 and 4 carry no stale claim. |
| REQ-011 | The real-daemon assertion in the fsmonitor reaper suite no longer fails when the fresh daemon never answers, and still fails when an answering daemon is not ended by git's stop. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash .skilled/bin/tests/worktree-reaper.test.sh` prints `FAIL=0`, and run against `git show HEAD:` of the reaper in a temp copy it prints a non-zero `FAIL=`.
- **SC-002**: `bash .skilled/bin/worktree-reaper.sh --numbered --dry-run` in this repository removes nothing and prints one verdict row per live numbered worktree.
- **SC-003**: No real worktree or branch of this repository is removed, moved or modified; every removal ran in a scratch repository.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `lib/bounded-git.sh` from phase 005 | Low | The reaper falls back to an unbounded `git -c core.fsmonitor=false` when the library is missing |
| Risk | A removal loses work the operator wanted | High | Every doubt keeps: clean tree, regenerable-only ignored paths, merged branch, no stash, no process, 48 idle hours; `branch -d` never `-D`; the commits stay reachable from the branch if `branch -d` refuses |
| Risk | The sweep runs while a session starts in a worktree | Med | A process whose working directory is inside keeps the worktree, and the sweep's own listing must be complete |
| Risk | A squash-merged branch never counts as merged | Low | It is kept and the operator removes it; a false keep costs disk, not work |
| Risk | The hook slows a session start | Low | The sweep is detached and the hook returns after one `stat` and one `touch`; the guard test bounds the return at under 3 seconds |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `worktree-guard.sh` returns in under 3 seconds while the sweep it started runs for 4 seconds.
- **NFR-P02**: A wedged `git status` costs the sweep at most one `SPECKIT_GIT_TIMEOUT` per worktree.

### Security
- **NFR-S01**: The reaper signals no process other than the fsmonitor daemon of a worktree it removes, and its only `kill` is the `kill -0` liveness probe.
- **NFR-S02**: No `--force` or `-D` appears in the script.

### Reliability
- **NFR-R01**: Any uncertainty (unreadable stash, failed `ls-files`, silent or failed `lsof`, missing activity time, unreadable worktree registry) keeps the worktree, and an unreadable registry also keeps every session marker and socket dir.
- **NFR-R02**: Every changed script runs on macOS `bash` 3.2.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a repository with no linked worktree prints only the prune line and exits 0.
- Maximum input: `--idle-hours 200` keeps a worktree idle for 72 hours.
- Failure path: a non-numeric `--idle-hours` exits 2 naming the value; a refused `branch -d` leaves the branch and exits 0.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 4 scripts, 1 doctor module, 3 test files, about 25 docs |
| Risk | 15/25 | The lane deletes worktrees and branches, so every rule fails toward keeping |
| Research | 6/20 | The design was approved; the git and `lsof` behaviours were tested |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. Whether the sweep should also list squash-merged branches for the operator is deferred.
<!-- /ANCHOR:questions -->

---

