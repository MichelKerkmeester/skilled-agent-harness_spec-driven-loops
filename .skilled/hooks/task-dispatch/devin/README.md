---
title: "Task Dispatch Hooks: Devin Adapter"
description: "Real Devin adapter that applies the shared deep-loop dispatch policy to run_subagent calls."
trigger_phrases:
  - "devin task dispatch guard"
  - "devin run subagent guard"
  - "devin deep loop guard"
version: 1.0.0.0
---

# Task Dispatch Hooks: Devin Adapter

---

## 1. OVERVIEW

`devin/` holds the real Devin adapter for the Task Dispatch concern. Devin wires it to `PreToolUse` on `run_subagent` in `.devin/hooks.v1.json`. The adapter reads the four field aliases `subagent_type`, `subagentType`, `agent_type` and `agentType`, then evaluates the same shared core the Claude and Cursor adapters use. A blank `cwd` falls back to `DEVIN_PROJECT_DIR`.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| `task-dispatch-guard.cjs` | `PreToolUse` on `run_subagent` | Calls `evaluateDispatch`, appends the warnings and audits, and returns `permissionDecision: deny` on reject or `additionalContext` with the joined warnings on warn. | Fails open. A missing payload or internal error exits 0 and the dispatch proceeds. |

---

## 3. RELATED

- [`../README.md`](../README.md): the Task Dispatch concern, its per-runtime table and its env flags.
- [`../lib/dispatch-guard.cjs`](../lib/dispatch-guard.cjs): the shared policy core the adapter calls.
- [`../../shared/hook-flags.mjs`](../../shared/hook-flags.mjs): the kill-switch resolver the adapter checks.
- [`../../../../.devin/hooks.v1.json`](../../../../.devin/hooks.v1.json): the Devin registration file.
