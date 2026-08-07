---
title: "Feature Specification: In-Flight State Migration"
description: "Plan the guarded migration of eligible in-flight deep-loop state at staged cutover: logically upcast safe rows, fork isolated dark copies, migrate quiescent checkpoints to the ledger, preserve pinned legacy work, and defer every blocked row without corrupting or losing a running loop."
trigger_phrases:
  - "in-flight state migration"
  - "deep-loop staged state migration"
  - "upcast fork migrate cutover"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/014-staged-state-migration-and-authority-cutover"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/014-staged-state-migration-and-authority-cutover/001-inflight-state-migration"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Authored the guarded in-flight state migration contract"
    next_safe_action: "Define migration receipts and preflight guards from frozen state rows"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: In-Flight State Migration

> Phase adjacency under `014-staged-state-migration-and-authority-cutover` (navigation order, not a hard runtime dependency): predecessor `none` (first sibling); successor `002-per-mode-authority-flip`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/014-staged-state-migration-and-authority-cutover/001-inflight-state-migration |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | First sibling of the phase-014 staged state migration and authority cutover parent |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The phase-008 classification identifies what may happen to live state, but it does not perform the operation. A loop
can be between iterations, holding a lease, waiting for fan-out results, paused at a checkpoint, carrying pending
effects, or writing a JSON/JSONL projection when phase-014 prepares a mode for authority movement. A migration that
reads once and writes once without rechecking ownership can duplicate work, lose a result, publish an effect twice, or
leave legacy and ledger writers believing they are authoritative.

This phase plans the guarded execution of the phase-008 `UPCAST`, `PIN`, `FORK`, `MIGRATE`, and `BLOCK` dispositions.
`UPCAST` is an in-place logical shape conversion that preserves source bytes and replay identity. `FORK` creates an
isolated dark copy with distinct execution and effect namespaces. `MIGRATE` imports a complete quiescent checkpoint
into the ledger while retaining a legacy rollback anchor. `PIN` keeps an active run wholly legacy-authoritative until a
declared terminal boundary. `BLOCK` performs no transformation and vetoes the affected mode's authority flip.

The guards come from the phase-007 locks and fencing contract: a canonical resource key, a durable monotonic fencing
token, and validation of the current token in the same commit boundary as each protected mutation. The migration also
uses the existing `atomic-state.ts` primitives deliberately. `computeIntegrityHash` and `verifyIntegrity` provide
deterministic snapshot digests, while `writeTextAtomic` and `writeStateAtomic` provide temp-file, fsync, and rename
replacement for individual files. They do not by themselves make a multi-file or ledger import transactional, so the
plan adds a migration receipt, a commit marker, and a resumable coordinator around them.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A row-level migration envelope that binds the phase-008 class, state identity, source digest, schema/version, authority epoch, resource key, fencing token, migration ID, rollback anchor, and operation status.
- Immediate preflight and post-operation integrity checks for every eligible row, with compare-and-swap freshness checks for state digest, authority epoch, lease/effect set, prerequisites, and rollback anchor.
- Guarded procedures for logical `UPCAST`, isolated `FORK`, checkpointed `MIGRATE`, legacy `PIN`, and cutover-vetoing `BLOCK`.
- Atomicity and resumability for the migration coordinator: idempotent receipts, durable progress, commit markers, safe retry boundaries, and recovery after process or host failure.
- Abort and rollback handling that leaves legacy authoritative until all required verification succeeds, retains source and restore evidence, and prevents stale holders from completing abandoned work.
- A handoff manifest for the successor `002-per-mode-authority-flip` containing migration outcomes, blocked and pinned rows, parity evidence, rollback anchors, and the complete classification-manifest digest.

### Out of Scope
- Reclassifying census rows or inventing state evidence; phase-008 owns the five-way classification contract.
- Implementing the shared lease/fencing service; phase-007 owns the service, while this phase consumes its guarded mutation boundary.
- Defining event envelopes, ledger schemas, replay fingerprints, or transition vocabulary owned by phase-006 and phase-004.
- Flipping mode authority, issuing the per-mode cutover certificate, or opening the rollback window; successor `002-per-mode-authority-flip` owns that operation.
- Retiring legacy writers or archival readers; phase-015 owns retirement after zero-use telemetry and rollback proof.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Migration is total over eligible classified rows | Every non-blocked row in the frozen classification manifest has exactly one migration receipt or an explicit `PIN` handoff; no row is silently skipped or processed twice |
| REQ-002 | Preflight proves the row is still eligible | Before mutation, the coordinator verifies source digest, schema, authority epoch, canonical resource key, current fence, leases, pending effects, prerequisites, and rollback anchor; drift returns `BLOCK` |
| REQ-003 | `UPCAST` preserves stored identity and bytes | The adjacent pure upcaster chain is deterministic and side-effect-free; effective state changes in place at the read/materialization boundary while original bytes, identity, order, and receipt remain auditable |
| REQ-004 | `FORK` is isolated and non-authoritative | The dark copy has a distinct execution/effect namespace, parent migration ID, and fence; it cannot mutate the source, consume live authority, publish effects, or alter budgets |
| REQ-005 | `MIGRATE` imports only a complete quiescent checkpoint | The import preserves identity, ordering, idempotency, budgets, receipts, pending-work semantics, and rollback anchors; source authority stays fenced and legacy-readable until post-import verification succeeds |
| REQ-006 | `PIN` and `BLOCK` protect active work | `PIN` remains legacy-authoritative through a bounded terminal contract; `BLOCK` performs no migration and prevents the mode authority flip until reclassification and evidence close the veto |
| REQ-007 | Each protected write uses the phase-007 fence atomically | The coordinator cannot complete a state write, ledger import, checkpoint transition, or migration commit marker after lease loss or token takeover |
| REQ-008 | Migration is crash-safe and resumable | A crash before commit leaves a recoverable pending receipt; a committed operation resumes idempotently without duplicate ledger events, effects, forks, or source deletion |
| REQ-009 | Integrity is checked before and after each operation | Pre-operation and post-operation digests, equivalence results, and receipt status are recorded; mismatch aborts the operation and preserves the last verified source/anchor |
| REQ-010 | Abort and rollback fail closed | Any write, fence, integrity, prerequisite, or verification failure stops further migration, leaves legacy authoritative, fences stale work, and exposes a restore path without truncating committed ledger history |
| REQ-011 | The successor receives machine-verifiable handoff evidence | The handoff binds the classification-manifest digest, all migration receipts, pinned terminal receipts, fork parity evidence, blocked rows, rollback anchors, and zero rows with an unsafe committed migration |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every eligible phase-008 row has one deterministic operation outcome, receipt, and final integrity status.
- **SC-002**: A stale digest, lease, fence, authority epoch, pending-effect set, prerequisite, or rollback anchor causes an immediate abort and `BLOCK` outcome with no authority movement.
- **SC-003**: `UPCAST` preserves source bytes and replay identity while making the current effective shape available without a second writer epoch.
- **SC-004**: `FORK` produces parity evidence in an isolated namespace and cannot publish a live effect or mutate the authoritative source.
- **SC-005**: `MIGRATE` imports only a quiescent, complete checkpoint, verifies ledger equivalence, and retains a usable legacy restore anchor.
- **SC-006**: Process termination at every coordinator boundary can resume or abort deterministically without duplicated events, effects, or state loss.
- **SC-007**: `PIN` rows remain legacy-authoritative through terminal receipts, and `BLOCK` rows prevent the successor authority flip.
- **SC-008**: The successor handoff is bound to a classification digest and contains sufficient evidence for a per-mode cutover certificate.

**Given** a row whose source digest or authority epoch changes after classification, **When** migration preflight runs,
**Then** it records `BLOCK`, releases the lease safely, and does not write a ledger event or migration commit marker.

**Given** a quiescent checkpoint with complete identity, ordering, pending-work, and rollback evidence, **When** the
`MIGRATE` operation commits under the current fence, **Then** the ledger state is equivalent, the source remains
legacy-readable, and the receipt can be replayed without duplicating the import.

**Given** a live dark copy is required for parity, **When** `FORK` runs, **Then** the copy has separate effect and
execution namespaces and every attempted live publication is rejected.

**Given** a process crashes after import verification but before the commit marker, **When** the coordinator resumes,
**Then** it detects the pending receipt, rechecks the fence and digests, and commits or aborts once without replaying
the import as a second logical migration.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

This child declares `depends_on: []` in the phase-014 planning tree; adjacency is navigation, not a hard runtime
dependency. Execution consumes the phase-008 classification manifest and its row-level freshness rules, the phase-007
locks/fencing service, the phase-004 transition and rollback policy, the phase-014 manifest entry, and the frozen
phase-003 state census. The [phase-008 classification contract](../../008-compatibility-shadow-and-rollback-bridge/004-inflight-state-classification/spec.md)
is the authority for disposition semantics. The [phase-007 locks and fencing contract](../../007-shared-evidence-and-control-services/006-locks-and-fencing/spec.md)
is the authority for resource keys, monotonic fencing, and atomic protected mutation.

The highest risks are treating an atomic file replacement as a transaction across a state bundle, allowing an expired
process to finish after takeover, importing a checkpoint while an effect or fan-out lease remains active, deleting the
legacy source before post-verification, and retrying a partially committed import without an idempotency key. The
coordinator must therefore keep source authority and rollback evidence until a durable commit marker exists, use the
phase-007 fence at every mutation boundary, and classify any uncertainty as `BLOCK`.

The existing [`atomic-state.ts`](../../../../../skills/system-deep-loop/runtime/lib/deep-loop/atomic-state.ts)
implementation supplies deterministic hashing at `computeIntegrityHash` (`:210-213`), warning-only verification at
`verifyIntegrity` (`:242-259`), and single-file atomic replacement at `writeTextAtomic` (`:483-500`). The migration
must treat warning-only integrity failure as a hard migration failure and must add bundle-level transaction evidence
around those primitives. The [phase tree](../../manifest/phase-tree.json) keeps this work before
`002-per-mode-authority-flip`, so no successful migration receipt may be interpreted as an authority cutover.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for planning. Execution must pin the migration receipt schema, the durable coordinator store, the exact
ledger import transaction boundary, the bounded `PIN` terminal timeout, the dark fork namespace encoder, and the
post-verification equivalence command against the frozen phase-003 census and the phase-007 atomicity domain. Those
choices may not weaken source preservation, fencing at commit, idempotent resume, `BLOCK` as the fail-closed result,
or the successor's requirement for a complete cutover handoff.
<!-- /ANCHOR:questions -->
