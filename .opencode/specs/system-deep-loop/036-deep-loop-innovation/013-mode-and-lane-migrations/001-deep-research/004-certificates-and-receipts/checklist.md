---
title: "Checklist: Deep Research - Certificates & Receipts"
description: "Blocking verification checklist for Deep Research run certificates, transition receipts, replay-fingerprint stability, offline verification, drift handling, and additive-dark authority preservation."
trigger_phrases:
  - "deep research certificates and receipts checklist"
  - "deep-research offline verifier checklist"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/004-certificates-and-receipts"
    last_updated_at: "2026-07-22T06:18:02Z"
    last_updated_by: "codex"
    recent_action: "Verified exact handoff, initialization, and provenance correspondence"
    next_safe_action: "Successor 005-resume-adapter can consume the signed evidence bundle"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-research-certificates/deep-research-certificates.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-certificates.vitest.ts"
    completion_pct: 100
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

- [x] CHK-001 [P0] Phase-007 receipt/certificate and certification-provider contracts and phase-006 event, ledger, authorization, and replay contracts are frozen for this candidate — Evidence: implementation-summary.md:55 records the shared-substrate contract.
- [x] CHK-002 [P0] The Deep Research transition registry covers `init`, `gather`, `analyze`, convergence, synthesis, memory-save, and resume/recovery
- [x] CHK-003 [P0] The mode consumes `003-sealed-artifacts` references and names no alternate digest, certificate, signer, trust root, or verifier
- [x] CHK-004 [P1] Logical transition IDs, attempt IDs, idempotency keys, receipt-chain ordering, and result dispositions are explicit — Evidence: implementation-summary.md:88 records the stable-identity decision.
- [x] CHK-005 [P1] The run-certificate body and offline-bundle contract identify all required heads, references, fingerprints, outputs, and unresolved obligations — Evidence: implementation-summary.md:118 records the exported run-certificate contract.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-006 [P0] Receipt and certificate emission stays inside the Deep Research mode binding with no shared-service cleanup or authority transfer — Evidence: implementation-summary.md:76 records the additive-dark writer boundary.
- [x] CHK-007 [P0] Receipt facts, certificate fields, schema versions, canonicalization, certification metadata, and replay inputs are explicit and versioned — Evidence: implementation-summary.md:64 records the closed typed surface.
- [x] CHK-008 [P1] Failure paths are typed, append-only, non-destructive, and never return repaired, nearest-match, mutable, or partially verified evidence — Evidence: implementation-summary.md:121 records typed local verification.
- [x] CHK-009 [P1] Process-local timestamps, PIDs, arrival order, random request IDs, paths, aliases, and attempt-only data cannot perturb fingerprints unless registered as semantic inputs — Evidence: implementation-summary.md:143 records use of the real replay implementation.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-010 [P0] Every logical operation emits one complete receipt only after its authorized result and resulting ledger head are durable; complete runs accept multiple distinct `gather` and `analyze` receipts while retaining exactly one `init`, terminal convergence, synthesis, and memory-save receipt — Evidence: targeted Vitest accepts two authorized source captures and rejects a missing synthesis receipt.
- [x] CHK-011 [P0] The run certificate binds run/lineage/generation, lifecycle status, final heads, ordered sealed references, receipt-chain digest, replay fingerprint, outputs, obligations, and certification metadata — Evidence: implementation-summary.md:118 records the certificate body fields.
- [x] CHK-012 [P0] Identical semantic inputs produce identical receipt and certificate body digests and replay fingerprints across process and completion-order variation — Evidence: implementation-summary.md:137 records the passing real-substrate suite.
- [x] CHK-013 [P0] Each registered replay-affecting input changes the fingerprint; unregistered fields and excluded process/timing/attempt values do not — Evidence: implementation-summary.md:143 records real replay derivation.
- [x] CHK-014 [P0] Mutation, truncation, omission, substitution, stale head, wrong kind, unsupported version, duplicate identity, and mixed reference-set fixtures fail verification [evidence: targeted Vitest 31/31 rejects wrong-kind artifacts, persisted-byte tampering, same-kind gather and convergence decoys, an offline forged gather substitution, fabricated handoff digests, init misattribution, and provenance padding]
- [x] CHK-015 [P0] Exact-repeat receipt retry returns the original receipt; same-key/different-facts reuse records a typed conflict and performs no false transition — Evidence: deep-research-certificates.vitest.ts:859 proves idempotent acceptance and typed conflict.
- [x] CHK-016 [P0] Gather and analyze receipts preserve source identity, content digests, evidence spans, claim dependencies, cross-validation, contradictions, abstentions, and unresolved states — Evidence: targeted Vitest proves all instruction-scan values, all admission dispositions, all contamination statuses, and all claim statuses map fail closed across their registered result events.
- [x] CHK-017 [P0] Convergence receipts bind one verified frontier snapshot and preserve `CONTINUE`, `STOP_ELIGIBLE`, `INDETERMINATE`, `BLOCKED`, and incomplete outcomes distinctly
- [x] CHK-018 [P0] Synthesis receipts reproduce report and claim/evidence view digests from identical verified inputs and reducer/projection/synthesis versions — Evidence: implementation-summary.md:143 records real reducer and sealed-artifact verification.
- [x] CHK-019 [P0] Memory-save receipts bind target, continuity, final references, content/output digests, persistence result, and retryability; failed or unknown persistence is not trusted completion [evidence: targeted Vitest 31/31 rejects fabricated handoff digests, accepts the real ordered-reference and synthesis-output values, and preserves retryable and terminal failure dispositions]
- [x] CHK-020 [P0] Resume/recovery receipts distinguish `not_applied`, `applied`, `in_doubt`, and `conflict`; only conclusive `not_applied` retries with the original key
- [x] CHK-021 [P0] The offline verifier validates certification, chain continuity, authorization, sealed references, replay fingerprint, projections, synthesis, and handoff without network or live execution — Evidence: implementation-summary.md:143 records the real offline substrates.
- [x] CHK-022 [P0] Offline verification returns `valid`, `invalid`, `incomplete`, or `unverifiable` with evidence location and never repairs history or creates a baseline
- [x] CHK-023 [P0] Source refresh and claim supersession preserve historical receipts/certificates and append affected revisions without silently rebaselining — Evidence: implementation-summary.md:76 records append-only authorized ledger ownership.
- [x] CHK-024 [P0] Dark receipt/certificate failures block dark promotion only and leave legacy state, output, writers, memory behavior, and authority unchanged — Evidence: implementation-summary.md:154 records the additive-dark limitation.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-025 [P1] Every transition-registry row maps to a receipt schema, positive fixture, negative fixture, recovery fixture, and verifier evidence — Evidence: targeted Vitest reports 31 passed from the round-eight 28-test baseline; all prior disposition, recovery, cardinality, conflict, artifact, and forged-fact cases remain green.
- [x] CHK-035 [P1] The prior receipt digest is verifiable through durable shared-receipt evidence without changing the frozen shared payload — Evidence: the shared `evidence_digest` equals the domain `receiptDigest`, and changing only `priorReceiptDigest` under the same receipt key produces typed `RECEIPT_CONFLICT`.
- [x] CHK-026 [P1] Every certificate-required reference and receipt-chain link has a named artifact digest, head relation, and failure disposition — Evidence: deep-research-certificates.ts:490 resolves each digest to a verified kind and enforces the transition-role lifecycle profile.
- [x] CHK-027 [P1] The independent verifier's output is reproducible from the pinned offline bundle and shared contract digests — Evidence: implementation-summary.md:121 records the offline verification interface.
- [x] CHK-036 [P0] Trusted completion requires zero open obligations — Evidence: an unresolved `coverage` gap produces certificate lifecycle `incomplete` and offline verdict `incomplete`; the empty-obligation case remains trusted and valid.
- [x] CHK-037 [P0] One sealed output artifact cannot be owned by two distinct transition receipts — Evidence: duplicate gather output ownership returns typed `ARTIFACT_INVALID` before receipt issuance and is rechecked offline.
- [x] CHK-038 [P0] Projection evidence is derived from the same verified event set as receipts and replay — Evidence: issuance and offline verification reject an ordered projection/ledger envelope mismatch at `projection:ledger-events`.
- [x] CHK-039 [P0] Every output artifact identity corresponds to its receipt's selected result event across all seven transition kinds, and every input resolves to authorized provenance; issuance and offline verification apply the same gate — Evidence: gather and convergence decoys, an unproven input decoy, and a forged offline gather substitution all fail with `ARTIFACT_INVALID`; the matching gather positive control remains valid, and deleting the gate makes all four negative tests fail.
- [x] CHK-040 [P0] Memory handoff final-reference and offered-view digests are bound to real receipt-attested values — Evidence: the final-reference digest derives from the ordered memory-save inputs, the offered view matches a verified synthesis output digest among those same inputs, fabricated values fail issuance and offline verification is non-valid, and the positive control verifies `valid`.
- [x] CHK-041 [P0] Initialization artifacts cannot borrow another kind's distinct event digest [evidence: targeted Vitest 31/31 rejects objective-to-executor misattribution; decision-record.md documents objective-to-charter, configuration-to-config, capability-to-executor, policy-to-replay, and seal-bound plan/recipe handling]
- [x] CHK-042 [P0] Convergence and synthesis provenance is an exact set of declared input identities — Evidence: unrelated padding fails both transitions with typed `ARTIFACT_INVALID`, exact sets verify `valid`, and weakening equality to the former subset check makes the targeted test fail.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-028 [P0] Receipts, certificates, diagnostics, and offline bundles contain no credentials, signing secrets, raw tokens, unrestricted prompts, or sensitive payloads — Evidence: implementation-summary.md:64 records the closed evidence schemas.
- [x] CHK-029 [P0] Certification keys remain provider-owned; mode documents and receipts store only registered scheme/provider identity, verifier version, canonical digest, and allowed certificate bytes — Evidence: implementation-summary.md:143 records registered real HMAC providers.
- [x] CHK-030 [P1] Authorization, run/lineage identity, authority epoch, expected head, artifact kind, and logical operation checks reject cross-run or stale reuse — Evidence: deep-research-certificates.vitest.ts:938 proves typed wrong-kind rejection while existing run, authorization, head, and logical-operation checks remain green.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-031 [P1] The receipt matrix, run-certificate attestation boundary, fingerprint input/exclusion rules, offline-verifier contract, and recovery dispositions are documented for successor `005-resume-adapter`
- [x] CHK-032 [P2] The Deep Research mode gate and later authority-cutover boundary are documented without claiming this child moves authority
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-033 [P1] Mode-specific receipt/certificate wiring and fixtures remain path-scoped; shared primitives, sealed artifacts, and sibling resume implementation are not modified — Evidence: implementation-summary.md:60 records the scoped file set.
- [x] CHK-034 [P1] Offline bundles, cassettes, and generated evidence remain fixture-owned and cannot become mutable ledger authority — Evidence: implementation-summary.md:154 records that this leaf cannot move authority.
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
