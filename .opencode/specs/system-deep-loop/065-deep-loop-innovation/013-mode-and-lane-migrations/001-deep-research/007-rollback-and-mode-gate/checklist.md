---
title: "Checklist: Deep Research - Rollback and Mode Gate"
description: "Blocking verifier contract for the Deep Research fail-closed rollback switch, bounded rollback window, independent mode gate, and phase-014 migration-certificate handoff."
trigger_phrases:
  - "Deep Research rollback and mode gate checklist"
  - "deep-research rollback window verification"
  - "deep-research migration certificate checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/007-rollback-and-mode-gate"
    last_updated_at: "2026-07-15T20:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped the Deep Research rollback switch and independent mode-gate contract"
    next_safe_action: "Freeze rollback triggers and gate evidence against phase-012 contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Deep Research - Rollback and Mode Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the Deep Research mode gate. Items remain unchecked while the phase is Planned. Each verification report must pin BASE, candidate SHA, phase-012 and phase-014 contract digests, mode schema and reducer versions, fixture IDs, stream and artifact digests, verifier identity, commands, exit codes, and every disposition. The verifier fails on permissive fallback, self-authorized recovery, incomplete evidence, stale certificates, shortened rollback coverage, or any authority-cutover claim made before phase 014.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] BASE, candidate scope, phase-012 contract digest, write-set conflict graph digest, and phase-014 handoff version are recorded
- [ ] CHK-002 [P1] Deep Research sibling outputs `001` through `006` are inventory-bound with event, reducer, seal, certificate, receipt, resume, and parity references
- [ ] CHK-003 [P0] The authority boundary records phase-009 as non-authoritative, phase-010 as readiness-only, and phase-014 as the sole cutover owner
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P1] The switch, gate, rollback, certificate, epoch, and window vocabulary is unambiguous and consistent with the shared policy
- [ ] CHK-005 [P1] The phase scope contains no second ledger, reducer, seal, receipt, shadow harness, legacy-writer deletion, or authority-flip design
- [ ] CHK-006 [P2] No mutable report, iteration file, URL, cache, or terminal score is treated as migration authority
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] Switch fixtures deny unknown, missing, stale, mismatched, or gateway-failed requests before semantic append, projection change, effect, or authority change
- [ ] CHK-008 [P0] The Deep Research mode cannot self-authorize rollback, unquarantine, verifier replacement, or legacy restoration
- [ ] CHK-009 [P0] The gate requires phase-009 green shadow parity across init, gather/analyze, convergence, synthesis, memory-save, failure, resume, and source-refresh cases
- [ ] CHK-010 [P0] Every required Deep Research sealed artifact has a valid seal, reference, digest, schema version, and current dependency fingerprint
- [ ] CHK-011 [P0] Every side effect, reducer checkpoint, memory handoff, parity result, and mode decision has a valid receipt or explicit safe failure disposition
- [ ] CHK-012 [P0] Replay, resume, evidence admission, contradiction, source refresh, incomplete-run, and crash-boundary fixtures preserve typed identity and fail closed
- [ ] CHK-013 [P0] Rollback rehearsal freezes admission, fences the ledger writer, classifies in-flight work, preserves events and artifacts, restores legacy at a new epoch, and emits a rollback certificate
- [ ] CHK-014 [P0] The rollback window remains open until both 14 calendar days and five successful authoritative executions complete; low traffic and unresolved obligations extend it
- [ ] CHK-015 [P0] Health alarms, budget exhaustion, state-integrity violations, replay mismatch, receipt gaps, stale epochs, unknown effects, and split-brain attempts reach the declared blocked or rollback disposition
- [ ] CHK-016 [P1] The gate result is independently verified from immutable evidence and has no direct authority mutation capability
- [ ] CHK-017 [P0] The mode-migration certificate binds exact SHA, BASE, shared-contract digests, versions, fixture IDs, stream/artifact digests, verifier identity, window state, and dispositions
- [ ] CHK-018 [P0] Phase 014 accepts the migration certificate as readiness evidence and rejects any certificate claiming authority moved or the rollback window closed
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-019 [P1] The gate matrix covers every Deep Research lifecycle transition and every required sibling output without an unowned evidence row
- [ ] CHK-020 [P1] Every failure or uncertainty case has an explicit blocked, not-ready, rollback-required, or window-extension disposition and an evidence owner
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-021 [P0] Rollback preserves append-only ledger history and sealed artifacts and never truncates evidence to make parity or certificate verification pass
- [ ] CHK-022 [P1] Fencing and monotonic epochs reject stale ledger writers and duplicate authority requests after rollback or restoration
- [ ] CHK-023 [P2] Certificate and receipt verification rejects mixed-version, expired, unsigned, malformed, or digest-mismatched artifacts
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-024 [P1] The phase documents distinguish the independent mode gate, mode-migration certificate, rollback certificate, and phase-014 cutover certificate
- [ ] CHK-025 [P2] The phase handoff records unresolved questions, retained rollback assets, closure evidence, and the exact next consumer
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-026 [P1] Authored changes remain limited to this phase folder and use the prescribed four-document Level 2 structure
- [ ] CHK-027 [P1] The phase is strict-validated before handoff and generated metadata is left to deterministic tooling
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the independent gate has no unexplained evidence gap, the rollback window contract is intact, the migration certificate is exact-SHA bound, and phase 014 receives readiness without a premature authority claim. A green result proves mode migration readiness and rollback availability; it does not authorize cutover or legacy-writer retirement.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the fail-closed switch, independent gate, non-destructive rollback rehearsal, minimum window, certificate bindings, and phase-014 handoff, with no evidence that Deep Research changed authority during this phase.
<!-- /ANCHOR:sign-off -->
