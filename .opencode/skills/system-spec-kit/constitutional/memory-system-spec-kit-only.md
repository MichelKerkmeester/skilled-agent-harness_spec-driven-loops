---
title: "MEMORY — Spec-Kit System Only"
importanceTier: constitutional
contextType: decision
last_confirmed: "2026-05-31"
last_confirmed_source: "git-log-last-touch"
triggerPhrases:
  - save memory
  - save context
  - save to memory
  - remember this
  - remember that
  - claude memory
  - native memory
  - memory save
  - where to save memory
  - which memory system
---

# Memory — Spec-Kit System Only

## Rule

Use **only the Spec Kit Memory system** for all memories. Do **NOT** write to Claude Code native file-based memory unless the user, in that request, explicitly asks to save something to Claude memory.

Native memory = the per-project stores under `~/.claude/projects/<slug>/memory/` and `~/.claude-account2/projects/<slug>/memory/` (their `MEMORY.md` index + per-fact `.md` files).

## Why

The operator standardized on a single memory system (Spec Kit Memory) as the source of truth, and deleted all Claude native per-project memory on 2026-05-31. Two parallel stores drift, duplicate, and create ambiguity about where a fact lives; writing native memory again silently re-establishes the split the operator just removed. (Owner directive, 2026-05-31.)

## How to apply

1. Any "save memory" / "save context" / "remember this" request → **Spec Kit Memory**:
   - `/memory:save` (or compose JSON → `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js`) for normal/critical memories.
   - `/memory:learn` for always-surface constitutional rules (writes `constitutional/*.md`).
2. **NEVER**, on your own initiative, create or append to `~/.claude/**/memory/*.md` or `~/.claude-account2/**/memory/*.md` — not even a `MEMORY.md` index line.
3. **ONLY** write Claude native memory when the user's request explicitly says so (e.g. "save this to claude memory", "write it to native memory"). Native is off by default, opt-in per explicit instruction.
4. If unsure which system a save belongs in, default to Spec Kit Memory and say so — do not silently choose native.

## When this rule does NOT apply

- The user explicitly directs a save to Claude native memory in the current request.
- Reading existing native memory for context (this rule governs WRITES, not reads).
