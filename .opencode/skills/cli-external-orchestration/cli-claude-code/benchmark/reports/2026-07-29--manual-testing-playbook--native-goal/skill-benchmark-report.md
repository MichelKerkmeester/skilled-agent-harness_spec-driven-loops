# Skill Benchmark Report — cli-claude-code

_Derived after the fact from this run's stored record, not written at run time._

> Hand-rendered from the stored scenario record — no `build-report.cjs` run backs this report. Scoring: `not-recorded` · trace mode: `doc`.

**Verdict: SKIP**

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | — | — |
| D1 intra (router) | — | — |
| D2 discovery | — | — |
| D3 efficiency | — | — |
| D4 usefulness | — | — |
| D5 connectivity | — | — |

## Scenarios

| Scenario | Hub | Stage | Score | Verdict | Reason |
| -------- | --- | ----- | ----- | ------- | ------ |
| CC-029 | cli-claude-code | documentation | not-recorded | SKIP | claude-native-goal-no-cross-runtime-adapter-no-headless-dispatch |

## Provenance & execution context

_Hand-derived — this report was authored after the fact from the CC-029 scenario record. It was not written by the compiled-routing archiver and not rendered by `build-report.cjs`._

| Field | Value |
| ----- | ----- |
| Skill root (repo-relative) | `.opencode/skills/cli-external-orchestration/cli-claude-code` |
| Authored at | 2026-07-29 |
| Spec folder | `.opencode/specs/cli-external-orchestration/034-goal-hook-playbooks-and-validation` |
| Source scenario | `.opencode/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/goal-hook/goal-hook.md` (CC-029) |
| Constitutional rule | `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md` |
| Executor / model | claude / not-recorded |
| Dispatch | none — no headless model turn was run |
| Scenario IDs | CC-029 |

## Funnel

_Not applicable — documentation-only scenario, no live scoring funnel was run._

## Ranked bottlenecks

_None._

## Methodology / caveats

- Claude Code ships its own native `/goal` session-goal feature; the cross-runtime goal-hook port at `.opencode/hooks/goal/` deliberately ships no `claude/` adapter directory (confirmed live: `ls .opencode/hooks/goal/` returns `README.md bin cursor devin lib opencode pi`, no `claude` entry).
- Verdict SKIP applies to the live model-turn check only. The underlying documentation-boundary checks (constitutional rule + hook README + no `claude/` adapter) are PASS per scenario `CC-029` in the goal-hook manual-testing-playbook.
- Scenario count: 1.
