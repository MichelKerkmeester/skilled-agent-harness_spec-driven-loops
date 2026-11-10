---
title: "Tasks: Phase 4: routing-parity-ci"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "routing parity ci tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: routing-parity-ci

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Reproduce the ratchet baseline with no built skill graph: 2 of 6 failed (local-native-divergence-ratchet.vitest.ts)
- [x] T002 Show a calendar-only top-1 flip: at 2027-01-01 rr-iter3-166 flips (local-native-divergence-ratchet.vitest.ts)
- [x] T003 [P] Measure every scoring surface's overlap with the holdout (holdout-independent.vitest.ts)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 R8 regime header (local-native-divergence-ratchet.vitest.ts)
- [x] T005 R3 pinned clock plus a freshly indexed skill graph read by both scorers (local-native-divergence-ratchet.vitest.ts)
- [x] T006 R5 declared scoring surfaces, allowed-overlap map and corpus-reader scan (holdout-independent.vitest.ts)
- [x] T007 R1 and R5 blocking CI steps with an explicit Python setup (.github/workflows/routing-registry-drift.yml)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Before and after test matrix T1 to T7 (implementation-summary.md)
- [x] T009 Five-iteration deep review and fixes (review/)
- [x] T010 Ledger, changelog and version bump (implementation-summary.md, system-skill-advisor changelog)
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



