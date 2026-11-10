---
title: "Implementation Plan: Phase 47: diagram-corpus-ci"
description: "Move the diagram script README into the 1.2 version era the packet's metadata family requires, rewrite the family's error message to name the by-hand step, and prove both directions with the corpus log, the mutation suite and the two applicator steps."
trigger_phrases:
  - "diagram corpus ci plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 47: diagram-corpus-ci

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown frontmatter and a Node CommonJS checker, Node 20 on CI |
| **Framework** | The sk-design-diagram corpus checker and its family modules |
| **Storage** | None; the corpus is the tracked package plus its `assets/diagrams` |
| **Testing** | `node scripts/check-diagram-corpus.cjs` and the node test runner over `scripts/tests/corpus-mutations.test.cjs` |

### Overview
The metadata family reads `SKILL.md` version `1.2.2.0` as its anchor and requires every in-scope doc to share the `1.2` major.minor. One README carried `1.0.1.0` from a bulk pass, so it now carries `1.2.0.1`, and the family's error message no longer points at a pass that cannot fix it.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Family-based corpus check: one module per rule, each run over every shipped template and example.

### Key Components
- **Metadata family**: `scripts/families/metadata.cjs` reads the anchor version from `SKILL.md` and compares each markdown document's frontmatter version against the anchor's major.minor.
- **Scripts README**: `scripts/README.md` is the in-scope document that carried a version outside the anchor's era.
- **Mutation suite**: `scripts/tests/corpus-mutations.test.cjs` and `scripts/tests/mutation-cases.cjs` break one rule at a time and require the checker to report it.

### Data Flow
`check-diagram-corpus.cjs` loads each family over the package. The metadata family reads `SKILL.md` at `1.2.2.0`, sets the anchor to `1.2`, and records an error for any document whose version differs in major or minor. One recorded error makes the run print `RESULT: FAILED`, and the workflow's literal marker check then fails the job.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Both directions are recorded. Restoring `1.0.1.0` makes the checker fail and name the README, so the old value is shown to be the cause. At `1.2.0.1` the checker passes all 12 families with 0 errors. The mutation suite runs before and after: before the fix its clean-corpus precondition failed, and after the fix it passes 21 of 21. Both applicator steps are rerun and their output compared to `assets/diagrams` byte for byte.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`SKILL.md` version `1.2.2.0` is the anchor the family reads. The family's loop over in-scope markdown is what applies the rule. sk-doc's `frontmatter-version.mjs` is a dependency this phase works around, not one it changes: it keeps a child doc's edition and starts a missing one at `1.0.0.0`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the two files changed at `1241fca3c6`. Nothing else in the package moved, so a revert restores the exact pre-fix red state and leaves every other family's result unchanged.
<!-- /ANCHOR:rollback -->

---
