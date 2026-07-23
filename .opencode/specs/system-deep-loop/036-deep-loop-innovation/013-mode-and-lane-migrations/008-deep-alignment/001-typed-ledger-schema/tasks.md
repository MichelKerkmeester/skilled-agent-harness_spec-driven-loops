---
title: "Tasks: Deep Alignment - Typed Ledger Schema"
description: "Tasks for the Deep Alignment typed event-schema child: define the shared review-loop envelope specialization, authority and epoch event vocabulary, lane and applicability facts, verify-first findings, proof and deviation fields, and versioned upcaster boundary."
trigger_phrases:
  - "deep alignment typed ledger schema tasks"
  - "typed authority conformance event tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T21:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Implemented and verified the additive-dark Deep Alignment typed ledger schema"
    next_safe_action: "Fold DeepAlignmentLedgerEvent in 002-reducers-and-projections"
    blockers: []
    key_files: []
    completion_pct: 100
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

- [x] T001 Confirm the phase-006 core, phase-012 shared review-loop contracts, and Deep Review shared-backbone boundary are authoritative inputs; freeze this child as additive-dark and schema-only [Evidence: implementation summary and targeted 16-test Vitest suite]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Define `DeepAlignmentEventEnvelope` over the phase-012 envelope, including typed scope, inherited-field comparison, payload hash, authorization reference, and replay-fingerprint inputs [Evidence: implementation summary and targeted 16-test Vitest suite]
- [x] T003 Define authority, capsule, epoch, rule-IR, profile, signature, expiry, rollback, and compatibility field types plus validation event payloads [Evidence: implementation summary and targeted 16-test Vitest suite]
- [x] T004 Define lane, subject snapshot, applicability predicate, obligation kind, budget, verifier, and execution field types with explicit applicable/not-applicable/unresolved/blocked outcomes [Evidence: implementation summary and targeted 16-test Vitest suite]
- [x] T005 Define raw observation, evidence receipt, freshness, detector, candidate, impact, confidence, and source-fingerprint event payloads without verdict mutation [Evidence: implementation summary and targeted 16-test Vitest suite]
- [x] T006 Define independent verification, proof witness, counterevidence, assessor mode, and conformance assessment event payloads for positive/negative/boundary/stateful evidence [Evidence: implementation summary and targeted 16-test Vitest suite]
- [x] T007 Define known-deviation record and invalidation events with scope, issuer, authority epoch, verifier digest, rationale, expiry, and original finding references [Evidence: implementation summary and targeted 16-test Vitest suite]
- [x] T008 Define applicability coverage and old-authority witness replay events without introducing reducer-owned coverage or projection state [Evidence: implementation summary and targeted 16-test Vitest suite]
- [x] T009 Define event-version compatibility classes, pure upcaster hooks, ordered conversion paths, replay-fingerprint contributions, and fail-closed unknown/ambiguous/lossy behavior [Evidence: implementation summary and targeted 16-test Vitest suite]
- [x] T010 Record the shared review-loop event boundary with Deep Review and reject duplicated run, pass, convergence, blocked-stop, continuity, and terminal definitions [Evidence: implementation summary and targeted 16-test Vitest suite]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Verify: The event catalog covers authority binding and validation, epoch compatibility, lane execution, applicability, observations, findings, proof, verification, adjudication, deviations, replay, and terminal handoff [Evidence: implementation summary and targeted 16-test Vitest suite]
- [x] T012 Verify: Authority invalidity cannot emit conformance PASS, and not-applicable/unresolved/inconclusive/untested/blocked states remain explicit [Evidence: implementation summary and targeted 16-test Vitest suite]
- [x] T013 Verify: Raw observations, candidates, verifier results, proof witnesses, deviations, and conformance decisions are separately addressable append-only facts [Evidence: implementation summary and targeted 16-test Vitest suite]
- [x] T014 Verify: Every verified finding binds authority epoch, subject snapshot digest, applicability decision, evidence receipts, verifier identity, proof references, and verification mode [Evidence: implementation summary and targeted 16-test Vitest suite]
- [x] T015 Verify: Shared phase-012 review-loop events are reused by Deep Review and Deep Alignment without mode-local lifecycle duplication [Evidence: implementation summary and targeted 16-test Vitest suite]
- [x] T016 Verify: The compatibility matrix covers exact, compatible, migrate, pin-old-runtime, degraded, blocked, unknown, expired, mixed, ambiguous, and lossy cases [Evidence: implementation summary and targeted 16-test Vitest suite]
- [x] T017 Verify: The schema scope excludes reducers, projections, sealed artifacts, certificates, resume, shadow parity, rollback, authority cutover, and mode-gate behavior [Evidence: implementation summary and targeted 16-test Vitest suite]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [Evidence: implementation summary and targeted 16-test Vitest suite]
- [x] All requirements in spec.md met with evidence [Evidence: implementation summary and targeted 16-test Vitest suite]
- [x] Phase gate green (validate/build/test as applicable) [Evidence: Vitest 16/16 and strict validation exit 0]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
