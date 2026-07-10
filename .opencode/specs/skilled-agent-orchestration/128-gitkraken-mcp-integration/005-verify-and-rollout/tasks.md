---
title: "Tasks: Phase 5: verify-and-rollout"
description: "Task list for the terminal verification gate."
trigger_phrases:
  - "gitkraken mcp verify tasks"
  - "phase 005 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/128-gitkraken-mcp-integration/005-verify-and-rollout"
    last_updated_at: "2026-07-10T06:21:30Z"
    last_updated_by: "claude"
    recent_action: "Completed the terminal verification gate"
    next_safe_action: "Roll up the parent packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-verify-and-rollout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: verify-and-rollout

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

- [x] T001 Confirm all 4 prior phases report `Status: Complete` (`00{1,2,3,4}-*/spec.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Run `validate.sh --recursive --strict` on the parent and fix findings (`.opencode/specs/skilled-agent-orchestration/128-gitkraken-mcp-integration`)
- [x] T003 [P] Re-check `.utcp_config.json` JSON validity (`.utcp_config.json`)
- [x] T004 [P] Re-check `sk-git/graph-metadata.json` JSON validity (`.opencode/skills/sk-git/graph-metadata.json`)
- [x] T005 Run a live Code Mode discovery check (`list_tools`, `search_tools`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Confirm `validate.sh --recursive --strict` reports 0 errors/0 warnings
- [x] T007 Roll up the parent's `graph-metadata.json` to `status: complete`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
