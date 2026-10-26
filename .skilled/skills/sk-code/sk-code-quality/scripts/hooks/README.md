---
title: "Hooks: Legacy Post-Edit Quality Predecessor"
description: "Holds the legacy, unregistered claude-posttooluse.sh predecessor and its parse regression fixture. The live post-edit-quality hooks live in .skilled/hooks/post-edit-quality/."
trigger_phrases:
  - "legacy post edit hook"
  - "claude posttooluse sh"
version: 1.0.1.0
---

# Hooks: Legacy Post-Edit Quality Predecessor

---

## 1. OVERVIEW

`hooks/` holds `claude-posttooluse.sh`, the predecessor Python hook (despite the `.sh` extension) for Claude Code `PostToolUse` on `Write`/`Edit`. It shells out to `../check-comment-hygiene.sh` and `../check-dist-staleness.sh` directly and is **not currently registered** in any runtime config, kept for reference only.

The live post-edit-quality hooks (the `.cjs` adapters and their shared router) live in [`.skilled/hooks/post-edit-quality/`](../../../../../hooks/post-edit-quality/README.md). The checker scripts they spawn still live one level up in `../`, owned by this skill.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `claude-posttooluse.sh` | Legacy, unregistered predecessor. Warn-only: dispatches both checkers and always exits 0. |
| `claude-posttooluse.test.sh` | Parse regression fixture for the legacy hook. Prints `Post-edit adapter parse regression fixture passed` |

---

## 3. RELATED

- [`../../../../../hooks/post-edit-quality/README.md`](../../../../../hooks/post-edit-quality/README.md): the live hook home.
- [`../check-comment-hygiene.sh`](../check-comment-hygiene.sh), [`../check-dist-staleness.sh`](../check-dist-staleness.sh): the checkers this skill still owns.
- [`Scripts README`](../README.md), [`code-quality SKILL.md`](../../SKILL.md)
