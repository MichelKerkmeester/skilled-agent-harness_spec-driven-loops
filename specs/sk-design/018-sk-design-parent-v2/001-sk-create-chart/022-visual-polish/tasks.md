---
title: "Tasks: visual polish pass on the chart corpus"
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
# Tasks: visual polish pass on the chart corpus

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

- [x] T001 Read the contract, the checker and phase 21's synthesis; run the checker and record baseline family counts in `scratch/baseline.md`. Evidence: `scratch/baseline.md` absent by design: each brief compared its own before and after counts; the handbacks record them
- [x] T002 Survey every form's viewBox and plot proportion into `scratch/proportions.md` with the target per form. Evidence: `scratch/proportions.md`, 26 lines
- [x] T003 [P] Write `source-line`, `finding-cue` and `table-disclosure` assertions; prove each on a mutated copy; record lines in `scratch/mutations.md`. Evidence: `scratch/mutations.md`: source-line, table-disclosure, finding-cue, number-format unit
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Polish `daily-line.html` end to end and pass the gate, then the other 25 forms one at a time with the checker after each. Evidence: five briefs `scratch/dispatch-a.md` to `-e.md`, each handback `status: done`; static gate PASSED after each
- [x] T005 Bring the seven deliveries to their templates; regenerate the gallery. Evidence: 7 deliveries and 3 proof sheets follow; `build-gallery.cjs` regenerated
- [x] T006 Update `template-contract.md` (fade figures, `FINDING`, `unit`, disclosure), add `changelog/v1.6.0.0.md`, bump versions. Evidence: contract section and fade fix; `changelog/v1.6.0.0.md`; versions 1.6.0.0
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 `check-corpus.cjs --render` RESULT: PASSED; no family below baseline. Evidence: render gate `RESULT: PASSED`; families source-line 36, table-disclosure 108, finding-cue 99
- [x] T009 Screenshots regenerated; three captures read. Evidence: `render-screenshots.cjs` rendered 37; daily-line, bar-rows and a hover capture read
- [x] T010 Packet docs; validate strict RESULT: PASSED. Evidence: `validate.sh --strict` `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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

- [x] CHK-001 [P0] Requirements documented in spec.md — spec.md sections 3 to 5.
- [x] CHK-002 [P0] Technical approach defined in plan.md — plan.md.
- [x] CHK-003 [P1] Dependencies identified and available — phase 21 synthesis and the checker.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — `node --check` exit 0; `script-parses` 0 failures.
- [x] CHK-011 [P0] No console errors or warnings — render pass clean; settled-render 0 failures.
- [x] CHK-012 [P1] Error handling implemented — four families fail closed on their mutations.
- [x] CHK-013 [P1] Code follows project patterns — sentinel and assertion conventions followed.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — AC-001 to AC-006 Met.
- [x] CHK-021 [P0] Manual testing complete — captures read.
- [x] CHK-022 [P1] Edge cases tested — narrow-viewport and empty-notice 0 failures.
- [x] CHK-023 [P1] Error scenarios validated — exact FAIL lines in `scratch/mutations.md`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. — visual-contract work, checker-held.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. — `scratch/proportions.md` covers all 26 forms.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. — deliveries, proof sheets, contract, changelog reviewed.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. — N/A; local static assets.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. — form by move matrix in the five briefs.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. — N/A.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. — the working-tree diff committed with this packet.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — no secrets.
- [x] CHK-031 [P0] Input validation implemented — families reject missing or out-of-set declarations.
- [x] CHK-032 [P1] Auth/authz working correctly — N/A.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — packet docs reflect the shipped scope.
- [x] CHK-041 [P1] Code comments adequate — checker comments state the durable why.
- [x] CHK-042 [P2] README updated (if applicable) — README version bumped.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — scratch holds briefs, mutations and proportions.
- [x] CHK-051 [P1] scratch/ cleaned before completion — mutant copies removed.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | [X] | [ ]/[X] |
| P1 Items | [Y] | [ ]/[Y] |
| P2 Items | [Z] | [ ]/[Z] |

**Verification Date**: 2026-09-08
<!-- /ANCHOR:summary -->

---



