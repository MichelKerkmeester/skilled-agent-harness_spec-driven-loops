---
title: "Feature Specification: cli-external-orchestration hub root and shared boundary (017 phase 005.001)"
description: "The live hub root has exact routing files, delegated component trees, a root manual-testing-playbook tree, and an empty shared boundary. This phase records ownership and renames only hub/shared-owned authored names without crossing delegated playbook or benchmark scope."
trigger_phrases:
  - "cli-external hub root kebab-case"
  - "cli external shared boundary"
  - "cli-external phase 001 naming"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/001-hub-root-and-shared"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored hub boundary docs"
    next_safe_action: "Capture the hub disposition map"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/README.md"
      - ".opencode/skills/cli-external-orchestration/hub-router.json"
      - ".opencode/skills/cli-external-orchestration/mode-registry.json"
    completion_pct: 0
    open_questions:
      - "Execution must confirm that no shared/ subtree was introduced after this inventory."
    answered_questions:
      - "The live root has no shared/ directory."
      - "manual_testing_playbook/ and benchmark/ are delegated to phases 005 and 006."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: cli-external-orchestration hub root and shared boundary

> Phase adjacency under the cli-external-orchestration component parent: successor `002-cli-opencode`; delegated playbook and benchmark roots are owned by `005-manual-testing-playbook` and `006-benchmark`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/001-hub-root-and-shared |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | cli-external-orchestration |
| **Origin** | Phase 001 of the cli-external-orchestration subtree under the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The live hub root contains exact router/registry files plus delegated `manual_testing_playbook/`, `benchmark/`, and three CLI component trees. There is no `shared/` directory, and the root inventory has no root-owned snake_case name beyond the delegated playbook root. A broad root sweep would therefore risk changing exact tool contracts or taking ownership from later phases.

This phase produces a complete root/shared ownership map, renames only any hub/shared-owned authored candidate, and proves that routing semantics and delegated boundaries remain intact.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Census every direct child of `.opencode/skills/cli-external-orchestration/` and record the absent `shared/` result.
- Inspect a `shared/` subtree if one appears before execution; map only authored in-scope names to kebab-case.
- Update root/shared-owned path references in `SKILL.md`, `README.md`, and routing metadata only when a mapped path requires it.
- Preserve the root `SKILL.md`, `mode-registry.json`, `hub-router.json`, `description.json`, and `graph-metadata.json` filename contracts.

### Out of Scope
- Root or component `manual_testing_playbook/` contents; phase 005 owns all playbook trees.
- `benchmark/` artifacts; phase 006 owns the benchmark boundary.
- `cli-opencode/`, `cli-claude-code/`, and `cli-codex/` component contents; phases 002–004 own them.
- JSON keys, workflow values, code identifiers, frontmatter fields, changelog history, generated output, Python names, and tool-mandated filenames.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external-orchestration/` | Inventory/bounded rename | Classify every direct root child; the current `shared/` result is absent |
| `SKILL.md`, `README.md` | Reference update | Repoint only root/shared-owned filesystem paths |
| `hub-router.json`, `mode-registry.json` | Protected inspection | Preserve keys, mode values, resources, and exact filenames |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 [P0] | Root/shared ownership is explicit | Every observed direct child has exactly one owned, delegated, protected, generated, frozen, or exempt disposition; absent `shared/` is recorded |
| REQ-002 [P0] | Owned names are kebab-case | Every root/shared-owned authored source has a unique target with no stale source path |
| REQ-003 [P0] | Hub contracts remain exact | `SKILL.md`, `hub-router.json`, `mode-registry.json`, metadata filenames, routing keys, and mode/resource semantics remain unchanged |
| REQ-004 [P1] | Delegated ownership stays independent | No root or component playbook/benchmark path is renamed or rewritten by this phase |
| REQ-005 [P1] | Root references resolve | Every root/shared-owned path value resolves after the map is applied |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The root/shared census and disposition map cover every observed boundary path.
- **SC-002**: The current absent `shared/` result is explicit, and any execution-time candidate is mapped before mutation.
- **SC-003**: Router and registry parsing retains all existing mode/resource behavior.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The main risk is a root-wide substitution that captures the delegated playbook or benchmark roots, or changes a tool-mandated filename. The phase depends on the 017 exemption record and hands the protected hub boundary to phases 002–006.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Execution must stop before mutation if a new `shared/` subtree or an ownership conflict appears.
<!-- /ANCHOR:questions -->

