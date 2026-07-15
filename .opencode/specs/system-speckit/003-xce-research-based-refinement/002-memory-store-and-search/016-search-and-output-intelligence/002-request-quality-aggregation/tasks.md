---
title: "Tasks: Phase 2: request-quality-aggregation"
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
    packet_pointer: "system-speckit/003-xce-research-based-refinement/002-memory-store-and-search/016-search-and-output-intelligence/002-request-quality-aggregation"
    last_updated_at: "2026-06-17T08:30:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Shipped top-dominant + margin-aware request-quality verdict; tasks superseded"
    next_safe_action: "Rebuild mcp_server dist so the runtime picks up the source change"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/request-quality-aggregation.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-017-002-request-quality-aggregation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: request-quality-aggregation

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

- [x] T001 Locate the existing `assessRequestQuality` gate and the `computeMargin` helper to reuse
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add top-dominant `good` branch (`topScore >= 0.8`) (confidence-scoring.ts)
- [x] T005 Add margin-aware `good` (`topScore >= 0.7` AND (`qualityRatio >= 0.6` OR `topMargin >= 0.15`))
- [x] T006 Cap `qualityRatio` at `min(N, QUALITY_RATIO_HEAD=5)`; add `TOP_DOMINANT_THRESHOLD` constant
- [x] T007 Preserve `weak`/`gap` thresholds (do-not-cite safety net)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 New `request-quality-aggregation.vitest.ts`: good-via-margin, good-top-dominant, recall-no-depress
- [x] T009 Edge cases: weak preserved, gap preserved
- [x] T010 `implementation-summary.md` written
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

