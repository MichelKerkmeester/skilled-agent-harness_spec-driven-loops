---
title: "Feature Specification: Deep-Dive — Compiled Policy Collapse"
description: "Five-iteration SOL xhigh-fast deep-research lineage on collapsing the two hand-authored routing maps (INTENT_SIGNALS + RESOURCE_MAP + hub-router.json + mode-registry.json) into one immutable, content-addressed, registry-derived compiled policy that Layer 0 and offline route-gold both read, backed by a thin packet-local resolver that validates, loads, and enforces."
trigger_phrases:
  - "compiled routing policy deep dive"
  - "collapse intent signals resource map"
  - "registry-derived routing policy"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Deep-Dive: Compiled Policy Collapse

## EXECUTIVE SUMMARY

Iteration 1 of `sol-oob` found that fully deleting hub-local routing is unsafe, but a **semantic collapse** is not: compile the duplicated hand-authored routing representations into one canonical, hash-addressed policy derived from the registry, keep a thin packet-local resolver for validation/loading/authority, and let Layer 0 plus the offline route-gold oracle both read the same compiled artifact. This lineage designs that artifact and its migration in depth.

## 3. RESEARCH CONTEXT

Seed evidence (do NOT re-derive): `../../002-default-mode-policy-research/research/lineages/sol-oob/iterations/iteration-001.md` and the lineage `research.md` §4.1, §7, §8. The direction survived two-hub falsification; the open work is the concrete artifact + compiler + resolver + migration.

### Idea-specific agenda (deepen, do not survey)
1. **Compiled-policy schema.** Define the exact content-addressed artifact: registry projection, detector schema, mode capabilities, ordered-bundle constraints, authority references, resource selectors, and the policy hash inputs (canonical serialization, compiler/detector versions).
2. **Compatibility compiler.** Compile the current `hub-router.json` + `mode-registry.json` pair into the immutable policy while keeping the existing router as a comparison oracle; fail closed on missing modes, role/order drift, unresolved resources, authority mismatch, or non-canonical identity.
3. **Thin resolver contract.** Specify what the packet-local resolver still owns (verify typed plan, load local resources, apply defer behavior, enforce tool/mutation authority) versus what Layer 0 owns.
4. **Determinism + route-gold parity.** Prove the compiled policy preserves byte-identical offline replay; design the drift guard that detects bidirectional divergence between source inputs and the compiled snapshot.
5. **Migration.** A compiler-adapter-first path that keeps advisor projections, packet loading, tool surfaces, and route-gold fixtures operational while the compiler becomes canonical.

### MANDATORY cross-cutting evaluation (every iteration MUST address all three)

Beyond the idea-specific agenda, each iteration must explicitly evaluate this idea along three separated dimensions:

1. **System skill advisor integration** — how the idea interacts with, depends on, or changes the Layer-0 advisor (`system-skill-advisor`): its recommendation, scoring/fusion, mode projections, and calibration/telemetry. State what the advisor must expose or consume for the idea to work, and what degrades if the advisor is absent or stale.
2. **Benchmark integration** — how the idea interacts with the deterministic route-gold / skill-benchmark machinery: replay determinism, typed gold, the offline oracle, and drift guards. State the new fixtures or scorer contracts it needs and whether it preserves byte-identical deterministic replay.
3. **Standalone effectiveness on documents alone** — how effective the idea is with NEITHER the advisor NOR the benchmark present: purely an AI reading the `SKILL.md` + skill docs (the INTENT_SIGNALS / RESOURCE_MAP prose, hub/mode docs) and routing by hand. Does the idea still help, degrade gracefully, or become inert at the pure-document level? This is the primary lens the operator flagged — do not skip it.

### Deliverable
Per-iteration narrative in `research/`; findings feed this packet's `presentation.md` and the parent's combined synthesis.

## 4. SCOPE
- In: 5-iteration SOL xhigh-fast research on the compiled-policy artifact, compiler, resolver, determinism, and migration.
- Out: implementation; changing live routing config or the scorer; re-deriving the shipped `defaultMode` answer.
