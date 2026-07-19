---
title: "Evaluation Modules"
description: "Retrieval evaluation, baseline comparison, ground-truth handling, ablation runs, and reporting support for the Spec Kit MCP server."
trigger_phrases:
  - "eval modules"
  - "ablation"
  - "eval logger"
  - "quality proxy"
  - "ground truth"
---

# Evaluation Modules

`lib/eval/` contains measurement and analysis code for retrieval quality. Runtime callers use the fail-safe logger and pure scoring helpers. Maintenance callers use baseline, ablation, ground-truth, and dashboard utilities.

## 1. OVERVIEW

This folder answers whether retrieval changes improve results, regress quality, or affect channel contribution. It does not own live retrieval. The live path may call into logging and pure metrics, while heavier eval work stays behind explicit tools, flags, or offline scripts.

Runtime role:

- Record query and result telemetry when eval logging is enabled.
- Calculate pure metrics or quality proxy values without side effects.
- Keep disabled paths safe for normal MCP requests.

Maintenance role:

- Compare BM25, memory-state, warm-start, and channel baselines.
- Run ablation and K-value sensitivity checks.
- Track corpus diagnostic lanes for gate verdict, calibration and cold-tier behavior.
- Reject ablation scoring when the active vector index does not cover the golden-set parent memories.
- Generate and expand ground-truth data.
- Produce dashboard and shadow-score reports.

## 2. TOPOLOGY

```text
┌────────────────────┐
│ Retrieval handlers │
└─────────┬──────────┘
          ▼
┌────────────────────┐      ┌────────────────────┐
│ Fail-safe logging  │      │ Pure metric helpers│
└─────────┬──────────┘      └─────────┬──────────┘
          ▼                           ▼
┌────────────────────┐      ┌────────────────────┐
│ Eval SQLite tables │      │ Reports and scores │
└─────────┬──────────┘      └─────────┬──────────┘
          ▼                           ▼
┌─────────────────────────────────────────────────┐
│ Baselines, ablations, ground truth, dashboards  │
└─────────────────────────────────────────────────┘
```

## 3. KEY FILES

| File | Role |
| --- | --- |
| `eval-logger.ts` | Runtime logging hooks for query, channel, and final-result events. No-ops unless `SPECKIT_EVAL_LOGGING=true`. |
| `eval-metrics.ts` | Pure ranking metrics plus corpus lanes for gate-verdict precision, recall and F1, ECE and Brier calibration and cold-tier appearance and precision. |
| `eval-quality-proxy.ts` | Pure score used for latency and result-quality tradeoff checks. |
| `eval-db.ts` | Eval database bootstrap and schema ownership. |
| `ablation-framework.ts` | Maintenance ablation runner, golden-set embedding coverage guard, diagnostic snapshots, report formatter and optional metric persistence. |
| `k-value-analysis.ts` | RRF K-value sweep helpers. |
| `bm25-baseline.ts` | BM25-only baseline measurement and storage helpers. |
| `memory-state-baseline.ts` | Baseline snapshots against active memory-state retrieval. |
| `warm-start-variant-runner.ts` | Warm-start comparison runner for retrieval variants. |
| `ground-truth-data.ts` | Typed static ground-truth definitions. |
| `ground-truth-generator.ts` | Ground-truth generation and diversity checks. |
| `ground-truth-feedback.ts` | Selection-feedback capture and judge-agreement support. |
| `edge-density.ts` | Graph edge-density measurement and reporting helpers. |
| `reporting-dashboard.ts` | Sprint and channel reporting dashboard output. |
| `shadow-scoring.ts` | Read-only comparison and holdout analysis helpers. |

## 4. BOUNDARIES

Owns:

- Eval schema setup and metric snapshots.
- Ground-truth and channel-quality measurement.
- Ground-truth parent alignment and golden-set embedding coverage checks before ablation scoring.
- Offline or flag-gated analysis flows.

Does not own:

- Live retrieval ranking decisions.
- Memory document indexing.
- Corpus reindexing, embedding reconciliation or ground-truth ID remapping.
- Tool handler routing.
- Test fixtures outside eval data.

## 5. ENTRYPOINTS

| Entrypoint | Caller | Notes |
| --- | --- | --- |
| `logQueryEvent()` and related logger calls | Runtime retrieval handlers | Safe when disabled. |
| `calculateEvalMetrics()` | Tests and eval tools | Pure calculation surface. |
| `computeGateVerdictMetrics()` | Ablation diagnostics | Corpus-level precision, recall and F1 for citable gate verdicts. |
| `computeCalibrationMetrics()` | Ablation diagnostics | ECE, Brier score and reliability bins over binary relevance labels. |
| `computeColdStartCorpusMetrics()` | Ablation diagnostics | Cold-tier appearance rate, precision and hit counts across query snapshots. |
| `calculateQualityProxy()` | Runtime and tests | No database writes. |
| `inspectEmbeddingCoverage()` and `assertEmbeddingCoverage()` | Maintenance preflight | Inspect or reject golden-set parent embedding coverage before ablation scoring. |
| `runAblation()` | Maintenance tools | Storage requires `SPECKIT_ABLATION=true`. With an alignment DB, it checks parent alignment and embedding coverage before scoring. With diagnostic snapshots enabled, it emits baseline snapshots and corpus metrics. |
| `generateGroundTruthDataset()` | Maintenance tools | Updates generated eval data. |
| `generateReportingDashboard()` | Reporting tools | Reads stored eval metrics. |

Coverage guard:

`runAblation()` runs `assertGroundTruthAlignment()` and `assertEmbeddingCoverage()` when `alignmentDb` is provided. The MCP handler provides that DB. `assertEmbeddingCoverage()` calls `inspectEmbeddingCoverage()` and requires `minEmbeddingCoverage`, default `1.0`, so every unique golden-set parent id must resolve to a parent memory with `embedding_status` `success` and a row in `vec_memories`. If coverage is below threshold, the runner refuses to score that index. The remediation message names the coverage ratio and uncovered examples, then points operators to corpus reindex plus embedding reconcile, followed by `scripts/evals/map-ground-truth-ids.ts --write` if the ground-truth remap still drifts.

Diagnostic snapshots:

When `includeDiagnosticSnapshots` is true, the baseline pass emits `diagnosticSnapshots` with query id, query, request quality, per-result confidence, tier, creation time and `scoreSnapshot`. The same pass emits `corpusMetrics`: `gateVerdict` has true and false counts plus precision, recall and F1, `calibration` has sample count, ECE, Brier score and reliability bins and `coldStart` has cold appearance rate, cold precision and hit counts.

## 6. VALIDATION

Run focused tests when changing this folder:

```bash
npm test -- mcp-server/tests/eval
npm test -- mcp-server/tests/handlers/eval
```

Run document validation after README edits:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/mcp-server/lib/eval/README.md
```

## 7. RELATED

- `../search/README.md` documents the live retrieval pipeline.
- `../telemetry/README.md` documents retrieval observability.
- `../../api/README.md` documents tool-facing handler surfaces.
- `../../tests/README.md` documents MCP server test layout.
