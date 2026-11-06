---
title: "DSH Hooks: Skill-Advisor Prompt Bridge"
description: "DeepSeek Harness adapter that adds the skill-advisor brief to each operator turn of an interactive session, loaded through a relative symlink in .dsh/plugins/repo-guards/adapters/."
trigger_phrases:
  - "dsh prompt advisor"
  - "dsh skill advisor hook"
version: 1.0.0.0
---

# DSH Hooks: Skill-Advisor Prompt Bridge

---

## 1. OVERVIEW

`hooks/dsh/` holds the real file behind the `.dsh/plugins/repo-guards/adapters/prompt-advisor.mjs` link. Node resolves the link to this path before it resolves the file's imports, so its relative imports are written for this folder. The index link `.skilled/hooks/skill-advisor/dsh/prompt-advisor.mjs` points back here.

---

## 2. WHAT IT DOES AND INJECTS

`prompt-advisor.mjs` runs on `agent/pre-step` and proxies the latest prompt the operator typed through the compiled Claude `user-prompt-submit.js` chain into this skill's advisor. Guard notices and runtime-context snapshots are user-role messages too, so only a message whose source is `user` counts as the prompt. The brief comes back as `additionalContext` and joins the step as one notice. It fails open.

The guards patch turns the adapter on with `promptAdvisor: true`. A fan-out leaf gets no brief: the lineage patch inserts a marker row, and the adapter checks it at event time, because the lineage patch applies before the guards row exists.

The directive block follows the shared directive lifecycle. The first brief of a session, and the first after a successful compaction, carries the full block. A repeat with the same block carries the `Advisor:` route head alone. A changed block, an unknown session or a brief with no directive label gets the full text. Set `SYSTEM_DIRECTIVE_LIFECYCLE_DISABLED=1` to send the full brief on every turn.

Exact composition: `runtime/lib/render.ts` (`renderAdvisorBrief()`). Visibility taxonomy: `.skilled/hooks/injection-contract.md`.

---

## 3. RELATED

- [`../pi/README.md`](../pi/README.md): the Pi bridge for the same advisor.
- [`../claude/`](../claude/): the Claude-side advisor hook this bridge proxies into.
- [`../../../../../.dsh/plugins/repo-guards/README.md`](../../../../../.dsh/plugins/repo-guards/README.md): the bundle, its adapter links and its tests.
