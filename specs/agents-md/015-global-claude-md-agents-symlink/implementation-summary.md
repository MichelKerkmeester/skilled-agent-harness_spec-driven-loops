---
title: "Implementation Summary"
description: "Claude Code no longer stops after a context compaction to wait for confirmation. The global CLAUDE.md that held that rule is now a symlink to the repo AGENTS.md."
trigger_phrases:
  - "global claude md symlink summary"
  - "compaction auto continue shipped"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/015-global-claude-md-agents-symlink"
    last_updated_at: "2026-09-25T20:10:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Replaced ~/.claude/CLAUDE.md with a symlink to the repo AGENTS.md after a verified backup"
    next_safe_action: "Check a fresh session for a double AGENTS.md load"
    blockers: []
    key_files:
      - "~/.claude/CLAUDE.md"
      - "~/.claude/CLAUDE.md.bak-2026-09-25"
      - "AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-global-claude-md-agents-symlink"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does Claude Code load AGENTS.md twice in this repo now?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-global-claude-md-agents-symlink |
| **Completed** | 2026-09-25 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Claude Code no longer stops after a context compaction to wait for your confirmation. The rule that caused the pause lived in your global `~/.claude/CLAUDE.md`, not in the repo `AGENTS.md`. That file is now a symlink to `AGENTS.md`.

### Global CLAUDE.md as a symlink to AGENTS.md

The old global file was one "Context Compaction Behavior" block: stop, re-read the file, summarize, then wait. Replacing the file removes that block. Every Claude Code session now reads the same framework the repo maintains, and edits to `AGENTS.md` reach it without a copy step. `~/.codex/AGENTS.md` already links into this repo the same way.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `~/.claude/CLAUDE.md` | Replaced | Now an absolute symlink to the repo root `AGENTS.md` |
| `~/.claude/CLAUDE.md.bak-2026-09-25` | Created | Byte-identical copy of the old file, for rollback |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The file sits outside any git repository, so the backup came first and `cmp` confirmed it matched. `ln -sf` then replaced the file with the link. The rule was searched for in the repo `AGENTS.md`, the rule files and both compaction hooks before the change. Only the global file held it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Symlink instead of editing out the block | The operator asked for it. It also keeps one source for the framework across runtimes |
| Absolute link target | Matches the existing `~/.codex/AGENTS.md` link |
| Backup kept in `~/.claude/`, not in the packet | The old file is private global config and should not be committed to this repo |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cmp` of the backup against the original | PASS: identical |
| `readlink ~/.claude/CLAUDE.md` | PASS: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/AGENTS.md` |
| `cmp ~/.claude/CLAUDE.md AGENTS.md` | PASS: no difference |
| `grep -c "Context Compaction Behavior" ~/.claude/CLAUDE.md` | PASS: 0 |
| Behavior after a real compaction | Not observed. Needs a live session |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Possible double load in this repo.** Claude Code also reads the project `AGENTS.md`, so this repo may now load it twice. A fresh session shows whether it does.
2. **Every project gets this framework.** Sessions in other repos now see its gates, including the spec-folder question.
3. **Absolute path.** If the repo moves, the link dangles. Rollback: `rm ~/.claude/CLAUDE.md && mv ~/.claude/CLAUDE.md.bak-2026-09-25 ~/.claude/CLAUDE.md`.
<!-- /ANCHOR:limitations -->

---
