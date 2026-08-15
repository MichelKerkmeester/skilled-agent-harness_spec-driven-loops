---
title: "Checklist: Deep AI Council — Shadow Parity"
description: "Blocking checklist for the `006-shadow-parity` child of the phase-013 Deep AI Council migration: prove event-for-event canonical projection parity between the legacy emitter and the dark typed ledger path before authority cutover."
trigger_phrases:
  - "deep ai council shadow parity checklist"
  - "council projection parity gate"
  - "council shadow parity verifier"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/003-deep-ai-council/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/003-deep-ai-council/006-shadow-parity"
    last_updated_at: "2026-07-15T20:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Verified the blocking council parity contract"
    next_safe_action: "Consume parity evidence in the successor mode gate"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Deep AI Council — Shadow Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the `006-shadow-parity` child of phase 013. Every item is a check the paired
verify agent runs before a parity candidate can become cutover-eligible; each report pins BASE SHA,
candidate SHA, fixture and input digests, mapping and normalization-profile hashes, raw event digests,
canonical projection fingerprints, commands, exit codes, and legacy-authority status. A missing fixture,
zero executed scenarios, unexpected tracked mutation, unauthorized transition, duplicate effect, or
unexplained projection difference fails the gate.

HEAD closeout evidence for every checked item below: [Commit: `5a7ae9a87c04f29db91d5365c6015f2778602080`]; [File: `.opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-shadow-parity/harness-adapter.ts:1817`]; [File: `.opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-shadow-parity/harness-adapter.ts:2847`]; [Test: `npx --no-install vitest run tests/unit/deep-ai-council-shadow-parity.vitest.ts --configLoader runner` — 41/41 passed in 210.20s]; [Test: `npx --no-install tsc --noEmit --ignoreDeprecations 6.0` — exit 0].
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-006 [P0] The phase-014 shadow framework, phase 012 shared mode contract, and `005-resume-adapter` input are pinned for this candidate [evidence: runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts; suite sha256 a88177197553c65ca58f72821014e1bd11cf99ef8598f8fd890a0aca7b54c79b; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 39 tests passed]
- [x] CHK-007 [P0] BASE SHA, candidate SHA, council configuration digest, target version, fixture manifest digest, and normalization-profile hash are recorded [evidence: runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts; suite sha256 a88177197553c65ca58f72821014e1bd11cf99ef8598f8fd890a0aca7b54c79b; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 39 tests passed]
- [x] CHK-008 [P1] Recorded seat outputs, tool receipts, and expected council state boundaries are available for deterministic paired execution [evidence: runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts; suite sha256 a88177197553c65ca58f72821014e1bd11cf99ef8598f8fd890a0aca7b54c79b; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 39 tests passed]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-009 [P0] The shadow path is additive and non-authoritative; it cannot dispatch seats, mutate canonical state, or commit an external side effect [evidence: runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts; suite sha256 a88177197553c65ca58f72821014e1bd11cf99ef8598f8fd890a0aca7b54c79b; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 39 tests passed]
- [x] CHK-010 [P1] Canonical event mapping preserves raw legacy and ledger rows and documents every ledger-only control-plane event [evidence: runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts; suite sha256 a88177197553c65ca58f72821014e1bd11cf99ef8598f8fd890a0aca7b54c79b; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 39 tests passed]
- [x] CHK-011 [P1] The closed volatility allowlist is exactly `occurred_at`, `recorded_at`, and `correlation_id`; each field is checked for presence, type, and non-interference, and unknown fields fail rather than being silently dropped [evidence: runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts; suite sha256 a88177197553c65ca58f72821014e1bd11cf99ef8598f8fd890a0aca7b54c79b; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 39 tests passed]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-001 [P0] Both paths consume one frozen execution envelope; input, config, target, seat-output, tool-receipt, and profile digests match [evidence: runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts; suite sha256 a88177197553c65ca58f72821014e1bd11cf99ef8598f8fd890a0aca7b54c79b; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 39 tests passed]
- [x] CHK-002 [P0] Canonical behavior events pair by logical round/seat/claim identity rather than raw `eventId` and match on cardinality, ordered kind, required payload, lifecycle status, and terminal sequence [evidence: runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts; suite sha256 a88177197553c65ca58f72821014e1bd11cf99ef8598f8fd890a0aca7b54c79b; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 39 tests passed]
- [x] CHK-003 [P0] No unexplained semantic difference exists; the only diff disposition is `unexplained`, every such difference blocks parity, and control-plane events cannot mask a missing behavior tuple [evidence: runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts; suite sha256 a88177197553c65ca58f72821014e1bd11cf99ef8598f8fd890a0aca7b54c79b; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 39 tests passed]
- [x] CHK-004 [P0] Projection parity holds for convergence, non-convergence, majority/minority output, hard violations, unresolved values, counterfactual results, artifacts, and fingerprints when exercised [evidence: runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts; suite sha256 a88177197553c65ca58f72821014e1bd11cf99ef8598f8fd890a0aca7b54c79b; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 39 tests passed]
- [x] CHK-012 [P0] Normal completion and multi-round critique fixtures pass with identical `council_complete` presence, convergence result, artifact references, and projection fingerprint [evidence: runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts; suite sha256 a88177197553c65ca58f72821014e1bd11cf99ef8598f8fd890a0aca7b54c79b; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 39 tests passed]
- [x] CHK-013 [P0] Timeout, seat error, insufficient quorum, contradictory high-confidence recommendations, and max-round non-convergence fixtures preserve identical failure semantics [evidence: runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts; suite sha256 a88177197553c65ca58f72821014e1bd11cf99ef8598f8fd890a0aca7b54c79b; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 39 tests passed]
- [x] CHK-014 [P0] Partial persistence, rollback, resume after each persisted boundary, and post-rollback resume fixtures preserve identical forensic history and recovery decisions [evidence: runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts; suite sha256 a88177197553c65ca58f72821014e1bd11cf99ef8598f8fd890a0aca7b54c79b; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 39 tests passed]
- [x] CHK-015 [P0] CouncilBrief/private-evidence, typed belief/challenge, effective-independence, blinded adjudication, minority-retention, and comparative-control fields match when present in fixtures [evidence: runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts; suite sha256 a88177197553c65ca58f72821014e1bd11cf99ef8598f8fd890a0aca7b54c79b; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 39 tests passed]
- [x] CHK-016 [P0] Every ledger behavior event has an authorized transition and required receipt references; every named cross-artifact reference resolves to the declared kind with applicable epoch, lifecycle, freshness, real-state, visibility, role-redaction, and authority-liveness checks [evidence: runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts; suite sha256 a88177197553c65ca58f72821014e1bd11cf99ef8598f8fd890a0aca7b54c79b; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 39 tests passed]
- [x] CHK-017 [P0] Effect IDs and side-effect observations prove zero duplicate dispatches, shadow-owned external writes, or receipt-less effects [evidence: runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts; suite sha256 a88177197553c65ca58f72821014e1bd11cf99ef8598f8fd890a0aca7b54c79b; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 39 tests passed]
- [x] CHK-018 [P0] Fault injections traverse the real council execution, authorization, ledger, reducer, projection, receipt, and mode-gate evidence pipeline with exact typed-class assertions; replay and supported completion-order permutations produce stable fingerprints and first-divergence classifications [evidence: runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts; suite sha256 a88177197553c65ca58f72821014e1bd11cf99ef8598f8fd890a0aca7b54c79b; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 39 tests passed]
- [x] CHK-019 [P0] A semantic field outside the normalization profile fails parity while an explicitly allowlisted metadata field is the only tolerated difference [evidence: runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts; suite sha256 a88177197553c65ca58f72821014e1bd11cf99ef8598f8fd890a0aca7b54c79b; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 39 tests passed]
- [x] CHK-020 [P0] Any unexplained mismatch produces a cutover-blocking receipt and leaves legacy authority enabled [evidence: runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts; suite sha256 a88177197553c65ca58f72821014e1bd11cf99ef8598f8fd890a0aca7b54c79b; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 39 tests passed]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-005 [P1] The final parity report covers every fixture row, records zero unexplained diffs, and identifies the first divergent event for every failed candidate [evidence: runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts; suite sha256 a88177197553c65ca58f72821014e1bd11cf99ef8598f8fd890a0aca7b54c79b; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 39 tests passed]
- [x] CHK-021 [P1] The manifest-bound parity receipt is evidence bound to exact SHAs, mapping/profile versions, raw event digests, projection fingerprints, and exit codes; the authenticated mode gate re-verifies the binding and does not self-trust computed parity status [evidence: runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts; suite sha256 a88177197553c65ca58f72821014e1bd11cf99ef8598f8fd890a0aca7b54c79b; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 39 tests passed]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-022 [P2] The comparator does not expose mutable secret material, permit a seat to adjudicate its own recovery, or let a ledger-only control event authorize an unreceipted effect [evidence: runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts; suite sha256 a88177197553c65ca58f72821014e1bd11cf99ef8598f8fd890a0aca7b54c79b; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 39 tests passed]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-023 [P2] The parity mapping, normalization profile, fixture matrix, mismatch taxonomy, and cutover-blocking criteria are reflected in the phase packet docs [evidence: runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts; suite sha256 a88177197553c65ca58f72821014e1bd11cf99ef8598f8fd890a0aca7b54c79b; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 39 tests passed]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-024 [P1] Shadow evidence and reports remain path-scoped to the intended phase/runtime surfaces; no authority cutover, legacy-writer retirement, or unrelated cleanup lands here [evidence: runtime/tests/unit/deep-ai-council-shadow-parity.vitest.ts; suite sha256 a88177197553c65ca58f72821014e1bd11cf99ef8598f8fd890a0aca7b54c79b; candidate SHA dd07cb1f52ed2ebaca7d152d0a088366b2958b32; result: 39 tests passed]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete only when every P0 verifier check passes, the paired report proves zero unexplained
behavior-event and projection differences, ledger control-plane evidence is authorized and receipted, replay
fingerprints are stable, and legacy remains authoritative pending the later mode gate and staged cutover.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the zero-unexplained-difference parity contract, the receipt is bound to the exact
candidate and fixture digests, and the cutover decision remains blocked unless all acceptance criteria are green.
<!-- /ANCHOR:sign-off -->
