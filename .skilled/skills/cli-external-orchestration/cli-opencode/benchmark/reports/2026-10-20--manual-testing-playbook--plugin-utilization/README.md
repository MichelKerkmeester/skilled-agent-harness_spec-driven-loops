# 2026-10-20--manual-testing-playbook--plugin-utilization

_Derived after the fact from this run's stored record, not written at run time._

> cli-opencode · live · opencode · llmgateway/deepseek-v4.1-flash · high

**Verdict: FAIL**

## 1. OVERVIEW

| Field | Value |
|---|---|
| Target skill | cli-opencode |
| Scoring method | not-applicable-manual-outcome |
| Trace mode | live |
| Executor | opencode |
| Model | llmgateway/deepseek-v4.1-flash, high effort |
| Scenarios | 34 |
| Outcome tally | 27 PASS, 7 FAIL |

---

## 2. FILES

| File | Contents |
|---|---|
| [`skill-benchmark-report.json`](./skill-benchmark-report.json) | The machine record every other file here derives from |
| [`skill-benchmark-report.md`](./skill-benchmark-report.md) | The same report rendered for reading |
| [`results.csv`](./results.csv) | One row per checked behavior, for spreadsheet and diff use |
| [`failed-runs.md`](./failed-runs.md) | Per-behavior failure detail |
| [`findings-and-recommendations.md`](./findings-and-recommendations.md) | Failures grouped by their recorded cause |
| [`source.md`](./source.md) | Where the packet, playbook, and raw evidence live |

---

## 3. READING THIS FOLDER

This is a curated report. Raw execution evidence stays in the packet that produced it, named in `source.md`. All 17 plugins passed on OpenCode 1.19.3. Seven scenarios failed on OpenCode 2.0.32 because the checked effect was missing (session-cleanup still logged its dispose step); `findings-and-recommendations.md` gives the three causes.
