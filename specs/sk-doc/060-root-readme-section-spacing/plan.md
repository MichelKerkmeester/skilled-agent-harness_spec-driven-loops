---
title: "Implementation Plan: Root README Section Spacing"
description: "Replaces the root README.md horizontal rules with &nbsp; forced blank lines and adds a path-keyed exemption from the divider check in the sk-doc validator and the DQI scorer."
trigger_phrases:
  - "root readme section spacing plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Root README Section Spacing

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 (sk-doc validator scripts), Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | pytest (`test_structure_validation.py`), `validate_document.py` CLI |

### Overview
The root README.md drops its 15 `---` section rules for `&nbsp;` forced blank lines. A new helper, `is_repo_root_readme()`, matches the repository root README by path. The validator skips the `general_h2_separator` check for that file, and the DQI scorer keeps the full divider score for it. Other READMEs keep both checks.
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
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a path-keyed exemption inside the existing rule-based validator and DQI scorer. No new rule or config key is added.

### Key Components
- **`is_repo_root_readme(file_path)`** in `validate_document.py` and in `extract_structure.py`: true when the file name is README.md (case-insensitive) and its directory holds `.git`, either as a folder in a checkout or as a file in a linked worktree.
- **`validate_general_structure` call site** in `validate_document.py`: passes `h2DividerRequired: False` for the root README. `template-rules.json` keeps `h2DividerRequired: true` for all other READMEs.
- **`calculate_dqi` in `extract_structure.py`**: new `dividers_exempt` parameter that keeps the full divider score when set.

### Data Flow
File path → `is_repo_root_readme()` → the structure check flag (validator verdict) and the `dividers_exempt` argument (DQI score). Both outputs are computed from the same path test, so the verdict and the score agree.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This packet is a feature change, not a `fix_bug`, deep-review FAIL or security finding. The surfaces it touches are the four files in `spec.md` section 3, and the grep checks in `tasks.md` cover them.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `is_repo_root_readme()` path rule, divider rule for root and nested README, `calculate_dqi` divider score | pytest (`test_structure_validation.py`) |
| Integration | `validate_document.py README.md` verdict, DQI before and after | `validate_document.py` CLI |
| Manual | Count of `---` and `&nbsp;` lines in the root README | grep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-doc validator scripts (`validate_document.py`, `extract_structure.py`) | Internal | Green | Root README cannot be validated |
| `template-rules.json` (`h2DividerRequired`) | Internal | Green | Exemption would be unclear for other READMEs |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The validator flags a README outside the repository root as passing, or the root README check regresses.
- **Procedure**: Remove the `is_repo_root_readme()` calls and the `dividers_exempt` argument, drop the "Root README exception" paragraph, and restore the 15 `---` lines in README.md.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Implementation) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Done, within one session |
| Core Implementation | Low | Done, within one session |
| Verification | Low | Done for tests and validator, suite and strict run pending |
| **Total** | | **One session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- N/A: no backup, no data changes.
- N/A: no feature flag, the change is a file-level validator path rule.
- N/A: no monitoring, no runtime service.

### Rollback Procedure
1. Immediate action: N/A, there is no feature flag to disable.
2. Revert code: undo the four file edits listed in `spec.md` section 3.
3. Verify rollback: rerun `validate_document.py` on a nested README and on the root README, and confirm the divider finding returns for the root README.
4. Notify stakeholders: N/A, the change is operator-only.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

