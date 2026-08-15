---
title: "Tasks: Phase 026 Capability and Privacy Gating"
description: "Planned task breakdown for wiring the compatibility doctor into every activation path as a typed pre-projection gate, failing closed to the exact original on unsafe facts, and verifying the decision, egress, and per-runtime matrices."
trigger_phrases:
  - "capability-and-privacy-gating"
  - "tasks"
  - "compatibility doctor pre-projection gate"
  - "original-only fail-closed gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/026-capability-and-privacy-gating"
    last_updated_at: "2026-08-14T09:24:23.000Z"
    last_updated_by: "opencode"
    recent_action: "Completed and verified all capability and privacy gate tasks."
    next_safe_action: "Consume the completed gate from the evaluation and release closeout."
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
      session_id: "phase-026-capability-and-privacy-gating-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Every task has a stated acceptance criterion and no evidence has been collected yet."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 026 Capability and Privacy Gating

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

- [x] T001 Locate the compatibility doctor report surface and its fail-closed terminal (`src/doctor/`; verified by `test/runtime/gate.test.ts`)
- [x] T002 Inventory every activation path and the shared `projectMessage()` entrypoint (verified by runtime and wrapper package tests)
- [x] T003 [P] Freeze the privacy-class matrix, freshness thresholds, and `GateDecision` reason-code set (`src/runtime/gate.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T004 Author the typed pre-projection gate that consults the doctor and returns a `GateDecision` (`src/runtime/gate.ts`)
- [x] T005 Map unknown, stale, incapable, privacy-denied, and malformed-report terminals to exact-original (`test/runtime/gate.test.ts`)
- [x] T006 Wire the gate into the shared `projectMessage()` seam before projection (`src/runtime/project-message.ts`)
- [x] T007 Keep surfaced diagnostics to the typed reason-code set (`GateReasonCodes`; content-free tests pass)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T008 Verify the unsafe-terminal decision matrix (`test/runtime/gate.test.ts`)
- [x] T009 Verify a fresh, capable, privacy-approved decision proceeds (`test/runtime/gate.test.ts`)
- [x] T010 Run the local-only zero-hosted-call control (`test/runtime/project-message.test.ts` and privacy tests)
- [x] T011 Verify runtime activation paths reach the shared gate (73 package test files pass)
- [x] T012 Confirm content-free diagnostics and unchanged canonical bytes [evidence: runtime, fidelity, and privacy tests pass; implementation-summary.md:103]
- [x] T013 Author the complete Level-3 packet, including `implementation-summary.md`
- [x] T014 Backfill metadata and run final strict validation (`Errors: 0  Warnings: 0`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements and checklist blockers have observed evidence.
- [x] The gate returns a typed decision and forces exact-original on unknown, stale, or incapable critical facts.
- [x] No hosted routing occurs without a fresh, capable, privacy-approved decision, and local-only configuration makes zero hosted calls.
- [x] Every runtime activation path reaches the same shared gate before projecting.
- [x] Phase 026 strict validation reports zero errors and zero warnings.
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
