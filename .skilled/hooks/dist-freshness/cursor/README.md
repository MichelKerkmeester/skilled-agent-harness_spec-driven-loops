---
title: "Cursor Dist Freshness: Shell Check Link"
description: "Browsability link to the per-runtime dist staleness check that Cursor runs after an edit and once at session start."
trigger_phrases:
  - "cursor dist freshness"
  - "cursor dist staleness check"
  - "cursor stale build warning"
version: 1.0.0.0
---

# Cursor Dist Freshness: Shell Check Link

---

## 1. OVERVIEW

`hooks/dist-freshness/cursor/` holds one browsability symlink to the per-runtime dist staleness check. Cursor runs the target after an edited file at `PostToolUse`, scoped to the package that owns the file, and once at `SessionStart` with `--all`.

The target is a Python 3 script despite the `.sh` suffix. It always exits 0 and never blocks the session. The real file lives under `sk-code/sk-code-quality/scripts/`.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `check-dist-staleness.sh` | Symlink to [`../../../skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh`](../../../skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh) | Link only. The target checks a watched package for stale compiled output, prints a bounded banner and, in `--all` mode, rebuilds a stale package when `SPECKIT_DIST_AUTO_REBUILD` is on. | Always exits 0. A check error prints a `DIST FRESHNESS CHECK ERROR` banner and a failed rebuild falls back to the stale warning. |

---

## 3. RELATED

- [`../README.md`](../README.md): the dist freshness concern, its two modes and its switches.
- [`../../../skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh`](../../../skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh): the real script this folder links to.
- [`../devin/README.md`](../devin/README.md): the Devin entry for the same script.
