---
title: "Implementation Plan: Phase 5: optional-parent-decision-record"
description: "Align two reference lines with the parent decision record practice the validator already accepts: one paragraph in phase-definitions.md and one row in validation-rules.md. Verified with git diff and validate.sh --strict."
trigger_phrases:
  - "optional parent decision record plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: optional-parent-decision-record

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference documentation in `.skilled/skills/system-spec-kit/references/` |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh --strict` |

### Overview
Rewrite one paragraph in `phase-definitions.md` and one table row in `validation-rules.md`, so both say a phase parent may carry an optional `decision-record.md` for decisions that span its phases. The `git diff` proves the change is exactly two lines and touches nothing else. `validate.sh --strict` on this child and on the parent folder proves every content rule still passes, while the generated-metadata rules wait for the save-time repair that owns `description.json` and `graph-metadata.json`.
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
- [x] `validate.sh --strict` on this child and on `../` reports no content-rule error; only generated-metadata rules remain
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two-line rule alignment

### Key Components
- **`phase-definitions.md` parent-structure paragraph**: The rule a reader follows when deciding what a phase parent may contain.
- **`validation-rules.md` Phase Parent row**: The file-set contract that lists what strict validation requires at a parent.

### Data Flow
A reader opens the structure reference, learns that the lean trio is the parent minimum and that one optional `decision-record.md` is allowed for decisions that span phases, then finds the same exception in the validation reference. The validator needs no change because it already skips heavy-doc requirements at a phase parent and never rejected the file.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the two current lines and the Barter evidence. Implementation rewrites one line in each reference file. Verification runs `git diff` on the two files and `validate.sh --strict` on this child and the parent folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh --strict <this child>` and the same command on `../` must report every content rule passing. `git diff --numstat -- <the two files>` must show one added and one removed line per file, with no third path.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`git` and `bash` with the in-repo `validate.sh`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a reader takes the exception to permit a parent `plan.md`, `tasks.md`, `acceptance-criteria.md` or `implementation-summary.md`. Revert the two-line documentation change; no validator, generator or template path depends on it.
<!-- /ANCHOR:rollback -->

---
