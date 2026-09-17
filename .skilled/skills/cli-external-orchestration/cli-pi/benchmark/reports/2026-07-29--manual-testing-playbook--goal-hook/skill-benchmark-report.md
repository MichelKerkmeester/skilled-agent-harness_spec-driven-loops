# Skill Benchmark Report -- cli-pi

_Derived after the fact from this run's stored record, not written at run time._

> Manual-testing-playbook validation, not a Lane C D1-D5 skill-benchmark run. Scoring: `not-recorded` · trace mode: `live`.

**Verdict: PASS**

## Run

| Field | Value |
|---|---|
| Target skill | cli-pi |
| Scoring method | not-recorded |
| Trace mode | live |
| Executor | claude |
| Model | gpt (offline via openai-codex-responses) |
| Variant | offline |
| Scenarios | 4 |
| Outcome tally | 3 PASS, 1 SKIP |

## Scenarios

| Scenario | Stage | Verdict | Reason |
|---|---|---|---|
| PI-021-INJECT | input-transform | PASS | injection reaches the model turn; canary + Pi-labeled Role line confirmed |
| PI-021-VERIFY | turn_end | PASS | real goal-verify-nudge events fired, observe-only, never blocks |
| PI-021-RESTORE | session_start | SKIP | no goal-context-restore event in a single-shot capture; needs a session-continuation re-run |
| PI-021-CLI-HARDENING | manage-cli | PASS | envelope/budget/kill-switch/hardening confirmed model-free; one boundary documented, not a failure |

## Methodology / caveats

- This report is a hand-derived compilation of an already-captured live validation pass, not a fresh Lane C harness run -- no D1-D5 dimension scoring applies.
- `score` is `not-recorded` for every row: this run's stored evidence never carried a numeric score.
- The `PI-021-RESTORE` SKIP is an observed boundary honestly recorded, not inferred as a failure.
- Source scenario: `PI-021` in `cli-pi/manual-testing-playbook/goal-hook/goal-hook.md`.
