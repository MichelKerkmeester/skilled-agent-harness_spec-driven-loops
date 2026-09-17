# 2026-09-14-phase-008-first-pass

_Derived after the fact from this run's stored record, not written at run time._

> cli-hermes · live · claude · glm-5.3-flash (llmgateway, --reasoning none) · phase-008-first-pass

**Verdict: FAIL**

## 1. OVERVIEW

| Field | Value |
|---|---|
| Target skill | cli-hermes |
| Scoring method | not-recorded |
| Trace mode | live |
| Executor | claude |
| Model | glm-5.3-flash (llmgateway, `--reasoning none`) |
| CLI version | Hermes Agent v0.21.1 (2026.9.7) · upstream dc90a75a |
| Scenarios | 19 live, 14 hermetic |
| Outcome tally | 17 PASS, 2 FAIL, 14 SKIP (all hermetic) |

The run verdict is FAIL because two live scenarios failed, each with a located cause rather than an unexplained result. Seventeen of nineteen live scenarios passed, three of them against paired negative controls.

---

## 2. FILES

| File | Contents |
|---|---|
| [`skill-benchmark-report.json`](./skill-benchmark-report.json) | The machine record every other file here derives from |
| [`skill-benchmark-report.md`](./skill-benchmark-report.md) | The same report rendered for reading |
| [`results.csv`](./results.csv) | One row per checked behavior, for spreadsheet and diff use |
| [`failed-runs.md`](./failed-runs.md) | Per-behavior failure detail for the two FAIL verdicts |
| [`findings-and-recommendations.md`](./findings-and-recommendations.md) | Failures and boundaries grouped by their recorded reason |
| [`source.md`](./source.md) | Where the packet, playbook, and raw evidence live |

---

## 3. READING THIS FOLDER

This is a curated report. Raw execution evidence stays in the session that produced it, named in `source.md`, with each scenario file's Recorded Result carrying the load-bearing excerpt. Every file here is generated from that captured record: a field this run's evidence did not capture reads as not-recorded rather than being filled in.
