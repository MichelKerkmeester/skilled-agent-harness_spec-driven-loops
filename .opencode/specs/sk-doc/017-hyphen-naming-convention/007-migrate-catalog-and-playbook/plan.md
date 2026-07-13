---
title: "Implementation Plan: migrate catalog and playbook (017 phase 007)"
description: "Implementation Plan for phase 007 of the 017 kebab-case filesystem-naming program: migrate catalog and playbook."
trigger_phrases:
  - "migrate catalog and playbook implementation plan"
  - "hyphen naming phase 007 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/007-migrate-catalog-and-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/007-migrate-catalog-and-playbook"
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
# Implementation Plan: Migrate catalog and playbook

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc + repo (phase 007) |
| **Change class** | Filesystem rename + reference sweep |
| **Execution** | Isolated worktree pinned to BASE (established in phase 000) |

### Overview
Packet 027 renamed catalog/playbook content to underscore. Detailed design is finalized when this phase is picked up for execution against the pinned baseline.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Zero underscore catalog/playbook filesystem names remain (excl frozen)
- [ ] The catalog roots are hyphenated and still classify correctly
- [ ] All catalog/playbook references resolve after the rename
- [ ] Only frontmatter VALUES that are paths/slugs change; keys are untouched
- [ ] Lane C scenario IDs and semantics are unchanged vs baseline

### Definition of Done
- [ ] 027 is reversed for catalog/playbook content
- [ ] Classification survives the root rename with zero downgrade
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Rename `feature_catalog`->`feature-catalog`, `manual_testing_playbook`->`manual-testing-playbook`, and all underscore content back to hyphens, all skills.
- Rewrite index tables + `category:` frontmatter VALUES + cross-references in lockstep.
- Validate each family against the 002 classifier before commit; enumerate every leaf type.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm predecessor phases landed; verify the worktree is clean, pinned to BASE, and scoped.

### Phase 2: Implementation
- Rename `feature_catalog`->`feature-catalog`, `manual_testing_playbook`->`manual-testing-playbook`, and all underscore content back to hyphens, all skills.
- Rewrite index tables + `category:` frontmatter VALUES + cross-references in lockstep.
- Validate each family against the 002 classifier before commit; enumerate every leaf type.

### Phase 3: Verification
- `git ls-files` finds 0 underscore names under the two roots
- Every leaf under `feature-catalog` types correctly under the 002 logic — zero `readme` downgrade
- Index tables + frontmatter values + cross-refs point at hyphenated paths
- Frontmatter key diff is empty; only path-valued fields moved
- Scenario IDs, prompts, expectations, and scores match the 000 snapshot
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | `git ls-files` finds 0 underscore names under the two roots |
| REQ-002 | Every leaf under `feature-catalog` types correctly under the 002 logic — zero `readme` downgrade |
| REQ-003 | Index tables + frontmatter values + cross-refs point at hyphenated paths |
| REQ-004 | Frontmatter key diff is empty; only path-valued fields moved |
| REQ-005 | Scenario IDs, prompts, expectations, and scores match the 000 snapshot |
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
