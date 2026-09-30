---
title: "Implementation Plan: Global CLAUDE.md as a symlink to AGENTS.md"
description: "Back up the global Claude Code instruction file, then replace it with an absolute symlink to the repo root AGENTS.md so the stop-after-compaction rule goes away."
trigger_phrases:
  - "global claude md symlink plan"
  - "claude md backup and relink"
  - "compaction stop rule removal"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Global CLAUDE.md as a symlink to AGENTS.md

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Shell (macOS `cp`, `cmp`, `ln`) |
| **Framework** | Claude Code global instructions |
| **Storage** | Local filesystem, `~/.claude/` |
| **Testing** | `readlink`, `cmp` and `grep` against the linked file |

### Overview
Back up `~/.claude/CLAUDE.md` byte for byte, then replace it with an absolute symlink to the repo root `AGENTS.md`. The compaction-stop block goes away because the link target does not contain it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One source file with a symlink per runtime. `~/.codex/AGENTS.md` already links into this repo the same way.

### Key Components
- **Repo root `AGENTS.md`**: the single source of the behavior framework.
- **`~/.claude/CLAUDE.md`**: the global file Claude Code loads in every project, now a symlink.

### Data Flow
Claude Code reads `~/.claude/CLAUDE.md`. The filesystem resolves the link to the repo `AGENTS.md`, so each edit there reaches the next session.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`readlink` shows the link target. `cmp` proves the linked content matches `AGENTS.md`. `grep` proves the compaction block is gone. Behavior after a real compaction can only be seen in a live session.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The repo must stay at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`. The link is absolute.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`rm ~/.claude/CLAUDE.md && mv ~/.claude/CLAUDE.md.bak-2026-09-25 ~/.claude/CLAUDE.md` restores the original file.
<!-- /ANCHOR:rollback -->

---
