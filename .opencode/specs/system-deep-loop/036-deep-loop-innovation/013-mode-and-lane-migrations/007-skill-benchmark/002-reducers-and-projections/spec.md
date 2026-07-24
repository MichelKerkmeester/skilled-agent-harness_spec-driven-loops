---
title: "Feature Specification: Skill Benchmark reducers and projections"
description: "Plan the pure reducers and live projections for the skill-benchmark migration: replay the typed skill event ledger into deterministic iteration/convergence state, artifact indexes, and per-mode status while consuming deep-improvement-common services and preserving raw scenario and scoring evidence."
trigger_phrases:
  - "skill benchmark reducers and projections"
  - "skill-benchmark typed event fold"
  - "skill contribution projection"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/002-reducers-and-projections"
    last_updated_at: "2026-07-23T12:14:56Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the additive-dark Skill Benchmark reducer extension"
    next_safe_action: "Consume the frozen projection contract from the sealed-artifact sibling"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Skill Benchmark reducers and projections

> Phase adjacency under the 007 parent (grouping order, not a runtime dependency): predecessor `001-typed-ledger-schema`; successor `003-sealed-artifacts`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/002-reducers-and-projections |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop, skill-benchmark migration lane |
| **Origin** | Phase 013 mode-and-lane migration plan; reducer/projection child after the typed-ledger-schema child |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The skill-benchmark lane needs a durable read model over the typed event log defined by predecessor `001-typed-ledger-schema`. Its useful state is not one terminal score: a run has scenario treatment arms, discovery and invocation observations, trajectory and constraint coverage, raw evaluator results, normalized scores, artifact references, and a mode-level eligibility state. Recomputing these facts from mutable run output would make resume, shadow parity, and later certificate issuance vulnerable to ordering, version, and partial-write differences.

This phase plans deterministic reducers that replay one event sequence into stable projections. The fold must be pure: no filesystem, clock, network, model, random source, or shared mutable service may affect its output. The same ordered event sequence and reducer version must produce the same iteration/convergence state, artifact index, and per-mode status. Skill-specific scenario and scoring interpretation belongs here; dispatch, budgets, receipts, locks, continuity identities, and other shared controls remain delegated to the deep-improvement-common backbone from mode 004.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The reducer input contract over the typed skill-benchmark events from `001-typed-ledger-schema`, including event ordering, duplicate handling, unknown-version handling, and replay fingerprint inputs.
- A pure iteration/convergence projection covering scenario-cell progress, required evidence coverage, eligible terminal states, blocked states, and the distinction between collection completion and certificate readiness.
- A deterministic artifact index projection covering bundle, task/environment, executor, registry, tool, permission, dependency, gold, raw-observation, score, and certificate references without creating sealed artifacts.
- A deterministic per-mode status projection covering run lifecycle, scenario-arm progress, scoring state, incompatibility, withheld/expired eligibility, and projection diagnostics.
- Skill-benchmark reducers for paired treatment contrasts, discovery/invocation/trajectory/outcome stages, gold-integrity outcomes, constraint coverage, negative transfer, and normalized scoring while retaining raw observations.
- Projection snapshots, replay fixtures, reducer-version fingerprints, and parity checks that later phases can consume for sealed artifacts, resume adapters, and the independent mode gate.
- Explicit reuse of deep-improvement-common scenario execution, evaluator plumbing, budget accounting, receipt handling, and continuity services; only skill-benchmark-specific interpretation is added here.

### Out of Scope
- Defining or changing the canonical typed event envelope, event namespace, transition vocabulary, or schema-version policy owned by `001-typed-ledger-schema`.
- Constructing, signing, sealing, issuing, expiring, or publishing the Skill Contribution Certificate; those outputs belong to successor `003-sealed-artifacts`.
- Re-implementing deep-improvement-common dispatch, evaluator, budget, receipt, lock, continuity, compatibility, or rollback services.
- Authority cutover, legacy-writer retirement, staged in-flight migration, or changes to the shared mode gate.
- New benchmark treatments beyond the approved skill-benchmark scenario and scoring contract; the phase plans the fold and projections, not a new research corpus.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Reducers are pure and deterministic | A replay harness feeds the same typed sequence repeatedly and obtains byte-equivalent canonical projections and fingerprints without external calls or mutable inputs |
| REQ-002 | Iteration and convergence state distinguishes collection from readiness | The projection records scenario-arm progress, required evidence coverage, terminal/blocked states, and certificate-readiness blockers without treating an empty or pending gold set as success |
| REQ-003 | The artifact index is complete and content-addressed | Every retained raw observation, normalized score, scenario cell, bundle/environment reference, and future certificate input has a stable typed key and digest reference; missing references remain explicit |
| REQ-004 | Per-mode status is replayable and diagnostic | The fold derives stable lifecycle, arm, scoring, compatibility, withheld, expired, and projection-error statuses from events rather than wall-clock or current filesystem state |
| REQ-005 | Skill-specific scoring is layered on shared services | Scenario treatment, paired lift, selection/invocation diagnostics, constraint coverage, negative transfer, and gold-integrity decisions call deep-improvement-common services and add no duplicate shared implementation |
| REQ-006 | Raw evidence remains separate from derived scores | Reducers retain immutable evaluator observations, canary receipts, milestone evidence, and costs alongside versioned normalization and aggregation outputs so score policy can be replayed or audited |
| REQ-007 | Reordering, duplicates, and unsupported events fail safely | Canonical ordering is defined by the predecessor schema; duplicate identities are idempotent or explicitly rejected; unsupported schema/event versions produce a typed blocked projection, never silent data loss |
| REQ-008 | Projections support downstream sealed artifacts and resume | Snapshot and replay contracts expose the stable inputs successor `003-sealed-artifacts` needs without performing sealing, and resume can rebuild the same state from the ledger prefix |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fixed skill event fixture replays to identical canonical iteration/convergence, artifact-index, and per-mode-status projections across repeated runs and supported checkpoint boundaries.
- **SC-002**: The projection distinguishes availability, invocation, trajectory compliance, constraint coverage, outcome, and scoring readiness; no empty, pending, or structural-only gold row inflates a positive result.
- **SC-003**: Skill-specific reducers consume deep-improvement-common services through frozen interfaces and leave shared dispatch, budget, receipt, and continuity behavior single-sourced.
- **SC-004**: A successor-compatible projection snapshot contains raw observations, derived score provenance, content/environment compatibility, negative-transfer signals, and explicit withheld/expired conditions.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Schema drift** — a reducer that infers fields outside `001-typed-ledger-schema` can replay differently after an event change. Mitigation: pin the predecessor schema version, reject unsupported versions, and bind projection fingerprints to the schema and reducer versions.
- **False convergence** — treating terminal task success or an empty expected set as sufficient can hide missing gold, low constraint coverage, or untested skill exposure. Mitigation: keep collection, coverage, scoring, and certificate readiness as separate states.
- **Executor confounding** — absolute with-skill scores can measure executor or task difficulty instead of skill lift. Mitigation: fold paired treatment identity and executor/task blocking metadata into the scenario and scoring projections.
- **Evidence loss** — reducing raw observations directly into one score prevents recalibration and audit. Mitigation: index immutable raw observations and derive versioned score records without overwriting them.
- **Shared-service duplication** — a mode-local implementation can diverge from deep-improvement-common behavior. Mitigation: dependency review and explicit ownership tests reject local copies of dispatch, budget, receipts, continuity, and evaluator plumbing.
- **Projection inconsistency across partial runs** — late, duplicate, or failed branch events can make a live view disagree with replay. Mitigation: define idempotency, canonical ordering, blocked states, and prefix-replay fixtures before implementation.
- **Dependencies**: predecessor `001-typed-ledger-schema`; parent phase `012` shared mode contracts and fixtures; deep-improvement-common phase `004`; successor `003-sealed-artifacts`; shared ledger, replay fingerprint, receipt, budget, continuity, and compatibility contracts from phases 006-011.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Resolved decisions:

- The landed event union supplies the complete scenario, exposure, invocation, milestone, raw-score, gold, compatibility, negative-transfer, security, and terminal vocabulary.
- Common events delegate through `DEEP_IMPROVEMENT_COMMON_FOLD_BRANCH.reducerSurface`; only `skill_benchmark.*` events write namespaced sibling projections.
- The artifact index exposes immutable references and digests plus separate raw-measurement and typed normalized-ranking records. It creates no certificate body.
- Withheld and expired certificate states are terminal for this reducer version. Issued state accepts only a typed expiry event.
- Collection, scoring, compatibility, certificate, blocker, ranking, and stream-frontier fields are diagnostic until a later mode gate explicitly consumes them.
<!-- /ANCHOR:questions -->
