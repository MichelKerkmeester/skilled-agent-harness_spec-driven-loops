---
title: "Tasks: Deep Alignment - Resume Adapter"
description: "Tasks for planning and later implementing the Deep Alignment resume adapter over the sealed event ledger, shared review-loop reducers, authority-aware continuity ladder, and idempotent re-entry contract."
trigger_phrases:
  - "deep alignment resume adapter tasks"
  - "sealed ledger alignment recovery tasks"
  - "deep-alignment replay idempotency tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/005-resume-adapter"
    last_updated_at: "2026-07-15T23:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Turned alignment resume invariants into a ledger-first task sequence"
    next_safe_action: "Confirm shared seal and reducer contracts before adapter implementation"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Alignment - Resume Adapter

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

- [ ] T001 Confirm the phase-012 shared review-loop contract is frozen and record its seal, frontier, reducer, replay, and terminal interfaces
- [ ] T002 Confirm the shared mode contract and emitted write-set conflict graph are available for same-lineage and independent-lineage resume
- [ ] T003 Inventory authority, lane, applicability, observation, proof, adjudication, deviation, convergence, and handoff interruption boundaries
- [ ] T004 Define the continuity-ladder state table and invariants for authority epochs, lanes, evidence, findings, proofs, deviations, and terminal handoff
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 [P] Bind recovery to the sealed ledger frontier and reject invalid sequence, hash, schema, reducer, authority, receipt, or replay inputs
- [ ] T006 Implement the shared reducer fold and Deep Alignment continuity projection without adding a mode-local review-loop backbone
- [ ] T007 Implement authority epoch, subject digest, verifier digest, applicability, and evidence compatibility checks
- [ ] T008 Implement lane, rule, subject, observation, finding, proof, effect, deviation, and handoff logical identities with separate attempt IDs
- [ ] T009 Implement affected-replay planning for authority, verifier, subject, evidence, artifact, manifest, reducer, and policy drift
- [ ] T010 Implement `reuse`, `reexecute`, `reconcile`, `compensate`, `migrate`, `pin-old-runtime`, `reject`, and `block` outcomes for incomplete or incompatible work
- [ ] T011 Persist an idempotent resume decision keyed by lineage, sealed frontier, authority epoch, manifest revision, and replay fingerprint
- [ ] T012 Preserve branch-local lane successes and late events while preventing duplicate application, silent event loss, or whole-wave replay
- [ ] T013 Preserve verify-first candidate, proof, adjudication, deviation, `not_applicable`, `unresolved`, and unknown-effect semantics during re-entry
- [ ] T014 Expose the next safe action to the shared runner and provide deterministic shadow-parity inputs without authority movement
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Verify deterministic fold parity from an empty reducer and from every authority, lane, applicability, observation, proof, adjudication, convergence, and handoff frontier
- [ ] T016 Verify crash recovery before append, after append, during fold, after evidence or proof receipt, during adjudication, and before terminal projection
- [ ] T017 Verify duplicate and concurrent resume requests produce one logical decision and one projection per sealed input frontier
- [ ] T018 Verify missing, reordered, duplicated, conflicting, truncated, and unsealed events fail closed before new lane or verifier work is scheduled
- [ ] T019 Verify authority, subject, verifier, artifact, manifest, schema, reducer, and replay changes select the correct reuse, affected, migrate, pin, reconcile, compensate, or reject result
- [ ] T020 Verify unknown external effects require receipt lookup, reconciliation, compensation, or block and are never automatically retried as proven safe
- [ ] T021 Verify logical lane successes and evidence receipts survive partial-lane recovery without replaying completed branches
- [ ] T022 Verify authority-invalid, not-applicable, unresolved, inconclusive, untested, blocked, expired-deviation, and reactivation cases remain explicit
- [ ] T023 Verify raw observations, candidates, proof witnesses, verifier results, conformance assessments, and deviations remain immutable and independently replayable
- [ ] T024 Verify phase-012 transitions and the write-set graph govern same-lineage and independent-lineage resumes without a Deep Alignment lifecycle fork
- [ ] T025 Verify the adapter is ready for successor shadow parity and the mode gate without authority cutover, legacy-writer changes, or mutable-summary fallback
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
- **Shared loop authority**: Phase 012 shared review-loop contract
- **Mode and write-set authority**: Shared mode contract and emitted write-set conflict graph
- **Sibling navigation**: predecessor `004-certificates-and-receipts`; successor `006-shadow-parity`
<!-- /ANCHOR:cross-refs -->
