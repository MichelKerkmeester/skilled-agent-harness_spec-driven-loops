---
title: "Feature Specification: create-quality-control resource names"
description: "The create-quality-control packet contains snake_case transformation, validation, and workflow reference filenames. This phase converts those non-exempt resources to kebab-case and updates packet-local references while preserving the shared quality-control contract and tool-mandated names."
trigger_phrases:
  - "create-quality-control resource naming"
  - "quality control reference kebab-case"
  - "quality control transformation rename"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/011-create-quality-control"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/011-create-quality-control"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored quality control phase docs"
    next_safe_action: "Build the quality control rename map"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-quality-control/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: create-quality-control resource names

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | `sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/011-create-quality-control` |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc/create-quality-control |
| **Origin** | Phase 011 of the nested create-packets decomposition |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The create-quality-control packet has snake_case reference names for transformation patterns, validation/enforcement, and workflow examples. These are packet resources consumed by the quality workflow, so a filename-only move would leave the documentation quality pipeline with stale path references.

The outcome is a kebab-case reference surface with the quality-control workflow and shared backbone contract unchanged.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rename `references/transformation_patterns.md`, `references/validation_and_enforcement.md`, and `references/workflow_examples.md`.
- Update links and path values in `SKILL.md`, README, reference indexes, and workflow examples.
- Preserve `references/workflows.md`, shared backbone paths, quality scores, and validation terminology.

### Out of Scope

- `SKILL.md`, `README.md`, package metadata, and tool-mandated names.
- Quality-control field names, score keys, workflow identifiers, and content prose that are not paths.
- The shared `shared/` backbone and other create-* packets.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `create-quality-control/references/{transformation_patterns,validation_and_enforcement,workflow_examples}.md` | Rename/reference update | Convert three reference filenames |
| `create-quality-control/SKILL.md`, `README.md`, and reference indexes | Modify | Repoint packet-owned paths |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All three quality-control references become kebab-case | Manifest and filesystem census match exactly |
| REQ-002 | Quality-control links and indexes resolve | Every old packet-local path points to its target |
| REQ-003 | The workflow contract remains stable | `workflows.md`, score fields, validation terms, and identifiers are unchanged |
| REQ-004 | Shared backbone ownership remains clear | Shared resources are referenced but not renamed by this packet phase |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three create-quality-control reference names are kebab-case.
- **SC-002**: Quality-control authoring and validation guidance resolves with unchanged workflow semantics.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Quality-control reference indexes | Workflow guidance breaks | Search old basenames and resolve every target |
| Risk | Shared backbone paths are edited here | Cross-phase collision | Record shared paths as external/unchanged |
| Risk | Score or validation terms are mistaken for path tokens | Quality behavior drifts | Review content and path diffs separately |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Any shared path candidate belongs to phase 001 and must be handed off with evidence.
<!-- /ANCHOR:questions -->
