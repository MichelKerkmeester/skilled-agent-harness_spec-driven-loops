---
title: "Tasks: Fingerprint Docset Enforcement"
description: "Work items and the verification protocol for making the drift marker mandatory and stamping the fleet without absorbing drift."
trigger_phrases:
  - "fingerprint docset tasks"
  - "stamp migration tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Fingerprint Docset Enforcement

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:notation -->
## Task Notation

`[P0]` blocks completion · `[P1]` required or explicitly deferred · `[P2]` optional.
A task is done when its evidence cell names something that was actually observed.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [P0] Capture the baseline counts: total packets, packets with a fingerprint, packets with a marker
- [ ] T002 [P0] Reproduce the skip on a copied packet and record the observed silence as the negative control
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [P0] Write the stamp-only migration; verify on a sample that each changed file differs by exactly one added key
- [ ] T004 [P0] Run the migration across the tree; confirm the fingerprint-without-marker count reaches 0
- [ ] T005 [P0] Add the schema refinement requiring the marker when a fingerprint is present
- [ ] T006 [P0] Stop the integrity rule skipping on an absent marker, keeping the older-present skip
- [ ] T007 [P1] Invert the test case that pins "absent generation skips" and add the presence contract cases
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 [P0] Run every new case against pre-change code and confirm it fails
- [ ] T009 [P0] Confirm a stamped packet with real drift now reports a mismatch
- [ ] T010 [P1] Run the migration a second time and confirm an empty diff
- [ ] T011 [P1] Record the exposed mismatch count and hand it on rather than repairing it here
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Every P0 task above is checked with observed evidence, every row in `acceptance-criteria.md`
is `Met`, `Waived` or `Superseded`, and `validate.sh --strict` reports `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements and scope: `spec.md`
- Ordering and rollback: `plan.md`
- Closure gate: `acceptance-criteria.md`
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Ordering and rollback defined in plan.md
- [ ] CHK-003 [P1] Baseline counts captured before any file is written
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Migration writes only the marker key
- [ ] CHK-011 [P0] Schema refinement leaves a packet with neither field legal
- [ ] CHK-012 [P1] No new comment embeds an artifact identifier
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every new case observed failing against pre-change code
- [ ] CHK-021 [P0] Older-present marker still skips
- [ ] CHK-022 [P0] Deleting the marker is a failure, not silence
- [ ] CHK-023 [P1] Migration idempotence proven by a second run
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | [ ]/7 |
| P1 Items | 3 | [ ]/3 |
| P2 Items | 0 | [ ]/0 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->
