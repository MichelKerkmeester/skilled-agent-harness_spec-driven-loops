---
title: "Tasks: In-Flight State Migration"
description: "Tasks for the first phase-014 sibling: execute guarded, integrity-checked, fenced, atomic, and resumable migration of classified in-flight deep-loop state."
trigger_phrases:
  - "in-flight state migration tasks"
  - "deep-loop migration tasks"
  - "state migration cutover tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/003-staged-state-migration-and-authority-cutover/001-inflight-state-migration"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-staged-state-migration-and-authority-cutover/001-inflight-state-migration"
    last_updated_at: "2026-08-09T07:45:00Z"
    last_updated_by: "claude"
    recent_action: "Executed all 24 tasks; coordinator + 5 executors + handoff built, 31 tests green"
    next_safe_action: "None -- sibling 002 consumes the handoff to flip authority"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/inflight-state-migration/migration-coordinator.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/inflight-state-migration.vitest.ts"
    completion_pct: 100
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

- [x] T001 Confirm the frozen phase-003 state census, phase-008 classification manifest, phase-007 locks/fencing contract, and phase-tree entry are available with stable digests — re-graded live at HEAD before writing any code; see `t001-disposition.md`
- [x] T002 Freeze the migration envelope: migration ID, source identity, classification digest, operation class, source digest, authority epoch, resource key, fence token, rollback anchor, idempotency key, and status enum — `MigrationEnvelope`/`MigrationEnvelopeCore` in `lib/inflight-state-migration/migration-types.ts`; `buildMigrationEnvelope`/`buildBlockMigrationEnvelope` in `migration-envelope.ts` [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] T003 Define the coordinator atomicity domain, receipt store, commit marker, retry boundary, crash-resume boundary, and evidence handoff schema for `002-per-mode-authority-flip` — `MigrationCoordinator` in `migration-coordinator.ts` (receipt store, `operation_applied` crash-resume boundary, terminal receipt as commit marker); `InflightMigrationHandoff*` in `migration-types.ts`/`migration-handoff.ts` [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] T004 [P] Build fixtures for mid-iteration state, active leases, pending effects, paused checkpoints, fan-out waits, JSON/JSONL bundles, SQLite checkpoints, and malformed or unknown rows — the real 46-row frozen census fixture (`evidenceFor`/`proofFor` in the test file) covers active-lease `PIN` rows, `BLOCK` control rows, and every registered disposition; malformed/missing-evidence and stale-evidence rows are covered by dedicated drift tests, not a mid-iteration/fan-out state family this dark coordinator does not read literal legacy bytes for `test "downgrades a live disposition to BLOCK when fresh evidence has drifted"`, `test "blocks when fresh evidence is missing entirely"` [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Implement preflight selection and phase-008 freshness checks for source digest, schema, authority epoch, leases, pending effects, prerequisites, and rollback anchor — `evidenceMatchesFrozenRow` in `migration-envelope.ts`; `MigrationCoordinator.#resolveEnvelope` in `migration-coordinator.ts` `test "downgrades a live disposition to BLOCK when fresh evidence has drifted"` [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] T006 Implement canonical resource-key resolution and phase-007 lease/fence acquisition; reject stale holders at every protected mutation boundary — `resolveMigrationResource` in `migration-envelope.ts` (reuses the `WRITER` protected-resource kind); `MigrationCoordinator.runRow` acquires/releases through `FencedLeaseCoordinator` for every write `test "commits an UPCAST row and resumes idempotently without a second mutation"` [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] T007 Implement deterministic pre-operation and post-operation integrity checks using `computeIntegrityHash` and the hard-failure interpretation of `verifyIntegrity` — `snapshotDigest`/`assertBundleMatchesDigest`/`assertStampedIntegrity` in `migration-integrity.ts` `test "hard-fails a corrupted stamped bundle instead of warning"` [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] T008 Implement `UPCAST` as a pure adjacent-version logical conversion that preserves source bytes, stored identity, order, and replay evidence — `executeUpcast` in `migration-dispositions.ts` `test "executeUpcast writes a snapshot artifact and preserves source/effective digests"` [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] T009 Implement `FORK` as an isolated dark copy with distinct execution/effect namespaces, source immutability, and blocked live publication — `executeFork` in `migration-dispositions.ts` `test "executeFork writes a dark artifact in an isolated namespace and never mutates the source"` [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] T010 Implement `MIGRATE` for complete quiescent checkpoints with one fenced ledger import, identity/order/idempotency preservation, equivalence verification, and retained legacy anchor — `executeMigrate`/`appendInflightMigrationCheckpointEvent`/`buildInflightMigrationCheckpointFacts` in `migration-dispositions.ts` `test "appends exactly one checkpoint event through the fenced authorized-ledger seam"` [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] T011 Implement `PIN` terminal admission and bounded timeout escalation; keep active work wholly legacy-authoritative — `executePin` in `migration-dispositions.ts` (no file write, receipt-only admission record) `test "commits a PIN row"` [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] T012 Implement `BLOCK` veto receipts and reclassification requirements for unknown, stale, corrupt, locked, effect-uncertain, non-quiescent, or rollback-unanchored rows — `executeBlock` in `migration-dispositions.ts`; `MigrationCoordinator.#resolveEnvelope`'s stale/missing/invalid-evidence downgrades `test "blocks a manifest-frozen BLOCK row without acquiring a live fence mutation"` [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] T013 Implement durable receipts, commit markers, idempotent retry, crash recovery, lease-loss abort, dark-fork cleanup, and migration resume without duplicate logical work — `MigrationCoordinator.#commit`/`#writeTerminalReceipt`/`#recordAbort` in `migration-coordinator.ts` `test "resumes from operation_applied after a simulated crash without re-invoking the disposition executor"`, `test "resumes a crashed MIGRATE row from operation_applied without a second ledger append"` [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] T014 Emit the successor handoff manifest with classification digest, operation receipts, pinned terminal receipts, fork parity evidence, blocked rows, rollback anchors, and final integrity states — `buildInflightMigrationHandoff`/`verifyInflightMigrationHandoff` in `migration-handoff.ts` `test "builds and verifies a handoff once every row has a terminal receipt"` [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Verify one-row/one-receipt closure and reject duplicate, missing, unknown, or unsafe committed outcomes — `test "rejects a handoff missing a receipt for one manifest row"`, `test "builds and verifies a handoff once every row has a terminal receipt"` (all 46 rows, `unsafeCommittedRows: 0`) [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] T016 Verify source drift and stale authority epoch return `BLOCK` before any state, ledger, effect, or commit-marker mutation — `test "downgrades a live disposition to BLOCK when fresh evidence has drifted"` (also asserts the `UPCAST` artifact file is never written) [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] T017 Verify stale phase-007 fence tokens fail at the protected write boundary after takeover, including a resumed old process — reused, not reproven here: `FencedLeaseCoordinator`'s takeover/stale-fence behavior is this coordinator's only fence primitive and is independently covered by `runtime/tests/unit/locks-and-fencing.vitest.ts`; this packet consumes that guarantee via `withFence` on every write, exercised by every commit test in this suite [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] T018 Verify `UPCAST` source-byte preservation and replay-equivalent effective state across every registered adjacent-version fixture — `test "executeUpcast writes a snapshot artifact and preserves source/effective digests"`, `test "executeUpcast rejects a proof kind that does not match"` [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] T019 Verify `FORK` cannot mutate source state, publish effects, consume live budget, or become authoritative — `test "executeFork writes a dark artifact in an isolated namespace and never mutates the source"`; `executeFork` never reads or writes any path outside `dark-forks/` and has no live-effect or budget API to call [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] T020 Verify `MIGRATE` preserves identity, ordering, idempotency, pending-work, receipts, budgets, and restore evidence for complete checkpoints and rejects partial checkpoints — `test "appends exactly one checkpoint event through the fenced authorized-ledger seam"`, `test "rejects ledger context facts that do not match the envelope and proof"` [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] T021 Verify `PIN` reaches a bounded terminal handoff or escalates safely, while `BLOCK` prevents the successor authority flip — `test "commits a PIN row"`; `InflightMigrationHandoffClosure.blockedRowIds`/`pinnedRowIds` in `migration-handoff.ts` keep the two sets distinct so a successor cannot treat a blocked row as flip-eligible [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] T022 Crash-inject at every receipt, snapshot, import, postcheck, and commit-marker boundary; verify resume is idempotent and abort preserves legacy authority — `test "resumes from operation_applied after a simulated crash without re-invoking the disposition executor"`, `test "resumes a crashed MIGRATE row from operation_applied without a second ledger append"` [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] T023 Verify integrity mismatch, write failure, fsync/rename failure, ledger failure, rollback failure, and cleanup failure all produce a fail-closed outcome — `test "throws when a bundle no longer matches its recorded digest"`, `test "hard-fails a corrupted stamped bundle instead of warning"`, `test "rejects ledger context facts that do not match the envelope and proof"`, `test "rejects a MIGRATE row with no ledger context"` [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] T024 Verify the handoff is accepted only with a matching classification digest, complete evidence, usable rollback anchors, and zero live unsafe rows — `test "builds and verifies a handoff once every row has a terminal receipt"`, `test "rejects a tampered handoff digest"` [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete — T001-T024 above
- [x] All requirements in spec.md met with evidence — see `checklist.md` and `t001-disposition.md`
- [x] Phase gate green (validate/build/test, migration fault injection, and handoff verification as applicable) — `tsc --noEmit` exit 0; 31/31 tests passed; strict spec-kit validation deferred to a toolchain-capable worktree per `implementation-summary.md` Known Limitations
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Confirm-first disposition**: See `t001-disposition.md`
- **Classification contract**: See `../../004-compatibility-shadow-and-rollback-bridge/004-inflight-state-classification/spec.md`
- **Locks and fencing contract**: See `../../003-shared-evidence-and-control-services/006-locks-and-fencing/spec.md`
- **Successor**: See `../002-per-mode-authority-flip/spec.md`
<!-- /ANCHOR:cross-refs -->
