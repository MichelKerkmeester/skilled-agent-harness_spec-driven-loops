---
title: "Implementation Plan: migrate specs and docs (019 phase 009)"
description: "Implementation Plan for phase 009 of the 019 kebab-case filesystem-naming program: migrate specs and docs."
trigger_phrases:
  - "migrate specs and docs implementation plan"
  - "hyphen naming phase 009 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/009-migrate-specs-and-docs"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/009-migrate-specs-and-docs"
    last_updated_at: "2026-07-13T11:44:19Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Plan scaffolded from the 019 decomposition"
    next_safe_action: "Plan or execute this phase on the worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Migrate specs and docs

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc + repo (phase 009) |
| **Change class** | Filesystem rename + reference sweep |
| **Execution** | Worktree (established in phase 005) |

### Overview
Remaining in-scope snake_case names exist across spec docs and other `.md` filesystem names. Detailed design is finalized when this phase is picked up for execution.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Zero in-scope underscore doc filenames remain outside frozen surfaces
- [ ] Frozen surfaces are untouched
- [ ] Doc cross-references resolve after the rename

### Definition of Done
- [ ] Doc filesystem names are hyphenated
- [ ] Frozen history preserved
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Hyphenate in-scope snake_case `.md` and doc filesystem names outside frozen surfaces.
- Rewrite doc cross-references to the renamed paths.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm predecessor phases landed; verify the worktree is clean and scoped.

### Phase 2: Implementation
- Hyphenate in-scope snake_case `.md` and doc filesystem names outside frozen surfaces.
- Rewrite doc cross-references to the renamed paths.

### Phase 3: Verification
- `git ls-files` finds 0 in-scope underscore doc names (excl frozen)
- No change under `z_archive/`, changelogs, or completed history
- Markdown-link guard is clean
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | `git ls-files` finds 0 in-scope underscore doc names (excl frozen) |
| REQ-002 | No change under `z_archive/`, changelogs, or completed history |
| REQ-003 | Markdown-link guard is clean |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Inherits the 019 program dependencies: the Lane C benchmark harness (regression check), the spec-kit validator
(rebuilt in the worktree), and sk-git for the worktree lifecycle. Phase-specific dependencies are the predecessor
phases named in this phase's spec adjacency.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All work lands on the dedicated worktree in path-scoped commits, so `git revert` of this phase's commits restores the
prior state. No data migration is involved — filesystem renames and reference rewrites are fully git-reversible.
<!-- /ANCHOR:rollback -->
