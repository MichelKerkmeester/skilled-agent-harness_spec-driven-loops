# 2026-10-27--finding-accuracy--live

_Derived after the fact from this run's stored record, not written at run time._

> sk-code-review · live

**Verdict: FAIL** · aggregate D4 only: 67/100

---

## 1. OVERVIEW

This is a curated report. Raw execution evidence stays in the packet that produced it, named in `source.md`. Every file here is generated from the run record: a field this run did not capture reads as not recorded rather than being filled in.

---

## 2. RUN

| Field | Value |
|---|---|
| Target skill | sk-code-review |
| Scoring method | live-finding-accuracy |
| Trace mode | live |
| Executor | pi (print mode, read-only tools read, grep, find, ls) |
| Model | llmgateway/deepseek-v4.1-flash-1017 (thinking max) |
| Scenarios | 3 |
| Outcome tally | 2 PASS, 1 FAIL |

---

## 3. RESULTS

| Measure | Result | Target |
|---|---|---|
| CR-025 duration | 111 s | recorded |
| CR-025 tokens | 240052 total (27770 input, 12346 output, 199936 cache read) | recorded |
| CR-026 duration | 74 s | recorded |
| CR-026 tokens | 243799 total (29655 input, 7296 output, 206848 cache read) | recorded |
| CR-027 duration | 82 s | recorded |
| CR-027 tokens | 134514 total (23533 input, 10629 output, 100352 cache read) | recorded |
| D4 finding accuracy | 67/100 (2 of 3 scenarios met gold) | 100/100 |

---

## 4. FILES

| File | Contents |
|---|---|
| [`skill-benchmark-report.json`](./skill-benchmark-report.json) | The machine record every other file here derives from |
| [`skill-benchmark-report.md`](./skill-benchmark-report.md) | Rendered scoring report, regenerated from the JSON and never hand-edited |
| [`results.csv`](./results.csv) | One row per scenario, for spreadsheet and diff use |
| [`failed-runs.md`](./failed-runs.md) | Per-scenario failure detail, or a statement that none was captured |
| [`findings-and-recommendations.md`](./findings-and-recommendations.md) | Failures grouped by their recorded reason |
| [`source.md`](./source.md) | Where the corpus, the gold and the raw evidence live |

