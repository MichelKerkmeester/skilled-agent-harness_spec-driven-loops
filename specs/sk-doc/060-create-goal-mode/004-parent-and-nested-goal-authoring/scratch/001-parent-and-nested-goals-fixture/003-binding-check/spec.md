---
title: "Feature Specification: Phase 3: binding-check"
description: "Checks that the parent goal binds exactly the three phase-map folders and passes recursive strict validation."
trigger_phrases:
  - "parent goal binding"
  - "binding completeness"
  - "recursive fixture validation"
importance_tier: "important"
contextType: "specification"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: binding-check

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
| **Phase** | 3 of 3 |
| **Predecessor** | 002-goal-authoring |
| **Successor** | None |
| **Handoff Criteria** | Map folders, direct child folders and three backticked parent targets match; recursive strict validation passes. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the parent and nested goal fixture.

**Scope Boundary**: Compare the parent's complete Phase Documentation Map, direct numbered child directories and parent binding targets. Run recursive strict validation after all goal files are final.

**Dependencies**:
- Phase 1 records the source set and exact folder comparison.
- Phase 2 authors all three child goals.

**Deliverables**:
- A parent goal with one binding row per direct phase folder.
- A recorded recursive strict-validation result.

**Changelog**:
- This fixture has no packet-local changelog. The proof remains in its spec and acceptance criteria.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A validator can accept each listed target while missing an omitted phase. The parent must therefore compare the map, the filesystem and its binding table as exact name sets.

### Purpose
Prove that the phase parent binds all three mapped child goals and that recursive strict validation accepts the integrated fixture.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Compare the parent map, direct child folders and binding target names.
- Confirm all three targets point to existing child `goal.md` files.
- Run recursive strict validation and record its result.

### Out of Scope
- Changing a child goal or parent decision to hide a mismatch.
- Modifying templates, validators or files outside this fixture.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Define the exact binding and validation checks. |
| `plan.md` | Modify | Describe the three-set comparison and final gate. |
| `tasks.md` | Modify | Record completed binding and verification tasks. |
| `acceptance-criteria.md` | Modify | Close binding outcomes with line citations. |
| `goal.md` | Modify | State the binding-check objective and local criteria. |
| `implementation-summary.md` | Modify | Record the binding check and strict validation evidence. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Write exactly one parent binding row for each direct phase-child directory. |
| REQ-002 | Compare the map, direct-child folder and binding-target sets by exact folder name. |
| REQ-003 | Confirm each backticked target exists and recursive strict validation passes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Close every acceptance criterion with a backticked path and one line number. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The parent goal contains exactly three backticked child-goal targets.
- **SC-002**: The map, direct child folders and binding targets name the same three folders.
- **SC-003**: Recursive strict validation prints `RESULT: PASSED` with no `SPECDOC_SUFFICIENCY_006` findings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Three child goals | A missing target prevents complete binding | Confirm each target exists before validation. |
| Risk | Validator checks listed targets but not omissions | A parent can pass with an incomplete table | Compare all three exact name sets independently. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime performance target applies to this documentation proof.

### Security
- **NFR-S01**: The phase changes no code, credentials or runtime goal state.

### Reliability
- **NFR-R01**: The validation result must come from the final packet state.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A map row without a folder blocks binding.
- A direct child without a map row blocks binding.
- A target with a different folder name is a mismatch even when counts agree.

### Error Scenarios
- Missing child goal: record the missing target and do not claim a complete binding.
- Strict validation error: fix the fixture document that caused it and rerun the full gate.

### State Transitions
- Partial binding: keep the packet open until all three sets match.
- Final verification: run the recursive gate only after the parent goal and metadata are refreshed.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | Three source names, folders and goal targets. |
| Risk | 4/25 | An omitted row can escape target-only validation. |
| Research | 2/20 | One direct-child listing and one recursive validation run. |
| **Total** | **10/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The map defines the phase set, and the final check compares it with disk and bindings.
<!-- /ANCHOR:questions -->

---
