---
title: "Pi Hooks: Skill-Advisor Prompt Bridge"
description: "Pi extension factory that injects the skill-advisor recommendation into each user turn, discovered through a relative symlink in .pi/extensions/."
trigger_phrases:
  - "pi prompt advisor"
  - "pi skill advisor hook"
---

# Pi Hooks: Skill-Advisor Prompt Bridge

---

## 1. OVERVIEW

`hooks/pi/` holds the real file behind the `.pi/extensions/prompt-advisor.ts` symlink. Pi resolves its imports against the symlink path, so the file's imports are written for the `.pi/extensions/` base.

---

## 2. WHAT IT DOES AND INJECTS

`prompt-advisor.ts` fires on Pi's `input` event and proxies the turn through the compiled Claude `user-prompt-submit.js` chain into this skill's advisor. The advisor's brief — `Advisor: <freshness>; use <skill> <confidence>/<uncertainty> pass.` plus the fixed comment-hygiene, governor, and proof-over-appearance directives — comes back as `additionalContext` and is appended to the user's own prompt text via Pi's input-transform, making it **operator-visible in Pi's chat** (every other runtime injects it invisibly). Transforms chain additively with the spec-gate classifier on the same event. Fails open.

Exact composition: `mcp-server/lib/render.ts` (`renderAdvisorBrief()`); visibility taxonomy: `.opencode/hooks/injection-contract.md`.

---

## 3. RELATED

- [`../claude/`](../claude/): the Claude-side advisor hook this bridge proxies into.
- [`../../../../../.pi/extensions/README.md`](../../../../../.pi/extensions/README.md): the discovery mirror and symlink map.
