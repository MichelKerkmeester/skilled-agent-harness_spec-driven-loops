---
title: "Tasks: Agent Improvement certificates and receipts"
description: "Tasks for the Agent Improvement certificates and receipts phase: freeze the mode evidence contract, implement replay-bound receipts and certificates, and prove offline verification without duplicating deep-improvement-common services."
trigger_phrases:
  - "agent improvement certificates and receipts tasks"
  - "agent-improvement evidence tasks"
  - "offline verifier tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T20:50:00Z"
    last_updated_by: "opencode"
    recent_action: "Split certificate, receipt, fingerprint, verifier, and gate work into ordered tasks"
    next_safe_action: "Inventory Agent Improvement transitions against the phase-012 write-set graph"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Agent Improvement Certificates & Receipts

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

- [ ] T001 Confirm the phase-015 shared contracts, write-set graph, phase-006 primitives, and `003-sealed-artifacts` boundary are frozen before implementation
- [ ] T002 Inventory every Agent Improvement proposal, execution, scoring, canary, promotion, rollback, and closure transition and map ownership
- [ ] T003 [P] Record mode 004 common-service IDs, evaluator/canary/promotion epochs, and consumed receipt interfaces without copying their logic
- [ ] T004 Freeze the certificate fields, receipt transition matrix, canonical fingerprint vector, protected-evidence commitments, and verifier refusal codes
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Define the per-run `CERTIFICATE` schema and builder with run, lineage, artifact, epoch, terminal-transition, receipt-root, and verifier bindings
- [ ] T006 Define typed `RECEIPTS` for proposal generation, candidate execution, evaluator observation, reduction, canary, promotion, rollback, and closure
- [ ] T007 Implement canonical replay-fingerprint construction over ordered parents, candidate/target/operator digests, service epochs, fixtures, executor configuration, budgets, reducers, and prior state
- [ ] T008 Bind phase-006 primitives and `003-sealed-artifacts` references as versioned dependencies with explicit incompatibility handling
- [ ] T009 [P] Implement the network-free offline verifier and its typed fail-closed outcomes for missing, stale, mutated, reordered, incomplete, or unauthorized evidence
- [ ] T010 [P] Create valid and negative fixture families for lineages, evaluator epochs, score-policy replay, protected evidence, and receipt-chain failures
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Verify a complete certificate and receipt chain from local immutable inputs and recompute the receipt root and replay fingerprint
- [ ] T012 Verify every declared fingerprint input changes the digest and semantically equivalent canonical inputs remain stable
- [ ] T013 Verify missing, duplicate, orphaned, reordered, altered, stale, and unauthorized receipts fail with the declared refusal code
- [ ] T014 Verify raw evaluator observations replay independently from normalization and score-policy changes without fabricating candidate executions
- [ ] T015 Verify the offline verifier has no network, live evaluator, canary, promotion, or mutable-workspace dependency
- [ ] T016 Verify Agent Improvement shadow parity and the mode gate while legacy authority remains unchanged
- [ ] T017 Run `validate.sh --strict` and reconcile spec, plan, tasks, and checklist without adding files outside this phase folder
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Certificate, receipt, fingerprint, offline-verifier, and shadow-parity evidence is pinned to the candidate SHA and fixture manifest
- [ ] Common evaluator, canary, and promotion behavior remains owned by mode 004 `004-deep-improvement-common`
- [ ] Phase gate is green with strict validation and no authority cutover
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: See sibling `003-sealed-artifacts`
- **Successor**: See sibling `005-resume-adapter`
<!-- /ANCHOR:cross-refs -->
