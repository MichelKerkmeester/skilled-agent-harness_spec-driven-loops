---
title: "Tasks: Deep Alignment - Typed Ledger Schema"
description: "Tasks for the Deep Alignment typed event-schema child: define the shared review-loop envelope specialization, authority and epoch event vocabulary, lane and applicability facts, verify-first findings, proof and deviation fields, and versioned upcaster boundary."
trigger_phrases:
  - "deep alignment typed ledger schema tasks"
  - "typed authority conformance event tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T21:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped Deep Alignment event ownership and shared review-loop handoff"
    next_safe_action: "Freeze authority, lane, and finding events against phase-012 contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Alignment - Typed Ledger Schema

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

- [ ] T001 Confirm the phase-006 core, phase-012 shared review-loop contracts, and Deep Review shared-backbone boundary are authoritative inputs; freeze this child as planning-only
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Define `DeepAlignmentEventEnvelope` over the phase-012 envelope, including typed scope, inherited-field comparison, payload hash, authorization reference, and replay-fingerprint inputs
- [ ] T003 Define authority, capsule, epoch, rule-IR, profile, signature, expiry, rollback, and compatibility field types plus validation event payloads
- [ ] T004 Define lane, subject snapshot, applicability predicate, obligation kind, budget, verifier, and execution field types with explicit applicable/not-applicable/unresolved/blocked outcomes
- [ ] T005 Define raw observation, evidence receipt, freshness, detector, candidate, impact, confidence, and source-fingerprint event payloads without verdict mutation
- [ ] T006 Define independent verification, proof witness, counterevidence, assessor mode, and conformance assessment event payloads for positive/negative/boundary/stateful evidence
- [ ] T007 Define known-deviation record and invalidation events with scope, issuer, authority epoch, verifier digest, rationale, expiry, and original finding references
- [ ] T008 Define applicability coverage and old-authority witness replay events without introducing reducer-owned coverage or projection state
- [ ] T009 Define event-version compatibility classes, pure upcaster hooks, ordered conversion paths, replay-fingerprint contributions, and fail-closed unknown/ambiguous/lossy behavior
- [ ] T010 Record the shared review-loop event boundary with Deep Review and reject duplicated run, pass, convergence, blocked-stop, continuity, and terminal definitions
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Verify: The event catalog covers authority binding and validation, epoch compatibility, lane execution, applicability, observations, findings, proof, verification, adjudication, deviations, replay, and terminal handoff
- [ ] T012 Verify: Authority invalidity cannot emit conformance PASS, and not-applicable/unresolved/inconclusive/untested/blocked states remain explicit
- [ ] T013 Verify: Raw observations, candidates, verifier results, proof witnesses, deviations, and conformance decisions are separately addressable append-only facts
- [ ] T014 Verify: Every verified finding binds authority epoch, subject snapshot digest, applicability decision, evidence receipts, verifier identity, proof references, and verification mode
- [ ] T015 Verify: Shared phase-012 review-loop events are reused by Deep Review and Deep Alignment without mode-local lifecycle duplication
- [ ] T016 Verify: The compatibility matrix covers exact, compatible, migrate, pin-old-runtime, degraded, blocked, unknown, expired, mixed, ambiguous, and lossy cases
- [ ] T017 Verify: The schema scope excludes reducers, projections, sealed artifacts, certificates, resume, shadow parity, rollback, authority cutover, and mode-gate behavior
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
