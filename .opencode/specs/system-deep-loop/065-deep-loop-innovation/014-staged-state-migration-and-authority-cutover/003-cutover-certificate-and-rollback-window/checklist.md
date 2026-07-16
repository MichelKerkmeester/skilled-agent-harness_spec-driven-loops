---
title: "Checklist: Cutover Certificate & Rollback Window"
description: "Blocking verifier contract for the cutover evidence bundle, monitored rollback window, fail-safe revert path, and phase-015 closure handoff."
trigger_phrases:
  - "cutover certificate rollback checklist"
  - "rollback window verification"
  - "authority cutover evidence checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/014-staged-state-migration-and-authority-cutover/003-cutover-certificate-and-rollback-window"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/014-staged-state-migration-and-authority-cutover/003-cutover-certificate-and-rollback-window"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the blocking certificate and rollback-window checks"
    next_safe_action: "Collect ratification evidence for every cutover and window gate"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Cutover Certificate & Rollback Window

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the planned certificate and rollback-window phase. Items remain unchecked while status is Planned. Completion evidence must bind the reviewed candidate SHA or document hash, the exact certificate/window clause or requirement ID, the reviewer or tool result, and the mode/epoch under test. Evidence fails on incomplete proof, mutable references, permissive fallback, split-brain authority, early closure, unbounded monitoring, or ownership drift into sibling 002 or phase 015.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Parent phase-014 handoff, manifest outcome, and staged additive-to-cutover model are cited
- [ ] CHK-002 [P0] Phase-004 policy is cited for certificate preconditions, authority states, and the 14-day/five-run later-of window rule
- [ ] CHK-003 [P0] Phase-007 receipts and certification semantics are cited as required evidence inputs
- [ ] CHK-004 [P0] Sibling `002-per-mode-authority-flip` is named as the CAS flip owner and this child is limited to certificate/window enforcement
- [ ] CHK-005 [P1] `depends_on: []`, Planned status, Level 2 structure, and last-sibling adjacency are explicit
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-006 [P0] The certificate names one mode, one candidate SHA, one policy digest, one source/target epoch pair, and one transition digest
- [ ] CHK-007 [P0] Certificate evidence includes shadow parity, rollback drill, migration receipts, state classification, mixed replay, and mode gate references
- [ ] CHK-008 [P0] Verification rejects missing, stale, tampered, contradictory, cross-mode, wrong-policy, wrong-SHA, and wrong-epoch evidence
- [ ] CHK-009 [P0] Certificate issuance uses the canonical envelope and transition-authorization gateway and appends a durable ledger event
- [ ] CHK-010 [P1] Registered certification scheme, signer/provider identity, verifier version, canonical digest, and certificate bytes are explicit
- [ ] CHK-011 [P1] Duplicate certificate facts are idempotent while same-key/different-facts requests fail closed
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-012 [P0] A complete certificate verifies only for the exact candidate SHA, current authority epoch, and approved mode
- [ ] CHK-013 [P0] Certificate verification blocks sibling 002 when any required evidence digest or approval is absent or mismatched
- [ ] CHK-014 [P0] Window opening records start time, rollback anchor, retained legacy assets, monitor cursor, and authoritative-run count
- [ ] CHK-015 [P0] Window closure remains blocked until both 14 calendar days and five successful authoritative executions are complete
- [ ] CHK-016 [P0] Low traffic prevents the successful-run condition from being inferred from elapsed time
- [ ] CHK-017 [P0] Health regressions and parity drift have separate monitored signals with ratified thresholds and deterministic severity
- [ ] CHK-018 [P0] Replay mismatch, authorization failure, receipt gap, budget breach, and state-reconciliation failure extend or trigger rollback
- [ ] CHK-019 [P0] Mid-window rollback freezes admissions, fences the spine, reconciles in-flight work, restores legacy at a new epoch, preserves events, and emits a rollback certificate
- [ ] CHK-020 [P0] Clean closure appends durable evidence for phase 015 without authorizing legacy-writer retirement by itself
- [ ] CHK-021 [P0] Multi-mode flips, stale monitor decisions, conflicting certificates, and stale writers fail closed
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-022 [P0] Every certificate field and window state has one owning requirement and one verification fixture or review record
- [ ] CHK-023 [P0] Every monitored signal has a source, threshold/condition, extension action, revert action, and durable evidence output
- [ ] CHK-024 [P1] Crash cut points cover certificate append, window checkpoint, monitor decision, rollback fence, reconciliation, and closure evidence
- [ ] CHK-025 [P1] The ownership matrix proves phase 008 supplies readiness evidence, sibling 002 flips, this child certifies/monitors, and phase 015 retires
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-026 [P0] Certificate verification defaults to deny on incomplete input, unknown policy, stale epoch, invalid signature, or verifier failure
- [ ] CHK-027 [P0] Certificate and rollback events exclude secrets and unrestricted payloads while retaining bounded digests and safe evidence references
- [ ] CHK-028 [P0] Authority epochs, candidate SHA, policy digest, request digest, and mode identity prevent stale decision reuse
- [ ] CHK-029 [P1] Spine fencing and legacy restoration cannot produce simultaneous authoritative writers during rollback
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-030 [P1] spec.md, plan.md, tasks.md, and checklist.md agree on certificate contents, signal families, ownership, and the 14-day/five-run window
- [ ] CHK-031 [P1] Cross-references resolve to the parent phase, manifest, phase-004 policy, phase-007 receipts, and sibling 002 contract
- [ ] CHK-032 [P2] Deterministic metadata generation is deferred exactly as instructed and no metadata file is hand-authored
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-033 [P0] Only the four approved Level 2 Markdown files exist as authored files in this target folder
- [ ] CHK-034 [P1] Strict validation reports no issue other than expected missing `description.json` and `graph-metadata.json`
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase may be ratified only when every P0 check has evidence, every P1 check is complete or explicitly approved for deferral, certificate facts are bound to the exact flip, window closure uses the later-of policy, every revert path preserves events and authority epochs, and phase 015 receives durable closure evidence without inheriting a hidden retirement decision.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the phase-014 parent verifier confirms that each mode's authority flip is certificate-backed, its rollback window is actively monitored, any revert is non-destructive and epoch-safe, and clean closure is recorded before phase 015 evaluates legacy-writer retirement.
<!-- /ANCHOR:sign-off -->
