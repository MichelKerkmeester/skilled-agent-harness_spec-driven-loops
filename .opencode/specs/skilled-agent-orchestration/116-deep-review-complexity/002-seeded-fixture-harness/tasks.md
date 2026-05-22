---
title: "Tasks: 116/002 — Seeded Fixture Harness"
description: "Task breakdown for adding failing review-depth fixtures before production behavior changes."
trigger_phrases:
  - "116 seeded fixture tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-review-complexity/002-seeded-fixture-harness"
    last_updated_at: "2026-05-22T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Scaffolded phase 002 tasks."
    next_safe_action: "Start fixture inventory."
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:1160022000000000000000000000000000000000000000000000000000000000"
      session_id: "116-002-tasks"
      parent_session_id: "116-002-seeded-fixture-harness"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 116/002 — Seeded Fixture Harness

---

<!-- ANCHOR:notation -->
## Task Notation
- `T###` task ID; `[P]` parallel-safe; `[seq]` sequential; `[D:T###]` depends on.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Inspect existing validator test layout.
- [ ] T002 Inspect deep-review reducer fixture layout.
- [ ] T003 Record fixture inventory in `scratch/fixture-inventory.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 Add shallow invalid v2 records.
- [ ] T011 Add rich valid v2 records.
- [ ] T012 Add reducer fixture for search debt persistence.
- [ ] T013 Add graphless fallback blocked-stop fixture.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 Run targeted vitest commands.
- [ ] T021 Run `validate.sh --strict` on this phase.
- [ ] T022 Update implementation summary with evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All required fixture categories exist.
- [ ] Targeted tests show current shallow behavior fails.
- [ ] Phase validation passes.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Parent: `../spec.md`
- Research: `../001-research-synthesis/research/research.md`
<!-- /ANCHOR:cross-refs -->
