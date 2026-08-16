---
title: "sk-vision Benchmark Reports"
description: "Index of curated benchmark run reports for sk-vision, one row per run folder."
trigger_phrases:
  - "sk-vision benchmark reports"
  - "sk-vision run index"
importance_tier: "normal"
contextType: "general"
version: 1.0.0.0
---

# sk-vision Benchmark Reports

> Run index for executed sk-vision benchmark scenarios, newest first. Raw execution evidence stays in the run folder named by each row's `source.md`.

---

## 1. OVERVIEW

Each row below is one immutable run folder. Rows are appended by the benchmark harness (`run-manual-playbook-scenario.cjs` / `run-skill-benchmark.cjs`) when it writes a report; operators never hand-edit this table or author report files. Corrected runs append new rows instead of rewriting history.

---

## 2. RUN INDEX

| Executed | Folder | Runtime | Result | Verdict | Source |
|---|---|---|---|---|---|
| 2026-08-16 | [`2026-08-16--manual-testing-playbook--ocr-live-run/`](./2026-08-16--manual-testing-playbook--ocr-live-run/) | ndjson-runtime-stdin moondream2 ocr-live-run | 1 PASS | **PASS** | `manual-testing-playbook` |
| 2026-08-16 | [`2026-08-16--manual-testing-playbook--status-live-run/`](./2026-08-16--manual-testing-playbook--status-live-run/) | ndjson-runtime-stdin moondream2 status-live-run | 1 PASS | **PASS** | `manual-testing-playbook` |

---

## 3. RENDERER-OWNED FILES (never hand-authored)

| File | Owner |
|---|---|
| `skill-benchmark-report.json` | Benchmark harness |
| `skill-benchmark-report.md` | Benchmark harness |
| `results.csv` | Benchmark harness |
| `failed-runs.md` | Benchmark harness |
| `findings-and-recommendations.md` | Benchmark harness |
| `source.md` | Benchmark harness |

The `README.md` inside each run folder is also harness-written. The only human- or agent-authored benchmark content is this index's append-only rows, which the harness performs.
