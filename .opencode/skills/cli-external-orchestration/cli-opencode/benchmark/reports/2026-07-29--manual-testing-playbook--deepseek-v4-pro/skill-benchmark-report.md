# Skill Benchmark Report -- cli-opencode

_Derived after the fact from this run's stored record, not written at run time._

> Manual-testing-playbook validation, not a Lane C D1-D5 skill-benchmark run. Scoring: `not-recorded` · trace mode: `live`.

**Verdict: SKIP**

## Run

| Field | Value |
|---|---|
| Target skill | cli-opencode |
| Scoring method | not-recorded |
| Trace mode | live |
| Executor | claude |
| Model | deepseek-v4-pro; openai/gpt-5.6-luna |
| Variant | headless |
| Scenarios | 3 |
| Outcome tally | 0 PASS, 3 SKIP |

## Scenarios

| Scenario | Stage | Provider model | Verdict | Reason |
|---|---|---|---|---|
| CO-039-HEADLESS-TOOL-DEEPSEEK | tool-exposure | deepseek-v4-pro | SKIP | mk_goal tool not exposed to the headless run agent |
| CO-039-HEADLESS-TOOL-LUNA | tool-exposure | openai/gpt-5.6-luna | SKIP | mk_goal referenced but never executed; no goal persisted |
| CO-039-HEADLESS-TRANSFORM-DEEPSEEK | chat-system-transform | deepseek-v4-pro | SKIP | transform did not fire against a pre-seeded ACTIVE goal state |

## Methodology / caveats

- This report is a hand-derived compilation of an already-captured live validation attempt, not a fresh Lane C harness run -- no D1-D5 dimension scoring applies.
- `score` is `not-recorded` for every row: this run's stored evidence never carried a numeric score.
- Every verdict here is SKIP, not FAIL: both structural causes (tool not exposed, transform not fired) are a headless-surface limitation of `opencode run`, independent of model quality, and orthogonal to packet `032-goal-hooks-cross-runtime`.
- This run covers only `CO-039`'s live headless `opencode run` supplemental check. The scenario's primary contract (direct in-process invocation of the shipped plugin) independently returned an overall PASS, documented in `cli-opencode/manual-testing-playbook/goal-hook/goal-hook.md`, not in this report.
- mk-goal's `setGoal` / injection / lifecycle / supervisor behavior remains covered by its 7 committed unit suites (`.opencode/plugins/tests/mk-goal-*.test.cjs`).
