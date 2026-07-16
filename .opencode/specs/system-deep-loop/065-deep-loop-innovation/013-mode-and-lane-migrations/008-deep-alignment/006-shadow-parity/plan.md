---
title: "Implementation Plan: Deep Alignment shadow parity"
description: "Implementation Plan for the Deep Alignment shadow-parity concern: pair the legacy emitter with the typed ledger path, compare canonical events and projections, and produce a fail-closed parity receipt before authority cutover."
trigger_phrases:
  - "Deep Alignment shadow parity implementation plan"
  - "deep-alignment event parity plan"
  - "typed ledger shadow comparator plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/006-shadow-parity"
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
# Implementation Plan: Deep Alignment Shadow Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / Deep Alignment mode 008 / shadow parity concern 006 |
| **Change class** | Planning contract for an additive verification harness |
| **Execution** | Phase-014 shadow framework with legacy authority pinned for the full comparison |

### Overview
Deep Alignment must prove that the typed ledger path preserves its legacy verify-first behavior before the mode gate can consider authority movement. The implementation should invoke both paths from one frozen paired-run manifest, capture the legacy event stream and the ledger event stream, canonicalize only declared transport differences, and compare one event to one event. It should then compare the mode's public projections, including finding lifecycle, applicability, evidence, known-deviation disposition, authority conflict state, terminal status, and gauges. The comparator is a diagnostic boundary: it reports the first divergence and blocks on uncertainty rather than choosing the path that appears more favorable.

The plan consumes the phase-014 shadow framework and pins the shared review-loop contract frozen in phase 012. It does not change that framework, implement the mode's sibling concerns, or authorize a production cutover.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The phase-014 shadow framework exposes paired execution, capture, replay, and mismatch-reporting hooks for a mode adapter
- [ ] The phase-012 shared review-loop contract and version are frozen for the paired run
- [ ] Legacy and ledger runners accept the same run manifest, authority capsule, lane set, and budget/capability inputs
- [ ] Deep Alignment event and projection identities are enumerated, including raw finding and deviation history
- [ ] The comparator's non-semantic normalization allowlist and fail-closed unknown-field policy are explicit
- [ ] The fixture matrix covers every active lane and relevant authority, applicability, deviation, conflict, retry, and replay state

### Definition of Done
- [ ] Event-for-event parity is green for the required fixture matrix
- [ ] Projection parity and terminal-result parity are green without suppressing raw evidence
- [ ] Replay produces the same first divergence and projection fingerprint
- [ ] A mismatch injection is detected and classified as blocking
- [ ] A parity receipt records exact inputs, comparator version, digests, fixture coverage, and legacy-authoritative status
- [ ] The result is handed to `007-rollback-and-mode-gate` without performing authority cutover
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Paired-run manifest**: bind run ID, target digest, authority capsule digest and epoch, verifier identity, lane configuration, review-loop contract version, executor capability snapshot, budget snapshot, and fixture seed. The legacy and ledger paths receive the same manifest.
- **Legacy authority adapter**: execute the existing Deep Alignment emitter unchanged and capture its emitted events, findings, projections, terminal decision, and provenance needed for comparison.
- **Ledger shadow adapter**: execute the typed ledger path in non-authoritative mode and capture its accepted events, reducers, projections, receipts, and terminal decision without changing the legacy response.
- **Canonical event comparator**: pair events by stable logical identity; compare event kind, causal parent, lane, subject, authority epoch, applicability, evidence references, verdict, disposition, and semantic payload. Normalize only an explicitly versioned set of transport fields.
- **Projection comparator**: compare immutable projection identities and values for findings, applicability, evidence, deviations, authority conflicts, terminal state, and public gauges; preserve raw event histories and distinguish diagnostic gauges from mode outputs.
- **Replay and mismatch reporting**: replay captured streams under the same comparator version, identify the first divergence, classify it, emit paired references and a replay command, and return `PARITY_BLOCKED` for missing or ambiguous evidence.
- **Parity receipt**: bind the green result to the manifest, authority and verifier digests, comparator version, fixture matrix, event/projection fingerprints, mismatch count, and explicit legacy-authoritative status. This receipt is an input to the successor mode gate, not an authorization token by itself.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm `005-resume-adapter` provides stable logical IDs and replay inputs without changing the phase's scope.
- Confirm the phase-014 shadow framework and phase-012 shared review-loop contract are available and record their exact versions in the paired-run manifest.
- Inventory Deep Alignment legacy events and public projections by lane, authority epoch, subject, finding lifecycle, applicability state, deviation state, and terminal outcome.
- Define the comparator contract, semantic field allowlist, mismatch classes, `PARITY_PASS`, `PARITY_FAIL`, and `PARITY_BLOCKED` dispositions.

### Phase 2: Implementation
- Add the Deep Alignment mode adapter to the phase-014 paired-run boundary; pass one frozen manifest to both legacy and ledger runners.
- Capture legacy and ledger events without changing legacy emission or making the ledger authoritative.
- Canonicalize event envelopes and pair them by stable identity, then compare causal order, semantic payload, authority provenance, evidence references, and lifecycle transitions.
- Compare per-lane projections and terminal outputs, retaining raw findings, applicability decisions, known-deviation assertions, and authority conflicts rather than collapsing them.
- Add deterministic replay, retry, late-event, authority-epoch, applicability, and known-deviation fixtures; include at least one seeded divergence for every blocking mismatch class.
- Emit a mode-scoped parity receipt with digests, fixture coverage, first-divergence data, and legacy-authoritative status.

### Phase 3: Verification
- Execute the complete fixture matrix through both paths from identical manifests.
- Verify one-to-one event cardinality, stable identities, causal order, semantic payload equality, authority provenance, and projection equality.
- Verify repeated capture and replay produce identical comparison fingerprints and first-divergence classifications.
- Verify invalid, stale, expired, rolled-back, or mixed authority material yields `PARITY_BLOCKED` and never a pass.
- Verify injected missing, extra, duplicate, reordered, changed-payload, changed-applicability, and changed-verdict events fail with actionable reports.
- Verify the legacy path remains authoritative and no authority-cutover or rollback side effect is performed by the harness.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Run legacy and ledger adapters from one frozen paired-run manifest; mutate each manifest component in a negative fixture and require an explicit pre-comparison block |
| REQ-002 | Compare event cardinality and stable logical identities in both directions; inject missing, extra, and duplicate events and require `PARITY_FAIL` |
| REQ-003 | Replay concurrent lane fixtures with different arrival order; compare causal/barrier order and reject any changed semantic sequence or terminal transition |
| REQ-004 | Compare canonical payloads with the versioned allowlist; inject unknown, dropped, and changed semantic fields and require a blocking mismatch |
| REQ-005 | Compare finding lifecycle, applicability, evidence, deviation, conflict, terminal, and gauge projections by identity; retain raw evidence and test projection-only drift |
| REQ-006 | Use authority capsule epoch/digest and verifier identity fixtures for valid, stale, expired, rolled-back, and mixed-version cases; invalid material must block |
| REQ-007 | Run capture twice and replay the same streams twice; assert equal first-divergence class, event fingerprint, projection fingerprint, and receipt fields |
| REQ-008 | Inject an ambiguous or missing comparator input and assert a typed mismatch report with paired references, lane, subject, authority epoch, and replay command |
| REQ-009 | Inspect the parity receipt and runtime mode flag; prove legacy remains authoritative and no cutover is possible from this phase's output alone |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Inherits the 065 program dependencies: the pinned baseline and state census, the transition-authorized ledger core, shared evidence and control services, compatibility adapters, and the spec-kit validator. Phase-specific dependencies are the phase-014 shadow framework, the phase-012 shared review-loop contract, the sibling Deep Alignment schema/reducer/artifact/certificate/resume outputs, the unchanged legacy emitter, and the successor `007-rollback-and-mode-gate` receipt contract.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase is additive and shadow-only. Disable the Deep Alignment shadow flag or discard the disposable shadow capture and comparison artifacts to return operation to the unchanged legacy emitter; no persisted authority state is changed and no legacy writer is removed. If the comparator or adapter is faulty, revert only the phase-scoped harness change and rerun the legacy path. A green parity receipt is invalidated on any change to the paired-run manifest, authority capsule, verifier, comparator version, or shared review-loop contract.
<!-- /ANCHOR:rollback -->
