---
title: "Tasks: In-Flight State Migration"
description: "Tasks for the first phase-011 sibling: execute guarded, integrity-checked, fenced, atomic, and resumable migration of classified in-flight deep-loop state."
trigger_phrases:
  - "in-flight state migration tasks"
  - "deep-loop migration tasks"
  - "state migration cutover tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/011-staged-state-migration-and-authority-cutover/001-inflight-state-migration"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/011-staged-state-migration-and-authority-cutover/001-inflight-state-migration"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Decomposed the migration coordinator into guarded tasks"
    next_safe_action: "Freeze the operation envelope before implementation"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: In-Flight State Migration

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

- [ ] T001 Confirm the frozen phase-000 state census, phase-005 classification manifest, phase-004 locks/fencing contract, and phase-tree entry are available with stable digests
- [ ] T002 Freeze the migration envelope: migration ID, source identity, classification digest, operation class, source digest, authority epoch, resource key, fence token, rollback anchor, idempotency key, and status enum
- [ ] T003 Define the coordinator atomicity domain, receipt store, commit marker, retry boundary, crash-resume boundary, and evidence handoff schema for `002-per-mode-authority-flip`
- [ ] T004 [P] Build fixtures for mid-iteration state, active leases, pending effects, paused checkpoints, fan-out waits, JSON/JSONL bundles, SQLite checkpoints, and malformed or unknown rows
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Implement preflight selection and phase-005 freshness checks for source digest, schema, authority epoch, leases, pending effects, prerequisites, and rollback anchor
- [ ] T006 Implement canonical resource-key resolution and phase-004 lease/fence acquisition; reject stale holders at every protected mutation boundary
- [ ] T007 Implement deterministic pre-operation and post-operation integrity checks using `computeIntegrityHash` and the hard-failure interpretation of `verifyIntegrity`
- [ ] T008 Implement `UPCAST` as a pure adjacent-version logical conversion that preserves source bytes, stored identity, order, and replay evidence
- [ ] T009 Implement `FORK` as an isolated dark copy with distinct execution/effect namespaces, source immutability, and blocked live publication
- [ ] T010 Implement `MIGRATE` for complete quiescent checkpoints with one fenced ledger import, identity/order/idempotency preservation, equivalence verification, and retained legacy anchor
- [ ] T011 Implement `PIN` terminal admission and bounded timeout escalation; keep active work wholly legacy-authoritative
- [ ] T012 Implement `BLOCK` veto receipts and reclassification requirements for unknown, stale, corrupt, locked, effect-uncertain, non-quiescent, or rollback-unanchored rows
- [ ] T013 Implement durable receipts, commit markers, idempotent retry, crash recovery, lease-loss abort, dark-fork cleanup, and migration resume without duplicate logical work
- [ ] T014 Emit the successor handoff manifest with classification digest, operation receipts, pinned terminal receipts, fork parity evidence, blocked rows, rollback anchors, and final integrity states
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Verify one-row/one-receipt closure and reject duplicate, missing, unknown, or unsafe committed outcomes
- [ ] T016 Verify source drift and stale authority epoch return `BLOCK` before any state, ledger, effect, or commit-marker mutation
- [ ] T017 Verify stale phase-004 fence tokens fail at the protected write boundary after takeover, including a resumed old process
- [ ] T018 Verify `UPCAST` source-byte preservation and replay-equivalent effective state across every registered adjacent-version fixture
- [ ] T019 Verify `FORK` cannot mutate source state, publish effects, consume live budget, or become authoritative
- [ ] T020 Verify `MIGRATE` preserves identity, ordering, idempotency, pending-work, receipts, budgets, and restore evidence for complete checkpoints and rejects partial checkpoints
- [ ] T021 Verify `PIN` reaches a bounded terminal handoff or escalates safely, while `BLOCK` prevents the successor authority flip
- [ ] T022 Crash-inject at every receipt, snapshot, import, postcheck, and commit-marker boundary; verify resume is idempotent and abort preserves legacy authority
- [ ] T023 Verify integrity mismatch, write failure, fsync/rename failure, ledger failure, rollback failure, and cleanup failure all produce a fail-closed outcome
- [ ] T024 Verify the handoff is accepted only with a matching classification digest, complete evidence, usable rollback anchors, and zero live unsafe rows
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test, migration fault injection, and handoff verification as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
