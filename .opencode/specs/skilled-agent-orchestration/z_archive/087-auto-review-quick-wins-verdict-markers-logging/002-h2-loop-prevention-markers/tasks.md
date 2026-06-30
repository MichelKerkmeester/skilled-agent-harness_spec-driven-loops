---
title: "Tasks: Phase 2 H-2 Loop-prevention header markers"
description: "Atomic task ledger for h2-markers phase."
trigger_phrases:
  - "108 phase h2-markers tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/087-auto-review-quick-wins-verdict-markers-logging/002-h2-loop-prevention-markers"
    last_updated_at: "2026-05-16T07:00:00Z"
    last_updated_by: "claude-opus-4-7-108-scaffold"
    recent_action: "phase_tasks_authored"
    next_safe_action: "await_council"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-16-108-h2-markers-tasks"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2 H-2 Loop-prevention header markers

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 [B] Await council verdict in `../ai-council/council-report.md`
- [ ] T002 Verify target files present
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T003 Apply edits per spec.md §3 SCOPE Files-to-Change table
- [ ] T004 Commit each file edit (or batched, per operator)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T005 Run smoke tests per spec.md §5 SUCCESS CRITERIA
- [ ] T006 Strict validate this packet + phase parent
- [ ] T007 Commit + push
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] All edits applied
- [ ] Smoke tests green
- [ ] Strict validate exit 0
- [ ] Pushed to main
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- `spec.md` — phase requirements
- `plan.md` — implementation sequence
- `../spec.md` — phase parent
- `../ai-council/council-report.md` — gate
- Source teaching: `106/research/review-report.md`
<!-- /ANCHOR:cross-refs -->
