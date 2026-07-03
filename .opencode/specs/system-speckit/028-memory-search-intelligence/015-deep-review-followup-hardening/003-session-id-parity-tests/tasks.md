---
title: "Tasks: Session-Id Parity Tests"
description: "Task ledger for the cross-mode session-id parity vitest suite."
trigger_phrases:
  - "parity tests tasks"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/015-deep-review-followup-hardening/003-session-id-parity-tests"
    last_updated_at: "2026-07-03T10:01:10Z"
    last_updated_by: "opencode-gpt-5.5"
    recent_action: "Implemented parity tests"
    next_safe_action: "Use parity suite during future YAML edits"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/tests/unit/workflow-session-id-parity.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fable-032-003-parity-tests"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Session-Id Parity Tests

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Locate the resolve step and sessionId consumption in each of the three `deep_*_auto.yaml` assets; record structural paths.
- [x] T002 Determine how `buildLoopPrompt` is importable in tests; record the three loop-type call shapes.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write per-mode structural assertions (step, if_present bind, per-mode if_absent fallback, session_id_init consumption).
- [x] T004 Write prompt-emission assertions for review, context, research.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Suite green on current state.
- [x] T006 Drift injection: one temporary mutation per contract class fails with a mode-naming message; restore all.
- [x] T007 Full deep-loop-runtime vitest suite: 0 new failures.
- [x] T008 Author implementation-summary.md; fill checklist evidence; set spec.md Status per real outcome.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed (`validate.sh --strict` exits 0 on this folder). [EVIDENCE: final strict validation exited 0 after graph metadata refresh]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
