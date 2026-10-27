---
title: "Feature Specification: Phase 5: reaper-hardening"
description: "Closes the three review gaps and the deleted-repository gap in the fsmonitor daemon reaper, and puts the hook and launch git calls that read the index under one shared timeout helper."
trigger_phrases:
  - "reaper hardening"
  - "phase 5 reaper hardening"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: reaper-hardening

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
| **Phase** | 5 of 5 |
| **Predecessor** | 004-push-gate-git-timeout |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met, the reaper suite and the hook suites pass, and the GIT-047 run is recorded in `implementation-summary.md`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the fsmonitor daemon leak and worktree relocation regression specification. It clears the Known Limitations of phase 003 that were left open (items 2 and 4) and extends the phase 004 timeout to the shell hooks and the launcher, which phase 004 named as out of scope.

**Scope Boundary**: The reaper script and its test, one shared bounded-git helper for shell and the hook and launcher call sites that read the index or the working tree, and the sk-git docs that describe them. The relocation of worktrees (phase 002) and the checkout's own fsmonitor setting are not touched.

**Dependencies**:
- Phase 003 for the reaper this phase changes, and phase 004 for the timeout pattern the helper reuses.
- macOS `bash` 3.2, `perl` for the fork and wait bound, `lsof` and `ps`. No new package.

**Deliverables**:
- Three reaper fixes: a start-time recheck before each signal, no use of git's `stop` while a second daemon watches the same worktree, and a fresh worktree list before a stray is ended.
- An opt-in `--orphans` mode for daemons whose watched root no longer exists on disk.
- `lib/bounded-git.sh`, and its use at 34 call lines in the hooks and the launcher.
- Docs in sk-git: the false catalog line in GIT-034 and GIT-043, the new flags in the catalog entry and in GIT-047, and the GIT-047 run recorded.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The reaper checks only a pid's command line before it signals, so a pid recycled into another daemon during one run is signalled. It uses git's `stop`, which ends whichever daemon owns a worktree's socket, so with two daemons on one worktree it can end the one that was not chosen. It reads the worktree list once, so a worktree added mid-run has its new daemon classed stray and ended. Daemons of a repository deleted with `rm -rf` are never swept, and the pre-commit, pre-push and launch paths still call index-reading git with no time limit, so one wedged daemon stalls them as it stalled the push in phase 004.

### Purpose
No pid is signalled unless it is still the daemon the run listed. A daemon of a deleted repository can be found and ended on request, and never one whose root still exists. A wedged fsmonitor daemon costs a commit, a push or a launch one timeout that refuses instead of an open-ended hang.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Commands run read-only at HEAD before any change, with verbatim output:

```text
$ /bin/bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh
fsmonitor-daemon-reaper tests: PASS=126 FAIL=0

$ git show HEAD:.skilled/bin/fsmonitor-daemon-reaper.sh | grep -n '_is_daemon_pid "\$pid"'
221:    if ! _is_daemon_pid "$pid"; then
227:  ! _is_daemon_pid "$pid"
305:  _is_daemon_pid "$pid" || return 2
317:  if _is_daemon_pid "$pid"; then
326:  if _is_daemon_pid "$pid"; then
335:  if [ -n "$via" ] && ! _is_daemon_pid "$pid"; then
```

Reading: every identity check in the HEAD reaper is `_is_daemon_pid`, which tests the command line only. All daemons run the same command, so a recycled pid passes it. The suite has no case for the three review gaps or for a deleted root.

Unbounded index-reading call lines at HEAD, counted with `git show HEAD:<file> | grep -v '^\s*#' | grep -v echo | grep -cE '<git diff, ls-files, show, add or worktree add>'`: `.skilled/scripts/git-hooks/pre-commit` 25, `.skilled/scripts/git-hooks/pre-push` 2, `.skilled/hooks/git/pre-commit` 4, `.skilled/scripts/git-hooks/lib/mass-deletion-guard.sh` 2, `.skilled/bin/worktree-session.sh` 1. None runs under a time limit or with `-c core.fsmonitor=false`.

Recorded observation, quoted from phase 003 `implementation-summary.md` Known Limitations item 2 and not re-run here: daemons whose whole repository was deleted with `rm -rf` kept running, and six such daemons were ended by hand.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Recheck each listed pid's start time, with its command line, before every signal and every `stop`, and skip a pid whose start time changed.
- Use git's `stop` only when no other daemon watches the same worktree; otherwise signal the exact chosen pid.
- Read the worktree list again before a stray is ended, and skip a stray that is now registered.
- Add `--orphans` to report daemons whose watched root no longer exists on disk, and with `--apply` end them by signal.
- Add `lib/bounded-git.sh` and route the index-reading git calls in the pre-commit, pre-push and legacy pre-commit hooks, the mass-deletion guard and the `worktree add` launch call through it, so a timeout fails closed.
- Fix the false "No `feature-catalog/` package exists" line in GIT-034 and GIT-043, add the new flags to the catalog entry and to GIT-047, and run GIT-047.

### Out of Scope
- The post-commit hook, `post-merge`, `post-rewrite`, `commit-msg` and `prepare-commit-msg` - their git calls are `rev-parse`, `config` and object reads, none of which reads the index or the working tree.
- `rev-parse`, `symbolic-ref` and `config` calls in `worktree-session.sh` - they do not read the index.
- The same false catalog line in the other eleven files of `owner-first-worktree-tooling/` - listed in `implementation-summary.md`, not changed here.
- Changing the checkout's `core.fsmonitor` setting - the timing in `implementation-summary.md` is for the operator's decision.
- Any `README.md` - the changes it needs are listed in `implementation-summary.md`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/fsmonitor-daemon-reaper.sh` | Modify | Start-time recheck, single-owner stop, fresh worktree list for strays, `--orphans` |
| `.skilled/bin/tests/fsmonitor-daemon-reaper.test.sh` | Modify | Failing-first cases for each fix, bounded real-daemon calls |
| `.skilled/scripts/git-hooks/lib/bounded-git.sh` | Create | `bounded_run`, `git_bounded`, and the timeout record the hooks read at exit |
| `.skilled/scripts/git-hooks/pre-commit` | Modify | Source the helper, arm it, bound 25 call lines, exit trap |
| `.skilled/scripts/git-hooks/pre-push` | Modify | Source the helper, arm it, bound 2 call lines, exit trap |
| `.skilled/scripts/git-hooks/lib/mass-deletion-guard.sh` | Modify | Count deletions through `git_bounded` |
| `.skilled/hooks/git/pre-commit` | Modify | Legacy helper: same helper, 4 call lines |
| `.skilled/bin/worktree-session.sh` | Modify | `worktree add` under a 60 second bound with fsmonitor off |
| `.skilled/scripts/git-hooks/tests/bounded-git.test.sh` | Create | Helper cases and a hung-git case for pre-commit and pre-push |
| `.skilled/bin/tests/worktree-session.test.sh` | Modify | Healthy and hung `worktree add` cases |
| `.skilled/skills/sk-git/feature-catalog/session-lifecycle/fsmonitor-daemon-reaper.md` | Modify | New flags, class, skip reasons |
| `.skilled/skills/sk-git/feature-catalog/feature-catalog.md` | Modify | One summary sentence for the reaper |
| `.skilled/skills/sk-git/manual-testing-playbook/owner-first-worktree-tooling/fsmonitor-daemon-reaper-scope-and-refusal.md` | Modify | Orphans and stale-state checks |
| `.skilled/skills/sk-git/manual-testing-playbook/owner-first-worktree-tooling/reaper-dry-run-no-mutation.md` | Modify | GIT-034: replace the false line with the catalog link |
| `.skilled/skills/sk-git/manual-testing-playbook/owner-first-worktree-tooling/prepush-remote-permission-gate.md` | Modify | GIT-043: same |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | With `ps` reporting a start time for a stray's pid that differs from the one the run listed, `--apply` prints `skipped pid=<pid> ... reason=start-time-changed`, signals nothing and leaves the process running. |
| REQ-002 | With two daemons watching one registered worktree, ending one of them never runs `git fsmonitor--daemon stop`; the chosen pid is signalled. With one daemon the stop is still used. |
| REQ-003 | A stray whose worktree appears in a fresh `git worktree list` is printed `skipped ... reason=registered-mid-run` and not ended. |
| REQ-004 | `--orphans` classes a daemon whose watched root does not exist as `class=orphan`, `--orphans --apply` ends it, and a daemon whose root exists is never ended by it. Without `--orphans` nothing changes. |
| REQ-005 | A git call that reads the index in the pre-commit or pre-push hook and times out makes the hook exit 1 with `BLOCKED [gate:git-timeout]`, whatever the gate would have decided on an empty answer. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Every index-reading call line named in section 3 runs with `-c core.fsmonitor=false` and a bound, through `git_bounded`. |
| REQ-007 | A hung `git worktree add` in `worktree-session.sh` ends the launch with a non-zero status within the bound and no session starts. |
| REQ-008 | The bound sends SIGTERM before SIGKILL, so git removes its index lock, and a host without `perl` runs the call unbounded instead of failing. |
| REQ-009 | The false catalog line in GIT-034 and GIT-043 is gone, the new flags are in the catalog entry and in GIT-047, and the GIT-047 run is recorded. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `/bin/bash .skilled/bin/tests/fsmonitor-daemon-reaper.test.sh` prints `FAIL=0`, and the cases for REQ-001 to REQ-004 fail against `git show HEAD:.skilled/bin/fsmonitor-daemon-reaper.sh`.
- **SC-002**: `/bin/bash .skilled/scripts/git-hooks/tests/bounded-git.test.sh` prints `FAIL=0`, and every hook suite that passed at HEAD still passes.
- **SC-003**: No fsmonitor daemon outside this run's scratch directories is signalled; the daemon pid list is the same before and after.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `perl`, `lsof`, `ps` on macOS | Low | The bound runs the command unbounded when `perl` is missing; the reaper already needs `lsof` and `ps` |
| Risk | A 20 second bound blocks a commit that is merely slow on a very large tree | Med | `SPECKIT_GIT_TIMEOUT=<seconds>` raises it, and the timeout message names the variable |
| Risk | `--orphans --apply` is machine-wide, so it ends a stranger's deleted-repository daemon | Med | It is opt-in, it checks the root again just before the signal, and a root that exists is never ended; tests filter the process list to their own stubs |
| Risk | A root on an unmounted volume reads as missing | Low | The cost of a wrong end is one cold start; the daemon would be useless without its volume |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A healthy hook run adds no more than a perl start per bounded call; the `pre-commit.test.sh` suite stays within 5 seconds of its HEAD time.
- **NFR-P02**: `--orphans` adds no `lsof` call beyond the one the reaper already makes per daemon.

### Security
- **NFR-S01**: The helper is read from the hook's own directory, not from the repository being committed, so an untrusted clone cannot substitute it.
- **NFR-S02**: The reaper signals only a pid whose command line and start time match the run's listing.

### Reliability
- **NFR-R01**: A timeout fails closed in a hook and fails the launch in `worktree-session.sh`; it never turns into a silent pass.
- **NFR-R02**: Every script runs on macOS `bash` 3.2.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no daemon has a deleted root, so `--orphans` prints `orphan=0` and signals nothing.
- Maximum input: `SPECKIT_GIT_TIMEOUT` is non-numeric or zero, so the helper uses 20 seconds.
- Failure path: `--orphans` with `--worktree` exits 2 and names the conflict. A hung hook git call exits 1 with `BLOCKED [gate:git-timeout]`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 7 shell files changed, 1 created, 3 test files |
| Risk | 12/25 | Hooks gate every commit and push; the helper fails closed |
| Research | 6/20 | The failure modes come from phase 003's review |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the checkout keep `core.fsmonitor=true`? The timing table in `implementation-summary.md` is the input; the decision is the operator's and this phase changes no config.
<!-- /ANCHOR:questions -->

---
