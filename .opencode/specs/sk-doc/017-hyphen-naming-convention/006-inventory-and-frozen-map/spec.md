---
title: "Feature Specification: inventory and frozen rename map (017 phase 006)"
description: "Before any rename, the in-scope surface must be frozen into a bijective, fully-classified rename map partitioned by dependency closure. Every candidate must be classified exactly once (rename/exempt/frozen/generated/tool-mandated) with no 'unknown' bucket, and the map hashed with BASE so execution is reproducible."
trigger_phrases:
  - "inventory and frozen rename map"
  - "hyphen naming phase 006"
  - "kebab-case inventory and"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/006-inventory-and-frozen-map"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase spec authored for the 017 phased tree"
    next_safe_action: "Execute this phase on the pinned worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Inventory and frozen rename map

> Phase adjacency under the 017 parent (grouping order, not a runtime dependency): predecessor `005-rename-and-reference-tooling`; successor `007-shared-and-cross-cutting-closures`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/006-inventory-and-frozen-map |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 006 of the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Before any rename, the in-scope surface must be frozen into a bijective, fully-classified rename map partitioned by dependency closure. Every candidate must be classified exactly once (rename/exempt/frozen/generated/tool-mandated) with no "unknown" bucket, and the map hashed with BASE so execution is reproducible.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A full repo inventory (recomputed independently of 000) with every exemption applied.
- A bijective source->target rename map: every source exists, every target is unique and absent.
- A complete classification: every candidate is exactly one of rename/exempt/frozen/generated/tool-mandated; no "unknown".
- Partition into dependency-closed batches (reference-graph SCCs), hashed together with BASE.

### Out of Scope
- Performing the renames (007+).
- Tooling construction (004/005).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The inventory counts only in-scope names with every exemption applied | Vendored/.py/package-dir/generated/tool-mandated names are excluded |
| REQ-002 | The rename map is bijective | Every source exists; every target is unique and currently absent |
| REQ-003 | Every candidate has exactly one classification with no "unknown" bucket | The classification report has 0 un-classified candidates |
| REQ-004 | Batches are dependency-closed (reference-graph SCCs) | No batch references a rename in another un-landed batch |
| REQ-005 | The map is hashed together with BASE for reproducibility | A stored digest binds the map to the exact BASE SHA |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A trustworthy, frozen, bijective, classified rename map exists.
- **SC-002**: Execution batches are dependency-closed and reproducible.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Inherits the program-level risks in the 017 parent spec (import breakage, validator downgrade, non-reproducible builds,
over-broad sweep, exemption leakage, concurrent sessions). Phase-specific risks are enumerated in this phase's plan.md.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking; resolved during this phase's execution against the pinned baseline.
<!-- /ANCHOR:questions -->
