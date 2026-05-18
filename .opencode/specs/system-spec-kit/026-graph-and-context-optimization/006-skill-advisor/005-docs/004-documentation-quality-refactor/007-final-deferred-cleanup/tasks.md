---
title: "Tasks: 007-final-deferred-cleanup"
description: "T001-T012 covering pre-flight, scaffold, dispatch, verify."
trigger_phrases:
  - "007 deferred final tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/007-final-deferred-cleanup"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Authored tasks"
    next_safe_action: "Compose dispatch prompt"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "007-tasks"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
# Tasks: 007-final-deferred-cleanup

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

- [x] T001 Pre-flight: opencode v1.15.1 + DeepSeek API configured + self-invocation guard pass + recovery baseline recorded
- [x] T002 Scaffold 007 packet (6 files)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Compose dispatch prompt with 4 RM-8 mitigation layers
- [ ] T004 Dispatch `opencode run` with deepseek/deepseek-v4-pro in background
- [ ] T005 Monitor dispatch via until-loop
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Post-dispatch git diff scope check (only ALLOWED WRITE PATHS modified)
- [ ] T007 Semicolon count re-grep (expect ≤ 27 in authored files)
- [ ] T008 Verify 4 new ref docs exist + pass sk-doc validate
- [ ] T009 Sanity-check deferred-decisions.md contains F4/F6/F35/F36/F37 entries
- [ ] T010 Spot-check 5 random files for grammar regressions
- [ ] T011 Strict-validate 007 packet
- [ ] T012 Refresh parent metadata + fill 007 implementation-summary
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] T006 + T007 + T011 green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source-of-truth deferred catalog**: 006 implementation-summary.md Known Limitations + 001 research.md Open Questions
<!-- /ANCHOR:cross-refs -->
