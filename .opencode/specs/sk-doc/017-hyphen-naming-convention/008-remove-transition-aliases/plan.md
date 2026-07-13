---
title: "Implementation Plan: remove transition aliases (017 phase 008)"
description: "Implementation Plan for phase 008 of the 017 kebab-case filesystem-naming program: remove transition aliases."
trigger_phrases:
  - "remove transition aliases implementation plan"
  - "hyphen naming phase 008 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-remove-transition-aliases"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-remove-transition-aliases"
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
# Implementation Plan: Remove transition aliases

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc + repo (phase 008) |
| **Change class** | Logic cleanup |
| **Execution** | Isolated worktree pinned to BASE (established in phase 000) |

### Overview
The 002 dual-name tolerance was a bridge. Detailed design is finalized when this phase is picked up for execution against the pinned baseline.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The underscore aliases are removed from all 002 consumers
- [ ] The old live root names are rejected
- [ ] Only scoped frozen/exempt references to the old names remain
- [ ] The Lane C loader still loads all scenarios under the hyphenated roots
- [ ] The convention guard now enforces hyphen-only for catalog content

### Definition of Done
- [ ] The dual-name bridge is removed
- [ ] Hyphenated roots are the only accepted form
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Remove the underscore aliases from the 002 classifier/loader/guards.
- Prove the old live root names are now rejected.
- Confirm only scoped frozen/exempt references to the old names remain.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm predecessor phases landed; verify the worktree is clean, pinned to BASE, and scoped.

### Phase 2: Implementation
- Remove the underscore aliases from the 002 classifier/loader/guards.
- Prove the old live root names are now rejected.
- Confirm only scoped frozen/exempt references to the old names remain.

### Phase 3: Verification
- No consumer accepts the underscore roots anymore
- A synthetic underscore catalog leaf fails classification/guard
- A scope-aware scan finds old-name references only under frozen/exempt paths
- Scenario count and IDs unchanged after alias removal
- The inverse guard rejects any re-introduced underscore catalog name
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | No consumer accepts the underscore roots anymore |
| REQ-002 | A synthetic underscore catalog leaf fails classification/guard |
| REQ-003 | A scope-aware scan finds old-name references only under frozen/exempt paths |
| REQ-004 | Scenario count and IDs unchanged after alias removal |
| REQ-005 | The inverse guard rejects any re-introduced underscore catalog name |
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
