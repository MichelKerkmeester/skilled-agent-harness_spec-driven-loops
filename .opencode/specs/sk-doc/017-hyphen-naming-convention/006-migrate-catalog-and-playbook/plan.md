---
title: "Implementation Plan: migrate catalog and playbook content (019 phase 006)"
description: "Implementation Plan for phase 006 of the 019 kebab-case filesystem-naming program: migrate catalog and playbook content."
trigger_phrases:
  - "migrate catalog and playbook content implementation plan"
  - "hyphen naming phase 006 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/006-migrate-catalog-and-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/006-migrate-catalog-and-playbook"
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
# Implementation Plan: Migrate catalog and playbook content

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc + repo (phase 006) |
| **Change class** | Filesystem rename + reference sweep |
| **Execution** | Worktree (established in phase 005) |

### Overview
Packet 027 renamed catalog/playbook content to underscore. Detailed design is finalized when this phase is picked up for execution.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Zero underscore catalog/playbook filesystem names remain (excl frozen)
- [ ] The catalog roots are hyphenated and still classify correctly
- [ ] All catalog/playbook references resolve after the rename

### Definition of Done
- [ ] 027 is reversed for catalog/playbook content
- [ ] Classification survives the root rename
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Rename the two catalog/playbook roots and all underscore content folders/files back to hyphens, all skills.
- Rewrite index tables + `category:` frontmatter + cross-references in lockstep.
- Validate each family against the 002 classifier before commit.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm predecessor phases landed; verify the worktree is clean and scoped.

### Phase 2: Implementation
- Rename the two catalog/playbook roots and all underscore content folders/files back to hyphens, all skills.
- Rewrite index tables + `category:` frontmatter + cross-references in lockstep.
- Validate each family against the 002 classifier before commit.

### Phase 3: Verification
- `git ls-files` finds 0 underscore names under the two roots
- Leaves under `feature-catalog` type correctly under the 002 logic
- Index tables + frontmatter + cross-refs point at hyphenated paths
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | `git ls-files` finds 0 underscore names under the two roots |
| REQ-002 | Leaves under `feature-catalog` type correctly under the 002 logic |
| REQ-003 | Index tables + frontmatter + cross-refs point at hyphenated paths |
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
