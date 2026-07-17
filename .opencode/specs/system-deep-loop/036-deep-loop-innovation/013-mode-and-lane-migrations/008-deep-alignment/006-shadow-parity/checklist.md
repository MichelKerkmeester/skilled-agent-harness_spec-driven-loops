---
title: "Checklist: Deep Alignment shadow parity"
description: "Checklist for the Deep Alignment shadow-parity concern: event-for-event and projection parity between the legacy emitter and typed ledger path, with fail-closed acceptance before authority cutover."
trigger_phrases:
  - "Deep Alignment shadow parity checklist"
  - "deep-alignment parity gate"
  - "ledger shadow acceptance criteria"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/006-shadow-parity"
    last_updated_at: "2026-07-15T21:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined event-for-event shadow parity before Deep Alignment authority cutover"
    next_safe_action: "Freeze paired runners and execute the parity fixture matrix"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Deep Alignment Shadow Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the Deep Alignment shadow-parity concern. Every item is a check the paired
verify agent runs before a parity receipt is accepted; each report pins the paired-run manifest, legacy and ledger versions, authority
capsule digest and epoch, verifier digest, comparator version, fixture seed, event/projection fingerprints, commands, exit codes, and
first-divergence evidence. The verifier fails on missing evidence, unknown normalization, zero coverage, silent suppression, or any
unexpected authority side effect.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `005-resume-adapter`, the phase-014 shadow framework, and the phase-012 shared review-loop contract are version-pinned in the paired-run manifest
- [ ] CHK-002 [P0] Legacy and ledger paths receive identical run, target, authority, verifier, lane, capability, budget, and fixture inputs; any mismatch blocks before execution
- [ ] CHK-003 [P1] Deep Alignment event and projection inventories cover every active lane, finding state, applicability outcome, deviation state, authority conflict, terminal state, and public gauge
- [ ] CHK-004 [P1] The comparator's semantic field allowlist, event pairing key, causal-order rule, projection identities, and unknown-field policy are versioned and reviewed
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] The harness remains additive and shadow-only; legacy remains authoritative and no cutover, rollback, or legacy-writer retirement occurs in this concern
- [ ] CHK-006 [P1] Raw findings, observations, deviations, authority conflicts, and receipts remain append-only and visible; no comparator shortcut deletes or rewrites evidence
- [ ] CHK-007 [P2] Comparator reports use stable event/projection identities and do not rely on arrival order, aggregate counts, or a terminal verdict as a substitute for semantic parity
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-008 [P0] Execute legacy and ledger paths from one frozen paired-run manifest and record the exact manifest, authority capsule, verifier, review-loop, and comparator fingerprints
- [ ] CHK-009 [P0] Every legacy event has exactly one ledger counterpart and every ledger event has exactly one legacy counterpart; missing, extra, duplicate, and unpaired events fail the gate
- [ ] CHK-010 [P0] Paired events match on logical identity, type, lane, subject, authority epoch, causal parent, sequence/barrier position, and terminal transition
- [ ] CHK-011 [P0] Canonical event payloads match under the explicit allowlist; unknown fields, dropped fields, changed evidence, changed applicability, and changed verdict semantics fail closed
- [ ] CHK-012 [P0] Finding lifecycle and public projections match by stable identity, including applicability, evidence bindings, known-deviation disposition, authority conflicts, terminal status, and gauges
- [ ] CHK-013 [P0] Both paths use the same valid authority capsule and verifier identity; stale, expired, rolled-back, mixed-version, or unbound authority material returns `PARITY_BLOCKED`
- [ ] CHK-014 [P0] Repeated capture and replay produce identical event fingerprints, projection fingerprints, first-divergence location, mismatch class, and parity disposition
- [ ] CHK-015 [P0] The fixture matrix covers deterministic runs, concurrent lane arrival, retries, late events, resume/replay, authority epoch changes, applicability, known deviations, and authority conflicts
- [ ] CHK-016 [P0] Seeded missing, extra, duplicate, reordered, changed-payload, changed-applicability, and changed-verdict fixtures produce actionable blocking mismatch reports
- [ ] CHK-017 [P1] A green run emits a parity receipt containing exact inputs, comparator version, fixture coverage, event/projection digests, mismatch count, and explicit legacy-authoritative status
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-018 [P1] Every Deep Alignment public projection and event family in the reviewed inventory is either compared or explicitly marked diagnostic-only with a documented reason
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-019 [P0] Authority URI/edition/digest, verifier identity, subject digest, applicability, evidence references, and deviation scope are bound into comparison and receipt inputs
- [ ] CHK-020 [P1] The harness fails closed on missing authority, missing evidence, unknown event fields, comparator ambiguity, and unsupported schema versions; no inferred pass is emitted
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-021 [P1] The parity acceptance matrix and mismatch taxonomy are reflected in the phase docs and are consumable by `007-rollback-and-mode-gate`
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-022 [P1] Shadow captures, mismatch reports, and parity receipts are scoped to the phase run and do not mutate the legacy authoritative state or unrelated mode artifacts
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, event and projection parity are green across the required Deep Alignment
fixture matrix, all invalid or ambiguous inputs fail closed, the parity receipt is bound to its exact inputs, and the legacy path is
still authoritative. This receipt is evidence for the successor mode gate; it does not perform or authorize cutover.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, the paired-run report records zero unexplained parity mismatches, and the
receipt explicitly records legacy authority with no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
