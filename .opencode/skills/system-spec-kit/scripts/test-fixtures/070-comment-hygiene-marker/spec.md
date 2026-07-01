---
title: "Feature Specification: Comment Hygiene Clean Fixture"
description: "Clean fixture for the comment hygiene validation rule."
trigger_phrases:
  - "comment hygiene clean fixture"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Comment Hygiene Clean Fixture

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Review |
| **Created** | 2026-07-01 |
| **Branch** | `070-comment-hygiene-marker` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The comment hygiene rule needs a clean Level 1 fixture with durable HTML comments only.

### Purpose
This fixture verifies that durable HTML comments without tracking markers pass.
<!-- durable context only -->
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One clean HTML comment
- One isolated rule test
- One Level 1 fixture packet

### Out of Scope
- Production spec-folder documentation
- Runtime command changes

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-spec-kit/scripts/test-fixtures/070-comment-hygiene-marker/spec.md | Add | Clean comment hygiene fixture |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Clean fixture has no ephemeral HTML-comment markers | Isolated rule reports pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Fixture remains Level 1 compatible | Validator can parse required files |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `check-comment-hygiene.sh` reports pass for this fixture
- **SC-002**: The fixture contains no tracking marker in an HTML comment
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Fixture drifts from template headers | Validation noise | Keep required anchors in place |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for this fixture
- None for this fixture
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
