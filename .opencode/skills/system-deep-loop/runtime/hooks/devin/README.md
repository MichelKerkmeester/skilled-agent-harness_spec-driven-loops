---
title: "Devin Hooks"
description: "Devin CLI PreToolUse(run_subagent) hook that runs the shared deep-loop dispatch guard before a subagent dispatch reaches the model."
---

# Devin Hooks

---

## 1. OVERVIEW

Devin CLI hook adapter for `system-deep-loop`. The single hook here intercepts a `run_subagent` tool call on the `PreToolUse` event and evaluates it against the shared, runtime-neutral dispatch-guard core before the call proceeds - Devin's counterpart to `../claude/task-dispatch-guard.cjs`, both wrapping `../../lib/deep-loop/dispatch-guard.cjs`.

This is a **deliberate divergence from the Codex precedent, not a port**: Codex folds this concern into its `exec`-shape recognizer because Codex has no native subagent-dispatch tool. Devin's `run_subagent` is a real, first-class dispatch tool (confirmed in phase 001's contract-pin), so it gets a real adapter instead - there is no `../codex/` sibling for this concern.

**STATUS: DORMANT** - `.devin/hooks.v1.json` is confirmed not consulted at all under `devin -p` (packet-wide finding, see `../../../../system-spec-kit/mcp-server/hooks/devin/README.md`). `run_subagent`'s exact `tool_input` field names are also unconfirmed (no live capture yet) - this adapter tries the same field-name fallbacks the shared core already tolerates rather than assuming one exact shape.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `task-dispatch-guard.cjs` | `PreToolUse(^run_subagent$)` guard. Reads the hook payload from stdin, normalizes the tool name and calls `dispatch-guard.cjs` to check for a Deep Route mode mismatch or a loop-like repeated hand-off to a command-owned loop executor. A policy denial emits a `permissionDecision: deny` response. A warning is surfaced through `additionalContext` without blocking the call. Fails open on any missing payload or internal error so a bug here never blocks unrelated work. |

## 3. CONSUMERS

- `.devin/hooks.v1.json` registers `task-dispatch-guard.cjs` on the `PreToolUse` hook for the `^run_subagent$` matcher.

## 4. RELATED

- Shared guard core: `../../lib/deep-loop/dispatch-guard.cjs`
- Claude counterpart: `../claude/task-dispatch-guard.cjs`
- Parent runtime README: `../../README.md`
