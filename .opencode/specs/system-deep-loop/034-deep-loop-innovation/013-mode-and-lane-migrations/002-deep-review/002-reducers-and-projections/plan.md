---
title: "Implementation Plan: Deep Review - Reducers & Projections"
description: "Implementation Plan for the Deep Review reducers and projections phase: define a pure typed-event fold, three live projection families, derived finding impact, replay failure behavior, and shadow parity against the legacy loop."
trigger_phrases:
  - "Deep Review reducers and projections implementation plan"
  - "deep-review projection fold plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/002-reducers-and-projections"
    last_updated_at: "2026-07-15T20:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Outlined the three Deep Review projection families and replay gates"
    next_safe_action: "Draft the event-to-projection mapping against the frozen contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep Review - Reducers & Projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / deep-review mode migration |
| **Change class** | Pure reducer and projection design over typed ledger events |
| **Execution** | Contract-first planning; implementation remains additive, dark, and non-authoritative |

### Overview
The phase will specify one deterministic fold over the typed Deep Review event stream and three live projections: iteration/convergence state, an immutable artifact index, and per-mode status. A separate derived presentation projection will expose P0/P1/P2 while retaining factored evidence and lifecycle as source data. The fold will reuse the phase-012 shared review-loop contract also consumed by Deep Alignment mode 008, and it will prove shadow parity before any authority can move.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The `001-typed-ledger-schema` event contract and version policy are available as read-only inputs.
- [ ] The phase-012 shared review-loop contract and the Deep Alignment reuse boundary are identified.
- [ ] The 013 write-set conflict graph is available for projection ownership and persistence boundaries.
- [ ] The legacy Deep Review state, replay fixtures, and protected-vs-known-defect decisions are pinned for shadow comparison.
- [ ] The reducer input, initial state, output state, error result, and projection fingerprint are specified without side effects.
- [ ] The boundary with `003-sealed-artifacts` is explicit: this phase indexes references and does not create sealed artifacts.

### Definition of Done
- [ ] A typed event-to-projection matrix covers every event consumed by Deep Review.
- [ ] Iteration/convergence, artifact index, and per-mode status reducers have deterministic invariants and fail-closed rules.
- [ ] P0/P1/P2 is derived from factored finding evidence and cannot override hard vetoes.
- [ ] Replay, duplicate, late-event, schema-mismatch, and projection-drift fixtures are defined and pass in shadow mode.
- [ ] The shared review-loop contract is reused by Deep Review and Deep Alignment without a mode-specific fork.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Ledger input**: consume the ordered typed event sequence and schema-version metadata from `001-typed-ledger-schema`; do not infer missing events from current files, clocks, or external services.
- **Pure fold**: apply `foldDeepReview(initialState, event)` as a total, deterministic transition over immutable state. Canonical maps, stable arrays, explicit numeric handling, and canonical serialization feed the projection fingerprint.
- **Iteration/convergence projection**: maintain scope identity, changed surfaces, review dimensions, coverage cells, pass state, candidate lifecycle, unresolved obligations, convergence eligibility, terminal decision, and last-applied sequence. Required-but-unresolved cells and hard vetoes remain blocking.
- **Artifact index projection**: index raw findings, challenge attempts, proof receipts, reports, suppression records, and verification outputs by stable logical identity and digest. Supersession adds lineage; it does not rewrite an earlier artifact.
- **Per-mode status projection**: derive `planned`, `running`, `converging`, `complete`, `blocked`, or `failed` only from authorized typed transitions and projection-health checks. Store contract versions, replay position, blocking reason, and shadow status.
- **Finding presentation**: derive P0/P1/P2 from impact and policy after retaining confidence, reachability, exploitability, evidence kind, evidence strength, evidence scope, and lifecycle. Repeated model agreement is not an independent proof class.
- **Failure boundary**: unknown schema versions, sequence gaps, impossible transitions, duplicate terminal decisions, invalid artifact references, and fingerprint mismatches return explicit blocked/error results. The reducer does not repair, persist, notify, or silently downgrade.
- **Shared loop reuse**: parameterize the common scope/pass/convergence/report contract for Deep Review and Deep Alignment; keep mode-specific event mappings and projections at the edge rather than copying the loop backbone.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Read the predecessor event schema, phase-012 review-loop contract, Deep Alignment mode-008 boundary, 013 conflict graph, and legacy Deep Review replay fixtures.
- Freeze the reducer input/output vocabulary and record which fields are source evidence, derived presentation, compatibility metadata, or projection health.
- Confirm the planning boundary: no new event schema, sealed artifact writer, authority cutover, or sibling concern is introduced here.

### Phase 2: Implementation
- Build the event-to-projection matrix, including accepted transitions, idempotent duplicates, late evidence, sequence rules, and fail-closed cases.
- Define the immutable fold state and canonical projection serialization/fingerprint, with no wall-clock, random, filesystem, network, or mutable singleton dependency.
- Define the iteration/convergence reducer and its coverage obligations; prevent convergence from passing on a scalar score when required dimensions or hard evidence remain unresolved.
- Define the artifact-index reducer for immutable references, content digests, producer events, reviewed revisions, availability, and supersession lineage.
- Define the per-mode status reducer and projection-health state, including contract versions, last sequence, blocked reason, shadow parity, and terminal status.
- Define the derived P0/P1/P2 presentation projection and preserve all factored finding fields and raw evaluator observations.
- Define the shared review-loop adapter used by Deep Review and Deep Alignment, including mode-specific configuration without a second loop implementation.

### Phase 3: Verification
- Replay the same ordered event sequence repeatedly and compare semantic state, canonical serialization, projection fingerprint, and terminal status.
- Exercise empty, partial, completed, duplicate, late-evidence, supersession, sequence-gap, unknown-version, impossible-transition, and projection-drift fixtures.
- Compare new projections with the legacy Deep Review projection on frozen shadow fixtures; report field-level differences without changing authority.
- Verify artifact references are digest-stable, finding impact is derived, convergence is coverage-aware, and per-mode status cannot silently recover from an invalid transition.
- Run the shared review-loop contract against Deep Review and Deep Alignment fixtures to prove structural reuse and no mode-specific fork.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Pure-fold unit fixtures run an identical ordered event sequence multiple times and compare canonical projections plus fingerprints |
| REQ-002 | Coverage fixtures prove required dimensions, unresolved obligations, hard vetoes, and terminal convergence state are replayed deterministically |
| REQ-003 | Artifact fixtures verify stable logical identity, content digest, producer linkage, availability, and append-only supersession lineage |
| REQ-004 | Status-transition fixtures accept valid transitions and fail closed on impossible transitions, duplicate terminals, schema drift, and projection errors |
| REQ-005 | Finding fixtures retain factored evidence and derive P0/P1/P2; hard failures cannot be rescued by weighted soft scores or repeated judge agreement |
| REQ-006 | Shared-contract fixtures run the same backbone assertions for Deep Review and Deep Alignment with mode-specific configuration only |
| REQ-007 | Negative replay fixtures return explicit blocked/error results for unknown versions, sequence gaps, invalid fingerprints, and projection mismatch |
| REQ-008 | Shadow fixtures compare legacy and typed projections by field, outcome, coverage, artifact index, and status while preserving non-authority |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The plan consumes the typed event schema from `001-typed-ledger-schema`, the shared review-loop contract frozen in phase 012, the 013 write-set conflict graph, and the legacy Deep Review replay corpus. `003-sealed-artifacts` is a downstream adjacency boundary for sealing and certification, not a dependency for defining the index. Deep Alignment mode 008 is a shared-contract consumer and parity reference, not a separate implementation target in this phase.

The migration remains additive and dark. Legacy projections remain authoritative until the shared adapters, shadow parity, in-flight classification, and later staged cutover phases authorize a change.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase authors a planning contract and introduces no runtime authority or persisted projection migration. If a later implementation exposes a projection defect, disable the dark reducer path and continue serving the legacy projection; discard only the non-authoritative projection output. Any persisted projection-store change must be transactionally reversible by projection-version rollback and replay from the immutable ledger, never by deleting source events. Authority rollback remains owned by the staged cutover phase.
<!-- /ANCHOR:rollback -->
