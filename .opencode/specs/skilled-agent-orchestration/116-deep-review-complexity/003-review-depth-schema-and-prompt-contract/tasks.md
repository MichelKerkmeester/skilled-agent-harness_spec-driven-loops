---
title: "Tasks: 116/003 — Review-Depth Schema and Prompt Contract"
description: "Tasks for defining the review-depth v2 prompt and state contract."
trigger_phrases:
  - "116 review-depth schema tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-review-complexity/003-review-depth-schema-and-prompt-contract"
    last_updated_at: "2026-05-22T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Scaffolded phase 003 tasks."
    next_safe_action: "Start schema inventory."
    blockers: []
    key_files: ["plan.md"]
    session_dedup:
      fingerprint: "sha256:1160032000000000000000000000000000000000000000000000000000000000"
      session_id: "116-003-tasks"
      parent_session_id: "116-003-review-depth-schema"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 116/003 — Review-Depth Schema and Prompt Contract

---

<!-- ANCHOR:notation -->
## Task Notation
- `T###` task ID; `[D:T###]` dependency marker.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 Read current state-format docs.
- [ ] T002 Read current prompt-pack template and tests.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T010 Add v2 review-depth state docs.
- [ ] T011 Update prompt-pack obligations.
- [ ] T012 Add render assertions.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T020 Run targeted prompt tests.
- [ ] T021 Run `validate.sh --strict` on this phase.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] Contract terms render in prompts.
- [ ] State docs define all required fields.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- Parent: `../spec.md`
- Prior phase: `../002-seeded-fixture-harness/spec.md`
<!-- /ANCHOR:cross-refs -->
