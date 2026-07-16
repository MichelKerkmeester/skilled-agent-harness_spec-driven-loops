---
title: "Checklist: Per-Mode Authority Flip"
description: "Blocking verifier contract for per-mode authority selection, parity and rollback gates, atomic ledger-recorded cutover, mode isolation, and rollback-window handoff."
trigger_phrases:
  - "per-mode authority flip checklist"
  - "deep-loop cutover verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/014-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/014-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the blocking per-mode authority cutover verifier"
    next_safe_action: "Collect selector and cutover evidence for the first mode"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Per-Mode Authority Flip

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the per-mode authority flip. Every item remains pending while the
phase is Planned. The verifier records the exact candidate and BASE, mode identity, authority record and epoch, selector
digest, parity and rollback-drill certificate identities, state-migration identity, mode-gate result, policy version,
ledger transition event, window-open evidence, affected write set, and all unchanged-mode snapshots. A missing or stale
certificate, unresolved state, multi-mode request, partial atomic commit, stale writer acceptance, unexpected authority
mutation, or evidence drift fails the gate. No parity or rollback proof means no cutover.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Parent sequencing invariants and `manifest/phase-tree.json` establish additive-dark migration, phase-014 ownership, and eight-mode order
- [ ] CHK-002 [P0] Phase-004 policy exposes deny-by-default authorization, per-mode epochs, authority states, transition evidence, and the later-of-14-days-and-five-runs window
- [ ] CHK-003 [P0] Phase-008 parity and rollback-drill contracts expose current mode-scoped freshness verification without changing authority
- [ ] CHK-004 [P0] State-migration evidence identifies every selected mode's eligible, migrated, pinned, forked, blocked, or otherwise governed in-flight state
- [ ] CHK-005 [P1] Authority record, selector, cutover request, ledger event, handoff bundle, and mode-order schemas are versioned
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-006 [P0] One canonical selector serves every mode and validates mode identity, authority epoch, policy, record digest, and writer identity at the persistence boundary
- [ ] CHK-007 [P0] Selector, certificate, state, or policy failures return typed denials and never choose legacy or dark through an implicit fallback
- [ ] CHK-008 [P0] Authorization, epoch CAS, selector publication, and authority-transition ledger append are one atomic per-mode transition
- [ ] CHK-009 [P1] Transition events are idempotent for exact duplicates, reject conflicting duplicates, and retain all certificate and state identities
- [ ] CHK-010 [P1] Shared deep-improvement services are isolated from the three variant authority records and cannot inherit a sibling certificate or epoch
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-011 [P0] Every mode begins in a valid legacy-authoritative state and its selector routes canonical writes to legacy before its own flip
- [ ] CHK-012 [P0] Missing, partial, stale, wrong-mode, drifted, or zero-case parity certificates block the selected mode without authority mutation
- [ ] CHK-013 [P0] Missing, failed, partial, stale, wrong-mode, or drifted rollback-drill certificates block the selected mode without authority mutation
- [ ] CHK-014 [P0] Incomplete, stale, blocked, or candidate-mismatched state classification or migration blocks the selected mode
- [ ] CHK-015 [P0] Candidate, BASE, adapter, reducer, projection, replay, selector, policy, and rollback-asset drift invalidates readiness
- [ ] CHK-016 [P0] Unknown mode, malformed selector, stale cache, stale epoch, stale writer, and invalid authority state fail closed
- [ ] CHK-017 [P0] Missing authorization input, gateway denial, stale request digest, and policy mismatch produce no domain or authority mutation
- [ ] CHK-018 [P0] CAS conflict, ledger append failure, selector publication failure, crash, and retry cannot expose a partial dark-authority flip
- [ ] CHK-019 [P0] A successful flip emits one complete authority-transition ledger event with mode, states, epochs, evidence, policy, candidate, request, and timestamp bindings
- [ ] CHK-020 [P0] One mode flip changes only its authority record, writer route, mode streams, projections, and telemetry; every other mode remains legacy-authoritative
- [ ] CHK-021 [P0] Multi-mode and out-of-order requests fail, and `004-deep-improvement-common` precedes the three benchmark variants
- [ ] CHK-022 [P0] Reversible dark authority routes canonical writes to dark, retains legacy rollback assets, and denies stale legacy writes
- [ ] CHK-023 [P0] The phase-004 rollback window opens with the later-of-14-days-and-five-successful-authoritative-runs rule and remains independently mode-scoped
- [ ] CHK-024 [P0] Rollback-trigger, admission-freeze, writer-fence, new-epoch legacy restoration, event-preservation, and stale-writer cases remain governed by phase-004 and phase-008 evidence
- [ ] CHK-025 [P1] Successor handoff evidence is immutable, complete, and independently verifiable without process-local selector state
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-026 [P0] Every failed mode remains legacy-authoritative or enters the declared rollback path; no operator waiver converts failure into readiness
- [ ] CHK-027 [P1] Any repaired certificate, state classification, selector, writer, policy, or candidate reruns the complete affected mode closure
- [ ] CHK-028 [P1] A changed transition event or authority epoch invalidates prior handoff evidence and requires revalidation rather than evidence mutation
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-029 [P0] Authority records and selector inputs cannot be supplied by untrusted process-local flags, environment values, or cross-mode aliases
- [ ] CHK-030 [P0] Stale epochs, stale writer leases, duplicate conflicting requests, and missing authorization evidence cannot append domain events or effects
- [ ] CHK-031 [P1] Cutover and denial diagnostics are bounded and redact protected payloads while retaining digests and identities needed for verification
- [ ] CHK-032 [P0] The cutover coordinator cannot close a rollback window, remove legacy writers, delete events, or bypass phase-008 evidence
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-033 [P1] spec.md, plan.md, tasks.md, and checklist.md agree on selector states, gate inputs, ledger evidence, mode order, and rollback policy
- [ ] CHK-034 [P1] Verification evidence cites the parent program, `manifest/phase-tree.json`, phase-004 transition policy, phase-008 parity, and phase-008 rollback drills
- [ ] CHK-035 [P2] Operator diagnostics identify the mode, epoch, first failed gate, certificate identity, and rerun command without suggesting a waiver
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-036 [P0] Only the four approved Level 2 Markdown files are authored in this target folder and deterministic metadata is not hand-written
- [ ] CHK-037 [P1] Strict validation reports no issue other than expected missing `description.json` and `graph-metadata.json`
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase may be ratified only when every mode has a verified authority record and selector, every attempted flip proves
current parity, rollback, state, mode-gate, candidate, policy, and rollback-asset evidence, every transition is atomic
and ledger-recorded, non-selected modes remain legacy-authoritative, the manifest order is respected, stale writers are
denied, and the successor receives complete reversible-window evidence. Until then the phase remains Planned and every
checklist item stays unchecked.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the phase-014 verifier confirms the ordered per-mode flips, complete transition events, unchanged
non-selected authority records, current rollback windows, and a handoff bundle that the successor can verify without
mutable selector state.
<!-- /ANCHOR:sign-off -->
