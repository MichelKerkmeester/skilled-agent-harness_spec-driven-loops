---
title: "Retrieval Eval Drivers"
description: "Standalone CLI drivers that measure retrieval-flag recall, calibration and correctness against a copy of the live memory database."
---

# Retrieval Eval Drivers

---

## 1. OVERVIEW

`scripts/evals/` holds standalone CLI eval drivers for the retrieval and confidence-scoring flags in `../../lib/eval/` and `../../lib/search/`. Every driver opens the live database read-only, works on a temporary copy or a synthesized labeled set and never mutates the source database. Each driver answers one specific measurement question: does a flag improve recall relative to the default path, does a rendered response preserve the verdict fields the tool shipped, does a retention decision match the documented safety contract and so on.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `run-retrieval-flag-eval.mjs` | Recall@20/nDCG@10/MRR before/after driver for the generic retrieval-flag family, on a temp copy of the live DB and vector shard. |
| `run-eval-v2.mjs` | completeRecall@K (K=3/5/8) over multi-target gold sets, in dual mode (flag-off vs flag-on) on the same copy DB, closing the saturation gap in `run-retrieval-flag-eval.mjs`. |
| `run-context-recall-eval.mjs` | Improvement-vs-baseline driver for the `memory_context` world-summary prelude flag. |
| `run-edge-recall-eval.mjs` | Edge/temporal-recall driver: does the graph edge channel recall a known causal-edge neighbor on the default routing path. |
| `run-derived-id-eval.mjs` | Correctness driver for `SPECKIT_DERIVED_ID_PROVENANCE`, checking stability, replay and dedup invariants on generated causal-edge ids. |
| `run-graph-preservation-flag-eval.mjs` | Before/after driver for the two graph-preservation flags, sliced by query class, reusing `run-retrieval-flag-eval.mjs`'s backup and scoring machinery. |
| `run-calibration-eval.mjs` | Confidence-calibration driver: Expected Calibration Error and Brier score for the absolute-relevance and isotonic-calibration flags. |
| `run-calibration-heldout-eval.mjs` | Grouped k-fold cross-validated (query-level) held-out calibration driver, the honest counterpart to `run-calibration-eval.mjs`'s in-sample score. |
| `run-false-confirm-eval.mjs` | Off-corpus false-confirm regression guard: scores hard-negative off-corpus queries through the production verdict path. |
| `run-retention-eval.mjs` | Retention-safety driver: scores the forgetting layer's drop/keep decisions on a synthesized, TTL-forced copy against the documented safety contract. |
| `check-envelope-fidelity.mjs` | Deterministic, no-retrieval replay check: does a rendered response block preserve every verdict field the tool shipped. |
| `probe-additive-tail.mjs` | Displacement and append-activity probe for two additive tail-lane recall features, on the live-DB copy. |
| `assert-ground-truth-alignment.mjs` | Thin CLI wrapper around `dist/lib/eval/ablation-framework.js`'s `assertGroundTruthAlignment`. |
| `generate-known-item-ground-truth.cjs` | Generates the known-item ground-truth query set from the live database. |
| `derive-edge-recall-golden.mjs` | Derives `edge-recall-golden.json` from live open causal edges (source title as query, edge neighbor as expected target). |
| `context-recall-golden.json` | Generated golden query set for `run-context-recall-eval.mjs`, keyed by memory id and title. |
| `edge-recall-golden.json` | Generated golden edge set for `run-edge-recall-eval.mjs`, derived by `derive-edge-recall-golden.mjs`. |

## 3. VALIDATION

Run from `.opencode/skills/system-spec-kit/mcp-server/` unless noted.

```bash
node scripts/evals/run-retrieval-flag-eval.mjs
```

Each driver reads `MEMORY_DB_PATH` (default `database/context-index.sqlite`) and prints a before/after or pass/fail report. Golden JSON files are regenerated with their matching `derive-*` or `generate-*` script, not hand-edited.

## 4. RELATED

- [`../README.md`](../README.md)
- [`../../lib/eval/README.md`](../../lib/eval/README.md)
