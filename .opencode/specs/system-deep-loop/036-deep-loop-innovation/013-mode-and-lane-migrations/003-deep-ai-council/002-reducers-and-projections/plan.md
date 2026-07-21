---
title: "Implementation Plan: Deep AI Council - Reducers & Projections"
description: "Implementation plan for the pure Deep AI Council event fold and its deliberation/convergence, independence and stance, artifact-index, per-mode status, and plural-outcome projections."
trigger_phrases:
  - "Deep AI Council reducers and projections implementation plan"
  - "deep-ai-council projection fold plan"
  - "typed council event reducer plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/002-reducers-and-projections"
    last_updated_at: "2026-07-15T22:15:00Z"
    last_updated_by: "opencode"
    recent_action: "Outlined council projection families and replay gates"
    next_safe_action: "Draft the council event-to-projection ownership matrix"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep AI Council - Reducers & Projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / deep-ai-council mode migration |
| **Change class** | Pure reducer and projection design over typed council ledger events |
| **Execution** | Contract-first planning; implementation remains additive, dark, and non-authoritative |

### Overview
The phase will specify one deterministic fold over the typed Deep AI Council event stream and four projection surfaces:
iteration/convergence state, independent-seat and stance evidence, an immutable artifact index, and per-mode status. A
separate plural-outcome projection will expose protocol-specific results while retaining raw proposals, beliefs, ballots,
vetoes, minority evidence, and unresolved values. The fold consumes the previous sibling's frozen event contract, replays
the seats-deliberate -> critique-rounds -> converge lifecycle, and proves shadow parity before any authority can move.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The `001-typed-ledger-schema` event contract and version policy are available as read-only inputs.
- [ ] Shared fan-out/fan-in, adjudication, budget, convergence, and mode contracts are identified, including the 013 write-set conflict graph.
- [ ] The legacy Deep AI Council state, control-arm outputs, replay fixtures, and protected-vs-known-defect decisions are pinned for shadow comparison.
- [ ] The reducer input, initial state, output state, error result, and projection fingerprint are specified without side effects.
- [ ] Event families for isolated proposals, critiques, stance transitions, independence snapshots, adjudication, counterfactual probes, and lifecycle status have one projection owner each.
- [ ] The boundary with `003-sealed-artifacts` is explicit: this phase indexes references and does not create or certify sealed artifacts.

### Definition of Done
- [ ] A typed event-to-projection matrix covers every event consumed by Deep AI Council.
- [ ] Deliberation/convergence, independence/stance, artifact index, and per-mode status reducers have deterministic invariants and fail-closed rules.
- [ ] Plural outcome routing preserves factual, comparative, debate, and value-disagreement semantics without making two-of-three authoritative.
- [ ] Replay, duplicate, late-event, schema-mismatch, counterfactual-instability, and projection-drift fixtures are defined and pass in shadow mode.
- [ ] The typed projections retain raw evidence and remain non-authoritative until the later cutover phase.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Ledger input**: consume the ordered typed event sequence, event identity, schema-version metadata, and predecessor references from `001-typed-ledger-schema`; do not infer missing council facts from transcripts, current files, clocks, or external services.
- **Pure fold**: apply `foldDeepAiCouncil(initialState, event)` as a total, deterministic transition over immutable state. Canonical maps, stable arrays, explicit numeric handling, and canonical serialization feed the projection fingerprint.
- **Deliberation/convergence projection**: maintain council-worthiness admission, target version, seed and critique round identity, isolated versus exposed evidence, protocol route, required seat/evidence coverage, unresolved claims, vetoes, counterfactual obligations, convergence eligibility, terminal decision, and last-applied sequence. Agreement is an observation, not a legal stop by itself.
- **Independence and stance projection**: retain model-family, reasoning-method, evidence-partition, and tool-surface metadata; raw score/error vectors; calibration fingerprints and support; effective seats; influence concentration; stance history; flip-to-evidence, flip-to-majority, unsupported-majority-flip, and minority-erasure measures. Uncalibrated or out-of-support values remain explicit states.
- **Artifact index projection**: index proposals, private beliefs, typed belief messages, pairwise ballots, bias audits, counterfactual forks, minority reports, protocol decisions, and gate inputs by logical identity and digest. Supersession adds lineage and never rewrites an earlier observation.
- **Per-mode status projection**: derive `planned`, `admitted`, `deliberating`, `adjudicating`, `converging`, `complete`, `blocked`, `quarantined`, or `failed` only from authorized typed transitions and projection-health checks. Store contract versions, replay position, admission reason, blocking reason, shadow state, and mode-gate state.
- **Plural outcome presentation**: route factual evidence to a reliability-weighted posterior, comparative plans to blinded swapped pairwise judgment, unresolved high-value uncertainty to bounded evidence-focused debate, and legitimate value disagreement to a preserved plural result. Retain majority recommendation, ties, unbeaten set, vetoes, minority evidence, unresolved values, reopen conditions, and control-arm deltas.
- **Failure boundary**: unknown schema versions, sequence gaps, impossible transitions, duplicate terminal decisions, invalid artifact references, unsupported calibration, counterfactual instability, and fingerprint mismatches return explicit blocked/error results. The reducer does not repair, persist, notify, call a judge, or silently downgrade.
- **Shared contract reuse**: parameterize the shared lifecycle, fan-in, adjudication, budget, convergence, and status backbone; keep council-specific event mappings and projections at the mode edge rather than copying shared implementations.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Read the predecessor event schema, shared mode/fan-in/adjudication contracts, 013 conflict graph, council findings registries, and legacy Deep AI Council replay fixtures.
- Freeze the reducer input/output vocabulary and record which fields are source evidence, derived outcome, calibration metadata, compatibility metadata, or projection health.
- Confirm the planning boundary: no new event schema, seat producer, adjudicator, sealed artifact writer, authority cutover, or sibling concern is introduced here.

### Phase 2: Implementation
- Build the event-to-projection matrix for target freeze, private proposal, typed belief, critique, stance, seat selection, independence snapshot, pairwise judgment, bias audit, counterfactual fork, protocol decision, convergence, and mode-status events; include accepted transitions, idempotent duplicates, late evidence, sequence rules, and fail-closed cases.
- Define the immutable fold state, canonical serialization, projection version, and deterministic fingerprint with no wall-clock, random, filesystem, network, model, or mutable singleton dependency.
- Define the deliberation/convergence reducer for council admission, target and round coverage, isolated evidence, critique exposure, unresolved obligations, hard vetoes, counterfactual requirements, control arms, and terminal decisions.
- Define the independence and stance reducer for raw seat evidence, calibration support, effective seats, residual correlation, influence, stance changes, minority survival, and evidence-conditioned versus social-conformity transitions.
- Define the artifact-index reducer for immutable references, content digests, producer events, target/round identity, availability, and supersession lineage; leave construction and sealing to the successor.
- Define the per-mode status reducer and projection-health state, including contract versions, last sequence, council admission, blocked reason, shadow parity, gate state, and terminal status.
- Define the plural-outcome presentation projection and keep raw ballots, ties, vetoes, minority evidence, unresolved values, control-arm deltas, and reopen conditions independently replayable.

### Phase 3: Verification
- Replay the same ordered event sequence repeatedly and compare semantic state, canonical serialization, projection fingerprint, terminal status, effective seats, stance lineage, and plural outcome.
- Exercise empty, isolated-only, critique-complete, converged, unresolved-dissent, duplicate, late-evidence, supersession, sequence-gap, unknown-version, unsupported-calibration, counterfactual-instability, impossible-transition, and projection-drift fixtures.
- Compare new projections with legacy Deep AI Council state on frozen shadow fixtures; report field-level differences without changing authority.
- Verify artifact references are digest-stable, independence is evidence-conditioned, stance changes retain causes, plural outcomes preserve dissent, and status cannot silently recover from an invalid transition.
- Verify the phase-012 shared mode and fan-in contracts are reused with council-specific configuration only; no per-mode fork of the shared reducer backbone is introduced.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Pure-fold fixtures run an identical ordered event sequence multiple times and compare canonical projections plus fingerprints |
| REQ-002 | Deliberation fixtures prove target, seat, round, evidence, protocol, veto, unresolved-obligation, and terminal state are replayed deterministically |
| REQ-003 | Independence and stance fixtures retain raw error vectors and compare effective seats, correlations, calibration support, influence, stance flips, and minority survival |
| REQ-004 | Artifact fixtures verify stable logical identity, digest, producer linkage, target/round provenance, availability, and append-only supersession lineage |
| REQ-005 | Status-transition fixtures accept valid lifecycle transitions and fail closed on impossible transitions, duplicate terminals, schema drift, projection errors, and unsupported admission |
| REQ-006 | Outcome fixtures prove factual, comparative-plan, debate, and value-disagreement routes retain ties, vetoes, minority evidence, unresolved values, control arms, and reopen conditions |
| REQ-007 | Negative replay fixtures return explicit blocked/error results for unknown versions, sequence gaps, invalid fingerprints, missing artifacts, unsupported calibration, and counterfactual instability |
| REQ-008 | Shadow fixtures compare legacy and typed projections by field, independence, stance lineage, outcome, coverage, artifact index, and status while preserving non-authority |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The plan consumes the typed event schema from `001-typed-ledger-schema`, shared mode and fan-in contracts from phase 015,
the 013 write-set conflict graph, shared adjudication/budget/convergence services, and the legacy Deep AI Council replay
corpus. The research inputs are the Deep AI Council findings in
`002-deep-loop-effectiveness-and-fanout/research/findings-registry-modes.json`, the cross-cutting council and replay
findings in `findings-registry.json`, the 036 parent `spec.md`, and `manifest/phase-tree.json`.

`003-sealed-artifacts` is a downstream adjacency boundary for artifact sealing and certification, not a dependency for
defining the index. The migration remains additive and dark. Legacy projections remain authoritative until adapters,
shadow parity, in-flight classification, and later staged cutover phases authorize a change.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase authors a planning contract and introduces no runtime authority or persisted projection migration. If a later
implementation exposes a projection defect, disable the dark reducer path and continue serving the legacy projection;
discard only the non-authoritative projection output. Any persisted projection-store change must be transactionally
reversible by projection-version rollback and replay from the immutable ledger, never by deleting source events. A
counterfactual or calibration projection defect must block the typed outcome rather than fall back to nominal quorum.
Authority rollback remains owned by the staged cutover phase.
<!-- /ANCHOR:rollback -->
