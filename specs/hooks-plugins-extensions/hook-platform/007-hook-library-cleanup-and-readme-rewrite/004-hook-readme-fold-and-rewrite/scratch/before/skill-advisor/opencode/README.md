---
title: "Skill Advisor Hooks: OpenCode Plugin Link"
description: "Relative link to the OpenCode Skill Advisor plugin, which appends the advisor brief to system context."
trigger_phrases:
  - "skill advisor opencode plugin"
  - "opencode system transform advisor"
  - "opencode advisor status tool"
version: 1.0.0.0
---

# Skill Advisor Hooks: OpenCode Plugin Link

---

## 1. OVERVIEW

`opencode/` holds one link for the OpenCode Skill Advisor path. It points at the committed plugin in `.opencode/plugins/`, which OpenCode loads through its flat glob over that folder. Nothing loads through this link. The plugin appends the brief to `output.system` on `experimental.chat.system.transform`, manages its cache on `event` and exposes `spec_kit_skill_advisor_status` through `tool`. The brief is advisory and OpenCode has no source-hook adapter for this concern.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| `system-skill-advisor.js` | Plugin link | Link to `.opencode/plugins/system-skill-advisor.js`. Shells out to the advisor CLI, appends the delivered brief to `output.system` and returns a sanitized status report from the tool. | Fails open. A failed or empty call pushes the fallback directive instead of a brief. |

---

## 3. RELATED

- [`../README.md`](../README.md): the Skill Advisor concern, its delivery model and its kill switches.
- [`../../../../.opencode/plugins/system-skill-advisor.js`](../../../../.opencode/plugins/system-skill-advisor.js): the real plugin behind the link.
- [`../../../../.opencode/plugins/README.md`](../../../../.opencode/plugins/README.md): the plugin folder and its load rule.
