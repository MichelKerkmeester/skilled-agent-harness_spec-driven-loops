---
title: "Tasks: Phase 2: utcp-config-registration"
description: "Task list for registering the gitkraken manual in .utcp_config.json."
trigger_phrases:
  - "gitkraken utcp config tasks"
  - "phase 002 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/014-gitkraken-mcp-integration/002-utcp-config-registration"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude"
    recent_action: "Authored the phase task list ahead of implementation"
    next_safe_action: "Apply the .utcp_config.json edit"
    blockers: []
    key_files:
      - ".utcp_config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-utcp-config-registration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: utcp-config-registration

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

- [x] T001 Read `.utcp_config.json` before editing (`.utcp_config.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add the `gitkraken` `manual_call_templates` entry per `spec.md` REQ-001 (`.utcp_config.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T003 Validate JSON parses (`python3 -c "import json; json.load(open('.utcp_config.json'))"`)
- [x] T004 Confirm `git diff` is scoped to the single new entry
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
