# 2026-07-29--manual-testing-playbook--goal-hook

_Derived after the fact from this run's stored record, not written at run time._

> cli-claude-code · doc · claude · not-recorded · native-goal

**Verdict: SKIP**

## Run

| Field | Value |
|---|---|
| Target skill | cli-claude-code |
| Scoring method | not recorded |
| Trace mode | doc |
| Executor | claude |
| Model | not-recorded (no dispatch) |
| Scenarios | 1 |
| Outcome tally | 1 SKIP |

## Files

| File | Contents |
|---|---|
| [`skill-benchmark-report.json`](./skill-benchmark-report.json) | The machine record every other file here derives from |
| [`skill-benchmark-report.md`](./skill-benchmark-report.md) | Rendered scoring report, hand-derived from the JSON for this documentation-only entry — no `build-report.cjs` run backs it |
| [`results.csv`](./results.csv) | One row per scenario, for spreadsheet and diff use |
| [`failed-runs.md`](./failed-runs.md) | Per-scenario failure detail, or a statement that none was captured |
| [`findings-and-recommendations.md`](./findings-and-recommendations.md) | Failures grouped by their recorded reason |
| [`source.md`](./source.md) | Where the corpus, the gold and the raw evidence live |

## Reading This Folder

This is a curated, hand-derived report, not a Lane C harness run. Claude Code ships its own native `/goal` session-goal feature; the cross-runtime goal-hook port at `.opencode/hooks/goal/` deliberately ships no `claude/` adapter, and there is no headless model-turn surface to dispatch against. Every file here is generated from the stored `CC-029` scenario record in the goal-hook manual-testing-playbook: a field this run did not capture reads as not recorded rather than being filled in.
