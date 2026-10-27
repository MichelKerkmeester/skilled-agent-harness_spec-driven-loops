---
title: "Worktree reaper"
description: "A companion script that prunes finished launch-wrapper worktrees and their leftover session state, without ever touching a human-created or still-active worktree."
trigger_phrases:
  - "worktree reaper"
  - "worktree-reaper.sh"
  - "reap only proven inactive worktrees"
  - "stale worktree socket cleanup"
importance_tier: "important"
version: 1.0.1.0
---

# Worktree reaper (worktree-reaper.sh)

## 1. OVERVIEW

The reaper is the cleanup companion to launch-wrapper session isolation: it keeps `.worktrees/` bounded over time without ever removing a worktree it cannot prove is both finished and inactive.

It only ever touches worktrees under `<repo>/.worktrees/`, never the main checkout, and signals no process other than the fsmonitor daemon of a worktree it removes, which it ends through `fsmonitor-daemon-reaper.sh` before the removal. Every behavior is a safe default, and `--dry-run` is the only flag.

---

## 2. HOW IT WORKS

### Reap-Only-Proven-Inactive Gate

A registered worktree is auto-removed only when it is the machine-owned launch-wrapper lane (`work/<runtime>/<slug>`, with its branch name and directory basename cross-checked to agree) AND all three of these hold at once: the working tree is clean (no uncommitted changes), its branch is merged into the live integration tip, and its session is proven inactive by a marker file whose recorded process id is now dead. The live integration tip is read from the primary checkout's actual current `HEAD`, not a possibly stale local `main` — using a stale `main` could make a real merge look unmerged, or worse, look merged when it is not. A missing or unreadable marker, or a marker recording a still-live pid, means keep: absence of proof of inactivity is never treated as proof of inactivity.

### Report-Only Categories

Detached worktrees, human task worktrees (`worktrees/NNN-slug`), and any wrapper worktree whose branch/directory pairing doesn't match are always report-only — their cleanup is left to the operator. `git worktree prune` still runs unconditionally first to clear stale administrative entries for already-deleted directories.

### Socket and Marker Cleanup

The reaper also prunes the short per-session socket directories under `~/.spk-wt-sock/` and the session marker files under the common git directory once their corresponding worktree no longer exists, so neither accumulates indefinitely alongside the worktrees they were created for.

### fsmonitor Daemon End Before Removal

Before it removes a qualifying wrapper worktree, the reaper runs `fsmonitor-daemon-reaper.sh --apply --worktree <path> --repo <main checkout>`, so the worktree's daemon ends through git's own stop while the worktree still exists. A failure there is logged and the removal continues. `--dry-run` prints the planned reaper call as a `DRY_RUN would:` line beside the planned removal. `SPECKIT_FSMON_REAPER` overrides the script path.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/bin/worktree-reaper.sh` | Script | Worktree pruning gate, socket/marker cleanup |
| `.skilled/bin/fsmonitor-daemon-reaper.sh` | Script | Ends a removed worktree's fsmonitor daemon before the removal |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/bin/tests/worktree-reaper.test.sh` | Automated test | Exercises the reap-only-proven-inactive gate and report-only categories |

---

## 4. SOURCE METADATA

- Group: Session Lifecycle
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `session-lifecycle/worktree-reaper.md`

Related references:
- [launch-wrapper-session-isolation.md](launch-wrapper-session-isolation.md) — Launch-wrapper session isolation
- [continuous-integration-autosync.md](continuous-integration-autosync.md) — Continuous integration autosync
- [fsmonitor-daemon-reaper.md](fsmonitor-daemon-reaper.md): fsmonitor daemon reaper
