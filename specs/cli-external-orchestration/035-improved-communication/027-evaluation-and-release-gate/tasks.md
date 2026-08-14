---
title: "Tasks: Phase 027 Evaluation and Release Gate"
description: "Planned task breakdown for the reject-only evaluation consult, the dated rollout gate, and end-to-end verification."
trigger_phrases:
  - "evaluation-and-release-gate"
  - "tasks"
  - "non-inferiority consult and rollout gate tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/027-evaluation-and-release-gate"
    last_updated_at: "2026-08-14T09:24:23.000Z"
    last_updated_by: "opencode"
    recent_action: "Completed and verified all evaluation and release gate tasks."
    next_safe_action: "Proceed to operator rollout documentation with the validated release evidence contract."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-027-evaluation-release-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 027 Evaluation and Release Gate

<!-- SPECKIT_LEVEL: 3 -->

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
## PHASE 1: SETUP

- [x] T001 Inventory the shared production offer seam and evaluation input (`src/runtime/project-message.ts`)
- [x] T002 Inventory release readiness inputs and dated evidence (`src/release/release-gate.ts`, `src/release/evidence.ts`)
- [x] T003 Freeze reject-only semantics, six-runtime smoke coverage, and evidence expiry (`spec.md`, `plan.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T004 Wire the evaluation verdict consult at the shared production offer seam (`src/runtime/project-message.ts`)
- [x] T005 Return the exact original on fail or inconclusive (`src/evaluation/offer.ts`)
- [x] T006 Require fresh non-inferiority, runtime smokes, and privacy canaries (`src/release/release-gate.ts`)
- [x] T007 Date and expire every evidence reference and block stale or invalid entries (`src/release/evidence.ts`, `src/release/release-gate.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T008 Prove missing, stale, invalid, and failing evidence block the gate (`test/release/`)
- [x] T009 Prove measured regression blocks the gate (`test/evaluation/`, `test/release/`)
- [x] T010 Prove the offer consult returns exact-original on fail and inconclusive (`test/evaluation/offer.test.ts`, `test/runtime/project-message.test.ts`)
- [x] T011 Run six-runtime smoke and privacy canary coverage (`test/release/release-gate.test.ts`)
- [x] T012 Run `npm run check` and strict packet validation (73 files, 385 tests; `Errors: 0  Warnings: 0`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements and checklist blockers have observed evidence.
- [x] The production path consults the evaluation verdict before projection is offered.
- [x] A fail or inconclusive verdict returns the exact original and no runtime is rollout-ready without passing evidence.
- [x] The package gate and strict packet validation pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision**: `decision-record.md`
- **Parent packet**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
