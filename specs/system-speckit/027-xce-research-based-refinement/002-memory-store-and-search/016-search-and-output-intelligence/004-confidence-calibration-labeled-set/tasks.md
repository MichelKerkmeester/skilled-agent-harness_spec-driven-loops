---
title: "Tasks: Phase 4: confidence-calibration-labeled-set"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/016-search-and-output-intelligence/004-confidence-calibration-labeled-set"
    last_updated_at: "2026-06-17T09:05:00Z"
    last_updated_by: "implementer"
    recent_action: "Shipped (A) 0.45/0.55 rebalance + (B) flag-gated calibration infra; tasks superseded"
    next_safe_action: "Collect labeled live traffic, refit, validate before enabling calibration flag"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-calibration.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/confidence-calibration.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-027-002-017-004-confidence-calibration-labeled-set"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: confidence-calibration-labeled-set

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

- [x] T001 Locate the inline 0.6/0.4 blend in `confidence-scoring.ts`; confirm S2 must stay intact
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 (A) Rebalance `value` to `WEIGHT_HEURISTIC = 0.45` / `WEIGHT_SCORE_PRIOR = 0.55` constants (default-ON)
- [x] T005 (B) Isotonic `fitCalibration`/`applyCalibration` + labeled-set + model loaders (confidence-calibration.ts)
- [x] T006 (B) `isConfidenceCalibrationEnabled()` (default-OFF) + lazy model load + `maybeCalibrate()` hook
- [x] T007 (B) Generate corpus-derived proxy labeled set + demo model under `assets/`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 `confidence-calibration.vitest.ts`: fit/apply, loader validation, default-OFF wiring guarantee
- [x] T009 Edge cases: existing absolute-relevance + d5 assertions stay green under the new band
- [x] T010 `implementation-summary.md` written (real judged labeled set is the documented follow-up)
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

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->

