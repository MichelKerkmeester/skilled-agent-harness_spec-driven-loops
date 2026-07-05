---
title: "Tasks: Deep-Research Loop Instrumentation"
description: "Task ledger for the shipped inert newInfoRatio detector and reducer test coverage."
trigger_phrases:
  - "deep research loop instrumentation tasks"
  - "newInfoRatio inertness tasks"
  - "novelty signal inert tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/008-speckit-surface-alignment/013-deep-research-loop-instrumentation"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Ship inert novelty detector instrumentation"
    next_safe_action: "Run strict validation for the instrumentation phase"
    completion_pct: 100
---
# Tasks: Deep-Research Loop Instrumentation

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

- [x] T001 Read phase spec and failure framing (`spec.md:9-17`) [15m]
- [x] T002 Confirm shipped acceptance target (`spec.md:19-25`) [10m]
- [x] T003 Locate reducer flatline helper (`reduce-state.cjs:927-968`) [10m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add flat-high `newInfoRatio` inert detector (`reduce-state.cjs:942-962`) [45m]
- [x] T005 Emit `novelty_signal_inert` and warning severity (`reduce-state.cjs:950-955`) [15m]
- [x] T006 Render warning label through `formatTrendAdvisoryEvent` (`reduce-state.cjs:970-978`) [15m]
- [x] T007 Wire advisory generation to reducer histories (`reduce-state.cjs:2594-2604`) [15m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Test flat-high ratios escalate to warning (`deep-research-novelty-inertness.vitest.ts:20-28`) [20m]
- [x] T009 Test flat-low ratios remain advisory (`deep-research-novelty-inertness.vitest.ts:30-36`) [15m]
- [x] T010 Test varied ratios produce no event (`deep-research-novelty-inertness.vitest.ts:38-40`) [15m]
- [x] T011 Confirm reducer suite pass count was preserved in shipped spec evidence (`spec.md:24-25`) [10m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Focused inertness tests and reducer suite evidence recorded.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Summary**: See `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
