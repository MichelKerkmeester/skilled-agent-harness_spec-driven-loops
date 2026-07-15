---
title: "Implementation Plan: Deep Alignment - Reducers & Projections (013 phase 002)"
description: "Implementation Plan for the Deep Alignment reducers and projections phase: define a pure typed-event fold, lane-aware convergence state, an immutable artifact and evidence index, per-mode status, derived verdicts, replay failure behavior, and shadow parity against the legacy loop."
trigger_phrases:
  - "Deep Alignment reducers and projections implementation plan"
  - "deep-alignment projection fold plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/002-reducers-and-projections"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/002-reducers-and-projections"
    last_updated_at: "2026-07-15T21:26:00Z"
    last_updated_by: "opencode"
    recent_action: "Outlined the Deep Alignment lane projections and replay gates"
    next_safe_action: "Draft the lane event-to-projection matrix against the frozen contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep Alignment - Reducers & Projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / deep-alignment mode migration (013 phase 002) |
| **Change class** | Pure reducer and projection design over typed ledger events |
| **Execution** | Contract-first planning; implementation remains additive, dark, read-only, and non-authoritative |

### Overview
The phase will specify one deterministic fold over the typed Deep Alignment event stream and three live projection families: lane iteration/convergence state, an immutable artifact and evidence index, and per-mode status. A separate derived projection will expose per-lane verdicts and the overall worst-verdict rollup while retaining authority snapshots, applicability outcomes, raw observations, re-probe receipts, and deviation adjudications as source data. The fold will reuse the phase-009 shared review-loop contract also consumed by Deep Review mode 002, and it will prove shadow parity before any authority can move.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The `001-typed-ledger-schema` event contract and version policy are available as read-only inputs.
- [ ] The phase-009 shared review-loop contract and the Deep Review reuse boundary are identified.
- [ ] The 013 write-set conflict graph is available for projection ownership and persistence boundaries.
- [ ] The legacy Deep Alignment state, lane fixtures, authority epochs, known-deviation cases, and protected-vs-known-defect decisions are pinned for shadow comparison.
- [ ] The reducer input, initial state, output state, error result, and projection fingerprint are specified without side effects.
- [ ] The boundary with `003-sealed-artifacts` is explicit: this phase indexes references and does not create sealed artifacts or certificates.

### Definition of Done
- [ ] A typed event-to-projection matrix covers every event consumed by Deep Alignment.
- [ ] Lane iteration/convergence, artifact and evidence index, and per-mode status reducers have deterministic invariants and fail-closed rules.
- [ ] Per-lane verdicts preserve `not_applicable`, `unresolved`, `SKIP`, and `EXEMPT` as explicit derived outcomes and cannot erase raw findings.
- [ ] Replay, duplicate, late-reprobe, authority-mismatch, schema-mismatch, and projection-drift fixtures are defined and pass in shadow mode.
- [ ] The shared review-loop contract is reused by Deep Alignment and Deep Review without a mode-specific fork.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Ledger input**: consume the ordered typed event sequence and schema-version metadata from `001-typed-ledger-schema`; do not infer missing events from current authority files, clocks, adapters, or external services.
- **Pure fold**: apply `foldDeepAlignment(initialState, event)` as a total, deterministic transition over immutable state. Canonical maps, stable arrays, explicit outcome ordering, numeric handling, and canonical serialization feed the projection fingerprint.
- **Lane iteration/convergence projection**: maintain lane identity, authority epoch, scope and artifact-class references, discovery denominator, applicability cells, rule and artifact coverage, verify-first finding lifecycle, deviation overlays, unresolved obligations, convergence eligibility, terminal decision, and last-applied sequence. Missing denominator evidence, invalid authority, unresolved required observations, and hard blockers remain blocking.
- **Artifact and evidence index projection**: index authority references, discovered artifacts, applicability decisions, raw observations, re-probe receipts, findings, deviation assertions, and reports by stable logical identity and digest. Supersession adds lineage; it does not rewrite an earlier observation or failure.
- **Per-mode status projection**: derive `planned`, `scoping`, `discovering`, `iterating`, `converging`, `reporting`, `complete`, `blocked`, or `failed` only from authorized typed transitions and projection-health checks. Store lane summaries, contract and authority versions, replay position, blocking reason, and shadow status.
- **Verdict presentation**: derive one verdict per lane and an overall worst-verdict rollup from applicability, verified evidence, policy disposition, and blocking obligations. `PASS`, `FAIL`, `WARN`, `INCONCLUSIVE`, `NOT_APPLICABLE`, `SKIP`, and `EXEMPT` remain distinguishable; a deviation changes disposition without deleting the raw fact.
- **Failure boundary**: unknown schema or authority versions, expired or mixed authority material, sequence gaps, impossible transitions, duplicate terminal decisions, invalid artifact references, stale re-probes, and fingerprint mismatches return explicit blocked/error results. The reducer does not repair, persist, notify, re-run, or silently downgrade.
- **Shared loop reuse**: parameterize the common scope/pass/convergence/report contract for Deep Alignment and Deep Review; keep mode-specific lane, authority, and finding mappings at the edge rather than copying the loop backbone.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Read the predecessor event schema, phase-009 review-loop contract, Deep Review mode-002 boundary, 013 conflict graph, legacy Deep Alignment state and replay fixtures, and the authority adapter/known-deviation rules.
- Freeze the reducer input/output vocabulary and record which fields are source observations, derived verdicts, authority compatibility metadata, deviation overlays, or projection health.
- Confirm the planning boundary: no new event schema, authority compiler, sealed-artifact writer, re-probe executor, rollback switch, authority cutover, or sibling concern is introduced here.

### Phase 2: Implementation
- Build the event-to-projection matrix, including lane and authority identity, applicability precedence, accepted transitions, idempotent duplicates, late re-probe policy, sequence rules, and fail-closed cases.
- Define the immutable fold state and canonical projection serialization/fingerprint, with no wall-clock, random, filesystem, network, adapter, or mutable singleton dependency.
- Define the lane iteration/convergence reducer for scope, authority validity, discovery completeness, applicability, rule/artifact coverage, observations, verify-first findings, deviations, unresolved obligations, and terminal decisions.
- Define the artifact and evidence-index reducer for authority references, discovered targets, observations, re-probe receipts, findings, deviation assertions, report references, digests, availability, freshness, and supersession lineage.
- Define the per-mode status reducer and projection-health state, including lane summaries, contract and authority versions, last sequence, blocked reason, shadow parity, and terminal status.
- Define the derived per-lane and overall verdict projection while retaining raw detector output, authority evidence, verifier identity, applicability, deviation, confidence, and finding lifecycle independently.
- Define the shared review-loop adapter used by Deep Alignment and Deep Review, including mode-specific lane and finding configuration without a second loop implementation.

### Phase 3: Verification
- Replay the same ordered event sequence repeatedly and compare semantic state, canonical serialization, projection fingerprint, lane verdicts, and terminal status.
- Exercise empty, partial, completed, duplicate, late-reprobe, supersession, authority-expiry, mixed-epoch, not-applicable, unresolved, deviation, sequence-gap, unknown-version, impossible-transition, and projection-drift fixtures.
- Compare new projections with the legacy Deep Alignment projection on frozen shadow fixtures; report field-level differences without changing authority or suppressing raw failures.
- Verify coverage uses declared applicability edges and not only discovered artifacts; deviation overlays are visible; verdicts cannot coerce unresolved evidence to pass; and per-mode status cannot silently recover from invalid transitions.
- Run the shared review-loop contract against Deep Alignment and Deep Review fixtures to prove structural reuse and no mode-specific fork.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Pure-fold unit fixtures run an identical ordered event sequence multiple times and compare canonical projections plus fingerprints |
| REQ-002 | Lane coverage fixtures prove authority validity, declared applicability, rule/artifact coverage, unresolved obligations, hard blockers, and terminal convergence state are replayed deterministically |
| REQ-003 | Artifact and evidence fixtures verify stable logical identity, authority/verifier linkage, content digest, applicability, freshness, availability, and append-only supersession lineage |
| REQ-004 | Status-transition fixtures accept valid lifecycle transitions and fail closed on impossible transitions, duplicate terminals, authority drift, schema drift, and projection errors |
| REQ-005 | Verdict fixtures retain raw observations and derive per-lane outcomes; known deviations become visible overlays, while `not_applicable` and `unresolved` are not coerced to pass |
| REQ-006 | Shared-contract fixtures run the same backbone assertions for Deep Alignment and Deep Review with mode-specific configuration only |
| REQ-007 | Negative replay fixtures return explicit blocked/error results for unknown versions, sequence gaps, invalid authority material, stale re-probes, fingerprints, and projection mismatch |
| REQ-008 | Shadow fixtures compare legacy and typed projections by lane, coverage, verdict, artifact index, and status while preserving non-authority |
| REQ-009 | Verify-first fixtures require an authority-bound observation and live re-probe receipt before a detector candidate can become a blocking finding |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The plan consumes the typed event schema from `001-typed-ledger-schema`, the shared review-loop contract frozen in phase 009, the 013 write-set conflict graph, and the legacy Deep Alignment replay corpus. It also consumes the mode contract in `deep-alignment/SKILL.md:251-269` and `322-345`, including lane state, verify-first, known-deviation, read-only, convergence, and report invariants. `003-sealed-artifacts` is a downstream adjacency boundary for sealing and certification, not a dependency for defining the index.

The research inputs are the five-role Deep Alignment recommendation in `findings-registry.json:2770-2777`, the authority-validity, typed-rule, deviation, cross-epoch, applicability, proof-carrying, and receipt findings in `findings-registry-modes.json:3434-3659`, and the counterclaims requiring pinned authority, observable deviations, preserved raw facts, verifier provenance, and declared applicability in `findings-registry-modes.json:4667-4734`. The migration remains additive and dark. Legacy projections remain authoritative until the shared adapters, shadow parity, in-flight classification, and later staged cutover phases authorize a change.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase authors a planning contract and introduces no runtime authority or persisted projection migration. If a later implementation exposes a projection defect, disable the dark reducer path and continue serving the legacy projection; discard only the non-authoritative projection output. Any persisted projection-store change must be transactionally reversible by projection-version rollback and replay from the immutable ledger, never by deleting source events or raw observations. Authority rollback remains owned by the staged cutover phase.
<!-- /ANCHOR:rollback -->
