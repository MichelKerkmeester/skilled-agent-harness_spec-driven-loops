---
title: "Checklist: Deep AI Council — Shadow Parity"
description: "Blocking checklist for phase 006 of the Deep AI Council migration: prove event-for-event canonical projection parity between the legacy emitter and the dark typed ledger path before authority cutover."
trigger_phrases:
  - "deep ai council shadow parity checklist"
  - "council projection parity gate"
  - "phase 006 council parity verifier"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/006-shadow-parity"
    last_updated_at: "2026-07-15T20:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the blocking zero-diff contract for council shadow parity"
    next_safe_action: "Run the fixture matrix and retain first-divergence receipts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Deep AI Council — Shadow Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 006. Every item is a check the paired
verify agent runs before a parity candidate can become cutover-eligible; each report pins BASE SHA,
candidate SHA, fixture and input digests, mapping and normalization-profile hashes, raw event digests,
canonical projection fingerprints, commands, exit codes, and legacy-authority status. A missing fixture,
zero executed scenarios, unexpected tracked mutation, unauthorized transition, duplicate effect, or
unexplained projection difference fails the gate.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-006 [P0] The phase-011 shadow framework, phase 012 shared mode contract, and `005-resume-adapter` input are pinned for this candidate
- [ ] CHK-007 [P0] BASE SHA, candidate SHA, council configuration digest, target version, fixture manifest digest, and normalization-profile hash are recorded
- [ ] CHK-008 [P1] Recorded seat outputs, tool receipts, and expected council state boundaries are available for deterministic paired execution
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-009 [P0] The shadow path is additive and non-authoritative; it cannot dispatch seats, mutate canonical state, or commit an external side effect
- [ ] CHK-010 [P1] Canonical event mapping preserves raw legacy and ledger rows and documents every ledger-only control-plane event
- [ ] CHK-011 [P1] The normalization profile is versioned, digest-bound, minimal, and rejects unknown fields rather than silently dropping them
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-001 [P0] Both paths consume one frozen execution envelope; input, config, target, seat-output, tool-receipt, and profile digests match
- [ ] CHK-002 [P0] Canonical behavior events match event-for-event: equal cardinality, ordered kind, round/seat/claim identity, required payload, lifecycle status, and terminal sequence
- [ ] CHK-003 [P0] No unexplained legacy-only or ledger-only behavior event exists; adapter, authorization, receipt, and audit events cannot mask a missing behavior tuple
- [ ] CHK-004 [P0] Projection parity holds for convergence, non-convergence, majority/minority output, hard violations, unresolved values, counterfactual results, artifacts, and fingerprints when exercised
- [ ] CHK-012 [P0] Normal completion and multi-round critique fixtures pass with identical `council_complete` presence, convergence result, artifact references, and projection fingerprint
- [ ] CHK-013 [P0] Timeout, seat error, insufficient quorum, contradictory high-confidence recommendations, and max-round non-convergence fixtures preserve identical failure semantics
- [ ] CHK-014 [P0] Partial persistence, rollback, resume after each persisted boundary, and post-rollback resume fixtures preserve identical forensic history and recovery decisions
- [ ] CHK-015 [P0] CouncilBrief/private-evidence, typed belief/challenge, effective-independence, blinded adjudication, minority-retention, and comparative-control fields match when present in fixtures
- [ ] CHK-016 [P0] Every ledger behavior event has an authorized transition and required receipt references; unauthorized or missing-receipt events fail the run
- [ ] CHK-017 [P0] Effect IDs and side-effect observations prove zero duplicate dispatches, shadow-owned external writes, or receipt-less effects
- [ ] CHK-018 [P0] Replay and supported completion-order permutations produce stable parity fingerprints and stable first-divergence classification
- [ ] CHK-019 [P0] A semantic field outside the normalization profile fails parity while an explicitly allowlisted metadata field is the only tolerated difference
- [ ] CHK-020 [P0] Any unexplained mismatch produces a cutover-blocking receipt and leaves legacy authority enabled
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-005 [P1] The final parity report covers every fixture row, records zero unexplained diffs, and identifies the first divergent event for every failed candidate
- [ ] CHK-021 [P1] Parity evidence is bound to exact SHAs, mapping/profile versions, raw event digests, canonical projection fingerprints, and command exit codes
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-022 [P2] The comparator does not expose mutable secret material, permit a seat to adjudicate its own recovery, or let a ledger-only control event authorize an unreceipted effect
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-023 [P2] The parity mapping, normalization profile, fixture matrix, mismatch taxonomy, and cutover-blocking criteria are reflected in the phase packet docs
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-024 [P1] Shadow evidence and reports remain path-scoped to the intended phase/runtime surfaces; no authority cutover, legacy-writer retirement, or unrelated cleanup lands here
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete only when every P0 verifier check passes, the paired report proves zero unexplained
behavior-event and projection differences, ledger control-plane evidence is authorized and receipted, replay
fingerprints are stable, and legacy remains authoritative pending the later mode gate and staged cutover.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the zero-diff parity contract, the receipt is bound to the exact
candidate and fixture digests, and the cutover decision remains blocked unless all acceptance criteria are green.
<!-- /ANCHOR:sign-off -->
