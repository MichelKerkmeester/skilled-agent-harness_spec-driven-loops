---
title: "Tasks: Deep Research - Certificates & Receipts"
description: "Tasks for the Deep Research per-run certificate, per-transition receipts, replay-fingerprint projection, offline verifier, and additive-dark mode gate."
trigger_phrases:
  - "deep research certificates and receipts tasks"
  - "deep-research run certificate tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T20:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Sequenced Deep Research receipt, certificate, fingerprint, and verifier work"
    next_safe_action: "Build the transition matrix from the shared phase-006 contract"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Research - Certificates & Receipts

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

- [ ] T001 Pin the candidate SHA and phase-006 receipt/certificate, ledger, authorization, certification, and replay-contract digests
- [ ] T002 Inventory Deep Research init, gather, analyze, convergence, synthesis, memory-save, and resume/recovery transitions against the pinned mode contracts
- [ ] T003 Map each logical transition to its shared receipt kind, prior/result event, input/output references, result dispositions, and ledger-head rule
- [ ] T004 Freeze logical operation IDs, attempt IDs, idempotency keys, receipt ordering, duplicate behavior, and same-key/different-facts conflict behavior
- [ ] T005 Freeze the run-certificate body, receipt-chain digest, ordered sealed-reference set, status vocabulary, and required unresolved-obligation fields
- [ ] T006 Freeze replay-fingerprint semantic inputs, normalization rules, exclusions, contract versions, and unknown-field fail-closed behavior
- [ ] T007 Define the offline verifier bundle, certification trust policy, typed verdicts, and no-repair/no-rebaseline error contract
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T008 Register Deep Research transition receipt and run-certificate profiles through the shared phase-006 primitives
- [ ] T009 Add the `init` receipt for the frozen objective, plan/frontier, recipes, capabilities, configuration, and initial ledger head
- [ ] T010 Add per-logical-branch `gather` and `analyze` receipts for source/evidence/claim references, admission, validation, contradictions, abstentions, and attempt history
- [ ] T011 Add convergence receipts for one verified frontier snapshot, raw/trusted signals, blockers, policy versions, budget/lease state, and typed decision
- [ ] T012 Add synthesis and memory-save receipts for materialized-view inputs, output digests, unresolved claims, continuity payload, target route, and persistence result
- [ ] T013 Add resume/recovery receipts for reuse, re-execute, reconcile, compensate, `not_applied`, `applied`, `in_doubt`, and `conflict` outcomes
- [ ] T014 Implement the per-run certificate builder over the complete verified receipt chain, event range, final heads, artifact set, outputs, and obligations
- [ ] T015 Implement replay-fingerprint derivation from the registered semantic input projection and bind it to receipts and the run certificate
- [ ] T016 [P] Implement the offline verifier over local contract registries, receipt/certificate bytes, sealed artifacts, and provider evidence
- [ ] T017 Bind dark receipt/certificate emission and verification into event, reducer, projection, compatibility, shadow-parity, and rollback seams without changing authority
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T018 Verify each receipt is emitted after the authorized transition result and resulting ledger head are durable
- [ ] T019 Verify identical semantic inputs produce identical receipt body digests, replay fingerprints, and run-certificate body
- [ ] T020 Verify every registered replay-affecting input changes the fingerprint and excluded timing/process/attempt values do not
- [ ] T021 Verify receipt and certificate tampering, omission, truncation, stale heads, wrong kinds, unsupported versions, duplicate IDs, and mixed reference sets fail closed
- [ ] T022 Verify exact-repeat retry is idempotent and same-key/different-facts reuse returns a typed conflict without false success
- [ ] T023 Verify source refresh and claim supersession preserve prior receipts and append only affected revisions and dependent invalidations
- [ ] T024 Verify recovery distinguishes `not_applied`, `applied`, `in_doubt`, and `conflict`, and retries only conclusive `not_applied` with the original key
- [ ] T025 Verify the offline verifier reproduces registered digests, chain links, authorization, projections, synthesis, and handoff results without live execution
- [ ] T026 Verify failed or unknown memory-save persistence cannot receive trusted completion status
- [ ] T027 Verify the Deep Research mode gate compares only equivalent verified reference sets and leaves legacy state, output, writers, and authority unchanged
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
