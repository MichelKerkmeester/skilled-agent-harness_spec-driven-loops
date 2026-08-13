---
title: "Tasks: Phase 006 Runtime Adapters and Clients"
description: "Implementation task breakdown for integrating the projection core with six CLIs through their safest supported event and presentation boundaries."
trigger_phrases:
  - "runtime-adapters-and-clients"
  - "tasks"
  - "implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/006-runtime-adapters-and-clients"
    last_updated_at: "2026-08-12T09:10:00Z"
    last_updated_by: "claude"
    recent_action: "Completed Phase 006 implementation across four workers and one review remediation."
    next_safe_action: "Approve the Phase 007 evaluation architecture, then execute its T001 from the 202-test baseline."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-006-implementation-20260812"
      parent_session_id: "phase-006-scaffold-20260811"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
      - "Six adapters over eight concrete paths, the client presentation layer, and the capability matrix are implemented and verified."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 006 Runtime Adapters and Clients

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

- [x] T001 Confirm 005-provider-adapters-and-privacy handoff evidence and capture the baseline (`spec.md`, `plan.md`) [evidence: built on the 005 privacy/provider boundary; baseline 89 package tests green from the merged state]
- [x] T002 Freeze runtime, version, presentation-tier, degradation, and independent test-matrix contracts (`spec.md`, `plan.md`) [evidence: `src/runtimes/types.ts` and `matrix.ts` freeze the eight-path tier and degradation contract]
- [x] T003 [P] Create the proposed Phase 006 package surfaces and focused test harness (`spec.md`, `plan.md`) [evidence: `src/runtimes/`, `src/clients/`, `test/runtimes/`, `test/clients/` created]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T004 Implement adapter contract and shared conformance harness (`packages/cli-communication-projection/src/runtimes/`) [evidence: `adapter.ts` contract + `assertRuntimeAdapterConformance`; commit 0a0d931dfc]
- [x] T005 [P] Implement six runtime mappings, full-projection clients, and safe-native append, sidecar, or original-only paths (`src/runtimes/`, `src/clients/`) [evidence: claude/codex/pi/opencode/devin/cursor adapters + `src/clients/`; commits dea1ad3d2a, b5f02f638c]
- [x] T006 Implement typed incompatibility, failure, cancellation, timeout, disconnect, tier-downgrade, and exact-original outcomes (`src/runtimes/`, `src/clients/`) [evidence: `exactEvent`/`exactPresentation` in every adapter; fail-closed to safe-native/original-only]
- [x] T007 Emit content-free runtime, capability, presentation-tier, and degradation reason events (`src/runtimes/`, `src/clients/`) [evidence: `telemetryFor` with `sanitizeRuntimeTelemetryPathId`; content and credential canaries pass; commit 0a07c50640]
- [x] T008 [P] Run pinned fixture replay, atomic-render proof, disconnect, cancellation, tier-downgrade, and degraded-mode smoke tests (`test/runtimes/`) [evidence: `fixtures.test.ts`, `smoke.test.ts`, `edge-cases.test.ts`, `performance.test.ts`; commit b9cd4d1d46]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T009 [P] Run same-class producer and changed-consumer inventories (`checklist.md`) [evidence: adapters produce records/events; clients, matrix, and telemetry consume them; captured in checklist CHK-030]
- [x] T010 Run focused negative controls and boundary tests (`checklist.md`) [evidence: exact-original byte round-trips, canonical-immutability Proxy spies, edge-case matrix]
- [x] T011 Run the authoritative workspace gate and recursive packet validator (`checklist.md`) [evidence: `npm run check` green 37 files / 202 tests; strict + recursive-strict validation]
- [x] T012 Reconcile checklist, implementation summary, metadata, and 007-evaluation-and-observability handoff (`checklist.md`) [evidence: this reconciliation; `handover.md`; parent phase-map updated]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements and checklist blockers have observed evidence.
- [x] No blocked task remains without an owner-approved disposition.
- [x] Focused tests, the authoritative workspace gate, and recursive strict validation pass.
- [x] Exact-original or fail-closed behavior is demonstrated for every seeded failure.
- [x] Parent and successor handoff metadata agree with the final state.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision**: `decision-record.md`
- **Research basis**: `../001-research-strategy/research/research.md`
<!-- /ANCHOR:cross-refs -->
