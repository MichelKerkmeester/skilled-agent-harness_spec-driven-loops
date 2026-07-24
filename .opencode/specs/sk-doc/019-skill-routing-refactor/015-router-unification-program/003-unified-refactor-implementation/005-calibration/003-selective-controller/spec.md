---
title: "Feature Specification: Selective-Classification Controller (Idea 5, step 3)"
description: "The terminal-decision controller that unifies the router's four-action outcome under a validated risk budget: auto-route only with a per-slice calibration certificate, else one typed clarify, else defer/reject after a bounded rescore. Enforces the friction budget as replayable assertions and defines the held-out promotion metrics that must clear before any score-to-risk threshold ships. Planning/design only."
trigger_phrases:
  - "selective classification controller"
  - "calibrated auto-route risk budget"
  - "terminal decision friction budget"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Selective-Classification Controller — Idea 5, Step 3

## EXECUTIVE SUMMARY

This phase builds the **selective-classification controller**: the single component that resolves the router's terminal decision. Given a `RouteRequestV1` pinned to one policy generation, an ordered candidate set with rank evidence, and the calibration certificate produced upstream (`005/002`), the controller emits exactly one `RouteDecisionV1` action — **auto-route under a validated risk budget, else one typed `clarify`, else `defer`/`reject` after a bounded rescore**. It is the concrete realization of Idea 5's calibrated-negotiation plane (synthesis §3, §5 row; recovery ladder rung 2 in synthesis §4) sitting on top of the pure evaluator (`002`) and the recovery ladder (`004`).

The controller is *selective* in the statistical sense: it may **abstain** rather than route when evidence does not clear the certified risk budget, trading coverage for a bounded selective risk. Abstention is not a dead end — it routes to the one-turn `clarify` rung (≤3 candidates + `none_of_these`) or to a typed `defer`/`reject`, all drawing from the single `UncertaintyBudgetV1` (synthesis §2.1, §4 Seam B). The load-bearing invariant, inherited verbatim from the synthesis, is that **`rankScore`/`scoreMargin` are evidence, never authority, and never a calibrated probability without a validation certificate** (synthesis §2.3). Auto-route therefore requires a certificate *tied to the specific policy/risk slice*, never a fleet-wide constant (synthesis §8.1, §11 Q2).

This is a design/planning artifact. It authors the controller contract, the friction-budget assertions, and the promotion-metric gate. It modifies **no live routing config, registry, scorer, or skill**.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Shadow-partial implementation; 17-row targeted validator green, strict validation run but blocked by packet-template drift and unavailable repository validator tooling |
| **Created** | 2026-07-18 |
| **Branch** | `005-calibration/003-selective-controller` |
| **Phase** | 5 (calibration), child 003 of 3 |
| **Depends on** | `005/001` (held-out corpus), `005/002` (rank-vs-calibrated contract), `002` (evaluator + 4-action algebra), `004` (recovery ladder + shared budget) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The evaluator (`002`) can already emit the closed four-action algebra, and the recovery ladder (`004`) already orders `clarify → handoff → defer/reject` on one budget. What is still missing is the **terminal arbiter** that decides *which* action fires for a given request — specifically the boundary between "confident enough to auto-route" and "must negotiate or abstain." Left undefined, that boundary defaults to one of two failure modes the synthesis explicitly forbids: (a) treating an uncalibrated rank margin as if it were a probability and auto-routing on it (synthesis §2.3, §6 "Advisor rank as calibrated probability" eliminated), or (b) shipping a single fleet-wide confidence constant that is right for no hub and no risk slice (synthesis §11 Q2, §12 — threshold values "intentionally unclaimed"). Both silently convert a *recommendation* into a *capability*, which violates the destination-local authority rule (synthesis §10).

### Purpose

Ship a controller whose auto-route branch is *gated on a per-slice calibration certificate* and whose abstention paths are *bounded by a replayable friction budget*, so that the terminal decision is deterministic, reversible, and provably honest about its own uncertainty — and whose threshold is only ever promoted from held-out risk/coverage evidence, never from a hand-picked constant.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The `SelectiveControllerV1` contract: input (`RouteRequestV1`, ranked candidates + rank evidence, the `005/002` certificate handle, `UncertaintyBudgetV1`), output (one `RouteDecisionV1`), and the pure decision function that maps between them.
- The **terminal decision algebra** wiring: `route{basis: signal}` when the certified risk budget is satisfied; `route{basis: bounded-default}` only in the explicitly certified low-`T` corner; one typed `clarify` when a single answer can discriminate to a legal local route; `defer`/`reject` after a bounded rescore (synthesis §2.3, §4 rungs 2–3, 5–6).
- The **friction budget as replayable assertions**: 1 user turn, ≤3 candidate options plus `none_of_these`, ≤2 attempts, and a ≤256-token decision card — each expressed as an assertion checkable in the offline replay lane.
- The **promotion-metric definitions** measured on the held-out corpus (`005/001`) *before* any score-to-risk threshold is allowed to ship: coverage, selectiveRisk, optionRecall, clarificationResolution, cancel/decline rate, added-turns, and card size.
- The **certificate-consumption rule**: the controller reads a per-(policy, risk-slice) certificate; absent/stale/mismatched certificate ⇒ auto-route is structurally unavailable and the controller falls to `clarify`/`defer` (never a silent bounded-default) (synthesis §8.1).
- Typed route-gold fixture families for the controller's decisions, mapped through the existing compatibility projector (synthesis §8.2) — authored here, executed by `002`'s replay lane.

### Out of Scope

- Building the held-out corpus itself — owned by `005/001`.
- Defining the rank-vs-calibrated statistical contract (isotonic/Platt/binned reliability, certificate schema) — owned by `005/002`; this phase *consumes* its certificate handle.
- The `clarify`↔`handoff` rung mechanics and the `UncertaintyBudgetV1` shape — owned by `004`; this phase *draws from* the budget, it does not redefine it.
- Any live threshold *value* — no numeric threshold is chosen here; only the gate that a value must pass.
- Editing the shared benchmark scorer `router-replay.cjs`, or any live routing config, registry, or skill (hard constraint, synthesis §10).
- The offline learning overlay (`007`) and per-hub activation (`006`).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `005-calibration/003-selective-controller/spec.md` | Create | This specification |
| `005-calibration/003-selective-controller/plan.md` | Create | Build approach, contracts touched, verification |
| `005-calibration/003-selective-controller/tasks.md` | Create | Ordered, checkable task list |

> Design-only phase. No source, config, registry, scorer, or skill file is in scope. The contracts named below (`SelectiveControllerV1`, the assertion set, the metric set) are *authored as specification*, not implemented against the live tree.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Specify `SelectiveControllerV1` as a pure function `(RouteRequestV1, RankedCandidates, CalibrationCertificateHandle, UncertaintyBudgetV1) → RouteDecisionV1` with no side effects and no destination authority. | Spec defines every input field's provenance and the single output; states that the function is deterministic and referentially transparent; no field grants a capability (synthesis §2.3, §10). |
| REQ-002 | The auto-route branch MUST require a valid per-(policy, risk-slice) certificate; rank/margin alone can never trigger `route{basis: signal}`. | Spec states: certificate `absent \| stale \| identity-mismatch ⇒ auto-route unavailable`; controller falls to `clarify`/`defer`, never to a silent `bounded-default`. Cited to synthesis §2.3, §8.1. |
| REQ-003 | Encode the terminal ladder: certified auto-route → one typed `clarify` (≤3 options + `none_of_these`, one accepted-answer rescore) → `defer`/`reject` after rescore. Every non-`route` branch withholds authority and carries no target. | Spec reproduces the four-action algebra with the target-free/authority-withheld invariant; `clarify` names its discriminating question shape; `defer`/`reject` name typed reasons (synthesis §2.3, §4 rungs 2–3,5–6). |
| REQ-004 | Express the friction budget as **replayable assertions**: exactly 1 user turn; ≤3 candidate options + `none_of_these`; ≤2 attempts; ≤256-token decision card. | Spec lists each assertion with the exact bound and states it is checkable in the deterministic offline replay lane; a run exceeding any bound is a hard fixture failure, not a warning. |
| REQ-005 | Define the held-out promotion metrics that MUST be measured before any score-to-risk threshold ships: coverage, selectiveRisk, optionRecall, clarificationResolution, cancel/decline, added-turns, card size. | Spec defines each metric precisely (what is counted, over which corpus slice) and states the threshold is promoted only from `005/001` held-out risk/coverage evidence, never a fleet-wide constant (synthesis §8.1, §11 Q2, §12). |
| REQ-006 | Preserve deterministic offline route-gold replay and NEVER touch the shared scorer. | Spec authors `TypedRouteGoldV1` controller fixtures routed through the existing compatibility projector; explicitly states a required scorer edit is a migration failure, not a licence to edit `router-replay.cjs` (synthesis §8.2, §10). |
| REQ-007 | Authority stays destination-local and the phase is reversible + gated. | Spec states the controller's decision is a *proof/recommendation*, consumed only by a downstream destination VERIFY→COMMIT; activation is a fenced CAS with a retained prior generation; no over-emission (zero-signal ⇒ typed `defer`, no default union) (synthesis §2.3, §10). |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Specify the bounded **rescore** that precedes `defer`/`reject`: it is read-only, visible before it runs, non-cached, and names the evidence it re-reads. | Spec describes rescore as a single re-evaluation on the pinned policy tuple that cannot mint calibrated certainty; mirrors the `degraded-fallback` discipline (synthesis §2.3). |
| REQ-009 | Specify controller behavior under the N=1 degeneracy (`mcp-code-mode`): with one candidate there is nothing to calibrate, so the certified auto-route branch constant-folds away and the controller reduces to `signal`/`clarify`/`defer` with no threshold. | Spec states the controller calls no calibration/threshold machinery at N=1 and that a singular evaluation invoking ranking/threshold logic is a hard-block (synthesis §5.1, §9). |
| REQ-010 | Map controller decisions onto the advisor evidence contract: advisor rank is one evidence record, never probability; absent/stale advisor degrades to deterministic policy routing. | Spec states advisor `live`+identity-match may rank, `stale` annotates only, `absent` contributes zero evidence and the controller still decides on the compiled policy (synthesis §8.1). |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The `SelectiveControllerV1` contract is fully specified — inputs, output, purity, and the exact terminal ladder — such that an implementation agent could build it with no architectural guessing beyond the synthesis.
- **SC-002**: Every auto-route path in the spec is gated on a per-slice certificate; there is no spec path where a raw rank or margin produces `route{basis: signal}`.
- **SC-003**: The four friction-budget bounds (1 turn, ≤3+`none_of_these`, ≤2 attempts, ≤256-token card) are each written as an assertion that names how it is checked in offline replay.
- **SC-004**: All seven promotion metrics are defined with a counting rule and a corpus slice, and the spec states no threshold ships except from held-out `005/001` evidence.
- **SC-005**: The spec names its migration gate (see below), preserves route-gold determinism, and asserts the shared scorer is never edited.
- **SC-006**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` is clean once the phase's sibling metadata (`description.json`, `graph-metadata.json`) is backfilled by the parent orchestration.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `005/001` held-out corpus + `005/002` rank-vs-calibrated contract (certificate) | The controller cannot certify auto-route without them | The auto-route branch is gated on a per-(policy, risk-slice) certificate handle; absent/stale/mismatched ⇒ auto-route is structurally unavailable |
| Dependency | Phase 2 evaluator (four-action algebra) + Phase 4 recovery ladder (shared `UncertaintyBudgetV1`) | The controller sits on top of both | Consumed read-only; abstention routes into the one-turn `clarify` / typed `defer`/`reject` rungs on the single budget |
| Dependency | Shared benchmark scorer `router-replay.cjs` + route-gold | A required scorer edit would be a migration failure | Fixtures map through the existing compatibility projector; the scorer stays byte-identical [synthesis §8.2] |
| Risk | Auto-routing on an uncalibrated rank margin (rank-as-probability) | Converts a recommendation into a capability | Auto-route requires a validated per-slice certificate; `rankScore`/`scoreMargin` stay evidence, never a probability [synthesis §2.3, §6] |
| Risk | Shipping a fleet-wide confidence constant right for no hub/slice | Wrong-everywhere threshold | The threshold is promoted only from held-out risk/coverage metrics on the `005/001` corpus, never a hand-picked constant |
| Risk | Unbounded negotiation (friction) on uncertainty | Degraded UX / over-emission | The friction budget (1 user turn, ≤3 options + `none_of_these`, ≤2 attempts, ≤256-token card) is enforced as replayable assertions |
<!-- /ANCHOR:risks -->

## 6. MIGRATION GATE

This phase rides one shared gate from the master plan's **SHARED MIGRATION-GATE MODEL** (`../../spec.md`) and produces the evidence a later stage consumes:

- **Gate this phase must satisfy before the next activates — Stage 3 (Shadow evaluate):** *full typed replay deterministic; compatibility projection matches route-gold; mismatches classified; gold never auto-updates.* The controller is a decision-plane component, so its terminal decisions must replay deterministically through the compatibility projector and leave the existing route-gold green before anything downstream turns on. A controller decision that forces a scorer edit to pass is a **migration failure** (synthesis §8.2, §10).
- **Evidence this phase must publish for the downstream gate — Stage 4 (Per-hub canary, owned by `006/*`):** the per-(policy, risk-slice) **calibration certificate** (coverage/selectiveRisk on the `005/001` held-out corpus, contract from `005/002`). Stage 4 consumes this certificate to permit calibrated auto-route on a given hub; **no hub may activate calibrated auto-route without it, and no score-to-risk threshold ships as a fleet-wide constant** (synthesis §8.1, §11 Q2, §12).

**Non-negotiable constraints (apply to this and every phase):** deterministic offline route-gold replay preserved; NEVER touch the shared benchmark scorer (`router-replay.cjs`); authority stays destination-local (a proof/recommendation is never a capability); reversible + gated (fenced CAS activation, retained prior generation); no over-emission. This phase is planning/design only — it modifies no live routing config, registry, scorer, or skill.

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- The concrete per-slice score-to-risk threshold values are promoted from held-out metrics (coverage, selectiveRisk, optionRecall, clarificationResolution, added-turns, card size) on the real `005/001` corpus; the numeric thresholds are intentionally unclaimed here [synthesis §11 Q2, §12].
- Which calibration method (temperature scaling vs selective-classification threshold fitting, per the `005/002` envelope) actually validates per hub/risk slice is resolved when a real corpus is fit.
- The certified low-`T` corner in which `route{basis: bounded-default}` is permitted is defined structurally; its exact per-slice extent awaits held-out evidence.
<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- **Source design**: `../../../006-unified-refactor-research/unified-refactor-synthesis.md` — Idea 5 (§3, §5 table), recovery ladder rung 2 (§4), advisor certificate read (§8.1)
- **Master plan**: `../../spec.md` — phase map + shared migration-gate model
- **Sibling calibration phases**: `../001-*` (held-out corpus), `../002-*` (rank-vs-calibrated contract)
- **Upstream contracts**: `../../002-decision-evaluator/` (4-action algebra), `../../004-recovery-ladder/` (shared uncertainty budget)
- **Plan / Tasks**: `plan.md`, `tasks.md`
