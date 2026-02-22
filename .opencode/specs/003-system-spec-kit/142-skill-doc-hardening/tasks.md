# Tasks: SK Documentation Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## TABLE OF CONTENTS
- [0. OVERVIEW](#0--overview)
- [DOCUMENT SECTIONS](#document-sections)

## 0. OVERVIEW
This document preserves the existing technical decisions and adds validator-required readme structure.

## DOCUMENT SECTIONS
Use the anchored sections below for complete details.


<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
| `[P0]`/`[P1]`/`[P2]` | Priority |

**Task Format**: `T### [priority] [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Capture baseline failures for all listed defects (`.opencode/skill/sk-documentation/scripts/*`)
- [x] T002 [P0] [P] Add flowchart fixtures for no-arg/count/decision cases (`.opencode/skill/sk-documentation/scripts/tests/fixtures/flowchart/*`)
- [x] T003 [P0] [P] Add command/install_guide markdown fixtures (`.opencode/skill/sk-documentation/scripts/tests/*.md`)
- [x] T004 [P0] [P] Add nested fenced-code fixtures for extractor regression (`.opencode/skill/sk-documentation/scripts/tests/fixtures/extract_structure/*`)
- [x] T005 [P1] Extend existing validator runner with command/install_guide cases (`.opencode/skill/sk-documentation/scripts/tests/test_validator.py`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 [P0] Fix no-arg handling in `validate_flowchart.sh`
- [x] T007 [P0] Fix numeric-safe grep counting in `validate_flowchart.sh`
- [x] T008 [P0] Fix decision detection false/syntax behavior in `validate_flowchart.sh`
- [x] T009 [P0] Add `--type command` and `--type install_guide` in `validate_document.py`
- [x] T010 [P0] Add `.opencode/command/` auto-detection in `validate_document.py`
- [x] T011 [P0] Fix fenced-code parsing defect in `extract_structure.py`
- [x] T012 [P0] Add `/command/` detection support in `extract_structure.py`
- [x] T013 [P0] Fix false-positive H2 emoji warning bug in `package_skill.py`
- [x] T014 [P0] Confirm `REFERENCES` remains mandatory in packaging behavior (`package_skill.py`)
- [x] T015 [P1] Align `.opencode/skill/sk-documentation/SKILL.md`
- [x] T016 [P1] Align `.opencode/skill/sk-documentation/references/skill_creation.md`
- [x] T017 [P1] Align `.opencode/skill/sk-documentation/assets/opencode/skill_md_template.md`
- [x] T018 [P1] Align `.opencode/skill/sk-documentation/README.md` exit-code semantics
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T019 [P0] Add and run `test_flowchart_validator.sh`
- [x] T020 [P0] Add and run `test_extract_structure_regressions.py`
- [x] T021 [P0] Add and run `test_package_skill_regressions.py`
- [x] T022 [P0] Run expanded `test_validator.py`
- [x] T023 [P1] Run script smoke checks and confirm docs parity
- [x] T024 [P1] Update `implementation-summary.md` after implementation completes
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Regression command set passes with evidence recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

---
