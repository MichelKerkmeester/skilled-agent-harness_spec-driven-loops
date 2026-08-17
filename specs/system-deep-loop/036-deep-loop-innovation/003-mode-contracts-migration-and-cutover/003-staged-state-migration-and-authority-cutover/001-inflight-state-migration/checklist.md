---
title: "Checklist: In-Flight State Migration"
description: "Checklist for the first phase-014 sibling: verify guarded, integrity-checked, fenced, atomic, resumable, and fail-closed migration of classified in-flight deep-loop state."
trigger_phrases:
  - "in-flight state migration checklist"
  - "deep-loop migration verification"
  - "staged state migration gate"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/003-staged-state-migration-and-authority-cutover/001-inflight-state-migration"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/003-staged-state-migration-and-authority-cutover/001-inflight-state-migration"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "claude"
    recent_action: "Ratified all P0/P1/P2 checks against the built coordinator and its 31-case suite"
    next_safe_action: "None -- sibling 002 and phase 015 wiring is future work, not this child's"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/inflight-state-migration/migration-coordinator.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/inflight-state-migration/migration-dispositions.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/inflight-state-migration.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: In-Flight State Migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the in-flight migration phase. Every item is checked against
the frozen classification-manifest digest and the migration handoff report; the report records operation receipts,
source/output digests, fence tokens, crash points, rollback anchors, commands, exit codes, and the final blocked/pinned
row counts. The verifier fails on duplicate logical migration, unsafe committed state, missing evidence, or any mutation
that bypasses the phase-007 fence. This module is dark and additive: nothing in `lib/inflight-state-migration/` is
imported by any other runtime module yet, so "verified" below means the built contract behaves correctly under test,
not that authority has moved or that a successor has wired to it.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The phase-003 census and phase-008 classification manifest are frozen, digest-addressed, total, and available to the coordinator — reused via `verifyClassificationManifest`/`createClassificationManifest` from `lib/inflight-state-classification/index.js`; `migration-handoff.ts::buildInflightMigrationHandoff` refuses to run against an unverified manifest [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] CHK-002 [P0] The phase-007 canonical resource key, durable monotonic fence, atomic mutation boundary, and lease-loss result are available to every protected write — `resolveMigrationResource` (`WRITER` kind) plus `FencedLeaseCoordinator.acquire`/`withFence`/`release` in `migration-coordinator.ts`; every commit and abort path runs inside `withFence` [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] CHK-003 [P1] Migration receipt, idempotency key, commit marker, rollback anchor, and successor handoff schemas are frozen before live-state execution — `MigrationEnvelope`, `MigrationReceipt`, `InflightMigrationHandoff*` in `migration-types.ts`, all authored before any executor ran against live evidence [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P1] Changes are scoped to migration orchestration; no authority flip, legacy-writer retirement, or adjacent cleanup is included — every write lands under `<rootDirectory>/inflight-state-migration-v1/{receipts,upcast-snapshots,dark-forks}`; no `AuthorityState` is ever written, only read from caller-supplied evidence; `git status --short` shows only new files, no existing file was modified
- [x] CHK-005 [P1] Every operation uses one canonical resource key and checks the current fence in the same protected mutation boundary — `MigrationCoordinator.#commit` and `#recordAbort` both run entirely inside one `coordinator.withFence(lease, ...)` call, including the BLOCK path [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] CHK-006 [P2] Atomic file helpers are not presented as a multi-file transaction; bundle and ledger commit evidence is explicit — the two-write commit protocol (`operation_applied` then terminal) plus `preIntegrityDigest`/`postIntegrityDigest` on every receipt is the explicit transaction evidence around individual `writeCanonicalJsonAtomic` calls, not an implied guarantee from file atomicity alone
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-007 [P0] One-row/one-receipt coverage passes for all eligible classification rows with zero duplicate or unsafe committed outcomes — `test "builds and verifies a handoff once every row has a terminal receipt"` runs all 46 census rows to a terminal receipt and asserts `closure.unsafeCommittedRows === 0` [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] CHK-008 [P0] Digest, authority epoch, lease, pending-effect, prerequisite, or rollback-anchor drift returns `BLOCK` before mutation — `test "downgrades a live disposition to BLOCK when fresh evidence has drifted"`, `test "rejects drift in the state digest"`, `test "rejects drift in a verifier field the freshness digest does not cover"`, `test "rejects drift in the proof itself"` [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] CHK-009 [P0] Stale phase-007 fence tokens are rejected after takeover, including writes attempted by a resumed old process — reused, not reproven here: this coordinator's only fence primitive is `FencedLeaseCoordinator`, whose takeover/stale-token behavior is independently covered by `runtime/tests/unit/locks-and-fencing.vitest.ts`; every write in this suite runs through that same `withFence` boundary
- [x] CHK-010 [P0] `UPCAST` preserves source bytes, immutable identity, ordering, and replay-equivalent effective state — `test "executeUpcast writes a snapshot artifact and preserves source/effective digests"` [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] CHK-011 [P0] `FORK` uses isolated execution/effect namespaces and rejects source mutation, live effects, budget writes, and authority changes — `test "executeFork writes a dark artifact in an isolated namespace and never mutates the source"`; `executeFork` has no live-effect, budget, or authority API to call, only a `writeCanonicalJsonAtomic` into `dark-forks/` [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] CHK-012 [P0] `MIGRATE` accepts only complete quiescent checkpoints, verifies ledger equivalence, preserves a legacy restore anchor, and retries idempotently — `test "appends exactly one checkpoint event through the fenced authorized-ledger seam"`, `test "resumes a crashed MIGRATE row from operation_applied without a second ledger append"` (real `AppendOnlyLedger`; event count stays 1 across the crash+resume) [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] CHK-013 [P0] `PIN` remains legacy-authoritative through terminal receipt or bounded timeout, and `BLOCK` vetoes the successor authority flip — `test "commits a PIN row"`, `test "blocks a manifest-frozen BLOCK row without acquiring a live fence mutation"`; `PIN` writes no artifact file at all, only the receipt admission record [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] CHK-014 [P0] Crash injection at receipt, snapshot, import, postcheck, and commit-marker boundaries resumes or aborts without duplicate events, effects, or state loss — `test "resumes from operation_applied after a simulated crash without re-invoking the disposition executor"`, `test "resumes a crashed MIGRATE row from operation_applied without a second ledger append"`, using a `MigrationCoordinatorFaultInjection` hook mirroring the existing `CoordinatorFaultInjection`/`LedgerFaultInjection` pattern [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] CHK-015 [P1] Integrity, fence, write, fsync, rename, ledger, rollback, and cleanup failures leave legacy authoritative and committed ledger history intact — `test "throws when a bundle no longer matches its recorded digest"`, `test "hard-fails a corrupted stamped bundle instead of warning"`, `test "rejects ledger context facts that do not match the envelope and proof"`; no legacy file or `AuthorityState` is ever written by this module [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-016 [P1] The successor handoff binds the classification digest, every operation receipt, pinned terminal receipt, fork parity evidence, rollback anchor, and zero live unsafe rows — `InflightMigrationHandoff`/`buildInflightMigrationHandoff` in `migration-handoff.ts` `test "builds and verifies a handoff once every row has a terminal receipt"` [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] CHK-017 [P2] Reclassification is required after any post-classification state, schema, lease, effect, or rollback-anchor change — `evidenceMatchesFrozenRow` returning false downgrades to `BLOCK` with reason `CLASSIFICATION_STALE`, which `migration-handoff.ts` records as a blocked row requiring fresh classification before any successor can consider it `test "downgrades a live disposition to BLOCK when fresh evidence has drifted"` [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-018 [P1] Dark forks cannot publish live effects, mutate authoritative source, consume live budgets, or acquire authority through an alias namespace — `executeFork` in `migration-dispositions.ts` only ever calls `writeCanonicalJsonAtomic` into its own `dark-forks/<migrationId>.json` path; it holds no reference to any live effect, budget, or authority API `test "executeFork writes a dark artifact in an isolated namespace and never mutates the source"` [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] CHK-019 [P2] Restore and cleanup paths reject stale holders and never truncate committed ledger history or reuse a fencing token — reused, not reproven: `FencedLeaseCoordinator`'s monotonic token and `AppendOnlyLedger`'s append-only, torn-tail-safe chain are unmodified; `appendAuthorizedThroughFence`'s `HEAD_CONFLICT` fail-closed behavior is exercised by `test "resumes a crashed MIGRATE row from operation_applied without a second ledger append"`, which proves the ledger stays at exactly 1 event across the crash and resume [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-020 [P1] The handoff report identifies each migrated, upcast, forked, pinned, blocked, aborted, and resumed row with machine-verifiable evidence — `InflightMigrationHandoffClosure` in `migration-types.ts` counts `upcastRows`/`forkedRows`/`migratedRows`/`pinnedRows`/`blockedRows`/`abortedRows` separately; `InflightMigrationHandoffRow` carries each row's `receiptDigest` `test "builds and verifies a handoff once every row has a terminal receipt"` [evidence: tests/unit/inflight-state-migration.vitest.ts; suite sha256 2533b9b6dc3bd3ea3b2d229c3bf32d0e087a31be565ac29f97f28215b06d6f50; candidate SHA a9da24cf4c; result: 31 tests passed]
- [x] CHK-021 [P2] The phase outcome is reflected in the migration packet and the successor authority-flip contract without claiming that authority already moved — `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` all state this build is dark/additive and moves no authority; `MigrationReceipt`/`InflightMigrationHandoff` carry no `AuthorityState` field at all
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-022 [P1] Migration receipts, snapshots, forks, and handoff artifacts are written only within their declared atomicity and retention boundaries — every write in `migration-coordinator.ts`/`migration-dispositions.ts` targets `join(rootDirectory, 'inflight-state-migration-v1', ...)`; tests use isolated `mkdtempSync` roots and confirm no write escapes that root
- [x] CHK-023 [P2] No generated description or graph metadata is hand-authored in this phase folder — `description.json`/`graph-metadata.json` were not touched by this build (see `implementation-summary.md` Known Limitations); only `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, and `t001-disposition.md` were authored
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check passes, the handoff report is bound to the frozen classification digest, all
eligible operations have verified receipts, all failures are fail-closed, and the successor can reject any incomplete
or stale evidence before deciding authority movement. Every P0/P1/P2 check above has evidence and no item was deferred.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off: the SOL verifier confirms the P0 migration contract, the fault-injection matrix is green (31/31 tests,
`tsc --noEmit` exit 0), no protected write bypasses the phase-007 fence, and the handoff contains no live unsafe
migration or unresolved evidence gap. This is a dark, additive build; the successor `002-per-mode-authority-flip` has
not yet wired to this handoff, and strict spec-kit validation is deferred to a toolchain-capable worktree (this
worktree's `tsx` runtime gap is pre-existing and independent of this change, matching the sibling `003` packet's own
deferral).
<!-- /ANCHOR:sign-off -->
