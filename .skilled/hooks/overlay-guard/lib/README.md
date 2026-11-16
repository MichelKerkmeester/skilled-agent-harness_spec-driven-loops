---
title: "Overlay Guard: Shared Policy Core"
description: "Runtime-neutral policy core for the overlay guard. It asks the engine's --guard query once per path, allows every write it cannot judge and skips the engine on a tree with no overlays."
trigger_phrases:
  - "overlay guard core"
  - "overlay engine guard query"
  - "overlay owned path"
version: 1.0.0.0
---

# Overlay Guard: Shared Policy Core

---

## 1. OVERVIEW

`.skilled/hooks/overlay-guard/lib/` holds the runtime-neutral policy for the overlay guard. The core judges no ownership itself. It asks the overlay engine's `--guard` query once per absolute path. Exit 1 with a `refuse:` line means the overlay owns that path. Each adapter keeps its own event, payload and output channel.

A tree with neither `.skilled-overlays.json` nor a `skilled-overlays/` folder allows at once. Both names are checked on disk and the engine is never loaded. When either name exists, the core asks the engine where the manifest lives. A missing manifest allows without starting a process.

The tree root defaults to four levels above `lib/`. The engine path is `../../../commands/doctor/scripts/overlay-engine.cjs` from this folder.

The core writes no stdout or stderr and never applies, captures or writes a file. It returns `allow` or `deny`, a reason and a note line for anything it could not judge. An engine error, a timeout or an unreadable setting allows the write. The adapter prints that note.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `overlay-guard.cjs` | The policy core. It exports `evaluateWrite()`, `fileFieldPath()` and `pathsFromPatch()`. |
| `overlay-guard.test.cjs` | The `node --test` suite for the core and the Claude, Codex, Cursor, Devin and Pi adapters. |

`evaluateWrite()` takes the paths, the session directory and an optional tree root. It resolves each path against the session directory and asks the engine once per path. A call naming several paths is refused when any one is owned. The refusal is the engine's own `refuse:` line.

The engine runs with a 3000 ms timeout, a 1 MB buffer and `SIGKILL` on expiry. A path the engine could not judge is never refused. Only a `refuse:` answer blocks the write. The spawn uses `node` unless the host binary is node itself. An embedded runtime such as Bun reports its own binary, which cannot run the engine.

`fileFieldPath()` reads the `file_path`, `filePath` or `path` field of a tool input. `pathsFromPatch()` reads every `*** Add File:`, `*** Update File:` and `*** Delete File:` header plus each `*** Move to:` target.

The suite builds a fixture tree with the real engine and an owned file. It copies the hook folder inside that tree, so each adapter finds the root from its own location. It asserts that a refused write leaves the tree byte-identical. It also covers `strictWrites`, where an unowned vendored file and a new file are refused.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs
```

Expected result: every test passes.

---

## 4. RELATED

- [`../README.md`](../README.md): the concern README with the decision table and the engine contract.
- [`../../../commands/doctor/scripts/overlay-engine.cjs`](../../../commands/doctor/scripts/overlay-engine.cjs): the engine the core queries.
- [`../../shared/hook-flags.cjs`](../../shared/hook-flags.cjs): the kill-switch resolver the adapters use.

<!-- readme-check
allow-ref .skilled-overlays.json | the overlay setting file at the root of a project that vendors Skilled
-->
