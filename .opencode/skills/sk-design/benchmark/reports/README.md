---
title: "sk-design Benchmark Reports"
description: "Index of curated benchmark run reports for sk-design, one row per run folder."
trigger_phrases:
  - "sk-design benchmark reports"
  - "sk-design benchmark index"
importance_tier: "important"
contextType: "general"
---

# sk-design Benchmark Reports

> Curated reports derived from completed benchmark runs, newest first. Raw execution evidence stays in the packet that produced it, named in each run's `source.md`.

---

## 1. OVERVIEW

Each row below is one run folder. Rows are written by the benchmark harness at the moment it writes the report, so this table cannot fall behind the folders beside it.

---

## 2. RUN INDEX

| Executed | Folder | Runtime | Result | Verdict | Source |
|---|---|---|---|---|---|
| 2026-07-07 | [`2026-07-07--after-022-coverage-fill--live/`](./2026-07-07--after-022-coverage-fill--live/) | live | 21 PASS, 6 FAIL | **PASS** 94/100 | not recorded |
| 2026-07-07 | [`2026-07-07--after-018-transport-integration--live/`](./2026-07-07--after-018-transport-integration--live/) | live | 19 PASS, 6 FAIL | **PASS** 93/100 | not recorded |
| 2026-07-07 | [`2026-07-07--after-016-hub-routing--live/`](./2026-07-07--after-016-hub-routing--live/) | live | 19 PASS, 5 FAIL | **PASS** 93/100 | not recorded |
| 2026-07-06 | [`2026-07-06--after-d3-proxy--router/`](./2026-07-06--after-d3-proxy--router/) | router | 24 PASS | **PASS** 100/100 | not recorded |
| 2026-07-06 | [`2026-07-06--after-012-routing-rigor--router/`](./2026-07-06--after-012-routing-rigor--router/) | router | 24 PASS | **PASS** 100/100 | not recorded |
| 2026-07-06 | [`2026-07-06--after-009--router/`](./2026-07-06--after-009--router/) | router | 24 PASS | **CONDITIONAL** 69/100 | not recorded |

---

## 3. STORAGE RULE

Run folders are named `<YYYY-MM-DD>--<subject>--<variant>`, dated by execution. Keep curated summaries and machine-readable result tables here, and raw transcripts and copied artifacts in the source packet. A run whose result changes gets a new folder rather than overwriting a prior one.

The grammar and the report file set are owned by `create-benchmark`; this index states them only so the folder reads on its own. Where the two differ, that skill is correct.
