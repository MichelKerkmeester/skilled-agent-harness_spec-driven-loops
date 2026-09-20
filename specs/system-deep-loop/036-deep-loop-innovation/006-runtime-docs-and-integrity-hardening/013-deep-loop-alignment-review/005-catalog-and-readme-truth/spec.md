---
title: "Feature Specification: Phase 4: catalog-and-readme-truth"
description: "Every catalog entry, README claim and playbook statement under the three hubs matches the tree it describes, across ten verified finding classes."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: catalog-and-readme-truth

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 9 |
| **Predecessor** | 004-leaf-manifest-and-doctrine-reachability |
| **Successor** | 006-confirm-variant-parity |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Remediate the alignment review findings specification.

**Scope Boundary**: [To be defined during planning]

**Dependencies**:
- [To be defined during planning]

**Deliverables**:
- [To be defined during planning]

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The review found ten classes of documentation that the tree contradicts: nine catalog references citing absent paths, a superseded runtime generation cited in three catalogs, a contract count wrong in two READMEs, a playbook asserting no test suite exists against 121 unit test files, removed benchmark artifacts still advertised as live, five test files named under a prefix they no longer carry, a catalog claiming fifty-five entries against fifty-four, a repository-wide checker presented as a local acceptance test, a retired command path with a dead anchor, and two READMEs pointing one directory level too high.

### Purpose
A reader who follows any citation in these documents arrives at the file it names.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All ten classes, every instance of each rather than the cited one
- Re-pointing a path at its successor where the tree supports one, removing it where it does not
- Counts corrected, and named to their script where one derives them
- Claims the tree contradicts rewritten to what the tree says

### Out of Scope
- The checker whose scope the README misstated - its text is corrected, not its behaviour
- Reference, router and SKILL documents - those are other phases' surfaces
- Deliberate hypothetical targets in scenario playbooks, which their own text marks as never created

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `62 catalog, README and playbook files under the three hubs` | Modify | Ten classes closed across every instance |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No catalog, README or playbook in the three hubs cites a path absent from the tree |
| REQ-002 | No stated count disagrees with what it counts, and no claim of absence survives against files that exist |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Residual matches outside the editable classes are reported rather than silently left |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each of the ten classes sweeps to zero instances in its editable surface
- **SC-002**: The skill-root metadata gate passes and the phase validates
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A path is ambiguous between removal and re-pointing | Handled | Each choice is recorded per instance in the phase log |
| Risk | A sweep hides an instance outside the class | Handled | Residuals are enumerated with their file and reason |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable

### Security
- **NFR-S01**: Not applicable

### Reliability
- **NFR-R01**: Documentation only; no runtime behaviour changes
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A path with no successor: removed rather than re-pointed
- A count a script derives: the text names the script

### Error Scenarios
- A claim that cannot be verified either way: reported, not rewritten

### State Transitions
- Not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Sixty-two files across three hubs |
| Risk | 4/25 | Documentation only, no runtime code |
| Research | 8/20 | Ten classes, each swept for every instance |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


