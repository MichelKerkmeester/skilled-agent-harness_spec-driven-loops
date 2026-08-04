---
title: "Pi Hooks: Git Preflight Advisory Bridge"
description: "Pi extension factory bridging sk-git's warn-only git-outcome advisories onto bash git commands, discovered through a relative symlink in .pi/extensions/."
trigger_phrases:
  - "pi git preflight"
  - "pi git advisory"
---

# Pi Hooks: Git Preflight Advisory Bridge

---

## 1. OVERVIEW

`hooks/pi/` holds the real file behind the `.pi/extensions/git-preflight-advisory.ts` symlink. Pi resolves its imports against the symlink path, so the file's imports are written for the `.pi/extensions/` base.

## 2. WHAT IT DOES AND INJECTS

`git-preflight-advisory.ts` evaluates Pi's `tool_call` event for bash commands and buffers any matching advisory. The visible channel is the matching `tool_result` event: its returned `content` appends the advisory text that the model reads. Warn-only: it never blocks, and any internal error resolves to silence.

Rule set and messages: [`../git-preflight-advisory.mjs`](../git-preflight-advisory.mjs) + [`../../lib/git-rule-checks.mjs`](../../lib/git-rule-checks.mjs); visibility taxonomy: `.opencode/hooks/injection-contract.md`.

## 3. RELATED

- [`../git-preflight-advisory.mjs`](../git-preflight-advisory.mjs): the Claude-side hook carrying the same rule engine.
- [`../../../../../../.pi/extensions/README.md`](../../../../../../.pi/extensions/README.md): the discovery mirror and symlink map.
