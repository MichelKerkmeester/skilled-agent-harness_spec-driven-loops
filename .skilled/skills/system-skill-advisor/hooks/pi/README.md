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

`prompt-advisor.ts` fires on Pi's `input` event and proxies the turn through the compiled Claude `user-prompt-submit.js` chain into this skill's advisor. The call passes `runtime: 'pi'`, so advisor diagnostics carry `pi`. It races a timer of the advisor budget (`SPECKIT_CLAUDE_HOOK_TIMEOUT_MS`, default 2500 ms) plus 300 ms and delivers the fallback directive if the call hangs past it. Debug output labels a fallback `fallback(outage)`, `fallback(no-match)`, `fallback(skipped)` or `fallback(headless)`. The advisor's brief, `Advisor: <freshness>; use <skill> <confidence>/<uncertainty> pass.` plus the fixed comment-hygiene directive, comes back as `additionalContext` and is appended to the user's own prompt text via Pi's input-transform, making it **operator-visible in Pi's chat** (every other runtime injects it invisibly). Transforms chain additively with the spec-gate classifier on the same event. Fails open.

Repeat turns stay quiet. When a session's contribution, the `Advisor:` route head plus the directives, is byte-identical to the one last delivered, the extension appends nothing. The first turn, a `session_start` or `session_compact` event, any changed contribution and an unidentified session all get the full brief. Set `SPECKIT_PI_DIRECTIVE_DEDUP=0` to append it on every turn. Behavior: [directive-lifecycle dedup feature](../../../system-spec-kit/feature-catalog/ux-hooks/directive-lifecycle-dedup.md). Test steps: [manual-testing playbook 457](../../../system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md).

Exact composition: `runtime/lib/render.ts` (`renderAdvisorBrief()`); visibility taxonomy: `.skilled/hooks/injection-contract.md`.

---

## 3. RELATED

- [`../claude/`](../claude/): the Claude-side advisor hook this bridge proxies into.
- [`../../../../../.pi/extensions/README.md`](../../../../../.pi/extensions/README.md): the discovery mirror and symlink map.
