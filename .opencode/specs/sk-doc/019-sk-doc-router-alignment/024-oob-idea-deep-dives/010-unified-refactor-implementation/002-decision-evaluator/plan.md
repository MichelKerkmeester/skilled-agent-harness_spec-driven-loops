---
title: "Implementation Plan: Decision Evaluator — Closed 4-Action Route Algebra"
description: "Build approach for the pure offline evaluator that maps RouteRequestV1 + CompiledPolicyV1 into RouteDecisionV1: the decision-type module and its structural guards, the branch selectors, the compatibility projector into the existing observedIntents/observedResources shape, and the typed route-gold fixtures — all verified by deterministic offline replay against a byte-unchanged shared scorer."
trigger_phrases:
  - "decision evaluator build plan"
  - "route algebra implementation approach"
  - "compatibility projector route-gold"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Decision Evaluator — Closed 4-Action Route Algebra

## APPROACH

Build the decision plane **type-first, then evaluator, then projector, then fixtures** — because the whole value of this phase is that the dangerous states are unrepresentable, and that guarantee lives in the type/guard layer, not in runtime checks (synthesis §2.3, §4 seam A). The evaluator is a pure total function; every capability, effect, and budget belongs to a sibling phase. The benchmark seam is treated as an inviolable boundary: the shared scorer `router-replay.cjs` is a fixed dependency the projector adapts *to*, never a file this phase edits (synthesis §8.2, §6).

The sequence is deliberately staged so each step is independently replayable and the Stage 3 shadow-evaluate gate can be exercised the moment the projector exists. Legacy stays serving-authoritative; the evaluator runs with zero live authority throughout (master plan shared-gate model; synthesis §9 stage 3). This is planning/design only — no live routing config, registry, scorer, or skill is modified.

## BUILD SEQUENCE

1. **Pin the consumed contracts.** Import `RouteRequestV1`, `CompiledPolicyV1`, and the `Target`/identity types from Phase 0 (`../000-contract-schemas/`) and the compiled artifact + projections from Phase 1 (`../001-compiler-n1-shadow/`). Confirm the request's `pinnedActivationGeneration` and the policy's `effectivePolicyHash` are both present and comparable (synthesis §2.1).

2. **Define `RouteDecisionV1` as a closed discriminated union.** Model `route | clarify | defer | reject` with `selectionKind` as an interior field of `route` only. Encode the negatives so they *cannot* carry `targets` or a non-`Withheld` authority — make the flat six-value enum and top-level `selectionKind` unrepresentable at the type level (synthesis §2.3, §4 seam A, §6). Encode the reason vocabularies: `defer.reason ∈ {idle, no-match, dependency-failure, handoff-required, stale-policy, evidence-unavailable}`; `route.basis ∈ {signal, bounded-default, degraded-fallback}`.

3. **Write the structural guards** (a parse/validate layer over the union) that reject: a target on any negative branch; an authority value outside the per-branch allow-set; a `route` with empty targets or with clarify/handoff artifacts; a target whose identity tuple is absent from `CompiledPolicyV1.destinations[]`; an `evidence`-role target that could COMMIT; a `surfaceBundle` that is not exactly one `actor` + N `evidence`; a `degraded-fallback` that is unnamed, mutating, or cached (synthesis §2.2, §2.3, §7).

4. **Implement `evaluate(request, policy)` as a pure total function** with an explicit branch order that mirrors the recovery ladder's *decision* boundary only (synthesis §4): generation/authority admission first → deterministic exact route → typed `clarify` when one answer discriminates to a legal local route → typed `defer(handoff-required)` when a distinct viable candidate is already named → typed `defer` for recoverable missing evidence/dependency → `reject` for invalid/forbidden. Confident routes never emit recovery artifacts. Ranking/bundle selection reads only compiled `selectors[]`/`compositionRules[]`; at `candidateCount = 1` those collections are empty and the machinery is never entered (synthesis §5.1).

5. **Enforce rank-as-evidence and generation pinning.** `rankScore`/`scoreMargin` flow through as evidence and can never flip a negative into a `route` or act as a probability (calibration is Phase 5) (synthesis §2.3, §3 idea 5). A `pinnedActivationGeneration` mismatch, or a request observing mixed generations, resolves to `defer(stale-policy)`/`reject`, never a route (synthesis §9).

6. **Build the compatibility projector** `projectToRouteGold(decision) -> {observedIntents, observedResources}`: positive routes → intents/resources; `clarify|defer|reject` → the existing empty-intent convention; typed leaf pairs → the current manifest-aware resource observations (synthesis §8.2). The projector is the *only* bridge to the scorer; `router-replay.cjs` and the existing gold rows are read-only inputs.

7. **Author the typed route-gold fixture families** (synthesis §8.2): exact single route; ordered + surface bundles; zero-signal idle `defer` with no default union; one-turn clarification; forbidden rejection; direct route with **no** recovery artifacts; singular omission + zero rank-call assertion; stale/mixed-generation refusal. Each fixture is a `RouteRequestV1` + expected `RouteDecisionV1` + expected projection.

8. **Wire the shadow-evaluate replay harness.** Run every fixture through `evaluate()` → `projectToRouteGold()` → the existing scorer, compare against frozen gold, and emit a **classified mismatch report** without ever writing back to the gold (synthesis §9 stage 3). This is the Stage 3 gate artifact.

## KEY FILES & CONTRACTS

| Artifact | Role | Mutation |
|----------|------|----------|
| `RouteDecisionV1` decision-type module | The closed 4-action union + `selectionKind` interior shape | Create (this phase) |
| Structural guard layer | Makes dangerous states unrepresentable | Create |
| `evaluate(request, policy)` | Pure total evaluator | Create |
| `projectToRouteGold(decision)` compatibility projector | Bridge typed decisions → `observedIntents`/`observedResources` | Create |
| Typed route-gold fixtures | Deterministic replay inputs (all families) | Create |
| Shadow-evaluate replay harness + mismatch report | Stage 3 gate evidence | Create |
| `RouteRequestV1`, `CompiledPolicyV1`, `Target` | Consumed contracts | Read-only (Phase 0/1) |
| `router-replay.cjs` (shared scorer) | Fixed dependency the projector adapts to | **NEVER edited — a required edit is a migration failure** |
| Existing route-gold rows | Frozen comparison baseline | Read-only; never auto-updated |

## VERIFICATION

- **Purity + determinism:** static scan for I/O/clock/RNG imports; N-run cross-process replay yields byte-identical decisions (SC-001).
- **Unrepresentability:** negative-with-target, negative-with-authority, top-level `selectionKind`, and route-with-recovery-artifact fixtures all fail the type/guard, not a runtime assert (SC-002).
- **Scorer untouched:** `git diff --exit-code router-replay.cjs` is empty; the existing route-gold gate stays green with the projector in place (SC-003).
- **Stage 3 gate:** deterministic typed replay; projection matches gold; mismatches classified; gold untouched (SC-004).
- **N=1 degeneracy:** the `mcp-code-mode` fixture asserts zero rank/bundle/handoff calls and `defer(no-match)` on zero signal (SC-005).

## ROLLBACK

The evaluator holds no authority and mutates nothing, so rollback is disabling the shadow lane — the prior serving behavior is restored exactly, with no external effect to undo (synthesis §9; master plan shared-gate model).

## CROSS-REFERENCES
- **Specification**: `spec.md`
- **Tasks**: `tasks.md`
- **Source design**: `../../009-unified-refactor-research/unified-refactor-synthesis.md`
