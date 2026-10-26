# 2026-10-26--quality-gate-fixtures--live

_Derived after the fact from this run's stored record, not written at run time._

> sk-code-quality · live

**Verdict: not recorded** · aggregate not recorded

---

## 1. OVERVIEW

This is a curated report. Raw execution evidence stays in the packet that produced it, named in `source.md`. Every file here is generated from the run record: a field this run did not capture reads as not recorded rather than being filled in.

---

## 2. RUN

| Field | Value |
|---|---|
| Target skill | sk-code-quality |
| Scoring method | catch rate, false positive count, wall time and intent recall per scenario, with no weighted dimension score |
| Trace mode | live |
| Executor | node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs for the fixtures and the timing set, and node .skilled/bin/compiled-route.cjs for the intent prompts |
| Model | none, the gate's built-in checks and the compiled route front door are deterministic |
| Scenarios | 6 |
| Outcome tally | 5 PASS, 1 RECORDED |

---

## 3. RESULTS

| Measure | Result | Target |
|---|---|---|
| catch rate | 7 of 7 seeded labels matched on F01 | all 7 seeded labels |
| false positive | 0 findings on F02 and 0 unseeded findings on F01 | 0 |
| wall time | 1661.0 ms max on the 50-file set, largest of five full runs with both built-in checks running | under 2000 ms |
| intent recall | 4 of 4 prompts routed to sk-code-quality | no target, recorded as found |

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

