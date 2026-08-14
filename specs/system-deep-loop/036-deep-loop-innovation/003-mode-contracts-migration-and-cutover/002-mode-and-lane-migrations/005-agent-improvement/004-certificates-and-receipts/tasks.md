---
title: "Tasks: Agent Improvement certificates and receipts"
description: "Tasks for the Agent Improvement certificates and receipts phase: freeze the mode evidence contract, implement replay-bound receipts and certificates, and prove offline verification without duplicating deep-improvement-common services."
trigger_phrases:
  - "agent improvement certificates and receipts tasks"
  - "agent-improvement evidence tasks"
  - "offline verifier tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/005-agent-improvement/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/005-agent-improvement/004-certificates-and-receipts"
    last_updated_at: "2026-07-27T18:49:19Z"
    last_updated_by: "codex"
    recent_action: "Completed certificate and verifier tasks"
    next_safe_action: "Resume adapter can bind checkpoints to verified certificates"
    blockers: []
    key_files: []
    completion_pct: 100
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

- [x] T001 Confirm the phase-012 shared contracts, write-set graph, phase-007 primitives, and `003-sealed-artifacts` boundary are frozen before implementation
- [x] T002 Inventory every Agent Improvement proposal, execution, scoring, canary, promotion, rollback, and closure transition and map ownership [evidence: implementation-summary.md:144]
- [x] T003 [P] Record mode 004 common-service IDs, evaluator/canary/promotion epochs, and consumed receipt interfaces without copying their logic [evidence: implementation-summary.md:144]
- [x] T004 Freeze the certificate fields, receipt transition matrix, canonical fingerprint vector, protected-evidence commitments, and verifier refusal codes [evidence: implementation-summary.md:144]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Define the per-run `CERTIFICATE` schema and builder with run, lineage, artifact, epoch, terminal-transition, receipt-root, and verifier bindings
- [x] T006 Define typed `RECEIPTS` for proposal generation, candidate execution, evaluator observation, reduction, canary, promotion, rollback, and closure
- [x] T007 Implement canonical replay-fingerprint construction over ordered parents, candidate/target/operator digests, service epochs, fixtures, executor configuration, budgets, reducers, and prior state [evidence: implementation-summary.md:144]
- [x] T008 Bind phase-007 primitives and `003-sealed-artifacts` references as versioned dependencies with explicit incompatibility handling
- [x] T009 [P] Implement the network-free offline verifier and its typed fail-closed outcomes for missing, stale, mutated, reordered, incomplete, or unauthorized evidence [evidence: implementation-summary.md:144]
- [x] T010 [P] Create valid and negative fixture families for lineages, evaluator epochs, score-policy replay, protected evidence, and receipt-chain failures [evidence: implementation-summary.md:144]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Verify a complete certificate and receipt chain from local immutable inputs and recompute the receipt root and replay fingerprint [evidence: implementation-summary.md:144]
- [x] T012 Verify every declared fingerprint input changes the digest and semantically equivalent canonical inputs remain stable [evidence: implementation-summary.md:144]
- [x] T013 Verify missing, duplicate, orphaned, reordered, altered, stale, and unauthorized receipts fail with the declared refusal code [evidence: implementation-summary.md:144]
- [x] T014 Verify raw evaluator observations replay independently from normalization and score-policy changes without fabricating candidate executions [evidence: implementation-summary.md:144]
- [x] T015 Verify the offline verifier has no network, live evaluator, canary, promotion, or mutable-workspace dependency [evidence: implementation-summary.md:144]
- [x] T016 Verify Agent Improvement shadow parity and the mode gate while legacy authority remains unchanged [evidence: implementation-summary.md:144]
- [x] T017 Run `validate.sh --strict` and reconcile spec, plan, tasks, and checklist without adding files outside this phase folder
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Certificate, receipt, fingerprint, offline-verifier, and shadow-parity evidence is pinned to the candidate SHA and fixture manifest
- [x] Common evaluator, canary, and promotion behavior remains owned by mode 004 `004-deep-improvement-common`
- [x] Phase gate is green with strict validation and no authority cutover
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: See sibling `003-sealed-artifacts`
- **Successor**: See sibling `005-resume-adapter`
<!-- /ANCHOR:cross-refs -->
