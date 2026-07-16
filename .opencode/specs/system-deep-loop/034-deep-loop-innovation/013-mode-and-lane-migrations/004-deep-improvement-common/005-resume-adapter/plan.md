---
title: "Implementation Plan: Deep Improvement Common Services - Resume Adapter"
description: "Implementation plan for the sealed-ledger resume adapter, continuity-ladder reducers, idempotent re-entry contract, and shared evaluator, canary, and guarded-promotion services in deep-improvement common."
trigger_phrases:
  - "deep improvement resume adapter implementation plan"
  - "sealed ledger resume implementation plan"
  - "deep improvement common services re-entry"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/005-resume-adapter"
    last_updated_at: "2026-07-15T20:40:00Z"
    last_updated_by: "opencode"
    recent_action: "Outlined sealed-ledger reducers and shared service boundaries"
    next_safe_action: "Freeze the continuity ladder and resume decision matrix"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep Improvement Common Services - Resume Adapter

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / deep-improvement common services (013/004/005) |
| **Change class** | Logic and deterministic state reconstruction |
| **Execution** | Additive dark implementation on a pinned BASE; no authority cutover |

### Overview
Implement one common Resume Adapter between the sealed typed event ledger and the deep-improvement evaluator-first loop. The
adapter reads validated events, applies the frozen reducer set, maps the result to the continuity ladder, and returns a typed
re-entry decision without using mutable checkpoints or replaying effects. The same boundary owns the shared evaluator, canary,
and guarded-promotion service contracts consumed by the three benchmark variants. Raw observations, score revisions, canary
receipts, and promotion evidence remain immutable inputs; live projections are rebuilt views.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The parent phase-013 shared interfaces and write-set conflict graph are frozen and available to this implementation.
- [ ] The typed event, upcaster, ledger, reducer, receipt, and certificate contracts identify the sealed read boundary.
- [ ] The continuity ladder names every deep-improvement common state from run start through terminal or blocked outcome.
- [ ] The per-operation decision algebra and stable logical/idempotency identities are specified before adapter code lands.
- [ ] Evaluator, canary, and promotion service ownership is explicit; variants consume adapters rather than copy the services.
- [ ] Crash, duplicate, effect-ambiguous, schema-drift, and changed-manifest fixtures are enumerated.

### Definition of Done
- [ ] A sealed-ledger fold reconstructs identical common service state and continuity fingerprints across repeated runs.
- [ ] Resume re-entry is idempotent and preserves branch-local successes without replaying side effects.
- [ ] Shared evaluator, canary, and guarded-promotion contracts pass their variant-consumer matrix.
- [ ] Shadow-mode verification proves no live authority or legacy behavior changes.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- The sealed read boundary selects a ledger seal, event range, schema/upcaster registry identity, reducer-set identity, and referenced artifact digests; it returns a read context with a stable replay fingerprint.
- Deterministic reducers fold validated effective events into separate projections for run/lineage, candidates, evaluator observations, scores, canaries, promotion evidence, and terminal state. Reducers never append events or invoke effects.
- The continuity mapper turns those projections into a ladder level and typed re-entry decision. It distinguishes exact reuse, compatible missing-work re-execution, effect compensation or query, and rejection.
- The idempotency gate binds the resume request key to the original manifest digest, sealed ledger fingerprint, target ladder level, and requested operation. An exact duplicate returns its prior receipt; a conflicting reuse fails closed.
- The evaluator service owns the versioned evaluator capsule, fixture and calibration identities, raw observations, normalized score revisions, uncertainty, and evidence sufficiency. It does not own candidate generation or variant-specific task semantics.
- The canary service owns sealed epochs, candidate aliasing, contamination/leak detection, cross-domain and adversarial checks, and immutable canary receipts. It does not reveal canary content to candidate generation.
- The guarded-promotion service owns the evidence lattice and typed decision. It keeps target repair, baseline-pass preservation, known failures, environment-policy freshness, and canary health as independent inputs; it does not flip runtime authority.
- Variant adapters for `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark` provide mode payloads and consume the common result types. They may not bypass the Resume Adapter or write shared projections.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the phase-015 interface and conflict-graph handoff, the typed ledger/reducer contracts, and the `004-certificates-and-receipts` navigation contract without treating sibling ordering as a new runtime dependency.
- Inventory the deep-improvement common event types, sealed artifacts, receipts, evaluator inputs, and existing interruption points; record the source-to-projection matrix.
- Freeze the continuity ladder, supported state transitions, replay-fingerprint inputs, and fixture corpus before implementing re-entry.

### Phase 2: Implementation
- Add the sealed-ledger read context and deterministic fold boundary, including event-version handling, reducer identity, seal verification, and stable state fingerprints.
- Implement the continuity-ladder mapper and per-operation decision algebra for reuse, reexecute, compensate, reject, and explicit unknown states.
- Implement the idempotent resume request and re-entry receipt contract with stable logical effect IDs, attempt IDs, exact duplicate handling, and conflicting-key rejection.
- Implement common evaluator projections and service interfaces for capsules, raw observations, score revisions, uncertainty, and insufficient evidence.
- Implement common canary projections and service interfaces for sealed epochs, aliases, cross-domain health, leak vetoes, and immutable receipts.
- Implement common promotion projections and service interfaces for the evidence lattice, guarded decisions, quarantine, and shadow-only application state.
- Add variant adapters and a consumer matrix proving all three benchmark variants use the shared contracts without copying or widening their authority.

### Phase 3: Verification
- Fold the same sealed ledger repeatedly and compare state, projection, and resume fingerprints byte-for-byte.
- Inject interruption at every ledger-read, reducer, receipt, evaluator, canary, and promotion boundary; verify branch-local reuse and explicit incomplete-effect handling.
- Replay duplicate requests, duplicate events, changed payloads under an existing key, changed manifests, reducer drift, evaluator drift, and unsupported versions; verify typed refusal or exact receipt reuse.
- Verify evaluator, canary, and promotion gates preserve `UNKNOWN`, `INSUFFICIENT_EVIDENCE`, and `INCONCLUSIVE` instead of promoting them to pass.
- Run the three-variant consumer matrix and the dark-authority regression proving legacy behavior and live control flow remain unchanged.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 / REQ-002 | Deterministic full-fold fixtures compare repeated projections, raw observation retention, event order, reducer identity, and replay fingerprints |
| REQ-003 / REQ-005 | A continuity-ladder matrix covers every in-flight level and asserts one allowed re-entry decision or a fail-closed result |
| REQ-004 | Mixed-version and sealed-range fixtures reject unknown types, broken upcasters, reducer drift, artifact drift, and fingerprint mismatch before re-entry |
| REQ-006 / REQ-007 | Idempotency tests cover exact duplicates, conflicting payloads, crash-after-apply, crash-before-receipt, branch-local completion, and unknown external effects |
| REQ-008 | Evaluator fixtures replay raw observations with fixed capsule and calibration digests, then verify score revisions retain prior evidence and uncertainty |
| REQ-009 | Canary fixtures cover epoch sealing, aliasing, leak veto, cross-domain regression, missing evidence, and rotated-epoch invalidation |
| REQ-010 | Promotion fixtures require the independent evidence lattice and keep target score, known failure, policy freshness, canary veto, and insufficient evidence visible |
| REQ-011 | Consumer contract tests compile one adapter per benchmark variant against the same common service interfaces and reject duplicated shared writes |
| REQ-012 | Shadow-mode integration compares legacy state, control flow, and visible results before and after resume while asserting no authority transition |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The implementation consumes the parent program's additive-dark migration rule, the phase-012 shared mode contracts and conflict
graph, the typed ledger and reducer contracts, and the common receipts/certificates contract. It hands its frozen common service
interfaces and resume behavior to `006-shadow-parity`, then to the three benchmark variant migrations. The planning child keeps
`depends_on: []`; the parent phase gate supplies runtime sequencing and prevents a local interpretation from becoming a hidden
dependency or a second shared contract.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Implementation lands in path-scoped commits that can be reverted without editing or deleting sealed ledger records. Disable the
shadow Resume Adapter and common-service consumers first, then revert their adapters before reverting the provider modules. Keep
the ledger, raw evaluator observations, canary epochs, and promotion evidence readable through the prior readers. If a bad reducer
or service contract has already produced shadow projections, discard only the derived projections and replay from the last valid
seal; never repair history by mutation and never allow a shadow promotion result to alter legacy authority.
<!-- /ANCHOR:rollback -->
