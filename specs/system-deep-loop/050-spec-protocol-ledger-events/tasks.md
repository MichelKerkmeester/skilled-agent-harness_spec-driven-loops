---
title: "Tasks: Give the deep-research ledger its own spec-protocol events"
description: "Ordered tasks for adding the spec-protocol research event stems."
trigger_phrases:
  - "spec protocol ledger events tasks"
  - "packet 050 tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Give the deep-research ledger its own spec-protocol events

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

- [ ] T001 Get the operator's go-ahead for a durable format change
- [ ] T002 Replay the committed research ledger fixtures and record their fingerprints
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add the seven stems, wire types, payload and scope types, and producers (`deep-research-ledger-types.ts`)
- [ ] T004 Add their field rules and scopes (`deep-research-ledger-schema.ts`)
- [ ] T005 Upcast the seven legacy rows instead of pinning them (`legacy-compatibility.ts`)
- [ ] T006 Add no-op reducer cases and the legacy projection (`deep-research-reducer.ts`, `legacy-projections/deep-research-contract.ts`)
- [ ] T007 Name the stems in the spec-check protocol reference
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Test field rules and the round trip per row
- [ ] T009 Run `append-mode-event.cjs` on each row, including the one that failed in phase 15 of packet 041
- [ ] T010 Replay the fixtures again and compare fingerprints
- [ ] T011 Run the whole deep-loop suite
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] A malformed spec-protocol row is refused with a named reason
- [ ] CHK-013 [P1] Code follows the run-now stem precedent
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] The phase 15 failing command succeeds
- [ ] CHK-022 [P1] Unknown folder states and conflict kinds are refused
- [ ] CHK-023 [P1] Each new test fails before the change
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each finding has a class
- [ ] CHK-FIX-002 [P0] Every workflow site that emits a spec-protocol row is inventoried
- [ ] CHK-FIX-003 [P0] Every consumer of the research stem list is inventoried: reducer, projection, checkers
- [ ] CHK-FIX-004 [P0] Field-rule cases cover every enumerated value and a malformed row
- [ ] CHK-FIX-005 [P1] Matrix: seven rows by accept, project and replay
- [ ] CHK-FIX-006 [P1] Committed fixtures replay unchanged
- [ ] CHK-FIX-007 [P1] Evidence pinned to a commit range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Payload fields keep the schema's prose and token limits
- [ ] CHK-032 [P1] No gate bypass variable used
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] No ephemeral ids in code comments
- [ ] CHK-042 [P2] Spec-check protocol reference names the stems
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in the session scratchpad only
- [ ] CHK-051 [P1] scratch/ holds nothing but its placeholder
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 2/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not yet verified
<!-- /ANCHOR:summary -->

---



