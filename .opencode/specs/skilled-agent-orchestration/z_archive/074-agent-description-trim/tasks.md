---
title: "Tasks: Agent Description Trim"
description: "24-file mechanical trim across 6 agents and 4 runtime mirrors."
trigger_phrases:
  - "090 tasks"
  - "agent trim tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/074-agent-description-trim"
    last_updated_at: "2026-05-06T14:15:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Tasks authored"
    next_safe_action: "Execute T002 trim script"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-090"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Agent Description Trim

<!-- SPECKIT_LEVEL: 1 -->
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

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold spec folder

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Write `/tmp/trim-agent-descriptions-090.py`
- [x] T003 Apply trims (6 agents × 4 mirrors = 24 files)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Re-run `audit_descriptions.py --json`; confirm headroom ≥ 0
- [x] T005 Spot-check 3 agents retain name token
- [x] T006 Run `validate.sh --strict`
- [x] T007 Write implementation-summary.md
- [x] T008 Save context via generate-context.js

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Audit confirms ≤5,600 chars total

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:cross-refs -->
