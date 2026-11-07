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

`lib/` holds the runtime-neutral policy core for the Task Dispatch concern. Every adapter calls `dispatch-guard.cjs` and translates the returned `allow`, `warn` or `reject` decision into its own protocol. The core owns registry indexing, target identity, the Deep Route mode-mismatch check, command-driven iteration recognition, session-scoped loop state, the bounded warning log and the stale-state sweep. It never writes to stdout or stderr. `evaluateDispatch` returns its warnings and audits without logging them, and each adapter passes them to the core's `appendWarningLog` and `appendRejectModeDegradedAudit`.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| `dispatch-guard.cjs` | Shared policy core, no event | Exports `evaluateDispatch` plus the parsing, state and maintenance helpers. Check 1 warns on a mode that is not registered for the target agent. Check 2 counts non-command-driven hand-offs to `deep-research` and `deep-review`. | Fails open. Any unexpected internal error returns `allow` with no warnings. |

---

## 3. RELATED

- [`../README.md`](../README.md): the Task Dispatch concern, its per-runtime table and its env flags.
- [`../dsh/task-dispatch-guard.mjs`](../dsh/task-dispatch-guard.mjs): one adapter over this core.
- [`../claude/task-dispatch-guard.cjs`](../claude/task-dispatch-guard.cjs): the Claude adapter over this core.
