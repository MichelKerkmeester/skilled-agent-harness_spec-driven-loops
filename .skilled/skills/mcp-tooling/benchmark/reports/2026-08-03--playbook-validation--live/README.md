# 2026-08-03--playbook-validation--live

> mcp-tooling · live

**Verdict: BLOCKED-BY-ROUTE-GOLD** · aggregate 42/100

## Run

| Field | Value |
|---|---|
| Target skill | mcp-tooling |
| Scoring method | mode-b-live |
| Trace mode | live |
| Executor | not recorded |
| Model | not recorded |
| Scenarios | 16 |
| Outcome tally | 10 PASS, 6 FAIL |

## Files

| File | Contents |
|---|---|
| [`skill-benchmark-report.json`](./skill-benchmark-report.json) | The machine record every other file here derives from |
| [`skill-benchmark-report.md`](./skill-benchmark-report.md) | Rendered scoring report, regenerated from the JSON and never hand-edited |
| [`results.csv`](./results.csv) | One row per scenario, for spreadsheet and diff use |
| [`failed-runs.md`](./failed-runs.md) | Per-scenario failure detail, or a statement that none was captured |
| [`findings-and-recommendations.md`](./findings-and-recommendations.md) | Failures grouped by their recorded reason |
| [`source.md`](./source.md) | Where the corpus, the gold and the raw evidence live |

## Reading This Folder

This is a curated report. Raw execution evidence stays in the packet that produced it, named in `source.md`. Every file here is generated from the run record: a field this run did not capture reads as not recorded rather than being filled in.
