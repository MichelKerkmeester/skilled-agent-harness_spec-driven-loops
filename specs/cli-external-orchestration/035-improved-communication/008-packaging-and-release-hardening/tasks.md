---
title: "Tasks: Phase 008 Packaging and Release Hardening"
description: "Implementation task breakdown for package the system with explicit provider privacy choices, a tested compatibility matrix, diagnostics, rollback, and six-runtime release gates."
trigger_phrases:
  - "packaging-and-release-hardening"
  - "tasks"
  - "implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/008-packaging-and-release-hardening"
    last_updated_at: "2026-08-11T10:15:00Z"
    last_updated_by: "codex"
    recent_action: "Repaired the Phase 008 task ownership and terminal release handoff."
    next_safe_action: "Obtain project-owner approval, then start T001 after the Phase 007 handoff is accepted."
    blockers:
      - "Project-owner approval of the Proposed architecture decision is not yet recorded."
    key_files:
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-008-scaffold-20260811"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 008 Packaging and Release Hardening

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

- [ ] T001 Confirm 007-evaluation-and-observability handoff evidence and capture the baseline (`spec.md`, `plan.md`)
- [ ] T002 Freeze public contracts, invariants, and independent test-matrix axes (`spec.md`, `plan.md`)
- [ ] T003 [P] Confirm the Phase 002 package exists, then create only the Phase 008 doctor, release, documentation, and release-test surfaces (`spec.md`, `plan.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [ ] T004 Harden existing package entry points, exports, supported engines, evidence-backed presets, and the tiered support matrix. (packages/cli-communication-projection/package.json)
- [ ] T005 [P] Implement doctor checks for versions, capabilities, endpoints, presentation tiers, and privacy-fact expiry; revalidate OpenCode Go privacy and retention facts before 2026-08-31 and at release. (packages/cli-communication-projection/src/doctor/)
- [ ] T006 Implement release gates, typed aborts, cancellation and timeout handling, evidence manifests, and exact-original rollback coordination. (packages/cli-communication-projection/src/release/)
- [ ] T007 Write install, configuration, privacy, support, upgrade, rollback, and operator runbooks with content-free diagnostics. (packages/cli-communication-projection/docs/)
- [ ] T008 [P] Run clean-install, six-runtime, privacy, negative-control, upgrade, downgrade, and rollback rehearsals. (packages/cli-communication-projection/test/release/)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T009 [P] Run same-class producer and changed-consumer inventories (`checklist.md`)
- [ ] T010 Run focused negative controls and boundary tests (`checklist.md`)
- [ ] T011 Run the authoritative workspace gate and recursive packet validator (`checklist.md`)
- [ ] T012 Reconcile checklist, implementation summary, metadata, signed evidence manifest, and parent-packet release decision (`checklist.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements and checklist blockers have observed evidence.
- [ ] No blocked task remains without an owner-approved disposition.
- [ ] Focused tests, the authoritative workspace gate, and recursive strict validation pass.
- [ ] Exact-original or fail-closed behavior is demonstrated for every seeded failure.
- [ ] Parent release-decision metadata and the signed evidence manifest agree with the final state.
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
