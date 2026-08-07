---
title: "Tasks: Phase 11: agent-lane-note"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "agent lane note tasks"
  - "lane awareness mirror tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/007-deep-agent-improvement-benchmark-mode/011-add-agent-lane-awareness-note"
    last_updated_at: "2026-05-29T07:36:07Z"
    last_updated_by: "build-agent"
    recent_action: "Tasks filled for Lane awareness note across 4 mirrors"
    next_safe_action: "Edit 4 mirror notes byte-identical then validate"
    blockers: []
    key_files:
      - ".opencode/agents/deep-agent-improvement.md"
      - ".claude/agents/deep-agent-improvement.md"
      - ".gemini/agents/deep-agent-improvement.md"
      - ".codex/agents/deep-agent-improvement.toml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/011-add-agent-lane-awareness-note"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 11: agent-lane-note

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

- [x] T001 Locate the Mode awareness note in all 4 mirrors
- [x] T002 Confirm pre-edit byte-identity via md5
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Edit Lane awareness note in canonical .opencode agent (.opencode/agents/deep-agent-improvement.md)
- [x] T004 [P] Apply identical note to .claude mirror (.claude/agents/deep-agent-improvement.md)
- [x] T005 [P] Apply identical note to .gemini mirror (.gemini/agents/deep-agent-improvement.md)
- [x] T006 [P] Apply identical prose to .codex TOML string (.codex/agents/deep-agent-improvement.toml)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 md5-compare the Lane awareness line across all 4 mirrors
- [x] T008 Confirm no "Mode awareness" string remains
- [ ] T009 Run validate.sh --strict until PASSED
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
