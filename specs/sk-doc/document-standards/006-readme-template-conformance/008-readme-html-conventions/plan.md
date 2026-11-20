---
title: "Implementation Plan: Phase 8: readme-html-conventions"
description: "Write the alert and fold rule into the README writing reference, add a blocking fold check to validate_document.py with tests, then pilot both on four files and render them through GitHub."
trigger_phrases:
  - "readme html conventions plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 8: readme-html-conventions

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Python 3 |
| **Framework** | sk-doc `validate_document.py` |
| **Storage** | None |
| **Testing** | pytest through `run-script-tests.sh`, `gh api markdown` for the render |

### Overview
The rule goes into `writing-patterns.md`, which every README template points to, so no template changes. The fold check is one line scan in `validate_document.py` that runs for every document type, measured first against all 677 existing folds. Four files then carry the pilot, and GitHub's renderer confirms what a reader sees.
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
- [x] `run-script-tests.sh` prints `all sk-doc script tests passed` and exits 0
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One validator rule beside the existing structure rules, and one reference section beside the existing format rules.

### Key Components
- **`validate_folds`**: scans the lines outside code fences, pairs each `<details>` line with its `</details>` line and checks the `<summary>` line and the blank line after it
- **Alerts and Folded Tables**: the reference subsection that says when an alert or a fold fits

### Data Flow
`validate_document()` calls `validate_folds()` for every document type after the structure rules. Each issue is blocking, so a broken fold makes the document `INVALID`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `validate_document.py` | Validates every sk-doc document type | Update: new blocking fold check | `test_structure_validation.py`, 12 passed |
| Changelogs and other documents with folds | 677 folds in 257 tracked files | Unchanged | `validate_folds` over 64,445 tracked `.md` files reports 0 issues |
| `check_readme_references.py`, `check_derived_readme_counts.py` | Read README tables as raw text | Not a consumer of the change | A bad path inside the pilot fold fails the reference check, and the restored file passes |

Algorithm invariant: only a tag alone on its line counts, outside a code fence. Adversarial cases: a fold inside a fence, `<details>` in inline code and a whole fold on one line all produce no issue.
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
| Unit | `validate_folds` on a good fold, each broken shape and the non-fold mentions | pytest |
| Integration | An unclosed fold through `validate_document()` on a README | pytest |
| Manual | The two pilot shapes as GitHub renders them | `gh api markdown` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| GitHub markdown API | External | Green | The render claim would stay unchecked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The fold check blocks a document whose fold renders correctly on GitHub
- **Procedure**: Revert the phase commit. The rule, the check and the four pilot edits all sit in it
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup: survey and fold scan | Nothing | The check's severity |
| Implementation: rule, check, pilot | The scan showing 0 broken live folds | Verification |
| Verification: gates and render | Implementation | Closing the phase |
<!-- /ANCHOR:phase-deps -->

---
