---
title: "Tasks: Phase 1: token-budget-truncation-safety [template:level_1/tasks.md]"
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
    packet_pointer: "027/002/017/001-token-budget-truncation-safety"
    last_updated_at: "2026-06-17T08:15:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Shipped Problem 3 token-budget truncation safety; tasks superseded by impl-summary"
    next_safe_action: "Orchestrator review + commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/token-budget-skip-and-floor.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-027-002-017-001-token-budget-truncation-safety"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: token-budget-truncation-safety

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

- [x] T001 Capture baseline search-test failures before the change
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Skip-and-continue packing in `truncateToBudget` (hybrid-search.ts)
- [x] T005 `min(limit, 3)` floor + summary-first overflow routing (hybrid-search.ts)
- [x] T006 `lowSignal` weak-query budget floor (dynamic-token-budget.ts)
- [x] T007 Re-sort accepted set after promotion; preserve highest-score-first contract
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 New `token-budget-skip-and-floor.vitest.ts` proves skip + floor + small-limit cap
- [x] T009 Edge cases: no-limit ≥1 fallback; `includeContent=false` overflow
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

