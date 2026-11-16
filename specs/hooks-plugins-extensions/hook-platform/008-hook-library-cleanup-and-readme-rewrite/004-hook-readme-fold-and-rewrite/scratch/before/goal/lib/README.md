---
title: "Goal Lib: Shared Core and Packet Slices"
description: "The runtime-neutral goal engine and the one module that draws the packet goal.md boundary, shared by every adapter and by the OpenCode plugin."
trigger_phrases:
  - "goal core"
  - "goal slice"
  - "packet goal frontmatter"
version: 1.0.0.0
---

# Goal Lib: Shared Core and Packet Slices

---

## 1. OVERVIEW

`goal/lib/` holds the runtime-neutral engine every goal adapter calls. `goal-core.cjs` owns scope validation, opaque state paths, atomic state I/O, the goal lifecycle, packet binding, rendering, the heuristic verifier, diagnostics and legacy quarantine. It never writes stdout or stderr. Reads fail open so a broken record never breaks a turn, and mutations raise stable `GoalError` codes instead.

`goal-slice.cjs` is the one place the boundary in a packet's `goal.md` is drawn. It splits the YAML frontmatter from the durable slice, produces the chat slice and the objective slice and computes the slice hash. The CommonJS core and the ESM OpenCode plugin both import it, so the two engines cannot disagree about where the frontmatter ends.

---

## 2. WHAT EACH FILE DOES

| File | Event | What it does | On error |
|---|---|---|---|
| `goal-core.cjs` | Imported by every adapter | Resolves the `workspace + runtime + native session id` scope, writes records with temp file, `fsync` and rename at mode 0600, takes cross-process locks and exposes the lifecycle, packet and diagnostic functions. | Reads fail open. Mutations throw `GoalError` with a stable code. The module itself writes no output. |
| `goal-slice.cjs` | Imported by the core and the OpenCode plugin | Separates frontmatter, durable slice, chat slice and objective slice, keeps a symlinked packet inside the workspace and computes a hash that ignores log edits and reflow. | Returns an unbound result for a missing document or a path outside the workspace. Never emits frontmatter. |
| `goal-core.test.cjs` | `node --test` | Covers state roundtrip and atomicity, archive on clear, byte-compatible rendering, hardening, verifier verdicts and the CLI envelope. Each test uses a temp state directory. | A failed assertion fails the test process with a nonzero status. |
| `goal-slice.test.cjs` | `node --test` | Covers the frontmatter leak boundary, slice stability, nested versus singular packets, hash stability, symlink escape and the budget rules. | A failed assertion fails the test process with a nonzero status. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern index, with the state layout and the per-runtime matrix.
- [`./goal-core.cjs`](./goal-core.cjs): the shared engine.
- [`./goal-slice.cjs`](./goal-slice.cjs): the packet projection module.
