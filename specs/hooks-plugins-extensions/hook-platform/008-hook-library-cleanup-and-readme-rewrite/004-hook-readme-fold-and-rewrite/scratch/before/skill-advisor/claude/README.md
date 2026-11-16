---
title: "Skill Advisor Hooks: Claude Adapter Links"
description: "Relative links for the Claude Skill Advisor path, covering the process-boundary shim, its compiled build and the real advisor handler."
trigger_phrases:
  - "skill advisor claude hook"
  - "claude user prompt submit"
  - "advisor shim resolution"
version: 1.0.0.0
---

# Skill Advisor Hooks: Claude Adapter Links

---

## 1. OVERVIEW

`claude/` holds the Claude links for the Skill Advisor concern. All three files are relative symlinks into the owning skill trees, and `user-prompt-submit.js` is the entry `.claude/settings.json` loads on `UserPromptSubmit`. The shim resolves the real advisor from its own location, runs it with bounded input and output, and relays the brief. The brief is advisory and the prompt always proceeds.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| `user-prompt-submit.js` | `UserPromptSubmit` | Link to `system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js`. The compiled shim that spawns the advisor and relays `hookSpecificOutput.additionalContext`. | Prints `{}` on `TARGET_UNRESOLVED`, `CHILD_TIMEOUT`, `OUTPUT_OVERFLOW`, `NONZERO_EXIT`, `EMPTY_OUTPUT`, `INVALID_JSON`, `INPUT_OVERFLOW` or `SPAWN_ERROR`. |
| `user-prompt-submit.ts` | `UserPromptSubmit` | Link to `system-skill-advisor/hooks/claude/user-prompt-submit.ts`. The real handler. Builds the brief, renders the fallback directive and emits the `additionalContext` envelope. | Emits `{}` and exits 0. |
| `speckit-user-prompt-submit.ts` | `UserPromptSubmit` | Link to `system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts`. The shim source. Resolves the advisor target by walking up to the install root, bounds stdin and child stdio at 1 MiB, and kills the child at 2.5 s. | Prints `{}` and exits 0 on every failure path. |

---

## 3. RELATED

- [`../README.md`](../README.md): the Skill Advisor concern, its delivery model and its kill switches.
- [`../../../skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`](../../../skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts): the real handler behind the link.
- [`../../../skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts`](../../../skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts): the shim source behind the link.
- [`../../../../.claude/settings.json`](../../../../.claude/settings.json): the Claude settings file that wires `UserPromptSubmit`.
