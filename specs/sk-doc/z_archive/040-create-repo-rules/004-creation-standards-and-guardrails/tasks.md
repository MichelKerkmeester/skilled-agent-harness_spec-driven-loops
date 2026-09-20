---
title: "Tasks: Phase 4: Creation Standards and Guardrails"
description: "Ordered tasks for deriving the quality bar from the shipped corpus and validating it in both directions: candidates read out of eight rules, each checked against all eight, and the thin sample from phase 3 used as the negative control that proves the bar bites."
trigger_phrases:
  - "standards tasks"
  - "eight rule validation"
  - "negative control"
  - "misreading guard"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: Creation Standards and Guardrails

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the corpus md5 baseline and confirm the thin sample is preserved unedited
- [x] T002 Extract phase 3's structural assertion list, so no standard restates one
- [x] T003 Read all eight rules for what they do beyond structure - what each section earns, what each trigger phrase does
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Draft the section test: a numbered section exists when it names a failure
- [x] T005 Draft the trigger-phrase test: symptom vocabulary, no cross-rule collision, what makes a phrase useless
- [x] T006 Draft the binding-sentence test: one sentence, one obligation, no conjunction hiding a second rule
- [x] T007 Draft the self-check test: one item per obligation the body creates
- [x] T008 Draft the misreading guard, citing the three shipped rules that added a "what this is not" section after being misread
- [x] T009 Write the do's and don'ts, each stated as an observed failure rather than a preference
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Apply every standard to all eight shipped rules and record the result per rule
- [x] T011 Drop any standard a shipped rule fails, or record the rule as an exception with its reason
- [x] T012 Apply the surviving standards to the thin sample; it must fail, and the failing tests must be named
- [x] T013 Confirm no standard restates a phase-3 structural assertion
- [x] T014 Wire `references/README.md` and `SKILL.md` to load the standards at the authoring step
- [x] T015 Run `validate.sh <this folder> --strict` and record `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The bar passes all eight and fails the sample
- [x] `scratch/` cleaned
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Closure Gate**: See `acceptance-criteria.md`
- **Structural floor it sits above**: `../003-skill-scaffold-and-template/`
- **The corpus**: `../../../../repo-rules/`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Predecessor phase closed and its outputs available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every standard names the failure it prevents
- [x] CHK-011 [P0] Every standard is met by all eight shipped rules
- [x] CHK-012 [P1] No standard restates a structural assertion
- [x] CHK-013 [P1] The document fits the length bands it teaches
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Positive check recorded per rule, all eight
- [x] CHK-022 [P0] Negative check recorded: the thin sample fails with named tests
- [x] CHK-023 [P1] Standards expressible as yes-or-no questions
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

The defect class here is a bar that is unfalsifiable or set above its own corpus.

- [x] CHK-FIX-001 [P0] Finding class recorded per dropped standard
- [x] CHK-FIX-002 [P0] Producer inventory: all eight rules, per standard, no sampling
- [x] CHK-FIX-003 [P0] Consumer inventory not applicable - nothing consumes the standards until the mode runs
- [x] CHK-FIX-004 [P0] Not applicable - no security surface
- [x] CHK-FIX-005 [P1] Matrix axes: 5 standards x 8 rules, plus 5 x the sample
- [x] CHK-FIX-006 [P1] Not applicable - no process-wide state
- [x] CHK-FIX-007 [P1] Evidence pinned to the landing commit
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in the standards document
- [x] CHK-031 [P0] Not applicable - nothing executes
- [x] CHK-032 [P1] No standard permits a rule that weakens a gate
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/acceptance-criteria synchronized
- [x] CHK-041 [P1] Every standard cites a shipped rule that meets it
- [x] CHK-042 [P1] Parent Phase Documentation Map updated from Pending
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 12 | 12/12 |
| P2 Items | 0 | [ ]/0 |

**Verification Date**: 2026-08-31
<!-- /ANCHOR:summary -->

---



