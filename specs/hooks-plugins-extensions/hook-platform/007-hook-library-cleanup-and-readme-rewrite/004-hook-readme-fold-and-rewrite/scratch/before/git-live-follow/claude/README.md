---
title: "Git Live-Follow (Claude): SessionStart Checkout Follower"
description: "Claude's link into the shared git-live-follow.sh primitive, which starts one detached follower that fast-forwards the main checkout as commits land on the live branch."
trigger_phrases:
  - "claude live follow"
  - "sessionstart checkout follower"
  - "auto fast-forward checkout"
version: 1.0.0.0
---

# Git Live-Follow (Claude): SessionStart Checkout Follower

---

## 1. OVERVIEW

`git-live-follow/claude/` holds the Claude entry for the live-branch follower. Claude runs `bash .skilled/bin/git-live-follow.sh --start` once per session from its `SessionStart` chain in `.claude/settings.json`. The folder carries no code of its own. `git-live-follow.sh` is a relative symlink to `../../../bin/git-live-follow.sh`, so the real script stays in `.skilled/bin/` and this folder only mirrors it for browsing.

`--start` exits at once inside a linked worktree, so a session tree is never moved from under the session that owns it. In the main checkout it checks the `live-sync` and `live-follow` switches, prints one `[live-sync]` status line and backgrounds a single follower. That follower polls the remote, fast-forwards when the local tip is behind and reports a dirty collision or divergence without merging, rebasing or resetting anything.

---

## 2. WHAT EACH FILE DOES

| File | Event | What it does | On error |
|---|---|---|---|
| `git-live-follow.sh` | Claude `SessionStart` (`--start`) | Is a link to `../../../bin/git-live-follow.sh`. The target prints the live-sync status line, holds a per-checkout PID lock and starts the detached poll loop. Poll state changes are logged under `<git-common-dir>/live-follow/`. | Exits 0 for every poll-time failure. A linked worktree is silent. A missing `git` or a directory that is not a checkout exits 1 before the status line. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern index, with the poll states, the kill switches and the log rotation details.
- [`../../../bin/git-live-follow.sh`](../../../bin/git-live-follow.sh): the real script this link points at.
- [`../../../../.claude/settings.json`](../../../../.claude/settings.json): the Claude registration that runs `--start`.
