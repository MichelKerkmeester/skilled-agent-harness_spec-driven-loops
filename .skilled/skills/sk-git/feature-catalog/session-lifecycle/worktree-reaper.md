---
title: "Worktree reaper"
description: "Companion script that prunes finished launch-wrapper worktrees and their leftover session state, never touching a human-created or still-active worktree."
trigger_phrases:
  - "worktree reaper"
  - "worktree-reaper.sh"
  - "reap only proven inactive worktrees"
  - "stale worktree socket cleanup"
importance_tier: "important"
version: 1.0.0.0
---

# Worktree reaper (worktree-reaper.sh)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The reaper is the cleanup companion to launch-wrapper session isolation: it keeps `.worktrees/` bounded over time without ever removing a worktree it cannot prove is both finished and inactive.

It only ever touches worktrees under `<repo>/.worktrees/`, never the main checkout, and never signals a process. Every behavior is a safe default, and `--dry-run` is the only flag.

---

## 2. HOW IT WORKS

### Reap-Only-Proven-Inactive Gate

A registered worktree is auto-removed only when it is the machine-owned launch-wrapper lane (`work/<runtime>/<slug>`, with its branch name and directory basename cross-checked to agree) AND all three of these hold at once: the working tree is clean (no uncommitted changes), its branch is merged into the live integration tip, and its session is proven inactive by a marker file whose recorded process id is now dead. The live integration tip is read from the primary checkout's actual current `HEAD`, not a possibly stale local `main` — using a stale `main` could make a real merge look unmerged, or worse, look merged when it is not. A missing or unreadable marker, or a marker recording a still-live pid, means keep: absence of proof of inactivity is never treated as proof of inactivity.

### Report-Only Categories

Detached worktrees, human task worktrees (`worktrees/NNN-slug`), and any wrapper worktree whose branch/directory pairing doesn't match are always report-only — their cleanup is left to the operator. `git worktree prune` still runs unconditionally first to clear stale administrative entries for already-deleted directories.

### Socket and Marker Cleanup

The reaper also prunes the short per-session socket directories under `~/.spk-wt-sock/` and the session marker files under the common git directory once their corresponding worktree no longer exists, so neither accumulates indefinitely alongside the worktrees they were created for.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/bin/worktree-reaper.sh` | Script | Worktree pruning gate, socket/marker cleanup |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/bin/tests/worktree-reaper.test.sh` | Automated test | Exercises the reap-only-proven-inactive gate and report-only categories |

---

## 4. SOURCE METADATA

- Group: Session Lifecycle
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `session-lifecycle/worktree-reaper.md`

Related references:
- [launch-wrapper-session-isolation.md](launch-wrapper-session-isolation.md) — Launch-wrapper session isolation
- [continuous-integration-autosync.md](continuous-integration-autosync.md) — Continuous integration autosync
