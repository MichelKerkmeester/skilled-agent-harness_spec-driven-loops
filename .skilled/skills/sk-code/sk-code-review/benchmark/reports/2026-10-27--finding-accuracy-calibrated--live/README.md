# 2026-10-27--finding-accuracy-calibrated--live

_Derived after the fact from this run's stored record, not written at run time._

> sk-code-review · live

**Verdict: PASS** · aggregate D4 only: 100/100

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
| Scenarios | 10 |
| Outcome tally | 9 PASS, 1 RECORDED |

---

## 3. RESULTS

| Measure | Result | Target |
|---|---|---|
| CR-025 run 1 duration | 41 s | recorded |
| CR-025 run 1 tokens | 327951 total (39054 input, 11201 output, 277696 cache read) | recorded |
| CR-025 run 2 duration | 54 s | recorded |
| CR-025 run 2 tokens | 205734 total (29748 input, 9138 output, 166848 cache read) | recorded |
| CR-025 run 3 duration | 51 s | recorded |
| CR-025 run 3 tokens | 343266 total (40086 input, 8588 output, 294592 cache read) | recorded |
| CR-026 run 1 duration | 31 s | recorded |
| CR-026 run 1 tokens | 125129 total (19964 input, 8269 output, 96896 cache read) | recorded |
| CR-026 run 2 duration | 41 s | recorded |
| CR-026 run 2 tokens | 160801 total (21441 input, 7264 output, 132096 cache read) | recorded |
| CR-026 run 3 duration | 51 s | recorded |
| CR-026 run 3 tokens | 245241 total (27308 input, 9933 output, 208000 cache read) | recorded |
| CR-027 run 1 duration | 57 s | recorded |
| CR-027 run 1 tokens | 151091 total (32745 input, 10634 output, 107712 cache read) | recorded |
| CR-027 run 2 duration | 64 s | recorded |
| CR-027 run 2 tokens | 253801 total (31527 input, 12546 output, 209728 cache read) | recorded |
| CR-027 run 3 duration | 46 s | recorded |
| CR-027 run 3 tokens | 152551 total (32342 input, 11409 output, 108800 cache read) | recorded |
| CR-027 supplemental duration | 71 s | recorded |
| CR-027 supplemental tokens | 168063 total (42778 input, 17765 output, 107520 cache read) | recorded |
| CR-025 pass rate | 3 of 3 runs met gold | 3 of 3 |
| CR-026 pass rate | 3 of 3 runs met gold | 3 of 3 |
| CR-027 pass rate | 3 of 3 runs met gold | 3 of 3 |
| D4 finding accuracy | 100/100 (9 of 9 primary runs met gold) | 100/100 |

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

