---
title: "Tasks: AGENTS.md delivery prefix"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "agents md delivery prefix tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: AGENTS.md delivery prefix

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

- [x] T001 Confirm the `.skilled` path of `check-rule-copies.js` and the CI step that runs it (`.github/workflows/rule-canary-sync.yml`)
- [x] T002 [P] Inventory every reference to an `AGENTS.md` section number (`rg -n 'AGENTS.md.{0,3}§' .skilled "REPO RULES.md"`)
- [x] T003 [P] Measure the must-carry set in bytes (recorded in `plan.md` ADR-001 instead of a scratch file)
- [x] T004 Record ADR-001's move list in `plan.md` from the T003 budget
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Restructure `AGENTS.md` per ADR-001 (`AGENTS.md`)
- [x] T006 Add the delivery-prefix guard and the 32,768-byte ceiling (`check-rule-copies.js`)
- [x] T007 Add a fixture with an anchor past the cut and a fixture over 32,768 bytes (`check-rule-copies.test.sh`)
- [x] T008 Update any section reference found in T002 (`REPO RULES.md`): none needed, every section kept its number
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the guard, `check-rule-copies.test.sh`, `sync-gate1-pointers.cjs --check` and the two vitest suites
- [x] T010 Run a live Devin probe that quotes the §8 load line
- [x] T011 Write the before and after clause table into `implementation-summary.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Predecessor handoff criteria met
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Changed scripts pass their existing lint or syntax checks
- [x] CHK-011 [P1] New code follows the surrounding file's patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Must-carry anchor list in the guard matches REQ-001
- [x] CHK-021 [P0] Guard fails on the past-cut fixture
- [x] CHK-022 [P0] Before and after table shows no change of meaning
- [x] CHK-023 [P1] Total size at or under 32,768 bytes
- [x] CHK-024 [P1] Gate 1 sync and workflow invariance pass
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Consumer inventory in `plan.md` affected surfaces is complete
- [x] CHK-FIX-002 [P1] Evidence is pinned to a commit SHA, not a moving branch range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No transcript text, secret or credential in any committed artifact
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md, plan.md and tasks.md synchronized
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temporary files in scratch/ only, cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 6 | 6/6 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-10-04
<!-- /ANCHOR:summary -->

---
