# Skill Benchmark Report — design-interface

> Rendered from report.json (do not hand-edit). Scoring: `mode-b-live` · trace mode: `live`.

**Verdict: CONDITIONAL** · aggregate 70/100

## Coverage

- Scored (text executors): **14** · routed out to browser harness: **0**
- By class — routing: 14 · advisor: 0 · browser: 0

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | 54/100 |
| D2 discovery | 20pts | 91/100 |
| D3 efficiency | 15pts | 57/100 |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 100/100 |

_Unscored in this run (need live mode): D1inter, D4._

### Advisory signals (NOT in the weighted aggregate)

- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: _unscored (run --d4 in live mode)_
- **Asset support recall** — deferred `assets/*` gold (router defers these on demand): _deferred (router) or no asset gold_

## Funnel

- passed: 12
- routed-intra: 2

**Headline bottleneck: routed-intra**

## Ranked bottlenecks

| Severity | Class | Locus | Finding |
| -------- | ----- | ----- | ------- |
| P1 | funnel_attrition | routed-intra | 2 scenario(s) first fail at stage 'routed-intra' |

## Scenarios

| Scenario | Class | Score | First failing stage |
| -------- | ----- | ----- | ------------------- |
| ID-014 | routing | 68/100 | passed |
| ID-013 | routing | 74/100 | passed |
| ID-012 | routing | 66/100 | passed |
| ID-011 | routing | 59/100 | routed-intra |
| ID-010 | routing | 74/100 | passed |
| ID-008 | routing | 63/100 | passed |
| ID-009 | routing | 79/100 | passed |
| ID-007 | routing | 89/100 | passed |
| ID-005 | routing | 31/100 | routed-intra |
| ID-006 | routing | 89/100 | passed |
| ID-004 | routing | 64/100 | passed |
| ID-003 | routing | 66/100 | passed |
| ID-002 | routing | 89/100 | passed |
| ID-001 | routing | 74/100 | passed |

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode.
- Scenario count: 14.
