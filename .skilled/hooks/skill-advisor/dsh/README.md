---
title: "Skill Advisor Hooks: DSH Adapter Link"
description: "Relative link to the DSH prompt advisor adapter, which adds the Skill Advisor brief to the operator step."
trigger_phrases:
  - "skill advisor dsh hook"
  - "dsh prompt advisor"
  - "dsh advisor adapter"
version: 1.0.0.0
---

# Skill Advisor Hooks: DSH Adapter Link

---

## 1. OVERVIEW

`dsh/` holds one link for the DSH Skill Advisor path. It points at the real adapter in `system-skill-advisor/hooks/dsh/`, which the `repo-guards` bundle also imports through its own adapter link. The adapter runs on `agent/pre-step`, reads only the message the operator typed and adds the advisor brief to the step as a notice. The row flag `promptAdvisor: true` turns it on, and a lineage leaf skips it.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| `prompt-advisor.mjs` | `agent/created`, `session/event`, `agent/pre-step` | Link to `system-skill-advisor/hooks/dsh/prompt-advisor.mjs`. Runs the advisor on the latest operator prompt, drops a repeated directive for the same session and forgets the receipt at session start or a completed compaction. | Fails open. `ERROR_POLICY` is `fail-open` and the step continues unchanged. |

---

## 3. RELATED

- [`../README.md`](../README.md): the Skill Advisor concern, its delivery model and its kill switches.
- [`../../../skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs`](../../../skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs): the real adapter behind the link.
- [`../../../../.dsh/plugins/repo-guards/README.md`](../../../../.dsh/plugins/repo-guards/README.md): the bundle that registers the adapter and its row flag.
