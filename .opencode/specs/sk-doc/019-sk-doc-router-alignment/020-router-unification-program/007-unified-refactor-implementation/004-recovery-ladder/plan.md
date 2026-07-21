---
title: "Implementation Plan: Recovery Ladder — Ordered Ladder on One Shared Uncertainty Budget"
description: "Build approach for the recovery plane: the six-rung ordered ladder, the single shared UncertaintyBudgetV1 { userTurns: 1 }, the guard predicates for clarify/handoff, and the typed route-gold fixtures produced through the phase-002 compatibility projector. Planning/design only; the shared scorer is never touched."
trigger_phrases:
  - "recovery ladder build approach"
  - "shared uncertainty budget implementation"
  - "clarify handoff ladder fixtures"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Recovery Ladder

**Implementation status**: Correctness-remediated inside this phase folder. Local deterministic replay,
budget-finiteness, authority-withholding, bypass, and protected-byte checks pass; route-gold status
is intentionally `shadow-partial` until per-hub activation exercises real hub scenarios.

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Artifact family** | `RouteDecisionV1` (from phase 000/002) + `UncertaintyBudgetV1` (this phase's focus, defined in phase 000) |
| **Language/Stack** | TypeScript contract types + deterministic offline fixtures (matches the repo's route-gold lane) |
| **Storage** | None at runtime; typed route-gold fixtures on disk, replayed offline |
| **Testing** | Deterministic route-gold replay via the phase-002 compatibility projector; the shared scorer `router-replay.cjs` is never edited (synthesis §8.2) |
| **Blast radius** | Low, reversible — planning/design only; no live routing config, registry, scorer, or skill is modified |

### Overview

Implement the recovery plane as the **ordered negative-branch behavior** of the phase-002 evaluator, not as a new decision shape. The evaluator already emits the closed four-action algebra `route | clarify | defer | reject` with the authority-withheld invariant (synthesis §2.3). This phase adds (a) the fixed rung order that decides *which* negative branch fires and in what sequence, (b) the single shared `UncertaintyBudgetV1 { userTurns: 1 }` that clarify and handoff both draw from, and (c) the guard predicates that admit each rung. Everything is expressed as typed fixtures that replay deterministically; a scorer edit to make them pass is a migration failure, not licence (synthesis §8.2, §10).

The approach follows the synthesis's "recommended first slice" discipline (synthesis §9): build the base shape correct with `overlay = null` and no calibration, prove it in shadow with zero live authority, and leave the certificate-gated auto-route inert until phase 005 ships it.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Upstream present: phase 000 `UncertaintyBudgetV1` + phase 002 evaluator/compatibility projector.
- [x] Seam B closure understood: clarify and handoff share ONE budget (no independent budgets).

### Definition of Done
- [x] All ladder fixtures replay deterministically; route-gold stays byte-green with the scorer untouched.
- [x] Budget-finiteness proven: ≤1 user turn across clarify+handoff, `H=1`, no visited-set revisit.
- [x] No negative decision (`clarify | defer | reject`) carries a target or authority.
- [x] Confident-route fixtures invoke zero ladder rungs (bypass measured, not assumed).
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The recovery plane is the **ordered negative-branch behavior** of the phase-002 evaluator, not a new decision shape. It adds three things over the closed four-action algebra: (a) the fixed six-rung order that decides which negative branch fires and in what sequence, (b) the single shared `UncertaintyBudgetV1 { userTurns: 1 }` that clarify (rung 3) and handoff (rung 4) both draw from — so recovery is provably finite — and (c) the guard predicates that admit each rung. A handed-off destination returning `NEEDS_INPUT` does not reopen a user turn. Everything is expressed as typed route-gold fixtures produced through the phase-002 compatibility projector; the shared scorer `router-replay.cjs` is a read-only fixed dependency.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### 2.1 Design the shared budget contract seam (rungs 3 + 4 share one budget)

`UncertaintyBudgetV1` is defined structurally in phase 000; this phase pins its *semantics* on the ladder:

- One budget instance per request: `{ userTurns: 1 }` (synthesis §2.1, §4 Seam-B row).
- Rung 3 (clarify) consuming the single user turn makes rung 4 (handoff) unreachable on that request, and vice-versa — the ladder short-circuits once the budget is spent.
- A handed-off destination returning `NEEDS_INPUT` does **not** reopen a user turn — the downstream `NEEDS_INPUT` terminates the recovery, it does not allocate a new turn (synthesis §4 Seam-B row). This is the property that makes recovery provably finite and is the single most load-bearing seam decision in the phase.

Key contract touch-points (read-only against phase 000/002 outputs; no edits here):
- `RouteDecisionV1.clarify { question, budget, alternatives, authority: Withheld }`
- `RouteDecisionV1.defer { reason, recovery, authority: Withheld }`
- `RouteDecisionV1.reject { reason, authority: Withheld }`

### 2.2 Specify the six rungs and their guard predicates

Encode the fixed order and the admit-condition for each rung (synthesis §4, lines 133-141):

1. **Eligibility + authority gate (pre-ranking).** Evaluated before any rank/score call. Negative outcome withholds authority. Kills "packet path = capability" at the gate (synthesis §2.2, §2.3).
2. **Route / calibrated auto-route.** Deterministic exact route always allowed. Calibrated auto-route allowed **only** when a phase-005 risk certificate is pinned to this policy/risk slice; absent it, rank/margin are evidence and the ladder falls through (synthesis §4 step 2, §8.1). This phase encodes only the "no certificate ⇒ no auto-route" fall-through; it does not build the certificate.
3. **One typed clarify.** Admit predicate: exactly one answer discriminates to a legal local route. Shape: ≤3 options + `none_of_these`, exactly one accepted-answer rescore (synthesis §4 step 3). If no single answer discriminates, the ladder does NOT clarify — it falls to defer.
4. **One bounded handoff.** Admit predicate: a distinct viable candidate is already named (via `defer(handoff-required)`) AND policy permits the hop. Visited-set guarded; single hop `H=1`. Acceptance transfers ownership, not completion (synthesis §3 Idea 4, §4 step 4).
5. **Typed defer.** Recoverable missing evidence/dependency; reason from the fixed enum; no default/fallback union (synthesis §2.3, §10).
6. **Reject.** Invalid/forbidden requests; target-free and authority-free (synthesis §2.3).

### 2.3 Author the typed route-gold fixtures via the compatibility projector

Fixtures are produced through the **phase-002 compatibility projector** only (synthesis §8.2) — positive routes → intents/resources; `clarify | defer | reject` → the existing empty-intent convention. The shared scorer is never touched. Fixture families this phase owns (synthesis §8.2 minimum-fixture list):

- one-turn clarification (rung 3 discriminating case);
- non-discriminating ambiguity → defer (rung 3 negative → rung 5);
- zero-signal idle defer with **no default union** (rung 5);
- forbidden rejection (rung 6);
- direct route with forbidden handoff artifacts (rung 2 exact route emits no recovery artifacts);
- handoff visited-set / budget-exceeded rejection (rung 4 guards);
- handoff ownership-transfer + downstream `NEEDS_INPUT` terminates without new turn (REQ-007);
- role-escalation + missing-authority-dependency defer (rung 1/5 boundary).

### 2.4 Prove the bypass and the finiteness properties

- Confident-route fixtures assert **zero** ladder-rung invocation (SC-004) — the bypass is measured, not assumed.
- Budget fixtures assert no request consumes >1 user turn across clarify+handoff, no handoff exceeds `H=1`, and no visited destination is revisited (SC-002).
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | How | Evidence |
|-------|-----|----------|
| Deterministic replay | Replay all ladder fixtures through the phase-002 compatibility projector; identical inputs → byte-identical outputs | Route-gold stays byte-green; no scorer edit (synthesis §8.2, §10) |
| Budget finiteness | Assert every fixture's user-turn ledger ≤ 1 across clarify+handoff; handoff hop count ≤ 1; visited-set never revisited | SC-002 fixtures pass |
| Authority-withheld | Assert every `clarify | defer | reject` fixture has empty `targets` and no authority field | SC-003 fixtures pass |
| Bypass | Assert confident-route fixtures invoke zero rungs | SC-004 fixtures pass |
| Scorer untouched | `router-replay.cjs` hash compared before/after | Hash-identical (REQ-010) |
| Spec-kit validation | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` | Exit 0 on the planning docs |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 000 `UncertaintyBudgetV1` + phase 002 evaluator/projector must exist first | Ladder cannot be fixture-verified without them | Sequence 004 after 000/002; read-only against their outputs |
| Dependency | Phase 005 risk certificate | Rung 2 auto-route stays inert until 005 ships | Encode the "no certificate ⇒ no auto-route" fall-through now; keep auto-route unreachable until 005 (synthesis §11 open-q 2) |
| Risk | Fixture drift widening scope into the scorer | High — would break the hard constraint | Route all fixtures through the compatibility projector; treat any required scorer edit as a migration failure (synthesis §8.2) |
| Risk | A negative branch leaking a target/authority | High — smuggles a destination through a fallback field | Assert authority-withheld on every negative fixture (SC-003); §9 hard gate blocks activation |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Stage.** Ships behind the fenced CAS activation selector with the prior generation retained; requests pin one policy generation (synthesis §9, §10).
- **Migration gate.** Must satisfy **Stage 3 — Shadow evaluate** (deterministic typed replay + route-gold-matching projection, gold never auto-updated) before phase 005 activates (see `spec.md` MIGRATION GATE).
- **Rollback.** Swap to the byte-identical prior manifest. The ladder commits no external effect (authority is destination-local), so ladder rollback is byte-exact; there is no external COMMIT to unwind here (synthesis §9, §10).
<!-- /ANCHOR:rollback -->

## RELATED DOCUMENTS

- **Specification**: `spec.md`
- **Task breakdown**: `tasks.md`
- **Source design**: `../../006-unified-refactor-research/unified-refactor-synthesis.md` (§2.1, §2.3, §3, §4, §8.2, §9, §10)
- **Master plan**: `../spec.md`
