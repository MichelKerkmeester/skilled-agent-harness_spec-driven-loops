---
title: "Implementation Plan: doc checker accuracy and README debt fixes"
description: "Give benchmark companion files their own document type, read README references and counts by rules the checkers can prove, and fix two README lines."
trigger_phrases:
  - "alignment fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: doc checker accuracy and README debt fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 |
| **Framework** | None |
| **Storage** | None |
| **Testing** | pytest through `run-script-tests.sh` |

### Overview
Give benchmark companion files their own document type and skip singular fixture folders in `validate_document.py`. Make the README reference checker import the audit's path rules while it still checks every link, inventory row and tree line, and make the count checker count only plural inventories of the README's own folder. Prove each change with a test that fails on the HEAD scripts and with repo-wide before and after runs, then correct the README references and counts the checkers report as really broken.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] The sk-doc script suite passes and each checker's hit count drops by false positives only
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: checker fixes guarded by regression tests.

### Key Components
- **`BENCHMARK_COMPANION_NAMES`**: the four companion names the report contract lists, typed only below `benchmark/reports/<run>/`
- **`benchmark_companion` in `template-rules.json`**: a rule set with no required section, divider or heading-case rule
- **`should_exclude_path()`**: matches folder segments ending in `fixtures` or `fixture`, never the file name
- **`path_tokens()`, `table_tokens()` and `TreeState` in the reference checker**: inline tokens follow `normalize_reference_token` and `token_looks_like_path` from `audit_readmes.py`; code-span table cells and tree entries are inventory claims; `resolve_reference` uses `classify_reference_status` from the README folder, its package root and the repository root; `clear_gitignored()` batches `resolve_gitignored_references` once per run
- **`counted_term()` and `describes_other_path()` in the count checker**: a plural term directly after a standalone number, skipped only when its own sentence names another path and not the README folder

### Data Flow
Each checker reads one README at a time as before; only the token selection and the claim selection change.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `validate_document.py` type detection | Producer of `document_type` | update | `test_benchmark_companion_typing.py` |
| `test_readme_verdict_parity.py` baseline | Consumer of README verdicts | regenerate | the one changed entry is the fixture README |
| `check_readme_references.py` | Reference gate | update | `test_readme_reference_checker.py`, `--self-test` |
| `check_derived_readme_counts.py` | Count gate | update | `test_derived_readme_counts.py`, `--self-test` |
| `test_validation_switch.py` | Runs both gates under the off switch | unchanged | suite passes |
| `audit_readmes.py` git calls | Shared helper for both checkers | update | fsmonitor off; `test_audit_readmes_accuracy.py` passes |
| READMEs the checkers report | Consumers of the reference and count rules | update | each corrected README passes the reference checker and `validate_document.py` |

Inventory: `rg -l 'check_readme_references|check_derived_readme_counts'` outside `specs/` and `changelog/` finds only the two scripts and `test_validation_switch.py`.
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
| Unit | Each checker change in a temporary git repo or path | pytest |
| Integration | Every tracked non-spec `.md` file and every tracked README | the three checkers before and after |
| Manual | Fail-before proof and removed-hit sample | new tests run against the HEAD scripts copied into the scratchpad |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `audit_readmes.py` helpers | Internal | Green | The checkers cannot import their path rules |
| pytest | External | Green | Suite cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a checker passes a document that is really broken
- **Procedure**: revert the commit and rerun `test_readme_verdict_parity.py --write`
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Baseline checker runs | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Commit |
<!-- /ANCHOR:phase-deps -->

---
