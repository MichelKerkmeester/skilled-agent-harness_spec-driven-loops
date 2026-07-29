# 2026-07-29--manual-testing-playbook--goal-hook

_Derived after the fact from this run's stored record, not written at run time._

> cli-devin · live · claude · glm-5-2 · free

**Verdict: PASS**

## 1. OVERVIEW

This folder captures the goal-hook `DV-022` live model-turn injection proof for `cli-devin`, run against a real `devin -p` session on the free-tier `glm-5-2` model. It is a hand-derived manual-testing-playbook validation record, not a deep-improvement Lane C skill-benchmark run — there is no D1-D5 score to report.

| Field | Value |
|---|---|
| Target skill | cli-devin |
| Playbook scenario | DV-022 |
| Scoring method | not recorded |
| Trace mode | live |
| Executor | claude |
| Model | glm-5-2 (free) |
| Scenarios | 1 |
| Outcome tally | 1 PASS |

## 2. FILES

| File | Contents |
|---|---|
| [`skill-benchmark-report.json`](./skill-benchmark-report.json) | The machine record every other file here derives from |
| [`skill-benchmark-report.md`](./skill-benchmark-report.md) | Hand-authored render of the JSON, styled after the Lane C report shape |
| [`results.csv`](./results.csv) | One row per scenario, for spreadsheet and diff use |
| [`failed-runs.md`](./failed-runs.md) | Per-scenario failure detail, or a statement that none was captured |
| [`findings-and-recommendations.md`](./findings-and-recommendations.md) | Failures grouped by their recorded reason |
| [`source.md`](./source.md) | Where the corpus, the gold and the raw evidence live |

## 3. READING THIS FOLDER

This is a curated report. Raw execution evidence stays in the packet that produced it, named in `source.md`. Every file here is generated from the run record: a field this run did not capture reads as not recorded rather than being filled in. This run captures the `DV-022` live model-turn injection proof only, not the full playbook's manage-CLI-envelope or adapter checks — see `skill-benchmark-report.md` Methodology / caveats.
