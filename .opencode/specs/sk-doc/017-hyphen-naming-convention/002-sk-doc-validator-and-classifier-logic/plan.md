---
title: "Implementation Plan: sk-doc validator and classifier logic (019 phase 002)"
description: "Implementation Plan for phase 002 of the 019 kebab-case filesystem-naming program: sk-doc validator and classifier logic."
trigger_phrases:
  - "sk-doc validator and classifier logic implementation plan"
  - "hyphen naming phase 002 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/002-sk-doc-validator-and-classifier-logic"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/002-sk-doc-validator-and-classifier-logic"
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
# Implementation Plan: sk-doc validator and classifier logic

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc + repo (phase 002) |
| **Change class** | Convention / logic / tooling |
| **Execution** | Worktree (established in phase 005) |

### Overview
The sk-doc classifier keys on the `feature_catalog` / `manual_testing_playbook` parent-directory names (validate_document.py:129,137, both copies) and the Lane C loader keys on frontmatter. Detailed design is finalized when this phase is picked up for execution.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The classifier recognizes hyphenated catalog/playbook roots and still types leaves correctly
- [ ] A dual-name tolerance accepts both underscore and hyphen roots during transition
- [ ] Both copies of the classifier change identically with no drift
- [ ] The Lane C loader remains separator-agnostic and loads unchanged

### Definition of Done
- [ ] Hyphenated catalog roots classify correctly
- [ ] Dual-name tolerance lets 002 land before 006
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- `validate_document.py` classifier (both copies) updated to recognize `feature-catalog` / `manual-testing-playbook`.
- A transition tolerance that accepts BOTH the underscore and hyphen root names during migration.
- Any validator rule or Lane C loader path that references the two root names by string.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm predecessor phases landed; verify the worktree is clean and scoped.

### Phase 2: Implementation
- `validate_document.py` classifier (both copies) updated to recognize `feature-catalog` / `manual-testing-playbook`.
- A transition tolerance that accepts BOTH the underscore and hyphen root names during migration.
- Any validator rule or Lane C loader path that references the two root names by string.

### Phase 3: Verification
- A hyphenated catalog leaf classifies as its typed document, not `readme`
- Both `feature_catalog` and `feature-catalog` leaves classify identically
- Diff of the two copies is byte-identical in the changed region
- Discovered-scenario count is unchanged
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | A hyphenated catalog leaf classifies as its typed document, not `readme` |
| REQ-002 | Both `feature_catalog` and `feature-catalog` leaves classify identically |
| REQ-003 | Diff of the two copies is byte-identical in the changed region |
| REQ-004 | Discovered-scenario count is unchanged |
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
