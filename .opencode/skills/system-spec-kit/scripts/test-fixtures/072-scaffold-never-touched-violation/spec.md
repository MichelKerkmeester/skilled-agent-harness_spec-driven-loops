---
title: "Feature Specification: Scaffold Signature Violation Fixture"
description: "Violation fixture for the scaffold-never-touched validation rule."
trigger_phrases:
  - "scaffold signature violation fixture"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Scaffold Signature Violation Fixture

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Branch** | `072-scaffold-never-touched-violation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The scaffold-never-touched rule needs a fixture that claims completion while a required doc still carries scaffold-origin metadata.

### Purpose
This fixture verifies that scaffold-signature markers fail when the spec status starts with Complete.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One intentional scaffold-signature marker in a required document
- One isolated rule test
- One Level 1 fixture packet

### Out of Scope
- Production spec-folder documentation
- Runtime command changes

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-spec-kit/scripts/test-fixtures/072-scaffold-never-touched-violation/spec.md | Add | Violation scaffold fixture |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Complete status with scaffold-origin required doc fails | Isolated rule reports fail |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `check-scaffold-never-touched.sh` reports fail for this fixture
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Marker removed accidentally | Fail case becomes vacuous | Keep scaffold-origin metadata in plan.md |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for this fixture
<!-- /ANCHOR:questions -->
