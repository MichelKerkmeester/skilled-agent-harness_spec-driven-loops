---
title: "Feature Specification: Phase 1: source-audit"
description: "Audits the parent spec, child sources and phase map, then records whether the mapped phases match the direct folders."
trigger_phrases:
  - "source audit"
  - "phase map audit"
  - "fixture source inventory"
importance_tier: "important"
contextType: "specification"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: source-audit

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-25 |
| **Branch** | `fixture` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 3 |
| **Predecessor** | None |
| **Successor** | 002-goal-authoring |
| **Handoff Criteria** | The source inventory records the three mapped folders and confirms an exact disk match. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the parent and nested goal fixture.

**Scope Boundary**: Inspect the parent specification, phase map, child specifications and acceptance criteria. Record the source set and compare the mapped folder names with direct child directories.

**Dependencies**:
- The parent specification and all three phase folders exist.
- Each phase folder contains its own `spec.md` and `acceptance-criteria.md`.

**Deliverables**:
- A source inventory in this phase specification.
- Met acceptance criteria with single-line evidence citations.

**Changelog**:
- This fixture has no packet-local changelog. The proof remains in its spec and acceptance criteria.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A parent can list the right number of phases while naming folders that do not exist. A child source can also be missing even when its folder appears in the map.

### Purpose
Record the parent and child source set, then prove that the phase map and direct child folders contain the same three names.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the parent phase map and each child's specification and acceptance criteria.
- Record the exact mapped names and compare them with direct numbered child folders.
- Record source evidence and any mismatch without guessing a folder name.

### Out of Scope
- Authoring the child or parent goals. Phase 2 authors child goals and phase 3 checks parent binding.
- Changing system-spec-kit templates, validators or files outside this fixture.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Record the source inventory and exact map-to-disk comparison. |
| `plan.md` | Modify | Describe the source-audit method and checks. |
| `tasks.md` | Modify | Record completed audit tasks and verification evidence. |
| `acceptance-criteria.md` | Modify | Close the source-audit outcomes with line citations. |
| `goal.md` | Modify | State the source-audit objective and phase-local criteria. |
| `implementation-summary.md` | Modify | Summarize the source audit and its evidence. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Record the parent phase map and identify the specification and acceptance-criteria source in each direct child folder. |
| REQ-002 | Compare the exact folder-name set in the parent map with the direct numbered child-directory set. Stop on any mismatch. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Cite each closed acceptance criterion with a backticked path and one line number. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The audit records all three mapped child-folder names.
- **SC-002**: The mapped folder set and direct-child folder set match exactly.
- **SC-003**: Every acceptance-criteria row is Met and has a single-line citation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Parent map and three child source pairs | A missing source prevents a source-derived goal | Stop and name the missing source rather than infer it. |
| Risk | Equal counts hide different folder names | A binding could point to the wrong phase | Compare the exact sorted name sets. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime performance target applies to this documentation audit.

### Security
- **NFR-S01**: The phase adds no executable code, credentials or runtime goal state.

### Reliability
- **NFR-R01**: Record source names and line-level citations so a reviewer can repeat the comparison.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty phase map: report the empty set and do not invent a child.
- Extra or missing directory: record the exact mismatch and stop goal authoring.
- Missing child source: identify the affected folder and source file.

### Error Scenarios
- Unreadable source file: leave its evidence open and report the path.
- Duplicate or ambiguous folder name: stop before binding.

### State Transitions
- Partial audit: keep the phase open until every source pair and folder name has been checked.
- Resumed audit: repeat the exact-set comparison against the current filesystem.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | Four source classes and three child folders. |
| Risk | 3/25 | A mismatch would make a binding incomplete or wrong. |
| Research | 3/20 | Read the parent map and each child source pair. |
| **Total** | **10/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The parent map names three phases, and all three source pairs are present.
<!-- /ANCHOR:questions -->

---
