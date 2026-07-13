---
title: "Feature Specification: inventory, partitioning, and worktree (019 phase 005)"
description: "The in-scope surface is large and interleaved with an enormous vendored Python tree and other exempt content. Before renaming, the program needs an exemption-applied inventory, the authoritative rename map, a collision/exemption report, and a partition into safe migration batches — executed on a dedicated worktree."
trigger_phrases:
  - "inventory, partitioning, and worktree"
  - "hyphen naming phase 005"
  - "kebab-case inventory and"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/005-inventory-and-partitioning"
    last_updated_at: "2026-07-13T11:44:19Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase spec scaffolded from the 019 decomposition"
    next_safe_action: "Plan this phase when it is picked up for execution"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Inventory, partitioning, and worktree

> Phase adjacency under the 019 parent (grouping order, not a runtime dependency): predecessor `004-guard-and-migration-tooling`; successor `006-migrate-catalog-and-playbook`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/005-inventory-and-partitioning |
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 005 of the 019 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The in-scope surface is large and interleaved with an enormous vendored Python tree and other exempt content. Before renaming, the program needs an exemption-applied inventory, the authoritative rename map, a collision/exemption report, and a partition into safe migration batches — executed on a dedicated worktree.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A full repo inventory of in-scope snake_case FS names with every exemption applied.
- The authoritative rename map + collision/exemption report.
- Partition into migration batches by surface/skill family for phases 006-010.
- Establish the dedicated worktree for execution (sk-git).

### Out of Scope
- Performing the renames (006-010).
- Tooling construction (004).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The inventory counts only in-scope names (all exemptions applied) | Vendored/`.py`/generated/tool-mandated names are excluded from the count |
| REQ-002 | The rename map is collision-free or collisions are enumerated for resolution | The collision report lists 0 unresolved collisions before execution |
| REQ-003 | Migration batches are defined by surface/skill family | Each of phases 006-010 has an assigned, disjoint batch set |
| REQ-004 | A dedicated worktree is established for execution | A numbered `wt/*` worktree exists and is clean |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A trustworthy rename map + batch plan exists.
- **SC-002**: Execution runs on an isolated worktree.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Inherits the program-level risks in the 019 parent spec (import breakage, validator downgrade, over-broad sweep,
exemption leakage, concurrent sessions). Phase-specific risks are enumerated in this phase's plan.md when it is planned.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking at scaffold time; resolved during this phase's planning.
<!-- /ANCHOR:questions -->
