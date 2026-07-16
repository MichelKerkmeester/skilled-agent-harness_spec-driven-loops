---
title: "Checklist: Deep AI Council - Certificates & Receipts"
description: "Blocking verification checklist for Deep AI Council run certificates, transition receipts, replay-fingerprint stability, sealed-reference verification, independence and bias evidence, offline verification, recovery handling, and additive-dark authority preservation."
trigger_phrases:
  - "deep ai council certificates and receipts checklist"
  - "deep-ai-council offline verifier checklist"
  - "deep-ai-council receipt chain gate"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T23:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the blocking council certificate and receipt verifier contract"
    next_safe_action: "Verify every council transition and replay invariant against local fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Deep AI Council - Certificates & Receipts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the Deep AI Council certificate and receipt child. The candidate
report pins the candidate SHA, shared phase-006 contract and certification-policy digests, transition registry, sealed
artifact manifest, receipt-chain digest, replay-fingerprint descriptor, offline-bundle digest, and commands with exit codes
and discovered-case counts. Verification fails on zero transitions, an unverifiable required reference, a receipt before
its result, an incomplete certificate chain, semantic fingerprint drift, automatic replay of `in_doubt`, lost minority or
bias evidence, a false trusted gate result, or any change to legacy authority.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase-006 receipt/certificate, event, ledger, authorization, certification-provider, and replay contracts are frozen for this candidate
- [ ] CHK-002 [P0] The Deep AI Council transition registry covers initialization, seat selection/dispatch/return, critique, blinding, judgment, bias audit, synthesis, convergence, artifact commit, council test gate, recovery, and completion
- [ ] CHK-003 [P0] The mode consumes `003-sealed-artifacts` references and names no alternate digest, certificate, signer, trust root, or verifier
- [ ] CHK-004 [P1] Logical transition IDs, attempt IDs, idempotency keys, receipt-chain ordering, event-head relations, and result dispositions are explicit
- [ ] CHK-005 [P1] The run-certificate body and offline-bundle contract identify required heads, references, replay inputs, projections, artifacts, gate evidence, and unresolved obligations
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-006 [P0] Receipt and certificate emission stays inside the Deep AI Council mode binding with no shared-service cleanup, reducer rewrite, artifact-seal implementation, resume implementation, or authority transfer
- [ ] CHK-007 [P0] Receipt facts, certificate fields, schema versions, canonicalization, certification metadata, and replay inputs are explicit and versioned
- [ ] CHK-008 [P1] Failure paths are typed, append-only, non-destructive, and never return repaired, nearest-match, mutable, or partially verified evidence
- [ ] CHK-009 [P0] Process-local timestamps, PIDs, arrival order, random request IDs, paths, aliases, and attempt-only data cannot perturb fingerprints unless registered as semantic inputs
- [ ] CHK-010 [P1] Raw seat/error vectors, independence groups, stance changes, minority and contradiction lineage, pairwise order results, bias evidence, vetoes, and control-arm deltas remain separate from certificate status
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-011 [P0] Every registered transition emits one complete receipt only after its authorized result and resulting ledger head are durable
- [ ] CHK-012 [P0] The run certificate binds run/lineage/generation, lifecycle status, final heads, ordered sealed references, receipt-chain digest, replay fingerprint, projections, artifacts, gate evidence, obligations, and certification metadata
- [ ] CHK-013 [P0] Identical semantic inputs produce identical receipt and certificate body digests and replay fingerprints across process and completion-order variation
- [ ] CHK-014 [P0] Each registered replay-affecting input changes the fingerprint; unregistered fields and excluded process/timing/path/attempt values do not
- [ ] CHK-015 [P0] Mutation, truncation, omission, substitution, stale head, wrong kind, unsupported version, duplicate identity, mixed reference set, and certification-provider failure fail verification
- [ ] CHK-016 [P0] Exact-repeat receipt retry returns the original receipt; same-key/different-facts reuse records a typed conflict and performs no false transition
- [ ] CHK-017 [P0] Seat and proposal receipts preserve seat identity, reasoning method, provider group, capability, evidence, raw scores, costs, output digests, and unresolved return states
- [ ] CHK-018 [P0] Critique receipts preserve visible-information policy, source claims, challenge disposition, and hidden-identity violations without treating critique as adjudication
- [ ] CHK-019 [P0] Blinding, pairwise, and bias receipts preserve aliases, deterministic order controls, raw/calibrated judgments, abstention, inconsistency, and detector evidence; order disagreement never becomes an extra vote
- [ ] CHK-020 [P0] Convergence receipts preserve effective-seat evidence, calibrated support, minority and contradiction references, vetoes, coverage, protocol route, and `CONTINUE`, `STOP_ELIGIBLE`, `INDETERMINATE`, `BLOCKED`, or non-converged outcomes
- [ ] CHK-021 [P0] Nominal two-of-three agreement, rising agreement, or a weighted scalar cannot rescue hard failures, erase minority evidence, or authorize a terminal outcome without required witnesses
- [ ] CHK-022 [P0] Artifact and council-test-gate receipts preserve sealed references, content digests, required sections, fixture manifests, baseline/candidate fingerprints, control-arm results, bias/metamorphic checks, and critical failures
- [ ] CHK-023 [P0] Failed, skipped, missing, or unverifiable required gate evidence prevents a valid run certificate and remains an explicit incomplete or blocked result
- [ ] CHK-024 [P0] The offline verifier validates certification, chain continuity, authorization, sealed references, disclosure boundaries, replay fingerprint, projections, artifacts, and gate evidence without network or live execution
- [ ] CHK-025 [P0] Offline verification returns `valid`, `invalid`, `incomplete`, `unverifiable`, or `blocked` with evidence location and never repairs history or creates a baseline
- [ ] CHK-026 [P0] Recovery distinguishes `not_applied`, `applied`, `in_doubt`, and `conflict`; only conclusive `not_applied` retries with the original key
- [ ] CHK-027 [P0] Late seat results, artifact supersession, policy drift, and evidence changes preserve historical receipts and append affected revisions without silent rebaselining
- [ ] CHK-028 [P0] Dark receipt/certificate failures block dark promotion only and leave legacy state, artifacts, output, writers, and authority unchanged
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-029 [P1] Every transition-registry row maps to a receipt schema, positive fixture, negative fixture, recovery fixture, and verifier evidence
- [ ] CHK-030 [P1] Every certificate-required reference and receipt-chain link has a named artifact digest, head relation, and failure disposition
- [ ] CHK-031 [P1] The independent verifier output is reproducible from the pinned offline bundle and shared contract digests
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-032 [P0] Receipts, certificates, diagnostics, and offline bundles contain no credentials, signing secrets, raw tokens, unrestricted prompts, private seat transcripts, or sensitive payloads
- [ ] CHK-033 [P0] Certification keys remain provider-owned; mode documents and receipts store only registered scheme/provider identity, verifier version, canonical digest, and allowed certificate bytes
- [ ] CHK-034 [P0] Authorization, run/lineage identity, authority epoch, expected head, artifact kind, disclosure policy, and logical operation checks reject cross-run or stale reuse
- [ ] CHK-035 [P1] Private evidence, candidate aliases, judge inputs, and calibration state cannot be exposed as scorer authority or used to self-confirm an outcome
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-036 [P1] The receipt matrix, run-certificate attestation boundary, fingerprint input/exclusion rules, offline-verifier contract, and recovery dispositions are documented for successor `005-resume-adapter`
- [ ] CHK-037 [P2] The Deep AI Council mode gate and later authority-cutover boundary are documented without claiming this child moves authority
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-038 [P1] Mode-specific receipt/certificate wiring and fixtures remain path-scoped; shared primitives, sealed artifacts, reducers, projections, and sibling resume implementation are not modified
- [ ] CHK-039 [P1] Offline bundles, cassettes, and generated evidence remain fixture-owned and cannot become mutable ledger authority
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check passes, all transition rows have non-zero fixture coverage, the run certificate
replays from the complete receipt chain, the fingerprint is stable and input-complete, offline verification returns no
false valid completion, recovery never auto-replays `in_doubt`, independence and minority evidence remain inspectable,
required bias and test-gate evidence is present, and the dark mode gate leaves legacy authority unchanged.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the mode verifier binds the exact candidate and shared-contract digests, receipt-chain and sealed-reference
digests, replay-fingerprint result, offline verdict, independence and minority evidence, recovery evidence, gate result, and
clean post-gate worktree state into a certificate-ready report for successor `005-resume-adapter`.
<!-- /ANCHOR:sign-off -->
