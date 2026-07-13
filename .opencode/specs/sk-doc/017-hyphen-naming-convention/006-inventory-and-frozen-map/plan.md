---
title: "Implementation Plan: inventory and frozen rename map (017 phase 006)"
description: "Implementation Plan for phase 006 of the 017 kebab-case filesystem-naming program: inventory and frozen rename map."
trigger_phrases:
  - "inventory and frozen rename map implementation plan"
  - "hyphen naming phase 006 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/006-inventory-and-frozen-map"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/006-inventory-and-frozen-map"
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
# Implementation Plan: Inventory and frozen rename map

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc + repo (phase 006) |
| **Change class** | Rename map |
| **Execution** | Isolated worktree pinned to BASE (established in phase 000) |

### Overview
Before any rename, the in-scope surface must be frozen into a bijective, fully-classified rename map partitioned by dependency closure. Detailed design is finalized when this phase is picked up for execution against the pinned baseline.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The inventory counts only in-scope names with every exemption applied
- [ ] The rename map is bijective
- [ ] Every candidate has exactly one classification with no "unknown" bucket
- [ ] Batches are dependency-closed (reference-graph SCCs)
- [ ] The map is hashed together with BASE for reproducibility

### Definition of Done
- [ ] A trustworthy, frozen, bijective, classified rename map exists
- [ ] Execution batches are dependency-closed and reproducible
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- A full repo inventory (recomputed independently of 000) with every exemption applied.
- A bijective source->target rename map: every source exists, every target is unique and absent.
- A complete classification: every candidate is exactly one of rename/exempt/frozen/generated/tool-mandated; no "unknown".
- Partition into dependency-closed batches (reference-graph SCCs), hashed together with BASE.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm predecessor phases landed; verify the worktree is clean, pinned to BASE, and scoped.

### Phase 2: Implementation
- A full repo inventory (recomputed independently of 000) with every exemption applied.
- A bijective source->target rename map: every source exists, every target is unique and absent.
- A complete classification: every candidate is exactly one of rename/exempt/frozen/generated/tool-mandated; no "unknown".
- Partition into dependency-closed batches (reference-graph SCCs), hashed together with BASE.

### Phase 3: Verification
- Vendored/.py/package-dir/generated/tool-mandated names are excluded
- Every source exists; every target is unique and currently absent
- The classification report has 0 un-classified candidates
- No batch references a rename in another un-landed batch
- A stored digest binds the map to the exact BASE SHA
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Vendored/.py/package-dir/generated/tool-mandated names are excluded |
| REQ-002 | Every source exists; every target is unique and currently absent |
| REQ-003 | The classification report has 0 un-classified candidates |
| REQ-004 | No batch references a rename in another un-landed batch |
| REQ-005 | A stored digest binds the map to the exact BASE SHA |
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
