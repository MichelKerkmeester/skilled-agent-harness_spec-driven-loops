---
title: "Claude Hooks: Gate-3 spec-gate wiring for Claude Code"
description: "Claude Code UserPromptSubmit and PreToolUse hooks that call the shared spec-gate core to classify turns and enforce the spec-folder gate."
---

# Claude Hooks

---

## 1. OVERVIEW

`runtime/hooks/claude/` holds the Claude Code side of the Gate-3 spec-folder discipline. Both files call into `runtime/lib/spec-gate/spec-gate-core.mjs` and never decide policy themselves. Every entrypoint fails open: a missing or invalid stdin payload always resolves to approve, so a bug here never blocks an unrelated turn.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `spec-gate-classify.mjs` | `UserPromptSubmit` hook. Runs `classifyIntent()` against each user turn, opens the session gate and surfaces the bounded Gate-3 question as `additionalContext`. Advisory only, no deny capability. |
| `spec-gate-enforce.mjs` | `PreToolUse` hook. Runs `evaluateMutation()` before a Write, Edit or Bash call. Write and Edit are deny-capable, Bash is advise-only. Logs every non-allow decision through `appendWarningLog()`. |

## 3. CONSUMERS

- `.claude/settings.json` wires `spec-gate-classify.mjs` to `UserPromptSubmit` and `spec-gate-enforce.mjs` to the `Write|Edit` and `Bash` `PreToolUse` matchers.

## 4. RELATED

- [`spec-gate-core.mjs`](../../lib/spec-gate/spec-gate-core.mjs): shared runtime-neutral policy both hooks call.
- [`runtime/hooks/codex`](../codex/README.md): the Codex CLI sibling of these two hooks.
