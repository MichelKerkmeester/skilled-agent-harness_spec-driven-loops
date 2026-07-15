---
title: "Tasks: Agent Improvement - Reducers & Projections"
description: "Tasks for the Agent Improvement reducers and projections phase, covering the pure typed-event fold, AgentIR iteration state, component lineage index, common-service reuse, per-mode status, and replay verification."
trigger_phrases:
  - "agent improvement reducers tasks"
  - "agent improvement projection tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/002-reducers-and-projections"
    last_updated_at: "2026-07-15T20:45:00Z"
    last_updated_by: "opencode"
    recent_action: "Mapped Agent Improvement tasks across setup, implementation, and verification"
    next_safe_action: "Pin Agent Improvement golden histories before implementing variant reducers"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Agent Improvement - Reducers & Projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm `001-typed-ledger-schema` publishes the Agent Improvement envelope, identity, ordering, version, and upcaster contract
- [ ] T002 Confirm mode `004-deep-improvement-common` publishes reusable evaluator, canary, promotion, veto, rollback, receipt, and status contracts
- [ ] T003 Build the AgentIR projection field matrix, event-to-reducer ownership map, redaction matrix, and boundary with `003-sealed-artifacts`
- [ ] T004 Pin golden histories for run start/resume, proposal, component mutation, evaluation, convergence, coverage, canary, promotion, rollback, and stop
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 [P] Define the composed pure fold with canonical dispatch, sequence checks, duplicate handling, version refusal, deterministic serialization, and fingerprints
- [ ] T006 [P] Define iteration/convergence reduction for AgentIR proposal frontier, candidate progress, first divergent trace, failure gradients, coverage, budgets, unresolved evidence, stop, and resume
- [ ] T007 [P] Define the AgentIR candidate/artifact index for component lineage, mutation locus/operator, profile scope, parent/incumbent links, raw trials, digests, score versions, Pareto descriptors, costs, latency, and receipts
- [ ] T008 Define Agent Improvement-specific behavior coverage for clauses, authority conflicts, state transitions, environmental perturbations, executor cells, and behavior families
- [ ] T009 Consume common evaluator epoch, capsule, score-normalization, canary, promotion, veto, rollback, and receipt states without reimplementing shared services
- [ ] T010 Define the shared per-mode status projection and namespaced Agent Improvement extension for active operator, AgentIR frontier, profile champion routing, coverage, and failure class
- [ ] T011 Define candidate-facing redacted views that withhold hidden fixtures, exact evaluator internals, raw rationales, terminal evidence, and unapproved score detail
- [ ] T012 [P] Define checkpoint, rebuild, batch-frontier, state-hash, reducer-version, common-service fingerprint, and mixed-version compatibility rules
- [ ] T013 Add effect-boundary assertions proving reducers cannot access filesystem, network, clock, randomness, evaluator execution, promotion writes, or hidden fixtures
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Verify complete-history and checkpointed replay produce byte-identical iteration state, artifact index, per-mode status, redaction output, and fingerprints
- [ ] T015 Verify duplicate, malformed, missing, out-of-order, unsupported-version, and stale-event cases fail closed or enter explicit safe states
- [ ] T016 Verify component lineage, first-divergent attribution, failure gradients, behavior coverage, raw trials, and receipts survive normalization and evaluator-epoch changes
- [ ] T017 Verify common evaluator capsule mismatch, hidden-anchor mismatch, missing receipt, stale canary, hard veto, and rollback cases cannot reach ship eligibility
- [ ] T018 Verify candidate generators receive only the permitted redacted projection and cannot read evaluator internals or mutate evaluator assets
- [ ] T019 Verify Agent Improvement consumes shared evaluator, canary, promotion, veto, rollback, and status semantics without a variant fork
- [ ] T020 Verify dark projection or common-service failures leave legacy outputs, state, schemas, and authority unchanged
- [ ] T021 Run the phase validator, replay/property suite, effect-boundary suite, failure-injection suite, shadow-parity checks, and exact-scope diff check
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/replay/property/failure-injection/shadow-parity as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
