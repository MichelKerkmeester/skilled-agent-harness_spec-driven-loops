# Skill Benchmark Report — design-motion

> Rendered from report.json (do not hand-edit). Scoring: `mode-b-live` · trace mode: `live`.

**Verdict: CONDITIONAL** · aggregate 70/100

## Coverage

- Scored (text executors): **6** · routed out to browser harness: **0**
- By class — routing: 6 · advisor: 0 · browser: 2

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | 35/100 |
| D2 discovery | 20pts | 59/100 |
| D3 efficiency | 15pts | 61/100 |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 100/100 |

_Unscored in this run (need live mode): D1inter, D4._

### Advisory signals (NOT in the weighted aggregate)

- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: _unscored (run --d4 in live mode)_
- **Asset support recall** — deferred `assets/*` gold (router defers these on demand): _deferred (router) or no asset gold_

## Funnel

- passed: 2
- routed-intra: 4
- browser: 2

**Headline bottleneck: routed-intra**

## Ranked bottlenecks

| Severity | Class | Locus | Finding |
| -------- | ----- | ----- | ------- |
| P1 | funnel_attrition | routed-intra | 4 scenario(s) first fail at stage 'routed-intra' |

## Scenarios

| Scenario | Class | Score | First failing stage |
| -------- | ----- | ----- | ------------------- |
| 001-restraint-gate | routing | 79/100 | passed |
| 001-micro-interactions-feedback | routing | 54/100 | routed-intra |
| 001-performance-and-reduced-motion | browser | — | browser |
| 002-motion-performance-failure-card | browser | — | browser |
| 001-animate-presence-exit-rules | routing | 70/100 | routed-intra |
| 002-animate-presence-checklist | routing | 59/100 | routed-intra |
| 001-purposeful-motion-plan | routing | 89/100 | passed |
| 002-motion-pattern-card | routing | 70/100 | routed-intra |

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode.
- Scenario count: 8.
