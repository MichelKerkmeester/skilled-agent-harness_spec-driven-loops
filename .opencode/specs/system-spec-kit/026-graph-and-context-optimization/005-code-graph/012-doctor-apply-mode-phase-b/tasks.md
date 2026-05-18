---
title: "Tasks: /doctor:code-graph apply-mode Phase B [system-spec-kit/026-graph-and-context-optimization/005-code-graph/012-doctor-apply-mode-phase-b/tasks]"
description: "Task list for implementing Phase B apply-mode with verification battery gating, recovery procedures, rollback, status metrics, and tests."
trigger_phrases:
  - "doctor code graph apply tasks"
  - "013 doctor apply mode phase b tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/012-doctor-apply-mode-phase-b"
    last_updated_at: "2026-05-08T22:45:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified Phase B apply-mode"
    next_safe_action: "Packet complete; use code_graph_apply for apply-mode recovery"
    blockers: []
    key_files:
      - "plan.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-apply-mode-phase-b-2026-05-08"
      parent_session_id: "doctor-apply-mode-phase-b-2026-05-08"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: /doctor:code-graph apply-mode Phase B

<!-- SPECKIT_LEVEL: 3 -->
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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read packet `spec.md` first.
- [x] T002 [P] Read the four prerequisite research artifacts.
- [x] T003 [P] Read Phase A implementation summary and diagnostic YAMLs.
- [x] T004 [P] Read scan/status/detect/readiness/DB runtime files.
- [x] T005 Author Level 3 plan, tasks, checklist, and decision record.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Create `gold-battery-runner.ts`.
- [x] T007 Create `exclude-rule-classifier.ts`.
- [x] T008 Create `recovery-procedures.ts`.
- [x] T009 Create `apply-orchestrator.ts`.
- [x] T010 Create `handlers/apply.ts`.
- [x] T011 Register `code_graph_apply` in handler exports, dispatch, tool schema, and Zod schema.
- [x] T012 Add apply metrics to `code_graph_status`.
- [x] T013 Update apply-mode workflow YAML in the current command asset layout.
- [x] T014 Append apply-mode documentation to `.opencode/commands/doctor/code-graph.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Add `tests/code-graph-apply-orchestrator.vitest.ts`.
- [x] T016 Add `tests/code-graph-gold-battery.vitest.ts`.
- [x] T017 Add `tests/code-graph-recovery-procedures.vitest.ts`.
- [x] T018 Add `tests/code-graph-apply-e2e.vitest.ts`.
- [x] T019 Run targeted Vitest suite.
- [x] T020 Run TypeScript compile.
- [x] T021 Run strict spec validation.
- [x] T022 Fill implementation summary and metadata as complete.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements REQ-001 through REQ-004 verified.
- [x] All P1 requirements REQ-005 through REQ-010 verified.
- [x] P2 requirements REQ-011 through REQ-014 verified or explicitly limited.
- [x] TypeScript compile passes.
- [x] Four requested Vitest files pass.
- [x] Strict spec validation exits 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
<!-- /ANCHOR:cross-refs -->
