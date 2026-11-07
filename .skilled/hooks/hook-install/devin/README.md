---
title: "Hook Install (Devin): Codex Hook Drift Check"
description: "Devin's link into install-codex-hooks.mjs, run in --check mode at session start to report repo copies left in Codex's user-global hook file."
trigger_phrases:
  - "devin codex hook drift"
  - "install codex hooks check"
  - "sessionstart hook drift"
version: 1.0.0.0
---

# Hook Install (Devin): Codex Hook Drift Check

---

## 1. OVERVIEW

`hook-install/devin/` holds the Devin entry for the Codex hook installer. Devin runs `node .skilled/bin/install-codex-hooks.mjs --check` once per session from its `SessionStart` entry in `.devin/hooks.v1.json`. The folder carries no code of its own. `install-codex-hooks.mjs` is a relative symlink to `../../../bin/install-codex-hooks.mjs`, so the real installer stays in `.skilled/bin/` and this folder only mirrors it for browsing.

Codex loads the repository's `.codex/hooks.json` itself for a trusted checkout. A copy of those entries in `~/.codex/hooks.json` makes every hook run twice, and an entry whose adapter was renamed runs a file that no longer exists. `--check` compares the two files without writing, exits 0 when they are in sync and exits 1 with a drift report when a repo-owned entry or a repo orphan remains.

---

## 2. WHAT EACH FILE DOES

| File | Event | What it does | On error |
|---|---|---|---|
| `install-codex-hooks.mjs` | Devin `SessionStart`, `--check` mode | Is a link to `../../../bin/install-codex-hooks.mjs`. The target classifies drift as `duplicate`, `orphaned` or `structure` and writes nothing in this mode. The Devin wrapper echoes `[codex-hooks] drift detected - run: node .skilled/bin/install-codex-hooks.mjs --check` when the check fails. | Exits 1 on drift or on a read or argument error. The wrapper prints the drift line and session start continues. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern index, with the reconcile rules, the flags and the modes.
- [`../../../bin/install-codex-hooks.mjs`](../../../bin/install-codex-hooks.mjs): the real installer this link points at.
- [`../../../../.devin/hooks.v1.json`](../../../../.devin/hooks.v1.json): the Devin registration that runs `--check`.
- [`../../../../.codex/hooks.json`](../../../../.codex/hooks.json): the project hook file the installer reads as the ownership source.
