---
title: "Feature Specification: Deep Alignment - Reducers & Projections"
description: "Plan the pure deterministic reducers and live projections for the Deep Alignment migration: replay the typed event ledger into lane, authority, artifact, finding, convergence, and per-mode status state while preserving verify-first evidence and the shared review-loop contract used by Deep Review."
trigger_phrases:
  - "Deep Alignment reducers and projections"
  - "deep-alignment typed event ledger fold"
  - "deep-alignment projection migration"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/002-reducers-and-projections"
    last_updated_at: "2026-07-23T20:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed and verified the additive-dark reducer and projection surface"
    next_safe_action: "Consume the closed projection surface from downstream migration leaves"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-alignment-reducers/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-alignment-reducers.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Causal input order, not stream-label order, defines cross-stream replay"
      - "Deep Alignment imports the shared review-loop backbone from Deep Review"
      - "Completed terminals recompute current blockers and require the latest run-stream convergence"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep Alignment - Reducers & Projections

> Phase adjacency under the 008-deep-alignment parent (grouping order, not a runtime dependency): predecessor `001-typed-ledger-schema`; successor `003-sealed-artifacts`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/002-reducers-and-projections |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (Deep Alignment mode migration) |
| **Origin** | Child 002 of the 008-deep-alignment migration under phase 013; reducers and projections concern |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The Deep Alignment loop resolves lanes as authority x artifact class x scope, discovers the covered artifacts, checks them against a named authority, re-verifies findings against live ground truth, evaluates coverage and stability, and emits one report per lane. Its current state machine and read-only contract are explicit, but the run state is not yet defined as a deterministic projection of the typed event ledger. Without an explicit fold, replay can depend on mutable adapter state, authority files changing during a run, event arrival timing, repeated scans, or report labels that hide the underlying observations.

This phase plans the pure reducers that consume the typed event log defined by `001-typed-ledger-schema` and produce the live Deep Alignment projections: lane iteration and convergence state, an immutable artifact and evidence index, and per-mode status. A derived per-lane verdict and worst-verdict rollup remain presentation projections over raw observations, applicability decisions, verify-first re-probes, and known-deviation adjudications. An identical ordered event sequence must always produce the same semantic projection and projection fingerprint. The reducer must preserve the mode's verify-first, known-deviation suppression, read-only-by-default, and gated-remediation invariants described by the checked-in alignment contract.

The research inputs sharpen this boundary. The shared findings registry requires the five-role separation of immutable target, adapter-owned discovery, blinded detector findings, authority-plus-reprobe severity, and post-audit remediation (`findings-registry.json:2770-2777`). The mode findings require authority validity before conformance, typed rule obligations, observable exception records, cross-epoch replay, applicability-first evaluation, proof-carrying findings, content-bound receipts, and explicit unresolved outcomes (`findings-registry-modes.json:3434-3659`, `4667-4734`). Those are projection invariants here; authority compilation, sealing, and artifact certification remain owned elsewhere.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A typed event-to-state mapping for Deep Alignment events emitted by the predecessor ledger schema; this phase consumes that schema and does not redefine the envelope or event union.
- A pure reducer contract with explicit initial state, event application rules, authority-epoch and verifier-version handling, duplicate and sequence-gap behavior, canonical ordering, and a deterministic projection fingerprint.
- The lane iteration/convergence projection: resolved authority, artifact class, scope identity, authority epoch, discovery coverage, applicability outcomes, per-rule/per-artifact checks, verify-first finding lifecycle, known-deviation overlays, unresolved obligations, convergence eligibility, terminal outcome, and replay position.
- The artifact and evidence index projection: immutable references to authority capsules or source revisions, discovered artifacts, observations, applicability decisions, re-probe receipts, known-deviation assertions, reports, and verification outputs, keyed by stable logical identity and content digest.
- The per-mode status projection: Deep Alignment lifecycle state, active contract and authority versions, lane count and lane statuses, last applied sequence, projection health, blocking obligations, shadow-parity state, and terminal status.
- A derived per-lane verdict and overall worst-verdict projection that preserves raw observations, `not_applicable`, `unresolved`, `SKIP`, and `EXEMPT` outcomes instead of collapsing them into pass or fail.
- Differential replay fixtures and a shadow-parity plan that compare the new projections with legacy Deep Alignment state without changing authority.
- Reuse of the shared review-loop contract frozen in phase 012 and structural parity with Deep Review mode 002; no local fork of scope, pass, convergence, or report semantics.

### Out of Scope
- Defining or changing the typed event envelope, transition authorization, event namespace, schema versions, or upcasters owned by `001-typed-ledger-schema` and the shared substrate.
- Creating sealed authority capsules, sealed evidence bundles, artifact signatures, or sealed-artifact certificates owned by `003-sealed-artifacts`.
- Implementing lane scoping, authority adapters, discovery, rule execution, live re-probes, remediation generation, or report writers; this phase defines how their events reduce.
- Authority cutover, legacy-writer retirement, in-flight state migration, rollback switches, or final mode promotion.
- The six sibling concerns and the mode gate; they integrate through shared contracts and the 013 write-set plan rather than expanding this reducer scope.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The Deep Alignment reducer is a pure fold over the predecessor's typed event sequence | The reducer has no clock, randomness, filesystem, network, logging, adapter lookup, or mutable singleton input; the same ordered events yield the same projection and fingerprint |
| REQ-002 | Lane iteration and convergence state is replayable and coverage-aware | Authority epoch, lane scope, applicability, rule/artifact coverage, check outcomes, finding lifecycle, known-deviation state, required obligations, terminal decision, and last-applied sequence are reconstructed; convergence cannot pass while required lanes, cells, authority validity, or blocking evidence remain unresolved |
| REQ-003 | The artifact and evidence index preserves immutable references | Each indexed item records stable logical identity, artifact kind, producer event, authority/verifier revision where applicable, content digest, applicability, availability, freshness, and supersession lineage without mutating original evidence |
| REQ-004 | Per-mode status is derived from typed transitions and projection health | Deep Alignment status, contract and authority versions, lane summary, replay position, blocking reason, shadow-parity state, and terminal status are deterministic and reject impossible transitions rather than guessing a status |
| REQ-005 | Per-lane verdicts and known deviations are derived overlays | Raw observations remain separate from applicability, finding, verifier, and deviation adjudication; a deviation produces an observable `SKIP` or `EXEMPT` result and never deletes the reproduced failure; `not_applicable` and `unresolved` cannot become pass by coercion |
| REQ-006 | Shared review-loop semantics are reused by Deep Review | Deep Alignment and Deep Review consume the phase-012 shared contract with mode configuration and typed event mappings, not two divergent reducer or convergence implementations |
| REQ-007 | Replay incompatibility fails closed | Unknown event or authority versions, missing sequence links, invalid fingerprints, expired or mixed authority material, impossible transitions, and projection-version mismatches produce an explicit blocked/error result with no partial-success claim |
| REQ-008 | The migration can prove parity before authority changes | A shadow replay compares lane projections, coverage, verdicts, artifact references, and status transitions against frozen legacy Deep Alignment fixtures; discrepancies remain observable and non-authoritative |
| REQ-009 | Verify-first evidence remains independently replayable | A finding cannot become blocking from detector output alone; the projection retains the authority snapshot, applicability decision, subject-bound observation, live re-probe receipt, verifier identity, and final adjudication as separate facts |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The phase plan defines a pure Deep Alignment fold whose identical typed event sequence produces an identical semantic projection and fingerprint.
- **SC-002**: The lane iteration/convergence, artifact and evidence index, per-mode status, and derived verdict projections have explicit ownership, inputs, invariants, and failure behavior.
- **SC-003**: Deep Alignment consumes the shared phase-012 review-loop contract and demonstrates reducer-shape parity with Deep Review without copying a mode-specific fork.
- **SC-004**: Replay fixtures cover normal multi-lane completion, unresolved applicability, `not_applicable`, known deviations, late re-probes, duplicate events, invalid authority material, schema mismatch, and projection drift; all invalid cases fail closed.
- **SC-005**: Shadow parity is measurable against the legacy Deep Alignment path while the ledger remains additive, dark, read-only, and non-authoritative.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The phase inherits the 036 program risks: live in-flight state, additive-dark migration, replay compatibility, shared write-set ownership, and staged authority cutover. Phase-specific risks are that authority or verifier changes leak into replay, event order or object serialization leaks into state, a broken discovery denominator reports perfect coverage, known deviations erase raw failures, `not_applicable` becomes pass, late re-probes change prior facts, the artifact index mutates immutable evidence, or Deep Alignment diverges from Deep Review's shared loop contract.

The reducer consumes the typed ledger contract from `001-typed-ledger-schema`, the shared review-loop contract frozen in phase 012, the write-set conflict graph from the 013 parent, and legacy Deep Alignment replay fixtures. `003-sealed-artifacts` supplies the later sealing boundary but is an adjacency reference, not a runtime dependency of this planning contract. The findings registries supply the five-role separation, authority-validity gate, applicability-first evaluation, observable deviation overlay, cross-epoch compatibility, and proof-carrying finding requirements. No authority cutover is permitted from this phase.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No implementation-blocking questions remain.

### Resolved decisions

- Lane, authority, subject, observation, candidate, finding, verification, proof,
  artifact, and run identities use their closed typed scope plus captured
  producer references; collisions or renames fail closed.
- The reducer preserves causal input order while enforcing independent
  contiguous sequence positions per stream. Missing positions return
  `rebuild_required` with `cursor-gap`.
- Authority validity, complete lane and applicability coverage, owned
  verification and adjudication chains, accepted P0/P1 findings, hard vetoes,
  and missing downstream assessments all participate in current blockers.
- Known deviations remain authority-, verifier-, finding-, and subject-bound
  overlays. They never delete the captured observation or verified finding.
- The complete canonical legacy comparison structure remains shadow-only and
  non-authoritative; later migration leaves own dual-path execution and cutover.
<!-- /ANCHOR:questions -->
