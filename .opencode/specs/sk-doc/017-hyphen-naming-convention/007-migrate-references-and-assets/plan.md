---
title: "Implementation Plan: migrate references and assets (019 phase 007)"
description: "Implementation Plan for phase 007 of the 019 kebab-case filesystem-naming program: migrate references and assets."
trigger_phrases:
  - "migrate references and assets implementation plan"
  - "hyphen naming phase 007 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/007-migrate-references-and-assets"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/007-migrate-references-and-assets"
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
# Implementation Plan: Migrate references and assets

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc + repo (phase 007) |
| **Change class** | Filesystem rename + reference sweep |
| **Execution** | Worktree (established in phase 005) |

### Overview
Snake_case folders and files exist under `references/`, `assets/`, and `benchmark/` across skills (non-catalog). Detailed design is finalized when this phase is picked up for execution.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Zero in-scope underscore names remain under references/assets/benchmark (excl frozen/exempt)
- [ ] All references to the renamed paths resolve
- [ ] Exemptions are honored in these surfaces

### Definition of Done
- [ ] Reference/asset trees are hyphenated
- [ ] No broken links in the touched surfaces
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Hyphenate snake_case folders/files under `references/`, `assets/`, `benchmark/` across all skills.
- Rewrite all cross-references and nav links to the renamed paths.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm predecessor phases landed; verify the worktree is clean and scoped.

### Phase 2: Implementation
- Hyphenate snake_case folders/files under `references/`, `assets/`, `benchmark/` across all skills.
- Rewrite all cross-references and nav links to the renamed paths.

### Phase 3: Verification
- `git ls-files` finds 0 in-scope underscore names in those surfaces
- Markdown-link guard is clean over the touched surfaces
- No `.py`/vendored/generated asset name is renamed
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | `git ls-files` finds 0 in-scope underscore names in those surfaces |
| REQ-002 | Markdown-link guard is clean over the touched surfaces |
| REQ-003 | No `.py`/vendored/generated asset name is renamed |
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
