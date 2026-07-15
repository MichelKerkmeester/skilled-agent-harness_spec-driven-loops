---
title: "Checklist: In-Flight State Migration"
description: "Checklist for the first phase-011 sibling: verify guarded, integrity-checked, fenced, atomic, resumable, and fail-closed migration of classified in-flight deep-loop state."
trigger_phrases:
  - "in-flight state migration checklist"
  - "deep-loop migration verification"
  - "staged state migration gate"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/011-staged-state-migration-and-authority-cutover/001-inflight-state-migration"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/011-staged-state-migration-and-authority-cutover/001-inflight-state-migration"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Authored the blocking migration verification contract"
    next_safe_action: "Run the migration fault matrix after implementation lands"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: In-Flight State Migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the in-flight migration phase. Every item is checked against
the frozen classification-manifest digest and the migration handoff report; the report records operation receipts,
source/output digests, fence tokens, crash points, rollback anchors, commands, exit codes, and the final blocked/pinned
row counts. The verifier fails on duplicate logical migration, unsafe committed state, missing evidence, or any mutation
that bypasses the phase-004 fence.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The phase-000 census and phase-005 classification manifest are frozen, digest-addressed, total, and available to the coordinator
- [ ] CHK-002 [P0] The phase-004 canonical resource key, durable monotonic fence, atomic mutation boundary, and lease-loss result are available to every protected write
- [ ] CHK-003 [P1] Migration receipt, idempotency key, commit marker, rollback anchor, and successor handoff schemas are frozen before live-state execution
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P1] Changes are scoped to migration orchestration; no authority flip, legacy-writer retirement, or adjacent cleanup is included
- [ ] CHK-005 [P1] Every operation uses one canonical resource key and checks the current fence in the same protected mutation boundary
- [ ] CHK-006 [P2] Atomic file helpers are not presented as a multi-file transaction; bundle and ledger commit evidence is explicit
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] One-row/one-receipt coverage passes for all eligible classification rows with zero duplicate or unsafe committed outcomes
- [ ] CHK-008 [P0] Digest, authority epoch, lease, pending-effect, prerequisite, or rollback-anchor drift returns `BLOCK` before mutation
- [ ] CHK-009 [P0] Stale phase-004 fence tokens are rejected after takeover, including writes attempted by a resumed old process
- [ ] CHK-010 [P0] `UPCAST` preserves source bytes, immutable identity, ordering, and replay-equivalent effective state
- [ ] CHK-011 [P0] `FORK` uses isolated execution/effect namespaces and rejects source mutation, live effects, budget writes, and authority changes
- [ ] CHK-012 [P0] `MIGRATE` accepts only complete quiescent checkpoints, verifies ledger equivalence, preserves a legacy restore anchor, and retries idempotently
- [ ] CHK-013 [P0] `PIN` remains legacy-authoritative through terminal receipt or bounded timeout, and `BLOCK` vetoes the successor authority flip
- [ ] CHK-014 [P0] Crash injection at receipt, snapshot, import, postcheck, and commit-marker boundaries resumes or aborts without duplicate events, effects, or state loss
- [ ] CHK-015 [P1] Integrity, fence, write, fsync, rename, ledger, rollback, and cleanup failures leave legacy authoritative and committed ledger history intact
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-016 [P1] The successor handoff binds the classification digest, every operation receipt, pinned terminal receipt, fork parity evidence, rollback anchor, and zero live unsafe rows
- [ ] CHK-017 [P2] Reclassification is required after any post-classification state, schema, lease, effect, or rollback-anchor change
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-018 [P1] Dark forks cannot publish live effects, mutate authoritative source, consume live budgets, or acquire authority through an alias namespace
- [ ] CHK-019 [P2] Restore and cleanup paths reject stale holders and never truncate committed ledger history or reuse a fencing token
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-020 [P1] The handoff report identifies each migrated, upcast, forked, pinned, blocked, aborted, and resumed row with machine-verifiable evidence
- [ ] CHK-021 [P2] The phase outcome is reflected in the migration packet and the successor authority-flip contract without claiming that authority already moved
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-022 [P1] Migration receipts, snapshots, forks, and handoff artifacts are written only within their declared atomicity and retention boundaries
- [ ] CHK-023 [P2] No generated description or graph metadata is hand-authored in this phase folder
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check passes, the handoff report is bound to the frozen classification digest, all
eligible operations have verified receipts, all failures are fail-closed, and the successor can reject any incomplete
or stale evidence before deciding authority movement.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 migration contract, the fault-injection matrix is green, no protected
write bypasses the phase-004 fence, and the handoff contains no live unsafe migration or unresolved evidence gap.
<!-- /ANCHOR:sign-off -->
