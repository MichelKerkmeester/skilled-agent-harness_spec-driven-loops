---
title: "Goal Lib: Shared Core and Packet Slices"
description: "The runtime-neutral goal engine every adapter calls, and the one module that draws the packet goal.md boundary for the core and the OpenCode plugin."
trigger_phrases:
  - "goal core"
  - "goal slice"
  - "packet goal frontmatter"
version: 1.0.0.0
---

# Goal Lib: Shared Core and Packet Slices

---

## 1. OVERVIEW

`.skilled/hooks/goal/lib/` holds the runtime-neutral engine every goal adapter calls. `goal-core.cjs` resolves one scope from `workspace + runtime + native session id`. That scope becomes one opaque state file and one archive namespace. It owns the goal lifecycle, packet binding, rendering, the heuristic verifier, diagnostics and legacy quarantine.

Reads fail open, so a broken record never breaks a turn. Mutations raise a stable `GoalError` code instead. The module never writes stdout or stderr.

`goal-slice.cjs` is the one place the boundary in a packet's `goal.md` is drawn. It splits the YAML frontmatter from the durable slice, produces the chat slice and the objective slice and computes the slice hash. The CommonJS core and the ESM OpenCode plugin both import it, so the two engines cannot disagree about where the frontmatter ends.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `goal-core.cjs` | The runtime-neutral engine. Every goal adapter imports it. |
| `goal-slice.cjs` | The packet projection module. The core and the OpenCode plugin both import it. |
| `goal-core.test.cjs` | The core suite, run with `node --test`. |
| `goal-slice.test.cjs` | The slice suite, run with `node --test`. |

`goal-core.cjs` writes a record with a temp file, `fsync` and rename at mode 0600, and it takes cross-process locks. Reads fail open. Mutations throw `GoalError` with a stable code.

`goal-slice.cjs` separates the frontmatter, the durable slice, the chat slice and the objective slice. It keeps a symlinked packet inside the workspace and computes a hash that ignores log edits and reflow. A missing document or a path outside the workspace returns an unbound result. It never emits frontmatter.

`goal-core.test.cjs` covers state roundtrip and atomicity, archive on clear, byte-compatible rendering, hardening, verifier verdicts and the CLI envelope. `goal-slice.test.cjs` covers the frontmatter leak boundary, slice stability, nested versus singular packets, hash stability, symlink escape and the budget rules.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/goal/lib/goal-slice.test.cjs .skilled/hooks/goal/lib/goal-core.test.cjs
```

A failed assertion fails the test process with a nonzero status. Both suites work in a fresh temp directory, so a run never touches the real state tree.

---

## 4. RELATED

- [`../README.md`](../README.md): the goal hooks README, with the state layout and the per-runtime matrix.
- [`./goal-core.cjs`](./goal-core.cjs): the shared engine.
- [`./goal-slice.cjs`](./goal-slice.cjs): the packet projection module.
