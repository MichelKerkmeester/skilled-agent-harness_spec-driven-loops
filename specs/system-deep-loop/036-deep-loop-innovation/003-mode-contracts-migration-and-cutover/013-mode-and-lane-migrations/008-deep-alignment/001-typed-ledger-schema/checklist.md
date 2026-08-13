---
title: "Checklist: Deep Alignment - Typed Ledger Schema"
description: "Checklist for the Deep Alignment typed event-schema child: verify the shared review-loop envelope specialization, authority and epoch contract, lane and applicability events, verify-first findings, proof and deviation fields, and versioned upcaster boundary."
trigger_phrases:
  - "deep alignment typed ledger schema checklist"
  - "typed authority conformance event checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T21:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Implemented and verified the additive-dark Deep Alignment typed ledger schema"
    next_safe_action: "Fold DeepAlignmentLedgerEvent in 002-reducers-and-projections"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Deep Alignment - Typed Ledger Schema

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the Deep Alignment typed-schema child. Every item is a check the
paired verifier runs before the schema is accepted; each report pins the candidate SHA, phase-006 and phase-012 contract
digests, event-catalog digest, compatibility-matrix digest, commands, exit codes, and unexpected tracked mutation status.
The verifier must fail on an untyped event, missing authority or subject binding, implicit PASS from unknown coverage, or
reducer-owned state hidden in an event payload.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phase-006 transition authorization, phase-012 shared event contracts, and the Deep Review shared review-loop boundary are pinned in the candidate report [Evidence: five SHA-256 contract pins in `implementation-summary.md`]
- [x] CHK-002 [P2] The candidate report records the event-catalog digest, compatibility-matrix digest, and shared-contract comparison digest [Evidence: contract pins and 41/21 stem counts in `implementation-summary.md`]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P1] Changes are scoped to the additive Deep Alignment schema module, its unit suite, and this leaf's documents; no adjacent mode child or frozen shared contract is changed [Evidence: scoped git-status audit; `implementation-summary.md`]
- [x] CHK-004 [P1] The event vocabulary keeps shared review-loop ownership in phase-012 and does not duplicate Deep Review lifecycle definitions [Evidence: `DEEP_ALIGNMENT_SHARED_REVIEW_BACKBONE` maps 21 stems to the Deep Review factory]
- [x] CHK-005 [P2] No event payload embeds mutable authority prose, subject bodies, source trees, transcripts, reports, or reducer-owned materialized state [Evidence: mutable-body and prose-selector rejection test]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-006 [P0] Contract fixtures prove every Deep Alignment event uses the shared envelope specialization with inherited identity, authorization, receipt, sequence, integrity, and replay fields [Evidence: 41/41 real gateway/ledger round-trip test]
- [x] CHK-007 [P0] The event catalog covers authority binding/validation, epoch compatibility, lane planning, subject snapshots, applicability, observations, candidates, verification, proof, adjudication, deviations, replay, and terminal handoff [Evidence: 41/41 stems in `deep-alignment-ledger-schema.vitest.ts`]
- [x] CHK-008 [P0] Authority parse, type, capability, rule-test, coverage, signature, expiry, rollback, and mix-and-match failures produce `authority_invalid` or blocked outcomes before conformance PASS [Evidence: closed authority-check object and invalid-authority conformance rejection test]
- [x] CHK-009 [P0] Applicability fixtures preserve `applicable`, `not_applicable`, `unresolved`, and `blocked`; conformance fixtures preserve `conformant`, `non_conformant`, `inconclusive`, `not_applicable`, `untested`, and `blocked` [Evidence: explicit outcome rules and coercion rejection test]
- [x] CHK-010 [P0] Raw observations, evidence receipts, detector candidates, verifier results, proof witnesses, deviations, and conformance assessments remain separate immutable events [Evidence: Vitest verdict-smuggling and in-place update rejection tests]
- [x] CHK-011 [P0] Proof-carrying finding fixtures bind authority epoch, subject digest, applicability decision, evidence receipts, verifier digest, witness references, and verification mode [Evidence: Vitest required-binding deletion matrix]
- [x] CHK-012 [P0] Deviation fixtures retain the original finding and invalidate or reactivate the overlay when authority, verifier, subject, scope, or expiry changes [Evidence: Vitest deviation invalidation and reactivation test]
- [x] CHK-013 [P0] Cross-epoch fixtures replay old-authority witnesses against the new epoch and record affected rules plus an explicit compatibility class [Evidence: `authority_witness_replayed` fixture in the 41/41 matrix]
- [x] CHK-014 [P0] The compatibility matrix covers exact, compatible, migrate, pin-old-runtime, degraded, blocked, unknown, missing-field, expired, mixed, ambiguous, and lossy inputs [Evidence: Vitest compatibility matrix and stable-identity pin rule]
- [x] CHK-015 [P1] Ordered upcast paths and authority/subject/verifier digests contribute deterministically to replay fingerprints [Evidence: Vitest replay keys and stable payload-digest test]
- [x] CHK-016 [P1] A scope audit finds no reducer, projection, sealed artifact, certificate, resume, shadow-parity, rollback, authority-cutover, or mode-gate behavior [Evidence: `deep-alignment-ledger-schema/index.ts` exports schema-only surfaces]
- [x] CHK-017 [P1] `validate.sh --strict` passes for the target folder after authored documents are reviewed [Evidence: strict validation exit 0 with Errors 0 and Warnings 0]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-018 [P1] The reviewed event catalog maps every Deep Alignment run boundary to one event family and records the downstream sibling owner for every derived concern [Evidence: `implementation-summary.md` event inventory and limitations]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-019 [P2] Authority, verifier, evidence, deviation, and transition references are digest-bound and no mutable path or untrusted prose is treated as an authorization or conformance proof [Evidence: semantic-kind validators and real authorization denial test]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-020 [P2] The phase outcome, shared Deep Review adjacency, and handoff to `002-reducers-and-projections` are reflected consistently across spec.md, plan.md, tasks.md, and checklist.md [Evidence: 100% continuity metadata and implementation summary handoff]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-021 [P1] Only authored leaf documents exist or change in the target folder; `description.json` and `graph-metadata.json` remain owned by deterministic tooling [Evidence: metadata is refreshed only by the prescribed generators]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the candidate report pins the shared-contract and schema
digests, every authority/applicability/proof/compatibility boundary has explicit evidence, and the strict spec gate is green
without reducer or projection scope leakage.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract and the scoped diff contains only the additive schema module,
its unit suite, and this leaf's authored or deterministically generated documents.
<!-- /ANCHOR:sign-off -->
