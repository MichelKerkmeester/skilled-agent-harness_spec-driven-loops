# Skill Benchmark Report — sk-doc

> Rendered from report.json (do not hand-edit). Scoring: `mode-b-live` · trace mode: `live`.

**Verdict: FAIL** · aggregate 20/100

## Coverage

- Scored (text executors): **19** · routed out to browser harness: **0**
- By class — routing: 19 · advisor: 0 · browser: 0

## Generalization (fitted vs holdout)

- Fitted aggregate: **20/100** · holdout: _none declared_ · negatives: 0
- _no holdout-staged scenarios; fitted aggregate equals the overall score (score-preserving)_

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | 24/100 |
| D2 discovery | 20pts | 24/100 |
| D3 efficiency | 15pts | 8/100 |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 100/100 |

_Unscored in this run (need live mode): D1inter, D4._

### Advisory signals (NOT in the weighted aggregate)

- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: _unscored (run --d4 in live mode)_
- **Asset support recall** — deferred `assets/*` gold (router defers these on demand): _deferred (router) or no asset gold_

## Funnel

- routed-intra: 13
- passed: 6

**Headline bottleneck: routed-intra**

## Ranked bottlenecks

| Severity | Class | Locus | Finding |
| -------- | ----- | ----- | ------- |
| P1 | funnel_attrition | routed-intra | 13 scenario(s) first fail at stage 'routed-intra' |

## Scenarios

| Scenario | Class | Stage | Score | First failing stage |
| -------- | ----- | ----- | ----- | ------------------- |
| SD-007 | routing | routing | 0/100 | routed-intra |
| SD-009 | routing | routing | 0/100 | routed-intra |
| SD-008 | routing | routing | 100/100 | passed |
| SD-015 | routing | routing | 0/100 | routed-intra |
| SD-014 | routing | routing | 52/100 | passed |
| SD-013 | routing | routing | 0/100 | routed-intra |
| SD-005 | routing | routing | 0/100 | routed-intra |
| SD-006 | routing | routing | 40/100 | passed |
| SD-004 | routing | routing | 0/100 | routed-intra |
| SD-003 | routing | routing | 0/100 | routed-intra |
| SD-001 | routing | routing | 0/100 | routed-intra |
| SD-017 | routing | routing | 40/100 | passed |
| SD-016 | routing | routing | 0/100 | routed-intra |
| SD-002 | routing | routing | 52/100 | passed |
| SD-011 | routing | routing | 0/100 | routed-intra |
| SD-012 | routing | routing | 100/100 | passed |
| SD-010 | routing | routing | 0/100 | routed-intra |
| SD-018 | routing | routing | 0/100 | routed-intra |
| SD-020 | routing | routing | 0/100 | routed-intra |

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode. Advisory signals: mode precision unscored; relative ranking unscored (no advisor probe or no rank-below gold); route gold rows 0; telemetry missing n/a (0/0); route misses n/a (0/0); alias misses n/a (0/0); bundle misses n/a (0/0); recipe misses n/a (0/0).
- Scenario count: 19.
