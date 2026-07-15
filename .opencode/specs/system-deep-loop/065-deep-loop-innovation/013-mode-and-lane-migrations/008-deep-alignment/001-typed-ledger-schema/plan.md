---
title: "Implementation Plan: Deep Alignment - Typed Ledger Schema"
description: "Implementation Plan for the Deep Alignment typed event-schema child: define the shared review-loop envelope specialization, authority and epoch events, lane and applicability facts, verify-first finding vocabulary, proof and deviation fields, and versioned upcaster boundaries before reducers or projections are implemented."
trigger_phrases:
  - "deep alignment typed ledger implementation plan"
  - "typed authority conformance event plan"
  - "deep alignment verification ledger plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T21:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped Deep Alignment event ownership and shared review-loop handoff"
    next_safe_action: "Freeze authority, lane, and finding events against phase-009 contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep Alignment - Typed Ledger Schema

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / Deep Alignment mode |
| **Change class** | Typed event schema and mode event vocabulary |
| **Execution** | Planning-only child; implementation follows phase-003, phase-009, and shared review-loop contract freeze |

### Overview
The phase defines one Deep Alignment event contract over the phase-009 shared review-loop backbone. The schema records
authority validation and epoch identity, per-lane planning, subject snapshots, applicability, raw observations, blinded
candidate findings, independent verification, proof witnesses, conformance adjudication, visible deviations, cross-epoch
replay, and terminal handoff. It preserves `not_applicable`, unresolved, inconclusive, untested, and blocked outcomes,
reuses shared lifecycle events, and leaves reducers and projections to `002-reducers-and-projections`.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase-003 envelope, authorization, sequence, integrity, receipt, and replay contracts are available for direct type alignment
- [ ] Phase-009 shared event contracts and review-loop lifecycle rules are available for specialization
- [ ] The Deep Review shared-backbone boundary is available and no mode-local fork is required
- [ ] The event catalog covers authority epochs, lane execution, applicability, observations, candidates, proof, verification, deviations, coverage, convergence, and terminal handoff
- [ ] Every event payload has explicit field types, identity references, digest rules, and independent envelope/payload version policy
- [ ] Authority invalidity, not-applicable, unresolved, inconclusive, untested, and blocked outcomes are represented without pass coercion
- [ ] Reducer, projection, materialized-gauge, certificate, sealed-artifact, resume, shadow, rollback, and mode-gate behavior is excluded from this child

### Definition of Done
- [ ] A reviewed typed envelope specialization and Deep Alignment event union are specified
- [ ] Authority, rule, lane, subject, applicability, observation, finding, verifier, proof, deviation, and compatibility fields are replay-addressable
- [ ] Shared review-loop events are reused without duplicate lifecycle definitions
- [ ] Upcaster hooks, compatibility classes, authority-epoch checks, and fail-closed unknown-version behavior are specified
- [ ] Handoff inputs and ownership boundaries for `002-reducers-and-projections` are explicit
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Specialize the imported contract as `DeepAlignmentEventEnvelope<TType, TPayload>` with shared `eventId`, `eventType`, `schemaVersion`, `payloadVersion`, `occurredAt`, `sequence`, `causationId`, `correlationId`, `payloadHash`, `prevEventHash`, `replayFingerprint`, and `transitionAuthorizationRef` members; use nullable fields only where the shared lifecycle proves they are absent.
- Define typed identity aliases for `AlignmentRunId`, `AuthorityId`, `AuthorityCapsuleId`, `AuthorityEpochId`, `RuleId`, `RuleIrId`, `LaneId`, `SubjectId`, `SubjectSnapshotId`, `ApplicabilityDecisionId`, `ObservationId`, `CandidateId`, `FindingId`, `VerificationId`, `VerifierId`, `ProofId`, `DeviationId`, and `CompatibilityDecisionId`; prohibit free-form identity strings in mode payloads.
- Represent the authority as a digest-bound epoch with source, compiler, profile, applicability, rule-IR, coverage, signature, expiry, and rollback references. Authority validation is a prerequisite event, not a reducer assertion.
- Represent each lane as a typed obligation class (`deterministic`, `schema`, `relational`, or `reasoning-required`) with rule subset, subject snapshot, verifier policy, budget, evidence requirements, and execution references. Applicability is recorded before verification.
- Partition event names into authority/epoch, lane/subject, applicability, observation/evidence, candidate/verification, proof/adjudication, deviation, coverage/replay, and shared review-loop handoff families. Import shared run, resume, scope, pass, convergence, blocked-stop, continuity, and terminal events rather than cloning them.
- Keep raw observations, tool receipts, evidence freshness, verifier outputs, proof witnesses, and deviation assertions immutable and separate from conformance decisions or projection-owned coverage. Large bodies are digest-bound references.
- Define `upcastDeepAlignmentEvent(event, targetVersion)` as a pure hook selected by event type and payload version. It returns a typed payload plus an ordered conversion path; missing, ambiguous, expired, mixed, or lossy conversions fail closed and never fabricate authority, subject, evidence, or finding data.
- Treat reducers and projections as consumers of this union. The next sibling owns lane folds, finding state, applicability coverage, conformance views, gauges, and projection fingerprints; this child supplies stable event inputs only.

### Envelope field contract

| Field group | Planned type | Contract |
|-------------|--------------|----------|
| Event identity | `EventId`, `DeepAlignmentEventType`, `SchemaVersion`, `PayloadVersion` | Branded identifiers; closed event union; independent envelope and payload versions |
| Shared lifecycle | `RunId`, `SessionId`, `Generation`, `CausationId`, `CorrelationId` | Imported from phase-009 review-loop contract; no mode aliases |
| Authority | `AuthorityRef`, `AuthorityCapsuleRef`, `AuthorityEpochId`, `RuleIrRef` | Source, compiler, profile, applicability, signature, expiry, rollback, and rule-IR digests remain separate |
| Lane and subject | `LaneRef`, `LaneKind`, `SubjectSnapshotRef`, `ApplicabilityDecisionRef` | Immutable target snapshot and authority-specific applicability precede verification |
| Evidence | `ObservationRef`, `EvidenceRef[]`, `ReceiptRef[]`, `VerifierRef`, `Freshness` | Raw result, source class, freshness, verifier, and external body references remain separate |
| Decisions | `CandidateRef`, `FindingRef`, `ProofRef[]`, `ConformanceStatus`, `Confidence`, `Impact` | Candidate, proof, confidence, impact, verification mode, and conformance do not collapse into one score |
| Deviations | `DeviationRef`, `ScopePredicate`, `Expiry`, `InvalidationTrigger` | Overlay is scoped and chronological; original observation and finding remain addressable |
| Replay | `CompatibilityClass`, `CompatibilityDecision`, `ReplayFingerprint`, `UpcastPath[]` | Fingerprint includes authority epoch, rule IR, subject, verifier, policy, shared fields, and ordered upcaster path |

### Concrete event families

| Family | Event types | Deep Alignment responsibility |
|--------|-------------|-------------------------------|
| Authority and epoch | `authority_reference_bound`, `authority_validation_recorded`, `authority_epoch_compatibility_recorded` | Establish the named authority and prevent invalid or mixed authority from producing conformance evidence |
| Lane and subject | `lane_plan_recorded`, `lane_started`, `subject_snapshot_bound`, `lane_completed` | Bind lane obligation, subject digest, verifier policy, budget, and execution outcome |
| Applicability | `applicability_evaluated` | Preserve applicable, not-applicable, unresolved, and blocked decisions before expensive checks |
| Observation | `observation_recorded`, `evidence_receipt_bound`, `observation_reconciled` | Append analyzer output, receipt, freshness, source digest, and causal relevance without overwriting facts |
| Finding and verification | `finding_candidate_emitted`, `finding_verification_recorded` | Keep blinded detector output separate from independent verifier result and raw score vectors |
| Proof and adjudication | `proof_witness_recorded`, `claim_adjudication_recorded`, `conformance_assessment_recorded` | Carry replayable witnesses, counterevidence, assessor mode, and discrete outcome |
| Deviations | `known_deviation_recorded`, `known_deviation_invalidated` | Record visible, scoped, expiring interpretation overlays and reactivation triggers |
| Coverage and replay | `applicability_coverage_recorded`, `authority_witness_replayed` | Preserve declared applicability edges, old-authority witnesses, affected rules, and compatibility decisions |
| Shared handoff | Phase-009 review-loop convergence, blocked-stop, continuity, and terminal events | Carry mode payloads and raw gate inputs without owning reduction or projection |
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the phase-003 transition-authorized ledger core, phase-009 shared event contracts, and shared Deep Review review-loop vocabulary are the authoritative inputs.
- Inventory the Deep Alignment run boundaries and identify which authority, subject, evidence, verifier, and lifecycle types are imported versus added as namespaced extensions.
- Freeze the phase boundary: no reducer, projection, report, sealed artifact, certificate, resume, shadow, rollback, authority-cutover, or mode-gate behavior enters this child.

### Phase 2: Implementation
- Define the envelope specialization, shared scope object, identity aliases, authority epoch references, rule-IR obligation kinds, lane types, subject snapshots, scalar outcome types, receipt references, and replay-fingerprint inputs.
- Define authority events for source binding, compile/type/capability/rule-test/coverage/signature validation, expiry and rollback checks, and cross-epoch compatibility.
- Define lane and applicability events for obligation planning, subject binding, applicability predicates, not-applicable, unresolved, and blocked results before verifier dispatch.
- Define observation and finding events for raw analyzer output, evidence receipts, freshness, blinded candidates, impact/confidence axes, and source fingerprints without verdict mutation.
- Define verification and proof events for independent verifier outputs, positive/negative/boundary/stateful witnesses, shrinking, counterevidence, proof status, and verification mode.
- Define adjudication and deviation events for conformance status, known deviations, expiry, scope, issuer, verifier and authority binding, invalidation, and reactivation references.
- Define coverage and epoch-replay events for declared applicability edges, old-authority witness replay, affected-rule references, compatibility classes, and handoff to shared convergence.
- Specify required versus optional fields, producer ownership, payload hashes, digest-bound references, independent envelope/payload versions, pure upcasters, replay-fingerprint inputs, and fail-closed unsupported-version behavior.

### Phase 3: Verification
- Review the event catalog against the full Deep Alignment lifecycle and prove every authority, lane, applicability, observation, verification, proof, deviation, and terminal boundary has a named typed event.
- Check that invalid authority, not-applicable, unresolved, inconclusive, untested, and blocked states cannot be represented as conformance PASS.
- Check that raw observations, candidates, verifier judgments, proof witnesses, deviations, and conformance decisions remain separately addressable and append-only.
- Exercise the schema compatibility matrix for current, supported historical, unknown, missing-field, expired, mixed, ambiguous, and lossy payloads.
- Verify that phase-009 review-loop events are reused, Deep Review and Deep Alignment share the same backbone, and no reducer, projection, certificate, sealed artifact, resume, shadow, rollback, or mode-gate behavior is specified here.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Contract comparison and serialization fixtures prove every mode event uses `DeepAlignmentEventEnvelope` over the phase-009 envelope and no shared field is duplicated |
| REQ-002 | Event-catalog coverage matrix maps authority, epoch, lane, subject, applicability, observation, finding, proof, adjudication, deviation, replay, and terminal behavior to typed event families |
| REQ-003 | Negative fixtures reject authority parse/type/capability/rule-test/coverage/signature/expiry/rollback/mix failures before conformance PASS |
| REQ-004 | Applicability fixtures cover `applicable`, `not_applicable`, `unresolved`, and `blocked`; conformance fixtures cover `conformant`, `non_conformant`, `inconclusive`, `not_applicable`, `untested`, and `blocked` |
| REQ-005 | Paired fixtures retain raw observations, evidence receipts, candidates, verifier outputs, proof witnesses, deviations, and conformance decisions as separate immutable references |
| REQ-006 | Proof fixtures bind authority epoch, subject digest, applicability decision, evidence class, verifier digest, witness references, and verification mode; missing bindings remain candidate or inconclusive |
| REQ-007 | Upcaster fixtures cover exact, compatible, migrate, pin-old-runtime, degraded, blocked, unknown, missing-field, expired, mixed, ambiguous, and lossy inputs; paths contribute deterministically to replay fingerprints |
| REQ-008 | Shared-backbone review confirms Deep Review and Deep Alignment import the same run, pass, convergence, blocked-stop, continuity, and terminal contract without mode-local copies |
| REQ-009 | Scope audit flags any reducer, projection, sealed artifact, certificate, resume, shadow, rollback, authority-cutover, or mode-gate definition in this child |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The direct inputs are the phase-003 transition-authorized ledger core, phase-009 shared event and review-loop contracts,
and the Deep Review shared-backbone contract. The planning evidence is
`002-deep-loop-effectiveness-and-fanout/research/findings-registry.json` and
`findings-registry-modes.json`, especially the findings on authority capsule validity, typed rule IR, applicability,
proof-carrying findings, chronological deviations, authority-epoch compatibility, digest-bound receipts, and separate
conformance outcomes.

The downstream consumer is `002-reducers-and-projections`; later Deep Alignment children own sealed artifacts, certificates,
resume, shadow parity, rollback, and the independent mode gate. The phase must not depend on an implementation choice for
ledger storage, JSONL layout, verifier provider, reducer storage, materialized coverage, or production authority cutover.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This child changes planning artifacts only and has no runtime write or data migration. If the proposed schema fails review,
discard or revert the four phase documents and reopen the planning contract without touching the phase-003 core, phase-009
contracts, Deep Review shared backbone, or downstream siblings. During later implementation, keep the mode writer additive
and dark behind the existing authorization and compatibility bridge; reject incompatible, expired, mixed, or lossy events
rather than emitting guessed authority, subject, evidence, proof, or conformance data. No reducer or projection rollback is
defined here because those are owned by `002-reducers-and-projections`.
<!-- /ANCHOR:rollback -->
