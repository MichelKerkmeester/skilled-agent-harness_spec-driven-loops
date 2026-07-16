---
title: "Tasks: Phase 5: cosine-topn-reorder"
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
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/016-search-and-output-intelligence/005-cosine-topn-reorder"
    last_updated_at: "2026-06-17T09:15:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Shipped cosine-primary top-N head reorder; tasks superseded by impl-summary"
    next_safe_action: "Measure precision@1 on a labeled set (research step b) to validate the lift"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/cosine-topn-reorder.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-017/005-cosine-topn-reorder"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does the head reorder improve precision@1 in practice? Unmeasured — no labeled set yet."
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: cosine-topn-reorder

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

- [x] T001 Locate the final-ordering insertion point (`enrichFusedResults` after `truncateToBudget`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 `reorderTopNByCosine` helper + `COSINE_TOPN_REORDER_DEPTH` (hybrid-search.ts)
- [x] T005 Apply the gated reorder after `truncateToBudget`; skip in `evaluationMode`
- [x] T006 `isCosineTopnReorderEnabled()` default-ON flag (search-flags.ts)
- [x] T007 Stable sort with explicit index tiebreaker; lexical fallback to effective score
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 `cosine-topn-reorder.vitest.ts` (9/9: promotion, tie, invariants, flag)
- [x] T009 Update the degree-fusion regression assertion to cosine-correct order
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

