---
title: "Feature Specification: Comment Hygiene Violation Fixture"
description: "Violation fixture for the comment hygiene validation rule."
trigger_phrases:
  - "comment hygiene violation fixture"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Comment Hygiene Violation Fixture

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
| **Branch** | `071-comment-hygiene-marker-violation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The comment hygiene rule needs a violation fixture with one tracking marker in an HTML comment.

### Purpose
This fixture verifies that tracking markers in HTML comments fail.
<!-- F-999-Z9-01: test marker -->
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One intentional HTML-comment tracking marker
- One isolated rule test
- One Level 1 fixture packet

### Out of Scope
- Production spec-folder documentation
- Runtime command changes

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-spec-kit/scripts/test-fixtures/071-comment-hygiene-marker-violation/spec.md | Add | Violation comment hygiene fixture |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Violation fixture includes one ephemeral HTML-comment marker | Isolated rule reports fail |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Fixture remains Level 1 compatible | Validator can parse required files |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `check-comment-hygiene.sh` reports fail for this fixture
- **SC-002**: The fixture contains exactly one tracking marker in an HTML comment
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Marker removed accidentally | Fail case becomes vacuous | Keep the marker in spec.md only |
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
