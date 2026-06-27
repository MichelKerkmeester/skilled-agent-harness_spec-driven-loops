# Skill Benchmark Report — design-foundations

> Rendered from report.json (do not hand-edit). Scoring: `mode-b-live` · trace mode: `live`.

**Verdict: CONDITIONAL** · aggregate 62/100

## Coverage

- Scored (text executors): **6** · routed out to browser harness: **0**
- By class — routing: 6 · advisor: 0 · browser: 0

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | 50/100 |
| D2 discovery | 20pts | 83/100 |
| D3 efficiency | 15pts | 42/100 |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 100/100 |

_Unscored in this run (need live mode): D1inter, D4._

### Advisory signals (NOT in the weighted aggregate)

- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: _unscored (run --d4 in live mode)_
- **Asset support recall** — deferred `assets/*` gold (router defers these on demand): _deferred (router) or no asset gold_

## Funnel

- routed-intra: 1
- passed: 5

**Headline bottleneck: routed-intra**

## Ranked bottlenecks

| Severity | Class | Locus | Finding |
| -------- | ----- | ----- | ------- |
| P1 | funnel_attrition | routed-intra | 1 scenario(s) first fail at stage 'routed-intra' |

## Scenarios

| Scenario | Class | Score | First failing stage |
| -------- | ----- | ----- | ------------------- |
| 001-token-starter-handoff | routing | 0/100 | routed-intra |
| 001-chart-encoding-and-color | routing | 74/100 | passed |
| 001-layout-rhythm-responsive | routing | 68/100 | passed |
| 002-context-adaptation-matrix | routing | 74/100 | passed |
| 001-type-roles-and-measure | routing | 74/100 | passed |
| 001-oklch-palette-and-dark-mode | routing | 79/100 | passed |

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode.
- Scenario count: 6.
