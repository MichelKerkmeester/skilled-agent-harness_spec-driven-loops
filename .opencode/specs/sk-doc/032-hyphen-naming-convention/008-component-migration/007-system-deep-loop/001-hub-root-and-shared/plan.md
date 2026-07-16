---
title: "Implementation Plan: system-deep-loop hub root and shared names (032 phase 007/001)"
description: "Plan for classifying the hub/shared boundary, preserving exact routing and metadata names, and applying only any frozen-map candidate with its direct reference closure. The current inventory is expected to be a verified no-op."
trigger_phrases:
  - "system-deep-loop hub shared implementation plan"
  - "deep loop shared naming plan"
  - "hub root path closure"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/007-system-deep-loop/001-hub-root-and-shared"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/007-system-deep-loop/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored hub shared phase plan"
    next_safe_action: "Execute the hub shared boundary check"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: System-deep-loop hub root and shared names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/system-deep-loop/` root and `shared/` |
| **Change class** | Candidate classification, optional rename, and reference verification |
| **Execution** | Isolated worktree using the pinned BASE and frozen semantic map |
| **Verification** | Root/shared manifest, path resolver, routing checks, and helper tests |

### Overview

Inventory the hub root and shared helpers before touching anything. The live tree is already kebab-clean in this boundary, so the planned implementation is a no-op unless the pinned BASE exposes a candidate absent from the current tree; any such candidate moves only with its path consumers.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The pinned BASE manifest and frozen rename map are available.
- [ ] The root/shared boundary is separated from runtime, workflow packets, root playbook, and root benchmark ownership.
- [ ] Exact hub names and the one-graph-metadata invariant are recorded.

### Definition of Done

- [ ] Every root/shared path has one disposition and the current no-op result is evidenced.
- [ ] Any baseline candidate, if present, has a kebab-case target and repaired path consumers.
- [ ] Hub routing and shared helper behavior match BASE evidence.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Boundary inventory**: enumerate root files and `shared/behavior-benchmark/`, `shared/progress/`, `shared/rollout/`, and `shared/synthesis/` without scanning sibling component ownership into this child.
- **Exact-name guard**: preserve `SKILL.md`, `README.md`, `hub-router.json`, `mode-registry.json`, `description.json`, and `graph-metadata.json` names and contracts.
- **Conditional rename closure**: if the BASE map contains an in-scope candidate, update its direct Markdown, JSON path-value, helper, and test consumers in the same batch.
- **Behavior boundary**: keep router keys, JavaScript identifiers, JSON keys, and shared helper semantics unchanged.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Load the BASE path/mode manifest, frozen map, and component ownership boundary.
- [ ] Record the root/shared inventory, active path references, symlink status, and exact tool names.

### Phase 2: Core Implementation

- [ ] Assign rename/exempt/frozen/generated/tool-mandated status to every root/shared path.
- [ ] Apply the semantic map only if a pinned-baseline candidate exists; keep the current no-candidate outcome explicit otherwise.
- [ ] Repair direct hub/shared path values and links for any moved candidate.

### Phase 3: Verification

- [ ] Compare the final root/shared manifest with the map and BASE inventory.
- [ ] Resolve hub/router paths, shared Markdown links, and helper test fixtures.
- [ ] Run non-zero routing/helper checks and confirm no sibling surface was changed.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| Candidate coverage | Map scan reports every root/shared path once and no unknown row. |
| Exact names | `SKILL.md`, router/registry, metadata, and already-compliant shared directories match the expected names. |
| Reference integrity | Resolve Markdown and JSON path values; search for any old candidate basename if a rename occurred. |
| Behavior parity | Run hub fallback/routing and shared benchmark/progress/rollout/synthesis helper checks against BASE outcomes. |
| Scope safety | Inspect the diff for runtime, workflow, root playbook, and root benchmark leakage. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Impact if Blocked |
|------------|------|-------------------|
| Frozen semantic rename map | Internal | Candidate ownership and target names cannot be proven. |
| BASE root/shared manifest | Internal | A no-op result or mode/link parity cannot be evidenced. |
| Hub routing contract | Internal | The one-identity and registry behavior cannot be compared. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A collision, stale hub path, routing drift, unexpected candidate, or scope leakage appears.
- **Procedure**: Stop the conditional batch; if a rename occurred, revert only the path-scoped commit and restore the pre-change manifest before retrying. A verified no-op needs no rollback.
<!-- /ANCHOR:rollback -->
