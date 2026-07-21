---
title: "Checklist: Contradiction & Supersession Events"
description: "Verification checklist for typed claim relationship events, append-only correction, deterministic status, and replayable audit."
trigger_phrases:
  - "contradiction supersession checklist"
  - "claim relationship verification checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/002-contradiction-and-supersession-events"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/002-contradiction-and-supersession-events"
    last_updated_at: "2026-07-21T08:31:20Z"
    last_updated_by: "codex"
    recent_action: "Completed blocking checks for typed relations, status folds, audit, and replay"
    next_safe_action: "Hand the exported typed projection contract to sibling consumers"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Contradiction & Supersession Events

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for phase 010 child 002. The implementation report must pin the
candidate SHA, BASE SHA, event-registry digest, semantic-community/evidence fixture digest, reducer version, commands
and exit codes, and replay fingerprint. A zero-test fixture discovery, unchecked event, or unexpected tracked mutation
fails the phase. Planned items remain unchecked until machine-detectable implementation evidence exists.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phase-006 envelope, ledger, authorization, reader, and replay-fingerprint interfaces are pinned and available. Evidence: public-contract imports compile under the runtime `tsconfig` with exit 0.
- [x] CHK-002 [P0] Semantic-community, claim-ID, evidence-locator, provenance, and snapshot inputs are versioned and resolvable. Evidence: candidate/reference types plus missing-reference tests cover every input class. [EVIDENCE: leaf Vitest 16/16 passed]
- [x] CHK-003 [P1] Event names, schema versions, relation actions, status precedence, typed errors, and serializer rules are frozen before writer work. Evidence: constants and closed unions live in `event-registry.ts`, `types.ts`, and `errors.ts`.
- [x] CHK-004 [P2] Candidate SHA, BASE SHA, registry digest, fixture digest, and reducer version are recorded in the verifier report. Evidence: implementation summary verifier-identities table; candidate is truthfully marked uncommitted because no commit was requested.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P1] Changes remain inside this phase's implementation scope; no adjacent novelty, continuity, convergence, or authority-cutover logic is absorbed. Evidence: path-scoped git status contains only this leaf's module, test, and docs. [EVIDENCE: git path-scoped diff review passed]
- [x] CHK-006 [P1] Detector, validator, event constructor, authorization/append adapter, reducer, audit, and downstream projection boundaries remain explicit. Evidence: separate `event-registry.ts`, `service.ts`, `projection.ts`, `audit.ts`, and `replay.ts` modules.
- [x] CHK-007 [P1] Reducers are pure and deterministic; timestamps, source count, map insertion order, locale, and filesystem discovery never determine relationship truth or replay order. Evidence: reducer reads verified sequence and canonical payload only; repeated and child-process projection bytes match. [EVIDENCE: leaf Vitest 16/16 passed]
- [x] CHK-008 [P2] Event and error names follow the phase-006 registry conventions without weakening unknown-version refusal. Evidence: both event types use the three-segment namespace and closed version-1 registry definitions.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-009 [P0] `CONTRADICTION` schema/round-trip tests require distinct canonical claim IDs, incompatibility scope, semantic-community context, exact evidence, provenance, versions, snapshot, action, and withdrawal linkage. Evidence: canonical-pair, typed-projection, and contradiction-withdrawal tests pass.
- [x] CHK-010 [P0] `SUPERSESSION` schema/round-trip tests require distinct directional claim IDs, replacement scope, strength rationale, exact evidence, provenance, versions, snapshot, action, and withdrawal linkage. Evidence: directional-chain and supersession-withdrawal tests pass.
- [x] CHK-011 [P0] Candidate-only fixtures prove semantic similarity or detector confidence cannot mutate status before authorization and durable append. Evidence: inert-candidate and changed-authority tests retain sequence 0 and `active` status.
- [x] CHK-012 [P0] Self-contradiction, self-supersession, missing claim/evidence references, non-canonical pairs, cycles, competing active successors, and ambiguous withdrawals fail before sequence allocation. Evidence: the negative matrix covers every named class and asserts unchanged heads. [EVIDENCE: leaf Vitest 16/16 passed]
- [x] CHK-013 [P0] Exact event retries return the original append receipt; changed canonical bytes under the same event ID reject without a second relation. Evidence: exact-retry/conflict test compares receipts and retains head sequence 1. [EVIDENCE: leaf Vitest 16/16 passed]
- [x] CHK-014 [P0] Withdrawal changes only the active relation fold; original assertions, evidence, receipts, and withdrawal events remain immutable and replay-visible. Evidence: both withdrawal fixtures retain assertion identity plus separate assertion/withdrawal evidence in history, with two verified ledger events. [EVIDENCE: leaf Vitest 16/16 passed]
- [x] CHK-015 [P0] Supersession chains resolve to one terminal successor, reject cycles, and mark every replaced predecessor `superseded`. Evidence: A→B→C yields terminal C for A and B; C→A rejects before append.
- [x] CHK-016 [P0] Mixed-history fixtures apply `superseded` before `contested` while retaining all contradiction edges and evidence for audit. Evidence: mixed-history test keeps A `superseded`, its contradiction relation active, and both evidence positions visible.
- [x] CHK-017 [P0] Repeated and cross-process replay produces byte-identical active/historical relation sets, statuses, terminal successors, canonical pair counts, and audit output. Evidence: repeated same-artifact descriptor bytes and separately bundled child-process canonical projection bytes match; audit replay shares the covering fingerprint. [EVIDENCE: leaf Vitest 16/16 passed]
- [x] CHK-018 [P0] Corruption, gaps, forks, unknown event/reducer versions, unresolved references, and fingerprint mismatch expose no trusted claim-status projection. Evidence: closed substrate readers/registries refuse unknown or broken history; leaf invalid-cycle, unresolved-reference, physical frame-corruption, and mismatch fixtures return no projection. [EVIDENCE: leaf Vitest 16/16 passed]
- [x] CHK-019 [P0] Audit output traces each effective status to event IDs, ledger sequences, claim IDs, evidence locators, authorization references, relation actions, versions, and fingerprint. Evidence: audit fixture asserts each field in `RelationshipAuditRecord` and the report fingerprint.
- [x] CHK-020 [P0] Downstream claim-continuity and projection consumers accept typed relation/state output and never reinterpret loose contradiction mentions or raw counts. Evidence: exported projection carries typed IDs, counterparts, terminal successor, statuses, and evidence; its scalar count is derived inside the canonical fold only. [EVIDENCE: leaf Vitest 16/16 passed]
- [x] CHK-021 [P0] Dark-path fixtures prove relationship recording changes no legacy output, state schema, error behavior, or authority before phase 014. Evidence: service uses its own shadow ledger, projection declares additive-dark authority, and path-scoped status shows no legacy writer or substrate modification. [EVIDENCE: git path-scoped diff review passed]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-022 [P1] Both event types, both actions, all invalid-relation classes, all three effective statuses, and every downstream field have implementation and verifier coverage. Evidence: 16/16 named leaf tests cover the complete matrix.
- [x] CHK-023 [P1] The run-2 additions/corrections/retractions/duplicates/unresolved-contradictions fixture and the phase-010 sibling interface matrix are fully represented. Evidence: assertion, withdrawal, exact retry/conflict, contradictory evidence, semantic community, and reference snapshot fixtures. [EVIDENCE: leaf Vitest 16/16 passed]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-024 [P0] Every relationship append carries valid event-matched authorization; missing, malformed, stale, or mismatched proof fails closed. Evidence: the service exposes no raw append path, stale authority denies with head 0, and exact retry recovers the event-matched durable proof from the verified audit ledger. [EVIDENCE: leaf Vitest 16/16 passed]
- [x] CHK-025 [P1] Evidence/audit output uses bounded locators and digests without leaking sealed content or allowing untrusted payloads to control paths. Evidence: validators require bounded strings and lowercase SHA-256 identities; the audit exposes locators/digests, never content or filesystem operations. [EVIDENCE: leaf Vitest 16/16 passed]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-026 [P2] Registry docs describe the two event payloads, assertion/withdrawal semantics, status precedence, typed errors, and replay/audit contract. Evidence: `spec.md` canonical shapes/fold plus the implementation summary's relationship and replay sections.
- [x] CHK-027 [P2] Phase-010 sibling handoffs document the prospective semantic-community input and the claim-continuity/projection output without declaring hard child dependencies. Evidence: spec scope/dependencies and implementation-summary limitation 2 preserve the sibling boundary.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-028 [P1] Event schemas, reducers, fixtures, and audit adapters land in the reviewed phase-010 write-set with no legacy-ledger rewrite or metadata hand-authoring. Evidence: path-scoped git status is limited to the new module/test and leaf docs; generated JSON was refreshed by canonical generators. [EVIDENCE: git path-scoped diff review passed]
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
