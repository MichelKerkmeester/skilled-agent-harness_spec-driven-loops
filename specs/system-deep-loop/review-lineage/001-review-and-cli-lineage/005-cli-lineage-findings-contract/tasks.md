---
title: "Tasks: Give CLI deep-loop lineages the findings output contract and gate it per iteration"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cli lineage findings contract tasks"
  - "findings not enumerated tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Give CLI deep-loop lineages the findings output contract and gate it per iteration

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

- [x] T001 Capture the runtime suite baseline: 164 files, 2,799 passed, 8 skipped
- [x] T002 Reproduce the closeout failure from the AI Systems research run and trace it to the prompt, the gate and the merge
- [x] T003 Check `deep-ai-council` and `deep-improvement` for the same defect class
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 CLI OUTPUT CONTRACT block per loop type in `buildLoopPrompt` (`runtime/scripts/fanout-run.cjs`)
- [x] T005 `findings_not_enumerated` gate for research (`runtime/scripts/verify-iteration.cjs`)
- [x] T006 `findings_not_enumerated` gate for review, on the iteration's `findingsNew` claim, accepting `findingDetails`, delta finding rows and reducer-parsed Markdown (`runtime/scripts/verify-iteration.cjs`)
- [x] T007 Shared `parseIterationMarkdownFindings`, `latestIterationRecords` and `deltaRowIteration` (`runtime/lib/deep-loop/iteration-findings.cjs`)
- [x] T008 Latest record per iteration in the merge and the closeout (`runtime/scripts/fanout-merge.cjs`, `runtime/scripts/synthesis-closeout.cjs`)
- [x] T009 `Array.isArray` guards for `openQuestions`, `resolvedQuestions` and `ruledOutDirections` (`runtime/scripts/fanout-merge.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Tests for every change, each failing on the unpatched code (`runtime/tests/`)
- [x] T011 Review by SWE 2 max through cli-devin, findings resolved
- [x] T012 Review by DeepSeek V4.1 Flash max through cli-devin, findings resolved, then a follow-up review of the reworked review gate, its five findings resolved
- [x] T013 Replay the review gate over every real review state log in this repository
- [x] T014 Full runtime suite against the baseline
- [x] T015 Strict packet validation
- [x] T016 Fix the merge regression the proof run exposed: rebuild when state findings are missing from a registry, by the closeout's keys (`runtime/scripts/fanout-merge.cjs`, `runtime/lib/deep-loop/iteration-findings.cjs`)
- [x] T017 Close the AI Systems research run with `synthesis_complete` (SC-002)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md` REQ-001 to REQ-007
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` section 3
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: `plan.md` section 6
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: `git diff --check` clean
- [x] CHK-011 [P0] No console errors or warnings. Evidence: targeted Vitest run clean
- [x] CHK-012 [P1] Error handling implemented. Evidence: registry guards degrade instead of throwing, `fanout-merge-question-shape.vitest.ts`
- [x] CHK-013 [P1] Code follows project patterns. Evidence: helpers live in `lib/deep-loop/` beside the existing modules
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`
- [x] CHK-021 [P0] Manual testing complete. Evidence: the gate replayed over the ten AI Systems research iterations, five fail and five pass as expected
- [x] CHK-022 [P1] Edge cases tested. Evidence: zero and absent counts, foreign and unkeyed delta rows, adjudicated and unranked severities, carried review totals
- [x] CHK-023 [P1] Error scenarios validated. Evidence: a registry list stored as a number no longer aborts the merge
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. Evidence: contract missing from CLI prompt is `cross-consumer`, unenumerated counts is `class-of-bug`, double counting is `algorithmic`, registry shape is `instance-only`
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: research and review both fixed, council and improvement checked with file:line in `implementation-summary.md`
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: `rg` over the runtime names only the gate, the merge and the closeout as users of the moved helpers
- [x] CHK-FIX-004 [P0] Parser and gate fixes include adversarial cases. Evidence: foreign-iteration rows, unranked severity, prose-only Markdown, id-less details
- [x] CHK-FIX-005 [P1] Matrix axes listed. Evidence: `plan.md` affected surfaces
- [x] CHK-FIX-006 [P1] Hostile global-state variant: not applicable, the changed code reads no process-wide state
- [x] CHK-FIX-007 [P1] Evidence pinned to a diff range. Evidence: the uncommitted diff under `runtime/`, committed as one change
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented. Evidence: every record field is type-checked before use
- [x] CHK-032 [P1] Auth/authz working correctly: not applicable, no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate. Evidence: each new rule carries its reason, with no packet or task ids
- [x] CHK-042 [P2] README updated: not needed, no public command or flag changed
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
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-04
<!-- /ANCHOR:summary -->

---
