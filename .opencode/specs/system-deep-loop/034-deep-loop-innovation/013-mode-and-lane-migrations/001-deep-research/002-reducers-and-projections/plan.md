---
title: "Implementation Plan: Deep Research - Reducers & Projections"
description: "Implementation plan for the pure deep-research event fold and its iteration/convergence, artifact-index, and per-mode status projections."
trigger_phrases:
  - "deep research reducers implementation plan"
  - "deep research projection plan"
  - "typed research event fold"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/002-reducers-and-projections"
    last_updated_at: "2026-07-15T17:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Mapped deep-research state into three deterministic projection surfaces"
    next_safe_action: "Define canonical event ordering and field-level reducer ownership"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep Research - Reducers & Projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / deep-research mode migration |
| **Change class** | Pure reducer and projection contract over typed events |
| **Execution** | After the shared mode contract and typed ledger schema are frozen; ledger remains dark and legacy remains authoritative |

### Overview
The implementation will replace full-history interpretation with a versioned, side-effect-free fold over the typed
deep-research event stream. The fold will preserve raw observations and immutable judgment history, then materialize
three views: iteration/convergence state, an artifact index, and per-mode status. The design follows the research
findings that a research plan is a versioned executable object, claim evidence must be a reversible ledger, raw novelty
is not trusted convergence input, and the synthesis artifact is a view of atomic claims rather than primary mutable
state. The existing reducer and heartbeat behavior are treated as parity baselines, not as the new projection contract.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `001-typed-ledger-schema` has a frozen event envelope, ordering inputs, schema-version policy, and deep-research event inventory
- [ ] Phase-012 shared mode interfaces identify reducer ownership, replay identity, continuity, and legacy-projection ports
- [ ] The phase-013 write-set graph identifies the reducer/projection resource boundary and any shared gauge-store fence
- [ ] A field-level reducer ownership matrix names every projected field, input event family, fold operation, and invalid-state outcome
- [ ] Fixtures cover valid lifecycle, evidence admission, claim revision, contradiction, artifact reference, convergence witness, and status events
- [ ] The planned projection fingerprint and rebuild policy are compatible with the shared replay contract

### Definition of Done
- [ ] One pure fold produces iteration/convergence, artifact-index, and per-mode status projections
- [ ] Raw observations and versioned judgments remain available after projection refresh
- [ ] Full replay and incremental replay produce equivalent projections and fingerprints
- [ ] Permutation, duplicate, late-event, source-mutation, missing-receipt, and incompatible-version fixtures pass
- [ ] Legacy-shaped output is comparison-only and cannot authorize a transition or cutover
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- The reducer entry point accepts only a typed event sequence, a declared schema/reducer version, and deterministic fold options. It performs no I/O, clock reads, random generation, model calls, network calls, or ledger writes.
- The canonical state is partitioned into immutable observations, versioned judgments, derived indexes, frontiers, and status. A correction appends a supersession or retraction event and folds as a signed replacement; it never mutates prior evidence.
- The event router assigns each event family to one reducer owner: run/plan lifecycle, branch/iteration lifecycle, evidence admission, claim/evidence relations, community/frontier state, convergence/health witness, artifact references, and mode status.
- The iteration projection stores plan revision, branch identity, iteration sequence, query recipe identity, admission result, trusted/provisional evidence counts, active claim versions, open contradiction and falsification obligations, next-focus candidates, and raw score observations.
- The convergence projection stores observed and finalized frontiers, coverage and trusted evidence yield, redundancy and citation-drift measures, cycle/lease observations, health-witness inputs, terminal decision evidence, and a distinct incomplete or quarantined outcome when a stop prerequisite is absent.
- The artifact index stores logical artifact identity, artifact kind, schema version, digest, producer event, branch/iteration provenance, receipt references, availability and validity state, and supersession links. Construction and sealing remain external ports.
- The per-mode status projection derives a finite state machine from authorized lifecycle events. Impossible transitions, missing terminal evidence, unknown event types, and incompatible fingerprints become explicit blocked or rebuild-required results.
- The fold emits a projection fingerprint from schema version, reducer version, codec, canonical ordering policy, and normalized projection content. Incremental state tracks cursors, seen event IDs, keyed entities, and finalized frontier; a clean replay remains the oracle.
- Compatibility output is a read-only projection adapter for legacy iteration/status consumers. It reports lossy mappings and never appends events, changes authority, or suppresses raw evidence.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin the typed-ledger and shared-mode contracts, the deep-research event inventory, reducer resource boundary, and phase-013 write-set evidence.
- Build the field ownership matrix and state algebra before writing reducer code; identify required, optional, ignored, and rejected event fields.
- Capture current legacy reducer and heartbeat outputs as comparison fixtures, including full-history rescans and iteration Markdown parsing behavior.

### Phase 2: Implementation
- Implement the pure event router and canonical fold with explicit schema/reducer compatibility checks, deterministic tie-breakers, and projection fingerprinting.
- Implement the iteration and convergence projection, preserving raw evidence, claim/evidence revisions, trusted versus provisional frontiers, contradiction obligations, and incomplete/quarantined states.
- Implement the artifact index projection over typed artifact references and receipts, keeping unavailable, invalid, unknown, superseded, and sealed states distinct.
- Implement the per-mode status projection and compatibility adapter; reject impossible transitions and preserve evidence for every derived status.
- Implement incremental checkpoint application with cursors and seen-event identity, plus `rebuild_required` handling for gaps, truncation, projection drift, or incompatible reducer versions.

### Phase 3: Verification
- Replay canonical fixtures twice and compare normalized state, raw-event retention, indexes, status, and projection fingerprint byte-for-byte.
- Permute independent event arrival order, inject duplicates and late events, and prove that finalized state changes only through declared frontier advancement.
- Compare incremental folds against clean full replay across rotations, supersession forks, source mutations, missing receipts, malformed events, and partial branches.
- Verify no reducer path performs I/O or calls a side-effecting service, and verify legacy-shaped output remains shadow-only.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Pure-function harness runs the same event sequence with fixed versions and compares canonical serialized projections and fingerprints |
| REQ-002 | Ownership matrix test fails on missing, duplicate, or unowned projected fields and event families |
| REQ-003 | Arrival-order permutation fixtures compare logical identity/sequence ordering against completion-order input |
| REQ-004 | Research fixtures cover raw novelty versus admitted evidence, claim supersession, contradiction/falsification obligations, observed/finalized frontiers, and incomplete stop states |
| REQ-005 | Artifact-index fixtures verify digest identity, receipt linkage, missing/invalid/unknown states, supersession, and no placeholder artifact creation |
| REQ-006 | Status-machine fixtures exercise valid, impossible, duplicated, late, terminal, quarantined, and missing-evidence transitions |
| REQ-007 | Version, codec, ordering, cursor-gap, truncation, and projection-drift fixtures require `rebuild_required` or `blocked` |
| REQ-008 | Differential harness compares incremental cursor folds with clean full replay after duplicate events, rotations, late judgments, and supersession forks |
| REQ-009 | Legacy adapter fixtures prove lossy fields are marked and no compatibility output can authorize a ledger transition |
| REQ-010 | Static dependency and runtime spy checks prove the fold does not access filesystem, network, clock, randomness, model, seal, or append services |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase consumes the planned `001-typed-ledger-schema` event contract and the phase-012 shared mode interface and
write-set declarations. It also consumes the shared event sources for evidence admission, claim lifecycle, community
snapshots, convergence witnesses, receipts, budgets, continuity, and health. The parent phase tree places phase 012
before phase 013, but this child remains `depends_on: []` in the manifest and treats sibling adjacency as navigation.

Research inputs are the deep-research mode findings in
`002-deep-loop-effectiveness-and-fanout/research/findings-registry-modes.json`, the runtime reducer/projection findings
in `findings-registry.json`, the phase-013 parent `spec.md`, and `manifest/phase-tree.json`. Successor
`003-sealed-artifacts` consumes the artifact-index contract; it does not delegate artifact construction to this phase.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase is planned as a pure projection layer and must not mutate canonical ledger state or change authority. If an
implementation candidate fails replay or parity, disable the projection reader and retain the legacy reader as the
comparison path; discard the candidate projection checkpoint and revert only the phase-scoped reducer/projection
commit. No source evidence or sealed artifact is deleted, and no legacy writer is removed. Any projection schema
change requires a new reducer version and explicit rebuild rather than in-place reinterpretation of existing state.
<!-- /ANCHOR:rollback -->
