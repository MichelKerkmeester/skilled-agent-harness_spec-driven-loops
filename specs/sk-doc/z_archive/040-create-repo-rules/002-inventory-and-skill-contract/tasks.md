---
title: "Tasks: Phase 2: Inventory and Skill Contract"
description: "Ordered tasks for turning the nine-file corpus into a skill contract: parse all nine structurally, derive MUST and MAY element sets with citations, classify every divergence, recover the decision tests from the phase records that established them, then verify by traceability, coverage, and reproducing phase 1 ten refusals."
trigger_phrases:
  - "inventory tasks"
  - "anatomy derivation"
  - "decision test recovery"
  - "traceability audit"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: Inventory and Skill Contract

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

- [x] T001 Confirm the corpus is unchanged and record the baseline, so non-disturbance is provable at the end
- [x] T002 Write a throwaway structural parser in `scratch/`: frontmatter keys, `##` headings, divider positions, self-check shape, cross-reference targets
- [x] T003 Produce the per-file element table across all nine files - no sampling
- [x] T004 Identify the six phase implementation summaries that established the decision tests
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Derive the MUST-carry set: elements every rule uses
- [x] T006 Derive the MAY-carry set: elements some rules use, each with the reason it is optional
- [x] T007 Classify every divergence as a permitted variant or a defect the contract forbids going forward
- [x] T008 Write `rule-anatomy.md`, ordered as the template will be, every element citing file and section
- [x] T009 Recover the always-loaded-versus-triggered test from the phase that established it, and cite it
- [x] T010 Recover the router's In/Out scope boundary and the four-part refusal test, and cite them
- [x] T011 Write `decision-tests.md` as a checklist usable without reading the corpus
- [x] T012 Write `mode-boundary.md`: what the mode does not own, and which sibling owns it
- [x] T013 Write `target-tree.md`, justified against a sibling mode's actual layout
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Traceability audit: resolve every citation in `rule-anatomy.md` to a real file and section
- [x] T015 Coverage audit: every element in the table appears in the contract as MUST, MAY, or a recorded defect
- [x] T016 Apply `decision-tests.md` to the ten candidate rules phase 1 refused; all ten must still fail, and by the same reason
- [x] T017 Confirm the corpus is byte-unchanged
- [x] T018 Run `validate.sh <this folder> --strict` and record `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Phase 3 could build the template from `rule-anatomy.md` alone
- [x] `scratch/` holds only the intentional parser
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Closure Gate**: See `acceptance-criteria.md`
- **Parent packet**: See `../spec.md` Phase Documentation Map
- **The corpus**: `../../../../repo-rules/` and `../../../../REPO RULES.md`
- **Decision-test sources**: `../001-repo-rules-router/00{3,4,5,6}-*/implementation-summary.md`
- **Tree to inherit from**: `.opencode/skills/sk-doc/sk-create-changelog/`
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
- [x] CHK-003 [P0] Corpus baseline captured before any reading tool runs
- [x] CHK-004 [P1] Decision-test source records identified before recovery begins
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every anatomy element cites a shipped rule; none is aspirational
- [x] CHK-011 [P0] Divergences are classified, not silently normalized
- [x] CHK-012 [P1] The parser stays in `scratch/`; the element table is the artifact
- [x] CHK-013 [P1] The contract adds no requirement the corpus does not meet, unless recorded as a deliberate tightening
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Traceability and coverage audits both clean
- [x] CHK-022 [P1] Element classes covered: frontmatter, triggers, binding sentence, body, self-check, cross-references
- [x] CHK-023 [P1] Decision tests reproduce phase 1's ten refusals
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

This phase produces a contract, and a contract asserted over its corpus rather than derived from it is the defect class to guard against.

- [x] CHK-FIX-001 [P0] Finding class recorded per divergence: `instance-only` (one file's quirk) or `class-of-bug` (the corpus disagrees with itself)
- [x] CHK-FIX-002 [P0] Producer inventory complete: all nine files parsed, none sampled
- [x] CHK-FIX-003 [P0] Consumer inventory not applicable - this phase changes nothing outside itself; recorded rather than skipped
- [x] CHK-FIX-004 [P0] Not applicable - no security, path, parser or redaction surface in the output
- [x] CHK-FIX-005 [P1] Matrix axes listed: 9 files x 6 element classes
- [x] CHK-FIX-006 [P1] Not applicable - no process-wide state is read
- [x] CHK-FIX-007 [P1] Evidence pinned to the commit that lands this phase
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in the contract documents
- [x] CHK-031 [P0] Not applicable - nothing executable is produced
- [x] CHK-032 [P1] No decision test permits a rule that would weaken a gate or a hard blocker
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/acceptance-criteria synchronized
- [x] CHK-041 [P1] The `scratch/` parser carries a docstring saying it is throwaway and the table is the artifact
- [x] CHK-042 [P1] Parent Phase Documentation Map status updated from Pending
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
| P1 Items | 13 | 13/13 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-31
<!-- /ANCHOR:summary -->

---



