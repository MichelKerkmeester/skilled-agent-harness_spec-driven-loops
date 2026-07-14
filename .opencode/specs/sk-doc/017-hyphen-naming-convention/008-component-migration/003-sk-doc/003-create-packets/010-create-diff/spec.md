---
title: "Feature Specification: create-diff naming audit"
description: "The create-diff packet is assigned a component-local naming phase, but its current filesystem inventory contains no non-exempt snake_case name to rename. This Level-2 phase records the zero-row census, verifies path references, and prevents content identifiers from being mistaken for filesystem candidates."
trigger_phrases:
  - "create-diff naming audit"
  - "create-diff kebab-case verification"
  - "create-diff no-op rename phase"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/010-create-diff"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/010-create-diff"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-diff audit docs"
    next_safe_action: "Confirm the zero-row create-diff census"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-diff/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: create-diff naming audit

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | `sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/010-create-diff` |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc/create-diff |
| **Origin** | Phase 010 of the nested create-packets decomposition |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The create-diff packet must be represented in the component rollup even when its current filesystem names are already canonical. Treating the absence of a rename as an omission would encourage an unsafe speculative change, while ignoring the packet would leave the subtree gate without evidence.

The outcome is an evidence-pinned zero-row rename audit with no implementation rename and a clear handoff to the rollup gate.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Census every file and directory under `.opencode/skills/sk-doc/create-diff/` at the execution baseline.
- Confirm that no non-exempt snake_case filesystem name exists in the component.
- Check packet-local path references and record already-kebab or tool-mandated names as unchanged.
- Produce evidence for the nested parent and phase 007 rollup.

### Out of Scope

- Creating a rename solely to make the phase non-empty.
- Rewriting underscores in diff content, document identifiers, or frontmatter values that are not filesystem paths.
- Other create-* packets and any code or script changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `create-diff/` | Verify only | Census the component and record the zero-row rename result |
| `010-create-diff/` | Documentation only | Store the audit contract and evidence expectations |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The component census is complete | Every component path is classified as canonical, exempt, mandated, or non-applicable |
| REQ-002 | Zero-row status is proven, not assumed | The candidate report records the discovery command, count, and baseline path listing |
| REQ-003 | Path references remain valid | No stale or unresolved create-diff path is found |
| REQ-004 | Content underscores are not treated as filesystem debt | Diff/content audit shows no non-path identifier rewrite |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The create-diff component has a complete, zero-row non-exempt rename manifest.
- **SC-002**: The rollup can count this phase as verified without any migration mutation.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Pinned baseline inventory | Later files could change the result | Pin the census to BASE and report the path list |
| Risk | Empty rename map is mistaken for incomplete work | Rollup gate rejects valid phase | Require explicit zero-row evidence and path-reference checks |
| Risk | Content underscores are misclassified | Unrelated behavior changes | Apply the filesystem-only rule |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. If the execution baseline differs from this census, stop and classify the new path before changing it.
<!-- /ANCHOR:questions -->
