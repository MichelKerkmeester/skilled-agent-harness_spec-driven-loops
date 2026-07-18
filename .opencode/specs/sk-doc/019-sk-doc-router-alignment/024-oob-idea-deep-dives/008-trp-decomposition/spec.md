---
title: "Feature Specification: Deep-Dive — The (T, R, P) Decomposition"
description: "Candidate 8th idea (from the GLM-5.2 parallel lineage): decompose routing policy into three orthogonal knobs — Threshold (how much evidence to commit), Recovery (what happens after an uncertain/wrong pick), Provenance (where the vocab-to-mode evidence comes from). defaultMode is one corner (T low, R none, P static) of this space; the field conflates T and R and cannot express low-threshold + high-recovery. A hub's policy becomes a (T,R,P) triple plus a vocabulary table. This packet is the dive-ready scaffold; the presentation is authored, the 5-iteration SOL xhigh-fast dive is NOT yet run."
trigger_phrases:
  - "t r p decomposition deep dive"
  - "threshold recovery provenance routing"
  - "defaultMode is one corner"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Deep-Dive: The (T, R, P) Decomposition

## EXECUTIVE SUMMARY

The seven SOL ideas type the routing *decision*; this GLM-originated candidate types the *policy knob-space*. Its claim: routing has three orthogonal knobs — Threshold, Recovery, Provenance — and `defaultMode` is one corner `(T low, R none, P static)` that silently sets T and R together. A hub's policy becomes a `(T, R, P)` triple plus a vocabulary table. This is the dive-ready scaffold: presentation authored, 5-iteration SOL xhigh-fast dive NOT yet run. Provenance: single GLM-5.2 lineage, no live-router execution — validate before adopting.

## 3. RESEARCH CONTEXT

Seed evidence (do NOT re-derive): `../GLM-cross-lineage-notes.md` and the GLM lineage synthesis `../../023-oob-glm-parallel/research/lineages/glm-oob/research.md` (§4 Iteration 4 (T,R,P); §5 Iteration 5 minimal router + contrarian claim). Two sourced, model-independent facts: signal `weight` is uniform `4` fleet-wide (learn the vocab→mode table, not weights); `_apply_deep_skill_routing_layer` is the one shipped advisor-side mode pre-resolution precedent.

### Idea-specific agenda (deepen, do not survey)
1. **Formalize the three axes.** Exact value enums for T (`low`/`calibrated`/`defer-below-threshold`), R (`none`/`handoff`/`card`/`orderedBundle`), P (`static`/`prior`/`offline-learned`); the per-field mapping from today's `routerPolicy`.
2. **Conflation inventory.** Per hub, prove which current field (`defaultMode`, `ambiguityDelta`, `bundleRules`, `defaultResource`, `tieBreak`) encodes which axis and where axes collide.
3. **Minimal-router shape.** A `(T, R, P) + vocabulary` schema; what it deletes/relocates; migration ambiguity (`defaultMode: X` between `(T low, R none)` and `(T low, R handoff)`).
4. **Wider falsification.** Does the decomposition survive named-default, bundle, transport, and same-packet-mode hubs?
5. **Composition with siblings.** How R=handoff (Idea 4) feeds P=learned (Idea 2); how T=calibrated is Idea 5; how the triple relates to Idea 6's typed decision.

### MANDATORY cross-cutting evaluation (every iteration MUST address all three)

Beyond the idea-specific agenda, each iteration must explicitly evaluate this idea along three separated dimensions:

1. **System skill advisor integration** — how the idea interacts with, depends on, or changes the Layer-0 advisor (`system-skill-advisor`): does Layer 0 carry the `(T,R,P)` triple; what it must expose/consume; what degrades if the advisor is absent or stale.
2. **Benchmark integration** — how the idea interacts with the deterministic route-gold / skill-benchmark machinery: can route-gold assert a valid `(T,R,P)` triple per hub; new fixtures/contracts; byte-identical deterministic replay preserved?
3. **Standalone effectiveness on documents alone** — how effective with NEITHER advisor NOR benchmark: can an AI route purely off the `(T,R,P)` triple + vocabulary table in the docs, no scoring? Does it help, degrade gracefully, or become inert at the pure-document level?

### Deliverable
Per-iteration narrative in `research/`; findings feed this packet's `presentation.md` and the parent's synthesis.

## 4. SCOPE
- In: 5-iteration SOL xhigh-fast research on the three-axis formalization, conflation inventory, minimal-router shape, wider falsification, and sibling composition.
- Out: implementation; changing live routing config or the scorer; re-deriving the shipped `defaultMode` answer.
