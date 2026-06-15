---
title: "Tasks: sk-interface-design + mcp-open-design integration test (MiMo vs DeepSeek)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "design skill integration test tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-design-skill-integration-test"
    last_updated_at: "2026-06-15T07:15:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Both seats dispatched; collection and comparison pending"
    next_safe_action: "Collect designs, compare, write implementation-summary"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/154-design-skill-integration-test/scratch/brief-deepseek.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-154-design-skill-integration-test"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-interface-design + mcp-open-design integration test (MiMo vs DeepSeek)

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

- [x] T001 Confirm Open Design app state and the MiMo/DeepSeek provider slugs
- [x] T002 Create packet 154 and write the identical model brief
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Dispatch the MiMo v2.5 Pro design seat
- [x] T004 [P] Dispatch the DeepSeek v4 Pro design seat
- [ ] T005 Collect the six HTML designs and the two NOTES files
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Open each HTML offline and confirm self-contained rendering
- [ ] T007 Compare MiMo versus DeepSeek per brief and overall
- [ ] T008 Write the comparison verdict into implementation-summary.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Six designs collected and verified offline
- [ ] Comparison verdict written
- [x] No `[B]` blocked tasks remaining
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
