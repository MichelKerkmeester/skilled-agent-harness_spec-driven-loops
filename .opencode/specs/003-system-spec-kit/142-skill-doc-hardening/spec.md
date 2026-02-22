# Feature Specification: SK Documentation Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

## TABLE OF CONTENTS
- [0. OVERVIEW](#0--overview)
- [DOCUMENT SECTIONS](#document-sections)

## 0. OVERVIEW
This document preserves the existing technical decisions and adds validator-required readme structure.

## DOCUMENT SECTIONS
Use the anchored sections below for complete details.


<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec ID** | 142 |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-02-22 |
| **Branch** | `142-skill-doc-hardening` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.opencode/skill/sk-documentation` had validator and packaging defects that caused false failures and missing classification coverage. The defect set included unsafe no-arg handling and numeric counting in `validate_flowchart.sh`, missing `command`/`install_guide` support and command-path detection in `validate_document.py`, fenced-code parsing and `/command/` detection gaps in `extract_structure.py`, false-positive H2 emoji warnings in `package_skill.py`, and documentation drift around mandatory `REFERENCES` and validator exit-code semantics.

### Purpose
Deliver reliability fixes, regression coverage, and documentation/validation alignment for the above defects while preserving mandatory `REFERENCES` policy.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `validate_flowchart.sh`: no-arg safety, numeric-safe counting, decision detection reliability.
- `validate_document.py`: add `command` and `install_guide` type support and `.opencode/command/` detection.
- `extract_structure.py`: fenced-code parsing fix and `/command/` path detection.
- `package_skill.py`: remove false-positive H2 emoji warning behavior.
- Keep `REFERENCES` mandatory and align docs/validation behavior.
- Align docs in `SKILL.md`, `skill_creation.md`, `skill_md_template.md`, `README.md`.
- Add regression tests for all listed defects.

### Out of Scope
- New document classes beyond `command` and `install_guide`.
- Refactors outside targeted files.
- Any changes outside `sk-documentation` and this spec folder.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-documentation/scripts/validate_flowchart.sh` | Modified | no-arg handling, numeric-safe counts, decision detection fix |
| `.opencode/skill/sk-documentation/scripts/validate_document.py` | Modified | `--type` support + `.opencode/command/` detection |
| `.opencode/skill/sk-documentation/scripts/extract_structure.py` | Modified | fenced-code parsing + `/command/` detection |
| `.opencode/skill/sk-documentation/scripts/package_skill.py` | Modified | false-positive H2 emoji warning fix |
| `.opencode/skill/sk-documentation/SKILL.md` | Modified | align with mandatory `REFERENCES` and validator behavior |
| `.opencode/skill/sk-documentation/references/skill_creation.md` | Modified | align requirements and validation behavior |
| `.opencode/skill/sk-documentation/assets/opencode/skill_md_template.md` | Modified | align template requirement text |
| `.opencode/skill/sk-documentation/README.md` | Modified | correct `validate_document.py` exit-code explanation |
| `.opencode/skill/sk-documentation/scripts/tests/test_validator.py` | Modified | add command/install_guide regression cases |
| `.opencode/skill/sk-documentation/scripts/tests/command/auto_detect_command.md` | Created | command-path auto-detection fixture |
| `.opencode/skill/sk-documentation/scripts/tests/test_extract_structure_regressions.py` | Created | fenced-code and `/command/` detection tests |
| `.opencode/skill/sk-documentation/scripts/tests/test_flowchart_validator.sh` | Created | flowchart validator regressions |
| `.opencode/skill/sk-documentation/scripts/tests/test_package_skill_regressions.py` | Created | package-skill warning regression tests |
| `.opencode/skill/sk-documentation/scripts/tests/valid_command.md` | Created | explicit `--type command` validation fixture |
| `.opencode/skill/sk-documentation/scripts/tests/valid_install_guide.md` | Created | explicit `--type install_guide` validation fixture |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `validate_flowchart.sh` no-arg path is safe | `bash .opencode/skill/sk-documentation/scripts/validate_flowchart.sh` prints usage, exits `1`, no unbound-variable error |
| REQ-002 | Flowchart counting is arithmetic-safe | counter variables remain numeric for zero-match cases |
| REQ-003 | Decision detection defect fixed | false/syntax edge case resolved without breaking real decision detection |
| REQ-004 | `validate_document.py` supports `--type command`/`--type install_guide` | argparse choices include both and validation runs with both |
| REQ-005 | `validate_document.py` detects `.opencode/command/` automatically | JSON output reports `document_type: command` on command fixture |
| REQ-006 | `extract_structure.py` fenced-code parsing bug fixed | regression test passes on nested/example fence case |
| REQ-007 | `extract_structure.py` detects `/command/` path | extractor output shows `type: command`, `detected_from: path` |
| REQ-008 | `package_skill.py` false-positive warning removed | package check returns valid with no false H2 warning failure |
| REQ-009 | `REFERENCES` stays mandatory | packaging behavior preserves mandatory `REFERENCES` requirement |
| REQ-010 | Regression tests added for all listed defects | four regression test entry points exist and pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | README exit-code language corrected | README reflects `validate_document.py`: `0 valid`, `1 blocking errors`, `2 file/read/parse` |
| REQ-012 | SKILL/template/reference docs aligned | no contradiction with mandatory `REFERENCES` and validator behavior |
| REQ-013 | Verification commands documented | checklist contains exact commands and outcomes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All P0 requirements implemented and verified.
- **SC-002**: Regression suite passes with listed outcomes.
- **SC-003**: `command` and `install_guide` are supported by type flag and detection flow.
- **SC-004**: Documentation and validator behavior are synchronized.
- **SC-005**: Mandatory `REFERENCES` policy remains enforced.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `assets/template_rules.json` canonical type definitions | wrong type mapping | bind additions to existing `command` and `install_guide` keys |
| Dependency | existing script test runner conventions | fragmented tests | keep compatibility and add targeted test files |
| Risk | over-fixing decision detection | loss of valid detections | true/false paired regression fixtures |
| Risk | future docs drift | stale guidance | keep docs tied to command-level evidence in checklist |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Regression command set completes quickly in local workflow.
- **NFR-P02**: Single-file validators remain practical for routine checks.

### Security
- **NFR-S01**: No network or secret handling introduced.
- **NFR-S02**: New fixtures avoid sensitive data.

### Reliability
- **NFR-R01**: Shell validator no longer fails on missing arg or non-numeric counters.
- **NFR-R02**: Type detection is deterministic for command paths.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Missing positional argument under `set -u`.
- Zero-match grep counts used in arithmetic checks.
- Nested/example code fences containing literal backticks.

### Error Scenarios
- Unsupported `--type` remains argparse error.
- `/command/` detection remains path-specific.
- `SMART ROUTING & REFERENCES` alias continues to satisfy references policy where supported.

### State Transitions
- Existing tests remain green after new regressions are added.
- README troubleshooting/exit-code text matches actual validator behavior.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:acceptance-scenarios -->
## L2: ACCEPTANCE SCENARIOS

1. **Flowchart no-arg safety**
   **Given** validator is invoked without a path
   **When** `validate_flowchart.sh` runs under `set -u`
   **Then** it prints usage and exits `1` without unbound-variable failure.

2. **Document validator type expansion**
   **Given** a command markdown fixture and an install guide fixture
   **When** `validate_document.py` runs with explicit `--type`
   **Then** both types are accepted and validated correctly.

3. **Auto-detection for command path**
   **Given** `.opencode/command/create/skill.md`
   **When** `validate_document.py` runs without `--type`
   **Then** JSON reports `document_type` as `command`.

4. **Extractor and packager regression protection**
   **Given** fenced-code edge fixtures and package check inputs
   **When** regression tests run
   **Then** extractor reports `type: command` from path and packager reports `valid: true` without false H2 warning failure.
<!-- /ANCHOR:acceptance-scenarios -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | 15 implemented file updates across scripts/docs/tests |
| Risk | 17/25 | validator correctness and false-positive elimination |
| Research | 12/20 | changes mapped to concrete defect reports |
| **Total** | **51/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
