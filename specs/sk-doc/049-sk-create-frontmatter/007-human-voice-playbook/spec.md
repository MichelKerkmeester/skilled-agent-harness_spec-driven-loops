---
title: "Feature Specification: Give the human voice mode the manual testing playbook it never got"
description: "The mode that enforces the voice standard has no manual testing playbook, so nothing states what correct behaviour looks like for it and the benchmark reads it as having no scenarios at all."
trigger_phrases:
  - "human voice playbook"
  - "sk-create-with-human-voice testing"
  - "voice mode scenario coverage"
  - "playbook for the voice standard"
importance_tier: "high"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: human-voice-playbook

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | [P0/P1/P2] |
| **Status** | Draft |
| **Created** | 2026-09-01 |
| **Branch** | `scaffold/007-human-voice-playbook` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-verification-and-closeout |
| **Successor** | None |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Give the human voice mode the manual testing playbook it never got specification.

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

The human voice mode owns the standard the whole repository writes against, and it is one of
ten sk-doc modes with no manual testing playbook. Three of thirteen have one. That gap is not
cosmetic: with no playbook the benchmark loader finds no scenarios for the mode, so it is
scored on nothing, and there is no written statement of what the mode doing its job looks
like.

It earns a phase here rather than a packet of its own because the frontmatter mode is getting
a playbook in phase 005, from the same template, against the same package validator. Authoring
the second one costs the setup only once.

### Purpose

The mode that enforces the voice standard can be checked, by an operator and by the benchmark.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A manual testing playbook package for `sk-create-with-human-voice`, authored to the playbook template.
- Scenario frontmatter that matches the contract the loader actually reads, so the scenarios are visible to the benchmark rather than merely present on disk.
- Scenarios covering what the mode is for: catching the tells it bans, and leaving alone the text it is not supposed to touch.

### Out of Scope

- The other eight modes with no playbook. The gap is real and measured, and filling it is its own piece of work rather than something to smuggle in beside a frontmatter migration.
- Changing the voice standard. This phase tests the mode, it does not edit what the mode enforces.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/**` | Create | The playbook package and its scenarios |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The playbook package passes its own validator |
| REQ-002 | The scenario loader reports the authored scenario count, not an empty read | [How to verify it's done] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Scenarios cover both directions: text the mode must flag, and text it must leave alone | [How to verify it's done] |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The playbook package validator passes
- **SC-002**: The loader reports the number of scenarios actually authored
- **SC-003**: A scenario that should pass and one that should fail both behave as written
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [System/API] | [What if blocked] | [Fallback plan] |
| Risk | [Risk description] | [High/Med/Low] | [Mitigation strategy] |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- [Question 1 requiring clarification]
- [Question 2 requiring clarification]
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
