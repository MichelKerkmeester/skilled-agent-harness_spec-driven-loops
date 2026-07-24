---
title: "Feature Specification: Recovery Ladder — One Ordered Ladder on One Shared Uncertainty Budget"
description: "Implements Seam B of the unified router refactor: a single ordered recovery ladder (eligibility gate -> route/calibrated auto-route -> one typed clarify -> one bounded handoff -> typed defer -> reject) evaluated only for non-confident decisions, drawing clarify and handoff from ONE shared UncertaintyBudgetV1 { userTurns: 1 }. Handoff acceptance transfers ownership not completion; a handed-off destination returning NEEDS_INPUT does not reopen a user turn. Planning/design only: no live routing config, registry, scorer, or skill is modified."
trigger_phrases:
  - "recovery ladder phase"
  - "shared uncertainty budget clarify handoff"
  - "no wrong door handoff calibrated clarify"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Recovery Ladder — One Ordered Ladder on One Shared Uncertainty Budget

**Implementation status**: Correctness-remediated and phase-locally verified as `shadow-partial`. The approved
execution brief superseded this packet's planning-only delivery boundary while preserving its ban
on live routing, registry, scorer, and skill changes. Strict spec validation remains
orchestrator-owned and was not run here.

## EXECUTIVE SUMMARY

This phase builds the **recovery plane** of the unified router: the single ordered ladder that fuses "no-wrong-door handoff" (Idea 4) and "calibrated negotiation" (Idea 5) into two rungs of one ladder drawing from **one** `UncertaintyBudgetV1 { userTurns: 1 }` (synthesis §2.1, §4 Seam B). The design decision this phase implements is the council's closure of Seam B: independent clarify and handoff budgets permit duplicate user turns and unbounded recovery loops, so both rungs share a single budget and recovery becomes **provably finite** (synthesis §4, Seam B row; §6 "Independent clarify + handoff budgets" eliminated).

The ladder is not a second decision shape — it is the negative-branch behavior of the phase-002 evaluator, ordered. Its rungs emit the same closed four-action algebra (`route | clarify | defer | reject`) with the invariant that every non-`route` branch structurally **withholds authority** (synthesis §2.3). Confident routes never touch the ladder at all (synthesis §4, line "confident routes never touch the ladder"); the ladder exists only to make uncertainty terminate cleanly rather than escalate or over-emit.

Six rungs, fixed order: (1) eligibility + authority gate before ranking; (2) deterministic exact route, or a calibrated auto-route **only** with a validated risk certificate — and the certificate itself is produced by phase 005, so absent it, rank/margin remain evidence and cannot auto-route; (3) one typed `clarify` iff a single answer discriminates to a legal local route (≤3 options + `none_of_these`, exactly one rescore); (4) one bounded `handoff` iff a distinct viable candidate is already named and policy permits it (visited-set guarded, `H=1`); (5) typed `defer` for recoverable missing evidence/dependency; (6) `reject` for invalid/forbidden requests. Rungs 3 and 4 share the one budget. **This is planning/design only** — no live routing config, registry, scorer, or skill is modified.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Correctness-remediated and phase-locally verified (`shadow-partial`) — one ordered six-rung ladder on one shared `UncertaintyBudgetV1 { userTurns: 1 }`, proven via typed fixtures; no live routing/registry/scorer/skill change; repository-level strict validation reserved for the orchestrator |
| **Created** | 2026-07-18 |
| **Branch** | `004-recovery-ladder` |
| **Parent** | `../spec.md` (Unified Router Refactor — Phased Implementation Plan) |
| **Design source** | `../../006-unified-refactor-research/unified-refactor-synthesis.md` (§4 Seam B, §3 Ideas 4-5, §2.1) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## PROBLEM & PURPOSE

### Problem Statement

The synthesis named "two ways to handle uncertainty" as an open seam: Idea 4 (bounded handoff to a better destination) and Idea 5 (a calibrated one-turn clarification) each independently proposed a recovery mechanism with its own budget (synthesis §4, Seam B). Two independent budgets permit a single request to spend a clarification turn **and** a handoff turn — duplicate user interruptions and recovery loops — and let a negative outcome smuggle a destination through a fallback field. Without a single ordered ladder on one budget, recovery is neither finite nor authority-safe, and the router regresses toward over-emission (unioning candidates on uncertainty) — an explicitly eliminated alternative (synthesis §6, §10 "No over-emission").

### Purpose

Ship one ordered, budget-bounded recovery ladder such that every uncertain request terminates in a single user turn at most, every negative decision is target-free and authority-free, and confident routes bypass recovery entirely — with all behavior expressed as typed fixtures that replay deterministically against unchanged route-gold.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## SCOPE

### In Scope

- The single ordered recovery ladder specification: the six rungs, their fixed order, and the guard conditions that admit each rung (synthesis §4 Seam-B expanded ladder, lines 133-141).
- The one shared `UncertaintyBudgetV1 { userTurns: 1 }` contract semantics: clarify (rung 3) and handoff (rung 4) draw from the same budget; a handed-off destination returning `NEEDS_INPUT` does **not** reopen a user turn (synthesis §2.1, §4 Seam-B row).
- Rung 1 eligibility + authority gate placement **before** ranking, and the invariant that the gate's negative outcomes withhold authority (synthesis §4 ladder step 1; §2.3 authority-withheld invariant).
- Rung 2 route branch as it relates to recovery: deterministic exact route, and the *interface* to a calibrated auto-route that requires a phase-005 risk certificate (this phase defers the certificate itself and only encodes the "no certificate ⇒ no auto-route" fall-through) (synthesis §4 ladder step 2; §3 Idea 5 boundary; §8.1 "advisor rank alone is never probability").
- Rung 3 clarify semantics: discrimination-to-a-legal-local-route precondition, ≤3 options + `none_of_these`, exactly one accepted-answer rescore (synthesis §4 ladder step 3).
- Rung 4 handoff semantics: distinct-named-viable-candidate precondition, policy permission, visited-set guard, single hop `H=1`, and "acceptance transfers ownership, not completion" (synthesis §3 Idea 4; §4 ladder step 4; §9 hard-gate line).
- Rung 5 typed `defer` reasons and rung 6 `reject`, both target-free and authority-free, with **no** default/fallback union on zero signal (synthesis §2.3; §10 "No over-emission").
- Typed route-gold fixtures for the ladder, produced through the phase-002 compatibility projector only (synthesis §8.2). Fixture families this phase owns: one-turn clarification; zero-signal idle defer with no default union; forbidden rejection; direct route with forbidden handoff artifacts; handoff visited-set/budget-exceeded rejection; role-escalation + missing-authority-dependency defer.

### Out of Scope

- The risk certificate / held-out corpus / selective-classification controller — owned by phase 005 (`005-calibration`); this phase only defines the fall-through when no certificate is present. — [why: the synthesis parks calibration for lack of a corpus (synthesis §11 open-q 2); the master plan builds it as phase 005 (`spec.md` PHASE DOCUMENTATION MAP)].
- Destination-local PREPARE/VERIFY/COMMIT, receipts, idempotency, stale-proof rejection — owned by phase 003 (`003-execution-verify-commit`). — [why: authority is consumed at the destination, not in the ladder; the ladder only routes/defers/rejects (synthesis §2, Execution plane vs Recovery plane)].
- The pure evaluator and the closed four-action algebra definition itself — owned by phase 002 (`002-decision-evaluator`); this phase orders that evaluator's negative branches into a ladder. — [why: the ladder is behavior over the algebra, not a new algebra (synthesis §4 Seam A: "Idea 3 supplies the invariant … not a second enum")].
- The learning overlay (Idea 2) — owned by phase 007; offline, last, gated on a demonstrated routing gain. — [why: synthesis §12; at N=1 there is nothing to learn].
- Any edit to the shared benchmark scorer `router-replay.cjs`, live routing config, mode registries, hub routers, or skill files. — [why: hard constraint; a required scorer edit is a migration failure (synthesis §8.2, §10)].

### NON-NEGOTIABLE CONSTRAINTS (apply to every phase)

- **Deterministic offline route-gold replay preserved.** Ladder decisions map through the phase-002 compatibility projector into the existing `observedIntents`/`observedResources` shape; identical inputs replay to byte-identical outputs (synthesis §8.2, §10).
- **NEVER touch the shared benchmark scorer** (`router-replay.cjs`). A scorer edit required to make the ladder pass is a migration failure, not a licence to edit (synthesis §8.2).
- **Authority stays destination-local.** A proof or recommendation is evidence, never a capability; every ladder negative (clarify/defer/reject) withholds authority; handoff acceptance transfers ownership, not commit rights (synthesis §2.3, §3 Idea 4, §10).
- **Reversible + gated.** The ladder ships behind the fenced CAS activation selector with the prior generation retained; requests pin one policy generation (synthesis §9, §10).
- **No over-emission.** Zero signal ⇒ typed `defer` with no fallback/default union; the full registry is never unioned into scored routes (synthesis §6, §10).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `004-recovery-ladder/spec.md` | Create | This specification (planning artifact) |
| `004-recovery-ladder/plan.md` | Create | Build approach for the ladder + budget + fixtures |
| `004-recovery-ladder/tasks.md` | Create | Ordered, checkable task list |

> No live routing config, registry, scorer, or skill file is in scope. This phase is planning/design only; downstream implementation phases own the runtime edits behind their own gates.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | **(P0)** A single ordered recovery ladder of six rungs in fixed order — (1) eligibility+authority gate, (2) route/calibrated auto-route, (3) clarify, (4) handoff, (5) defer, (6) reject — evaluated ONLY for non-confident decisions (synthesis §4 lines 133-141). | Replay fixtures show: confident-route inputs invoke zero ladder rungs; ladder rungs are reachable only in declared order; no rung fires out of order. |
| REQ-002 | **(P0)** Clarify (rung 3) and handoff (rung 4) draw from ONE shared `UncertaintyBudgetV1 { userTurns: 1 }` (synthesis §2.1, §4 Seam-B row). | A fixture attempting clarify-then-handoff on one request is rejected/terminated because the single user turn is spent after the first; no fixture consumes >1 user turn across clarify+handoff combined. |
| REQ-003 | **(P0)** Rung 1 eligibility + authority gate runs BEFORE ranking; its negative outcomes withhold authority (synthesis §4 step 1; §2.3). | A forbidden/ineligible-request fixture is denied before any rank/score call; the emitted decision carries no target and no authority. |
| REQ-004 | **(P0)** Rung 2 emits a deterministic exact route, or a calibrated auto-route ONLY when a validated risk certificate (produced by phase 005) is pinned; absent the certificate, rank/margin are evidence and cannot auto-route (synthesis §4 step 2; §8.1). | A fixture with high rank but no pinned certificate falls through to clarify/defer (never auto-routes); an exact-route fixture emits no clarify/handoff artifacts. |
| REQ-005 | **(P0)** Rung 3 clarify fires IFF exactly one answer discriminates to a legal local route; question offers ≤3 options + `none_of_these`; exactly one accepted-answer rescore (synthesis §4 step 3). | A discriminating-ambiguity fixture emits one clarify with ≤3 options + `none_of_these` and exactly one rescore; a non-discriminating-ambiguity fixture does NOT clarify (it defers). |
| REQ-006 | **(P0)** Rung 4 handoff fires IFF a distinct viable candidate is already named AND policy permits; visited-set guarded; single hop `H=1`; only from `defer(handoff-required)` naming that candidate (synthesis §3 Idea 4; §4 step 4; §9). | Fixtures prove: a second hop is refused; a handoff revisiting a destination in the visited set is refused; a handoff without a pre-named viable candidate is refused. |
| REQ-007 | **(P0)** Handoff acceptance transfers ownership, not completion; a handed-off destination returning `NEEDS_INPUT` does NOT reopen the shared user-turn budget (synthesis §3 Idea 4; §4 Seam-B row). | A fixture shows accepted handoff records ownership transfer (not effect completion); downstream `NEEDS_INPUT` terminates without allocating a new user turn. |
| REQ-008 | **(P1)** Rung 5 typed `defer` for recoverable missing evidence/dependency, reason ∈ {idle, no-match, dependency-failure, handoff-required, stale-policy, evidence-unavailable}; NO default/fallback union emitted (synthesis §2.3; §10). | A zero-signal fixture yields `defer` with empty `targets` and no registry/default union; each defer reason is exercised by at least one fixture. |
| REQ-009 | **(P1)** Rung 6 `reject` for invalid/forbidden requests; structurally target-free and authority-free (synthesis §2.3). | A forbidden-request fixture yields `reject` with no target and no authority field populated. |
| REQ-010 | **(P0, cross-cutting)** No live routing artifact is modified; route-gold replay preserved; `router-replay.cjs` untouched; authority stays destination-local; the phase output is planning docs + typed fixtures via the compatibility projector only (synthesis §8.2, §10). | `git` diff for this phase touches only `004-recovery-ladder/**` planning docs and (downstream) typed fixtures; `router-replay.cjs` is hash-identical; a required scorer edit is logged as a migration failure, not applied. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## SUCCESS CRITERIA

- **SC-001**: All ladder fixtures replay deterministically, and the phase-002 compatibility projector maps every `clarify | defer | reject` to route-gold's existing empty-intent convention while route-gold stays byte-green (satisfies the Stage 3 shared gate; synthesis §8.2).
- **SC-002**: Budget-finiteness is proven — no fixture consumes more than one user turn across clarify + handoff combined, no handoff exceeds `H=1`, and no handoff revisits a destination in the visited set (synthesis §4 Seam-B row; §9 hard-gate line).
- **SC-003**: No negative decision (`clarify | defer | reject`) carries a target or authority in any fixture (synthesis §2.3 authority-withheld invariant).
- **SC-004**: Confident-route fixtures demonstrate zero ladder-rung invocation — the bypass is proven, not assumed (synthesis §4 line "confident routes never touch the ladder").
- **SC-005**: Zero live routing artifact modified and `router-replay.cjs` unchanged (hash-identical); this phase's outputs are planning docs plus typed fixtures only (synthesis §10).
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 2 evaluator + closed four-action algebra + compatibility projector | The ladder is behavior over that algebra; it cannot type or replay decisions without it | Consumed read-only; the ladder orders the evaluator's negative branches and rides the same Stage 3 gate |
| Dependency | Phase 5 risk certificate (calibration) for rung-2 auto-route | Without it, calibrated auto-route must stay inert | This phase encodes only the "no certificate ⇒ no auto-route" fall-through; rank/margin stay evidence |
| Dependency | Shared benchmark scorer `router-replay.cjs` + frozen route-gold | A required scorer edit would be a migration failure | Ladder decisions map through the compatibility projector only; the scorer stays hash-identical [synthesis §8.2] |
| Risk | Independent clarify + handoff budgets permitting duplicate user turns / unbounded loops | Recovery would not be provably finite | One shared `UncertaintyBudgetV1 { userTurns: 1 }`; a second hop or a visited-set revisit is refused (`H=1`) |
| Risk | Over-emission (unioning candidates on uncertainty) | Regresses toward a full-registry union on zero signal | Zero signal ⇒ typed `defer` with no default/fallback union; every negative branch is target-free and authority-free |
<!-- /ANCHOR:risks -->

## MIGRATION GATE

**Shared gate this phase must satisfy before the next phase activates:** **Stage 3 — Shadow evaluate** from the master plan's SHARED MIGRATION-GATE MODEL (`../spec.md`): *"full typed replay deterministic; compatibility projection matches route-gold; gold never auto-updates."*

The recovery ladder is the negative-branch behavior of the phase-002 evaluator, so its `clarify | defer | reject` decisions ride the **same** Stage 3 shadow-evaluate gate that phase 002 owns. The master plan's stage-ownership column enumerates Stage 3 under phases 002 and 006 and does not list phase 004 explicitly; this phase inherits Stage 3 because it extends — rather than replaces — the evaluated algebra. It must satisfy Stage 3 (deterministic typed replay + route-gold-matching projection, gold never auto-updated) before phase 005 (`005-calibration`) may activate its calibrated auto-route path, since rung 2's certificate-gated auto-route is inert until 005 ships and must not be reachable before it is proven.

In addition, this phase contributes three **hard gates** to the shared activation model that hard-block activation of any downstream phase if violated (synthesis §9): (a) a handoff revisiting a destination or exceeding the shared budget; (b) an exact route emitting clarification/handoff artifacts; (c) a negative decision carrying a target/authority. Each is a fenced-CAS activation blocker, reversible by swapping to the byte-identical prior generation; rollback cannot undo an external COMMITted effect, but the ladder itself commits no external effect (authority is destination-local), so ladder rollback is byte-exact.

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Rung 2's calibrated auto-route depends on a validated risk certificate produced by Phase 5 (`005-calibration`); the certificate's held-out corpus and selective-classification threshold are open-question 2 and are not decided here — this phase only encodes the certificate-absent fall-through [synthesis §11 open-q 2].
- The exact `clarify` option-ranking heuristic (which ≤3 options to surface when several discriminate) is left to the evaluator's ranking evidence; this phase fixes only the cardinality and the single-rescore rule.
- Whether an additional `defer` reason is needed once downstream destinations report richer `NEEDS_INPUT` causes; the current reason vocabulary is fixed here and revisited only if a real destination need appears.
<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- **Build approach**: `plan.md`
- **Task breakdown**: `tasks.md`
- **Source design (single source of truth)**: `../../006-unified-refactor-research/unified-refactor-synthesis.md` (§2.1, §2.3, §3 Ideas 4-5, §4 Seam B, §8.1-8.2, §9, §10)
- **Master plan (phase map + shared gate model)**: `../spec.md`
- **Upstream evaluator**: `../002-decision-evaluator/` (the algebra + compatibility projector this ladder rides)
- **Downstream calibration**: `../005-calibration/` (the risk certificate rung 2 defers to)
