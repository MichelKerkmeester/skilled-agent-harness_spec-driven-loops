---
title: "Implementation Plan: Feature-catalog (032 phase 008)"
description: "Execution plan for Feature-catalog in the 032 sk-design naming subtree."
trigger_phrases:
  - "feature-catalog implementation plan"
  - "sk-design feature-catalog plan"
  - "032 feature-catalog tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/002-sk-design/008-feature-catalog"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/002-sk-design/008-feature-catalog"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored feature-catalog plan"
    next_safe_action: "Execute phase on pinned worktree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/feature_catalog/"
      - ".opencode/skills/sk-design/design-interface/feature_catalog/"
      - ".opencode/skills/sk-design/design-md-generator/feature_catalog/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Feature-catalog (032 phase 008)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|-------|-------|
| **Surface** | all seven `.opencode/skills/sk-design/**/feature_catalog/` trees |
| **Change class** | Filesystem rename plus path-reference update |
| **Execution** | Pinned isolated worktree; migration execution is a later pass |

Rename every non-exempt feature-catalog root, category directory, and feature file to kebab-case and update catalog-owned references across the sk-design surface.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The live phase boundary and exemption set are recorded.
- [ ] Every phase-owned underscore path has a disposition or the phase proves it is absent.
- [ ] The source→target map, consumer inventory, and rollback route are available.

### Definition of Done
- [ ] The phase checklist is satisfied with pinned evidence.
- [ ] No stale or broken path reference remains in the phase surface.
- [ ] No semantic identifier, data key, frontmatter field, Python path, or tool-mandated name was altered.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Deterministic rename-map execution with in-lockstep reference updates

### Key Components
- **Inventory**: the live all seven `.opencode/skills/sk-design/**/feature_catalog/` trees tree and its exact candidate paths.
- **Policy boundary**: kebab-case for filesystem names, except Python scripts/package directories and tool-mandated names.
- **Reference ledger**: every path-valued consumer is updated or explicitly marked unchanged.
- **SOL checklist**: blocking acceptance contract with evidence-pinned commands, counts, and clean-worktree proof.

### Data Flow
Live path inventory → classified rename map → filesystem/reference execution → parity and resolution checks → phase evidence.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the pinned BASE, phase boundary, and clean isolated worktree.
- [ ] Read the current phase-owned path inventory and canonical exemption policy.
- [ ] Freeze the evidence inputs before any execution.

### Phase 2: Core execution
- [ ] Freeze the phase-local source→target map from the live surface and classify every candidate as rename, exempt, frozen, generated, or tool-mandated.
- [ ] Apply filesystem renames in dependency-closed batches, update path-valued references in the same batch, and preserve all semantic identifiers and exempt names.
- [ ] Run the phase checklist against the pinned BASE and record path-resolution, content-parity, and clean-worktree evidence.

### Phase 3: Verification
- [ ] Run every phase-specific checklist item with concrete path, count, or content evidence.
- [ ] Compare before/after inventories and confirm no unexpected tracked mutation.
- [ ] Record the handoff evidence for the next sibling or rollup gate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-------|-------|-------|
| Inventory | Phase-owned filesystem paths | Complete classified source→target map |
| Reference resolution | Markdown, data path values, shell or registry consumers | Zero stale/broken paths |
| Content parity | Identifiers, keys, fixture/scenario semantics | No semantic changes |
| Boundary check | Exempt/tool-mandated/Python surfaces | No forbidden rename |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|-------|-------|-------|-------|
| 001 convention policy and scope | Internal | Required | Candidate classification is ambiguous |
| Pinned BASE and rename map | Internal | Required | Parity and rollback evidence are unavailable |
| Phase-specific sibling handoff | Internal | Required | Cross-surface references may be missed |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Collision, broken reference, semantic diff, exemption breach, or unexpected tracked mutation.
- **Procedure**: Stop before further renames, preserve the map/report, and revert the phase-scoped commit(s) or discard the isolated worktree. Re-run only from the pinned BASE after the map is corrected.
<!-- /ANCHOR:rollback -->
