---
title: "Devin: PostToolUse quality-check adapter"
description: "The Devin CLI sibling of the Claude/Codex post-edit quality hook, firing on the edit tool call."
---

# Devin

---

## 1. OVERVIEW

`devin/` holds the Devin CLI counterpart to `../claude-posttooluse.cjs` and `../codex/post-edit-quality.cjs`. It fires on Devin's `PostToolUse(^edit$)` event and calls the same shared dispatch table in `../../lib/post-edit-router.cjs`, so Claude Code, Codex, and Devin never drift on which checker runs for a given file.

**STATUS: LIVE** - Devin `PostToolUse(^edit$)` fired under `devin -p` with the corrected registration schema. Live payload capture confirmed `tool_input.file_path`, and direct invocation still covers malformed and missing-field fail-open behavior.

## 2. CONTENTS

| File | Fires On | Purpose |
|------|------|---------|
| `post-edit-quality.cjs` | Devin CLI `PostToolUse(^edit$)`, registered in `.devin/hooks.v1.json` | Reads stdin JSON, extracts the confirmed `tool_input.file_path` field with compatibility fallbacks, resolves its checker through `post-edit-router.cjs` and prints findings plus the dist-staleness banner. Warn-only and always exits 0. |

## 3. CONSUMERS

- `.devin/hooks.v1.json` registers this file on Devin's `PostToolUse` event for the `^edit$` matcher.

## 4. RELATED

- [`Hooks README`](../README.md)
- [`../codex/README.md`](../codex/README.md)
- [`code-quality SKILL.md`](../../../SKILL.md)
