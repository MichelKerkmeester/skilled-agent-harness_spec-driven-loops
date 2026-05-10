---
title: "Tasks: 075 cli-copilot Hallucination Caveat"
description: "T###: edit, verify, commit, push"
trigger_phrases: ["075 tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/075-cli-copilot-hallucination-caveat"
    last_updated_at: "2026-05-05T17:55:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Tasks authored"
    next_safe_action: "Commit + push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "075-final"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 075 cli-copilot Hallucination Caveat

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Locate cli-copilot/SKILL.md "When NOT to Use" section
- [x] T002 Locate sk-doc/SKILL.md §2 "Resource Domains" section
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T003 Edit cli-copilot/SKILL.md: append routing-trace caveat bullet
- [x] T004 Edit sk-doc/SKILL.md: insert cross-CLI consumption note in §2
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T005 grep "Routing-trace tasks where the caller" in cli-copilot/SKILL.md
- [x] T006 grep "Cross-CLI consumption note" in sk-doc/SKILL.md
- [ ] T007 validate.sh --strict on 075 exits 0
- [ ] T008 Commit + push on main
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] Both caveats land
- [ ] Commit + push
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Predecessor**: 072 review-report-v2.md (P1-072-001)
<!-- /ANCHOR:cross-refs -->
