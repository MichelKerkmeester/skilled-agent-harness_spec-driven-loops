---
title: "Feature Specification: Deep Review - Reducers & Projections (013 phase 002)"
description: "Plan the pure deterministic reducers and live projections for the Deep Review migration: replay the typed event ledger into iteration/convergence state, an artifact index, and per-mode status while preserving factored finding evidence and the shared review-loop contract used by Deep Alignment."
trigger_phrases:
  - "Deep Review reducers and projections"
  - "deep-review typed event ledger fold"
  - "deep-review projection migration"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/002-reducers-and-projections"
    last_updated_at: "2026-07-15T20:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Established the pure-fold projection scope for Deep Review"
    next_safe_action: "Map typed ledger events to the three live projection families"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep Review - Reducers & Projections

> Phase adjacency under the 002-deep-review parent (grouping order, not a runtime dependency): predecessor `001-typed-ledger-schema`; successor `003-sealed-artifacts`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/002-reducers-and-projections |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (Deep Review mode migration) |
| **Origin** | Phase 002 of the 013 per-mode migration program; reducers and projections concern |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The current Deep Review loop moves from scope through per-dimension passes, emits P0/P1/P2 findings, tests convergence, and writes `review-report` state. That state is not yet defined as a deterministic projection of the typed event ledger. Without an explicit fold, replay can depend on mutable in-memory structures, event arrival timing, repeated scans, or presentation labels that hide the underlying evidence.

This phase plans the reducers that consume the typed event log defined by `001-typed-ledger-schema` and produce the live Deep Review projections: iteration and convergence state, an artifact index, and per-mode status. The fold is pure and side-effect free. An identical ordered event sequence must produce the same semantic projection and projection fingerprint on every replay. P0/P1/P2 remain the review-facing impact projection; factored evidence, confidence, reachability, evidence kind, and lifecycle remain the durable source state.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A typed event-to-state mapping for Deep Review events emitted by the predecessor ledger schema; this phase consumes that schema and does not redefine it.
- A pure reducer contract with explicit initial state, event application rules, schema-version handling, duplicate and sequence-gap behavior, canonical ordering, and a deterministic projection fingerprint.
- The iteration/convergence projection: scope identity, review dimensions, pass coverage, candidate and finding lifecycle, unresolved obligations, convergence eligibility, terminal outcome, and replay position.
- The artifact index projection: immutable references to reports, raw findings, challenge attempts, proof receipts, suppression records, and verification outputs, keyed by stable logical identity and content digest.
- The per-mode status projection: Deep Review lifecycle state, active contract versions, last applied sequence, projection health, blocking obligations, shadow-parity state, and terminal status.
- A derived presentation projection that computes P0/P1/P2 from factored finding fields without discarding raw evidence or treating repeated agreement as proof.
- Differential replay fixtures and a shadow-parity plan that compare the new projections with the legacy Deep Review state without changing authority.
- Reuse of the shared review-loop contract frozen in phase 009 and structural parity with Deep Alignment mode 008; no local fork of scope, pass, convergence, or report semantics.

### Out of Scope
- Defining or changing the typed event envelope, transition authorization, event namespace, or schema owned by `001-typed-ledger-schema` and the shared substrate.
- Creating sealed artifacts, artifact signatures, or sealed-artifact certificates owned by `003-sealed-artifacts`.
- Implementing reviewer producers, deterministic analyzers, challenge executors, proof verifiers, or report writers; this phase defines how their events reduce.
- Authority cutover, legacy-writer retirement, in-flight state migration, or final mode promotion.
- The six sibling concerns and the mode gate; they integrate through the shared contracts and write-set plan rather than expanding this reducer scope.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The Deep Review reducer is a pure fold over the predecessor's typed event sequence | The reducer has no clock, randomness, filesystem, network, logging, or mutable singleton input; the same ordered events yield the same projection and fingerprint |
| REQ-002 | Iteration and convergence state is replayable and coverage-aware | Scope, dimensions, pass outcomes, finding lifecycle, required obligations, terminal decision, and last-applied sequence are reconstructed from events; convergence cannot pass while required cells or blocking evidence remain unresolved |
| REQ-003 | The artifact index preserves immutable evidence references | Each indexed artifact records stable logical identity, artifact kind, producer event, reviewed SHA or input identity where applicable, content digest, availability, and supersession lineage without mutating the original evidence |
| REQ-004 | Per-mode status is derived from typed transitions and projection health | Deep Review status, contract versions, replay position, blocking reason, shadow-parity state, and terminal status are deterministic and reject impossible transitions rather than guessing a status |
| REQ-005 | P0/P1/P2 is a derived presentation projection | Impact is retained separately from confidence, reachability, exploitability, evidence strength, evidence scope, and lifecycle; a weighted aggregate cannot override hard schema, build, security, or regression vetoes |
| REQ-006 | Shared review-loop semantics are reused by Deep Alignment | Deep Review and Deep Alignment consume the phase-009 shared contract with mode configuration and typed event mappings, not two divergent reducer implementations |
| REQ-007 | Replay incompatibility fails closed | Unknown event versions, missing sequence links, invalid fingerprints, impossible transitions, and projection-version mismatches produce an explicit blocked/error result with no partial-success claim |
| REQ-008 | The migration can prove parity before authority changes | A shadow replay compares projection fields, terminal decisions, coverage, artifact references, and status transitions against the legacy path on frozen fixtures; discrepancies remain observable and non-authoritative |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The phase plan defines a pure Deep Review fold whose identical typed event sequence produces an identical semantic projection and fingerprint.
- **SC-002**: The iteration/convergence, artifact index, per-mode status, and derived P0/P1/P2 projections have explicit ownership, inputs, invariants, and failure behavior.
- **SC-003**: Deep Review consumes the shared phase-009 review-loop contract and demonstrates reducer-shape parity with Deep Alignment without copying a mode-specific fork.
- **SC-004**: Replay fixtures cover normal completion, unresolved coverage, duplicate events, late evidence, invalid transitions, schema mismatch, and projection drift; all invalid cases fail closed.
- **SC-005**: Shadow parity is measurable against the legacy Deep Review path while the ledger remains additive, dark, and non-authoritative.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The phase inherits the 065 program risks: live in-flight state, additive-dark migration, replay compatibility, shared write-set ownership, and staged authority cutover. Phase-specific risks are that event order or object serialization leaks into state, duplicate or late evidence changes terminal status, the artifact index accidentally mutates immutable evidence, P0/P1/P2 becomes a hidden source of truth, or Deep Review diverges from Deep Alignment's shared loop contract.

The reducer consumes the typed ledger contract from `001-typed-ledger-schema`, the shared review-loop contract frozen in phase 009, the write-set conflict graph from the 013 parent, and the legacy Deep Review replay fixtures. `003-sealed-artifacts` supplies the later sealing boundary but is an adjacency reference, not a runtime dependency of this planning contract. No authority cutover is permitted from this phase.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which event fields are the canonical stable identity for a finding when a symbol, normalized context, program slice, or rename mapping changes across revisions?
- Does the shared contract represent an out-of-order event as a blocked replay, a deterministic buffer request, or a ledger-level invalid sequence before the reducer is called?
- Which artifact availability states are sufficient for a live index, and which missing proof or challenge artifacts must block convergence rather than merely mark the report incomplete?
- Which legacy projection fields are protected behavior contracts for shadow parity, and which are known defects that the typed projection should intentionally correct?

These questions are planning inputs for the shared contract and implementation phases; none authorizes a local Deep Review fork or a best-effort fallback.
<!-- /ANCHOR:questions -->
