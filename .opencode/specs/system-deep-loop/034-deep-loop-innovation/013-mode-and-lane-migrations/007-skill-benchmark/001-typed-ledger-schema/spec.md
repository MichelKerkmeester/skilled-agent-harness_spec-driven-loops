---
title: "Feature Specification: Skill Benchmark typed ledger schema"
description: "Plan the Skill Benchmark event vocabulary over the deep-improvement-common backbone: a typed append-only envelope for paired scenario treatments, progressive skill exposure, trajectory evidence, gold integrity, raw scoring observations, and versioned contribution-certificate lifecycle facts. This phase defines event types and upcaster hooks only; reducers and projections belong to the next sibling."
trigger_phrases:
  - "Skill Benchmark typed ledger schema"
  - "skill benchmark event vocabulary"
  - "skill contribution certificate events"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T21:12:00Z"
    last_updated_by: "opencode"
    recent_action: "Bounded Skill Benchmark scope to typed event vocabulary before reducers"
    next_safe_action: "Specify event variants and upcaster hooks against phases 003 and 009"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Skill Benchmark Typed Ledger Schema

> Phase adjacency under the 007-skill-benchmark parent (grouping order, not a runtime dependency): predecessor: none (first sibling); successor: 002-reducers-and-projections.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/001-typed-ledger-schema |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop / deep-improvement-common / skill-benchmark |
| **Origin** | Phase 013 mode-and-lane migration fan-out; Skill Benchmark typed-ledger planning contract |
| **Inputs** | Parent phase map, manifest/phase-tree.json, findings-registry.json, findings-registry-modes.json |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Skill Benchmark currently needs a durable causal record of what was tested, what skill treatment was assigned, what the
executor actually discovered and loaded, which instructions or resources were exposed, how the trajectory progressed, and
what deterministic or dynamic checks scored the result. A final score or leaderboard row cannot distinguish skill content
failure from discovery failure, non-adoption, executor failure, environment incompatibility, or negative transfer. The
research therefore requires paired within-task and within-executor contrasts, separate availability/invocation/trajectory/
outcome stages, near-neighbor and noise controls, constraint coverage, and a versioned effect certificate with a validity
domain.

The phase plans the Skill Benchmark specialization of the typed append-only event substrate. It consumes the phase-006
transition-authorized ledger core and phase-012 shared event contracts, while reusing deep-improvement-common services for
run identity, execution descriptors, budgets, receipts, sealed artifacts, and replay metadata. It defines the event
vocabulary and field-level types that capture Skill Benchmark facts. It does not define reducers, materialized projections,
attribution estimation, ranking, or authority cutover; those belong to `002-reducers-and-projections` and later migration
gates.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A Skill Benchmark envelope specialization over the shared versioned append-only event envelope, including stable run,
  scenario, assignment, executor, bundle, environment, and evidence identities.
- The concrete event namespace for run planning and closure, randomized treatment assignment, scenario execution,
  discovery, progressive loading, invocation, resource-canary exposure, trajectory milestones, final outcomes, scoring
  observations, gold-integrity decisions, and effect-certificate lifecycle facts.
- Field-level types and invariants for treatment arms, paired replicates, task/environment compatibility, progressive
  disclosure stages, resource classes, milestone coverage, deterministic checks, dynamic reference functions, raw score
  axes, cost/latency observations, constraint coverage, and validity/expiry evidence.
- Versioned payload rules, event-type registration, canonical encoding, replay-fingerprint inputs, unknown-event policy,
  and pure upcaster hooks for old envelopes and payload versions.
- Schema fixtures and negative cases that prove append-only identity, hash-chain linkage, typed references, gold-policy
  blocking, and deterministic upcasting without implementing a reducer.

### Out of Scope
- Reducers, score aggregation, attribution estimates, projections, gauges, ranking, or certificate decision logic; these are
  the next sibling's concern.
- Reimplementation of deep-improvement-common run, receipt, budget, lock, continuity, sealed-artifact, executor, or
  replay services.
- Authority cutover, legacy-writer retirement, in-flight state migration, or rollout policy.
- New benchmark task content, new executor providers, or a replacement for the existing packet-033 behavior harness.
- Treating a signed skill as evidence of causal efficacy; integrity and efficacy remain distinct event facts.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every Skill Benchmark event uses the shared authorized envelope specialization | The registry names the mode, event type, payload version, stable IDs, sequence, causation/correlation, schema digests, and `prevEventHash`; malformed or unauthorized envelopes are rejected before append |
| REQ-002 | The vocabulary records an auditable run and scenario lifecycle | Planned, assigned, started, observed, finished, aborted, and closed facts carry stable references and never overwrite prior facts |
| REQ-003 | Treatment assignment makes causal contrasts explicit | No-skill/control, auto-route, forced-activation, placebo or distractor, component-ablation, and compatibility-boundary arms are typed values with seed, propensity, replicate, and design-cell metadata |
| REQ-004 | Discovery, loading, invocation, and trajectory evidence remain separate | The event registry has distinct event types and typed fields for availability, progressive disclosure, activation, resource canaries, key-point coverage, milestone state, and final outcome |
| REQ-005 | Scoring preserves raw observations and gold integrity | Deterministic checks, dynamic reference results, constraint coverage, score axes, evaluator identity, cost, latency, tokens, and gold policy/provenance are append-only facts; empty or pending gold cannot silently enter a positive numerator |
| REQ-006 | Compatibility and negative-transfer conditions are first-class | Events bind task, skill bundle, registry, executor, tool, permission, environment, dependency, and workload digests and can record negative-transfer, security, composition, and incompatibility observations |
| REQ-007 | Certificate lifecycle facts are versioned and validity-bounded | Issued, withheld, and expired effect-certificate events reference the evidence set, validity domain, confidence intervals, component ablations, compatibility slices, and expiry triggers without embedding reducer decisions |
| REQ-008 | Version changes are replay-compatible and deterministic | Event-type registration, canonical payload encoding, replay-fingerprint computation, upcaster chains, and exact/compatible/migrate/pin/block outcomes are specified and fixture-tested |
| REQ-009 | The phase leaves the reducer boundary unambiguous | No schema requires a mutable aggregate, derived score, ranking, or projection update; the next sibling can consume the event stream without changing event meaning |
<!-- /ANCHOR:requirements -->

### Typed event vocabulary

The planned registry uses namespaced immutable events with `skill_benchmark.*.vN` identifiers. The shared envelope carries
`eventId`, `eventType`, `schemaVersion`, `occurredAt`, `recordedAt`, `runId`, `logicalBranchId`, `aggregateId`,
`causationId`, `correlationId`, `sequence`, `prevEventHash`, `payload`, and typed metadata. Skill Benchmark payloads add
the following event families:

| Family | Event types | Required fact boundary |
|--------|-------------|-------------------------|
| Run and design | `run_planned`, `treatment_assigned`, `run_closed` | The immutable design cell, randomization, replicate, input digests, and terminal accounting facts |
| Scenario lifecycle | `scenario_started`, `scenario_finished`, `scenario_aborted` | One task instance, environment snapshot, executor descriptor, and terminal outcome reference |
| Skill path | `skill_discovered`, `skill_loaded`, `skill_invoked`, `resource_exposed` | Availability, progressive disclosure, activation, resource class, canary, and exposure evidence are not conflated |
| Trajectory | `milestone_observed`, `trajectory_recorded` | Ordered key-point coverage, intermediate state digest, compliance observation, and raw trace reference |
| Evaluation | `outcome_recorded`, `score_observed`, `gold_integrity_recorded` | Final-state checks, dynamic reference outputs, raw axes, constraint coverage, evaluator versions, and gold policy |
| Risk and compatibility | `compatibility_observed`, `negative_transfer_observed`, `security_probe_recorded` | Environment/dependency mismatch, cross-skill composition, safety probes, and refusal or degradation facts |
| Certificate lifecycle | `effect_certificate_issued`, `effect_certificate_withheld`, `effect_certificate_expired` | Evidence digest, validity domain, confidence interval references, and explicit freshness or expiry facts |

Each event has a closed required-field set plus an extension map reserved for a registered schema version. Free-form prose
may be retained as evidence metadata, but it cannot substitute for typed identifiers, status enums, measurements, digests,
or references required by the event contract.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reviewed Skill Benchmark event registry covers run design, paired treatments, scenario lifecycle, skill
  exposure, trajectory evidence, scoring, gold integrity, compatibility/risk, and certificate lifecycle without reducer
  semantics.
- **SC-002**: Every event fixture validates stable identity, append-only sequence/hash linkage, typed digest references,
  required treatment metadata, and explicit unknown or blocked states.
- **SC-003**: The no-skill, auto-route, forced-activation, placebo/distractor, and component-ablation cells can be represented
  without changing the envelope or smuggling assignment state into a score projection.
- **SC-004**: Replay fingerprints and pure upcasters produce deterministic current-version envelopes while preserving the
  original event identity and source-version evidence.
- **SC-005**: The next sibling can define reducers over the vocabulary without adding missing causal stages or mutating raw
  observations; strict phase validation passes for this folder.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Reducer leakage** — score, attribution, and certificate decisions may be encoded as mutable event state. Mitigation:
  retain raw observations and decision inputs as events; place aggregation and projection ownership in the next sibling.
- **Executor confounding** — absolute with-skill scores measure executor and task difficulty. Mitigation: require paired
  treatment metadata, propensity/seed, executor descriptor, and task/environment digests in every scenario cell.
- **Oracle-route inflation** — forced skill injection can hide discovery or loader failures. Mitigation: separate no-skill,
  auto-route, forced, placebo/distractor, and component-ablation events and preserve stage-specific evidence.
- **Inert gold** — empty or pending gold can create a false positive. Mitigation: type `goldPolicy`, provenance, coverage,
  and blocking status before score observations are accepted.
- **Schema drift** — changing evaluator, bundle, registry, dependency, or workload identity can invalidate old evidence.
  Mitigation: bind all certificate inputs to content digests and specify explicit upcast and expiry hooks.
- **Shared-backbone duplication** — the mode may reimplement common services. Mitigation: reference deep-improvement-common
  identities and receipts; add only Skill Benchmark scenario and scoring observation types.
- **Dependencies**: the phase-006 transition-authorized ledger core; the phase-012 shared event contracts; the
  deep-improvement-common services from mode 004; the parent phase's write-set conflict graph; and the existing benchmark
  harness used for behavior baselines.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None block authoring of the vocabulary. The execution phase must resolve the following against the frozen shared contracts:

- Which shared envelope fields are mandatory for every mode and which Skill Benchmark fields are specialized extensions?
- Which treatment-arm labels are canonical for no-skill, placebo, distractor, component-ablation, compatibility-boundary,
  auto-route, and forced-activation cells?
- Which trajectory observations are evidence-only diagnostics and which are required process constraints for a scenario?
- Which certificate fields are event facts versus reducer-derived claims, and how are confidence intervals referenced without
  embedding estimator logic in the event payload?
- What exact upcaster compatibility class applies when an evaluator, gold recipe, resource digest, or executor descriptor
  changes without changing the event shape?
<!-- /ANCHOR:questions -->
