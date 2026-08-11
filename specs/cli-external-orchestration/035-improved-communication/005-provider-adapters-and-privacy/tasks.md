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
    last_updated_at: "2026-08-11T10:15:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded Phase 005 task breakdown."
    next_safe_action: "Obtain project-owner approval, then start T001 after the Phase 004 handoff is confirmed."
    blockers:
      - "Project-owner approval of the Proposed architecture decision is not yet recorded."
    key_files:
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-scaffold-20260811"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
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

- [ ] T001 Confirm 004-protected-spans-fidelity-render handoff evidence and capture the baseline (`spec.md`, `plan.md`)
- [ ] T002 Freeze public contracts, invariants, and independent test-matrix axes (`spec.md`, `plan.md`)
- [ ] T003 [P] Create the proposed Phase 005 package surfaces and focused test harness (`spec.md`, `plan.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [ ] T004 Implement model records, credential references, prompt-control capabilities, dated facts, and conservative discovery (`packages/cli-communication-projection/src/providers/`)
- [ ] T005 Implement privacy classification, consent, eligibility, ranking, and explicit fallback without invoking transport (`packages/cli-communication-projection/src/privacy/`)
- [ ] T006 [P] Implement OpenCode Go, Ollama, llama.cpp, and generic adapters with typed unsupported-control, failure, cancellation, timeout, and exact-original outcomes (`packages/cli-communication-projection/src/providers/`)
- [ ] T007 Emit content-free provider, privacy, route, and fallback reason events through the shared evidence boundary (`packages/cli-communication-projection/src/providers/`, `src/privacy/`)
- [ ] T008 [P] Implement contract, prompt-control, privacy-order, fallback, transport-spy, and secret-canary tests (`packages/cli-communication-projection/test/providers/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T009 [P] Run same-class producer and changed-consumer inventories (`checklist.md`)
- [ ] T010 Run focused negative controls and boundary tests (`checklist.md`)
- [ ] T011 Run the authoritative workspace gate and recursive packet validator (`checklist.md`)
- [ ] T012 Reconcile checklist, implementation summary, metadata, and 006-runtime-adapters-and-clients handoff (`checklist.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements and checklist blockers have observed evidence.
- [ ] No blocked task remains without an owner-approved disposition.
- [ ] Focused tests, the authoritative workspace gate, and recursive strict validation pass.
- [ ] Exact-original or fail-closed behavior is demonstrated for every seeded failure.
- [ ] Parent and successor handoff metadata agree with the final state.
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
