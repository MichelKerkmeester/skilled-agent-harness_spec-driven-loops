---
title: "Implementation Plan: Repo-Agnostic Git Workspace Rows [specs/agents/005-git-workspace-repo-agnostic]"
description: "Plan to rewrite the AGENTS.md Git Workspace Safety rows so they state universal principles and name sk-git, moving every repo-specific token into sk-git."
trigger_phrases:
  - "agents.md plan"
  - "repo agnostic"
  - "git workspace safety"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/005-git-workspace-repo-agnostic"
    last_updated_at: "2026-08-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the repo-agnostic rewrite plan"
    next_safe_action: "Land the AGENTS.md edit and packet to v4 and main"
    blockers: []
    key_files:
      - "AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-hardening"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Repo-Agnostic Git Workspace Rows

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
`AGENTS.md` is the portable framework template; sk-git (`.opencode/skills/sk-git/`) is the repo-specific implementation, loaded on any git-workflow task. The Git Workspace Safety table had leaked implementation detail (grammar, script paths, command names, env flags, allowlist) up into the framework doc.

### Overview
Rewrite the six rows so they state the universal principle and name sk-git, with no repo-specific token. `CLAUDE.md` is a symlink to `AGENTS.md`, so one edit covers both. Docs-only, no behavior change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- The current `##### Git Workspace Safety` table has been read.

### Definition of Done
- Section-scoped grep for the forbidden repo-specific tokens returns 0.
- sk-git still named in the Mandatory Tools row and the Quick Reference row.
- `diff --stat AGENTS.md` shows only the one-table rewrite.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Correct the layering: `AGENTS.md` states WHAT the rules are and points to sk-git; sk-git holds HOW (grammar, script paths, command names, env flags, allowlist).

### Key Components
- `AGENTS.md` §5 Git Workspace Safety table (the only edit surface).
- sk-git (unchanged reference target).

### Data Flow
An agent hits a git-workflow trigger, routes through sk-git, and reads the specifics there. `AGENTS.md` only needs to name the rule and the owner.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
Read the current `##### Git Workspace Safety` table.

### Phase 2: Core Implementation
Rewrite the rows: Branch grammar → Branch naming; Allocate-never-count (drop script/commands); No-direct-branch-creation (keep the universal git-command prohibition, drop the specific command); Ask-before-push (drop allowlist file, env bypass flag, reference path); remove the hyphen-case-pilot row; Live-sync (drop the four flag names and reference path). Leave the Ask-first-worktree-vs-branch row and the sk-git mentions in Mandatory Tools + Quick Reference unchanged.

### Phase 3: Verification
Grep the section for the forbidden tokens (must be 0); confirm sk-git still named; confirm no other section changed.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Docs-only, so verification is static: section-scoped forbidden-token grep, a `diff --stat` scoped to the one table, and a check that sk-git is still named in the two unchanged rows.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None. sk-git already documents the grammar, allocator commands, push policy, and flags; this packet only removes the duplicated copies from `AGENTS.md`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Low blast radius, fully reversible: `git revert` the single docs commit restores the prior rows. No runtime, hook, or script is touched.
<!-- /ANCHOR:rollback -->
