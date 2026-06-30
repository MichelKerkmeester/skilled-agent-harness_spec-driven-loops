---
title: "Tasks: 095 - sk-code-review playbook execution"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "095 tasks"
importance_tier: "normal"
contextType: "skill-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/078-sk-code-review-playbook-execution"
    last_updated_at: "2026-05-07T13:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored tasks.md"
    next_safe_action: "Dispatch loop"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: 095 - sk-code-review playbook execution

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold packet 095 with Level 1 docs
- [x] T002 Verify opencode CLI + DeepSeek auth
- [x] T003 Inventory 18 sk-code-review scenarios
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 Build dispatch script that loops 18 scenarios sequentially with per-scenario fixture
- [ ] T011 Run dispatch loop; capture per-scenario logs to `/tmp/095-CR-NNN.log`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 Orchestrator reads each transcript and assigns PASS/PARTIAL/FAIL/SKIP verdict per playbook pass/fail criteria
- [ ] T021 Build aggregated results table for user
- [ ] T022 Write implementation-summary.md with verdict breakdown + key observations
- [ ] T023 Update graph-metadata.json (095 status complete) + track parent metadata
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] 18 scenarios dispatched
- [ ] 18 verdicts assigned
- [ ] Aggregated results table delivered to user
- [ ] Spec packet validates clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source playbook**: `.opencode/skills/sk-code-review/manual_testing_playbook/`
<!-- /ANCHOR:cross-refs -->
