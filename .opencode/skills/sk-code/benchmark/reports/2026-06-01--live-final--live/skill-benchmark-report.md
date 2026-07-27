# Skill Benchmark Report — sk-code

> Rendered from report.json (do not hand-edit). Scoring: `mode-b-live` · trace mode: `live`.

**Verdict: CONDITIONAL** · aggregate 71/100

## Coverage

- Scored (text executors): **5** · routed out to browser harness: **0**
- By class — routing: 3 · advisor: 1 · browser: 1

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | 0/100 |
| D1 intra (router) | 13pts | 92/100 |
| D2 discovery | 20pts | 87/100 |
| D3 efficiency | 15pts | 42/100 |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 100/100 |

_Unscored in this run (need live mode): D4._

## Funnel

- passed: 4
- activated-inter: 1

**Headline bottleneck: activated-inter**

## Ranked bottlenecks

| Severity | Class | Locus | Finding |
| -------- | ----- | ----- | ------- |
| P1 | funnel_attrition | activated-inter | 1 scenario(s) first fail at stage 'activated-inter' |

## Scenarios

| Scenario | Class | Score | First failing stage |
| -------- | ----- | ----- | ------------------- |
| SD-001 | routing | 65/100 | passed |
| LS-001 | routing | 79/100 | passed |
| RD-002 | advisor | 55/100 | activated-inter |
| MR-001 | browser | 100/100 | passed |
| CS-001 | routing | 57/100 | passed |

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode.
- Scenario count: 5.
