---
title: "sk-code Benchmark Reports"
description: "Index of curated benchmark run reports for sk-code, one row per run folder."
trigger_phrases:
  - "sk-code benchmark reports"
  - "sk-code benchmark index"
importance_tier: "important"
contextType: "general"
---

# sk-code Benchmark Reports

> Curated reports derived from completed benchmark runs, newest first. Raw execution evidence stays in the packet that produced it, named in each run's `source.md`.

---

## 1. OVERVIEW

Each row below is one run folder. Rows are written by the benchmark harness at the moment it writes the report, so this table cannot fall behind the folders beside it.

---

## 2. RUN INDEX

| Executed | Folder | Runtime | Result | Verdict | Source |
|---|---|---|---|---|---|
| 2026-07-10 | [`2026-07-10--router-baseline--router/`](./2026-07-10--router-baseline--router/) | router | 30 PASS | **PASS** 85/100 | not recorded |
| 2026-07-10 | [`2026-07-10--live-mode-b--live/`](./2026-07-10--live-mode-b--live/) | live | 18 PASS, 12 FAIL | **CONDITIONAL** 66/100 | not recorded |
| 2026-06-02 | [`2026-06-02--d4r-live--live/`](./2026-06-02--d4r-live--live/) | live | 5 PASS | **PASS** 88/100 | not recorded |
| 2026-06-01 | [`2026-06-01--router-final--router/`](./2026-06-01--router-final--router/) | router | 29 PASS | **PASS** 84/100 | not recorded |
| 2026-06-01 | [`2026-06-01--live-remediated--live/`](./2026-06-01--live-remediated--live/) | live | 4 PASS, 1 FAIL | **CONDITIONAL** 79/100 | not recorded |
| 2026-06-01 | [`2026-06-01--live-final--live/`](./2026-06-01--live-final--live/) | live | 4 PASS, 1 FAIL | **CONDITIONAL** 71/100 | not recorded |
| 2026-06-01 | [`2026-06-01--live--live/`](./2026-06-01--live--live/) | live | 3 PASS | **CONDITIONAL** 76/100 | not recorded |
| 2026-06-01 | [`2026-06-01--full--router/`](./2026-06-01--full--router/) | router | 2 FAIL | **CONDITIONAL** 55/100 | not recorded |
| 2026-06-01 | [`2026-06-01--after--router/`](./2026-06-01--after--router/) | router | 2 PASS | **CONDITIONAL** 69/100 | not recorded |

---

## 3. STORAGE RULE

Run folders are named `<YYYY-MM-DD>--<subject>--<variant>`, dated by execution. Keep curated summaries and machine-readable result tables here, and raw transcripts and copied artifacts in the source packet. A run whose result changes gets a new folder rather than overwriting a prior one.

The grammar and the report file set are owned by `create-benchmark`; this index states them only so the folder reads on its own. Where the two differ, that skill is correct.
