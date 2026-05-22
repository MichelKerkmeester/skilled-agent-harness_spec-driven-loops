---
title: "Tasks: 116/007 — Ledger-Led Graph Vocabulary"
description: "Tasks for graph vocabulary projection from stable search ledger semantics."
trigger_phrases:
  - "116 graph vocabulary tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-review-complexity/007-ledger-led-graph-vocabulary"
    last_updated_at: "2026-05-22T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Scaffolded phase 007 tasks."
    next_safe_action: "Start graph vocabulary inventory."
    blockers: []
    key_files: ["plan.md"]
    session_dedup:
      fingerprint: "sha256:1160072000000000000000000000000000000000000000000000000000000000"
      session_id: "116-007-tasks"
      parent_session_id: "116-007-ledger-led-graph-vocabulary"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 116/007 — Ledger-Led Graph Vocabulary

---

<!-- ANCHOR:notation -->
## Task Notation
- `T###` task ID; `[D:T###]` dependency marker.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 Read graph event allow-list and coverage graph tests.
- [ ] T002 Confirm phase 006 graphless fallback tests are green.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T010 Add candidate vocabulary projection.
- [ ] T011 Add or update graph coverage tests.
- [ ] T012 Preserve graphless fallback assertions.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T020 Run graph and graphless tests.
- [ ] T021 Run `validate.sh --strict` on this phase.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] Candidate vocabulary is graph-visible.
- [ ] Text/JSON fallback remains authoritative.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- Parent: `../spec.md`
- Prior phase: `../006-candidate-saturation-and-graphless-gates/spec.md`
<!-- /ANCHOR:cross-refs -->
