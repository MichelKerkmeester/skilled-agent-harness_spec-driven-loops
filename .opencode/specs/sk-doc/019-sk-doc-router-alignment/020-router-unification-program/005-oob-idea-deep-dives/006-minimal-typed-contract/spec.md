---
title: "Feature Specification: Deep-Dive — Minimal Typed Router Contract"
description: "Five-iteration SOL xhigh-fast deep-research lineage on the smallest information-preserving router contract — RouteRequest facts + content-addressed CompiledPolicy + typed RouteDecision (single/orderedBundle/surfaceBundle/clarify/defer/reject) — that collapses the parallel INTENT_SIGNALS and RESOURCE_MAP declarations into compiled detectors and registry/leaf selectors while a policy-pinned modeId derives packet, backend, authority, and default resources, falsified against dissimilar hubs so no field can be removed without losing bundle roles, same-packet public modes, or the evidence-producing detection boundary."
trigger_phrases:
  - "minimal typed router contract deep dive"
  - "route request compiled policy route decision"
  - "defaultMode commitment smell"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Deep-Dive: Minimal Typed Router Contract

## EXECUTIVE SUMMARY

Iteration 6 of `sol-oob` identified the deeper smell behind `defaultMode`: premature, unobservable commitment, where "no evidence," "a policy prior," and "execute this child" collapse into one field. The fix is a typed decision boundary before a confidence number: `RouteRequest facts + CompiledPolicy + RouteDecision` with `outcome ∈ single|orderedBundle|surfaceBundle|clarify|defer|reject`. It was falsified against two dissimilar hubs. This lineage finalizes the contract and widens the falsification.

## 3. RESEARCH CONTEXT

Seed evidence (do NOT re-derive): `../../002-default-mode-policy-research/research/lineages/sol-oob/iterations/iteration-006.md` (includes the information-preservation test + the concrete minimal contract) and lineage `research.md` §4.1, §11(2). Falsified so far against `sk-code` (workflow+surface bundler) and `system-deep-loop` (same-packet public modes).

### Idea-specific agenda (deepen, do not survey)
1. **Contract schema.** Finalize `RouteRequest` (explicit hint + typed facts), `CompiledPolicy` (policyHash, factSchemaHash, modes, detectors, bundleConstraints), and `RouteDecision` (outcome, ordered targets+roles, evidence, alternatives, replay hashes).
2. **Collapse mechanics.** `INTENT_SIGNALS` → compiled evidence-producing detectors; `RESOURCE_MAP` → registry + leaf-manifest selectors; policy-pinned `modeId` derives packet/backend/authority/default resources.
3. **Wider falsification.** Test the contract against additional archetypes beyond the first two — named-default, contextual-default, transport, and complex leaf-resource hubs — and record any field that must be added.
4. **Irreducible detection boundary.** Prove which lexical/command/surface detection cannot be deleted (only compiled), and where capability solving legitimately begins.
5. **Machine-checkability.** Toward a schema that route-gold can assert, with every omitted static field recoverable from the policy hash.

### MANDATORY cross-cutting evaluation (every iteration MUST address all three)

Beyond the idea-specific agenda, each iteration must explicitly evaluate this idea along three separated dimensions:

1. **System skill advisor integration** — how the idea interacts with, depends on, or changes the Layer-0 advisor (`system-skill-advisor`): its recommendation, scoring/fusion, mode projections, and calibration/telemetry. State what the advisor must expose or consume for the idea to work, and what degrades if the advisor is absent or stale.
2. **Benchmark integration** — how the idea interacts with the deterministic route-gold / skill-benchmark machinery: replay determinism, typed gold, the offline oracle, and drift guards. State the new fixtures or scorer contracts it needs and whether it preserves byte-identical deterministic replay.
3. **Standalone effectiveness on documents alone** — how effective the idea is with NEITHER the advisor NOR the benchmark present: purely an AI reading the `SKILL.md` + skill docs (the INTENT_SIGNALS / RESOURCE_MAP prose, hub/mode docs) and routing by hand. Does the idea still help, degrade gracefully, or become inert at the pure-document level? This is the primary lens the operator flagged — do not skip it.

### Deliverable
Per-iteration narrative in `research/`; findings feed this packet's `presentation.md` and the parent's combined synthesis.

## 4. SCOPE
- In: 5-iteration SOL xhigh-fast research on the contract schema, collapse mechanics, wider falsification, detection boundary, and machine-checkability.
- Out: implementation; re-deriving the shipped `defaultMode` answer (this idea explains *why* the field is a smell; it does not re-litigate the flips).
