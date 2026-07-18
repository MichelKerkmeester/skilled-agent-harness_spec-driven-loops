---
title: "Implementation Plan: Selective-Classification Controller (Idea 5, step 3)"
description: "Build approach for the terminal-decision controller: the SelectiveControllerV1 pure function, the certificate-gated auto-route branch, the friction-budget replayable assertions, the held-out promotion-metric gate, and the typed route-gold fixtures — verified by deterministic offline replay with the shared scorer untouched. Design/planning only."
trigger_phrases:
  - "selective controller plan"
  - "certificate gated auto route build"
  - "friction budget assertions plan"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Selective-Classification Controller

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Artifact kind** | Design/specification of a pure decision component (no live code changes) |
| **Contract family** | `RouteRequestV1`, `RouteDecisionV1`, `UncertaintyBudgetV1`, `CalibrationCertificate` (from `005/002`) |
| **Decision shape** | Closed four-action algebra `route \| clarify \| defer \| reject` (synthesis §2.3) |
| **Verification** | Deterministic offline route-gold replay via the existing compatibility projector; shared scorer `router-replay.cjs` never touched (synthesis §8.2) |
| **Blast radius** | Design-only, reversible; no registry/config/skill/scorer mutation |

### Overview

Specify `SelectiveControllerV1` as the terminal arbiter that consumes ranked candidates plus the upstream calibration certificate and emits exactly one `RouteDecisionV1`. The build is a **contract-first** effort: define the pure function, its certificate gate, its abstention ladder, its friction-budget assertions, and its held-out promotion metrics — then encode the whole thing as typed route-gold fixtures that replay deterministically. Auto-route is unavailable unless a per-slice certificate validates; abstention is bounded by one shared uncertainty budget; the threshold value is never chosen here, only the gate a value must pass (synthesis §5, §8.1, §11 Q2).

## 2. QUALITY GATES

### Definition of Ready
- [ ] `spec.md` REQ-001..REQ-010 are stable and scope is frozen.
- [ ] Upstream handles exist as contracts: `005/001` corpus shape, `005/002` certificate schema, `002` algebra, `004` budget.
- [ ] The four friction bounds and seven promotion metrics are enumerated and unambiguous.

### Definition of Done
- [ ] `SelectiveControllerV1` contract fully specified (inputs, output, purity, ladder).
- [ ] Certificate gate specified: absent/stale/mismatch ⇒ auto-route structurally unavailable.
- [ ] Friction budget written as four replayable assertions.
- [ ] Seven promotion metrics defined with counting rule + corpus slice; threshold-ships-only-from-held-out-evidence stated.
- [ ] Typed route-gold fixture families authored (projector-mapped); scorer untouched.
- [ ] Migration gate named (Stage 3 satisfied; Stage 4 certificate published).
- [ ] `validate.sh --strict` clean after sibling metadata backfill.

## 3. ARCHITECTURE

### Pattern

Pure functional decision core with an explicit **selective-classification** posture: predict (auto-route) only inside a certified risk budget; otherwise abstain into a bounded negotiation (`clarify`) or a typed non-route (`defer`/`reject`). The controller owns *no* authority — it produces a decision that a destination VERIFY→COMMIT later consumes (synthesis §2.3, §10). It is the concrete head of recovery-ladder rung 2 (synthesis §4).

### Key Components

- **`SelectiveControllerV1` (pure function)**: `(RouteRequestV1, RankedCandidates, CalibrationCertificateHandle, UncertaintyBudgetV1) → RouteDecisionV1`. Deterministic, side-effect-free, referentially transparent.
- **Certificate gate**: validates the certificate's identity against the request's pinned policy tuple and the target risk slice; on any failure the auto-route branch is removed from the reachable action set (not defaulted through).
- **Abstention ladder**: certified auto-route → one typed `clarify` (≤3 options + `none_of_these`, one accepted-answer rescore) → bounded rescore → `defer`/`reject`. Draws from a single `UncertaintyBudgetV1{ userTurns: 1 }` (synthesis §4 Seam B).
- **Friction-budget assertion set**: four invariants (1 turn; ≤3 options + `none_of_these`; ≤2 attempts; ≤256-token card) evaluated in the offline replay lane.
- **Promotion-metric evaluator (spec)**: defines coverage, selectiveRisk, optionRecall, clarificationResolution, cancel/decline, added-turns, card size over the `005/001` held-out corpus.

### Data Flow

```
RouteRequestV1 (pinned generation)
  + RankedCandidates (rank = EVIDENCE, not authority)          [synthesis §2.3]
  + CalibrationCertificateHandle (per policy/risk slice)       [from 005/002]
  + UncertaintyBudgetV1 { userTurns: 1 }                       [from 004]
        |
        v
 SelectiveControllerV1  (pure)
        |
   certificate valid & risk within budget? ──yes──► route { basis: signal }
        | no
   one answer discriminates to a legal route? ──yes──► clarify (≤3 + none_of_these, ≤256 tok)
        | no
   bounded rescore on pinned tuple (read-only, visible)
        |
        └──► defer { typed reason } | reject { typed reason }   (authority WITHHELD)
```

Every non-`route` branch is target-free and authority-withheld (synthesis §2.3). Zero-signal never unions the registry — it yields a typed `defer` (synthesis §10, "no over-emission").

## FIX ADDENDUM: AFFECTED SURFACES

Design-only phase; no runtime surface is mutated. The table records the *contract* surfaces the specification must stay consistent with, and how consistency is verified by reading (not editing).

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `RouteDecisionV1` 4-action algebra (`002`) | The closed decision shape the controller emits | Consume unchanged | Cross-read `../../002-decision-evaluator/` spec; controller adds no new top-level action |
| `UncertaintyBudgetV1` (`004`) | The single shared clarify/handoff budget | Draw from, do not redefine | Cross-read `../../004-recovery-ladder/`; controller references `userTurns: 1`, adds no second budget |
| `CalibrationCertificate` (`005/002`) | Per-slice rank→risk validation artifact | Consume by handle | Cross-read `../002-*`; controller never recomputes calibration, only validates identity |
| Held-out corpus (`005/001`) | Promotion-metric measurement substrate | Measure against | Cross-read `../001-*`; metrics defined over its slices only |
| `router-replay.cjs` (shared scorer) | Deterministic route-gold gate | **Not a consumer — never edited** | Confirm no fixture requires a scorer change; a required edit = migration failure (synthesis §8.2, §10) |
| Compatibility projector (`002`/`006`) | Maps typed decisions → legacy intent/resource shape | Reuse | Author fixtures that project cleanly; positive routes → intents/resources, `clarify\|defer\|reject` → empty-intent convention |

## 4. IMPLEMENTATION PHASES

### Phase 1: Contract definition
- [ ] Write the `SelectiveControllerV1` signature and field provenance table.
- [ ] State purity, determinism, and the "no field grants authority" invariant (synthesis §2.3, §10).
- [ ] Fix the reachable action set and the target-free/authority-withheld rule for non-`route` branches.

### Phase 2: Certificate gate + abstention ladder
- [ ] Specify certificate identity validation against the pinned policy tuple + risk slice.
- [ ] Specify the `absent | stale | mismatch ⇒ auto-route unavailable` fall-through to `clarify`/`defer` (never silent `bounded-default`) (synthesis §8.1).
- [ ] Encode the terminal ladder (rung 2 auto-route → rung 3 clarify → rescore → defer/reject) drawing from the single budget (synthesis §4).
- [ ] Specify the bounded, read-only, visible-before-run rescore (synthesis §2.3 `degraded-fallback` discipline).

### Phase 3: Friction budget + promotion metrics
- [ ] Write the four friction assertions (1 turn; ≤3 + `none_of_these`; ≤2 attempts; ≤256-token card) as replay-checkable predicates.
- [ ] Define the seven promotion metrics (coverage, selectiveRisk, optionRecall, clarificationResolution, cancel/decline, added-turns, card size) with counting rule + corpus slice.
- [ ] State the promotion rule: threshold ships only from `005/001` held-out risk/coverage evidence, never a fleet-wide constant (synthesis §8.1, §11 Q2, §12).

### Phase 4: Fixtures + degeneracy + advisor read
- [ ] Author `TypedRouteGoldV1` controller fixture families: certified auto-route; certificate-absent fallback to clarify; one-turn clarify with `none_of_these`; budget-exhaustion → defer; forbidden auto-route on stale certificate → reject; N=1 zero-threshold path; stale/absent advisor parity.
- [ ] Assert every fixture projects through the existing compatibility projector with the scorer untouched (synthesis §8.2).
- [ ] Specify the N=1 constant-fold (no calibration/threshold call at `mcp-code-mode`) and the advisor evidence-only read (synthesis §5.1, §8.1).

### Phase 5: Verification + gate closeout
- [ ] Confirm Stage 3 gate language (deterministic typed replay, projector parity, gold never auto-updates).
- [ ] Confirm the Stage 4 certificate hand-off is specified for `006/*`.
- [ ] Run `validate.sh --strict` after sibling metadata backfill.

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract review | `SelectiveControllerV1` signature, purity, authority invariants | Spec self-check + cross-read of `002`/`004`/`005-002` |
| Deterministic replay | Controller decisions → compatibility projector → route-gold | Existing `route-gold` lane (scorer read-only, never edited) |
| Assertion checks | Four friction bounds fire on offline fixtures | Replay-lane assertions (design-specified) |
| Metric definition audit | Seven promotion metrics counted over held-out slices | Manual definition review against `005/001` corpus shape |
| Degeneracy check | N=1 emits no calibration/threshold call | Fixture: singular manifest, zero rank-call assertion (synthesis §5.1, §8.2) |

> All "tests" here are design-level: fixtures and assertions are *authored*, not executed against live routing. No production route is exercised.

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `005/001` held-out corpus | Internal (sibling) | Contract | Promotion metrics cannot be measured; threshold cannot be certified |
| `005/002` rank-vs-calibrated certificate | Internal (sibling) | Contract | Auto-route branch has no gate; controller reduces to clarify/defer only |
| `002` decision evaluator + algebra | Internal (upstream) | Contract | No `RouteDecisionV1` shape to emit |
| `004` recovery ladder + `UncertaintyBudgetV1` | Internal (upstream) | Contract | No shared budget to draw from |
| Compatibility projector + route-gold | Internal (shared) | Stable | Cannot verify deterministic replay parity |

## 7. ROLLBACK PLAN

- **Trigger**: Design contradiction with the synthesis or an upstream sibling contract (logic-sync), or a fixture that can only pass by editing the shared scorer.
- **Procedure**: This phase writes only three docs into its own folder. Rollback is deletion/revert of `spec.md`, `plan.md`, `tasks.md` in `005-calibration/003-selective-controller/` — no live artifact is touched, so there is nothing else to unwind.
- **Reversibility note (design invariant carried into build)**: the eventual controller activation is a fenced CAS with the prior generation retained; a rollback swaps to the byte-identical prior manifest and cannot undo an already-COMMITted external effect — post-effect recovery is destination-owned (synthesis §9, §10).

## L2: PHASE DEPENDENCIES

```
Phase 1 (Contract) ──► Phase 2 (Certificate gate + ladder) ──► Phase 4 (Fixtures) ──► Phase 5 (Verify)
                                      ▲                             ▲
Phase 3 (Friction budget + metrics) ─┘─────────────────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Contract | spec frozen | 2, 3 |
| 2 Certificate gate + ladder | 1 | 4 |
| 3 Friction budget + metrics | 1 | 4 |
| 4 Fixtures + degeneracy | 2, 3 | 5 |
| 5 Verify + gate closeout | 4 | none |

## L2: ENHANCED ROLLBACK

### Pre-authoring checklist
- [ ] Confirmed upstream sibling contracts are read, not assumed.
- [ ] Confirmed no fixture forces a scorer edit.
- [ ] Confirmed no numeric threshold value is being fixed in this phase.

### Rollback procedure
1. Revert the three authored docs in this folder.
2. Re-run parent metadata backfill so the phase folder returns to its prior state.
3. No live routing config, registry, scorer, or skill was modified — no further reversal required.
