---
title: "Feature Specification: Phase 24: doctor-docs-alignment"
description: "The root README, the skill READMEs and the v4.0.0.3 changelog described the doctor commands as they were before the last four phases. They now state the current statuses, flag handling and updater behavior, and the changelog covers every change since its last update."
trigger_phrases:
  - "doctor docs alignment"
  - "v4.0.0.3 changelog doctor"
  - "root readme doctor commands"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 24: doctor-docs-alignment

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-04 |
| **Branch** | `worktrees/079-doctor-command-audit` |
| **Parent Spec** | ../spec.md |
| **Phase** | 24 of 24 |
| **Predecessor** | 023-release-update-symlink-parent |
| **Successor** | None |
| **Handoff Criteria** | Every count and behavior the docs state about the doctor commands matches the command files, and the changelog passes its validator and voice scan |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 24** of the doctor audit follow-ups. Phases 020 to 023 changed how `/doctor:speckit`, `/doctor:mcp` and `/doctor:update` behave and added test scenarios. The operator asked for the top-level docs and the unreleased v4.0.0.3 changelog to match.

**Scope Boundary**: The root README DOCTOR section, `mcp-tooling/README.md` and `.skilled/changelog/skilled/v4.0.0.3.md`.

**Dependencies**:
- The pushed results of phases 020 to 023
- The `sk-create-changelog` format contract

**Deliverables**:
- Root README lines for the speckit statuses, the mcp flag refusal and the updater's symlink conflict
- A corrected mcp-tooling README sentence
- The v4.0.0.3 changelog covering the doctor fixes, the test scenarios, the classifier quality fixes and the lineage findings contract

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The root README did not mention that phrase-quality findings are advisories, that `/doctor:mcp` refuses unknown flags, or that the updater reports symlinked folders. The mcp-tooling README said the doctor never changes configuration, which is false for `install`. The changelog stopped before those changes and before work from other packets landed.

### Purpose
Docs a reader can trust about what each doctor command does today.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Check every count the root README states: eight commands, five routed, 19 workflows, seven runtime config files
- Add the three behavior changes to the root README
- Correct the mcp-tooling sentence
- Extend the unreleased v4.0.0.3 changelog

### Out of Scope
- Housekeeping commits with no reader-visible effect, such as dependency bumps and leaf-manifest repairs
- The skill READMEs whose doctor lines were already accurate

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `README.md` | Modify | Three doctor behavior lines |
| `.skilled/skills/mcp-tooling/README.md` | Modify | Correct the configuration claim |
| `.skilled/changelog/skilled/v4.0.0.3.md` | Modify | Cover the changes since its last update |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Doc counts match the code | Eight command files, five routed commands in `_routes.yaml`, 19 workflow YAMLs plus one manifest, seven project config files |
| REQ-002 | The changelog stays valid | `validate_document.py` reports 0 issues and the voice scan 0 hard blockers |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The glance list stays within its ceiling | Twelve glance bullets, extended rather than added |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No doc claims a behavior the command files contradict.
- **SC-002**: The changelog names every reader-visible change since its last update.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The changelog drifts again before release | Low | It stays unreleased until tagged, and later work can extend it the same way |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

