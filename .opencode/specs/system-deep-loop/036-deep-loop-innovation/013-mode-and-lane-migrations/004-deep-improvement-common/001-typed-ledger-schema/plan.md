---
title: "Implementation Plan: Deep Improvement Common Services — Typed Ledger Schema"
description: "Implemented plan for the additive-dark Deep Improvement Common typed ledger schema, shared evaluator/canary/promotion vocabulary, field-level contracts, and fail-closed upcaster boundary."
trigger_phrases:
  - "deep improvement typed ledger implementation plan"
  - "common evaluator canary promotion schema plan"
  - "deep improvement envelope upcaster plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/001-typed-ledger-schema"
    last_updated_at: "2026-07-23T08:30:00Z"
    last_updated_by: "codex"
    recent_action: "Completed schema implementation and verification"
    next_safe_action: "Fold the exported union in 002-reducers-and-projections"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The shared envelope and authorized ledger remain the only authority substrate"
      - "The common schema exports closed contracts for all three downstream variants"
---
# Implementation Plan: Deep Improvement Common Services — Typed Ledger Schema

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / Deep Improvement Common Services |
| **Change class** | Typed event schema and shared service vocabulary |
| **Execution** | Implemented over frozen phase-006 and phase-012 contracts; additive-dark and non-authoritative |

### Overview
The phase defines one append-only event contract for the shared evaluator-first loop: run lifecycle, candidate lineage
and generation, raw evaluator observations, versioned score results, canary analysis, and guarded promotion. The design
must be additive over the imported ledger core, preserve raw evidence, and leave reducers and projections to
`002-reducers-and-projections`. The resulting common types are the single source consumed by
`005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark`.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase-006 envelope, authorization, sequence, receipt, and replay contracts are available for direct type alignment [Evidence: real shared imports and authorized append matrix]
- [x] Phase-012 shared event contracts and naming rules are available for specialization [Evidence: shared envelope field inventory and replay metadata contract]
- [x] Common-service ownership is separated from downstream variant extensions [Evidence: closed `variant` scope and public common payload maps]
- [x] The event catalog covers evaluator-first run behavior, canaries, guarded promotion, abstention, and quarantine [Evidence: 35-stem union]
- [x] Every event payload has explicit field types, identity references, and version policy [Evidence: exhaustive data and scope rule tables]
- [x] Reducer, projection, frontier, and materialized-gauge behavior is excluded from this child [Evidence: scoped export and import audit]

### Definition of Done
- [x] A reviewed typed envelope specialization and event union are implemented [Evidence: runtime TypeScript exit 0 and 35/35 append matrix]
- [x] Common evaluator, canary, and promotion services have one reusable event vocabulary [Evidence: exported payload and scope maps]
- [x] Upcaster hooks, compatibility classes, and fail-closed unknown-version behavior are implemented [Evidence: targeted compatibility tests]
- [x] Handoff inputs and ownership boundaries for `002-reducers-and-projections` and the three variants are explicit [Evidence: implementation summary sibling contract]
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Specialize the imported core as `DeepImprovementEventEnvelope<TType, TPayload>` with required `eventId`, `eventType`, `schemaVersion`, `occurredAt`, `runId`, `producer`, `sequence`, `causationId`, `correlationId`, `payload`, `payloadHash`, `replayFingerprint`, and `transitionAuthorizationRef` fields; use nullable fields only where the lifecycle proves they are absent.
- Define typed identity aliases for `runId`, `candidateId`, `lineageId`, `operatorId`, `evaluatorId`, `fixtureId`, `epochId`, `baselineId`, `promotionId`, and `receiptId`; prohibit free-form identity strings in common payloads.
- Partition event names into run/candidate, evaluation, scoring, canary, and promotion families. Candidate events preserve parent lineage and mutation-operator provenance; evaluator events preserve fixture and evaluator-epoch provenance; promotion events preserve baseline, canary, policy, and authorization references.
- Keep raw observations immutable and separate from normalized scores, confidence/uncertainty, and policy decisions. Large traces and artifacts are referenced by digest and receipt rather than embedded in every event.
- Model canary and promotion as append-only transitions in the vocabulary, not as mutable status fields. Include explicit `inconclusive`, `insufficient_evidence`, `vetoed`, `quarantined`, `paused`, and `aborted` outcomes.
- Define `upcast(event, targetVersion)` as a pure hook selected by source event type and payload version. It returns a typed payload plus an ordered conversion path; missing, ambiguous, or lossy conversions fail closed and never fabricate defaults.
- Treat reducers and projections as consumers of this event union. The next sibling owns folding order, projection fingerprints, frontier selection, and derived gauges; this child only provides stable inputs.

### Envelope field contract

| Field group | Planned type | Contract |
|-------------|--------------|----------|
| Event identity | `EventId`, `EventType`, `SchemaVersion` | Branded identifiers; event type is a closed union; envelope and payload versions are independent |
| Time and order | `Timestamp`, `Sequence`, `Hash` | RFC3339 timestamp, monotonic producer sequence, and previous-tail/content hashes from the imported core |
| Run lineage | `RunId`, `CandidateId`, `LineageId`, `ParentId?`, `BranchId?` | Stable correlation through candidate generation, retries, variants, and resume; no positional-only identity |
| Provenance | `ProducerRef`, `OperatorRef`, `EvaluatorEpochRef`, `FixtureSetRef`, `BaselineRef` | Each reference is versioned or digest-bound and identifies the service that produced it |
| Evidence and effects | `EvidenceRef[]`, `ReceiptRef[]`, `ArtifactRef[]`, `BudgetRef?` | References remain immutable and point to sealed artifacts or receipts rather than mutable paths |
| Decisions | `AuthorizationRef?`, `PolicyRef`, `Outcome` | Promotion and quarantine decisions cite external authorization and typed policy outcomes |
| Payload | `DeepImprovementPayload` | Closed discriminated union selected by `eventType`; unknown extensions are rejected unless namespaced |
| Replay | `ReplayFingerprint`, `UpcastPath[]` | Fingerprint includes schema path, evaluator capsule, fixture epoch, policy, and imported core fields |

### Concrete event families

| Family | Event types | Shared-service responsibility |
|--------|-------------|-------------------------------|
| Run and candidate | `run_started`, `run_resumed`, `candidate_proposed`, `candidate_generated`, `candidate_rejected`, `candidate_lineage_attached`, `run_paused`, `run_completed`, `run_aborted`, `run_quarantined` | Establish run identity, candidate lineage, operator provenance, and terminal facts |
| Evaluation | `evaluation_epoch_sealed`, `evaluation_started`, `evaluation_observation_recorded`, `evaluation_normalized`, `evaluation_verification_requested`, `evaluation_verification_recorded`, `evaluation_inconclusive`, `evaluation_failed` | Preserve raw observations, evaluator capsule, fixture identity, score inputs, uncertainty, and evidence references |
| Canary | `canary_suite_sealed`, `canary_executed`, `canary_leak_detected`, `canary_drift_detected`, `canary_invariant_failed`, `canary_gate_passed`, `canary_gate_failed` | Record sealed cross-domain and metamorphic checks without exposing protected canary material |
| Promotion | `promotion_proposed`, `promotion_authorized`, `promotion_denied`, `promotion_shadow_started`, `promotion_canary_started`, `promotion_paused`, `promotion_aborted`, `promotion_baseline_restored`, `promotion_completed` | Record guarded rollout facts and external authorization references; never compute reducer state |
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the phase-006 transition-authorized ledger core and phase-012 shared event contracts, recording their envelope fields and compatibility obligations.
- Inventory the shared evaluator, canary, and promotion service boundaries and identify which fields must be common across the three downstream variants.
- Freeze the phase boundary: no reducer, projection, read-model, authority-cutover, or variant-only event work enters this child.

### Phase 2: Implementation
- Define the envelope specialization, identity aliases, scalar/value types, reference types, and constrained outcome unions.
- Define concrete events for run start/resume/pause/terminal paths; candidate proposal/generation/rejection/lineage paths; evaluation start/observation/normalization/insufficient-evidence paths; canary seal/execution/veto/drift paths; and promotion proposal/authorization/rollout/pause/abort/complete paths.
- Specify required versus optional fields, producer ownership, event-name namespace, payload hashes, artifact references, budget/receipt references, and authorization links for every event.
- Specify independent envelope and payload versioning, compatibility classes, pure upcaster hooks, replay-fingerprint inputs, and fail-closed behavior for unsupported versions.
- Define the common-service extension rule used by `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark` without allowing downstream variants to fork shared evaluator, canary, or promotion events.

### Phase 3: Verification
- Review the event catalog against the full evaluator-first run lifecycle and prove each requirement has a named event and typed payload.
- Check that raw observations are retained, score normalization is versioned, canary evidence is sealed, and promotion authority is external and referenced rather than self-issued.
- Exercise the planned schema compatibility matrix for current, supported historical, unsupported, missing, and lossy payload versions.
- Verify the handoff to `002-reducers-and-projections` contains sufficient stable event fields without prescribing reducer behavior.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Schema-shape review and serialization fixtures prove every event uses the typed envelope and no untyped common payload remains |
| REQ-002 | Event-catalog coverage matrix maps every shared run behavior to one event family and flags reducer/projection scope violations |
| REQ-003 | Paired fixtures preserve raw observations beside independently versioned normalization and score-decision events |
| REQ-004 | Replay-correlation fixtures follow run, candidate, evaluator, fixture, baseline, epoch, receipt, and promotion identities through a complete lineage |
| REQ-005 | Negative fixtures cover canary leakage, drift, insufficient evidence, veto, quarantine, denied authorization, and self-authorization attempts |
| REQ-006 | Upcaster fixtures cover supported upgrades, no-op current versions, unknown versions, missing fields, ambiguous conversions, and lossy conversion refusal |
| REQ-007 | Consumer contract review confirms all three downstream variants import the common event types and use namespaced extensions only for variant-specific data |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The direct inputs are the phase-006 transition-authorized ledger core and phase-012 shared event contracts. The
planning evidence is `002-deep-loop-effectiveness-and-fanout/research/findings-registry.json` and
`findings-registry-modes.json`, especially the findings on raw evaluator artifacts, evaluator capsules, versioned
canary epochs, metamorphic checks, conservative promotion, and independent oversight. The downstream consumers are
`002-reducers-and-projections`, `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark`.

The phase must not depend on an implementation choice for SQLite, JSONL layout, reducer storage, or production
authority cutover. Those choices belong to the imported core, the next sibling, or later migration gates.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This child adds a dark schema module, one unit suite, and leaf-local completion records. Rollback removes those new
files and reverts this leaf's docs without touching the imported core or downstream variants. No authoritative writer
or data migration exists, and incompatible event versions remain rejected rather than guessed. Reducer or projection
rollback is not defined here because those are owned by `002-reducers-and-projections`.
<!-- /ANCHOR:rollback -->
