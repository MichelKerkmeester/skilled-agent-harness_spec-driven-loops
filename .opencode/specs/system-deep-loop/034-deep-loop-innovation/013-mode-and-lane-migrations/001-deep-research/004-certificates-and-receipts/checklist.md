---
title: "Checklist: Deep Research - Certificates & Receipts"
description: "Blocking verification checklist for Deep Research run certificates, transition receipts, replay-fingerprint stability, offline verification, drift handling, and additive-dark authority preservation."
trigger_phrases:
  - "deep research certificates and receipts checklist"
  - "deep-research offline verifier checklist"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T20:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the Deep Research certificate and transition-receipt mode gate"
    next_safe_action: "Run the transition, fingerprint, offline-verifier, and dark-parity matrices"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Deep Research - Certificates & Receipts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the Deep Research certificate and receipt child. The candidate
report pins the candidate SHA, shared phase-006 contract and certification-policy digests, transition registry, sealed
artifact/reference-set manifest, receipt-chain digest, replay-fingerprint inputs, offline-bundle digest, and commands
with exit codes and discovered-case counts. Verification fails on zero transitions, an unverifiable required reference,
a receipt before its result, a certificate without complete chain coverage, semantic fingerprint drift, automatic replay of
`in_doubt`, a false trusted handoff, or any change to legacy authority.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase-006 receipt/certificate, event, ledger, authorization, certification-provider, and replay contracts are frozen for this candidate
- [ ] CHK-002 [P0] The Deep Research transition registry covers `init`, `gather`, `analyze`, convergence, synthesis, memory-save, and resume/recovery
- [ ] CHK-003 [P0] The mode consumes `003-sealed-artifacts` references and names no alternate digest, certificate, signer, trust root, or verifier
- [ ] CHK-004 [P1] Logical transition IDs, attempt IDs, idempotency keys, receipt-chain ordering, and result dispositions are explicit
- [ ] CHK-005 [P1] The run-certificate body and offline-bundle contract identify all required heads, references, fingerprints, outputs, and unresolved obligations
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-006 [P0] Receipt and certificate emission stays inside the Deep Research mode binding with no shared-service cleanup or authority transfer
- [ ] CHK-007 [P0] Receipt facts, certificate fields, schema versions, canonicalization, certification metadata, and replay inputs are explicit and versioned
- [ ] CHK-008 [P1] Failure paths are typed, append-only, non-destructive, and never return repaired, nearest-match, mutable, or partially verified evidence
- [ ] CHK-009 [P1] Process-local timestamps, PIDs, arrival order, random request IDs, paths, aliases, and attempt-only data cannot perturb fingerprints unless registered as semantic inputs
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-010 [P0] Every registered transition emits one complete receipt only after its authorized result and resulting ledger head are durable
- [ ] CHK-011 [P0] The run certificate binds run/lineage/generation, lifecycle status, final heads, ordered sealed references, receipt-chain digest, replay fingerprint, outputs, obligations, and certification metadata
- [ ] CHK-012 [P0] Identical semantic inputs produce identical receipt and certificate body digests and replay fingerprints across process and completion-order variation
- [ ] CHK-013 [P0] Each registered replay-affecting input changes the fingerprint; unregistered fields and excluded process/timing/attempt values do not
- [ ] CHK-014 [P0] Mutation, truncation, omission, substitution, stale head, wrong kind, unsupported version, duplicate identity, and mixed reference-set fixtures fail verification
- [ ] CHK-015 [P0] Exact-repeat receipt retry returns the original receipt; same-key/different-facts reuse records a typed conflict and performs no false transition
- [ ] CHK-016 [P0] Gather and analyze receipts preserve source identity, content digests, evidence spans, claim dependencies, cross-validation, contradictions, abstentions, and unresolved states
- [ ] CHK-017 [P0] Convergence receipts bind one verified frontier snapshot and preserve `CONTINUE`, `STOP_ELIGIBLE`, `INDETERMINATE`, `BLOCKED`, and incomplete outcomes distinctly
- [ ] CHK-018 [P0] Synthesis receipts reproduce report and claim/evidence view digests from identical verified inputs and reducer/projection/synthesis versions
- [ ] CHK-019 [P0] Memory-save receipts bind target, continuity, final references, content/output digests, persistence result, and retryability; failed or unknown persistence is not trusted completion
- [ ] CHK-020 [P0] Resume/recovery receipts distinguish `not_applied`, `applied`, `in_doubt`, and `conflict`; only conclusive `not_applied` retries with the original key
- [ ] CHK-021 [P0] The offline verifier validates certification, chain continuity, authorization, sealed references, replay fingerprint, projections, synthesis, and handoff without network or live execution
- [ ] CHK-022 [P0] Offline verification returns `valid`, `invalid`, `incomplete`, or `unverifiable` with evidence location and never repairs history or creates a baseline
- [ ] CHK-023 [P0] Source refresh and claim supersession preserve historical receipts/certificates and append affected revisions without silently rebaselining
- [ ] CHK-024 [P0] Dark receipt/certificate failures block dark promotion only and leave legacy state, output, writers, memory behavior, and authority unchanged
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-025 [P1] Every transition-registry row maps to a receipt schema, positive fixture, negative fixture, recovery fixture, and verifier evidence
- [ ] CHK-026 [P1] Every certificate-required reference and receipt-chain link has a named artifact digest, head relation, and failure disposition
- [ ] CHK-027 [P1] The independent verifier's output is reproducible from the pinned offline bundle and shared contract digests
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-028 [P0] Receipts, certificates, diagnostics, and offline bundles contain no credentials, signing secrets, raw tokens, unrestricted prompts, or sensitive payloads
- [ ] CHK-029 [P0] Certification keys remain provider-owned; mode documents and receipts store only registered scheme/provider identity, verifier version, canonical digest, and allowed certificate bytes
- [ ] CHK-030 [P1] Authorization, run/lineage identity, authority epoch, expected head, artifact kind, and logical operation checks reject cross-run or stale reuse
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-031 [P1] The receipt matrix, run-certificate attestation boundary, fingerprint input/exclusion rules, offline-verifier contract, and recovery dispositions are documented for successor `005-resume-adapter`
- [ ] CHK-032 [P2] The Deep Research mode gate and later authority-cutover boundary are documented without claiming this child moves authority
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-033 [P1] Mode-specific receipt/certificate wiring and fixtures remain path-scoped; shared primitives, sealed artifacts, and sibling resume implementation are not modified
- [ ] CHK-034 [P1] Offline bundles, cassettes, and generated evidence remain fixture-owned and cannot become mutable ledger authority
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check passes, all transition rows have non-zero fixture coverage, the run certificate
replays from the complete receipt chain, the fingerprint is stable and input-complete, offline verification returns no
false valid completion, recovery never auto-replays `in_doubt`, and the dark mode gate leaves legacy authority unchanged.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the mode verifier binds the exact candidate and shared-contract digests, receipt-chain and reference-set
digests, replay-fingerprint result, offline verdict, recovery evidence, handoff result, and clean post-gate worktree
state into a certificate-ready report for successor `005-resume-adapter`.
<!-- /ANCHOR:sign-off -->
