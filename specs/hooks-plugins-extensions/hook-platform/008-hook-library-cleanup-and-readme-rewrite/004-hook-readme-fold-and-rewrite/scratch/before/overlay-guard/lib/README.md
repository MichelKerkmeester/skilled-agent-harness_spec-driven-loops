---
title: "Overlay Guard: Shared Policy Core"
description: "Runtime-neutral core that asks the overlay engine's --guard query once per path and allows everything it cannot judge, with a fast exit for trees that carry no overlays."
trigger_phrases:
  - "overlay guard core"
  - "overlay engine guard query"
  - "overlay owned path"
version: 1.0.0.0
---

# Overlay Guard: Shared Policy Core

---

## 1. OVERVIEW

`lib/` holds the runtime-neutral policy for the overlay guard. The core judges no ownership itself. It asks the overlay engine's `--guard` query once per absolute path and treats exit 1 with a `refuse:` line as owned. A tree with neither `.skilled-overlays.json` nor `skilled-overlays/` allows on two file-existence checks without loading the engine. The core writes no stdout or stderr and never applies, captures or writes a file.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| [`overlay-guard.cjs`](./overlay-guard.cjs) | Shared core | Exports `evaluateWrite()`, `fileFieldPath()` and `pathsFromPatch()`. Resolves each path against the session directory, spawns the engine with a 3000 ms timeout and 1 MB buffer, and returns `allow` or `deny`. | Fails open. An engine error, timeout or unreadable setting allows and returns one note line for the adapter to print. |
| [`overlay-guard.test.cjs`](./overlay-guard.test.cjs) | `node --test` suite | Covers the no-manifest fast path, per-path guard answers, patch path extraction and the Claude, Codex, Cursor, Devin and Pi adapters. | Not applicable, the suite asserts behavior. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern README with the decision table and the engine contract.
- [`../../../commands/doctor/scripts/overlay-engine.cjs`](../../../commands/doctor/scripts/overlay-engine.cjs): the engine the core queries.
- [`../../shared/hook-flags.cjs`](../../shared/hook-flags.cjs): the kill-switch resolver the adapters use.
