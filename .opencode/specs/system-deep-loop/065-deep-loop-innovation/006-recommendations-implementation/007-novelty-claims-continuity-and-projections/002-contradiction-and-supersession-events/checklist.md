---
title: "Checklist: Contradiction & Supersession Events"
description: "Verification checklist for typed claim relationship events, append-only correction, deterministic status, and replayable audit."
trigger_phrases:
  - "contradiction supersession checklist"
  - "claim relationship verification checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/007-novelty-claims-continuity-and-projections/002-contradiction-and-supersession-events"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/007-novelty-claims-continuity-and-projections/002-contradiction-and-supersession-events"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined blocking checks for typed relations, status folds, and replay"
    next_safe_action: "Run the event and reducer fixture matrix during implementation"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Contradiction & Supersession Events

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for phase 007 child 002. The implementation report must pin the
candidate SHA, BASE SHA, event-registry digest, semantic-community/evidence fixture digest, reducer version, commands
and exit codes, and replay fingerprint. A zero-test fixture discovery, unchecked event, or unexpected tracked mutation
fails the phase. Planned items remain unchecked until machine-detectable implementation evidence exists.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase-003 envelope, ledger, authorization, reader, and replay-fingerprint interfaces are pinned and available
- [ ] CHK-002 [P0] Semantic-community, claim-ID, evidence-locator, provenance, and snapshot inputs are versioned and resolvable
- [ ] CHK-003 [P1] Event names, schema versions, relation actions, status precedence, typed errors, and serializer rules are frozen before writer work
- [ ] CHK-004 [P2] Candidate SHA, BASE SHA, registry digest, fixture digest, and reducer version are recorded in the verifier report
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P1] Changes remain inside this phase's implementation scope; no adjacent novelty, continuity, convergence, or authority-cutover logic is absorbed
- [ ] CHK-006 [P1] Detector, validator, event constructor, authorization/append adapter, reducer, audit, and downstream projection boundaries remain explicit
- [ ] CHK-007 [P1] Reducers are pure and deterministic; timestamps, source count, map insertion order, locale, and filesystem discovery never determine relationship truth or replay order
- [ ] CHK-008 [P2] Event and error names follow the phase-003 registry conventions without weakening unknown-version refusal
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-009 [P0] `CONTRADICTION` schema/round-trip tests require distinct canonical claim IDs, incompatibility scope, semantic-community context, exact evidence, provenance, versions, snapshot, action, and withdrawal linkage
- [ ] CHK-010 [P0] `SUPERSESSION` schema/round-trip tests require distinct directional claim IDs, replacement scope, strength rationale, exact evidence, provenance, versions, snapshot, action, and withdrawal linkage
- [ ] CHK-011 [P0] Candidate-only fixtures prove semantic similarity or detector confidence cannot mutate status before authorization and durable append
- [ ] CHK-012 [P0] Self-contradiction, self-supersession, missing claim/evidence references, non-canonical pairs, cycles, competing active successors, and ambiguous withdrawals fail before sequence allocation
- [ ] CHK-013 [P0] Exact event retries return the original append receipt; changed canonical bytes under the same event ID reject without a second relation
- [ ] CHK-014 [P0] Withdrawal changes only the active relation fold; original assertions, evidence, receipts, and withdrawal events remain immutable and replay-visible
- [ ] CHK-015 [P0] Supersession chains resolve to one terminal successor, reject cycles, and mark every replaced predecessor `superseded`
- [ ] CHK-016 [P0] Mixed-history fixtures apply `superseded` before `contested` while retaining all contradiction edges and evidence for audit
- [ ] CHK-017 [P0] Repeated and cross-process replay produces byte-identical active/historical relation sets, statuses, terminal successors, canonical pair counts, and audit output
- [ ] CHK-018 [P0] Corruption, gaps, forks, unknown event/reducer versions, unresolved references, and fingerprint mismatch expose no trusted claim-status projection
- [ ] CHK-019 [P0] Audit output traces each effective status to event IDs, ledger sequences, claim IDs, evidence locators, authorization references, relation actions, versions, and fingerprint
- [ ] CHK-020 [P0] Downstream claim-continuity and projection consumers accept typed relation/state output and never reinterpret loose contradiction mentions or raw counts
- [ ] CHK-021 [P0] Dark-path fixtures prove relationship recording changes no legacy output, state schema, error behavior, or authority before phase 011
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-022 [P1] Both event types, both actions, all invalid-relation classes, all three effective statuses, and every downstream field have implementation and verifier coverage
- [ ] CHK-023 [P1] The run-2 additions/corrections/retractions/duplicates/unresolved-contradictions fixture and the phase-007 sibling interface matrix are fully represented
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-024 [P0] Every relationship append carries valid event-matched authorization; missing, malformed, stale, or mismatched proof fails closed
- [ ] CHK-025 [P1] Evidence/audit output uses bounded locators and digests without leaking sealed content or allowing untrusted payloads to control paths
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-026 [P2] Registry docs describe the two event payloads, assertion/withdrawal semantics, status precedence, typed errors, and replay/audit contract
- [ ] CHK-027 [P2] Phase-007 sibling handoffs document the prospective semantic-community input and the claim-continuity/projection output without declaring hard child dependencies
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-028 [P1] Event schemas, reducers, fixtures, and audit adapters land in the reviewed phase-007 write-set with no legacy-ledger rewrite or metadata hand-authoring
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check passes; both event types and correction actions are authorized, immutable,
and replayable; invalid relationships fail before append; claim status and typed projections are deterministic; audit
evidence is complete; and legacy authority remains unchanged. The final report pins the SHA, registry/fixture digests,
reducer version, commands, exit codes, and covering replay fingerprint.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the blocking verifier confirms the P0 contract, strict spec validation is green, replay output matches
the pinned fingerprint, all discovered fixtures ran, and `git diff-index --quiet HEAD --` reports no unexpected tracked
mutation after verification.
<!-- /ANCHOR:sign-off -->
