---
title: "Task Dispatch Hooks: Claude Adapters"
description: "Real Claude adapters for deep-loop dispatch policy and the Fable-model subagent guard."
trigger_phrases:
  - "claude task dispatch guard"
  - "fable subagent guard"
  - "claude deep loop guard"
version: 1.0.0.0
---

# Task Dispatch Hooks: Claude Adapters

---

## 1. OVERVIEW

`claude/` holds the two real Claude adapters for the Task Dispatch concern. Claude wires both to `PreToolUse` in `.claude/settings.json`, the deep-loop guard on `Task` and the Fable guard on `Task` and `Agent`. The deep-loop guard evaluates the shared core and reports its verdict. The Fable guard reads the main-loop model from the session transcript and denies a dispatch that would inherit Fable into a subagent.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| `task-dispatch-guard.cjs` | `PreToolUse` on `Task` | Reads `subagent_type`, the prompt and the project directory, calls `evaluateDispatch`, appends the warnings and audits, and returns `permissionDecision: deny` on reject or `additionalContext` on warn. | Fails open. A missing payload or internal error exits 0 and the dispatch proceeds. |
| `fable-subagent-guard.mjs` | `PreToolUse` on `Task` and `Agent` | Reads the main-loop model from the last `model` field in `payload.transcript_path` and denies `fork`, a missing `model` or a model that is not `opus` or `sonnet` while Fable drives. | Fails open when the transcript is missing or unreadable. |

---

## 3. RELATED

- [`../README.md`](../README.md): the Task Dispatch concern, its per-runtime table and its env flags.
- [`../lib/dispatch-guard.cjs`](../lib/dispatch-guard.cjs): the shared policy core the deep-loop guard calls.
- [`../../shared/hook-flags.mjs`](../../shared/hook-flags.mjs): the kill-switch resolver both adapters check.
- [`../../../../.claude/settings.json`](../../../../.claude/settings.json): the Claude settings file that wires both events.
