---
title: "Feature Specification: Agent Improvement — Typed Ledger Schema"
description: "Plan the typed append-only event vocabulary for the Agent Improvement variant: typed AgentIR and change contracts, candidate and failure lineage, causal behavior experiments, evaluation manifests, transfer evidence, and versioned envelope/upcaster hooks over the shared Deep Improvement Common Services backbone. Reducers and projections belong to the next sibling."
trigger_phrases:
  - "agent improvement typed ledger schema"
  - "agent improvement event vocabulary"
  - "typed AgentIR ledger"
  - "agent improvement append-only events"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T20:45:00Z"
    last_updated_by: "opencode"
    recent_action: "Captured Agent Improvement event ownership and sibling handoff boundary"
    next_safe_action: "Define AgentIR fields and versioned event payloads for the variant run"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Agent Improvement — Typed Ledger Schema

> Child adjacency under `001-typed-ledger-schema` (independent planning contracts, not runtime dependencies): predecessor none (first sibling); successor `002-reducers-and-projections`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/001-typed-ledger-schema |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (agent-improvement variant) |
| **Origin** | Phase 013 mode-and-lane migrations, mode 005; first child of the Agent Improvement migration |
| **Inputs** | Phase-006 transition-authorized ledger core; phase-012 shared event contracts; mode 004 Deep Improvement Common Services; 065/002 findings registries |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Agent Improvement currently needs to represent a run that proposes and scores changes to an agent definition, but its
variant-specific facts do not yet have one typed append-only vocabulary. The behavior under optimization spans a typed
AgentIR, mutable and immutable loci, inherited clauses, mutation operators, candidate lineages, failure-derived
proposals, causal interventions, behavior-family coverage, executor transfer, and controlled promotion. If those facts
are emitted as free-form JSON or folded into one score, replay cannot distinguish a changed clause from a changed
executor, raw evidence is lost when scoring policy changes, and a candidate can appear better without showing preserved
authority or safety behavior.

This phase plans the schema contract only. It consumes the phase-006 transition-authorized ledger core and phase-012
shared event contracts, then specializes the mode-004 Deep Improvement Common Services envelope and event vocabulary
for Agent Improvement. Common evaluator, canary, and promotion events are reused rather than reimplemented. The
variant adds only AgentIR, change-contract, causal-experiment, behavior-manifest, and transfer facts. It emits the
vocabulary consumed by `002-reducers-and-projections`; it does not define reducers, projections, or materialized state.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `AgentImprovementEventEnvelope<TType, TPayload>` specialization over the mode-004 `DeepImprovementEventEnvelope`, including core identity, causation, sequence, authorization, replay, provenance, and content-addressed reference fields.
- Reuse of mode-004 common events for run lifecycle, candidate lifecycle, evaluator observations and normalization, canary outcomes, and guarded promotion; no copied common-service definitions.
- Agent Improvement event families for AgentIR compilation, change-contract compilation, mutation proposal and rejection, trace slicing, behavior experiments, known-locus defect injection, counterfactual replay, ablation, clause and behavior coverage, manifest exposure, and transfer trials.
- Field-level types and constrained values for agent definitions, IR components, inheritance edges, mutable loci, clauses, mutations, behavior families, scenarios, traces, executors, interventions, manifests, exposure epochs, and causal evidence references.
- Independent envelope and payload versioning, compatibility classes, pure upcaster hooks, source-to-target paths, replay-fingerprint inputs, and fail-closed unknown or lossy conversion handling.
- Ownership rules that keep evaluator, canary, promotion, receipts, and effect-recovery behavior in the mode-004 common backbone while allowing namespaced Agent Improvement extensions.

### Out of Scope
- Reducers, projections, materialized gauges, candidate frontiers, coverage views, read models, and archive updates; these belong to `002-reducers-and-projections`.
- Reimplementation of the phase-006 authorization gateway, ledger durability, replay fingerprint primitive, phase-012 shared event envelope, or mode-004 evaluator/canary/promotion services.
- Agent Improvement sealed artifacts, transfer certificates, resume adapters, shadow parity, rollback switch, mode gate, authority cutover, legacy-writer retirement, production code, and implementation tests; this is a planning-only phase.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every Agent Improvement event uses one typed envelope specialization | A schema inventory names the envelope, required fields, field types, serialization rules, and event union; no variant event is an untyped map |
| REQ-002 | The vocabulary covers Agent Improvement run behavior without owning reducers | AgentIR, change-contract, proposal, failure-localization, experiment, coverage, manifest, transfer, and terminal event families are enumerated; no reducer or projection event is introduced |
| REQ-003 | Agent definition and mutation lineage are replay-addressable | Events correlate base and candidate definitions, AgentIR revisions, inheritance graph, clause/component loci, mutation operators, parent candidates, and generated patches through stable typed IDs and digests |
| REQ-004 | Raw execution evidence remains distinct from judgment and reduction | Traces, failures, interventions, executor metadata, raw observations, normalized scores, and policy decisions remain separately addressable and no later policy overwrites an earlier fact |
| REQ-005 | Behavior contracts and causal experiments are first-class typed facts | Change contracts, clause coverage, authority-conflict cases, negative capability, side-effect oracles, known-defect injections, counterfactual interventions, and ablation results have explicit payload types and outcomes |
| REQ-006 | Agent Improvement reuses Deep Improvement Common Services | Common evaluator, canary, promotion, receipt, and authorization events are imported from mode 004; variant extensions are namespaced and cannot weaken shared evidence or authorization fields |
| REQ-007 | Schema evolution is explicit and replay-safe | Envelope and payload versions are independent, compatibility classes are declared, upcaster hooks record the source-to-target path in the replay fingerprint, and unsupported, ambiguous, or lossy conversions fail closed |
<!-- /ANCHOR:requirements -->

The planned variant event union is grouped into concrete append-only names. It reuses mode-004 events such as
`deep_improvement_run_started`, `deep_improvement_candidate_proposed`, `deep_improvement_candidate_generated`,
`deep_improvement_evaluation_observation_recorded`, `deep_improvement_evaluation_normalized`,
`deep_improvement_canary_executed`, `deep_improvement_promotion_proposed`, and the guarded promotion outcomes. Its
Agent Improvement extension includes `agent_improvement_definition_snapshot_sealed`,
`agent_improvement_agent_ir_compiled`, `agent_improvement_change_contract_compiled`,
`agent_improvement_mutation_proposed`, `agent_improvement_mutation_rejected`,
`agent_improvement_trace_sliced`, `agent_improvement_behavior_experiment_sealed`,
`agent_improvement_known_defect_injected`, `agent_improvement_counterfactual_replayed`,
`agent_improvement_ablation_completed`, `agent_improvement_behavior_coverage_recorded`,
`agent_improvement_evaluation_manifest_sealed`, `agent_improvement_fixture_exposure_recorded`,
`agent_improvement_transfer_trial_recorded`, and `agent_improvement_behavioral_change_classified`. These are
immutable facts, not mutable frontier or status fields.

The event vocabulary must preserve the distinction between a proposed mutation, an executed candidate, an observed
trace, a causal explanation, and a promotion judgment. A textual gradient or judge rationale is diagnostic evidence,
not causal proof. A changed candidate requires fresh paired execution; stored traces can support evaluator replay but
cannot replace candidate re-execution. Promotion must retain family-level evidence, critical invariant outcomes,
executor and verifier identity, canary exposure, and rollback references without allowing a candidate score to
self-authorize.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The phase produces a reviewed Agent Improvement event catalog with stable names, typed payloads, required fields, compatibility class, and owner for every variant event and every reused common event boundary.
- **SC-002**: The envelope correlates a complete run from AgentIR and change-contract compilation through candidate generation, causal experiments, evaluator observations, canary analysis, and guarded promotion or quarantine without mutable state.
- **SC-003**: Agent definition, clause, mutation, trace, behavior family, executor, intervention, and manifest identities remain content-addressed or versioned across replay and candidate lineage.
- **SC-004**: Mode-004 common evaluator, canary, promotion, receipt, and authorization types are reused without copied definitions or weakened fields.
- **SC-005**: Upcaster hooks specify source version, target version, pure transformation boundary, failure behavior, and replay-fingerprint contribution for every planned schema migration.

**Given** an agent definition diff, **When** it is compiled for improvement, **Then** the event stream records typed mutable loci, inherited clauses, intended and preserved obligations, and the content digest of the base and candidate definitions.

**Given** a candidate fails a behavior family, **When** causal analysis runs, **Then** raw trace evidence, intervention inputs, counterfactual results, and attribution uncertainty are appended separately from any reducer-owned frontier or score view.

**Given** a replay sees an older supported variant payload, **When** the upcaster chain is applied, **Then** it produces the current typed payload, records the ordered source-to-target path, and rejects ambiguous, unsupported, or lossy conversion.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The direct contract inputs are the phase-006 transition-authorized ledger core and phase-012 shared event contracts.
Mode 004 supplies the reusable evaluator, canary, promotion, receipt, and authorization event vocabulary. The 065/002
findings require typed AgentIR, clause-level causal slicing, Pareto-preserved candidate lineage, frozen evaluator and
canary epochs, controlled feedback, critical invariant gates, family-level non-inferiority, isolated verifiers,
cross-executor transfer, and content-addressed behavioral evidence.

Phase-specific risks are schema drift from mode 004, accidental duplication of common-service events, reducer logic
hidden in frontier or coverage events, unbounded trace payloads, causal claims mistaken for proof, evaluator leakage,
and aggregate scores hiding rare-family regressions. Mitigations are a single namespaced event catalog, digest-bound
artifact references, separate observation and judgment types, explicit insufficient-evidence and abstention outcomes,
sealed manifest and exposure references, and an explicit handoff to `002-reducers-and-projections`.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No blocking questions for this planning contract. The implementation pass must resolve the exact imported type aliases
and serialization library, confirm the final Agent Improvement event namespace, set the maximum inline payload size,
and pin the canonical AgentIR component and locus unions against the shipped mode-004 contracts. It must also decide
which causal attribution fields remain diagnostic references versus reducer inputs. The next sibling owns candidate
frontier folding, coverage projections, score views, reducer ordering, and materialized read models; those decisions
must not be pulled into this schema phase.
<!-- /ANCHOR:questions -->
