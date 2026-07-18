---
title: "Feature Specification: Deep-Dive — Replayable Correction Overlay"
description: "Five-iteration SOL xhigh-fast deep-research lineage on a two-plane learning system for routing: an immutable content-addressed base policy served in production, plus a hash-addressed candidate overlay learned from correction telemetry in a separate plane, gated by shadow evaluation and held-out validation, promoted only by explicit governance, and rolled back by selecting a prior overlay hash — so routing can adapt without ever making offline replay irreproducible."
trigger_phrases:
  - "replayable correction overlay deep dive"
  - "two-plane routing learning"
  - "hash-addressed routing overlay"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Deep-Dive: Replayable Correction Overlay

## EXECUTIVE SUMMARY

Iteration 2 of `sol-oob` found the repository already contains most of a two-plane learning split (frozen live weights + opt-in shadow deltas + a bounded calibration reducer that requires held-out validation). The missing piece is an **immutable `(basePolicyHash, overlayHash)` identity** that turns a learned candidate into a replayable snapshot instead of mutable runtime state. This lineage designs that overlay end to end.

## 3. RESEARCH CONTEXT

Seed evidence (do NOT re-derive): `../../002-default-mode-policy-research/research/lineages/sol-oob/iterations/iteration-002.md` and lineage `research.md` §7 (two-plane learning), §11(6). The key constraint: correction telemetry is deliberately prompt-free, so it can support aggregate calibration but not per-prompt gold reconstruction.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
The five-iteration research run selected immutable policy semantics plus mutable selection. Content-addressed base, candidate, and promoted cores bind the complete effective policy, compatibility contracts, evidence identities, and approval decision; a separate compare-and-swap pointer selects one `(basePolicyDigest, overlayHash | null, generation)` tuple. Each advisor request pins and verifies that tuple before extraction or scoring, while shadow candidates remain evidence-only and cannot alter active routing.

Decision replay starts from a packet-safe normalized pre-fusion feature artifact. End-to-end extraction replay uses a separate consented, privacy-reviewed fixture corpus, and prompt-free operational outcomes remain aggregate calibration evidence rather than fixtures or gold. Route-gold replays immutable tuples and scripted degradation states without a live advisor. Document-only routing remains useful through a complete resolved policy card, but every result is explicitly `DOCUMENT_ONLY_UNATTESTED` because documents cannot prove activation, extraction identity, signatures, private gold, or empirical gain.

Promotion requires independently qualified shadow windows, byte-identical paired replay, private held-out and protected-slice validation, privacy validity, role-separated approval, and mechanical activation. Rollback selects retained compatible truth through the same compare-and-swap protocol. Missing evidence, contract mismatch, privacy invalidation, sparse or concentrated samples, nondeterminism, and protected regressions fail closed or defer visibly. The architecture is ready for an implementation specification, but the overlay store, schemas, verifier, fixtures, privacy ledger, monitor, and empirical efficacy evidence do not yet exist. See `research/research.md` for the canonical synthesis and `research/resource-map.md` for evidence coverage.
<!-- END GENERATED: deep-research/spec-findings -->

### Idea-specific agenda (deepen, do not survey)
1. **Overlay schema.** Define the content-addressed overlay: `schemaVersion`, `basePolicyHash`, `parentOverlayHash`, calibrator version, bounded weight/threshold deltas, training-window digest, held-out-fixture digest, promotion evidence.
2. **Decision-replay vs feature-extraction-replay.** Specify what must be persisted (normalized/packet-safe feature vector + two policy hashes + feature-schema version) to reproduce a selection without raw prompts, and why end-to-end replay needs a separate curated fixture.
3. **Promotion + rollback governance.** Shadow comparison → held-out validation → explicit promotion gate → new overlay version; rollback = select a prior overlay hash; base-hash/schema mismatch = visible abstention.
4. **Curated fixture corpus.** What an opt-in, privacy-reviewed routing fixture must contain to validate an overlay (since operational telemetry cannot supply it).
5. **Bounds + guardrails.** Delta caps, low-sample/concentrated-sample exclusion, no online self-promotion, drift-guard integration.

### MANDATORY cross-cutting evaluation (every iteration MUST address all three)

Beyond the idea-specific agenda, each iteration must explicitly evaluate this idea along three separated dimensions:

1. **System skill advisor integration** — how the idea interacts with, depends on, or changes the Layer-0 advisor (`system-skill-advisor`): its recommendation, scoring/fusion, mode projections, and calibration/telemetry. State what the advisor must expose or consume for the idea to work, and what degrades if the advisor is absent or stale.
2. **Benchmark integration** — how the idea interacts with the deterministic route-gold / skill-benchmark machinery: replay determinism, typed gold, the offline oracle, and drift guards. State the new fixtures or scorer contracts it needs and whether it preserves byte-identical deterministic replay.
3. **Standalone effectiveness on documents alone** — how effective the idea is with NEITHER the advisor NOR the benchmark present: purely an AI reading the `SKILL.md` + skill docs (the INTENT_SIGNALS / RESOURCE_MAP prose, hub/mode docs) and routing by hand. Does the idea still help, degrade gracefully, or become inert at the pure-document level? This is the primary lens the operator flagged — do not skip it.

### Deliverable
Per-iteration narrative in `research/`; findings feed this packet's `presentation.md` and the parent's combined synthesis.

## 4. SCOPE
- In: 5-iteration SOL xhigh-fast research on the overlay schema, replay split, governance, fixtures, and guardrails.
- Out: implementation; editing the shared scorer/telemetry; re-deriving the shipped `defaultMode` answer.
