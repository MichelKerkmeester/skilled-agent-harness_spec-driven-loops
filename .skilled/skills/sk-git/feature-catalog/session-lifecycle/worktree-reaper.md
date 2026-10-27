---
title: "Worktree reaper"
description: "A companion script that prunes finished launch-wrapper worktrees and their leftover session state, and on opt-in finished numbered worktrees, without ever touching a still-active worktree or one holding anything unrecoverable."
trigger_phrases:
  - "worktree reaper"
  - "worktree-reaper.sh"
  - "reap only proven inactive worktrees"
  - "stale worktree socket cleanup"
importance_tier: "important"
version: 1.1.0.0
---

# Worktree reaper (worktree-reaper.sh)

## 1. OVERVIEW

The reaper is the cleanup companion to launch-wrapper session isolation: it keeps `.worktrees/` bounded over time without ever removing a worktree it cannot prove is both finished and inactive.

It reads git's worktree registry, so it finds worktrees under any base the launcher chose, not only `<repo>/.worktrees/`. It never touches the main checkout, and it signals no process other than the fsmonitor daemon of a worktree it removes, which it ends through `fsmonitor-daemon-reaper.sh` before the removal. The wrapper lane is the default and `--dry-run` previews it. The numbered lane is opt-in through `--numbered`, with `--idle-hours <n>` setting its idle threshold.

---

## 2. HOW IT WORKS

### Reap-Only-Proven-Inactive Gate

A registered worktree is auto-removed only when it is the machine-owned launch-wrapper lane (`work/<runtime>/<slug>`, with its branch name and directory basename cross-checked to agree) AND all three of these hold at once: the working tree is clean (no uncommitted changes), its branch is merged into the live integration tip, and its session is proven inactive by a marker file whose recorded process id is now dead. The live integration tip is read from the primary checkout's actual current `HEAD`, not a possibly stale local `main` — using a stale `main` could make a real merge look unmerged, or worse, look merged when it is not. A missing or unreadable marker, or a marker recording a still-live pid, means keep: absence of proof of inactivity is never treated as proof of inactivity.

### Report-Only Categories

Detached worktrees, locked worktrees, branches of any other pattern, and any wrapper worktree whose branch/directory pairing doesn't match are always report-only — their cleanup is left to the operator. Numbered worktrees (`worktrees/NNN-slug`) are report-only unless `--numbered` is given. `git worktree prune` still runs unconditionally first to clear stale administrative entries for already-deleted directories.

### Numbered Lane (`--numbered`)

A numbered worktree is a registered one on branch `worktrees/NNN-slug` whose folder is named `NNN-slug`, a pair `worktree-naming.sh validate-pair` accepts. It is removed only when every one of these holds, and it is kept, with the reason printed, when any one fails:

- it is not the main checkout, not detached, not locked, and its folder exists;
- `git status --porcelain --untracked-files=all` is empty;
- every ignored path is a regenerable item: `node_modules`, `dist`, `build`, test and tool caches, the package outputs `worktree-provision-paths.txt` names, or a provisioned link back to the primary checkout. Anything ignored under `specs/` is kept, because it is not regenerable;
- its branch is an ancestor of the primary checkout's `HEAD`, and no `git stash list` entry belongs to it;
- the newest of the branch reflog, the worktree's own `logs/HEAD` and its `index` file is older than `--idle-hours` (default 48). The three times are read before any git command that might refresh the index;
- a bounded `lsof` listing shows no process whose working directory is inside it. An empty, failed or timed-out listing counts as busy.

Removal ends the worktree's fsmonitor daemon first, then runs plain `git worktree remove` and `git branch -d`, never with force. If git refuses either one, the reaper logs keep and moves on to the next worktree. Folders under the base that match `NNN-*` but are not registered are reported as orphans and never touched. Each numbered worktree prints one stdout row, `numbered verdict=<would-reap|reaped|keep> worktree=... branch=... reason=...`, and each orphan prints `orphan path=...`; `/doctor:git` counts those rows from a dry run.

### Bounded Calls

Every git call the reaper makes goes through the shared bounded-git helper: a wall-clock bound (`SPECKIT_GIT_TIMEOUT`, default 20 seconds) with `core.fsmonitor=false`, so a wedged fsmonitor daemon or a stuck index lock costs one timeout. The process listing is bounded too (`FSMON_PROBE_TIMEOUT`, default 15 seconds). A refused `worktree remove` or `branch -d` is logged and the loop continues.

### Session-Start Sweep

`worktree-guard.sh`, the SessionStart hook, starts `worktree-reaper.sh --numbered` detached and returns at once. A stamp file in the repository's shared git directory limits it to one sweep per six hours, across every worktree of the repository. `SPECKIT_WORKTREE_AUTOREAP=0` stops the sweep, as do `SPECKIT_WORKTREE_GUARD=off` and the shared hook kill-switch. The sweep writes its output to `worktree-reaper-numbered.log` beside the stamp.

### Socket and Marker Cleanup

The reaper also prunes the short per-session socket directories under `~/.spk-wt-sock/` and the session marker files under the common git directory once their corresponding worktree no longer exists, so neither accumulates indefinitely alongside the worktrees they were created for.

### fsmonitor Daemon End Before Removal

Before it removes a qualifying wrapper worktree, the reaper runs `fsmonitor-daemon-reaper.sh --apply --worktree <path> --repo <main checkout>`, so the worktree's daemon ends through git's own stop while the worktree still exists. A failure there is logged and the removal continues. `--dry-run` prints the planned reaper call as a `DRY_RUN would:` line beside the planned removal. `SPECKIT_FSMON_REAPER` overrides the script path.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/bin/worktree-reaper.sh` | Script | Worktree pruning gates for both lanes, orphan report, socket/marker cleanup |
| `.skilled/bin/worktree-guard.sh` | Hook script | Starts the throttled numbered sweep at session start |
| `.skilled/scripts/git-hooks/lib/bounded-git.sh` | Shell library | The wall-clock bound and fsmonitor opt-out every reaper git call runs under |
| `.skilled/bin/fsmonitor-daemon-reaper.sh` | Script | Ends a removed worktree's fsmonitor daemon before the removal |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/bin/tests/worktree-reaper.test.sh` | Automated test | Exercises the wrapper gate, every numbered-lane keep rule, the empty process listing, the wedged git status and the orphan report |
| `.skilled/bin/tests/worktree-guard.test.sh` | Automated test | Proves the hook returns at once and spawns at most one sweep per window |

---

## 4. SOURCE METADATA

- Group: Session Lifecycle
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `session-lifecycle/worktree-reaper.md`

Related references:
- [launch-wrapper-session-isolation.md](launch-wrapper-session-isolation.md) — Launch-wrapper session isolation
- [continuous-integration-autosync.md](continuous-integration-autosync.md) — Continuous integration autosync
- [fsmonitor-daemon-reaper.md](fsmonitor-daemon-reaper.md): fsmonitor daemon reaper
- [numbered-worktree-workflows.md](../workflow-playbooks/numbered-worktree-workflows.md): Numbered worktree workflows
