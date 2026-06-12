---
title: "Feature Specification: Extra Header Warning Fixture [template:level_2/spec.md]"
description: "Validator fixture for non-blocking warning coverage with an accepted extra section."
trigger_phrases:
  - "fixture"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Extra Header Warning Fixture

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-11 |
| **Branch** | `template-extra-header-fixture` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Validator regression fixtures need one Level 2 folder that stays structurally valid while still exercising warning-mode handling.

### Purpose
Provide a Level 2 packet with current required anchors and a custom section that the current validator accepts as a non-blocking extension.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Validate live header order.
- Validate required anchor order.
- Exercise warning-mode handling without structural errors.

### Out of Scope
- Level 3 decision-record validation.
- Baseline clean-fixture coverage.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Fixture | Level 2 specification with an accepted custom section |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Required headers stay in template order | Default validation has no template-header errors |
| REQ-002 | Required anchors stay in template order | `ANCHORS_VALID` passes |
| REQ-003 | Fixture remains non-baseline warning coverage | Default validation reports warnings without errors |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Extra custom sections are accepted | `TEMPLATE_HEADERS` passes |
| REQ-005 | Strict mode escalates remaining warnings | `validate.sh --strict` returns a validation error |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Required Level 2 anchors are present.
- **SC-002**: The custom section does not produce a structural template error.
- **SC-003**: The fixture stays available for warning-mode exit and JSON coverage.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Required template anchors drift | Fixture may fail structurally | Keep required anchors aligned with the clean Level 2 fixture |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Validation completes quickly on the static fixture.

### Security
- **NFR-S01**: Fixture content contains no secrets.

### Reliability
- **NFR-R01**: Warning-mode behavior is deterministic.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty-folder and missing-file cases remain covered by separate negative fixtures.

### Error Scenarios
- Missing required anchors remain covered by separate negative fixtures.

### Concurrent Operations
- Multiple validator runs should read the same static files without mutation.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Static Level 2 fixture files only |
| Risk | 8/25 | Validator regression coverage |
| Research | 6/20 | Current template contract read |
| **Total** | **24/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

<!-- /ANCHOR:related-docs -->
---

## CUSTOM NOTES

This section is intentionally outside the required template structure. The current validator accepts custom sections after the required structure.
