---
title: "Feature Specification: Cross-Mode Closures"
description: "Hoist recurring evidence, receipt, adjudication, budget, and projection behavior into reusable closures so all phase-013 mode migrations share one implementation while retaining explicit mode-owned policies and state reducers."
trigger_phrases:
  - "cross-mode closures"
  - "shared deep-loop mode closures"
  - "phase 012 closure modules"
  - "deep-loop shared behavior hoisting"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/002-cross-mode-closures"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Mapped recurring evidence, receipt, adjudication, budget, and projection behavior"
    next_safe_action: "Define closure ports, override seams, and parity fixtures before phase 013"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Cross-Mode Closures

> Phase adjacency under `012-shared-mode-contracts-and-fixtures` (grouping order, not a runtime dependency): predecessor `001-shared-mode-interfaces`; successor `003-mixed-version-fixtures`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/002-cross-mode-closures |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Phase 005 of the 009 shared-mode-contracts-and-fixtures parent |
| **Depends on** | `[]` in `manifest/phase-tree.json`; sibling contracts are navigation inputs |
| **Parent outcome** | Hoist cross-mode closures before the eight phase-013 migrations |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The phase-012 parent is the last shared gate before the eight phase-013 workstreams. Its parent spec requires the runtime to build the shared spine once and then give each mode a typed schema over it, while the phase-tree manifest explicitly assigns this child the cross-mode closure work. Without that hoisting, deep-research, deep-review, deep-ai-council, deep-improvement-common, agent-improvement, model-benchmark, skill-benchmark, and deep-alignment will each copy the same evidence, receipt, adjudication, budget, and projection behavior into separate migrations. The copied paths would drift in error handling, evidence shape, replay behavior, and write ownership.

The shipped `system-deep-loop` hub already exposes a useful boundary: `runtime/` owns shared executor configuration, prompt-pack rendering, validation, atomic state, coverage graph, and scoring, while each mode packet retains its own convergence math, state shape, artifacts, and permission policy (`.opencode/skills/system-deep-loop/README.md`). The existing runtime also contains partial seams that should be composed rather than duplicated: `runtime/lib/deep-loop/evidence-contract.ts`, `executor-audit.ts`, `post-dispatch-validate.ts`, `atomic-state.ts`, `continuity-thread.cjs`, and `permissions-gate.ts`; council-side dispatch, convergence, cost, and verdict helpers in `runtime/lib/council/`; and the non-discoverable synthesis seam at `shared/synthesis/resource-map.cjs`. The deep-improvement library similarly proves that sibling lanes can share typed errors, promotion gates, mirror checks, and profile resolution while intentionally retaining parser dialect differences (`deep-improvement/scripts/lib/README.md`).

The purpose of this phase is to turn those recurring responsibilities into one closure layer consumed by every mode migration. A closure receives the frozen `ModeContract` context from `001-shared-mode-interfaces`, calls the phase-007 service ports, emits the common evidence and receipt shape, and returns a typed result to the mode-owned reducer or policy. Mode-specific evidence fields, adjudication policy, budget estimates, projection fields, and convergence decisions remain explicit strategy inputs or override hooks. A closure override may specialize data or policy, but it may not bypass transition authorization, sealed reads, receipt ordering, budget admission, fencing, or additive-dark authority rules.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A manifest-derived closure catalog for all eight entries in `manifest/phase-tree.json` `mode_workstreams_phase_010`, showing one shared owner for each recurring behavior and the allowed mode override.
- A typed closure context carrying mode identity, interface version, lifecycle event, continuity identity, evidence references, service ports, budget scope, write set, legacy/shadow posture, and correlation identifiers.
- An evidence closure that normalizes claim class, scope, provenance, sealed-artifact references, raw mode evidence, and verification status without discarding mode-specific payloads.
- A receipt/effect closure that orders intent, execution, observed result, recovery, and boundary receipt emission through the phase-007 receipt and effect-recovery service; it must reuse the shipped executor-audit and post-dispatch evidence seams rather than issue parallel receipts.
- An adjudication closure that constructs blinded or counterfactual requests, invokes the phase-007 adjudication service, retains raw scores and probes, and returns the shared stable/unstable/inconclusive result without re-reducing it in each mode.
- A budget closure that performs typed admission, reservation, settlement, and exhaustion reporting through phase-007 hierarchical budgets while adapting current council cost guards and fan-out estimates as inputs.
- A projection closure that applies authorized events to deterministic stream-fold gauges and transactional mode projections, preserving raw events, replay provenance, and mode-owned reducer fields.
- Explicit adapter and override seams for deep-improvement-common plus its three variants, and for the shared review/alignment loop, without collapsing their domain-specific policies.
- Closure-level parity and bypass fixtures that phase `003-mixed-version-fixtures` and `004-write-set-conflict-graph` can consume when producing their own artifacts.
- Generated metadata exclusion: `description.json` and `graph-metadata.json` are not authored in this phase folder.

### Out of Scope
- Freezing or changing the `ModeContract` lifecycle and service-port types owned by `001-shared-mode-interfaces`.
- Implementing the phase-007 receipts, sealed artifacts, adjudication, budgets, gauges, locks/fencing, or continuity-identity services; this phase consumes those ports.
- Authoring the mixed-version corpus and old/new state fixtures owned by successor `003-mixed-version-fixtures`.
- Building the executable dependency and write-set conflict graph owned by sibling `004-write-set-conflict-graph`.
- Migrating any mode, removing legacy writers, changing authority, or selecting phase-014 cutover policy.
- Unifying parser dialects or mode-local convergence formulas where the shipped deep-improvement library documents intentional divergence.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The closure catalog covers every repeated cross-mode behavior | A manifest-derived matrix maps evidence, receipts/effects, adjudication, budgets, and projections to one shared owner and lists every mode consumer |
| REQ-002 | Evidence handling is one typed closure | The closure preserves raw mode evidence, attaches sealed references and provenance, validates the shared evidence contract, and emits the same verified/invalid outcome for equivalent inputs |
| REQ-003 | Receipt emission is one ordered closure | Boundary and effect receipts use the phase-007 intent/result/recovery contract, are idempotent, and cannot be emitted before authorized durable facts |
| REQ-004 | Adjudication calls use one bias-controlled closure | All consuming modes invoke blinded/counterfactual adjudication through one port, retain raw scores and probes, and consume the shared verdict without local re-reduction |
| REQ-005 | Budget checks use one typed admission closure | Council, fan-out, improvement, benchmark, review, and alignment calls reserve and settle through the hierarchical budget port; exhaustion or uncertain accounting denies work |
| REQ-006 | Projection updates use one deterministic closure | Authorized event application, stream-fold gauges, replay provenance, and transactional projection updates have one shared path while mode reducers own their declared fields |
| REQ-007 | Closure boundaries preserve mode ownership | Every mode-specific override names its input, output, policy owner, and invariants; no override can bypass authorization, evidence sealing, budget admission, receipt ordering, or fencing |
| REQ-008 | Shared implementations are reused by the complete phase-013 set | All eight manifest workstreams call the same closure implementations; deep-improvement-common runs once before its three variants, and deep-review/deep-alignment share only their declared loop behavior |
| REQ-009 | Existing runtime behavior remains additive-dark and parity-observable | Closure outputs can be compared with shipped council/deep-loop behavior, legacy projections remain authoritative, and closure failure cannot silently alter legacy results |
| REQ-010 | Closure behavior is deterministic and handoff-ready | Repeated calls with the same interface version, sealed inputs, service results, and mode strategy produce identical evidence, receipt, adjudication, budget, and projection outcomes with named fixtures for successors |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One closure catalog and implementation set covers evidence handling, receipt/effect emission, adjudication calls, typed budget checks, and projection updates for all eight phase-013 workstreams.
- **SC-002**: The shared closures preserve raw evidence, receipt ordering, blinded verdict evidence, budget exhaustion semantics, replay provenance, and additive-dark authority without mode-specific copies.
- **SC-003**: An override matrix proves mode-specific schemas and policies enter through typed seams; no mode can bypass the phase-006/004 safety ports.
- **SC-004**: `deep-improvement-common` is implemented once for agent-improvement, model-benchmark, and skill-benchmark, while intentional parser and policy differences remain explicit; deep-review and deep-alignment reuse only their common loop closures.
- **SC-005**: Closure parity and bypass fixtures produce deterministic pass, reject, or incomplete outcomes and are consumable by `003-mixed-version-fixtures` and `004-write-set-conflict-graph`.
- **SC-006**: Phase 013 receives a reusable closure package and adapter matrix without changing the frozen lifecycle contract or moving authority from the legacy path.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Over-generalized closure** — a shared helper may erase meaningful mode semantics. Mitigation: keep the closure responsible for evidence, side-effect, service, and projection mechanics; pass mode schemas, reducer ownership, adjudication policy, budget estimate, and stop policy as typed strategy inputs.
- **Repeated behavior survives under new names** — a mode can appear to use a closure while retaining a private receipt or budget path. Mitigation: require call-path inventory, one-owner rules, negative bypass fixtures, and write-set evidence before phase 013.
- **Receipt or effect duplication** — existing `executor-audit.ts`, `post-dispatch-validate.ts`, council JSONL, and legacy projections may emit overlapping facts. Mitigation: define a single closure emission order and preserve legacy records as adapters or parity observations, never as a second new authority.
- **Policy leakage across modes** — a common adjudicator or budget helper may decide a mode-owned transition. Mitigation: closures return typed service results; mode reducers and convergence policy remain the only owners of domain decisions.
- **Shared write races** — deep-improvement variants and review/alignment may touch common state. Mitigation: expose closure write sets to `004-write-set-conflict-graph`, use phase-007 locks/fencing, and keep serialization decisions outside the closure implementation.
- **Version drift** — closure inputs may evolve while phase 013 proceeds. Mitigation: bind each closure to the frozen phase-004 interface version and hand mixed-version behavior to `003-mixed-version-fixtures`.
- **Dependencies**: `001-shared-mode-interfaces/spec.md`, the phase-007 parent and child contracts under `007-shared-evidence-and-control-services/`, the parent `../spec.md`, `manifest/phase-tree.json`, and the shipped runtime sources under `.opencode/skills/system-deep-loop/runtime/` are contract inputs. `003-mixed-version-fixtures` and `004-write-set-conflict-graph` are sibling handoff consumers, not hard dependencies.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which concrete module boundary should hold the five closures: the shared `runtime/lib` layer, a mode-contract package, or a thin combination with deep-improvement common adapters?
- Which closure context fields are mandatory for every mode, and which remain optional mode strategy inputs without weakening evidence or replay guarantees?
- Which shipped legacy records become compatibility observations, and which are folded into the single new receipt/effect or projection emission path?
- Which adjudication and budget policy fields are mode overrides, and which must be fixed shared invariants to prevent a variant from bypassing fail-closed behavior?
- Which projection fields can be shared folds while preserving the mode-owned reducer and write-set declarations frozen by `001-shared-mode-interfaces`?

These decisions are resolved during closure implementation and fixture authoring. They do not authorize a mode migration, authority change, or generated metadata write in this Planned phase.
<!-- /ANCHOR:questions -->
