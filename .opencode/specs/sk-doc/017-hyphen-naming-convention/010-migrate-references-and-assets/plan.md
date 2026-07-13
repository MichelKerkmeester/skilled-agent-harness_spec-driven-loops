---
title: "Implementation Plan: migrate references and assets (017 phase 010)"
description: "Implementation Plan for phase 010 of the 017 kebab-case filesystem-naming program: migrate references and assets."
trigger_phrases:
  - "migrate references and assets implementation plan"
  - "hyphen naming phase 010 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/010-migrate-references-and-assets"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/010-migrate-references-and-assets"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Plan authored from the 16-phase decomposition"
    next_safe_action: "Execute this phase on the pinned worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Migrate references and assets

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc + repo (phase 010) |
| **Change class** | Filesystem rename + reference sweep |
| **Execution** | Isolated worktree pinned to BASE (established in phase 000) |

### Overview
Snake_case folders and files exist under `references/`, `assets/`, and `benchmark/` across skills (non-catalog). Detailed design is finalized when this phase is picked up for execution against the pinned baseline.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Zero in-scope underscore names remain under references/assets/benchmark (excl frozen/exempt)
- [ ] All references to the renamed paths resolve
- [ ] Exemptions are honored in these surfaces
- [ ] Batches are dependency-closed
- [ ] Touched packets strict-validate after each batch

### Definition of Done
- [ ] Reference/asset trees are hyphenated
- [ ] No broken links in the touched surfaces
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Hyphenate snake_case folders/files under `references/`, `assets/`, `benchmark/` across all skills, in dependency-closed batches.
- Rewrite all cross-references and nav links to the renamed paths.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm predecessor phases landed; verify the worktree is clean, pinned to BASE, and scoped.

### Phase 2: Implementation
- Hyphenate snake_case folders/files under `references/`, `assets/`, `benchmark/` across all skills, in dependency-closed batches.
- Rewrite all cross-references and nav links to the renamed paths.

### Phase 3: Verification
- `git ls-files` finds 0 in-scope underscore names in those surfaces
- Markdown-link + path-value resolution is clean over the touched surfaces
- No .py/vendored/generated asset name is renamed
- Each batch lands green without referencing an un-landed rename
- `validate.sh --strict` Errors 0 on touched skills
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | `git ls-files` finds 0 in-scope underscore names in those surfaces |
| REQ-002 | Markdown-link + path-value resolution is clean over the touched surfaces |
| REQ-003 | No .py/vendored/generated asset name is renamed |
| REQ-004 | Each batch lands green without referencing an un-landed rename |
| REQ-005 | `validate.sh --strict` Errors 0 on touched skills |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Inherits the 017 program dependencies: the Lane C benchmark harness (regression check), the spec-kit validator
(rebuilt in the worktree), and sk-git for the worktree lifecycle. Phase-specific dependencies are the predecessor
phases named in this phase's spec adjacency.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All work lands on the dedicated worktree in path-scoped commits, so `git revert` of this phase's commits restores the
prior state (or a stopped, disposable satellite worktree is discarded). No data migration beyond git-reversible
filesystem renames and reference rewrites — except the SQLite handling in phase 013, which is schema-aware.
<!-- /ANCHOR:rollback -->
