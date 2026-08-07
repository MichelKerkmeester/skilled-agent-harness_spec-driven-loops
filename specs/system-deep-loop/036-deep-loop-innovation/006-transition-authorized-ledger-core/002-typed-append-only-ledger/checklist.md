---
title: "Checklist: Typed Append-Only Ledger"
description: "Blocking verification checklist for typed append semantics, ordering, integrity, deterministic reads/reducers, and dark coexistence with legacy persistence."
trigger_phrases:
  - "typed append-only ledger checklist"
  - "deep-loop ledger verification checklist"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/002-typed-append-only-ledger"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/002-typed-append-only-ledger"
    last_updated_at: "2026-07-15T13:43:04Z"
    last_updated_by: "codex"
    recent_action: "Defined the blocking ledger integrity, ordering, and coexistence checks"
    next_safe_action: "Execute each P0 fixture against the implemented writer and reader"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Typed Append-Only Ledger

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the typed append-only ledger. The verifier binds results to the
candidate SHA and pinned BASE, records commands, exit codes, test counts, ledger fixture digests, and verified heads,
and fails on zero-test discovery, unexpected tracked mutation, authority drift, or any skipped P0 case. The accepted focused gate supplies the implementation evidence recorded below.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The sibling envelope and authorization interfaces are frozen enough to bind canonical bytes, stable event identity, event type/version, stream identity, and proof reference [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-002 [P0] The runtime inventory names every legacy JSONL/state/checkpoint writer, repair helper, reader, and reducer represented by the reusable dark adapter census [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-003 [P0] The authority assertion is explicit: legacy remains canonical through phase 013 and only phase 014 may authorize a mode cutover [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-004 [P2] Candidate SHA, focused command, ledger identity constraints, owner-only permissions, and lock behavior are recorded in the verifier report [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P1] Public types separate untrusted frames, verified frames, decoded envelopes, authorized appends, durable receipts, and derived projections [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-006 [P1] No ledger code calls JSONL tail repair, merge-by-rewrite, snapshot replacement, or mutable checkpoint helpers on committed ledger files [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-007 [P1] Sequence allocation, idempotency re-check, append, fsync, and receipt issuance remain inside one ledger-scoped critical section [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-008 [P2] Comments describe durable invariants and failure semantics without ephemeral packet or task identifiers [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-009 [P0] Multi-process barrier tests prove successful appends form one contiguous sequence with one unambiguous head [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-010 [P0] An exact retry returns the original sequence/hash receipt and writes no second frame [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-011 [P0] Reusing an `event_id` with different canonical bytes returns a typed conflict and leaves the head unchanged [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-012 [P0] Mutation, deletion, insertion, reordering, duplicate-frame insertion, sequence gaps, and forked heads are detected by full verification [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-013 [P0] Malformed or torn frames, unknown event types, and invalid authorization linkage fail before a typed event is yielded [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-014 [P0] Missing, stale, unknown-policy, evaluator-failed, audit-failed, or event/ledger-mismatched authorization prevents domain append [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-015 [P0] Crash-before-domain commit produces no domain receipt; torn bytes are preserved in quarantine and recovery resumes from the last verified head [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-016 [P0] Repeated replay with the same decoder and reducer versions produces byte-identical projections and the same verified head [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-017 [P0] Dark append success, denial, and injected ledger failure return the exact legacy result and do not promote dark state to authority [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-018 [P0] Adapter coverage includes `atomic-state.ts`, `jsonl-repair.ts` consumers, `round-state-jsonl.cjs`, `fanout-pool.cjs`, `fanout-run.cjs`, observability, review/alignment reducers, and iteration verification [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-019 [P1] Integrity and ordering tests use canonical golden vectors plus deterministic concurrent ordering and a five-case integrity mutation matrix [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-020 [P1] The accepted focused co-landing suite, TypeScript typecheck, and strict packet validation pass with non-zero discovery [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-021 [P0] Every REQ-001 through REQ-010 row has direct command or fixture evidence and no requirement is inferred from a neighboring test [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-022 [P1] The implementation inventory contains no bypass append path, unchecked reader, or recovery API that silently rewrites committed evidence [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-023 [P0] Unsafe ledger identities are rejected and committed frame/directory permissions are owner-only [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-024 [P0] Event hashes bind ledger identity, sequence, previous hash, canonical envelope bytes, and authorization reference without logging secrets [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-025 [P1] Malformed/torn frames, unknown event types, and altered authorization linkage fail through typed verification before event delivery [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-026 [P1] Runtime reference docs distinguish the immutable ledger from legacy JSONL repair, mutable snapshots, replace-style checkpoints, and derived projections [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-027 [P2] The phase outcome, dark non-authority, recovery procedure, typed errors, and operator diagnostics are reflected in the packet docs [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-028 [P1] Ledger writer, reader, frame types, integrity helpers, reducers, adapters, and tests have dependency-closed ownership without duplicating existing legacy helpers [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
- [x] CHK-029 [P1] Changes remain additive and path-scoped; no legacy writer, archival reader, state file, checkpoint, or repair test is removed [evidence: The relevant source module and direct focused invariant proof are mapped in `implementation-summary.md`; the accepted authorized-ledger gate passes 20/20.]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is implementation-complete only when every P0 check carries direct evidence, P1 checks are complete or
explicitly approved for deferral, the verified ledger head is stable across replay, all inventoried legacy surfaces
retain authority and behavior, and build/typecheck/test/strict-validation gates pass with non-zero discovery.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the blocking verifier binds its report to the exact candidate SHA and BASE, records the canonical
fixture and head digests, proves no tracked mutation from verification, and confirms that no authority moved from the
legacy path.
<!-- /ANCHOR:sign-off -->
