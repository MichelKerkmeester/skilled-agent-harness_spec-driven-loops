---
title: "Git Preflight (Pi): Tool Result Advisory"
description: "Pi's link into the shared advisory extension, which evaluates a bash git command on tool_call and appends the findings to the matching tool_result content."
trigger_phrases:
  - "pi git preflight advisory"
  - "tool result advisory"
  - "sk-git advisory extension"
version: 1.0.0.0
---

# Git Preflight (Pi): Tool Result Advisory

---

## 1. OVERVIEW

`git-preflight/pi/` holds the Pi entry for the git preflight advisory. `git-preflight-advisory.ts` is a relative symlink to `../../../skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts`. Pi discovers extensions in `.pi/extensions/`, where another relative symlink points at the same real file. This folder keeps the hook tree navigable, and the real source stays under the sk-git scripts.

The extension uses two events because Pi discards a bare `reason` from a `tool_call` handler. On `tool_call` it checks `isHookEnabled('git-preflight')`, gates the command on `GIT_SHAPE`, reads the hard rules from `ctx.cwd`, evaluates with the shared engine and stores the text in a map keyed by `event.toolCallId`. On `tool_result` it reads that key and appends one text block to the result content. The map holds at most 20 entries and drops the oldest.

---

## 2. WHAT EACH FILE DOES

| File | Event | What it does | On error |
|---|---|---|---|
| `git-preflight-advisory.ts` | `tool_call` and `tool_result` for `bash` | Is a link to the real Pi extension. It honors `SKGIT_ADVISORY` and `SKGIT_ADVISORY_SKIP`, caps the advisory at three findings and never returns `block: true`. | Returns `undefined` on any evaluation or delivery error, so the command and the result pass through unchanged. |

---

## 3. RELATED

- [`../README.md`](../README.md): the concern index, with the suppression tiers and the 17 rule ids.
- [`../../../skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts`](../../../skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts): the real extension this link points at.
- [`../../../../.pi/extensions/git-preflight-advisory.ts`](../../../../.pi/extensions/git-preflight-advisory.ts): the discovery symlink Pi loads.
- [`../../../skills/sk-git/scripts/hooks/git-preflight-advisory.mjs`](../../../skills/sk-git/scripts/hooks/git-preflight-advisory.mjs): the shared stdin hook and its rule engine.
