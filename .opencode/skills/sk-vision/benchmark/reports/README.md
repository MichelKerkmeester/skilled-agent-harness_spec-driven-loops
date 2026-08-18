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
| 2026-08-17 | [`2026-08-17--manual-testing-playbook--vsn-020-devin-vision-blind-pass/`](./2026-08-17--manual-testing-playbook--vsn-020-devin-vision-blind-pass/) | cli-devin glm-5-2 vsn-020-devin-vision-blind | 1 PASS | **PASS** | `manual-testing-playbook` |
| 2026-08-17 | [`2026-08-17--manual-testing-playbook--vsn-020-cursor-vision-blind-pass/`](./2026-08-17--manual-testing-playbook--vsn-020-cursor-vision-blind-pass/) | cli-cursor glm-5.2-high vsn-020-cursor-vision-blind | 1 PASS | **PASS** | `manual-testing-playbook` |
| 2026-08-17 | [`2026-08-17--manual-testing-playbook--vsn-019-devin-status-pass/`](./2026-08-17--manual-testing-playbook--vsn-019-devin-status-pass/) | cli-devin glm-5-2 vsn-019-devin-status | 1 PASS | **PASS** | `manual-testing-playbook` |
| 2026-08-17 | [`2026-08-17--manual-testing-playbook--vsn-020-devin-vision-blind/`](./2026-08-17--manual-testing-playbook--vsn-020-devin-vision-blind/) | vsn-020-devin-vision-blind | 1 SKIP | **SKIP** | `manual-testing-playbook` |
| 2026-08-17 | [`2026-08-17--manual-testing-playbook--vsn-019-devin-status/`](./2026-08-17--manual-testing-playbook--vsn-019-devin-status/) | vsn-019-devin-status | 1 SKIP | **SKIP** | `manual-testing-playbook` |
| 2026-08-17 | [`2026-08-17--manual-testing-playbook--vsn-020-cursor-vision-blind/`](./2026-08-17--manual-testing-playbook--vsn-020-cursor-vision-blind/) | vsn-020-cursor-vision-blind | 1 FAIL | **FAIL** | `manual-testing-playbook` |
| 2026-08-17 | [`2026-08-17--manual-testing-playbook--vsn-018-cursor-status/`](./2026-08-17--manual-testing-playbook--vsn-018-cursor-status/) | cli-cursor glm-5.2-high vsn-018-cursor-status | 1 PASS | **PASS** | `manual-testing-playbook` |
| 2026-08-17 | [`2026-08-17--manual-testing-playbook--vsn-017-standalone/`](./2026-08-17--manual-testing-playbook--vsn-017-standalone/) | vsn-017-standalone | 1 PASS | **PASS** | `manual-testing-playbook` |
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
