---
title: "Calibration recommendation (May 20, 2026)"
description: "Single-page operator recommendation from the 023B calibration sweep: keep production defaults except for the reranker default flip; do not change RRF K, boost magnitude, top-K, or fusion formula on the current evidence."
trigger_phrases:
  - "calibration recommendation"
  - "023B recommendation"
  - "production default recommendation"
  - "reranker top-k RRF recommendation"
importance_tier: "important"
contextType: "reference"
---

# Calibration recommendation (May 20, 2026)

Single-page operator recommendation from the 023B calibration sweep.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DEFAULT RRF TUPLE](#2--default-rrf-tuple)
- [3. HYBRID BOOST MAGNITUDES](#3--hybrid-boost-magnitudes)
- [4. RERANK TOP-K](#4--rerank-top-k)
- [5. FUSION FORMULA](#5--fusion-formula)
- [6. FOLLOW-ON CONDITION](#6--follow-on-condition)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Do not change production defaults beyond the reranker flip already executed in ADR-027.

The packet has the expanded fixture, the repeated-run harness, and the residual miss classifier needed to make further default-change decisions with evidence. The full sweep is intentionally long: roughly 20 minutes per run and roughly 60 minutes for `--runs 3`. A live five-probe smoke sample proved the CLI path still executes, but that sample is not statistically meaningful.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:default-rrf-tuple -->
## 2. DEFAULT RRF TUPLE

Keep `(K=60, V=0.9, F=0.5)` until the full perturbation sweep completes. The harness covers `K in {10, 30, 60, 100, 150, 300}` and the unit test locks the expected flat-line decision rule: hit-rate spread across K values must stay below `0.05` to confirm the prior calibration finding that K is flat.

<!-- /ANCHOR:default-rrf-tuple -->

---

<!-- ANCHOR:hybrid-boost-magnitudes -->
## 3. HYBRID BOOST MAGNITUDES

Do not re-magnitude path-class or canonical boosts from this packet alone. The fixture now includes generated, vendor, docs, tests, implementation, and spec-research truth targets, so the full boost sweep can measure whether path-class/canonical boosts numerically dominate adjacent RRF gaps. If the full sweep shows the same truth paths displaced by boosted aliases across `n >= 3`, open a follow-on default-change packet.

<!-- /ANCHOR:hybrid-boost-magnitudes -->

---

<!-- ANCHOR:rerank-top-k -->
## 4. RERANK TOP-K

Keep `rerank_top_k=20` until the top-K sweep completes. The harness covers `K in {5, 10, 20, 40, 80}` and records p95 latency alongside hit rate so the recommendation can avoid a blind accuracy-only increase.

<!-- /ANCHOR:rerank-top-k -->

---

<!-- ANCHOR:fusion-formula -->
## 5. FUSION FORMULA

Keep RRF as the production formula. The harness defines ablation lanes for RRF, CombMNZ, and equal-weight average. The alternatives are measurement candidates, not default changes, because they are not yet wired as production config in `query.py`.

<!-- /ANCHOR:fusion-formula -->

---

<!-- ANCHOR:follow-on-condition -->
## 6. FOLLOW-ON CONDITION

Only change defaults if the completed `--runs 3` sweep shows an unambiguous winner with higher mean hit rate, no expanded-fixture path-class regression, and p95 below the ROBUST gate.

<!-- /ANCHOR:follow-on-condition -->
