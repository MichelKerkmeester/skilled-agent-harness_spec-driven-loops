---
title: "Tasks: Phase 4: closeout"
description: "T###: validate + metadata refresh + commit"
trigger_phrases: ["071/004 tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "071-sk-doc-router-stress-test/004-closeout"
    last_updated_at: "2026-05-05T15:50:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase 4 tasks authored"
    next_safe_action: "Run jq metadata refresh + commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase4-closeout"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: closeout

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
- [x] T001 validate.sh --strict pre-check PASSED
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T002 Author 004 spec docs (spec, plan, tasks, implementation-summary)
- [ ] T003 jq edit parent graph-metadata.json
- [ ] T004 jq edit child graph-metadata.json files (4 children)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T005 validate.sh --strict re-run exits 0
- [ ] T006 Final commit on main
- [ ] T007 git branch shows main; no surviving 071-* branch
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] All tasks marked [x]
- [ ] Packet 071 final commit on main
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Parent Spec**: See `../spec.md`
- **Headline output**: `../003-synthesize/review-report.md`
<!-- /ANCHOR:cross-refs -->
