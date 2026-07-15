---
title: "Tasks: Deep Alignment - Rollback & Mode Gate"
description: "Tasks for the Deep Alignment rollback switch and independent mode gate: freeze shared inputs, specify fail-closed authority control and bounded rollback, assemble per-lane parity and sealed conformance evidence, and verify the non-authoritative phase-011 handoff."
trigger_phrases:
  - "Deep Alignment rollback and mode gate tasks"
  - "deep-alignment rollback switch tasks"
  - "deep-alignment mode gate tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/007-rollback-and-mode-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/007-rollback-and-mode-gate"
    last_updated_at: "2026-07-15T21:45:00Z"
    last_updated_by: "opencode"
    recent_action: "Enumerated Deep Alignment rollback and gate planning tasks"
    next_safe_action: "Build the lane evidence matrix and rollback fixture set"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Alignment - Rollback & Mode Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Pin BASE, the parent 065 invariants, `manifest/phase-tree.json`, phase-009 shared review-loop and write-set digests, phase-011 handoff contract, and the phase-003 authorization boundary
- [ ] T002 Read the six Deep Alignment sibling contracts and record ownership for typed events, reducers, seals, certificates, resume, and shadow parity
- [ ] T003 Inventory the legacy Deep Alignment lifecycle, lane resolver, authority adapters, applicability path, known-deviation handling, convergence, report, resume, continuity, and remediation boundary
- [ ] T004 Freeze the authority-control vocabulary, gate result states, rollback trigger classes, dual window bounds, lane fixture IDs, certificate fields, and phase-011 handoff fields
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Define the fail-closed Deep Alignment authority capsule and control record, legacy/shadow/ledger postures, authority epoch, verifier digest, contract bindings, and invalid-input resolution
- [ ] T006 Define the externally authorized rollback switch as an auditable `ledger -> legacy` transition with healthy ledger frontier, legacy checkpoint, observed lane tail, authority epoch, reason, and restoration receipt
- [ ] T007 Define the bounded rollback window with start event, deadline, logical-operation or attempt budget, expiry disposition, renewal rule, and no-self-clear invariant
- [ ] T008 Define the rollback trigger matrix for authority drift, applicability drift, parity mismatch, replay mismatch, seal/receipt failure, unknown effect, stale fence, contract drift, integrity failure, health quarantine, and canonical-write leakage
- [ ] T009 Build the independent Deep Alignment gate matrix for lane resolution, discovery, applicability, artifact checks, live re-probes, known deviations, unresolved states, convergence, reports, resume, continuity, and remediation exclusion
- [ ] T010 Bind the gate to the phase-009 shared review-loop and Deep Review mode 002 fence; reject mode-local copies of scope, coverage, lineage, convergence, report, resume, or write-set semantics
- [ ] T011 Bind authority and rule seal manifests, shadow-parity receipts, verifier outcomes, run certificates, receipt roots, replay fingerprints, lane coverage, resume outcomes, and rollback-drill evidence into the mode-gate certificate
- [ ] T012 Define the `PASS`, `BLOCKED`, `INDETERMINATE`, `UNRESOLVED`, `NOT_APPLICABLE`, and `MIGRATED_SHADOW_READY` semantics; prohibit authority movement, automatic remediation, and legacy-writer retirement
- [ ] T013 [P] Create clean, missing-authority, stale-authority, mixed-epoch, invalid-applicability, known-deviation, unresolved-evidence, parity-drift, corrupted-seal, unknown-effect, expired-window, and legacy-restoration fixtures
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Verify every resolved lane has a named gate row and evidence reference from scope through report, resume, continuity, and phase-011 handoff
- [ ] T015 Verify shadow parity event count, order, lane identity, authority epoch, causal links, payload digest, projection fingerprint, applicability edges, and declared volatility across all required fixtures
- [ ] T016 Verify every authority, rule, target, observation, finding, counterevidence, known-deviation, report, and resume reference is sealed and tamper-evident
- [ ] T017 Verify the run certificate, authority capsule, verifier digest, receipt-set closure, replay fingerprint, and mode-gate certificate independently from live execution
- [ ] T018 Verify absent, malformed, stale, unauthorized, mixed, mismatched, expired, or unverified authority controls resolve to legacy authority or block
- [ ] T019 Verify every rollback trigger freezes ledger-authoritative work, restores the matching legacy checkpoint when possible, and emits an immutable restoration receipt
- [ ] T020 Verify deadline and logical-operation rollback bounds, expiry, renewal, stale-window rejection, unknown-effect handling, and unavailable-checkpoint blocking
- [ ] T021 Verify Deep Alignment gate status is independent from Deep Review status, generic dashboards, final report text, aggregate coverage, and numeric convergence alone
- [ ] T022 Verify the phase-011 handoff emits only `MIGRATED_SHADOW_READY` evidence, preserves read-only defaults, and emits no cutover, window-close, remediation, or legacy-retirement action
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (`validate.sh`, contract, lane fixture, parity, authority, seal, certificate, and rollback checks as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
