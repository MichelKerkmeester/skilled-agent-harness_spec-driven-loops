---
title: "Tasks: mark policies, tooltip indicator kinds, reference lines and cursor guides"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: mark policies, tooltip indicator kinds, reference lines and cursor guides

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

- [x] T001 Read the research angles two and three, the contract and the checker; record baseline counts
- [x] T002 Write the four families and prove each on a mutated copy
- [x] T003 Declare MARKS and indicators across the forms, splitting signed areas where zero is meaningful
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add REFERENCE to the eleven cartesian forms; bullet was not the consumer the plan expected, so daily-line carries the worked line instead
- [x] T005 Enable the guide on daily-line, bar-line-composed and the orders delivery; stacked-area declared false because its card opens on a band
- [x] T006 Contract, changelog v1.9.0.0, versions
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Render gate, captures, packet docs, validate strict
- [x] T009 Mutations recorded for every new family
- [x] T010 Packet docs; validate strict RESULT: PASSED
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

- [x] CHK-001 [P0] Requirements documented in spec.md — spec.md scope and REQ-001/002
- [x] CHK-002 [P0] Technical approach defined in plan.md — plan.md; the reference-line consumer changed from bullet, recorded in the summary
- [x] CHK-003 [P1] Dependencies identified and available — Chrome at the corpus path; no new dependency
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — `node --check` on check-corpus.cjs; `script-parses` 75 assertions across the corpus
- [x] CHK-011 [P0] No console errors or warnings — rendered DOM read under `--dump-dom`; the one runtime error found, `y is not defined`, was fixed by moving the drawing inside the figure block
- [x] CHK-012 [P1] Error handling implemented — a guide with no element is a null and returns early; an empty REFERENCE draws nothing
- [x] CHK-013 [P1] Code follows project patterns — four families follow the existing checker shape and are registered beside the others
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — AC-001 and AC-002 Met with named evidence
- [x] CHK-021 [P0] Manual testing complete — three captures read, plus two synthetic-hover captures for the guide and the card kinds
- [x] CHK-022 [P1] Edge cases tested — eleven mutated copies, one per assertion, all fail
- [x] CHK-023 [P1] Error scenarios validated — a declaration the code ignores, a guide on a sparse form, and a form carrying guide code it does not declare all error
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. — class-of-bug: the card row token was wrong wherever a card lists two series
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. — grep of TIP_ROWS against CHART_SERIES found the two multi-series cards; both fixed
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. — the legend chip and the card row are the two consumers of `indicator`; both read it
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. — not applicable: no security, path, parser or redaction surface in this packet
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. — four families by three or four assertions each, listed in the verification table
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. — not applicable: no process-wide state is read
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. — evidence is the corpus run and the mutation ledger, both reproducible from the tree
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — no secrets; the corpus is self-contained HTML
- [x] CHK-031 [P0] Input validation implemented — the vocabularies are closed sets and the families reject anything outside them
- [x] CHK-032 [P1] Auth/authz working correctly — not applicable: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — spec Complete, tasks closed, summary written
- [x] CHK-041 [P1] Code comments adequate — every declaration carries its why, and the shadowing of MARKS is documented where it bites
- [x] CHK-042 [P2] README updated (if applicable) — README and SKILL.md carry version 1.9.0.0
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — briefs, mutation ledger and mutants under scratch/
- [x] CHK-051 [P1] scratch/ cleaned before completion — mutant.html deleted after each proof; the brief that was actually used and the mutation ledger are kept, the briefs for the stalled lanes removed
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-09
<!-- /ANCHOR:summary -->

---



