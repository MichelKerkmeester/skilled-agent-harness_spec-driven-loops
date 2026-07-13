---
title: "Implementation Plan: root-name consumer migration (017 phase 002)"
description: "Implementation Plan for phase 002 of the 017 kebab-case filesystem-naming program: root-name consumer migration."
trigger_phrases:
  - "root-name consumer migration implementation plan"
  - "hyphen naming phase 002 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/002-root-name-consumer-migration"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/002-root-name-consumer-migration"
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
# Implementation Plan: Root-name consumer migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc + repo (phase 002) |
| **Change class** | Logic (all consumers) |
| **Execution** | Isolated worktree pinned to BASE (established in phase 000) |

### Overview
The catalog/playbook root + index names are consumed by a network of runtime paths, not just the classifier: the classifier is a symlink plus a real file, the Lane C loader + generator, parent-skill-check.cjs, post-edit-router.cjs, package_skill.py, and an INVERSE guard that currently rejects the hyphenated state. Detailed design is finalized when this phase is picked up for execution against the pinned baseline.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Every runtime consumer of the catalog/playbook root/index names accepts the hyphenated roots
- [ ] The classifier change preserves the symlink and types hyphenated leaves correctly
- [ ] A bounded dual-name tolerance accepts both roots but fails closed if both physically coexist
- [ ] The Lane C loader + generator load unchanged against the hyphenated roots
- [ ] The inverse guard and its tests are redefined to the hyphenated target
- [ ] Root-name handling is correct on POSIX and Windows-style path separators

### Definition of Done
- [ ] All consumers accept hyphenated catalog roots
- [ ] Dual-name tolerance lets 002 land before 007 with zero downgrade risk
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- The `validate_document.py` classifier: update the real file under `shared/scripts/` and preserve the `sk-doc/scripts/` symlink (mode 120000).
- The Lane C loader (`load-playbook-scenarios.cjs`) + generator (`playbook-generator.cjs`) hardcoded root/index names.
- `parent-skill-check.cjs`, `post-edit-router.cjs`, and `package_skill.py` root-name references.
- The inverse guard `check_no_hyphenated_catalog_content.py` + its tests, plus `test_category_classification_denumbered.py`, redefined to the hyphenated target.
- A bounded dual-name tolerance: accept both roots for reads, emit only hyphens, fail closed if both physical roots coexist.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm predecessor phases landed; verify the worktree is clean, pinned to BASE, and scoped.

### Phase 2: Implementation
- The `validate_document.py` classifier: update the real file under `shared/scripts/` and preserve the `sk-doc/scripts/` symlink (mode 120000).
- The Lane C loader (`load-playbook-scenarios.cjs`) + generator (`playbook-generator.cjs`) hardcoded root/index names.
- `parent-skill-check.cjs`, `post-edit-router.cjs`, and `package_skill.py` root-name references.
- The inverse guard `check_no_hyphenated_catalog_content.py` + its tests, plus `test_category_classification_denumbered.py`, redefined to the hyphenated target.
- A bounded dual-name tolerance: accept both roots for reads, emit only hyphens, fail closed if both physical roots coexist.

### Phase 3: Verification
- A reviewed consumer manifest lists each and all are updated
- A hyphenated catalog leaf classifies as its typed document, not `readme`; the symlink mode stays 120000
- Both roots classify identically for reads; coexistence of both physical roots errors
- Discovered-scenario count and IDs are unchanged
- The guard rejects underscore catalog content and accepts hyphenated content
- Matrix tests pass for both separators
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | A reviewed consumer manifest lists each and all are updated |
| REQ-002 | A hyphenated catalog leaf classifies as its typed document, not `readme`; the symlink mode stays 120000 |
| REQ-003 | Both roots classify identically for reads; coexistence of both physical roots errors |
| REQ-004 | Discovered-scenario count and IDs are unchanged |
| REQ-005 | The guard rejects underscore catalog content and accepts hyphenated content |
| REQ-006 | Matrix tests pass for both separators |
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
