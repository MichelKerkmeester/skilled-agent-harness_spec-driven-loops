---
title: "Checklist: Replay Fingerprints"
description: "Blocking verification checklist for deterministic replay-fingerprint derivation, immutable attestations, fail-closed mismatch handling, and shared downstream consumption."
trigger_phrases:
  - "replay fingerprints checklist"
  - "deep-loop replay digest verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/003-replay-fingerprints"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/003-replay-fingerprints"
    last_updated_at: "2026-07-20T23:18:42Z"
    last_updated_by: "codex"
    recent_action: "Passed the deterministic, fault, attestation, version, and mismatch matrices"
    next_safe_action: "Consume the verified result from later dark integration phases"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/replay-fingerprint.vitest.ts"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Replay Fingerprints

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the replay-fingerprint phase. Every item remains pending until implementation evidence exists. The verifier must pin the candidate SHA, the covered ledger fixture/range, fingerprint and replay-contract versions, exact commands and exit codes, and expected/actual component digests. Zero discovered fixtures, silent rebaselining, partial trusted output after mismatch, or unexpected tracked mutation fails the phase.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The envelope, ledger, upstream transition/versioning, and phase-tree consumer contracts are pinned and mutually consistent. [evidence: The implementation composes only through existing public boundaries; the 100/100 dependency matrix passes.]
- [x] CHK-002 [P0] Every replay-affecting input is classified as stored bytes, a registered identity/version, or an immutable referenced digest. [evidence: The descriptor inventory and replay-component registry contract are recorded in `implementation-summary.md`.]
- [x] CHK-003 [P1] The descriptor schema, serializer, fingerprint registry, error vocabulary, and after-range attestation event are frozen before implementation. [evidence: The new module boundary owns these contracts; `tsc --noEmit` exits `0`.]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P0] The derivation path consumes only integrity-checked ascending ledger events and cannot hash unchecked or partially decoded data. [evidence: `deriveReplayFingerprint()` requires `AppendOnlyLedger` and uses `readVerifiedEvents()`; corruption fixtures fail before trust.]
- [x] CHK-005 [P0] `fingerprint_version` is independent of envelope/event versions and resolves one exact historical implementation. [evidence: Missing/future fingerprint versions fail without envelope-version inference; registered v1 history and v2 current writing pass.]
- [x] CHK-006 [P1] Canonical serialization has explicit field order, length delimiting, normalized maps, preserved ordered arrays, and no platform-dependent inputs. [evidence: Determinism rules and repeated-byte proof are recorded in `implementation-summary.md`; host-derived input rejection passes.]
- [x] CHK-007 [P1] Lookup indexes, prefix caches, and diagnostics are rebuildable and never become fingerprint or ledger authority. [evidence: No index or cache is persisted; immutable ledger attestations are the only lookup source and diagnostics never write.]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-008 [P0] Repeated processes and every supported platform produce byte-identical stored, effective, projection, descriptor, and final digest bytes. [evidence: Repeated derivation on the supported OpenCode/Node runtime proves byte equality across every digest layer and normalized map order; Vitest 24/24 passed.]
- [x] CHK-009 [P0] Mutation, deletion, insertion, reordering, sequence gaps, forks, torn tails, and changed range bounds fail before trusted replay output. [evidence: Real on-disk ledger mutations and the existing chain-integrity suite pass in the combined 100/100 gate.]
- [x] CHK-010 [P0] Envelope-registry, type/version-set, upcaster-registry, upcaster-chain, reducer, projection-schema, and canonicalizer drift each fail in the named component. [evidence: The focused fail-closed matrix asserts responsible component names; 24/24 tests pass.]
- [x] CHK-011 [P0] Replay-affecting configuration, policy, or artifact state not committed by the ledger or an immutable digest blocks fingerprint derivation. [evidence: Missing replay input and forbidden host-derived input fixtures fail before projection trust; Vitest 24/24 passed.]
- [x] CHK-012 [P0] Historical and current fingerprint versions recompute under their registered implementations; future, unknown, missing, or ambiguous versions fail closed. [evidence: Historical/current registry and missing/future attestation tests pass independently of envelope versions; Vitest 24/24 passed.]
- [x] CHK-013 [P0] The fingerprint attestation is appended after its inclusive range, excludes itself, binds the exact range, and remains immutable. [evidence: The `1..3` descriptor has three hashes and is attested at sequence `4`; mismatch tests preserve the stored bytes.]
- [x] CHK-014 [P0] Exact duplicate attestations are idempotent; conflicting attestations for the same run/range/version are rejected without replacement. [evidence: Exact retry and conflict fixtures both leave the ledger head at sequence `4`; Vitest 24/24 passed.]
- [x] CHK-015 [P0] Stored, effective, and projection component mismatches return typed non-zero failures and no trusted projection, parity certificate, cutover evidence, or gate pass. [evidence: Each component fixture returns exit `1`; only the success variant carries `verified`.]
- [x] CHK-016 [P0] Diagnostics report bounded expected/actual digests and the earliest determinable sequence or replay stage without mutating protected history. [evidence: Failure values are bounded to 96 characters and fixtures assert sequence/stage context plus immutable ledger state; Vitest 24/24 passed.]
- [x] CHK-017 [P0] Phase 008 shadow-parity and phase 016 whole-system fixtures call the same verifier and cannot compute an alternate expected digest. [evidence: Both consumer modes call the sole exported `verifyReplayFingerprint()` API in one parameterized fixture.]
- [x] CHK-018 [P0] A mismatch never promotes the actual digest, rewrites the attestation, or accepts a regenerated baseline in the verification path. [evidence: Repeated projection mismatches leave attestation bytes and ledger head unchanged; Vitest 24/24 passed.]
- [x] CHK-019 [P1] Fingerprint generation and verification failures leave legacy output, state, schema, error semantics, and authority unchanged. [evidence: Delivery is new additive modules/tests only; no existing runtime path imports or invokes the new boundary; dependency matrix 100/100 passed.]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-020 [P1] Every spec requirement maps to an implementation path and at least one positive or negative fixture. [evidence: The descriptor inventory, component matrix, and attestation proof in `implementation-summary.md` map REQ-001 through REQ-011.]
- [x] CHK-021 [P1] The implementation covers stored bytes, effective events, replay dependencies, projection bytes, attestation storage, mismatch detection, and both downstream consumers. [evidence: All seven ownership areas have executable coverage; Vitest 24/24 passed.]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-022 [P0] Untrusted or corrupted ledger bytes cannot reach reducers, projections, certificates, effects, or authoritative decisions after a verification failure. [evidence: The verifier derives only after the ledger's verified reader succeeds, and its failure variant contains no trusted result; Vitest 24/24 passed.]
- [x] CHK-023 [P1] Mismatch diagnostics expose bounded digests and identifiers only; sensitive event payloads are not copied into error or audit output. [evidence: Typed failure details contain bounded identifiers/digests and deterministic divergence coordinates, never event payloads; Vitest 24/24 passed.]
- [x] CHK-024 [P1] Hash and canonicalization algorithm selection is registry-controlled; caller input cannot downgrade or substitute the verification primitive. [evidence: Version definitions own fixed SHA-256 and canonicalization identities; descriptor parsing verifies both; Vitest 24/24 passed.]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-025 [P1] The fingerprint descriptor, version evolution, covered-range rule, storage authority, mismatch contract, and rebaseline prohibition are documented with executable examples. [evidence: `implementation-summary.md` records the full descriptor, determinism proof, attestation proof, and fail-closed matrix.]
- [x] CHK-026 [P1] Phase 008 and phase 016 integration docs identify this verifier as the sole replay-fingerprint authority. [evidence: The implementation summary and public consumer union name one `verifyReplayFingerprint()` seam for both modes.]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-027 [P1] Registry, canonical serializer, derivation, attestation, verification, fixtures, and consumer adapters have explicit ownership without a duplicate digest implementation. [evidence: The eight-module table in `implementation-summary.md` maps one owner to each responsibility; alignment drift reports zero findings.]
- [x] CHK-028 [P2] Generated fixture artifacts and diagnostic output remain outside committed runtime authority surfaces. [evidence: Tests use temporary directories, and scoped git status contains only new source/test files plus this leaf's documents.]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

All P0 and P1 items have machine-detectable evidence in `implementation-summary.md` and `runtime/tests/unit/replay-fingerprint.vitest.ts`. Deterministic byte parity holds on the supported OpenCode/Node runtime, every stored/replay/output drift class fails closed, attestations remain immutable and self-excluding, both downstream consumers use the same verifier, and dark-path failures leave legacy authority unchanged.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off against worktree base `e2776ed165df938892840edefaab9ed301aa1392`, ledger fixture `ledger-main` range `1..3`, fingerprint version `1`, the replay identities captured in the descriptor, and the exact commands and exits in `implementation-summary.md`. The final tracked-mutation and strict-validation receipts are recorded there.
<!-- /ANCHOR:sign-off -->
