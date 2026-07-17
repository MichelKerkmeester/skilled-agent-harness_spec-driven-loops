---
title: "Implementation Plan: root-name consumer migration (032 phase 002)"
description: "Implementation Plan for phase 002 of the 032 kebab-case filesystem-naming program: root-name consumer migration."
trigger_phrases:
  - "root-name consumer migration implementation plan"
  - "hyphen naming phase 002 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/002-root-name-consumer-migration"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/002-root-name-consumer-migration"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Added fail-closed coexistence gates to the consumer architecture and test strategy"
    next_safe_action: "Execute the manifest-driven per-skill matrix before accepting the phase"
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
- [ ] Every active skill consumer has a coexistence-window fail-closed case for an un-migrated or unsupported root/index

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
- A per-skill fail-closed matrix: unsupported or un-migrated names refuse at each consumer boundary, while recognized legacy aliases are accepted only through the shared resolver.
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
- A fail-closed coexistence matrix covering every active skill family in the reviewed consumer manifest; no unsupported name may silently become `readme`, an empty corpus, or an unrelated path.

### Phase 3: Verification
- A reviewed consumer manifest lists each and all are updated
- A hyphenated catalog leaf classifies as its typed document, not `readme`; the symlink mode stays 120000
- Both roots classify identically for reads; coexistence of both physical roots errors
- Discovered-scenario count and IDs are unchanged
- The guard rejects underscore catalog content and accepts hyphenated content
- Matrix tests pass for both separators
- Every consumer-manifest row and active skill-family row refuses an un-migrated or unsupported root/index without silent mis-resolution
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
| REQ-007 | Each consumer-manifest row is exercised with an unsupported or un-migrated root/index and fails closed; recognized legacy aliases are tested only through the shared resolver with typed parity |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Inherits the 032 program dependencies: the Lane C benchmark harness (regression check), the spec-kit validator
(rebuilt in the worktree), and sk-git for the worktree lifecycle. Phase-specific dependencies are the predecessor
phases named in this phase's spec adjacency.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All work lands on the dedicated worktree in path-scoped commits, so `git revert` of this phase's commits restores the
prior state (or a stopped, disposable satellite worktree is discarded). No data migration beyond git-reversible
filesystem renames and reference rewrites — except the SQLite handling in phase 013, which is schema-aware.
<!-- /ANCHOR:rollback -->
