---
title: "Tasks: Deep AI Council - Certificates & Receipts"
description: "Tasks for the Deep AI Council certificate and receipt planning contract: lifecycle coverage, replay-fingerprint binding, offline verification, recovery dispositions, and additive-dark mode evidence."
trigger_phrases:
  - "deep ai council certificates and receipts tasks"
  - "deep-ai-council transition receipt tasks"
  - "deep-ai-council offline verifier tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T23:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Enumerated council receipt, certificate, fingerprint, and verifier tasks"
    next_safe_action: "Build the council lifecycle receipt matrix from shared contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep AI Council - Certificates & Receipts

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

- [ ] T001 Pin the candidate SHA and shared phase-007 receipt, certificate, and certification-provider digests and phase-006 authorization, ledger, and replay-contract digests
- [ ] T002 Read the Deep AI Council `001-typed-ledger-schema`, `002-reducers-and-projections`, and predecessor `003-sealed-artifacts` contracts as read-only inputs
- [ ] T003 Freeze the lifecycle transition registry, logical-operation identity, attempt identity, idempotency-key grammar, result dispositions, and receipt-chain order
- [ ] T004 Freeze the run-certificate body, sealed-reference manifest, final-head rules, replay-fingerprint input projection, explicit exclusions, and offline-bundle shape
- [ ] T005 [P] Build positive and negative fixtures for correlated seats, minority loss, order-swapped judgment, bias detection, failed test gates, missing artifacts, stale heads, and unknown effects
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Register council receipt and certificate profiles through the shared phase-007 registry without adding a mode-local digest, signature, verifier, key, or trust root
- [ ] T007 Add initialization receipts for target, strategy, protocol, seat bounds, capability commitments, configuration, lineage, and initial ledger head
- [ ] T008 Add seat selection, dispatch, return, and proposal receipts for logical branch identity, independence group, evidence, output, cost, lease, and attempts
- [ ] T009 Add critique receipts for visible-information policy, source proposal IDs, cited claims, challenge disposition, and critique output
- [ ] T010 Add candidate-blinding, pairwise-judgment, and bias-audit receipts for aliases, deterministic order controls, raw/calibrated outcomes, abstention, and inconsistency
- [ ] T011 Add synthesis and convergence receipts for event ranges, minority/contradiction references, effective-seat evidence, protocol route, blockers, and typed decisions
- [ ] T012 Add artifact-commit and council-test-gate receipts for sealed references, content digests, fixture manifests, baseline/candidate fingerprints, control-arm deltas, and required checks
- [ ] T013 Add recovery and rollback-observation receipts for reuse, re-execution, reconciliation, compensation, `in_doubt`, conflict, and supersession without automatic uncertain replay
- [ ] T014 Build the per-run certificate over the verified receipt chain, final heads, projections, sealed artifacts, test-gate evidence, unresolved obligations, and shared certification metadata
- [ ] T015 Bind the versioned replay fingerprint to registered council semantics and normalize process-local, timing-only, path, cache, random-request, and attempt-only values
- [ ] T016 Implement the independent offline verifier for canonical bytes, authorization, chain continuity, sealed references, disclosure boundaries, projections, artifacts, bias evidence, and test-gate results
- [ ] T017 Bind receipt and certificate failures to dark evidence suppression while preserving legacy council state, artifacts, writers, outputs, and authority
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T018 Verify every registered transition emits one receipt only after its authorized result and resulting ledger head are durable
- [ ] T019 Verify identical semantic inputs produce identical receipt and certificate digests and replay fingerprints across process and completion-order variation
- [ ] T020 Verify every registered replay-affecting input changes the fingerprint while excluded process, timing, path, alias, and attempt values do not
- [ ] T021 Verify mutation, truncation, omission, substitution, stale head, wrong kind, unsupported version, duplicate identity, mixed reference set, and certification failure are invalid or blocked
- [ ] T022 Verify correlated nominal seats, erased minority evidence, order-swapped disagreement, judge bias, failed metamorphic checks, and missing gate evidence cannot produce valid completion
- [ ] T023 Verify artifact, projection, synthesis, independence, minority, control-arm, and test-gate output digests match receipt inputs
- [ ] T024 Verify recovery distinguishes `not_applied`, `applied`, `in_doubt`, and `conflict`, and only conclusive `not_applied` retries with the original idempotency key
- [ ] T025 Verify the offline bundle returns typed `valid`, `invalid`, `incomplete`, `unverifiable`, or `blocked` results without network, model, search, memory, mutation, or baseline creation
- [ ] T026 Verify the dark mode gate compares equivalent verified reference sets and leaves legacy authority unchanged
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
