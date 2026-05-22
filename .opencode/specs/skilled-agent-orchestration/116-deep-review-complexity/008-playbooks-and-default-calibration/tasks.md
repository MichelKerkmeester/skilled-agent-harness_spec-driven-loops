---
title: "Tasks: 116/008 — Playbooks and Default Calibration"
description: "Tasks for seeded manual playbooks and evidence-backed default calibration."
trigger_phrases:
  - "116 playbook calibration tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-review-complexity/008-playbooks-and-default-calibration"
    last_updated_at: "2026-05-22T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Scaffolded phase 008 tasks."
    next_safe_action: "Start playbook rollout after phase 007."
    blockers: []
    key_files: ["plan.md"]
    session_dedup:
      fingerprint: "sha256:1160082000000000000000000000000000000000000000000000000000000000"
      session_id: "116-008-tasks"
      parent_session_id: "116-008-playbooks-default-calibration"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 116/008 — Playbooks and Default Calibration

---

<!-- ANCHOR:notation -->
## Task Notation
- `T###` task ID; `[D:T###]` dependency marker.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 Read manual playbook conventions.
- [ ] T002 Collect evidence from phases 002-007.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T010 Add seeded manual scenarios.
- [ ] T011 Update deep-review README/reference docs.
- [ ] T012 Evaluate defaults and change only if evidence supports it.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T020 Run docs/playbook checks.
- [ ] T021 Run targeted defaults tests if defaults change.
- [ ] T022 Run `validate.sh --strict` on this phase.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] Playbooks prove seeded bug-class scenarios.
- [ ] Defaults are evidence-backed or left unchanged.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- Parent: `../spec.md`
- Prior phase: `../007-ledger-led-graph-vocabulary/spec.md`
<!-- /ANCHOR:cross-refs -->
