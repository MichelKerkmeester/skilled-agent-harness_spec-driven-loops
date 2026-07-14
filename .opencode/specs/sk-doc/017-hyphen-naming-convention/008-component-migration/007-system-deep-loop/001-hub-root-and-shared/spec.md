---
title: "Feature Specification: system-deep-loop hub root and shared names (017 phase 007/001)"
description: "The system-deep-loop hub root and shared boundary contain exact routing and metadata contracts that a broad rename could damage. The current inventory is already kebab-clean in this boundary, so this child verifies the no-op candidate set, renames any baseline drift only if present, and proves hub/shared references remain intact."
trigger_phrases:
  - "system-deep-loop hub shared naming"
  - "deep loop shared filesystem names"
  - "hub root kebab-case verification"
  - "system-deep-loop shared path closure"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/007-system-deep-loop/001-hub-root-and-shared"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/007-system-deep-loop/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored hub shared phase spec"
    next_safe_action: "Execute the hub shared boundary check"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current hub root and shared tree has no underscore-bearing filesystem candidate."
      - "SKILL.md, mode-registry.json, description.json, graph-metadata.json, and other exact contract names stay unchanged."
      - "Any baseline-only candidate must be handled by the frozen semantic map, never by a blanket underscore substitution."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: System-deep-loop hub root and shared names

> Phase adjacency under the system-deep-loop component parent: predecessor `006-mcp-tooling`; successor `002-runtime`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/008-component-migration/007-system-deep-loop/001-hub-root-and-shared |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | system-deep-loop |
| **Origin** | Phase 001 of the system-deep-loop component migration under the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The hub root owns the public router and the single discoverable graph identity, while `shared/` owns reusable behavior-benchmark, progress, rollout, and synthesis helpers. The live boundary currently contains `SKILL.md`, `README.md`, `hub-router.json`, `mode-registry.json`, `description.json`, `graph-metadata.json`, and already-kebab directories such as `behavior-benchmark/`, `progress/`, `rollout/`, and `synthesis/`; a broad filesystem sweep could still misclassify exact contract names or miss a baseline-only candidate.

This phase classifies every root/shared path, renames only an in-scope candidate found in the frozen baseline, repairs its direct path references, and proves the hub routing and shared helper closure is unchanged.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The root files under `.opencode/skills/system-deep-loop/`: `SKILL.md`, `README.md`, `hub-router.json`, `mode-registry.json`, `description.json`, and `graph-metadata.json` as inventory and reference consumers.
- The shared directories `shared/behavior-benchmark/`, `shared/progress/`, `shared/rollout/`, and `shared/synthesis/`, including their CJS helpers, tests, fixtures, README, and `framework.md` paths.
- The frozen-map disposition for every root/shared filesystem name and any path-valued reference in hub documentation, router data, or shared helper tests.

### Out of Scope

- `runtime/`, workflow packets, the root `manual_testing_playbook/`, and `benchmark/`; those surfaces belong to later children.
- Renaming the hub's `SKILL.md`, `mode-registry.json`, `hub-router.json`, `description.json`, or `graph-metadata.json` names.
- Code identifiers, JSON keys, frontmatter fields, Python `.py` files/package directories, generated or lockfile output, and frozen changelog/history.
- Executing a rename during this authoring pass.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/` | Inventory/reference update | Confirm root names and router path values are exact or exempt. |
| `.opencode/skills/system-deep-loop/shared/` | Rename/reference update | Rename any baseline candidate and update its direct consumers; the live inventory currently has no such candidate. |
| Hub and shared tests/docs | Reference update | Resolve path-valued links without changing route keys or helper identifiers. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every root/shared filesystem name has exactly one disposition | The candidate manifest covers the root files and every shared path with rename, exempt, frozen, generated, or tool-mandated status and no unknown row. |
| REQ-002 | The exact hub contracts remain exact | `SKILL.md`, `mode-registry.json`, `hub-router.json`, `description.json`, and `graph-metadata.json` retain their names and required contents. |
| REQ-003 | Any baseline candidate and its references move together | If the pinned baseline exposes an in-scope underscore name, its target is kebab-case and all active hub/shared path references resolve to it. |
| REQ-004 | The current no-candidate result is evidenced, not assumed | The report records the root/shared inventory and explains why no physical rename was required in the current tree. |
| REQ-005 | Hub and shared behavior remains equivalent | Router resolution, shared benchmark helper loading, and progress/rollout/synthesis helper tests retain the BASE outcomes. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The root/shared candidate set is fully classified and contains no unapproved snake_case filesystem name.
- **SC-002**: The hub's single graph identity and registry-driven routing contract remain resolvable.
- **SC-003**: Shared helper paths and tests resolve with no behavior or scope drift.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The main risk is treating a zero-candidate inventory as permission to skip the boundary check, or treating underscores in JSON keys and JavaScript identifiers as filesystem names. The phase depends on the frozen semantic map, the BASE path/mode manifest, and the hub routing contract; the checklist requires explicit no-op evidence and exact-name preservation.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The executor must reconcile any difference between the current tree and the pinned BASE manifest before deciding that this boundary is a no-op.
<!-- /ANCHOR:questions -->
