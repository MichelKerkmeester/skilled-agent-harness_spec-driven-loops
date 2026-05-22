---
title: "Tasks: 116/004 — Validator v2 Enforcement"
description: "Tasks for warning support and strict review-depth v2 validation."
trigger_phrases:
  - "116 validator v2 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-review-complexity/004-validator-v2-enforcement"
    last_updated_at: "2026-05-22T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Scaffolded phase 004 tasks."
    next_safe_action: "Start validator implementation."
    blockers: []
    key_files: ["plan.md"]
    session_dedup:
      fingerprint: "sha256:1160042000000000000000000000000000000000000000000000000000000000"
      session_id: "116-004-tasks"
      parent_session_id: "116-004-validator-v2-enforcement"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 116/004 — Validator v2 Enforcement

---

<!-- ANCHOR:notation -->
## Task Notation
- `T###` task ID; `[D:T###]` dependency marker.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 Read current validator result types.
- [ ] T002 Confirm phase 002/003 fixture and schema readiness.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T010 Add warnings/advisories.
- [ ] T011 Add v2 field checks.
- [ ] T012 Add ledger and coverage consistency checks.
- [ ] T013 Add state/delta consistency checks.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T020 Run targeted validator tests.
- [ ] T021 Run `validate.sh --strict` on this phase.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] Legacy records warn.
- [ ] Invalid v2 records fail.
- [ ] Valid v2 records pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- Parent: `../spec.md`
- Prior phase: `../003-review-depth-schema-and-prompt-contract/spec.md`
<!-- /ANCHOR:cross-refs -->
