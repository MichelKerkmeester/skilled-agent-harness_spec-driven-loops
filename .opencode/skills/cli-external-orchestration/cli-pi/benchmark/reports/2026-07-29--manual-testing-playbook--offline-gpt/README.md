# 2026-07-29--manual-testing-playbook--offline-gpt

_Derived after the fact from this run's stored record, not written at run time._

> cli-pi · live · claude · gpt (offline via openai-codex-responses) · offline

**Verdict: PASS**

## 1. OVERVIEW

| Field | Value |
|---|---|
| Target skill | cli-pi |
| Scoring method | not-recorded |
| Trace mode | live |
| Executor | claude |
| Model | gpt (offline via openai-codex-responses) |
| Scenarios | 4 |
| Outcome tally | 3 PASS, 1 SKIP |

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

This is a curated report. Raw execution evidence stays in the packet that produced it, named in `source.md`. Every file here is generated from the packet's captured record: a field this run's evidence did not capture reads as not-recorded rather than being filled in.
