---
title: "Feature Specification: Scaffold Signature Clean Fixture"
description: "Clean fixture for the scaffold-never-touched validation rule."
trigger_phrases:
  - "scaffold signature clean fixture"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Scaffold Signature Clean Fixture

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete (validated fixture) |
| **Created** | 2026-07-01 |
| **Branch** | `073-scaffold-never-touched-clean` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The scaffold-never-touched rule needs a complete fixture whose required docs contain real metadata and no scaffold signatures.

### Purpose
This fixture verifies that genuinely complete folders pass when no scaffold-signature markers remain.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Complete-prefixed status claim
- Real required doc metadata
- One isolated rule test

### Out of Scope
- Production spec-folder documentation
- Runtime command changes

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-spec-kit/scripts/test-fixtures/073-scaffold-never-touched-clean/spec.md | Add | Clean scaffold fixture |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Complete status without scaffold-origin required docs passes | Isolated rule reports pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `check-scaffold-never-touched.sh` reports pass for this fixture
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Clean metadata regresses | Pass case becomes invalid | Keep packet_pointer and last_updated_by real |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for this fixture
<!-- /ANCHOR:questions -->
