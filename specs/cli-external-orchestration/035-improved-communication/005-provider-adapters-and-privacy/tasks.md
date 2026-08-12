---
title: "Tasks: Phase 005 Provider Adapters and Privacy"
description: "Implementation task breakdown for add model-scoped hosted and local provider adapters behind privacy-first routing and explicit egress consent."
trigger_phrases:
  - "provider-adapters-and-privacy"
  - "tasks"
  - "implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/005-provider-adapters-and-privacy"
    last_updated_at: "2026-08-12T04:14:38Z"
    last_updated_by: "codex"
    recent_action: "Completed T001-T012 with final validation evidence."
    next_safe_action: "Approve the Phase 006 architecture, then execute T001."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-scaffold-20260811"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
      - "Project-owner approval and the Phase 004 handoff are recorded."
      - "The provider/privacy implementation and focused negative controls pass."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 005 Provider Adapters and Privacy

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

- [x] T001 Confirm 004-protected-spans-fidelity-render handoff evidence and capture the baseline (`spec.md`, `plan.md`) [evidence: Phase 004 handover plus `npm run check`, 16 files and 70 tests passing]
- [x] T002 Freeze public contracts, invariants, and independent test-matrix axes (`spec.md`, `plan.md`) [evidence: accepted ADR-001 and Phase 005 requirements define model, privacy, control, transport, and fallback axes]
- [x] T003 [P] Create the proposed Phase 005 package surfaces and focused test harness (`spec.md`, `plan.md`) [evidence: `src/providers/`, `src/privacy/`, and `test/providers/` exist and typecheck]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T004 Implement model records, credential references, prompt-control capabilities, dated facts, and conservative discovery (`packages/cli-communication-projection/src/providers/`) [evidence: registry and preset tests cover closed records, four families, dated facts, fresh merges, and stale-to-unknown behavior]
- [x] T005 Implement privacy classification, consent, eligibility, ranking, and explicit fallback without invoking transport (`packages/cli-communication-projection/src/privacy/`) [evidence: ranker spy, egress denial, fact freshness, contradiction, and explicit-fallback tests]
- [x] T006 [P] Implement OpenCode Go, Ollama, llama.cpp, and generic adapters with typed unsupported-control, failure, cancellation, timeout, and exact-original outcomes (`packages/cli-communication-projection/src/providers/`) [evidence: adapter and executor suites pass]
- [x] T007 Emit content-free provider, privacy, route, and fallback reason events through the shared evidence boundary (`packages/cli-communication-projection/src/providers/`, `src/privacy/`) [evidence: provider terminal telemetry validates and excludes content and credential canaries]
- [x] T008 [P] Implement contract, prompt-control, privacy-order, fallback, transport-spy, and secret-canary tests (`packages/cli-communication-projection/test/providers/`) [evidence: 5 files and 19 focused tests pass]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T009 [P] Run same-class producer and changed-consumer inventories (`checklist.md`) [evidence: provider records/presets are producers; privacy router, executor, telemetry, and Phase 006 are consumers]
- [x] T010 Run focused negative controls and boundary tests (`checklist.md`) [evidence: `npx vitest run --config vitest.config.ts test/providers` passes 19 tests]
- [x] T011 Run the authoritative workspace gate and recursive packet validator (`checklist.md`) [evidence: `npm run check` passes 89 tests; Phase 005 strict and parent recursive strict validation pass]
- [x] T012 Reconcile checklist, implementation summary, metadata, and 006-runtime-adapters-and-clients handoff (`checklist.md`) [evidence: Phase 005 completion docs, parent map, Phase 006 continuity, description, and graph metadata agree]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements and checklist blockers have observed evidence. [evidence: checklist reports 15/15 P0 items verified]
- [x] No blocked task remains without an owner-approved disposition. [evidence: Phase 005 continuity has no blockers]
- [x] Focused tests, the authoritative workspace gate, and recursive strict validation pass. [evidence: 19 focused tests, 89 package tests, and strict validators pass]
- [x] Exact-original or fail-closed behavior is demonstrated for every seeded failure. [evidence: executor negative controls cover privacy, controls, credentials, transport, timeout, cancellation, malformed output, and truncation]
- [x] Parent and successor handoff metadata agree with the final state. [evidence: parent marks Phase 005 complete and Phase 006 records the verified predecessor handover]
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
