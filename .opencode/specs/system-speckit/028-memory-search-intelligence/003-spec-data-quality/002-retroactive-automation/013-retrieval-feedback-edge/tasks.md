---
title: "Tasks: B3 Retrieval-Learning Feedback Edge"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "retrieval feedback edge tasks"
  - "impression capture tasks"
  - "recall gap detector tasks"
  - "refinement queue tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/002-retroactive-automation/013-retrieval-feedback-edge"
    last_updated_at: "2026-07-04T17:12:09.476Z"
    last_updated_by: "markdown-agent"
    recent_action: "Created PLANNED retrieval-feedback-edge tasks"
    next_safe_action: "Start T001 grep of the result-assembly seam"
    blockers: []
    key_files:
      - "tasks.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-21-tasks-005-013-retrieval-feedback-edge"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: B3 Retrieval-Learning Feedback Edge

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [ ] T001 Grep the result-assembly seam and the floor constant to pin the edit points (`.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts`)
- [ ] T002 Add the `refinement_queue` table DDL mirrored on the `learned_feedback_audit` governance columns (`.opencode/skills/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts`)
- [ ] T003 [P] Register the default-off `SPECKIT_RETRIEVAL_GAP_DETECT` checker in `search-flags.ts` and acknowledge the token in the `flag-ceiling.vitest.ts` `ACKNOWLEDGED_UNCEILINGED_FLAGS` default-off list, not `ALL_SPECKIT_FLAGS` (`.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts`, `.opencode/skills/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add aggregate impression capture recording `impression_count` and per-doc `min_rank_seen` before truncation (`.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`)
- [ ] T005 Build the detector that splits never-retrieved docs into recall-gap versus below-floor edges by `min_rank_seen` (`.opencode/skills/system-spec-kit/mcp_server/lib/search/detect-retrieval-gaps.ts`)
- [ ] T006 Queue edge-tagged rows report-only and register the edge-a action suggest-only with the edge-b advisory C2 marker (`.opencode/skills/system-spec-kit/mcp_server/lib/search/detect-retrieval-gaps.ts`)
- [ ] T007 Add no-op and degrade-to-no-op error handling on capture and queue write (`.opencode/skills/system-spec-kit/mcp_server/lib/search/detect-retrieval-gaps.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Assert the flag-off path is byte-for-byte unchanged and the capture is never entered (`.opencode/skills/system-spec-kit/mcp_server/tests/detect-retrieval-gaps.vitest.ts`)
- [ ] T009 Assert edge classification, report-only mutation guard, and the four governance safeguards (`.opencode/skills/system-spec-kit/mcp_server/tests/detect-retrieval-gaps.vitest.ts`)
- [ ] T010 Update spec, plan, tasks, and checklist to the shipped state
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
