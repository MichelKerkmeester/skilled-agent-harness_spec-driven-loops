---
title: "Pi Hooks: Git Preflight Advisory and Message Gate"
description: "Pi extension factories bridging sk-git's warn-only git advisories and its blocking message-contract gate onto bash commands, each discovered through a relative symlink in .pi/extensions/."
trigger_phrases:
  - "pi git preflight"
  - "pi git advisory"
  - "pi git message gate"
---

# Pi Hooks: Git Preflight Advisory and Message Gate

---

## 1. OVERVIEW

`hooks/pi/` holds the real files behind the `.pi/extensions/git-preflight-advisory.ts` and `.pi/extensions/git-message-gate.ts` symlinks. Pi resolves its imports against the symlink path, so each file's imports are written for the `.pi/extensions/` base. `git-message-gate.test.ts` is the vitest suite for the gate and is never linked.

---

## 2. WHAT IT DOES AND INJECTS

`git-preflight-advisory.ts` evaluates Pi's `tool_call` event for bash commands and buffers any matching advisory. The visible channel is the matching `tool_result` event: its returned `content` appends the advisory text that the model reads. Warn-only: it never blocks, and any internal error resolves to silence.

`git-message-gate.ts` also listens on `tool_call` for bash commands. It hands the command to the shared gate, and when a `git commit` message, a `gh pr` description or a new branch name breaks the repository's own sk-git templates, it returns `{ block: true, reason }`, which Pi turns into the call's outcome. Pi reads a `tool_call` return only for `.block`, so this is the one channel that stops the call. A gate that cannot load allows the call, because the git hooks and CI still enforce the rules; a rules block that cannot be read blocks. There is no kill switch.

Rule set and messages: [`../git-preflight-advisory.mjs`](../git-preflight-advisory.mjs) + [`../../lib/git-rule-checks.mjs`](../../lib/git-rule-checks.mjs); visibility taxonomy: `.skilled/hooks/injection-contract.md`.

---

## 3. RELATED

- [`../git-preflight-advisory.mjs`](../git-preflight-advisory.mjs): the Claude-side hook carrying the same rule engine.
- [`../git-message-gate.mjs`](../git-message-gate.mjs): the shared message-contract gate the Pi extension calls.
- [`../../../../../../.pi/extensions/README.md`](../../../../../../.pi/extensions/README.md): the discovery mirror and symlink map.
