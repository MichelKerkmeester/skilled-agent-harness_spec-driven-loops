---
title: "Claude Hooks"
description: "Claude Code PreToolUse(Task) hook that runs the shared deep-loop dispatch guard before a Task tool call reaches the model."
---

# Claude Hooks

---

## 1. OVERVIEW

Claude Code hook adapters for `system-deep-loop`. The single hook here intercepts a `Task` tool call on the `PreToolUse` event and evaluates it against the shared, runtime-neutral dispatch-guard core before the call proceeds. It is Claude's counterpart to the OpenCode `mk-deep-loop-guard` plugin: both wrap the same policy logic in `../../lib/deep-loop/dispatch-guard.cjs` for their own hook surface.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `task-dispatch-guard.cjs` | `PreToolUse(Task)` guard. Reads the hook payload from stdin, normalizes the tool name and calls `dispatch-guard.cjs` to check for a Deep Route mode mismatch or a loop-like repeated hand-off to a command-owned loop executor. A policy denial emits a Claude `permissionDecision: deny` response. A warning is surfaced through `additionalContext` without blocking the call. Fails open on any missing payload or internal error so a bug here never blocks unrelated work. |

## 3. CONSUMERS

- `.claude/settings.json` registers `task-dispatch-guard.cjs` on the `PreToolUse` hook for the `Task` matcher.

## 4. TESTS

- `.opencode/plugins/tests/claude-task-dispatch-guard.test.cjs`

## 5. RELATED

- Shared guard core: `../../lib/deep-loop/dispatch-guard.cjs`
- OpenCode counterpart plugin: `.opencode/plugins/mk-deep-loop-guard.js`
- Parent runtime README: `../../README.md`
