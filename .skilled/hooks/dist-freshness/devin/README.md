---
title: "Devin Dist Freshness: Shell Check Link"
description: "Browsability link to the per-runtime dist staleness check that Devin runs after an edit and once at session start."
trigger_phrases:
  - "devin dist freshness"
  - "devin dist staleness check"
  - "devin stale build warning"
version: 1.0.0.0
---

# Devin Dist Freshness: Shell Check Link

---

## 1. OVERVIEW

`hooks/dist-freshness/devin/` holds one browsability symlink to the per-runtime dist staleness check. Devin runs the target after an edited file at `PostToolUse` for the owning package, and once at `SessionStart` with `--all` for cross-package coverage.

The target is a Python 3 script despite the `.sh` suffix. It always exits 0 and surfaces its result as a stdout banner. The real file lives under `sk-code/sk-code-quality/scripts/`.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | Behavior | On error |
|---|---|---|---|
| `check-dist-staleness.sh` | Symlink to [`../../../skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh`](../../../skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh) | Link only. The target checks a watched package for stale compiled output, warns with the rebuild command and, in `--all` mode, rebuilds when `SPECKIT_DIST_AUTO_REBUILD` is on. | Always exits 0. A check error prints a `DIST FRESHNESS CHECK ERROR` banner and a failed rebuild falls back to the stale warning. |

---

## 3. RELATED

- [`../README.md`](../README.md): the dist freshness concern, its two modes and its switches.
- [`../../../skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh`](../../../skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh): the real script this folder links to.
- [`../cursor/README.md`](../cursor/README.md): the Cursor entry for the same script.
