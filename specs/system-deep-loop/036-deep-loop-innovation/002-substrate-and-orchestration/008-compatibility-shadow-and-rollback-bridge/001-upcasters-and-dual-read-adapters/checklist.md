---
title: "Checklist: Upcasters & Dual-Read/Single-Write Adapters"
description: "Blocking verifier contract for deterministic compatibility chains, legacy-authoritative reconciliation, shadow-write isolation, and reversible adapter disablement."
trigger_phrases:
  - "upcaster and dual-read adapter checklist"
  - "deep-loop compatibility shadow verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/001-upcasters-and-dual-read-adapters"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/001-upcasters-and-dual-read-adapters"
    last_updated_at: "2026-07-15T14:17:04Z"
    last_updated_by: "codex"
    recent_action: "Completed the blocking verifier matrix for the compatibility seam"
    next_safe_action: "Preserve these proofs while successor leaves consume the API"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Upcasters & Dual-Read/Single-Write Adapters

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the first phase-008 child. Every item remains unchecked until implementation evidence exists. The verifier pins the candidate SHA, legacy baseline SHA, phase-004 policy revision, phase-006 contract revisions, registry digest, legacy-family manifest digest, and fixture-corpus digest; it records commands, exit codes, discovered family/version counts, reconciliation outcome counts, and storage hashes. Zero discovered families, skipped matrix rows, unclassified observations, or unexpected tracked/storage mutation fail the candidate.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The pinned state census enumerates every in-scope legacy family, reader, writer, version discriminator, storage path, and rollback anchor [evidence: `implementation-summary.md#verification`]
- [x] CHK-002 [P0] Exact phase-004 policy and phase-006 envelope, ledger, replay, and authorization contract revisions are recorded before implementation [evidence: `implementation-summary.md#verification`]
- [x] CHK-003 [P0] The direct-legacy baseline records values, errors, retries, call counts, and storage hashes for every adapter fixture [evidence: `implementation-summary.md#verification`]
- [x] CHK-004 [P1] Every admitted historical version has a canonical fixture, validator, adjacent edge, expected current model, and immutable source hash [evidence: `implementation-summary.md#verification`]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] Registry and upcaster APIs make purity, adjacency, stored/effective versions, immutable evidence, and typed failure explicit [evidence: `implementation-summary.md#verification`]
- [x] CHK-006 [P0] Adapter APIs expose no dark-authority selector, dark fallback, read-repair, reverse projection, or partial effective model [evidence: `implementation-summary.md#verification`]
- [x] CHK-007 [P1] Explicit legacy codec contracts are mapped to inventoried call boundaries without modifying them; generic `atomic-state.ts` serialization is not used as a schema discriminator [evidence: `implementation-summary.md#verification`]
- [x] CHK-008 [P1] Compatibility evidence is bounded, correlation-safe, and excludes sensitive payload copies [evidence: `implementation-summary.md#verification`]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-009 [P0] Registry discovery is deterministic and rejects duplicate types, multiple current versions, gaps, forks, cycles, non-adjacent edges, and non-positive versions [evidence: `implementation-summary.md#verification`]
- [x] CHK-010 [P0] Current, one-hop, and multi-hop fixtures produce byte-stable current models and identical ordered traces across repeated runs [evidence: `implementation-summary.md#verification`]
- [x] CHK-011 [P0] Upcasters perform no I/O, clock reads, randomness, event emission, input mutation, source rewrite, or immutable identity change [evidence: `implementation-summary.md#verification`]
- [x] CHK-012 [P0] Unknown family, future version, ambiguous unversioned shape, missing edge, invalid hop, and lossy transform return typed failures with no partial model [evidence: `implementation-summary.md#verification`]
- [x] CHK-013 [P0] Comparison tokens bind mode/run/stream, authority epoch, legacy position, verified dark head, and correlation identity for every dual read [evidence: `implementation-summary.md#verification`]
- [x] CHK-014 [P0] Same-position equivalent fixtures return the legacy value plus `parity` evidence with both fingerprints [evidence: `implementation-summary.md#verification`]
- [x] CHK-015 [P0] Same-position divergent fixtures return the legacy value, emit `divergence`, and remain ineligible for parity/cutover evidence [evidence: `implementation-summary.md#verification`]
- [x] CHK-016 [P0] Lagging, missing, invalid, or failed dark reads return the legacy value and a typed dark gap/failure without fallback [evidence: `implementation-summary.md#verification`]
- [x] CHK-017 [P0] A valid dark read after legacy failure preserves the legacy error and records diagnostic `legacy_failure_dark_success` only [evidence: `implementation-summary.md#verification`]
- [x] CHK-018 [P0] Different causal positions are `not_comparable` or `dark_lagging` and never count as parity or semantic divergence [evidence: `implementation-summary.md#verification`]
- [x] CHK-019 [P0] Instrumentation proves the adapter has no legacy writer and attempts at most one idempotent dark append after each accepted legacy transition [evidence: `implementation-summary.md#verification`]
- [x] CHK-020 [P0] Dark validation, authorization, append, fsync, and receipt faults do not alter legacy success, failure, retry, or persisted bytes [evidence: `implementation-summary.md#verification`]
- [x] CHK-021 [P0] Adapter retries never repeat an already accepted legacy mutation and dark duplicate delivery returns the original idempotent receipt [evidence: `implementation-summary.md#verification`]
- [x] CHK-022 [P0] Read-only guards prove reconciliation writes nothing to legacy state, historical envelopes, committed ledger records, or derived checkpoints [evidence: `implementation-summary.md#verification`]
- [x] CHK-023 [P0] Gate-off fixtures match direct-legacy values, errors, retries, call graph, and storage hashes and perform no dark read or append [evidence: `implementation-summary.md#verification`]
- [x] CHK-024 [P1] Crash-boundary fixtures leave legacy authority intact and produce enough evidence to distinguish no mirror, committed mirror, and unknown mirror outcome [evidence: `implementation-summary.md#verification`]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-025 [P0] The reviewed family/call-site manifest maps every in-scope reader and writer to a registry, codec, adapter path, and verification fixture [evidence: `implementation-summary.md#verification`]
- [x] CHK-026 [P1] The exported contract is dependency-closed so successor legacy projections and later shadow-parity/rollback children can consume it without redefining authority or upcasting rules [evidence: `implementation-summary.md#verification`]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-027 [P0] Typed failures and evidence records contain bounded identifiers and digests only; sensitive legacy or event payloads are not duplicated into diagnostics [evidence: `implementation-summary.md#verification`]
- [x] CHK-028 [P0] Dark append uses the phase-006 authorization and authority-epoch checks; no adapter bypass can allocate a ledger sequence [evidence: `implementation-summary.md#verification`]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-029 [P1] The registry manifest documents supported ranges, current versions, chain identities, retirement policy, and owners for every family [evidence: `implementation-summary.md#verification`]
- [x] CHK-030 [P1] Operator guidance distinguishes one authoritative legacy write from the parallel non-authoritative dark mirror and names the gate-off rollback order [evidence: `implementation-summary.md#verification`]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-031 [P1] Registry, codecs, reconciliation, adapters, evidence types, fixtures, and tests have dependency-closed ownership with no duplicate compatibility implementation [evidence: `implementation-summary.md#verification`]
- [x] CHK-032 [P2] Generated or runtime evidence stays outside committed source paths and verification leaves no unexpected tracked mutation [evidence: `implementation-summary.md#verification`]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check passes, every admitted legacy family has a complete deterministic chain or an explicit fail-closed classification, every reconciliation row preserves the legacy operational outcome, write instrumentation proves zero legacy-write capability plus zero-or-one non-authoritative mirror, and gate-off rollback reproduces the pinned direct-legacy baseline. Green evidence proves compatibility and reversibility only; it does not authorize phase-014 cutover.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier binds the candidate SHA and all contract/manifest/fixture digests, reports zero unclassified families and zero skipped P0 matrix rows, confirms source/storage hashes outside expected dark evidence are unchanged, and records the phase gate as green without any authority transition.
<!-- /ANCHOR:sign-off -->
