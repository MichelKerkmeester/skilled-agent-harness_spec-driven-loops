---
title: "Retrieval rescue authority"
description: "Retrieval rescue authority documents how the Stage 2 rescue layer scores trigger-rich paraphrase and sibling-document candidates, including the default lexical-rewrite mode and benchmark-only additive and floor modes selected by SPECKIT_RETRIEVAL_RESCUE_MODE."
trigger_phrases:
  - "retrieval rescue authority"
  - "SPECKIT_RETRIEVAL_RESCUE_MODE"
  - "lexical rescue score overwrite"
  - "Stage 2 retrieval rescue"
  - "rescue authority benchmark modes"
version: 3.6.0.5
---

# Retrieval rescue authority

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Retrieval rescue authority documents how the Stage 2 rescue layer scores trigger-rich paraphrase and sibling-document candidates, including the default lexical-rewrite mode and benchmark-only additive and floor modes selected by `SPECKIT_RETRIEVAL_RESCUE_MODE`.

The rescue layer is default-on unless `SPECKIT_RERANK_LAYER=false`. It computes lexical rescue signals from query-token coverage, trigger phrase coverage, document-type hints, title/path hits, quality penalties, and archive penalties. It can hydrate richer candidate rows, backfill weak lexical coverage, inject sibling documents inside the caller's scope/folder boundary, and then sort by the effective score after rescue metadata is attached.

---

## 2. HOW IT WORKS

Stage 2 fusion is the scoring stage that owns rescue authority. The pipeline README names Stage 2 as the owner for score fusion, retrieval signals, rescue authority, and late validation scoring; `stage2-fusion.ts` runs retrieval rescue as signal `6b` after feedback and learned shadow scoring, before artifact limiting, anchor metadata, and validation metadata.

`SPECKIT_RETRIEVAL_RESCUE_MODE` accepts `overwrite`, `additive`, or `floor`. Unset, empty, or unrecognized values resolve to `overwrite`. In the default lexical-rewrite mode, `computeRescueLayerScore()` rewrites the upstream base score with a lexical rescue blend: `normalizedBase * 0.03 + rescueScore * 0.78`, capped at `1.0`. This gives lexical rescue the final ranking authority for rescue-sensitive rows.

`additive` and `floor` are benchmark-only modes until the ranking contract is finalized by a human. `additive` preserves upstream authority by adding `rescueScore * 0.12` to the normalized base score, capped at `1.0`. `floor` preserves the normalized base score when it is at least `0.24`; below that threshold it falls through to the overwrite formula.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/rerank/retrieval-rescue.ts` | Lib | `isRetrievalRescueEnabled()`, `resolveRescueRankingMode()`, rescue scoring modes, lexical scoring, sibling/backfill injection, and exported testables |
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Lib | Stage 2 signal order and `applyRetrievalRescueLayer()` invocation before artifact limiting and validation metadata |
| `mcp_server/lib/search/pipeline/README.md` | Reference | Pipeline invariant documenting rescue authority and benchmark-only additive/floor modes |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/retrieval-rescue.vitest.ts` | Automated test | Default-on rescue flag behavior, default lexical overwrite authority, additive mode behavior, residual gate penalties, and injected-row scope boundary |
| `mcp_server/tests/search/deep-review-remediation.vitest.ts` | Automated test | Rescue scoring cap and artifact-class boost behavior |
| `mcp_server/tests/search-hot-path-performance.vitest.ts` | Automated test | Rescue hydration, lexical backfill routing, and hot-path ordering invariants |

---

## 4. SOURCE METADATA
- Group: Scoring And Calibration
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `scoring-and-calibration/retrieval-rescue-authority.md`
Related references:
- [calibrated-overlap-bonus.md](calibrated-overlap-bonus.md) — Calibrated overlap bonus
- [rrf-k-experimental.md](rrf-k-experimental.md) — RRF K experimental tuning
