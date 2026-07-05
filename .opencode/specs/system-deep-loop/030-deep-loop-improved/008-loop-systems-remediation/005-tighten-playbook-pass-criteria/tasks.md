---
title: "Tasks: Tighten Playbook Pass Criteria"
description: "Completed Level-1 task list for closing the inspection-only pass loophole in manual playbook scenarios."
trigger_phrases:
  - "tasks"
  - "tighten playbook pass criteria"
  - "manual testing playbook"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/008-loop-systems-remediation/005-tighten-playbook-pass-criteria"
    last_updated_at: "2026-06-29T13:09:46+02:00"
    last_updated_by: "codex"
    recent_action: "Completed task list after implementation and verification."
    next_safe_action: "No remaining tasks for this phase."
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/manual_testing_playbook/"
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/05--lifecycle/speckit-autopilot-lifecycle.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "tighten-playbook-pass-criteria-tasks-2026-06-29"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Tighten Playbook Pass Criteria

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read existing phase docs (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`)
- [x] T002 Read Level-1 spec-kit examples (`.opencode/skills/system-spec-kit/templates/examples/level_1/`)
- [x] T003 [P] Locate affected `deep-loop-runtime` manual playbook scenarios
- [x] T004 [P] Confirm runnable test targets for the MiMo source-only audit scenarios
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Tighten pass/fail criteria in `04--state-safety`
- [x] T006 Tighten pass/fail criteria in `06--coverage-graph`
- [x] T007 Tighten pass/fail criteria in `09--fanout`
- [x] T008 Tighten pass/fail criteria in `03--validation`
- [x] T009 Mandate `coverage-graph-query.vitest.ts` for `coverage-graph-fuzzy-merge.md`
- [x] T010 Mandate `atomic-state.vitest.ts` for `single-loop-telemetry-heartbeat.md`
- [x] T011 Mandate `speckit-autopilot-contract.vitest.ts` for `speckit-autopilot-lifecycle.md`
- [x] T012 Replace scaffolded Level-1 phase docs with completed content
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run targeted Vitest command with `PATH=/opt/homebrew/bin:$PATH`
- [x] T014 Validate `deep-loop-runtime` manual playbook root with `validate_document.py`
- [x] T015 Validate `system-spec-kit` manual playbook root with `validate_document.py`
- [x] T016 Run grep checks for old loophole wording and audited runnable commands
- [x] T017 Run strict spec validation for this phase folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
