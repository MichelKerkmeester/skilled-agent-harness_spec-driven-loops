---
title: "Feature Specification: Agent Improvement - Reducers & Projections"
description: "Plan the deterministic reducers and live projections for the Agent Improvement migration: agent-loop proposal generation, AgentIR mutation lineage, evaluator scoring, and convergence state replayed from the typed event ledger while reusing the deep-improvement-common evaluator, canary, and promotion services."
trigger_phrases:
  - "agent improvement reducers and projections"
  - "agent improvement typed ledger projections"
  - "agent loop proposal state migration"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/002-reducers-and-projections"
    last_updated_at: "2026-07-15T20:45:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped Agent Improvement projections to pure replay and common-service references"
    next_safe_action: "Freeze AgentIR event inputs and projection invariants against the typed-ledger schema"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Agent Improvement - Reducers & Projections

> Phase adjacency under the 005 parent (grouping order, not a runtime dependency): predecessor `001-typed-ledger-schema`; successor `003-sealed-artifacts`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/002-reducers-and-projections |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (agent-improvement mode) |
| **Origin** | Phase 002 of the Agent Improvement migration under phase 013 |
| **Depends on** | None (`[]`); runtime composition uses the preceding typed-ledger schema and the shared deep-improvement-common services |
| **Outcome** | Deterministic Agent Improvement reducers and projections over the typed event log, with common evaluator/canary/promotion services reused rather than reimplemented |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Agent Improvement evolves an agent loop rather than a single prompt: it proposes changes to a typed AgentIR, evaluates
those changes across behavior families, retains failure-derived guidance, and selects candidates for later canary and
promotion decisions. The migration's preceding sibling defines the mode event vocabulary, but an event stream alone does
not provide the live iteration frontier, the searchable candidate lineage, or the mode status required for resume,
shadow parity, and the later authority gate.

The research inputs require the reducer to preserve the first divergent trace event and its component attribution,
separate raw evaluator observations from normalized scores, retain per-case and per-objective Pareto structure, and
measure coverage over AgentIR clauses, authority conflicts, state transitions, and environmental perturbations. The
reducer must not collapse these facts into one aggregate score or infer improvement from task-count success alone.

### Purpose

Define the pure Agent Improvement fold and its three live projection families: iteration/convergence state, a
content-addressed candidate and artifact index, and the shared per-mode status view. The fold consumes the canonical
typed events from `001-typed-ledger-schema`, composes with the shared evaluator, canary, and promotion contracts from
mode `004-deep-improvement-common`, and adds only Agent Improvement-specific state such as AgentIR component lineage,
behavior-family coverage, failure-gradient references, and profile-scoped candidate frontiers. An identical ordered
event sequence and reducer version must always produce identical projection bytes. This is planning only; the 010
migrations land after phase 009 freezes the shared contracts and emits the write-set conflict graph.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A canonical pure fold over the typed Agent Improvement event envelope from `001-typed-ledger-schema`, including
  deterministic dispatch, stable event identity, sequence/frontier checks, duplicate handling, schema-version checks,
  canonical serialization, and a projection fingerprint.
- An iteration/convergence projection for run and iteration identity, AgentIR proposal frontier, parent and incumbent
  relationships, first-divergent trace evidence, failure-gradient references, behavior-family coverage, budget
  observations, unresolved evidence, stop disposition, and a resumable event frontier.
- A content-addressed candidate and artifact index for AgentIR versions and component-level mutations across role,
  instructions, tools, routing, memory, verifier policy, and inference configuration. It preserves lineage, operator
  identity, profile scope, raw trial references, evaluator and fixture digests, normalized-score versions, costs,
  latencies, canary references, and receipt links without replacing raw evidence with reduced values.
- An Agent Improvement per-mode status projection containing evaluator epoch, active operational profile, incumbent or
  profile-specific champion, candidate stage, canary stage, authority posture, rollback target, behavior-family
  coverage, and blocking vetoes. It uses the common status vocabulary and retains variant metadata in a namespaced
  extension.
- Composition with the deep-improvement-common evaluator, canary, and promotion services: consume their epoch,
  capsule, lifecycle, veto, receipt, and rollback references; do not reimplement their reducers, scoring policy,
  canary lifecycle, promotion transitions, or sealing primitives.
- Candidate-facing redacted projection views, checkpoint and rebuild rules, incremental batch-frontier handling,
  mixed-version fixtures, and shadow-parity fixtures against the legacy Agent Improvement behavior.

### Out of Scope

- Defining or changing the Agent Improvement typed event envelope, event namespace, transition authorization, or
  append-only ledger implementation owned by `001-typed-ledger-schema` and the shared ledger substrate.
- Reimplementing the deep-improvement-common evaluator, canary, promotion, certificate, receipt, or sealed-artifact
  services. This phase references their outputs and contracts and adds only Agent Improvement-specific projections.
- Defining the common sealed-artifact format owned by `003-sealed-artifacts`; this phase records immutable references,
  lifecycle facts, and digest links needed by its projections.
- Implementing Agent Improvement proposal operators, AgentIR mutation execution, evaluator execution, canary execution,
  promotion effects, or the independent mode gate. Those services produce events consumed by this fold.
- Authority cutover, legacy-writer retirement, broad fan-out/fan-in changes, or the per-mode 010 migration write-set.
- Allowing reducers or projections to read mutable AgentIR files, evaluator assets, hidden fixtures, network state,
  clocks, randomness, or promotion state during replay.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The Agent Improvement reducer is a pure deterministic fold | The same ordered canonical event bytes, schema version, and reducer version produce byte-identical projection bytes and fingerprint without I/O, clock, randomness, network, or mutable configuration reads |
| REQ-002 | Event ordering, identity, duplicate, and version semantics are explicit | Duplicate event IDs are idempotent, malformed or ambiguous order fails closed, unsupported versions use a named upcaster boundary or reject, and no reducer invents missing AgentIR identity |
| REQ-003 | Iteration and convergence state is replayable and resumable | Fixtures reconstruct proposal frontier, iteration progress, first divergent trace evidence, failure-gradient references, behavior coverage, budget observations, unresolved evidence, stop disposition, and resume frontier from events alone |
| REQ-004 | AgentIR candidate history remains reduction-independent | The index preserves component-level mutation lineage, parent and incumbent links, operator identity, profile scope, raw trial references, evaluator and fixture digests, costs, latency, and versioned score views after reduction-policy changes |
| REQ-005 | Agent Improvement-specific behavior coverage is durable | Clause, authority-conflict, state-transition, environmental-perturbation, executor, and behavior-family coverage are represented as immutable evidence references rather than inferred from aggregate task count |
| REQ-006 | Common evaluator, canary, and promotion services are reused | Every trial and promotion status references the shared evaluator epoch and service contracts; no Agent Improvement reducer duplicates score normalization, canary lifecycle, promotion admissibility, veto, or rollback semantics |
| REQ-007 | The Agent Improvement status projection uses the shared mode contract | Common status fields and transition vocabulary match deep-improvement-common while AgentIR frontier, profile champions, and mutation metadata remain namespaced variant state |
| REQ-008 | Full and checkpointed replay are equivalent | Complete-history replay and validated checkpoint batches produce identical iteration state, artifact index, status projection, canonical bytes, and fingerprints; incompatible checkpoints refuse safely |
| REQ-009 | Projection views enforce the service information boundary | Candidate generators receive only permitted redacted commitments or verdict bands; hidden fixtures, exact evaluator internals, raw rationales, and terminal evidence are unavailable through projection reads |
| REQ-010 | Dark projection failures preserve legacy authority | A fold, checkpoint, common-service reference, or projection failure is observable and blocks later parity evidence without changing legacy outputs, state, schemas, or runtime authority before cutover |
<!-- /ANCHOR:requirements -->

### Agent Improvement projection contract

The iteration/convergence projection records the current evaluator epoch, AgentIR lineage frontier, candidate work
states, per-profile incumbent relationships, first divergent trace location, actionable failure-gradient references,
coverage obligations, convergence signals, budget observations, unresolved evidence, and stop reason. It records event
decisions and content-addressed evidence; it never reruns an evaluator or recomputes a score from mutable artifacts.

The candidate/artifact index keeps each candidate component change addressable. A candidate may improve role and routing
while regressing verifier policy or tool discipline, so the projection retains per-case and per-objective observations,
Pareto-frontier membership, behavioral descriptors, and evaluator-integrity outcomes. Aggregate score is a queryable view,
not a replacement for raw trials, critical vetoes, or profile-scoped champions.

The per-mode status projection consumes the common evaluator epoch, canary, promotion, receipt, and rollback references.
Agent Improvement adds only its AgentIR frontier, active mutation operator, profile route, coverage state, and failure
class summary. Shared service transitions remain authoritative for their own fields and are not shadowed by variant-local
status values.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A golden Agent Improvement event corpus proves complete replay and checkpointed replay produce identical
  iteration/convergence, artifact-index, per-mode status, projection bytes, and fingerprints.
- **SC-002**: The iteration projection reconstructs AgentIR proposal progress, first-divergent evidence, failure
  gradients, behavior-family coverage, unresolved evidence, evaluator epoch, and stop disposition without reading files.
- **SC-003**: The artifact index preserves component lineage, raw trial evidence, evaluator/fixture digests, score-policy
  versions, Pareto membership, and receipt references while exposing deterministic reduced views.
- **SC-004**: Agent Improvement consumes the deep-improvement-common evaluator, canary, and promotion contracts without
  reimplementing their stage transitions, veto semantics, receipts, rollback target, or sealed inputs.
- **SC-005**: Candidate-facing projections redact hidden evaluator material and cannot turn aggregate score into promotion
  eligibility when critical behavior, integrity, canary, or rollback vetoes remain.
- **SC-006**: Property, failure-injection, mixed-version, and shadow-parity fixtures prove fail-closed behavior without
  changing the legacy Agent Improvement path or making the dark projection authoritative.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Nondeterministic replay** - reducer access to time, random IDs, filesystem discovery, network state, or mutable
  evaluator configuration would make resume and parity non-reproducible. Mitigation: all replay inputs arrive through
  typed events or immutable references, and canonical projection bytes are compared across clean processes.
- **AgentIR lineage collapse** - indexing only whole-agent candidates can hide which component caused a gain or
  regression. Mitigation: retain component-level parent links, mutation operators, first-divergent trace attribution,
  and per-objective evidence.
- **Proxy overoptimization** - aggregate score can rise while authority handling, tool discipline, integrity, or weak
  profiles regress. Mitigation: project behavior-family coverage, independent canary outcomes, critical vetoes, and
  profile-scoped frontiers separately from scalar score.
- **Common-service fork** - Agent Improvement could copy evaluator, canary, or promotion logic and drift from the three
  shared variants. Mitigation: use common service identities and contract fixtures; variant reducers store references,
  not replacement lifecycle decisions.
- **Evaluator epoch drift** - candidate and baseline evidence can become incomparable when fixtures, calibration,
  normalization, or environment changes. Mitigation: require one shared evaluator capsule/epoch reference on every
  trial and promotion-related projection entry.
- **Information leakage** - exact hidden fixtures, scores, or rationales can train the improver against the evaluator.
  Mitigation: expose only the common service's permitted redacted view and record access violations as blocking evidence.
- **Authority drift** - a projection cache or dark reducer could accidentally control live execution. Mitigation: keep
  legacy state authoritative, make projection failures observable, and defer authority changes to phase 014.
- **Dependencies**: `001-typed-ledger-schema` for canonical event inputs; mode `004-deep-improvement-common` for shared
  evaluator, canary, promotion, status, and receipt contracts; `003-sealed-artifacts` for immutable artifact references;
  phase 012 shared mode contracts and write-set conflict graph; existing Agent Improvement scripts and fixtures; and the
  spec-kit validator.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Deferred to execution against the frozen predecessor and common-service contracts:
- Which AgentIR component fields are reducer-addressable state and which remain opaque content-addressed artifacts?
- Which event ordering and duplicate policy applies when a component mutation, failure gradient, or evaluator receipt is
  observed more than once or arrives after a later profile-frontier event?
- Is the Agent Improvement projection checkpointed as one composite snapshot or as independently checkpointed families
  sharing one event frontier and reducer fingerprint?
- Which behavior-family and authority-conflict coverage facts are safe for candidate generation, and which remain
  terminal-only to avoid evaluator leakage?
- How should profile-specific champions and a global incumbent be represented when the operational envelope is conditional
  rather than universal?
<!-- /ANCHOR:questions -->
