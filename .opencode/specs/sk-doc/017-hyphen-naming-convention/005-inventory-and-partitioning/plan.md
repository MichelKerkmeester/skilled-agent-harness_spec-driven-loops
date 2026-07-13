---
title: "Implementation Plan: inventory, partitioning, and worktree (019 phase 005)"
description: "Implementation Plan for phase 005 of the 019 kebab-case filesystem-naming program: inventory, partitioning, and worktree."
trigger_phrases:
  - "inventory, partitioning, and worktree implementation plan"
  - "hyphen naming phase 005 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/005-inventory-and-partitioning"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/005-inventory-and-partitioning"
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
# Implementation Plan: Inventory, partitioning, and worktree

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc + repo (phase 005) |
| **Change class** | Convention / logic / tooling |
| **Execution** | Worktree (established in phase 005) |

### Overview
The in-scope surface is large and interleaved with an enormous vendored Python tree and other exempt content. Detailed design is finalized when this phase is picked up for execution.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The inventory counts only in-scope names (all exemptions applied)
- [ ] The rename map is collision-free or collisions are enumerated for resolution
- [ ] Migration batches are defined by surface/skill family
- [ ] A dedicated worktree is established for execution

### Definition of Done
- [ ] A trustworthy rename map + batch plan exists
- [ ] Execution runs on an isolated worktree
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- A full repo inventory of in-scope snake_case FS names with every exemption applied.
- The authoritative rename map + collision/exemption report.
- Partition into migration batches by surface/skill family for phases 006-010.
- Establish the dedicated worktree for execution (sk-git).
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm predecessor phases landed; verify the worktree is clean and scoped.

### Phase 2: Implementation
- A full repo inventory of in-scope snake_case FS names with every exemption applied.
- The authoritative rename map + collision/exemption report.
- Partition into migration batches by surface/skill family for phases 006-010.
- Establish the dedicated worktree for execution (sk-git).

### Phase 3: Verification
- Vendored/`.py`/generated/tool-mandated names are excluded from the count
- The collision report lists 0 unresolved collisions before execution
- Each of phases 006-010 has an assigned, disjoint batch set
- A numbered `wt/*` worktree exists and is clean
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Vendored/`.py`/generated/tool-mandated names are excluded from the count |
| REQ-002 | The collision report lists 0 unresolved collisions before execution |
| REQ-003 | Each of phases 006-010 has an assigned, disjoint batch set |
| REQ-004 | A numbered `wt/*` worktree exists and is clean |
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
