---
title: "Worktree Guard (Devin): SessionStart Isolation Warning"
description: "Devin's link into the shared worktree-guard.sh script, which warns when a top-level session runs on the shared checkout instead of an isolated worktree."
trigger_phrases:
  - "devin worktree guard"
  - "shared checkout warning"
  - "sessionstart isolation guard"
version: 1.0.0.0
---

# Worktree Guard (Devin): SessionStart Isolation Warning

---

## 1. OVERVIEW

`git-worktree-guard/devin/` holds the Devin entry for the worktree isolation guard. Devin runs `bash .skilled/bin/worktree-guard.sh` once per session from its `SessionStart` entry in `.devin/hooks.v1.json`. The folder carries no code of its own. `worktree-guard.sh` is a relative symlink to `../../../bin/worktree-guard.sh`, so the real script stays in `.skilled/bin/` and this folder only mirrors it for browsing.

The script warns when a top-level session is on the shared checkout, naming the branch and the `worktree-session.sh` command that isolates the next session. It stays silent inside a linked worktree, which is already isolated, and for `AI_SESSION_CHILD=1`, which is expected to share the parent's tree. It also starts the numbered-worktree sweep at most once per six hours unless `SPECKIT_WORKTREE_AUTOREAP=0`.

---

## 2. WHAT EACH FILE DOES

| File | Event | What it does | On error |
|---|---|---|---|
| `worktree-guard.sh` | Devin `SessionStart` | Is a link to `../../../bin/worktree-guard.sh`. The target checks `SPECKIT_WORKTREE_GUARD` and the shared switch, compares `git-dir` with `git-common-dir` and prints one `[worktree-guard] ...` line on the shared checkout. | Always exits 0. A failed sweep writes no stamp and spawns nothing. A missing kill-switch resolver leaves the guard enabled. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern index, with the silence switch, the legacy alias and the validation commands.
- [`../../../bin/worktree-guard.sh`](../../../bin/worktree-guard.sh): the real script this link points at.
- [`../../../bin/worktree-session.sh`](../../../bin/worktree-session.sh): the launcher the warning names as the fix.
- [`../../../../.devin/hooks.v1.json`](../../../../.devin/hooks.v1.json): the Devin registration that runs the script.
