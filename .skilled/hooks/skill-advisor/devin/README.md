---
title: "Skill Advisor Hooks: Devin Adapter Links"
description: "Relative links for the Devin Skill Advisor path, covering the adapter source and its compiled build in system-spec-kit."
trigger_phrases:
  - "skill advisor devin hook"
  - "devin user prompt submit"
  - "devin advisor adapter"
version: 1.0.0.0
---

# Skill Advisor Hooks: Devin Adapter Links

---

## 1. OVERVIEW

`devin/` holds the Devin links for the Skill Advisor concern. Both files are relative symlinks into `system-spec-kit`, one to the adapter source and one to its compiled build. Devin loads `UserPromptSubmit` from `.devin/hooks.v1.json` with a 10 s budget. The adapter reads the payload, runs the Claude shim with a 2.8 s child budget and emits the normalized Devin context. The brief is advisory and the prompt always proceeds.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| `user-prompt-submit.ts` | `UserPromptSubmit` | Link to `system-spec-kit/runtime/hooks/devin/user-prompt-submit.ts`. The adapter source. Reads the payload, runs `user-prompt-submit.js` and emits the normalized context. | Fails open. A missing payload, failed child or invalid output emits no context. |
| `user-prompt-submit.js` | `UserPromptSubmit` | Link to `system-spec-kit/runtime/dist/hooks/devin/user-prompt-submit.js`. The compiled build of the same adapter. | Fails open. The compiled shim relays no context on failure. |

---

## 3. RELATED

- [`../README.md`](../README.md): the Skill Advisor concern, its delivery model and its kill switches.
- [`../../../skills/system-spec-kit/runtime/hooks/devin/user-prompt-submit.ts`](../../../skills/system-spec-kit/runtime/hooks/devin/user-prompt-submit.ts): the adapter source behind the link.
- [`../../../skills/system-spec-kit/runtime/hooks/devin/shared.ts`](../../../skills/system-spec-kit/runtime/hooks/devin/shared.ts): the payload reader and child runner the adapter uses.
- [`../../../../.devin/hooks.v1.json`](../../../../.devin/hooks.v1.json): the Devin registration file.
