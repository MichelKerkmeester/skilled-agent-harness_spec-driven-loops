---
title: "Implementation Plan: Agent Improvement - Reducers & Projections"
description: "Implementation Plan for the Agent Improvement reducers and projections phase: a pure fold for AgentIR proposal and scoring events, variant-specific iteration and artifact views, and shared per-mode status over deep-improvement-common services."
trigger_phrases:
  - "agent improvement reducers implementation plan"
  - "agent improvement projection plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/002-reducers-and-projections"
    last_updated_at: "2026-07-23T14:30:00Z"
    last_updated_by: "codex"
    recent_action: "Completed the composed fold, projections, and replay verification"
    next_safe_action: "Keep the dark reducer non-authoritative until its integration phase"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Agent Improvement - Reducers & Projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / agent-improvement mode |
| **Change class** | Variant reducer composition, AgentIR projections, replay fixtures, and status contract consumption |
| **Execution** | Isolated implementation after `001-typed-ledger-schema` and shared deep-improvement-common contracts are frozen |

### Overview

This phase turns Agent Improvement's typed event sequence into deterministic live state for agent-loop proposal
generation and scoring. The implementation separates event production from projection replay: AgentIR mutation,
evaluation, canary, and promotion services emit authorized events and receipts; the variant fold consumes canonical
events and composes with deep-improvement-common projections without side effects. The resulting projection families
provide iteration/convergence state, a searchable AgentIR candidate and artifact index, and the common per-mode status
shape with Agent Improvement extensions for component lineage, behavior coverage, and profile-scoped frontiers.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] `001-typed-ledger-schema` publishes the Agent Improvement event envelope, identity fields, ordering inputs,
  version policy, and upcaster boundary
- [x] The common deep-improvement evaluator, canary, promotion, receipt, and status contracts are addressable and
  their semantics are reused rather than copied
- [x] The projection field matrix names every AgentIR field, event source, stability rule, redaction rule, and consumer
- [x] Pure-fold constraints prohibit I/O, time, randomness, network access, mutable evaluator reads, and hidden writes
- [x] AgentIR component lineage, failure-gradient attribution, behavior-family coverage, and profile frontier semantics
  are explicit before implementation begins
- [x] Replay, checkpoint, mixed-version, malformed-event, duplicate, epoch-mismatch, and shadow-parity fixtures are
  identified

### Definition of Done

- [x] Complete and checkpointed replay produce byte-identical Agent Improvement projections and fingerprints
- [x] Agent Improvement consumes common evaluator, canary, promotion, veto, rollback, and receipt semantics without a
  variant implementation of those services
- [x] Raw trials, component lineage, coverage evidence, and common-service references remain available after reductions
  or evaluator-epoch changes
- [x] Strict validation, replay/property checks, failure injection, and the phase verifier pass without out-of-scope
  tracked changes
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Composed fold boundary**: accept only the typed, authorized, canonical event form from `001-typed-ledger-schema`;
  dispatch common event families to the shared deep-improvement reducer contract and Agent Improvement extensions to
  variant reducers. Each reducer is a pure `(state, event) -> state` function that derives canonical bytes and a
  projection fingerprint.
- **Event semantics**: define stable AgentIR identity, sequence/frontier, event-time fields supplied by events,
  duplicate handling, unsupported-version refusal, upcaster provenance, and rejected-event behavior. The fold must not
  invent component IDs, reorder ambiguous events, or repair malformed evidence.
- **Iteration/convergence projection**: maintain run and iteration identity, evaluator epoch, proposal frontier,
  candidate progress, parent/incumbent relationships, first-divergent trace evidence, failure-gradient references,
  behavior-family and authority-conflict coverage, budget observations, unresolved evidence, stop disposition, and
  resume frontier. It records decisions and references instead of recalculating them.
- **AgentIR artifact index**: index whole-agent and component-level candidates, mutable and immutable loci, mutation
  operator, parent lineage, profile scope, evaluator and fixture digests, raw trial references, behavior descriptors,
  per-case/per-objective score views, Pareto membership, cost, latency, canary references, and receipts. Artifact bytes
  remain immutable and are referenced by digest.
- **Common service projection boundary**: consume shared evaluator capsule/epoch status, trial normalization version,
  canary lifecycle, promotion stage, hard vetoes, pause/inconclusive reasons, rollback target, and receipt validity.
  Agent Improvement does not create a parallel score reducer or promotion state machine.
- **Per-mode status**: publish the shared status shape for deep-improvement common and all three variants, then add only
  namespaced Agent Improvement fields for active mutation operator, AgentIR frontier, profile champion routing,
  coverage state, and failure class summary.
- **Information boundary**: candidate generators receive the common redacted view and only permitted AgentIR frontier,
  failure-gradient, and thresholded verdict fields. Hidden fixtures, exact evaluator internals, raw rationales, and
  terminal evidence stay behind the common service boundary.
- **Checkpoint and rebuild**: checkpoint projection families at an event frontier with schema, common-service, and
  variant-reducer fingerprints. Full ledger replay and validated checkpoint replay must converge to equal bytes, index
  entries, status values, and redaction output.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- Confirm the predecessor event schema and compatibility policy; record the exact Agent Improvement event families and
  fields consumed by each projection.
- Build the AgentIR projection field matrix, event-to-reducer map, shared-service ownership boundary, redaction matrix,
  and consumer contract for the later Agent Improvement mode gate.
- Pin representative event histories for run start/resume, AgentIR proposal, component mutation, evaluator observation,
  normalization, convergence, coverage, pause, canary, promotion, rollback, and stop.

### Phase 2: Implementation

- Implement the composed pure fold with canonical dispatch, identity/deduplication, sequence checks, version refusal,
  deterministic serialization, common-service delegation, variant extension reduction, and projection fingerprints.
- Implement iteration/convergence reduction for evaluator epochs, proposal frontiers, candidate progress, first
  divergent trace attribution, failure gradients, behavior coverage, budgets, unresolved evidence, stop disposition,
  and resumable frontiers.
- Implement the AgentIR candidate/artifact index with component-level lineage, mutation operator and locus, profile
  scope, parent/incumbent links, raw trials, evaluator/fixture digests, score-policy versions, Pareto descriptors,
  costs, latencies, canaries, and receipts.
- Consume common evaluator status and epoch matching, canary lifecycle, promotion stages, hard vetoes, rollback target,
  and receipts through shared service identities; do not copy their logic into variant reducers.
- Implement the Agent Improvement per-mode status extension with profile-scoped champions, active operator, frontier,
  coverage, and failure-class state while preserving common field names and transition semantics.
- Add redacted candidate views, checkpoint/rebuild rules, state-hash comparison, mixed-version fixtures, and explicit
  projection migration or upcast handling.

### Phase 3: Verification

- Replay the same event bytes through fresh and checkpointed composed reducers and compare canonical projection bytes,
  fingerprints, index contents, status, and redaction output.
- Exercise duplicate, missing, malformed, out-of-order, unsupported-version, stale-capsule, missing-receipt,
  evaluator-integrity, stale-canary, and veto cases; each must reject or enter an explicit safe state.
- Verify raw trial evidence, component lineage, first-divergent attribution, and coverage evidence survive score-policy
  and evaluator-epoch changes.
- Verify common evaluator, canary, promotion, receipt, veto, and rollback semantics are consumed unchanged and that no
  variant-local status can clear a shared veto.
- Run strict spec validation, replay/property checks, effect-boundary checks, failure injection, and the exact-scope diff
  gate on the implementation candidate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Property tests run identical canonical Agent Improvement event sequences through fresh composed reducers and assert byte-identical state and fingerprint with effect guards |
| REQ-002 | Table-driven semantics cover duplicate IDs, malformed AgentIR identity, ambiguous ordering, unsupported versions, and named upcaster paths; unsafe inputs fail closed |
| REQ-003 | Golden histories cover proposal frontiers, component mutations, first divergent trace evidence, failure gradients, behavior coverage, evaluator epoch, convergence, stop, budget, and resume |
| REQ-004 | Rebuild fixtures inspect component lineage, operator/locus, profile, evaluator/fixture digests, raw trials, score versions, Pareto descriptors, cost, latency, and receipts after policy changes |
| REQ-005 | Coverage fixtures exercise AgentIR clauses, authority conflicts, state transitions, environmental perturbations, executor cells, and behavior families independently of task count |
| REQ-006 | Contract tests prove Agent Improvement consumes shared evaluator epoch, canary lifecycle, promotion, veto, rollback, and receipt semantics without a duplicate implementation |
| REQ-007 | The shared status fixture compares common fields and transitions while validating only the namespaced Agent Improvement extension fields |
| REQ-008 | Complete and checkpointed replay produce equal projection hashes, artifact-index snapshots, status snapshots, and redaction output across batch boundaries |
| REQ-009 | Projection access tests prove hidden fixtures, exact evaluator internals, raw rationales, and terminal evidence are unavailable to candidate-facing consumers |
| REQ-010 | Dark-path failure injection shows legacy state, outputs, schemas, and authority remain unchanged when the variant fold or common-service reference fails |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`depends_on: []` applies to this planning contract. Runtime integration composes with predecessor folder
`001-typed-ledger-schema`, successor `003-sealed-artifacts`, and mode `004-deep-improvement-common`; these are explicit
composition boundaries rather than hidden planning dependencies. The implementation also uses phase 012 shared mode
contracts and its write-set conflict graph, the existing Agent Improvement proposal/scoring fixtures, common evaluator,
canary, promotion, receipt, and rollback fixtures, the typed ledger replay fingerprint, and the spec-kit validator.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Implementation is additive at the Agent Improvement projection boundary. If the composed reducer, AgentIR index,
checkpoint, redaction view, or common-service reference fails parity, stop consuming the new projection, preserve the
append-only event ledger and raw evidence, and restore the prior legacy reader or known-good projection snapshot. Rebuild
from the last verified event frontier after correcting the variant reducer version; do not mutate or delete ledger
events to repair a projection. A path-scoped `git revert` restores the prior projection readers and adapters, while
retained event fixtures make the variant projection reproducible after retry. No authority changes occur in this phase.
<!-- /ANCHOR:rollback -->
