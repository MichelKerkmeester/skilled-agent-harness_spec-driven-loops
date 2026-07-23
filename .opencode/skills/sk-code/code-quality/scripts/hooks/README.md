---
title: "Hooks: PostToolUse quality-check adapters"
description: "Runtime-specific hook entrypoints that fire on file-edit tool calls and surface comment-hygiene and dist-staleness warnings."
---

# Hooks

---

## 1. OVERVIEW

`hooks/` holds the PostToolUse adapters that call the shared dispatch table in `../lib/post-edit-router.cjs` after each file edit. Each file fires on a different runtime's edit event. Both are warn-only and always exit 0, so a checker bug never blocks the tool call it observes.

## 2. CONTENTS

| File / Folder | Fires On | Purpose |
|------|------|---------|
| `claude-posttooluse.cjs` | Claude Code `PostToolUse` on `Write`/`Edit`, registered in `.claude/settings.json` | Reads the hook's stdin JSON, resolves the edited file's checker through `post-edit-router.cjs`, runs it under a 9s budget and prints findings plus the dist-staleness banner |
| `claude-posttooluse.sh` | Claude Code `PostToolUse` on `Write`/`Edit` (legacy, not currently registered) | Predecessor Python hook that shells out to `check-comment-hygiene.sh` and `check-dist-staleness.sh` directly, kept for reference alongside the `.cjs` adapter that replaced it |
| `codex/` | Codex CLI `PostToolUse` on `apply_patch`/`edit` | See `codex/README.md` |

## 3. CONSUMERS

- `.claude/settings.json` registers `claude-posttooluse.cjs` on Claude Code's `PostToolUse` matcher for `Write\|Edit`.
- `.codex/hooks.json` registers `codex/post-edit-quality.cjs` on Codex's `PostToolUse` event.

## 4. RELATED

- [`Scripts README`](../README.md)
- [`code-quality SKILL.md`](../../SKILL.md)
