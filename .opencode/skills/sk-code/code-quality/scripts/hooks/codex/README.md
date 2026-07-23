---
title: "Codex: PostToolUse quality-check adapter"
description: "The Codex CLI sibling of the Claude post-edit quality hook, firing on apply_patch and edit tool calls."
---

# Codex

---

## 1. OVERVIEW

`codex/` holds the Codex CLI counterpart to `../claude-posttooluse.cjs`. It fires on Codex's `PostToolUse` event for `apply_patch` and `edit` tool calls and calls the same shared dispatch table in `../../lib/post-edit-router.cjs`, so Claude Code and Codex never drift on which checker runs for a given file.

## 2. CONTENTS

| File | Fires On | Purpose |
|------|------|---------|
| `post-edit-quality.cjs` | Codex CLI `PostToolUse` on `apply_patch`/`edit`, registered in `.codex/hooks.json` | Reads the hook's stdin JSON, extracts the edited file path (including parsing the `*** Add/Update/Delete File:` header inside an `apply_patch` body), resolves its checker through `post-edit-router.cjs` and prints findings plus the dist-staleness banner. Warn-only and always exits 0 |

## 3. CONSUMERS

- `.codex/hooks.json` registers this file on Codex's `PostToolUse` event.

## 4. RELATED

- [`Hooks README`](../README.md)
- [`code-quality SKILL.md`](../../../SKILL.md)
