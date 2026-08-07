---
title: "Tasks: Agent Improvement - Shadow Parity"
description: "Tasks for the Agent Improvement shadow-parity phase: map proposal and scoring behavior, define paired legacy and ledger adapters, reuse Deep Improvement Common Services, compare typed projections, exercise causal, transfer, resume, and promotion fixtures, and issue a blocking parity receipt without changing authority."
trigger_phrases:
  - "Agent Improvement shadow parity tasks"
  - "agent proposal event parity tasks"
  - "agent-improvement phase 009 tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/006-shadow-parity"
    last_updated_at: "2026-07-15T21:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the Agent Improvement parity oracle and fixture families"
    next_safe_action: "Freeze the paired input manifest and Agent Improvement event mapping"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Agent Improvement - Shadow Parity

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

- [ ] T001 Record the phase-015 shared-contract digest, phase-014 shadow-framework interface, parent compatibility-bridge contract, mode 004 common-service contract, and the fact that this phase has no authority-cutover responsibility
- [ ] T002 Inventory the legacy Agent Improvement boundaries for AgentIR/package compilation, proposal and mutation, lineage, scoring, raw trials, family stability, frontier selection, resume, and promotion preparation
- [ ] T003 Freeze the fixture manifest with BASE, candidate and baseline digests, inheritance graph, evaluator capsule and epoch, fixture rings, executor/environment descriptors, tool receipts, budget lease, expected terminal classes, and output locations
- [ ] T004 Define the parity receipt schema, canonical event tuple, protected AgentIR and projection fields, diff classifications, common-service references, and versioned volatility allowlist before running acceptance comparisons
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Define the Agent Improvement event namespace and legacy-to-ledger mapping for initialization, AgentIR compilation, proposal, changed locus, lineage, trace localization, raw trial, score reduction, family result, frontier, ablation, transfer, resume, and promotion preparation
- [ ] T006 Define the legacy observer and ledger shadow adapter contracts with stable run, candidate, parent, changed-locus, clause, trial, evaluator, fixture, and receipt identities
- [ ] T007 Reuse the mode 004 Deep Improvement Common Services comparator and add namespaced Agent Improvement comparison rules for AgentIR, inheritance, clause coverage, family vectors, insufficient evidence, frontier membership, and transfer state
- [ ] T008 Define projection folds and deterministic replay oracles for proposal lineage, raw observations, score versions, family stability, causal evidence, frontier decisions, evaluator epoch, canary state, promotion state, and resume state
- [ ] T009 Define clean, single-locus, frontier, known-defect, act/refuse/clarify, authority-conflict, missing-evidence, evaluator-epoch, semantic-variant, executor-transfer, crash-resume, duplicate-delivery, canary, and veto fixtures
- [ ] T010 Define non-authoritative guards, isolated shadow output, common-service integrity checks, failure dispositions, missing-sample handling, and the parity receipt handoff to `007-rollback-and-mode-gate`
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Verify: Both paths consume the same frozen inputs - BASE, candidate and baseline digests, AgentIR/inheritance digest, evaluator capsule and epoch, fixture rings, executor descriptors, environment, tool receipts, and budget lease match
- [ ] T012 Verify: The lifecycle event map is complete - every Agent Improvement proposal, scoring, lineage, frontier, resume, promotion-preparation, and failure boundary has a named event or explicit shared-service mapping
- [ ] T013 Verify: Event-for-event parity is strict - event count, order, type, lineage, changed locus, causal links, stable payload, shared-service references, receipts, and projection fingerprints match
- [ ] T014 Verify: Canonicalization is bounded - unknown fields, missing samples, changed evaluator epochs, and non-allowlisted volatility fail; only reviewed transport fields are ignored
- [ ] T015 Verify: Agent-specific projections are equal - AgentIR, inherited clauses, proposal lineage, raw trials, family and dimension outcomes, insufficient evidence, frontier, ablation, transfer, and terminal state match
- [ ] T016 Verify: Causal and discipline evidence is equal - known-locus interventions, failure clusters, change-contract obligations, authority conflicts, act/refuse/clarify, tool/state failures, and semantic variants match
- [ ] T017 Verify: Common-service parity is reused and complete - evaluator capsule, raw observations, canary, promotion, health, receipt, rollback target, and mismatch references satisfy mode 004 without masking variant drift
- [ ] T018 Verify: Resume and executor transfer are equal - reuse, re-execution, invalidation, lease continuity, executor identity, event tails, and final projections match fresh continuation expectations
- [ ] T019 Verify: Every fixture has a reproducible parity receipt - BASE, mode and common-service versions, schema, reducer, comparator, streams, projections, diffs, and exit status are bound
- [ ] T020 Verify: Authority is unchanged - no ledger event becomes canonical, no evaluator/canary/baseline asset is mutated, no candidate is dispatched, no legacy writer is removed, and no cutover certificate is emitted
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green with zero unexplained semantic differences, no blocking evidence gaps, and a reproducible parity receipt
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Shared services**: Consume the mode 004 Deep Improvement Common Services shadow contract
- **Successor gate**: See the `007-rollback-and-mode-gate` sibling contract when authored
<!-- /ANCHOR:cross-refs -->
