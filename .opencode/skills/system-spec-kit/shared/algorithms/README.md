---
title: "Algorithms"
description: "Reciprocal Rank Fusion primitives the skill advisor's fusion scorer imports from the shared package."
trigger_phrases:
  - "RRF fusion"
  - "rank fusion primitives"
  - "shared algorithms"
---

# Algorithms

---

## 1. OVERVIEW

`algorithms/` holds one module, `rrf-fusion.ts`, which combines ranked candidate lists with Reciprocal Rank Fusion and keeps the result deterministic through score, content-hash and id tiebreaks. Its one live consumer is the skill advisor's fusion scorer.

Current state:

- `rrf-fusion.ts` provides two-list, multi-list and cross-variant fusion, overlap bonuses, source tracking and score normalization.
- The adaptive-fusion and MMR reranking modules that used to sit beside it were built for the retired memory pipeline; nothing imported them once that pipeline left, so they were removed with their tests.
- There is no barrel. Consumers import the module directly.

---

## 2. PACKAGE TOPOLOGY

```text
algorithms/
+-- rrf-fusion.ts         # Rank aggregation, overlap bonus and score normalization
`-- README.md
```

Allowed dependency direction:

```text
callers -> algorithms/rrf-fusion.ts
rrf-fusion.ts -> shared types or local constants
```

Disallowed dependency direction:

```text
rrf-fusion.ts -> consumer request handlers
rrf-fusion.ts -> database adapters
rrf-fusion.ts -> embedding providers
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `rrf-fusion.ts` | Scores ranked retrieval lists with RRF, overlap bonuses, source tracking, deterministic content-hash tiebreaks and the `bonusOverChannels` option. |

---

## 4. STABLE API

| Export | Contract |
|---|---|
| `fuseResults(vectorResults, keywordResults, k)` | Returns fused results with `rrfScore`, `sources`, `sourceScores` and convergence data. |
| `fuseResultsMulti(rankedLists, options)` | Fuses any number of ranked lists with optional source weights; `bonusOverChannels: 'active'` preserves the overlap bonus when a channel is empty. |
| `fuseResultsCrossVariant(variants, options)` | Combines results from expanded query variants. |
| `normalizeRrfScores(results)` | Normalizes RRF scores to the `0` to `1` range. |

The flags the module reads are `SPECKIT_RRF`, `SPECKIT_RRF_K`, `SPECKIT_SCORE_NORMALIZATION`, `SPECKIT_CALIBRATED_OVERLAP_BONUS` and `SPECKIT_RETRIEVAL_PROFILE_WEIGHTS`; the root `.env.example` documents each.

---

## 5. BOUNDARIES

| Boundary | Rule |
|---|---|
| Inputs | Accept ranked lists, scores and option objects only. |
| Outputs | Return scored result arrays and metadata. Do not perform response formatting here. |
| Determinism | Outputs sort by descending score, then `content_hash` when present, then canonical id. |
| Feature flags | Read the fusion flags here and nowhere else. |
| Storage | Do not open SQLite, file handles or network clients from this folder. |
| Embeddings | Consume vectors supplied by callers. Do not generate embeddings here. |

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `fuseResultsMulti` | Function | Main RRF path when callers already have ranked lists. |
| `fuseResults` | Function | Two-list convenience form. |

---

## 7. VALIDATION

Run from the repository root:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/shared/algorithms/README.md
```

Expected result: the validator exits with code `0`. The module's behavior is covered by the skill advisor's scorer tests, which import it.

---

## 8. RELATED

- [`../README.md`](../README.md)
- [`../embeddings/README.md`](../embeddings/README.md)
