---
title: "Skill Advisor Hooks: Codex Adapter Links"
description: "Relative links for the Codex Skill Advisor path, covering the adapter source and its compiled build in system-spec-kit."
trigger_phrases:
  - "skill advisor codex hook"
  - "codex user prompt submit"
  - "codex advisor adapter"
version: 1.0.0.0
---

# Skill Advisor Hooks: Codex Adapter Links

---

## 1. OVERVIEW

`codex/` holds the Codex links for the Skill Advisor concern. Both files are relative symlinks into `system-spec-kit`, one to the adapter source and one to its compiled build. Codex loads `UserPromptSubmit` from `.codex/hooks.json` with a 3 s host budget. The adapter reads the Codex payload with a short stdin deadline, runs the Claude shim from the compiled tree and normalizes the result to a Codex context envelope. The brief is advisory and the prompt always proceeds.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| `user-prompt-submit.ts` | `UserPromptSubmit` | Link to `system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts`. The adapter source. Reads the payload, runs `user-prompt-submit.js` with a 2.8 s child budget and emits the normalized context. | Fails open. A missing payload, failed child or invalid output emits no context. |
| `user-prompt-submit.js` | `UserPromptSubmit` | Link to `system-spec-kit/runtime/dist/hooks/codex/user-prompt-submit.js`. The compiled build of the same adapter. | Fails open. The compiled shim relays no context on failure. |

---

## 3. RELATED

- [`../README.md`](../README.md): the Skill Advisor concern, its delivery model and its kill switches.
- [`../../../skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts`](../../../skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts): the adapter source behind the link.
- [`../../../skills/system-spec-kit/runtime/hooks/codex/shared.ts`](../../../skills/system-spec-kit/runtime/hooks/codex/shared.ts): the payload reader and child runner the adapter uses.
- [`../../../../.codex/hooks.json`](../../../../.codex/hooks.json): the Codex registration file.
