---
title: "Feature Specification: create-flowchart resource names"
description: "The create-flowchart packet contains snake_case asset, reference, and validator filenames used by flowchart authoring and validation. This phase renames those non-exempt resources to kebab-case and updates packet-local links while preserving validator behavior and flowchart notation."
trigger_phrases:
  - "create-flowchart resource naming"
  - "flowchart asset kebab-case phase"
  - "flowchart reference rename"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/008-create-flowchart"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/008-create-flowchart"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-flowchart phase docs"
    next_safe_action: "Build the create-flowchart rename map"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-flowchart/assets/", ".opencode/skills/sk-doc/create-flowchart/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: create-flowchart resource names

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | `sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/008-create-flowchart` |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc/create-flowchart |
| **Origin** | Phase 008 of the nested create-packets decomposition |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The create-flowchart packet's six pattern assets, three guidance references, and validator filename use underscores. The validator and authoring docs point at these resources, so a filesystem-only rename would leave the workflow with stale links.

The outcome is a kebab-case flowchart resource tree with unchanged notation and validator behavior.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rename `approval_workflow_loops.md`, `decision_tree_flow.md`, `parallel_execution.md`, `simple_workflow.md`, `system_architecture_swimlane.md`, and `user_onboarding.md` in `assets/`.
- Rename `notation_and_validator.md`, `pattern_selection.md`, and `worked_example.md` in `references/`.
- Rename `scripts/validate_flowchart.sh` to `validate-flowchart.sh` while preserving its executable behavior.
- Update packet-local links and resource values in `SKILL.md`, README, assets, references, and validator guidance.

### Out of Scope

- `SKILL.md`, `README.md`, changelog files, package metadata, and other mandated names.
- Flowchart box labels, notation tokens, and content identifiers.
- Other create-* packets.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `create-flowchart/assets/{approval_workflow_loops,decision_tree_flow,parallel_execution,simple_workflow,system_architecture_swimlane,user_onboarding}.md` | Rename/reference update | Convert six pattern asset filenames |
| `create-flowchart/references/{notation_and_validator,pattern_selection,worked_example}.md` | Rename/reference update | Convert three guidance filenames |
| `create-flowchart/scripts/validate_flowchart.sh` | Rename/reference update | Convert the non-Python validator filename without changing behavior |
| `create-flowchart/SKILL.md`, `README.md`, and docs | Modify | Repoint packet-owned resource paths |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All ten packet-owned non-exempt resource names become kebab-case | Manifest and filesystem census match exactly |
| REQ-002 | Flowchart pattern and guidance links resolve | Every old path consumer points at the correct target |
| REQ-003 | Validator behavior and notation remain stable | Only the validator path changes; no script logic, box label, branch token, or content identifier changes |
| REQ-004 | Tool-mandated names remain exact | `SKILL.md`, README, and package metadata are unchanged as names |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All ten create-flowchart non-exempt resource names are kebab-case.
- **SC-002**: Pattern selection, notation guidance, and validator references resolve without semantic drift.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Pattern/resource links | Examples disappear from authoring flow | Resolve every asset/reference link |
| Risk | Flowchart labels look like filenames | Notation changes | Edit only filesystem paths and links |
| Risk | Validator docs refer to script paths | Verification instructions stale | Search script and resource basename consumers |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The execution report must list any dynamically selected pattern resource.
<!-- /ANCHOR:questions -->
