---
title: "Task Dispatch Library: Deep-Loop Dispatch Policy Core"
description: "Runtime-neutral core for deep-loop dispatch policy, target identity, loop-repeat state and the shared warning log."
trigger_phrases:
  - "dispatch guard core"
  - "deep loop policy core"
  - "loop repeat state"
version: 1.0.0.0
---

# Task Dispatch Library: Deep-Loop Dispatch Policy Core

---

## 1. OVERVIEW

`lib/` holds the runtime-neutral policy core for the Task Dispatch concern. Every adapter reaches `subagent-dispatch-guard.cjs` and translates the returned `allow`, `warn` or `reject` decision into its own protocol. Cursor spawns the Claude adapter, which calls the core itself.

The core owns registry indexing, target identity and the Deep Route mode-mismatch check. It recognizes command-driven iteration and keeps the session-scoped loop state. It also keeps the bounded warning log and the stale-state sweep. The core never writes to stdout or stderr at any point.

`evaluateDispatch` returns its warnings and audits without writing them to a log. Each adapter passes them to the core's `appendWarningLog` and `appendRejectModeDegradedAudit`.

Claude, Cursor, Devin, DSH, OpenCode, Pi and Vibe each run the hook, while Codex has no adapter. Claude registers it in `.claude/settings.json` and Cursor registers it in `.cursor/hooks.json`. Devin registers it in `.devin/hooks.v1.json` and DSH registers it in `.dsh/plugins/repo-guards/index.mjs`. OpenCode loads `.opencode/plugins/system-deep-loop-guard.js` and Pi loads `.pi/extensions/task-dispatch-guard.ts`. Vibe registers the hook as `deep-loop-guard` in `.vibe/hooks.toml`.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `subagent-dispatch-guard.cjs` | The shared policy core. It binds no runtime event. |

It exports `evaluateDispatch` plus the parsing, state and maintenance helpers. Check 1 warns on a mode that is not registered for the target agent. Check 2 counts non-command-driven hand-offs to `deep-research` and `deep-review`.

The core fails open, so any unexpected internal error returns `allow` with no warnings. Each adapter approves on its own error too, though the paths differ. DSH logs the failure through `ctx.logger.warn` and still calls `next()`. Vibe writes the failure to stderr and exits 0 with no block. OpenCode swallows any error that is not the guard's own reject. Claude, Devin and Pi approve with no output, while Cursor writes an allow envelope.

---

## 3. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/subagent-dispatch-guard/tests/dsh-task-dispatch-guard.test.mjs
```

Expected result: the run exits 0 with no failing test. The parity test compares the core's decision with the DSH adapter's. The throw test asserts the adapter allows and logs when its core throws.

---

## 4. RELATED

- [`../README.md`](../README.md): the Task Dispatch concern, its per-runtime table and its env flags.
- [`../dsh/task-dispatch-guard.mjs`](../dsh/task-dispatch-guard.mjs): one adapter over this core.
- [`../claude/task-dispatch-guard.cjs`](../claude/task-dispatch-guard.cjs): the Claude adapter over this core.
