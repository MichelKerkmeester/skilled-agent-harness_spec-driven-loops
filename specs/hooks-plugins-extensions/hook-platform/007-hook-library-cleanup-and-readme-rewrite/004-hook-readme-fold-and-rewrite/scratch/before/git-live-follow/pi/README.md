---
title: "Git Live-Follow (Pi): session_start Checkout Follower"
description: "Pi's link into the shared git-live-follow.sh primitive, run on session_start by the session-start-advisories extension and surfaced through a Pi notification."
trigger_phrases:
  - "pi live follow"
  - "session start advisories"
  - "auto fast-forward checkout"
version: 1.0.0.0
---

# Git Live-Follow (Pi): session_start Checkout Follower

---

## 1. OVERVIEW

`git-live-follow/pi/` holds the Pi mirror of the live-branch follower. `git-live-follow.sh` is a relative symlink to `../../../bin/git-live-follow.sh`. Pi does not load this folder. Its `session_start` handler lives in `.pi/extensions/session-start-advisories.ts`, which runs `bash .skilled/bin/git-live-follow.sh --start` as the `live-sync-follow` check under the `live-sync` concern and passes any warning text to `ctx.ui.notify()`.

The script exits at once inside a linked worktree, checks the `live-sync` and `live-follow` switches in the main checkout, prints one `[live-sync]` line and backgrounds a single detached follower. The follower polls the remote, fast-forwards when the local tip is behind and reports a dirty collision or divergence without merging, rebasing or resetting anything.

---

## 2. WHAT EACH FILE DOES

| File | Event | What it does | On error |
|---|---|---|---|
| `git-live-follow.sh` | Pi `session_start` through the `live-sync-follow` advisory check | Is a link to `../../../bin/git-live-follow.sh`. The target prints the live-sync status line, holds a per-checkout PID lock and starts the detached poll loop. Poll state changes are logged under `<git-common-dir>/live-follow/`. | The extension captures the text and notifies instead of failing the session. A linked worktree is silent. A missing `git` or a non-repo directory exits 1 before the status line. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern index, with the poll states, the kill switches and the log rotation details.
- [`../../../bin/git-live-follow.sh`](../../../bin/git-live-follow.sh): the real script this link points at.
- [`../../../../.pi/extensions/session-start-advisories.ts`](../../../../.pi/extensions/session-start-advisories.ts): the Pi extension that runs the script on `session_start`.
