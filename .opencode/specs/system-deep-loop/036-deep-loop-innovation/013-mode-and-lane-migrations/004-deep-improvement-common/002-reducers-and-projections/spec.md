---
title: "Feature Specification: Deep Improvement Common Services - Reducers & Projections"
description: "Plan the deterministic reducers and live projections for the shared deep-improvement backbone: evaluator-first iteration, candidate generation, scoring, canary analysis, and guarded promotion. The reducers replay the typed event ledger into iteration/convergence state, an artifact index, and per-mode service status without side effects."
trigger_phrases:
  - "deep improvement reducers and projections"
  - "deep improvement common services migration"
  - "typed event ledger projections"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/002-reducers-and-projections"
    last_updated_at: "2026-07-15T20:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Bounded reducers scope to shared evaluator, canary, promotion, and status projections"
    next_safe_action: "Freeze reducer inputs and projection invariants against 001-typed-ledger-schema"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep Improvement Common Services - Reducers & Projections

> Phase adjacency under the 004 parent (grouping order, not a runtime dependency): predecessor `001-typed-ledger-schema`; successor `003-sealed-artifacts`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/002-reducers-and-projections |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (deep-improvement common services) |
| **Origin** | Child 002 of the deep-improvement common-services migration under phase 013 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The deep-improvement lanes share one evaluator-first loop: establish an evaluator epoch, generate candidates, score them, test them against canaries, and authorize guarded promotion. The three benchmark variants reuse this backbone, so their state cannot be reconstructed independently without creating divergent evaluator, scoring, and promotion semantics. The prior sibling freezes the typed event-ledger schema; this phase must define how that event sequence becomes usable state.

The current research inputs require more than a terminal score. Raw trial evidence must survive reduction-policy changes; evaluator identity must be a versioned dependency closure; candidate lineage and profile scope must remain searchable; evaluator-integrity failures must be distinct from task failures; and staged shadow/canary/promotion decisions must remain reversible. A projection that overwrites raw observations, reads mutable evaluator state, or performs I/O during replay would make the same event history produce different decisions and would prevent audit, resume, and rollback.

### Purpose

Define the pure reducers and projections for Deep Improvement Common Services. A canonical event sequence from `001-typed-ledger-schema` must fold into an identical, versioned projection containing iteration/convergence state, candidate and artifact indexes, evaluator/canary/promotion status, and per-mode status. The shared evaluator, canary, and promotion services are owned here as one source for `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark`; those variants consume the common contracts rather than redefining them. This is planning only. The per-mode 010 migrations land after the shared contracts and write-set conflict graph are frozen.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A canonical pure fold over the typed event envelope from `001-typed-ledger-schema`, including deterministic event dispatch, duplicate-event handling, schema-version checks, canonical serialization, and projection fingerprints.
- An iteration/convergence projection for evaluator epochs, candidate generation, evaluation progress, budget observations, stop reasons, unresolved evidence, and resumable loop state. It records decisions from events; it does not call an evaluator or recompute scores from mutable files.
- A content-addressed candidate and artifact index that preserves candidate lineage, mutation-operator identity, profile scope, raw trial references, normalized-score versions, receipts, and promotion-stage references without replacing raw evidence with reduced values.
- A per-mode status projection shared by deep-improvement common, `agent-improvement`, `model-benchmark`, and `skill-benchmark`, including evaluator epoch, active profile, current incumbent, candidate stage, canary stage, authority state, rollback target, and blocking vetoes.
- Common evaluator, canary, and promotion service boundaries: evaluator capsule creation and matching, trial-score reduction inputs, candidate-blind and adversarial canary outcomes, shadow/canary/ship state transitions, promotion receipts, and explicit rollback or inconclusive states.
- Replay fixtures, projection rebuild rules, incremental checkpoint boundaries, deterministic state hashes, and compatibility tests against the preceding typed event schema.

### Out of Scope

- Defining or changing the typed event envelope, event namespace, transition authorization, or append-only ledger implementation owned by `001-typed-ledger-schema`.
- Defining the canonical sealed-artifact format owned by `003-sealed-artifacts`; this phase stores immutable artifact references and lifecycle facts needed by projections.
- Implementing the three downstream variant migrations, their lane-specific candidate operators, or their independent mode gates. They consume this common source after the shared contract freeze.
- Authority cutover, legacy-writer retirement, broad runtime fan-out/fan-in changes, or the per-mode 010 migration write-set execution.
- Allowing candidate code, evaluator adapters, reducers, or projections to mutate evaluator assets, hidden fixtures, promotion policy, or persisted evidence during replay.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The reducer is a pure deterministic fold over canonical typed events | The same ordered event bytes, schema version, and reducer version produce byte-identical projection bytes and fingerprint without I/O, clock, randomness, network, or mutable configuration reads |
| REQ-002 | The fold has explicit event, ordering, duplicate, and version semantics | Duplicate event IDs are handled idempotently, unsupported versions fail closed or use a named upcaster boundary, and malformed or ambiguous ordering cannot silently advance state |
| REQ-003 | Iteration and convergence state is replayable and resumable | Fixtures reconstruct evaluator epoch, iteration, candidate progress, budget observations, convergence disposition, unresolved evidence, and stop reason from events alone |
| REQ-004 | Candidate and artifact history remains reduction-independent | The index retains candidate lineage, operator ID, profile, fixture and evaluator digests, raw trial references, costs, latency, normalized-score version, and receipt references after any score-policy change |
| REQ-005 | The shared evaluator service has a frozen, addressable epoch | Every trial and promotion decision references a matching evaluator capsule; candidate and baseline are scored against one capsule; epoch changes prevent cross-epoch comparisons |
| REQ-006 | Canary and promotion services have explicit reversible states | Projections distinguish offline acceptance, shadow, canary exposure, ship eligibility, shipped, paused, aborted, rolled back, and inconclusive, with hard vetoes and a stable rollback target |
| REQ-007 | Per-mode status is one shared contract for all four deep-improvement workstreams | Common, agent, model, and skill variants expose the same status fields and transition vocabulary while retaining profile-scoped incumbents and variant-owned metadata outside the shared projection |
| REQ-008 | Projection rebuild and incremental updates are equivalent | Replaying the complete event history and applying validated event batches from a checkpoint yield the same projection, state hash, artifact index, and per-mode status |
| REQ-009 | The service boundary keeps effects outside the fold | Reducers only return state or typed rejection; evaluator execution, canary execution, promotion writes, signatures, and rollback actions occur in event-producing services with receipts |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A golden event corpus proves complete replay and checkpointed replay produce identical projection bytes and fingerprints.
- **SC-002**: The iteration/convergence projection reconstructs progress, unresolved evidence, evaluator epoch, and stop disposition without reading candidate or evaluator files.
- **SC-003**: The artifact index preserves raw trial evidence and lineage while exposing deterministic reduced views for search, resume, and promotion review.
- **SC-004**: Evaluator, canary, and promotion services share one versioned contract with explicit hidden-evidence, veto, pause, rollback, and inconclusive states.
- **SC-005**: The per-mode status projection is consumed unchanged by the three downstream variants, with profile-scoped incumbents and no common-state fork.
- **SC-006**: Property, failure-injection, and mixed-version replay fixtures prove fail-closed behavior for malformed events, unsupported versions, epoch mismatches, missing receipts, and stale canaries.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Nondeterministic replay** - reducer access to time, random IDs, filesystem discovery, network state, or mutable evaluator configuration would make resume and audit non-reproducible. Mitigation: pass all inputs through typed events and compare canonical projection bytes plus fingerprints.
- **Evidence loss through reduction** - storing only weighted scores or the latest candidate would block recalibration, adversarial review, and causal diagnosis. Mitigation: keep append-only raw trial references and version every normalization and reduction stage.
- **Evaluator drift** - a capsule that omits fixture, grader, calibration, environment, or hidden-anchor commitments can silently change the ruler. Mitigation: require a complete evaluator epoch digest on every trial and promotion path.
- **Proxy overoptimization** - a rising aggregate can hide critical-dimension, weak-segment, evaluator-integrity, or action-trace regressions. Mitigation: project separate vetoes, lower-bound outcomes, metamorphic results, and integrity outcomes; never let aggregate score clear a critical veto.
- **Shared-contract divergence** - the three benchmark variants could add private reducer fields or fork common promotion semantics. Mitigation: publish one shared projection schema and verify each consumer against the same fixtures before the downstream 010 migrations.
- **Unclear ownership with adjacent phases** - the previous sibling owns event shape and the next sibling owns sealed artifact definition. Mitigation: this phase consumes canonical events and emits references/status only, with the adjacency line and scope table as the boundary.
- **Dependencies**: `001-typed-ledger-schema` for canonical event inputs; `003-sealed-artifacts` for immutable artifact references; phase 012 shared mode contracts and write-set conflict graph; the shipped deep-improvement shared scripts and promotion gate fixtures; the spec-kit validator.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Deferred to execution against the frozen predecessor contract:
- Which event fields are canonical reducer inputs versus opaque receipt payloads, and which upcasters are permitted before the fold?
- Is projection state materialized as one composite snapshot or independently checkpointed projection families with a shared event frontier?
- What exact ordering and duplicate policy applies when a receipt, canary result, or rollback event is observed more than once or arrives after a later event?
- Which evaluator and canary facts are safe to expose to candidate generators, and which remain terminal-only or redacted in the projection API?
- Which status fields are common across all four workstreams, and which profile-specific or variant-specific fields remain outside the common projection?
<!-- /ANCHOR:questions -->
