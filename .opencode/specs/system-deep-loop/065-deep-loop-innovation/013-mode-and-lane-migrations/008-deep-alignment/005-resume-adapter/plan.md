---
title: "Implementation Plan: Deep Alignment - Resume Adapter"
description: "Implementation plan for the Deep Alignment resume adapter: validate the sealed ledger, fold the shared review-loop reducers, rebuild authority-bound continuity, and plan idempotent re-entry for per-lane conformance work."
trigger_phrases:
  - "deep alignment resume adapter implementation plan"
  - "sealed ledger alignment recovery plan"
  - "deep-alignment idempotent re-entry"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/005-resume-adapter"
    last_updated_at: "2026-07-15T23:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined authority-aware fold and re-entry planning boundaries"
    next_safe_action: "Bind alignment ladder states to the shared review reducers"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep Alignment - Resume Adapter

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop Deep Alignment mode |
| **Change class** | Planning contract for ledger-backed authority-aware recovery and re-entry |
| **Execution** | Later implementation against the phase-012 shared review-loop contract and the frozen write-set graph |

### Overview
The adapter will rebuild Deep Alignment from a sealed ledger frontier rather than a mutable checkpoint, current authority
path, or report. It will validate the frontier, invoke the shared review-loop reducers, derive the authority, lane, evidence,
proof, adjudication, convergence, and handoff state, then return one typed re-entry decision. The decision is keyed by stable
logical identities, manifest revision, authority epoch, verifier and subject digests, artifact receipts, and a versioned replay
fingerprint. It never assumes that a prior conformance result is reusable because a lane or rule label matches.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The phase-012 shared review-loop contract is frozen with sealed-frontier, reducer, replay, and terminal interfaces
- [ ] The shared mode contract and emitted write-set conflict graph are available for same-lineage and independent-lineage resume
- [ ] Deep Alignment sibling concerns expose the typed events, reducer projections, sealed references, certificates, and receipts consumed here
- [ ] Authority epoch, subject snapshot, verifier, evidence receipt, and manifest fingerprints have defined compatibility inputs
- [ ] Every interruption boundary and external-effect state has a defined recovery outcome
- [ ] The continuity ladder and re-entry decision algebra are written as executable invariants
- [ ] The adapter has one authoritative sealed-ledger read path and no mutable-summary or live-authority fallback

### Definition of Done
- [ ] A sealed-frontier fold reconstructs Deep Alignment state deterministically for every ladder boundary
- [ ] Re-entry decisions are idempotent for duplicate requests and fail closed for missing, conflicting, stale, or incompatible evidence
- [ ] Crash-injection and replay fixtures cover authority, lane, observation, proof, adjudication, convergence, and handoff boundaries
- [ ] The adapter consumes the shared review-loop backbone without a Deep Alignment-specific lifecycle fork
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Authoritative input**: read only the sealed finalized ledger prefix and its frontier certificate. Verify sequence continuity,
  event hashes, schema and reducer versions, authority epoch references, receipt integrity, and the replay-compatibility fingerprint.
- **Shared fold**: invoke the phase-012 review-loop reducer contract for run, resume, scope, pass, convergence, blocked-stop,
  continuity, and terminal transitions. Deep Alignment supplies typed payload data and a mode projection, not alternate transitions.
- **Authority projection**: derive authority capsule validity, epoch compatibility, compiler and verifier identity, expiry,
  rollback or mix-and-match status, and the prerequisite status for all lanes before treating conformance as eligible.
- **Lane projection**: derive stable logical lane and epoch-specific lane identity, rule and subject cursor, applicability closure,
  discovery and observation coverage, pending obligations, and branch-local completion from immutable event references.
- **Verify-first projection**: preserve raw observations, candidate findings, independent verifier results, proof witnesses,
  conformance assessments, and counter-evidence separately. Impact, confidence, evidence strength, and verdict remain orthogonal.
- **Deviation projection**: treat an exception as a visible append-only adjudication overlay bound to authority epoch, subject,
  scope, verifier, issuer, evidence, and expiry. Relevant drift invalidates or reopens the overlay without deleting the finding.
- **Resume planner**: classify each incomplete lane, observation, proof, effect, or projection as `reuse`, `reexecute`, `reconcile`,
  `compensate`, `migrate`, `pin-old-runtime`, `reject`, or `block`. Re-execution changes attempt ID only; unknown irreversible effects
  remain blocked until the shared effect policy resolves them.
- **Idempotency boundary**: derive a resume key from lineage, sealed frontier, manifest revision, authority epoch, verifier and
  subject digests, reducer version, and replay fingerprint. A compare-and-set or equivalent single-writer guard returns the existing
  decision for an exact duplicate and rejects a conflicting duplicate.
- **Handoff projection**: materialize report or terminal handoff state only from the folded sealed state and a projection key. A
  changed frontier creates a new immutable projection; it does not mutate the earlier conformance history.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm phase-012 shared review-loop and mode-contract inputs are frozen at the pinned baseline; record exact seal, event,
  reducer, compatibility, terminal, and write-set interfaces.
- Inventory Deep Alignment interruption boundaries: authority validation, lane planning, applicability, discovery, observation,
  candidate emission, proof receipt, adjudication, deviation, convergence, and report or terminal handoff.
- Define the continuity-ladder matrix and invariant table for valid, incomplete, contested, stale, affected, unknown-effect,
  missing-event, duplicate, and blocked inputs.

### Phase 2: Implementation
- Bind the adapter to the shared sealed-frontier reader and reducer registry; reject unsealed or incompatible histories before
  scheduling a lane, verifier, proof, or re-probe operation.
- Implement the authority-aware continuity projection, including epoch validity, applicability closure, lane cursor, evidence
  freshness, proof obligations, deviation state, convergence inputs, and next safe action.
- Implement logical identity matching for run, lane, rule, subject, observation, finding, verification, proof, effect, deviation,
  and handoff work; keep attempt identity separate from logical identity.
- Implement compatibility and affected-replay planning for authority, subject, verifier, evidence, manifest, reducer, schema,
  artifact, and policy changes; replay only impacted witnesses and obligations when the shared contract permits it.
- Persist or reference one idempotent resume decision before any re-entered side effect; preserve unknown external outcomes for
  receipt lookup, compensation, reconciliation, or block.
- Preserve branch-local lane successes and late events while preventing duplicate application, silent event loss, or whole-wave replay.
- Expose the next safe action to the shared runner without duplicating its review-loop or convergence policy.

### Phase 3: Verification
- Replay sealed fixtures from an empty reducer and from every interruption frontier; compare authority, lane, evidence, proof,
  deviation, terminal, projection, and next-action fingerprints.
- Inject crashes at each append, fold, evidence, proof, adjudication, convergence, and handoff boundary; verify no logical work is
  duplicated, lost, or automatically repeated after an unknown external effect.
- Exercise exact, compatible, migrated, pinned, stale, affected, incompatible, changed-authority, changed-subject, and
  changed-manifest fingerprints; verify the expected explicit disposition.
- Submit duplicate and concurrent resume requests for one lineage and independent lineages; compare outcomes with the write-set graph.
- Verify authority-invalid, not-applicable, unresolved, inconclusive, untested, blocked, expired-deviation, and reactivation cases.
- Confirm shadow-parity inputs are stable and complete while authority remains non-authoritative and the legacy path is unchanged.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Seal a frontier, corrupt its sequence, hash, receipt, authority epoch, reducer, or replay data, and verify recovery blocks before scheduling work |
| REQ-002 | Fold identical prefixes in fresh processes and compare canonical authority, lane, evidence, proof, deviation, terminal, and next-action fingerprints |
| REQ-003 | Build fixtures ending at authority, lane, applicability, observation, candidate, proof, adjudication, convergence, and handoff boundaries; verify one owning ladder state per fixture |
| REQ-004 | Submit the same resume request repeatedly and concurrently; assert one logical decision and stable projection keys |
| REQ-005 | Remove, duplicate, reorder, truncate, and conflict events; alter authority, subject, verifier, manifest, and replay fingerprints; assert block, reconcile, migrate, pin, or reject without silent progress |
| REQ-006 | Change logical scope and attempt inputs independently; verify stable logical IDs and changing attempt IDs follow the decision algebra |
| REQ-007 | Replay authority-invalid, applicability, candidate, proof, evidence, and conformance fixtures; verify detector output alone never produces a blocking result |
| REQ-008 | Replay active, expired, revoked, mismatched, and reactivated deviations; verify original observations remain immutable and visible |
| REQ-009 | Run phase-012 shared-loop fixtures and compare Deep Alignment lifecycle shape with Deep Review mode 002; verify no local transition path is exercised |
| REQ-010 | Confirm the adapter emits deterministic shadow-parity inputs and never writes authority, legacy state, or cutover transitions |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The adapter depends on phase 012 for shared review-loop lifecycle transitions, sealed-frontier semantics, reducer invocation,
and replay compatibility. It consumes the shared mode contract and write-set conflict graph emitted before the per-mode migration
fan-out. It consumes Deep Alignment typed events and projections from `001-typed-ledger-schema` and `002-reducers-and-projections`,
sealed references and certificates from the preceding concerns, and shared effect and receipt policy. The required adjacency to
`004-certificates-and-receipts` and `006-shadow-parity` is navigation and ordering rather than a hard runtime dependency. The
later authority-cutover phase remains the only owner of authority changes.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase is planning only and changes no runtime authority. If implementation reveals a contract mismatch, disable the adapter
at its boundary, preserve the sealed ledger and all immutable alignment facts, and return the lineage to the existing
non-authoritative or legacy recovery path without deleting or rewriting history. Revert only adapter implementation and test
changes; retain the same sealed fixtures for a corrected contract pass. A resume request with an unknown external effect remains
blocked for reconciliation rather than being rolled back as if the effect never occurred.
<!-- /ANCHOR:rollback -->
