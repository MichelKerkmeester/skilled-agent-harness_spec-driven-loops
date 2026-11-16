---
title: "Git Live-Follow (DSH): SessionStart Checkout Follower"
description: "DSH's link into the shared git-live-follow.sh primitive, run at session start by the repo-guards session-start advisories adapter as the live-sync-follow check."
trigger_phrases:
  - "dsh live follow"
  - "repo-guards session start"
  - "auto fast-forward checkout"
version: 1.0.0.0
---

# Git Live-Follow (DSH): SessionStart Checkout Follower

---

## 1. OVERVIEW

`git-live-follow/dsh/` holds the DSH mirror of the live-branch follower. `git-live-follow.sh` is a relative symlink to `../../../bin/git-live-follow.sh`. No DSH adapter loads through this folder. The `repo-guards` bundle runs the same script from `../../../skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs` on `agent/created`, with the check label `live-sync-follow`, the concern `live-follow` and the argument `--start`.

The check starts the script. It exits at once inside a linked worktree, checks the `live-sync` and `live-follow` switches in the main checkout, prints one `[live-sync]` line and backgrounds a single detached follower. The follower polls the remote, fast-forwards when the local tip is behind and reports a dirty collision or divergence without merging, rebasing or resetting anything.

---

## 2. WHAT EACH FILE DOES

| File | Event | What it does | On error |
|---|---|---|---|
| `git-live-follow.sh` | DSH `agent/created` through the `live-sync-follow` advisory check | Is a link to `../../../bin/git-live-follow.sh`. The target prints the live-sync status line, holds a per-checkout PID lock and starts the detached poll loop. Poll state changes are logged under `<git-common-dir>/live-follow/`. | The advisory check captures stderr and fails open. A linked worktree is silent. A missing `git` or a non-repo directory exits 1 before the status line. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern index, with the poll states, the kill switches and the log rotation details.
- [`../../../bin/git-live-follow.sh`](../../../bin/git-live-follow.sh): the real script this link points at.
- [`../../../skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs`](../../../skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs): the adapter that runs it on `agent/created`.
