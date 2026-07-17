---
title: "Feature Specification: Deep Improvement Common Services — Typed Ledger Schema"
description: "Plan the typed append-only event vocabulary for the shared Deep Improvement Common Services backbone: evaluator-first candidate generation, scoring, canary analysis, and guarded promotion. This phase defines the event-envelope specialization, concrete payloads, field types, schema versions, and upcaster hooks consumed by agent-improvement, model-benchmark, and skill-benchmark; reducers and projections belong to the next sibling."
trigger_phrases:
  - "deep improvement common typed ledger schema"
  - "deep improvement event vocabulary"
  - "evaluator canary promotion events"
  - "deep improvement append-only ledger"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T20:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Captured the common-service event vocabulary boundary and sibling ordering"
    next_safe_action: "Define envelope fields and versioned event payloads for shared service runs"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep Improvement Common Services — Typed Ledger Schema

> Child adjacency under `004-deep-improvement-common` (independent planning contracts, not runtime dependencies): predecessor none (first sibling); successor `002-reducers-and-projections`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/001-typed-ledger-schema |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (deep-improvement common services) |
| **Origin** | Phase 013 mode-and-lane migrations, mode 004; first child of the shared Deep Improvement Common Services migration |
| **Inputs** | Phase-006 transition-authorized ledger core; phase-012 shared event contracts; 065/002 findings registries |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The Deep Improvement Common Services backbone currently has no single typed event vocabulary for its evaluator-first
loop: candidate generation, evaluator execution, score preservation, canary analysis, and guarded promotion are shared
by three later variants but are not yet expressed as one append-only contract. Without a common event-envelope
specialization, each variant can invent incompatible identifiers, score fields, lifecycle names, or promotion
evidence, making replay, shadow parity, and shared-service ownership impossible to verify.

This phase plans the schema contract only. It consumes the phase-006 transition-authorized ledger core and the
phase-012 shared event contracts, then specializes them for Deep Improvement Common Services. The contract must keep
raw evaluator observations separate from normalization and reduction, preserve candidate and evaluator lineage, bind
canary and promotion evidence to an evaluation epoch, and expose versioned upcaster hooks. It emits vocabulary for
the next sibling's reducers and projections; it does not define those reducers.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `DeepImprovementEventEnvelope<TType, TPayload>` specialization over the imported typed ledger envelope, including identity, causal, sequencing, authorization, replay, provenance, and content-addressed reference fields.
- Concrete append-only events for run lifecycle, candidate lineage and generation, evaluator execution and observations, score normalization, canary sealing and outcomes, promotion proposal and guarded rollout, and explicit abstention/quarantine paths.
- Field-level types and constrained values for run, candidate, lineage, operator, evaluator, fixture, score, uncertainty, canary, baseline, promotion, budget, receipt, and evidence references.
- Versioned event-name and payload policy, compatibility classes, unknown-version handling, and pure upcaster hooks that preserve old payloads and record the applied schema path.
- Ownership rules for the common evaluator, canary, and promotion services reused by `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark`.

### Out of Scope
- Reducers, projections, materialized gauges, frontier calculation, archive updates, and read models; these belong to `002-reducers-and-projections`.
- Reimplementation of the phase-006 authorization gateway, ledger durability, replay fingerprint primitive, or phase-012 shared event envelope.
- Variant-only event payloads and mode-specific certificates owned by the three downstream migrations.
- Authority cutover, legacy-writer retirement, production code, and implementation tests; this is a planning-only phase.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every Deep Improvement Common Services event uses one typed envelope specialization | A schema inventory names the envelope type, required fields, field types, and serialization rules; no common event is represented as an untyped map |
| REQ-002 | The vocabulary covers the complete shared run behavior without owning reducers | Run, candidate, evaluator, score, canary, promotion, quarantine, abstention, and terminal event families are enumerated; no reducer or projection event is introduced |
| REQ-003 | Raw observations, normalized scores, and promotion evidence remain distinguishable | A candidate can carry raw evaluator observations, versioned score calculations, uncertainty, and evidence references without overwriting prior values |
| REQ-004 | Candidate, evaluator, fixture, baseline, and service lineage are replay-addressable | Every event carries stable typed identities and content-addressed or versioned references sufficient to correlate a candidate with its parent, operator, evaluator epoch, fixture set, and baseline |
| REQ-005 | Canary and promotion events are fail-closed and authorization-linked | Canary veto, inconclusive, drift, and promotion-denied states are first-class; promotion events reference an external authorization decision and cannot self-authorize a state change |
| REQ-006 | Schema evolution is explicit and replay-safe | Envelope and payload versions are independent, compatibility classes are declared, unsupported versions fail closed, and pure upcaster hooks identify source and target versions in the replay fingerprint |
| REQ-007 | Shared services have one source contract for the three downstream variants | `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark` reuse the common evaluator, canary, and promotion event types and add only explicitly namespaced variant extensions |
<!-- /ANCHOR:requirements -->

The planned event union is grouped into concrete append-only names: `deep_improvement_run_started`,
`deep_improvement_run_resumed`, `deep_improvement_run_paused`, `deep_improvement_run_completed`,
`deep_improvement_candidate_proposed`, `deep_improvement_candidate_generated`,
`deep_improvement_candidate_rejected`, `deep_improvement_evaluation_epoch_sealed`,
`deep_improvement_evaluation_observation_recorded`, `deep_improvement_evaluation_normalized`,
`deep_improvement_evaluation_inconclusive`, `deep_improvement_canary_suite_sealed`,
`deep_improvement_canary_executed`, `deep_improvement_canary_vetoed`,
`deep_improvement_promotion_proposed`, `deep_improvement_promotion_authorized`,
`deep_improvement_promotion_denied`, `deep_improvement_promotion_paused`,
`deep_improvement_promotion_aborted`, and `deep_improvement_promotion_completed`. The final catalog may add
failure and quarantine companions, but it must not replace these lifecycle facts with mutable status fields.

The event vocabulary must preserve the distinction between observation and judgment. A raw observation records what an
evaluator returned for a fixture and candidate; normalization records the versioned transformation; a score decision or
promotion proposal records the policy result and evidence references. The schema must never replace a prior observation
with a later score or treat a successful target-task score as sufficient promotion authority.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The phase produces a reviewed event catalog with stable names, payload types, required fields, compatibility class, and owner for every shared Deep Improvement Common Services event.
- **SC-002**: The envelope contract can correlate a complete run from `run_started` through candidate generation, evaluator observations, scoring, canary analysis, and guarded promotion or quarantine without mutable state.
- **SC-003**: The common evaluator, canary, and promotion types are reusable by the three downstream variants without copying or weakening their evidence and authorization fields.
- **SC-004**: Upcaster hooks specify source version, target version, pure transformation boundary, failure behavior, and replay-fingerprint contribution for every planned schema migration.

**Given** a candidate emits raw evaluator observations, **When** a later normalization policy changes, **Then** the original observations remain addressable and a new versioned score event can be replayed without mutation.

**Given** a canary detects leakage, drift, or an invariant violation, **When** the promotion service evaluates the candidate, **Then** it emits a typed veto or quarantine event and cannot emit an authorized promotion without an external transition decision.

**Given** a downstream variant runs the shared evaluator service, **When** it selects a fixture profile or score policy, **Then** its events use the common envelope and identify the variant through a namespaced extension rather than a forked common schema.

**Given** a replay sees an older supported payload version, **When** the upcaster chain is applied, **Then** it produces the current typed payload, records the source-to-target path, and rejects ambiguous or unsupported conversion.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The primary dependency is the phase-006 transition-authorized ledger core and its fail-closed append boundary, plus the
phase-012 shared event contracts that define common identity, causation, sequence, receipt, and replay fields. The
phase also depends on the 065/002 mode findings: preserve raw evaluator artifacts, use a versioned evaluator capsule,
rotate and seal canary epochs, keep optimization reward separate from oversight, and make promotion uncertainty-aware.

Phase-specific risks are schema drift between the common service and its three consumers, accidental reducer logic
hidden in event definitions, unbounded payload growth from raw traces, evaluator or canary leakage, and false promotion
confidence from one scalar score. Mitigations are a single event catalog, reference fields for large artifacts,
separate observation and judgment types, sealed evaluator epochs, typed abstention and insufficient-evidence states,
and an explicit handoff to `002-reducers-and-projections`.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No blocking questions for the planning contract. The implementation pass must resolve the exact type aliases and
serialization library against the imported phase-006 and phase-012 contracts, choose the final event-name namespace,
and confirm the maximum inline payload size before code lands. The next sibling owns reducer input ordering, projection
keys, frontier semantics, and materialized read models; those decisions must not be pulled into this schema phase.
<!-- /ANCHOR:questions -->
