---
title: "Implementation Plan: Triage and fix the README reference and derived-count check failures across the root and hub READMEs"
description: "Record both checks' baseline on 12 READMEs, sort every failure into a real defect, a checker false positive or an intentionally unresolvable reference, fix each false-positive class once in the checker and each real defect in the README text."
trigger_phrases:
  - "readme reference debt plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Triage and fix the README reference and derived-count check failures across the root and hub READMEs

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 checker scripts, Markdown READMEs |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Each checker's built-in `--self-test`, the sk-doc `run-script-tests.sh` suite |

### Overview
Group the 573 reference failures and 83 count failures by token shape, then read each group's lines to decide its class. Fix a class that repeats across READMEs once in the checker, with a self-test case, and fix a real defect in the README text. Prove the checker change adds nothing by running the old and new checkers over every tracked README and diffing at line level.
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
- [x] Both `--self-test` runs print `SELF-TEST PASS` and the line-level regression diff prints 0 for both checks
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Narrow checker rules.

### Key Components
- **`check_readme_references.py`**: extracts path-shaped tokens and resolves them; the change narrows what counts as a path and widens where a real path may resolve from.
- **`check_derived_readme_counts.py`**: finds numeric count claims and derives them; the change narrows what counts as a claim and lets a claim derive from a folder its sentence names.

### Data Flow
README text goes to extraction (links, inline spans, fence lines), then to resolution (README folder, repository root anchors, skill folders, tracked names), then to a PASS or FAIL line per README.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `check_readme_references.py` | Producer of the reference verdict | update | `--self-test` and the repo-wide line-level diff |
| `check_derived_readme_counts.py` | Producer of the count verdict | update | `--self-test` and the repo-wide line-level diff |
| `test_validation_switch.py` | Runs both checkers under the validation off switch | unchanged | `run-script-tests.sh` |
| The 12 READMEs | Consumers of both verdicts | update two of them | Both checks and `validate_document.py` rerun |

Matrix axes: reference kind (link, inline, command, tree) by token shape (slash command, home path, absolute path, bare name, slashed word, anchored path). Links keep their old strict resolution on every row.
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
| Unit | Each new rule and each broken-path case | `--self-test` on both checkers |
| Integration | Every tracked README, old against new checker on one tree | `scratch/` comparison of failing lines |
| Manual | Each remaining failure line read in context | `sed -n` on the README line |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `git ls-files` | Internal | Green | Bare names cannot be confirmed and stay unresolved |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A real broken reference or stale count in some README passes after the change.
- **Procedure**: Run `git checkout HEAD -- .skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py .skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py`, then reapply only the rules that did not hide the defect.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (baseline and triage) | None | Implementation |
| Implementation (checker and README fixes) | Setup | Verification |
| Verification (reruns, diff, suite) | Implementation | Closure |
<!-- /ANCHOR:phase-deps -->

---
