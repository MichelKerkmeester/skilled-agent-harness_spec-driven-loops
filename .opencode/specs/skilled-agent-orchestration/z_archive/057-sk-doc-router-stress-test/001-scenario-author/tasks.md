---
title: "Tasks: Phase 1: scenario-author"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases: ["071/001 tasks", "scenario-author tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "071-sk-doc-router-stress-test/001-scenario-author"
    last_updated_at: "2026-05-05T12:30:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Authored tasks.md while cli-copilot scaffolds 16 files"
    next_safe_action: "Wait for copilot, validate, commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase1-authoring"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: scenario-author

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create 5 category dirs under `.opencode/skills/sk-doc/manual_testing_playbook/`
- [x] T002 Read sk-doc/SKILL.md §2 RESOURCE_MAP (11 intents identified)
- [x] T003 Identify sk-code/manual_testing_playbook/01--surface-detection/001-webflow-detection.md as template
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Dispatch cli-copilot with batch authoring prompt (15 scenarios + index)
- [ ] T005 Wait for cli-copilot completion (monitor task armed)
- [ ] T006 Verify 15 scenario .md files present across 5 categories (3 each)
- [ ] T007 Verify manual_testing_playbook.md index present
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Spot-read 3 random scenarios; confirm format matches sk-code template
- [ ] T009 Verify each scenario references valid intent from sk-doc RESOURCE_MAP
- [ ] T010 Confirm Cross-CLI Variants section lists codex/copilot/opencode in each scenario
- [ ] T011 Stage 16 files + 001 spec docs
- [ ] T012 Commit: `feat(sk-doc): scaffold manual_testing_playbook (071/001)`
- [ ] T013 Confirm `git branch --show-current = main`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001–T013 marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] One commit on main; Phase 2 (matrix-execute) unblocked
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md` (post-execution)
- **Parent Spec**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
