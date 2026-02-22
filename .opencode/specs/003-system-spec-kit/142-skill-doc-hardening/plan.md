# Implementation Plan: SK Documentation Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## TABLE OF CONTENTS
- [0. OVERVIEW](#0--overview)
- [DOCUMENT SECTIONS](#document-sections)

## 0. OVERVIEW
This document preserves the existing technical decisions and adds validator-required readme structure.

## DOCUMENT SECTIONS
Use the anchored sections below for complete details.


<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, Python 3, Markdown |
| **Framework** | Script-based validators |
| **Storage** | Filesystem only |
| **Testing** | Existing runner + new regression tests |

### Overview
Implement scoped fixes across four scripts, add regression coverage for each defect class, and align skill documentation with actual validator behavior. Execution order is regression-first to prove defect reproduction, then minimal targeted fixes, then docs alignment and verification.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (existing + new regressions)
- [ ] Docs updated and aligned
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Defect hardening with regression locks.

### Key Components
- **Flowchart validator**: robust arg/count/decision handling.
- **Document validator**: explicit + automatic support for `command` and `install_guide`.
- **Structure extractor**: fenced-code stability and command-path detection.
- **Skill packager**: eliminate false-positive heading warnings while preserving mandatory section policy.
- **Documentation contract**: SKILL/template/reference/README text reflects code truth.

### Data Flow
1. Add fixtures/tests for each known defect.
2. Execute tests to establish failing baseline.
3. Apply script fixes with smallest viable changes.
4. Align docs/templates to current behavior.
5. Run full regression command set and capture results.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Add/update fixtures for flowchart, command/install_guide, and fenced-code cases.
- [ ] Expand test runner coverage for `validate_document.py` types/detection.

### Phase 2: Core Implementation
- [ ] Fix `validate_flowchart.sh` no-arg path and numeric-safe counts.
- [ ] Correct decision detection behavior in `validate_flowchart.sh`.
- [ ] Add `command`/`install_guide` CLI type support in `validate_document.py`.
- [ ] Add `.opencode/command/` auto-detection in `validate_document.py`.
- [ ] Fix fenced-code parsing and `/command/` detection in `extract_structure.py`.
- [ ] Remove false-positive H2 emoji warning behavior in `package_skill.py`.
- [ ] Keep `REFERENCES` mandatory behavior intact.
- [ ] Align `SKILL.md`, `skill_creation.md`, `skill_md_template.md`, and `README.md`.

### Phase 3: Verification
- [ ] Run all regression and smoke commands from checklist.
- [ ] Validate no placeholders or contradictory docs remain.
- [ ] Update implementation summary with final evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | `validate_document.py` type and detection coverage | `python3 .opencode/skill/sk-documentation/scripts/tests/test_validator.py` |
| Regression | `extract_structure.py` fenced-code and command-path behavior | `python3 -m pytest .opencode/skill/sk-documentation/scripts/tests/test_extract_structure_regressions.py -q` |
| Regression | `package_skill.py` H2 warning behavior + mandatory REFERENCES | `python3 -m pytest .opencode/skill/sk-documentation/scripts/tests/test_package_skill_regressions.py -q` |
| Regression | `validate_flowchart.sh` arg/count/decision checks | `bash .opencode/skill/sk-documentation/scripts/tests/test_flowchart_validator.sh` |
| Smoke | help/exit-code/doc alignment checks | direct script invocations + `rg` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/skill/sk-documentation/assets/template_rules.json` | Internal | Green | cannot align validator type behavior confidently |
| Existing script test folder + runner | Internal | Green | cannot add consistent regressions |
| Python 3 environment | Tooling | Green | Python scripts/tests cannot run |
| `pytest` availability | Tooling | Yellow | may require script-only fallback for some tests |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Existing validations regress or baseline tests fail after fix.
- **Procedure**: Revert scoped script/doc edits, rerun baseline tests, and re-open failed task items.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ---> Phase 2 (Core) ---> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Verify |
| Core | Setup | Verify |
| Verify | Core | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 1-2 hours |
| Core Implementation | Medium-High | 3-5 hours |
| Verification | Medium | 1-2 hours |
| **Total** | | **5-9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline failures captured
- [ ] Scope-limited file list confirmed
- [ ] Regression commands documented

### Rollback Procedure
1. Revert only scoped files.
2. Re-run baseline command set.
3. Confirm prior behavior restored.
4. Re-plan unresolved defects in `tasks.md`.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
