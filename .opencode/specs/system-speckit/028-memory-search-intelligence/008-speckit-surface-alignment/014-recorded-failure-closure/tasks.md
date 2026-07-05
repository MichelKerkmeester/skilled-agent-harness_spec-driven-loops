---
title: "Tasks: Recorded-Failure Closure"
description: "Task ledger for the shipped cap reconciliation, constitutional rule, surfacer, and RED/GREEN test."
trigger_phrases:
  - "recorded failure closure tasks"
  - "unactioned recorded failure tasks"
  - "recorded failure must route tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/008-speckit-surface-alignment/014-recorded-failure-closure"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Ship recorded-failure closure route"
    next_safe_action: "Run strict validation for the closure phase"
    completion_pct: 100
---
# Tasks: Recorded-Failure Closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read failure-class framing (`spec.md:9-21`) [15m]
- [x] T002 Read acceptance criteria (`spec.md:23-25`) [10m]
- [x] T003 Locate deep-research strategy cap lines (`../../research/deep-research-strategy.md:56`, `../../research/deep-research-strategy.md:135`) [10m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Reconcile strategy cap text to operator stop at iteration 20 (`../../research/deep-research-strategy.md:56`, `../../research/deep-research-strategy.md:135`) [20m]
- [x] T005 Author constitutional rule (`recorded-failure-must-route.md:21-33`) [30m]
- [x] T006 Add failure and remediation marker sets (`unactioned-recorded-failure-audit.mjs:10-33`) [25m]
- [x] T007 Add unactioned-failure scanner (`unactioned-recorded-failure-audit.mjs:35-49`) [25m]
- [x] T008 Add CLI reporting and exit behavior (`unactioned-recorded-failure-audit.mjs:51-76`) [20m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Test unrouted FAIL surfaces (`unactioned-recorded-failure-audit.test.mjs:5-9`) [10m]
- [x] T010 Test routed FAIL clears (`unactioned-recorded-failure-audit.test.mjs:11-21`) [10m]
- [x] T011 Test routed contradiction clears (`unactioned-recorded-failure-audit.test.mjs:23-30`) [10m]
- [x] T012 Test clean text yields no hits (`unactioned-recorded-failure-audit.test.mjs:32-39`) [10m]
- [x] T013 Register the rule in constitutional README [10m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Four assertion cases recorded as passing in shipped spec evidence.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Summary**: See `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
