---
title: "Skill Advisor Hooks: Vibe Adapter Link"
description: "Relative link to the Vibe prompt advisor part, which the turn-start composer adds to each operator message."
trigger_phrases:
  - "skill advisor vibe hook"
  - "vibe prompt advisor"
  - "vibe advisor adapter"
version: 1.0.0.0
---

# Skill Advisor Hooks: Vibe Adapter Link

---

## 1. OVERVIEW

`vibe/` holds one link for the Vibe Skill Advisor path. It points at the real part in `system-skill-advisor/hooks/vibe/`, which the Vibe turn-start composer calls from its `pre_agent` hook. The part reads only the message the operator typed and returns the advisor brief as `additional_context`, which Vibe adds after the message for the model. A child dispatch (`AI_SESSION_CHILD=1`) and a subagent turn get no brief.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| `prompt-advisor.mjs` | `pre_agent`, through `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` | Link to `system-skill-advisor/hooks/vibe/prompt-advisor.mjs`. Runs the advisor on the operator prompt under the runtime label `vibe`, and sends the routing head and the directive block again only when they changed for the session, because Vibe keeps every added context in the conversation. | Fails open. `ERROR_POLICY` is `fail-open` and the message goes through without a brief. |

---

## 3. RELATED

- [`../README.md`](../README.md): the Skill Advisor concern, its delivery model and its kill switches.
- [`../../../skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs`](../../../skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs): the real part behind the link.
- [`../../session-lifecycle/vibe/README.md`](../../session-lifecycle/vibe/README.md): the turn-start composer that calls the part.
