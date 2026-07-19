---
title: "Rerank A/B Benchmark Scripts: Report and Run Tooling"
description: "Scripts that run the spec-memory rerank A/B benchmark arms, aggregate metrics, and render the markdown report."
trigger_phrases:
  - "rerank A/B benchmark scripts"
  - "generate_report.py"
  - "benchmark report generation"
---

# Rerank A/B Benchmark Scripts: Report and Run Tooling

---

## 1. OVERVIEW

`scripts/` holds the tooling for the spec-memory rerank A/B benchmark. The scripts run two measured arms against the real `memory_search` MCP tool, aggregate the raw rows into arm-level metrics with confidence intervals, and render a curated markdown report with a PROMOTE or HOLD verdict.

Current state:

- `run-ab.sh` is the orchestrator entrypoint. It runs both arms, then aggregation, then report generation.
- `run_arm.py` and `run-arm.sh` execute a single benchmark arm against `memory_search`.
- `aggregate.py` reduces the per-probe rows into arm-level metrics.
- `generate_report.py` reads the fixture, aggregate results, and per-probe rows, then writes the final report.
- The scripts read and write sibling data files in the benchmark folder one level up (`rerank-ab-fixture.json`, `results.csv`, `per-probe.jsonl`).

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                  RERANK A/B BENCHMARK SCRIPTS                    │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ run-ab.sh    │ ───▶ │ run_arm (A, B)   │ ───▶ │ memory_search    │
│ orchestrator │      │ measured queries │      │ MCP over JSON-RPC│
└──────┬───────┘      └────────┬─────────┘      └──────────────────┘
       │                       │
       │                       ▼
       │              ┌──────────────────┐
       │              │ per-probe.jsonl  │
       │              │ raw rows         │
       │              └────────┬─────────┘
       │                       ▼
       │              ┌──────────────────┐
       ├────────────▶ │ aggregate.py     │ ───▶ results.csv
       │              └──────────────────┘
       │                       │
       ▼                       ▼
┌──────────────────────────────────────────┐
│ generate_report.py                       │ ───▶ benchmark-report.md
└──────────────────────────────────────────┘

Dependency direction:
run-ab.sh ───▶ run_arm ───▶ memory_search
run-ab.sh ───▶ aggregate.py ───▶ generate_report.py
```

---

## 3. DIRECTORY TREE

```text
scripts/
+-- run-ab.sh           # Orchestrator: settle, snapshot, Arm A, warmup, Arm B, aggregate, report
+-- run_arm.py          # Single-arm runner against memory_search
+-- run-arm.sh          # Shell wrapper that invokes run_arm.py for one arm
+-- aggregate.py        # Reduces per-probe rows into arm-level metrics
+-- generate_report.py  # Renders the curated markdown benchmark report
`-- README.md
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `run-ab.sh` | Orchestrates the full A/B run: startup-scan settle pass, fixture snapshot refresh, Arm A with cross-encoder disabled, sidecar ensure and warmup, Arm B with the local reranker, then aggregation and report generation. |
| `run_arm.py` | Executes one benchmark arm by invoking the real `memory_search` MCP tool over JSON-RPC and recording per-probe rows. |
| `run-arm.sh` | Shell wrapper that runs `run_arm.py` for a single arm with the arm-specific environment. |
| `aggregate.py` | Reads the per-probe rows and writes arm-level aggregate metrics, including hit rate, MRR@10, latency percentiles, and confidence intervals. |
| `generate_report.py` | Reads the fixture, aggregate results, and per-probe rows, applies the promotion decision rule, and writes the markdown report. |

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `bash scripts/run-ab.sh` | CLI | Runs the complete benchmark end to end and writes the report. |
| `python3 scripts/generate_report.py --fixture ... --results ... --per-probe ... --out ...` | CLI | Renders the report from existing fixture, results, and per-probe inputs. |
| `python3 scripts/aggregate.py` | CLI | Produces arm-level aggregate metrics from per-probe rows. |
| `decision()` | Function | In `generate_report.py`, computes the PROMOTE/HOLD verdict from arm metrics and confidence intervals. |
| `category_table()` | Function | In `generate_report.py`, builds the per-category hit-rate and MRR breakdown table. |

The promotion rule applied by `decision()` is:

```text
PROMOTE if:
  (hit_rate_delta_pp >= +6 OR MRR_delta >= +0.10 with non-overlapping CIs)
  AND p95_delta_ms <= +400
Else HOLD.
```

---

## 6. VALIDATION

Run from the benchmark folder one level up from `scripts/`.

```bash
cd .opencode/skills/system-spec-kit/mcp-server/benchmarks/benchmark-2026-05-20-rerank-ab
bash scripts/run-ab.sh
```

`generate_report.py` can be replayed alone against existing inputs:

```bash
python3 scripts/generate_report.py \
  --fixture rerank-ab-fixture.json \
  --results results.csv \
  --per-probe per-probe.jsonl \
  --out benchmark-report.md
```

Expected result: the run writes refreshed `results.csv`, `per-probe.jsonl`, and a `benchmark-report.md` whose verdict matches the decision rule above.

---

## 7. RELATED

- [`../../README.md`](../../README.md)
