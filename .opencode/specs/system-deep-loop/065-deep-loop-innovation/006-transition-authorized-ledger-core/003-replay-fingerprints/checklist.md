---
title: "Checklist: Replay Fingerprints (003 phase 003)"
description: "Blocking verification checklist for deterministic replay-fingerprint derivation, immutable attestations, fail-closed mismatch handling, and shared downstream consumption."
trigger_phrases:
  - "replay fingerprints checklist"
  - "deep-loop replay digest verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-transition-authorized-ledger-core/003-replay-fingerprints"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-transition-authorized-ledger-core/003-replay-fingerprints"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined the blocking verifier contract for replay fingerprints"
    next_safe_action: "Run deterministic, mutation, version, and mismatch fixture matrices"
    blockers: []
    key_files: []
    completion_pct: 0
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

- [ ] CHK-001 [P0] The envelope, ledger, upstream transition/versioning, and phase-tree consumer contracts are pinned and mutually consistent
- [ ] CHK-002 [P0] Every replay-affecting input is classified as stored bytes, a registered identity/version, or an immutable referenced digest
- [ ] CHK-003 [P1] The descriptor schema, serializer, fingerprint registry, error vocabulary, and after-range attestation event are frozen before implementation
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] The derivation path consumes only integrity-checked ascending ledger events and cannot hash unchecked or partially decoded data
- [ ] CHK-005 [P0] `fingerprint_version` is independent of envelope/event versions and resolves one exact historical implementation
- [ ] CHK-006 [P1] Canonical serialization has explicit field order, length delimiting, normalized maps, preserved ordered arrays, and no platform-dependent inputs
- [ ] CHK-007 [P1] Lookup indexes, prefix caches, and diagnostics are rebuildable and never become fingerprint or ledger authority
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-008 [P0] Repeated processes and every supported platform produce byte-identical stored, effective, projection, descriptor, and final digest bytes
- [ ] CHK-009 [P0] Mutation, deletion, insertion, reordering, sequence gaps, forks, torn tails, and changed range bounds fail before trusted replay output
- [ ] CHK-010 [P0] Envelope-registry, type/version-set, upcaster-registry, upcaster-chain, reducer, projection-schema, and canonicalizer drift each fail in the named component
- [ ] CHK-011 [P0] Replay-affecting configuration, policy, or artifact state not committed by the ledger or an immutable digest blocks fingerprint derivation
- [ ] CHK-012 [P0] Historical and current fingerprint versions recompute under their registered implementations; future, unknown, missing, or ambiguous versions fail closed
- [ ] CHK-013 [P0] The fingerprint attestation is appended after its inclusive range, excludes itself, binds the exact range, and remains immutable
- [ ] CHK-014 [P0] Exact duplicate attestations are idempotent; conflicting attestations for the same run/range/version are rejected without replacement
- [ ] CHK-015 [P0] Stored, effective, and projection component mismatches return typed non-zero failures and no trusted projection, parity certificate, cutover evidence, or gate pass
- [ ] CHK-016 [P0] Diagnostics report bounded expected/actual digests and the earliest determinable sequence or replay stage without mutating protected history
- [ ] CHK-017 [P0] Phase 005 shadow-parity and phase 013 whole-system fixtures call the same verifier and cannot compute an alternate expected digest
- [ ] CHK-018 [P0] A mismatch never promotes the actual digest, rewrites the attestation, or accepts a regenerated baseline in the verification path
- [ ] CHK-019 [P1] Fingerprint generation and verification failures leave legacy output, state, schema, error semantics, and authority unchanged
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-020 [P1] Every spec requirement maps to an implementation path and at least one positive or negative fixture
- [ ] CHK-021 [P1] The implementation covers stored bytes, effective events, replay dependencies, projection bytes, attestation storage, mismatch detection, and both downstream consumers
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-022 [P0] Untrusted or corrupted ledger bytes cannot reach reducers, projections, certificates, effects, or authoritative decisions after a verification failure
- [ ] CHK-023 [P1] Mismatch diagnostics expose bounded digests and identifiers only; sensitive event payloads are not copied into error or audit output
- [ ] CHK-024 [P1] Hash and canonicalization algorithm selection is registry-controlled; caller input cannot downgrade or substitute the verification primitive
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-025 [P1] The fingerprint descriptor, version evolution, covered-range rule, storage authority, mismatch contract, and rebaseline prohibition are documented with executable examples
- [ ] CHK-026 [P1] Phase 005 and phase 013 integration docs identify this verifier as the sole replay-fingerprint authority
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-027 [P1] Registry, canonical serializer, derivation, attestation, verification, fixtures, and consumer adapters have explicit ownership without a duplicate digest implementation
- [ ] CHK-028 [P2] Generated fixture artifacts and diagnostic output remain outside committed runtime authority surfaces
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 and P1 item has machine-detectable evidence, deterministic byte parity holds across supported platforms, every stored/replay/output drift class fails closed, attestations remain immutable and self-excluding, both downstream consumers use the same verifier, and dark-path failures leave legacy authority unchanged. Planned status keeps all checks open until those implementation receipts exist.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Sign off only after the verifier report binds the candidate SHA, exact ledger fixtures and covered ranges, fingerprint/replay-contract versions, commands and exit codes, expected/actual component digests, downstream consumer results, and a clean tracked-mutation check.
<!-- /ANCHOR:sign-off -->
