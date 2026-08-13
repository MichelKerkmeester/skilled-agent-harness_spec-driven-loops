---
title: "Implementation Plan: Agent Improvement — Typed Ledger Schema"
description: "Implemented additive-dark Agent Improvement typed ledger schema over the shared Deep Improvement Common Services event, authorization, replay, and compatibility contracts."
trigger_phrases:
  - "agent improvement typed ledger implementation plan"
  - "typed AgentIR event schema plan"
  - "agent improvement causal event plan"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/001-typed-ledger-schema"
    last_updated_at: "2026-07-23T14:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the additive-dark Agent Improvement typed ledger schema"
    next_safe_action: "Consume the exported event union in 002-reducers-and-projections"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/agent-improvement-ledger-types.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/agent-improvement-ledger-schema.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/legacy-compatibility.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/agent-improvement-ledger-schema.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Agent Improvement — Typed Ledger Schema

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / Agent Improvement variant |
| **Change class** | Typed event schema and variant event vocabulary |
| **Execution** | Complete; additive-dark schema extending the frozen mode-004 common contract |

### Overview
The phase defines one Agent Improvement event contract over the mode-004 Deep Improvement Common Services backbone.
The schema records typed AgentIR and agent-definition lineage, change contracts, localized mutation proposals,
failure-derived causal experiments, behavior coverage, evaluation-manifest exposure, executor transfer, and
behavioral change classification. It reuses common candidate, evaluation, canary, promotion, receipt, and
authorization events, preserves raw evidence, and leaves reducers and projections to
`002-reducers-and-projections`.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase-006 envelope, authorization, sequence, receipt, and replay contracts are available for direct type alignment [Evidence: targeted Vitest exercises the real transition gateway, append-only ledger, shared envelope, and replay metadata]
- [x] Phase-012 shared event contracts and naming rules are available for specialization [Evidence: the module imports shared envelope and registry types instead of declaring an alternate substrate]
- [x] Mode-004 common evaluator, canary, promotion, and receipt ownership is available for reuse [Evidence: the 35 common definitions retain their shared contracts and gain only the Agent Improvement variant guard in this lane's 50-stem registry]
- [x] The Agent Improvement event catalog covers AgentIR compilation, mutation lineage, causal experiments, behavior coverage, manifest exposure, transfer, and terminal paths [Evidence: all 15 extension stems pass the authorized append/readback matrix]
- [x] Every event payload has explicit field types, identity references, and independent envelope/payload version policy [Evidence: closed payload/scope maps and independent-version rejection tests pass]
- [x] Reducer, projection, frontier, materialized-gauge, and mode-gate behavior is excluded from this child [Evidence: scoped source audit and public exports contain schema, compatibility, and preparation surfaces only]

### Definition of Done
- [x] A reviewed typed envelope specialization and Agent Improvement event union are implemented [Evidence: `AgentImprovementLedgerEvent` covers 50/50 registered stems]
- [x] AgentIR, change-contract, causal-experiment, manifest, coverage, and transfer fields are replay-addressable [Evidence: every extension payload uses stable references, digests, and typed scopes]
- [x] Common evaluator, canary, promotion, receipt, and authorization types are reused without duplication [Evidence: `deepImprovementCommonEventDefinitions()` supplies the common registry surface]
- [x] Upcaster hooks, compatibility classes, and fail-closed unknown-version behavior are implemented [Evidence: compatibility and legacy-upcast adversarial tests pass]
- [x] Handoff inputs and ownership boundaries for `002-reducers-and-projections` are explicit [Evidence: spec scope and implementation summary exclude reducers and projections]
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Specialize the imported common contract as `AgentImprovementEventEnvelope<TType, TPayload>` with required `eventId`, `eventType`, `schemaVersion`, `payloadVersion`, `occurredAt`, `runId`, `producer`, `sequence`, `causationId`, `correlationId`, `payload`, `payloadHash`, `replayFingerprint`, and `transitionAuthorizationRef` fields; use nullable fields only where the event lifecycle proves they are absent.
- Define typed identity aliases for `AgentDefinitionId`, `AgentIrId`, `AgentChangeId`, `ClauseId`, `ComponentId`, `MutationId`, `MutationOperatorId`, `BehaviorFamilyId`, `ScenarioId`, `TraceId`, `ExperimentId`, `InterventionId`, `ExecutorFamilyId`, `ManifestId`, `ExposureEpochId`, and `TrialId`; prohibit free-form identity strings in variant payloads.
- Represent AgentIR as a content-addressed definition graph with named components, inheritance edges, mutable versus immutable loci, capability and verifier policy references, and a schema version. A change contract binds the base definition, candidate patch, intended obligations, preserved obligations, affected families, and behavioral-semver impact.
- Partition variant event names into definition/change, causal experiment, behavior coverage, manifest/exposure, transfer, and classification families. Reuse mode-004 run, candidate, evaluation, canary, promotion, quarantine, and terminal events rather than cloning them.
- Keep raw traces, failure observations, intervention results, executor metadata, and verifier outputs immutable and separate from textual gradients, normalized scores, attribution judgments, and reducer-owned frontier views. Large artifacts are digest-bound references.
- Define `upcastAgentImprovementEvent(event, targetVersion)` as a pure hook selected by event type and payload version. It returns a typed payload plus an ordered conversion path; missing, ambiguous, or lossy conversions fail closed and never fabricate an AgentIR component, clause, trace, or outcome.
- Treat reducers and projections as consumers of this event union. The next sibling owns candidate-frontier folding, coverage aggregation, score views, materialized gauges, and projection fingerprints; this child provides only stable event inputs.

### Envelope field contract

| Field group | Planned type | Contract |
|-------------|--------------|----------|
| Event identity | `EventId`, `AgentImprovementEventType`, `SchemaVersion`, `PayloadVersion` | Branded identifiers; event type is a closed union; envelope and payload versions are independent |
| Time and order | `Timestamp`, `Sequence`, `Hash` | RFC3339 timestamp, monotonic producer sequence, and previous-tail/content hashes from the imported core |
| Run and candidate | `RunId`, `CandidateId`, `AgentDefinitionId`, `AgentChangeId`, `ParentCandidateId?` | Stable correlation through proposals, retries, mutations, variants, and resume; no positional-only identity |
| Agent structure | `AgentIrRef`, `ComponentRef`, `ClauseRef`, `InheritanceGraphRef`, `MutableLocus` | Content-addressed AgentIR and clause/component references distinguish changed loci from inherited or immutable material |
| Causal evidence | `TraceRef`, `ExperimentRef`, `InterventionRef`, `FailureRef`, `AttributionRef?` | Raw observations and counterfactual results remain addressable without asserting causal proof in the producer event |
| Evaluation | `BehaviorFamilyRef`, `ScenarioSetRef`, `ExecutorRef`, `VerifierRef`, `TrialRef`, `ManifestRef` | Evaluation identity includes behavior family, task semantics, executor, verifier, and exposure epoch |
| Evidence and effects | `EvidenceRef[]`, `ReceiptRef[]`, `ArtifactRef[]`, `BudgetRef?` | References are immutable and point to sealed traces, manifests, receipts, or reports rather than mutable paths |
| Decisions | `AuthorizationRef?`, `PolicyRef`, `Outcome`, `CompatibilityClass` | Promotion and quarantine facts cite external authorization and typed policy outcomes; no candidate score self-authorizes |
| Payload | `AgentImprovementPayload` | Closed discriminated union selected by `eventType`; unknown extensions are rejected unless explicitly namespaced |
| Replay | `ReplayFingerprint`, `UpcastPath[]` | Fingerprint includes schema path, AgentIR digest, evaluator capsule, manifest epoch, executor/verifier references, policy, and imported core fields |

### Concrete event families

| Family | Event types | Agent Improvement responsibility |
|--------|-------------|-----------------------------------|
| Reused run and candidate | Mode-004 `deep_improvement_run_*`, `deep_improvement_candidate_*` | Establish run identity, candidate lineage, operator provenance, and terminal facts through the common service contract |
| Definition and change | `definition_snapshot_sealed`, `agent_ir_compiled`, `change_contract_compiled`, `mutation_proposed`, `mutation_rejected` | Bind base/candidate definitions, inheritance, mutable loci, operator lineage, intended obligations, and schema-valid patch facts |
| Causal experiment | `trace_sliced`, `behavior_experiment_sealed`, `known_defect_injected`, `counterfactual_replayed`, `ablation_completed` | Record failure localization, declared interventions, clean/perturbed controls, repeated replays, and attribution uncertainty |
| Behavior and manifest | `behavior_coverage_recorded`, `evaluation_manifest_sealed`, `fixture_exposure_recorded`, `transfer_trial_recorded` | Preserve clause, authority-conflict, negative-capability, side-effect, perturbation, executor, and exposure evidence |
| Reused evaluation and promotion | Mode-004 evaluation, canary, promotion, receipt, and authorization events | Carry raw trials, versioned normalization, sealed canary outcomes, external authorization, rollout, denial, quarantine, and rollback references |
| Classification | `behavioral_change_classified` | Record patch/minor/major impact and affected or regressed behavior families without folding the classification into a reducer |
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the phase-006 transition-authorized ledger core, phase-012 shared event contracts, and mode-004 common-service vocabulary are the authoritative inputs.
- Inventory the Agent Improvement run boundaries and identify which identities, fields, and event types must be imported from mode 004 versus added as namespaced variant extensions.
- Freeze the phase boundary: no reducer, projection, frontier, read-model, mode-gate, certificate, authority-cutover, or common-service reimplementation enters this child.

### Phase 2: Implementation
- Define the envelope specialization, identity aliases, AgentIR references, mutable-locus union, scalar/value types, artifact references, authorization references, and replay-fingerprint inputs.
- Define definition and change events for snapshot sealing, AgentIR compilation, inherited-clause binding, change-contract compilation, mutation proposal, schema rejection, and candidate lineage attachment.
- Define causal experiment events for trace slicing, behavior-experiment sealing, known-defect injection, counterfactual replay, ablation, and attribution uncertainty without embedding reducer state.
- Define behavior and manifest events for clause/authority/transition/side-effect coverage, four-ring manifest sealing, exposure and retirement, executor transfer, and behavioral-semver classification.
- Specify the imported mode-004 event boundary for evaluator observations, score normalization, canaries, promotion, receipts, and external authorization; define the namespaced extension rule instead of copying common events.
- Specify required versus optional fields, producer ownership, payload hashes, digest-bound references, independent envelope/payload versions, compatibility classes, pure upcaster hooks, replay-fingerprint inputs, and fail-closed unsupported-version behavior.

### Phase 3: Verification
- Review the event catalog against the full Agent Improvement run lifecycle and prove each variant requirement has a named event and typed payload.
- Check that AgentIR and change lineage, raw traces, interventions, evaluator observations, manifest exposure, transfer evidence, and promotion references remain separately addressable.
- Exercise the planned schema compatibility matrix for current, supported historical, unsupported, missing-field, ambiguous, and lossy payload versions.
- Verify that common evaluator, canary, promotion, receipt, and authorization events are imported from mode 004 and that no reducer, projection, frontier, or materialized state is specified in this child.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Schema-shape review and serialization fixtures prove every variant event uses `AgentImprovementEventEnvelope` and no untyped payload remains |
| REQ-002 | Event-catalog coverage matrix maps AgentIR, change, mutation, causal, behavior, manifest, transfer, classification, and terminal behavior to one event family and flags reducer/projection leakage |
| REQ-003 | Lineage fixtures follow base definition, AgentIR, inheritance graph, clause/component locus, mutation operator, candidate, and parent candidate identities through replay |
| REQ-004 | Paired fixtures retain raw traces, failures, interventions, executor/verifier metadata, observations, normalized scores, and judgments as separate immutable references |
| REQ-005 | Negative fixtures cover invalid patch operations, missing clause coverage, authority conflicts, negative capability, side-effect failures, known-defect attribution uncertainty, and insufficient evidence |
| REQ-006 | Consumer contract review confirms mode-004 evaluator/canary/promotion/receipt/authorization events are reused and variant extensions cannot weaken their fields |
| REQ-007 | Upcaster fixtures cover current, supported historical, unknown, missing-field, ambiguous, and lossy payload versions; source-to-target paths contribute deterministically to replay fingerprints |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The direct inputs are the phase-006 transition-authorized ledger core, phase-012 shared event contracts, and mode-004
Deep Improvement Common Services typed vocabulary. The planning evidence is
`002-deep-loop-effectiveness-and-fanout/research/findings-registry.json` and
`findings-registry-modes.json`, especially the findings on typed AgentIR, causal slicing, Pareto candidate lineages,
sealed evaluator epochs, four-ring manifests, critical-family gates, isolated verifiers, and cross-executor transfer.
The downstream consumer is `002-reducers-and-projections`; later Agent Improvement children own sealed artifacts,
certificates, resume, shadow parity, rollback, and the mode gate.

The phase must not depend on an implementation choice for SQLite, JSONL layout, reducer storage, candidate-frontier
folding, materialized gauges, or production authority cutover. Those choices belong to the imported core, mode 004,
the next sibling, or later migration gates.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This module is additive-dark and performs no data migration or authoritative runtime write. Rollback is deletion or
reversion of the new schema module, its unit test, and this leaf's completion documentation; the phase-006 core,
phase-012 contracts, mode-004 services, and downstream variants remain untouched. Incompatible event versions are
rejected rather than guessed. No reducer or projection rollback is defined here because those remain owned by
`002-reducers-and-projections`.
<!-- /ANCHOR:rollback -->
