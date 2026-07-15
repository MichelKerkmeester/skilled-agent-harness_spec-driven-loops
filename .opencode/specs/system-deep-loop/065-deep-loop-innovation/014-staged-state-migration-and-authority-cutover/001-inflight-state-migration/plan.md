---
title: "Implementation Plan: In-Flight State Migration"
description: "Implementation Plan for the first phase-011 sibling: guarded, integrity-checked, fenced, atomic, and resumable migration of eligible in-flight deep-loop state before per-mode authority flips."
trigger_phrases:
  - "in-flight state migration implementation plan"
  - "deep-loop migration guards"
  - "staged state migration rollback plan"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/014-staged-state-migration-and-authority-cutover/001-inflight-state-migration"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/014-staged-state-migration-and-authority-cutover/001-inflight-state-migration"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Outlined the fenced migration execution phases"
    next_safe_action: "Pin the migration receipt and coordinator transaction boundary"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: In-Flight State Migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop runtime state migration (phase-011 sibling 001) |
| **Change class** | Guarded state transformation and migration orchestration |
| **Execution** | Frozen phase-000 census and phase-005 classification manifest; legacy remains authoritative until handoff |

### Overview
The coordinator consumes one classified row at a time, verifies that its state has not drifted, acquires the canonical
phase-004 resource lease, and records a durable migration receipt before touching state. It then executes exactly one
operation: logical `UPCAST`, isolated `FORK`, checkpointed `MIGRATE`, legacy `PIN`, or fail-closed `BLOCK`. Every
operation records before/after integrity evidence and a resumable status. The coordinator never interprets a successful
migration as authority movement; it produces the evidence consumed by `002-per-mode-authority-flip`.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The frozen phase-000 census and phase-005 row classification manifest are available with stable digests
- [ ] The phase-004 canonical resource key, lease, fencing token, and atomic mutation boundary are available to callers
- [ ] The migration receipt, idempotency key, commit marker, and rollback-anchor shapes are frozen
- [ ] Every state family has a declared source reader, integrity input, operation handler, verifier, and abort path
- [ ] The ledger import transaction and the bundle-level state snapshot boundary are explicit
- [ ] The successor handoff contract distinguishes migrated, upcast, forked, pinned, blocked, aborted, and resumed rows

### Definition of Done
- [ ] Every eligible row has one durable operation receipt and a verified final state
- [ ] Crash, lease loss, integrity mismatch, partial import, and stale classification all fail closed without authority movement
- [ ] The handoff manifest binds complete evidence and leaves no unsafe migration eligible for the authority flip
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Selection and envelope**: load the phase-005 row, classification-manifest digest, source locator, authority epoch,
  pending-effect/lease set, and rollback anchor. Generate a stable migration ID and operation idempotency key. Reject
  duplicate or unknown rows before acquiring a lease.
- **Preflight fence**: resolve one canonical resource key from packet/run/lineage identity, acquire the phase-004
  lease, capture the durable monotonic fencing token, then re-read the source and compare digest, epoch, schema,
  effects, locks, prerequisites, and anchor. Any mismatch becomes `BLOCK`.
- **Integrity boundary**: compute a deterministic pre-operation digest with `computeIntegrityHash`; retain the exact
  source bytes or transactional snapshot. `verifyIntegrity` returning false is a hard failure for migration even though
  the helper currently warns and returns. The operation may use `writeStateAtomic` or `writeTextAtomic` for individual
  replacement, but the coordinator owns the multi-file/ledger commit protocol.
- **UPCAST procedure**: resolve the registered adjacent pure chain, materialize the effective current shape without
  changing stored source bytes or identity, verify replay-equivalent output, and append a receipt under the same fence.
  If a materialized snapshot is required, write a temporary versioned representation atomically and retain the source
  digest as the rollback anchor.
- **FORK procedure**: create a dark copy keyed by migration ID plus source identity in a distinct execution/effect
  namespace. Verify the copy before exposing it to parity readers. Block live effect publication, budget mutation, and
  authority writes from the fork. A failed fork is disposable dark state, never a source rollback action.
- **MIGRATE procedure**: require quiescence, no active writer or unresolved effect, and a complete checkpoint. Capture
  the source snapshot and digest, import identity/order/idempotency/budget/receipt/pending-work state through one fenced
  ledger transaction, verify equivalence, write the migration commit marker, and retain the legacy snapshot until the
  successor issues the authority decision.
- **PIN/BLOCK procedure**: `PIN` emits an admission record and keeps all work on legacy until terminal receipt or bounded
  timeout. `BLOCK` writes only the veto/diagnostic receipt when safe, performs no state transformation, and requires
  fresh classification after the blocking evidence is corrected.
- **Resume and abort coordinator**: statuses are `prepared`, `fenced`, `snapshot_verified`, `operation_applied`,
  `postcheck_verified`, `committed`, `aborted`, or `blocked`. Resume must compare receipt identity and source digest,
  re-acquire a higher valid fence when needed, and continue only from an idempotent boundary.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the phase-005 classification manifest, the phase-004 locks/fencing contract, the phase-011 manifest entry,
  and the frozen phase-000 state corpus are available and digest-addressed.
- Pin the migration receipt schema, operation status machine, canonical resource-key encoder, idempotency key, and
  coordinator atomicity domain before touching a live row.
- Build a fixture matrix for each state family and each crash/fence/integrity boundary; include a live mid-iteration,
  active lease, pending effect, paused checkpoint, and partially written bundle case.

### Phase 2: Implementation
- Add the preflight envelope and guarded lease/fence acquisition. Recheck all phase-005 freshness fields immediately
  before each protected mutation and convert drift to `BLOCK`.
- Implement the integrity snapshot and postcheck path around `computeIntegrityHash`, `verifyIntegrity`,
  `writeStateAtomic`, and `writeTextAtomic`; add bundle-level commit evidence where file atomicity is insufficient.
- Implement `UPCAST` with source-byte preservation and a pure adjacent chain; implement `FORK` with isolated execution and
  effect namespaces; implement `MIGRATE` with a complete quiescent checkpoint and one fenced ledger import.
- Implement `PIN` terminal admission and bounded timeout handling; implement `BLOCK` veto persistence and reclassification
  requirements without changing legacy authority.
- Add resumable receipts, commit markers, idempotent retries, lease-loss handling, crash recovery, abort cleanup for dark
  copies, and restore-anchor retention for migrated state.
- Emit the successor handoff manifest with classification digest, operation receipts, parity evidence, pinned terminal
  receipts, blocked rows, rollback anchors, and final integrity outcomes.

### Phase 3: Verification
- Prove one-row/one-receipt coverage over the eligible classification manifest and zero unsafe committed operations.
- Exercise each operation with source drift, stale fence, active effect, malformed snapshot, postcheck mismatch, process
  termination, retry, and rollback injection.
- Verify source preservation for `UPCAST`, namespace isolation for `FORK`, ledger equivalence and restore evidence for
  `MIGRATE`, terminal legacy ownership for `PIN`, and cutover veto for `BLOCK`.
- Verify the handoff is rejected when its classification digest, receipt set, rollback evidence, or blocked-row status is
  incomplete, stale, or inconsistent.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Manifest coverage test proves each eligible row has exactly one operation receipt or explicit `PIN` handoff |
| REQ-002 | Mutate source digest, authority epoch, lease/effect set, prerequisite, and rollback anchor between classification and preflight; each case returns `BLOCK` |
| REQ-003 | Upcast fixtures compare effective state, source bytes, identity, order, and replay fingerprint before and after |
| REQ-004 | Fork fixtures attempt source mutation, live effect publication, budget write, and authority change from the dark namespace; all are rejected |
| REQ-005 | Migration fixtures cover complete/quiescent, incomplete, active-lock, pending-effect, partial-SQLite, and restore-anchor cases |
| REQ-006 | Pin fixtures complete through terminal receipt and exceed bounded timeout; block fixtures prevent the successor handoff |
| REQ-007 | Take over each protected resource and prove old-token writes fail at the commit boundary |
| REQ-008 | Crash-inject before receipt, after snapshot, after import, after postcheck, and before commit marker; resume each case once |
| REQ-009 | Tamper with source, output, and receipt digests; verify the operation aborts and preserves the last verified anchor |
| REQ-010 | Inject write, fsync, rename, ledger, fence, and rollback failures; verify legacy remains authoritative and committed history is not truncated |
| REQ-011 | Validate the handoff digest and required evidence set, including zero live unsafe rows, against the successor contract |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase consumes the [phase-005 in-flight classification](../../008-compatibility-shadow-and-rollback-bridge/004-inflight-state-classification/spec.md),
the [phase-004 locks and fencing contract](../../007-shared-evidence-and-control-services/006-locks-and-fencing/spec.md),
the transition and rollback policy owned by phase-001, the [phase tree manifest](../../manifest/phase-tree.json), and the
frozen phase-000 state census. Runtime integrity and file atomicity are supplied by
`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts`; its `computeIntegrityHash`,
`verifyIntegrity`, `writeStateAtomic`, and `writeTextAtomic` behavior is part of the implementation boundary.

The successor `002-per-mode-authority-flip` consumes this phase's handoff but owns authority movement, cutover windows,
and cutover certificates. Phase-012 consumes later zero-use and rollback evidence for legacy-writer retirement. No
dependency may authorize a cutover when a row is `BLOCK`, has an unresolved `PIN`, or lacks a verified migration receipt.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Before operation commit, abort by marking the receipt `aborted` under the current fence, removing only disposable dark
fork artifacts, releasing the lease with its nonce/token, and leaving the verified legacy source untouched. If the fence
is lost, the old process cannot clean up or commit; a successor recovery worker must acquire a higher token and perform
the bounded cleanup.

For `UPCAST`, discard the materialized effective representation and return to the retained source bytes. For `FORK`,
quarantine the dark namespace and preserve its receipt for diagnosis without publishing it. For `MIGRATE`, restore by
reading the retained legacy snapshot/anchor or by abandoning the uncommitted ledger transaction; never truncate
committed ledger history. A post-import failure before the commit marker leaves a resumable pending receipt, while a
committed marker makes retries no-ops after fresh fence and digest checks.

Any rollback or restore failure becomes `BLOCK`, not a best-effort success. Legacy remains authoritative until the
successor validates the complete handoff and independently decides whether to flip a mode.
<!-- /ANCHOR:rollback -->
