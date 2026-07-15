---
title: "Tasks: Deep Improvement Common Services - certificates and receipts (013 phase 004)"
description: "Tasks for planning and implementing the shared Deep Improvement Common Services certificate, receipt, replay-fingerprint, offline-verifier, evaluator, canary, and promotion contracts."
trigger_phrases:
  - "deep improvement certificates and receipts tasks"
  - "deep improvement common service tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T20:35:00Z"
    last_updated_by: "opencode"
    recent_action: "Sequenced certificate, receipt, verifier, and shared-service work"
    next_safe_action: "Inspect phase-003 primitives and enumerate shared evaluator write boundaries"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Improvement Common Services - Certificates and Receipts

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

- [ ] T001 Confirm the `003-sealed-artifacts` primitives, typed ledger interfaces, and reducer boundaries before designing new fields
- [ ] T002 [P] Inventory shared evaluator, canary, promotion, candidate, scoring, and legacy projection paths
- [ ] T003 Record the additive-dark boundary, the phase-009 contract-freeze handoff, and the later 010 migration consumers
- [ ] T004 Define the shared-versus-variant ownership matrix for agent-improvement, model-benchmark, and skill-benchmark
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Define the run-level `CERTIFICATE` schema, required evidence, verdict vocabulary, digest references, and supersession rules
- [ ] T006 Define the transition-level `RECEIPT` schema, predecessor links, effect identity, idempotency, uncertainty, and recovery outcomes
- [ ] T007 Define canonical replay-fingerprint serialization, semantic input classes, excluded storage values, and mismatch diagnostics
- [ ] T008 Define the evaluator capsule interface with raw observation retention, deterministic-first checks, normalization, calibration, and reduction
- [ ] T009 Define canary epochs, deterministic ground truth, adversarial/metamorphic fixtures, leakage vetoes, rotation, freshness, and redaction
- [ ] T010 Define promotion service transitions for shadow, canary, promote, abort, restore, veto, and `INSUFFICIENT_EVIDENCE`
- [ ] T011 Define the independent offline verifier sequence and its verifier receipt bound to certificate fingerprint, ruleset, and verifier version
- [ ] T012 Define ledger event/projection bindings, dark-write behavior, duplicate/out-of-order handling, and crash-window recovery without duplicating sibling ownership
- [ ] T013 Define the adapter contract that prevents downstream variants from forking shared certificate, receipt, fingerprint, or promotion semantics
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Verify complete, incomplete, contradictory, superseded, and tampered run fixtures produce the correct certificate outcome
- [ ] T015 Verify duplicate, out-of-order, vetoed, aborted, restored, and uncertain transition fixtures preserve receipt-chain integrity and idempotency
- [ ] T016 Verify identical semantic inputs reproduce the same fingerprint across processes and every semantic mutation causes a mismatch
- [ ] T017 Verify the offline verifier runs without live agent or network access and independently recomputes hashes, reductions, canaries, and hard gates
- [ ] T018 Verify raw observations remain available when normalized scores or reducers change and missing evidence cannot become a substituted score
- [ ] T019 Verify canary leakage, stale epoch, metamorphic failure, and evaluation-context twin fixtures veto or block promotion as specified
- [ ] T020 Verify hard schema, build, security, regression, integrity, and evidence vetoes cannot be rescued by soft evaluator scores
- [ ] T021 Verify all three benchmark variants use the same shared service fixtures and produce semantic parity through adapter boundaries
- [ ] T022 Verify dark-path emissions do not change authority and the 005 resume adapter receives explicit replay, salvage, and block cases
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Shared evaluator, canary, promotion, certificate, receipt, fingerprint, and offline verifier gates are green
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor contract**: See `../003-sealed-artifacts/`
- **Successor consumer**: See `../005-resume-adapter/`
<!-- /ANCHOR:cross-refs -->
