---
title: "Tasks: Phase 013 Capability-Evidence Unblock"
description: "Planned task breakdown for fresh capability evidence, snapshot merge, supported transport reachability, and fail-closed reversal."
trigger_phrases:
  - "capability-evidence-unblock"
  - "tasks"
  - "implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/013-capability-evidence-unblock"
    last_updated_at: "2026-08-13T00:00:00.000Z"
    last_updated_by: "codex"
    recent_action: "Authored the planned capability-evidence task breakdown."
    next_safe_action: "Execute T001 by capturing the current preset/compiler baseline."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-013-scaffold-20260813"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 013 Capability-Evidence Unblock

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

- [ ] T001 Capture current preset, compiler, and exact-original-before-transport baseline (`src/providers/`, `test/`)
- [ ] T002 Collect fresh temperature and thinking capability evidence (`test/fixtures/`)
- [ ] T003 Freeze provider/model identity, mappings, observation, expiry, and evaluation strata (`spec.md`, `plan.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Author the dated capability snapshot (`test/fixtures/`)
- [ ] T005 Record the snapshot with the evaluation strata (`test/fixtures/`)
- [ ] T006 Apply evidence through `mergeCapabilitySnapshot` (`src/providers/`)
- [ ] T007 Preserve existing fail-closed `compilePromptControls` behavior (`src/providers/controls.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Prove temperature and thinking compile as supported with fresh evidence (`test/`)
- [ ] T009 Prove a dispatch reaches transport (`test/`)
- [ ] T010 Prove missing, stale, contradictory, and unknown evidence fails closed (`test/`)
- [ ] T011 Prove the evidence fixture contains no credentials or message content (`test/`)
- [ ] T012 Run `npm run check` and strict packet validation (`checklist.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All five requirements and checklist blockers have observed evidence.
- [ ] Fresh evidence compiles supported controls and reaches transport.
- [ ] Missing, stale, contradictory, or unknown evidence restores fail-closed behavior.
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
