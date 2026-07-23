---
title: "Codex Hooks: Gate-3 spec-gate wiring for Codex CLI"
description: "Codex CLI UserPromptSubmit and PreToolUse hooks that call the shared spec-gate core to classify turns and enforce the spec-folder gate."
---

# Codex Hooks

---

## 1. OVERVIEW

`runtime/hooks/codex/` holds the Codex CLI side of the Gate-3 spec-folder discipline, mirroring `runtime/hooks/claude/` for the Codex tool vocabulary. Both files call into `runtime/lib/spec-gate/spec-gate-core.mjs` as a third consumer alongside the Claude hook and the OpenCode plugin, so the core never changes for a new runtime. Every entrypoint fails open: a missing or invalid stdin payload always resolves to approve.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `spec-gate-classify.mjs` | `UserPromptSubmit` hook. Runs `classifyIntent()` against each user turn and surfaces the bounded Gate-3 question as `additionalContext`. Advisory only. |
| `spec-gate-enforce.mjs` | `PreToolUse` hook. Maps Codex's `exec`/`apply_patch`/`edit` tool names onto the core's `bash`/`write`/`edit` vocabulary, parses `*** Add/Update/Delete File:` and `*** Move to:` headers out of `apply_patch` patch bodies to find the real target path, then runs `evaluateMutation()`. |

## 3. CONSUMERS

- `.codex/hooks.json` wires `spec-gate-classify.mjs` to `UserPromptSubmit` and `spec-gate-enforce.mjs` to the `exec|apply_patch|edit` `PreToolUse` matcher.

## 4. RELATED

- [`spec-gate-core.mjs`](../../lib/spec-gate/spec-gate-core.mjs): shared runtime-neutral policy both hooks call.
- [`runtime/hooks/claude`](../claude/README.md): the Claude Code sibling of these two hooks.
