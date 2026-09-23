---
title: "Implementation Plan: Phase 53: Legacy template default detection"
description: "Extend the existing placeholder validation with an exact-match, warning-severity check against the retired template defaults, then record a repository baseline."
trigger_phrases:
  - "legacy default detection plan"
  - "placeholder warning plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 53: Legacy template default detection

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, built to `runtime/cli/dist` |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Vitest, plus `validate.sh --recursive` for the baseline |

### Overview
`validatePlaceholders` already walks every validated doc line by line. This phase gives it a second, warning-severity match against the retired defaults from phase 052, runs it over `specs/` to record how many remain, and measures on a 20-doc sample whether a cheap model could draft the replacements.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Open question answered by the operator (2026-09-23)
- [ ] Phase 052 closed with its retired list recorded

### Definition of Done
- [ ] REQ-001 to REQ-006 met with evidence
- [ ] Vitest suite passes
- [ ] Strict validation passes on this phase
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Extend in place. A separate rule file fails the reversal-cost test, because `validatePlaceholders` already reads the same lines with the same code-fence handling, and a second walker would duplicate it.

### Key Components
- **Placeholder validation** (`orchestrator.ts`): gains the retired-default match beside the canonical-marker match.
- **Retired list**: one constant, taken verbatim from phase 052's record, with a comment giving the reason it exists rather than where it came from.
- **Feasibility sample**: a one-off cli-codex dispatch, read-only, whose drafts and verdicts land in `scratch/backfill-sample.md`. It adds no code to the repository.

### Data Flow
Each validated doc line is normalized for whitespace and compared against the retired list. A match adds a warning entry, and warnings never enter the exit-code decision.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Three tests, each failing for a reason no current test catches: an exact default that must warn, a paraphrase that must not, and a strict run whose exit code must not change. The feasibility sample is graded by hand: a draft passes when it states what its doc covers without template wording or invented claims.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 052 must close first, because its REQ-005 produces the list this phase matches against.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase's commit. The check only adds warnings, so removing it changes no exit code.
<!-- /ANCHOR:rollback -->

---
