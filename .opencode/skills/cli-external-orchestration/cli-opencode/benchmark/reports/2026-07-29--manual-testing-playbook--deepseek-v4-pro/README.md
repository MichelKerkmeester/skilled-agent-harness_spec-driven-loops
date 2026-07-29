# 2026-07-29--manual-testing-playbook--deepseek-v4-pro

_Derived after the fact from this run's stored record, not written at run time._

> cli-opencode · live · claude · deepseek-v4-pro + openai/gpt-5.6-luna · headless

**Verdict: SKIP**

## 1. OVERVIEW

| Field | Value |
|---|---|
| Target skill | cli-opencode |
| Scoring method | not-recorded |
| Trace mode | live |
| Executor | claude |
| Model | deepseek-v4-pro; openai/gpt-5.6-luna |
| Scenarios | 3 |
| Outcome tally | 0 PASS, 3 SKIP |

## 2. FILES

| File | Contents |
|---|---|
| [`skill-benchmark-report.json`](./skill-benchmark-report.json) | The machine record every other file here derives from |
| [`skill-benchmark-report.md`](./skill-benchmark-report.md) | The same report rendered for reading |
| [`results.csv`](./results.csv) | One row per checked behavior, for spreadsheet and diff use |
| [`failed-runs.md`](./failed-runs.md) | Per-behavior failure detail, or a statement that none was captured |
| [`findings-and-recommendations.md`](./findings-and-recommendations.md) | Failures and boundaries grouped by their recorded reason |
| [`source.md`](./source.md) | Where the packet, playbook, and raw evidence live |

## 3. READING THIS FOLDER

This is a curated report. Raw execution evidence stays in the packet that produced it, named in `source.md`. Every file here is generated from the packet's captured record: a field this run's evidence did not capture reads as not-recorded rather than being filled in. The SKIP verdict here is a headless-surface limitation, not a model failure and not a regression -- see `findings-and-recommendations.md`.
