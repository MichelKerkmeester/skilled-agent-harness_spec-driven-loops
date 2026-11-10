---
title: "Feature Specification: Root README Section Spacing"
description: "The repository root README.md separates H2 sections with forced blank lines (&nbsp;) instead of horizontal rules, and the sk-doc validator and DQI scorer exempt only that file from the divider checks."
trigger_phrases:
  - "root readme section spacing"
  - "root readme uses forced blank lines instead"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Root README Section Spacing

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-17 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator wants the repository root README.md to separate H2 sections with `&nbsp;` forced blank lines instead of `---` horizontal rules. The sk-doc validator blocks a numbered ALL-CAPS H2 that lacks a `---` above it, and the DQI divider score drops to 0 without dividers. The root README must not fail those checks or have the rules restored.

### Purpose
The root README renders with the `&nbsp;` spacing, passes validation with no divider error, and keeps its full divider score. Every other README still gets the `---` rule.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the 15 `---` section separators in the root README.md with `&nbsp;` forced blank lines
- Exempt only the repository root README.md from the `general_h2_separator` check and the DQI divider penalty
- Add two tests and a "Root README exception" paragraph in the sk-doc standards

### Out of Scope
- Table-detection heuristic in `extract_structure.py` (`'---' in content`) - unrelated to the divider rule and left unchanged by decision
- Divider rule for every other README - still enforced
- `--fix` behavior - the rule has no fixer, and none is added

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `README.md` | Modify | Replace 15 `---` section separators with `&nbsp;` forced blank lines |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modify | Add `is_repo_root_readme()` and pass `h2DividerRequired: False` for the root README |
| `.skilled/skills/sk-doc/shared/scripts/extract_structure.py` | Modify | Add `is_repo_root_readme()` and a `dividers_exempt` parameter on `calculate_dqi` |
| `.skilled/skills/sk-doc/scripts/tests/test_structure_validation.py` | Modify | Add two tests for the root README exemption and the nested README control |
| `.skilled/skills/sk-doc/shared/references/core-standards.md` | Modify | Add a "Root README exception" paragraph to section 6 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The root README.md uses `&nbsp;` forced blank lines between H2 sections and contains no `---` dividers. |
| REQ-002 | `validate_document.py` passes the root README with no `general_h2_separator` finding. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A README outside the repository root still gets `general_h2_separator` when its H2 lacks a `---` above it. |
| REQ-004 | The DQI divider score for the root README stays at 6 of 30. |
| REQ-005 | No auto-fix or hook re-inserts `---` into the root README. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The root README.md has 0 `---` lines and 60 `&nbsp;` lines, and `validate_document.py README.md` reports VALID with 0 issues.
- **SC-002**: A README in a subfolder still fails the divider rule, proven by the nested-README test.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | sk-doc validator scripts (`validate_document.py`, `extract_structure.py`) | Root README cannot be validated if they break | Two new tests and a mutation check guard the exemption |
| Risk | Path-based exemption also matches a README at the root of a nested git repository or submodule | Low: that README skips the divider rule | Recorded as a known limitation in `implementation-summary.md` |
| Risk | DQI total drops from 87 to 85 | Low: divider score is unchanged at 6 | Cause is the table heuristic, recorded as a known limitation |

<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable. The change is a path check inside a validation-time script and adds no runtime service path.
- **NFR-P02**: Not applicable. No throughput target applies to a documentation validator.

### Security
- **NFR-S01**: Not applicable. No authentication surface is touched.
- **NFR-S02**: Not applicable. No data is stored or transmitted.

### Reliability
- **NFR-R01**: Not applicable. No uptime target applies to a local validator.
- **NFR-R02**: Not applicable. The two new tests cover the exemption and the control case.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: Not applicable. The helper takes a file path only.
- Maximum length: Not applicable. The helper compares the file name and the parent folder contents.
- Invalid format: A file not named README.md (case-insensitive) is never exempt, because the name check runs first.

### Error Scenarios
- External service failure: Not applicable. The helper makes no external call.
- Network timeout: Not applicable. The helper makes no external call.
- Concurrent access: Not applicable. The helper reads the file path and directory only.

### State Transitions
- Partial completion: A `---` added to the root README by hand passes validation, because the root README is exempt from the rule. Nothing flags it.
- Session expiry: Not applicable. The change is file-based.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Five files, two validator scripts, one README |
| Risk | 6/25 | Validator behavior change limited to one file path |
| Research | 4/20 | Enforcement points found by grep, no external investigation |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None open. The table-detection heuristic is out of scope by decision, and the two known limitations are in `implementation-summary.md`.
<!-- /ANCHOR:questions -->

---

