---
title: "Feature Specification: Deep-Dive — Calibrated One-Turn Routing Negotiation"
description: "Five-iteration SOL xhigh-fast deep-research lineage on modeling the zero-signal branch as a calibrated one-turn negotiation: always expose rankScore and scoreMargin, expose estimatedError only when a versioned held-out corpus validates calibration, frame the whole thing as selective classification (auto-route under a validated risk budget, else one typed clarification, else defer/reject), and enforce a measurable friction budget (one turn, at most three candidates plus none_of_these, at most two attempts, a 256-token card) whose thresholds are promotable only from held-out risk/coverage evidence."
trigger_phrases:
  - "calibrated routing negotiation deep dive"
  - "selective classification routing"
  - "rank score vs estimated error"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Deep-Dive: Calibrated One-Turn Routing Negotiation

## EXECUTIVE SUMMARY

Iteration 5 of `sol-oob` found the advisor's `confidence` is a bounded ranking heuristic, not a probability of correctness — so the route contract must separate an always-present `rankScore`/`scoreMargin` from an optional `estimatedError` that is legal only when a versioned held-out corpus validates it. Selective classification supplies the outer architecture. This lineage designs that calibrated contract and its friction budget.

## 3. RESEARCH CONTEXT

Seed evidence (do NOT re-derive): `../../021-default-mode-policy-research/research/lineages/sol-oob/iterations/iteration-005.md` (includes the proposed decision/interaction JSON schema + friction budget) and lineage `research.md` §11(6). Sources already gathered: Guo et al. (calibration), Geifman & El-Yaniv (selective classification), MCP elicitation, `fusion.ts` confidence/uncertainty formulas.

### Idea-specific agenda (deepen, do not survey)
1. **Score vs probability.** Formalize `rankScore` + `scoreMargin` always present; `estimatedError` present only when `calibration.status=validated` names a corpus, method, policy hash, and window.
2. **Selective-classification controller.** Auto-route under a validated risk budget; otherwise one typed clarification; otherwise defer or reject after rescoring.
3. **Friction budget.** One clarification turn, one schema property, at most three candidates plus `none_of_these`, at most two route attempts, 256-token card — as replayable engineering caps, not claimed optima.
4. **Promotion evidence.** The held-out metrics that must be measured before any score-to-risk threshold ships: coverage, selectiveRisk, optionRecall, clarificationResolution, cancel/decline, added turns, card size.
5. **Archetype unification.** How the controller unifies named-default / defer-routed / detection-routed hubs *only at the terminal action boundary*, without erasing their distinct evidence/capability/authority contracts.

### MANDATORY cross-cutting evaluation (every iteration MUST address all three)

Beyond the idea-specific agenda, each iteration must explicitly evaluate this idea along three separated dimensions:

1. **System skill advisor integration** — how the idea interacts with, depends on, or changes the Layer-0 advisor (`system-skill-advisor`): its recommendation, scoring/fusion, mode projections, and calibration/telemetry. State what the advisor must expose or consume for the idea to work, and what degrades if the advisor is absent or stale.
2. **Benchmark integration** — how the idea interacts with the deterministic route-gold / skill-benchmark machinery: replay determinism, typed gold, the offline oracle, and drift guards. State the new fixtures or scorer contracts it needs and whether it preserves byte-identical deterministic replay.
3. **Standalone effectiveness on documents alone** — how effective the idea is with NEITHER the advisor NOR the benchmark present: purely an AI reading the `SKILL.md` + skill docs (the INTENT_SIGNALS / RESOURCE_MAP prose, hub/mode docs) and routing by hand. Does the idea still help, degrade gracefully, or become inert at the pure-document level? This is the primary lens the operator flagged — do not skip it.

### Deliverable
Per-iteration narrative in `research/`; findings feed this packet's `presentation.md` and the parent's combined synthesis.

## 4. SCOPE
- In: 5-iteration SOL xhigh-fast research on the calibrated contract, controller, friction budget, promotion metrics, and archetype unification.
- Out: implementation; a held-out corpus (metrics are specified, not measured); re-deriving the shipped `defaultMode` answer.
