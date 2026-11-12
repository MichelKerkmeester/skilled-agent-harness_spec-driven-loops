---
title: "Skill Advisor Hooks: Pi Adapter Link"
description: "Relative link to the Pi prompt advisor extension, which imports the advisor module in process."
trigger_phrases:
  - "skill advisor pi hook"
  - "pi prompt advisor"
  - "pi advisor extension"
version: 1.0.0.0
---

# Skill Advisor Hooks: Pi Adapter Link

---

## 1. OVERVIEW

`pi/` holds one link for the Pi Skill Advisor path. It points at the real extension in `system-skill-advisor/hooks/pi/`, which Pi discovers through its one-line entry file in `.pi/extensions/`. The extension imports the advisor module in process instead of spawning a child, so the input handler returns before Pi starts the agent step. It captures the operator text with a 32 KiB cap, tracks one receipt per session and delivers the brief as a model-visible message.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| `prompt-advisor.ts` | `input`, `session_start`, `session_compact` | Link to `system-skill-advisor/hooks/pi/prompt-advisor.ts`. Runs the advisor against a deadline of the advisor budget plus 300 ms, then sends the brief or the fallback directive. | Fails open. A hung or failed call delivers the fallback directive and the prompt proceeds. |

---

## 3. RELATED

- [`../README.md`](../README.md): the Skill Advisor concern, its delivery model and its kill switches.
- [`../../../skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`](../../../skills/system-skill-advisor/hooks/pi/prompt-advisor.ts): the real extension behind the link.
- [`../../../../.pi/extensions`](../../../../.pi/extensions): the Pi extension folder that loads it.
