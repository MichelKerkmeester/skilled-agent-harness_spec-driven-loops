---
title: "Git Hooks Check (Devin): SessionStart Adapter"
description: "Devin's link into the shared check-git-hooks.sh guard, which reports versioned git hooks that are missing, broken or mismatched in the effective hooks directory."
trigger_phrases:
  - "devin git hooks check"
  - "git hook drift warning"
  - "devin sessionstart guard"
version: 1.0.0.0
---

# Git Hooks Check (Devin): SessionStart Adapter

---

## 1. OVERVIEW

`git-hooks-check/devin/` holds the Devin entry for the installed-hook verification guard. Devin runs the guard once per session from its `SessionStart` entry in `.devin/hooks.v1.json`, with the command `bash .skilled/bin/check-git-hooks.sh`. The folder carries no code of its own. `check-git-hooks.sh` is a relative symlink to `../../../bin/check-git-hooks.sh`, so the real script stays in `.skilled/bin/` and this folder only mirrors it for browsing.

The guard compares every versioned hook under `.skilled/scripts/git-hooks/` with the effective hook directory from `git rev-parse --git-path hooks`. A missing link, a broken link, a link that points elsewhere or a link that is not executable becomes one warning line on stderr. When the live-sync loop is on, the guard also runs the installer from the main checkout. It always exits 0.

---

## 2. WHAT EACH FILE DOES

| File | Event | What it does | On error |
|---|---|---|---|
| `check-git-hooks.sh` | Devin `SessionStart` | Is a link to `../../../bin/check-git-hooks.sh`. The target classifies each versioned hook's symlink as `missing`, `broken`, `mismatched` or `non-executable`, prints one `[check-git-hooks] ...` line and repairs the links from the main checkout when live-sync is enabled. | Prints the warning line and exits 0. A failed self-heal prints `self-heal install failed` and still exits 0. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern index, with the drift states, the kill switches and the installer command.
- [`../../../bin/check-git-hooks.sh`](../../../bin/check-git-hooks.sh): the real script this link points at.
- [`../../../../.devin/hooks.v1.json`](../../../../.devin/hooks.v1.json): the Devin registration that runs the script.
