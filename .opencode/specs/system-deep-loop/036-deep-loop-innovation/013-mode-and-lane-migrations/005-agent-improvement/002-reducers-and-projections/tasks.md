---
title: "Tasks: Agent Improvement - Reducers & Projections"
description: "Tasks for the Agent Improvement reducers and projections phase, covering the pure typed-event fold, AgentIR iteration state, component lineage index, common-service reuse, per-mode status, and replay verification."
trigger_phrases:
  - "agent improvement reducers tasks"
  - "agent improvement projection tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/002-reducers-and-projections"
    last_updated_at: "2026-07-23T14:30:00Z"
    last_updated_by: "codex"
    recent_action: "Completed the reducer module and anti-vacuous replay suite"
    next_safe_action: "Preserve the additive-dark boundary during later integration"
    blockers: []
    key_files: []
    completion_pct: 100
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

- [x] T001 Confirm `001-typed-ledger-schema` publishes the Agent Improvement envelope, identity, ordering, version, and upcaster contract [evidence: implementation-summary.md records the scoped delivery; focused Vitest passed 11/11 and runtime tsc exited 0]
- [x] T002 Confirm mode `004-deep-improvement-common` publishes reusable evaluator, canary, promotion, veto, rollback, receipt, and status contracts [evidence: implementation-summary.md records the scoped delivery; focused Vitest passed 11/11 and runtime tsc exited 0]
- [x] T003 Build the AgentIR projection field matrix, event-to-reducer ownership map, redaction matrix, and boundary with `003-sealed-artifacts` [evidence: implementation-summary.md records the scoped delivery; focused Vitest passed 11/11 and runtime tsc exited 0]
- [x] T004 Pin golden histories for run start/resume, proposal, component mutation, evaluation, convergence, coverage, canary, promotion, rollback, and stop [evidence: implementation-summary.md records the scoped delivery; focused Vitest passed 11/11 and runtime tsc exited 0]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P] Define the composed pure fold with canonical dispatch, sequence checks, duplicate handling, version refusal, deterministic serialization, and fingerprints [evidence: implementation-summary.md records the scoped delivery; focused Vitest passed 11/11 and runtime tsc exited 0]
- [x] T006 [P] Define iteration/convergence reduction for AgentIR proposal frontier, candidate progress, first divergent trace, failure gradients, coverage, budgets, unresolved evidence, stop, and resume [evidence: implementation-summary.md records the scoped delivery; focused Vitest passed 11/11 and runtime tsc exited 0]
- [x] T007 [P] Define the AgentIR candidate/artifact index for component lineage, mutation locus/operator, profile scope, parent/incumbent links, raw trials, digests, score versions, Pareto descriptors, costs, latency, and receipts [evidence: implementation-summary.md records the scoped delivery; focused Vitest passed 11/11 and runtime tsc exited 0]
- [x] T008 Define Agent Improvement-specific behavior coverage for clauses, authority conflicts, state transitions, environmental perturbations, executor cells, and behavior families [evidence: implementation-summary.md records the scoped delivery; focused Vitest passed 11/11 and runtime tsc exited 0]
- [x] T009 Consume common evaluator epoch, capsule, score-normalization, canary, promotion, veto, rollback, and receipt states without reimplementing shared services [evidence: implementation-summary.md records the scoped delivery; focused Vitest passed 11/11 and runtime tsc exited 0]
- [x] T010 Define the shared per-mode status projection and namespaced Agent Improvement extension for active operator, AgentIR frontier, profile champion routing, coverage, and failure class [evidence: implementation-summary.md records the scoped delivery; focused Vitest passed 11/11 and runtime tsc exited 0]
- [x] T011 Define candidate-facing redacted views that withhold hidden fixtures, exact evaluator internals, raw rationales, terminal evidence, and unapproved score detail [evidence: implementation-summary.md records the scoped delivery; focused Vitest passed 11/11 and runtime tsc exited 0]
- [x] T012 [P] Define checkpoint, rebuild, batch-frontier, state-hash, reducer-version, common-service fingerprint, and mixed-version compatibility rules [evidence: implementation-summary.md records the scoped delivery; focused Vitest passed 11/11 and runtime tsc exited 0]
- [x] T013 Add effect-boundary assertions proving reducers cannot access filesystem, network, clock, randomness, evaluator execution, promotion writes, or hidden fixtures [evidence: implementation-summary.md records the scoped delivery; focused Vitest passed 11/11 and runtime tsc exited 0]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Verify complete-history and checkpointed replay produce byte-identical iteration state, artifact index, per-mode status, redaction output, and fingerprints [evidence: implementation-summary.md records the scoped delivery; focused Vitest passed 11/11 and runtime tsc exited 0]
- [x] T015 Verify duplicate, malformed, missing, out-of-order, unsupported-version, and stale-event cases fail closed or enter explicit safe states [evidence: implementation-summary.md records the scoped delivery; focused Vitest passed 11/11 and runtime tsc exited 0]
- [x] T016 Verify component lineage, first-divergent attribution, failure gradients, behavior coverage, raw trials, and receipts survive normalization and evaluator-epoch changes [evidence: implementation-summary.md records the scoped delivery; focused Vitest passed 11/11 and runtime tsc exited 0]
- [x] T017 Verify common evaluator capsule mismatch, hidden-anchor mismatch, missing receipt, stale canary, hard veto, and rollback cases cannot reach ship eligibility [evidence: implementation-summary.md records the scoped delivery; focused Vitest passed 11/11 and runtime tsc exited 0]
- [x] T018 Verify candidate generators receive only the permitted redacted projection and cannot read evaluator internals or mutate evaluator assets [evidence: implementation-summary.md records the scoped delivery; focused Vitest passed 11/11 and runtime tsc exited 0]
- [x] T019 Verify Agent Improvement consumes shared evaluator, canary, promotion, veto, rollback, and status semantics without a variant fork [evidence: implementation-summary.md records the scoped delivery; focused Vitest passed 11/11 and runtime tsc exited 0]
- [x] T020 Verify dark projection or common-service failures leave legacy outputs, state, schemas, and authority unchanged [evidence: implementation-summary.md records the scoped delivery; focused Vitest passed 11/11 and runtime tsc exited 0]
- [x] T021 Run the phase validator, replay/property suite, effect-boundary suite, failure-injection suite, shadow-parity checks, and exact-scope diff check [evidence: implementation-summary.md records the scoped delivery; focused Vitest passed 11/11 and runtime tsc exited 0]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete
- [x] All requirements in spec.md met with evidence
- [x] Phase gate green (validate/replay/property/failure-injection/shadow-parity as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
