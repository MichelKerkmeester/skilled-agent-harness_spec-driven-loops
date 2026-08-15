---
title: "Tasks: Phase 012 No-Op Rejection"
description: "Planned task breakdown for no-improvement classification, threshold calibration, typed fallback, and regression verification."
trigger_phrases:
  - "no-op-rejection"
  - "tasks"
  - "implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/012-no-op-rejection"
    last_updated_at: "2026-08-13T00:00:00.000Z"
    last_updated_by: "codex"
    recent_action: "Authored the planned no-improvement task breakdown."
    next_safe_action: "Execute T001 by capturing the current no-op baseline."
    blockers:
      - "The minimal edit-distance threshold requires fixture-based calibration."
    key_files:
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-012-scaffold-20260813"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "What minimal edit-distance threshold separates a real projection from a near-echo without rejecting legitimately-terse-but-clear rewrites?"
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 012 No-Op Rejection

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable after dependencies |
| `[B]` | Blocked with a named condition |

**Task format**: `T### [P?] Description (primary surface)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture current unchanged and near-echo acceptance behavior (`test/`)
- [ ] T002 Inventory validator, reason, render, and telemetry consumers (`src/`)
- [ ] T003 Define normalization, distance metric, threshold candidates, and boundary fixtures (`spec.md`, `plan.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Replace exact-equality acceptance with no-improvement classification (`src/fidelity/validator.ts`)
- [ ] T005 Add configurable near-echo thresholding (`src/fidelity/validator.ts`)
- [ ] T006 Add the typed content-free reason (`src/contracts/`)
- [ ] T007 Route no-improvement to deterministic formatting or exact-original (`src/render/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Test exact, capitalization-only, formatting-only, and near-threshold cases (`test/`)
- [ ] T009 Test legitimately terse but clear rewrites above the boundary (`test/`)
- [ ] T010 Verify reason codes contain no source or candidate text (`test/`)
- [ ] T011 Verify fidelity, privacy, and meaning-judge boundaries are unchanged (`test/`)
- [ ] T012 Run `npm run check` and strict packet validation (`checklist.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All five requirements and checklist blockers have observed evidence.
- [ ] Exact and near-echo candidates select a safe explicit fallback.
- [ ] Legitimate terse rewrites are not rejected by the approved threshold.
- [ ] The package gate and strict packet validation pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Parent packet**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
