---
title: "Tasks: Review gateway accepts the canonical iteration record"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "review gateway iteration tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Review gateway accepts the canonical iteration record

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

- [x] T001 Reproduce the refusal on main with a real record from the 2026-10-02 hook review (exit 1, "Unrecognized event format")
- [x] T002 Map every registration site of a review stem; check the five real records against the forbidden-field rule
- [x] T003 Baseline: typecheck clean; affected suites 259 passed, 3 failed (render-command-contract); envelope and ledger suites 110 passed
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 G1 register `deep_review.iteration_recorded` and unwrap it in the projection (types, schema, reducer, projection, tests)
- [x] T005 G2 gateway wraps a bare review iteration record; CLI tests; feature-catalog sentence
- [x] T006 G3 compare canonical bytes directly (`canonical-json.ts`, both authorized-ledger sites, tests)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 All five real records round-trip through the gateway and project back deep-equal
- [x] T008 Typecheck and affected suites from the final state
- [x] T009 validate.sh --strict on this packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] A real record that main refuses records here
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Found by**: `specs/sk-git/032-template-driven-message-enforcement/001-git-hook-review-fixes/review/review-report.md` (worktree 075)
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
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Typecheck clean (tsc exit 0)
- [x] CHK-011 [P0] The new stem is appended last; sealed-artifact indices unchanged (sealed suite passes)
- [x] CHK-012 [P1] The gateway emits the stem through a `stem:` key the census reads (census suite passes)
- [x] CHK-013 [P1] Byte comparison semantics unchanged: equal, length-different and element-different cases tested
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (acceptance-criteria.md, 6 of 6 Met)
- [x] CHK-021 [P0] Real records: 5 of 5 recorded and projected deep-equal
- [x] CHK-022 [P1] Non-iteration review rows still refused with the original message
- [x] CHK-023 [P1] No new failure beyond the baseline (see implementation-summary.md for the one flaky concurrency test)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding classes: gateway refusal is cross-consumer (agent, template, YAML all send the record); byte comparison is class-of-bug (every mode's events).
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg "canonicalJson\(.*[Bb]ytes" lib` found exactly the two fixed sites.
- [x] CHK-FIX-003 [P0] Consumer inventory: reducer, projection, census, schema and gateway tests all updated for the new stem.
- [x] CHK-FIX-004 [P0] Adversarial: records over 10 KB, a non-iteration row, forbidden-field check on real records.
- [x] CHK-FIX-005 [P1] Matrix axes: record size (small, 10 to 23 KB), row type (iteration, config), mode (review).
- [x] CHK-FIX-006 [P1] Real data exercised: the five iteration records from the 2026-10-02 hook review.
- [x] CHK-FIX-007 [P1] Evidence pinned to base `03afeb4552`; the commit SHA is recorded at commit time.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Records still pass the forbidden-mutable-field rule
- [x] CHK-032 [P1] Structural limits on the event itself are unchanged; only the byte comparison stopped re-validating bytes as JSON
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments carry no ephemeral ids
- [x] CHK-042 [P2] Gateway feature-catalog entry names the accepted shape
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in the session scratchpad only
- [x] CHK-051 [P1] scratch/ holds nothing but its placeholder
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-02
<!-- /ANCHOR:summary -->

---
