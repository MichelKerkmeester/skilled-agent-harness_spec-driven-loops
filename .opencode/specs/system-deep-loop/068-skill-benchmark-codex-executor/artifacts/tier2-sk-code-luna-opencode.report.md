# Skill Benchmark Report — sk-code

> Rendered from report.json (do not hand-edit). Scoring: `mode-b-live` · trace mode: `live`.

**Verdict: CONDITIONAL** · aggregate 65/100

## Coverage

- Scored (text executors): **30** · routed out to browser harness: **0**
- By class — routing: 21 · advisor: 2 · browser: 7
- By stage — holdout: 0 · negative (suppression): 6

## Generalization (fitted vs holdout)

- Fitted aggregate: **65/100** · holdout: _none declared_ · negatives: 6
- _no holdout-staged scenarios; fitted aggregate equals the overall score (score-preserving)_

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | 65/100 |
| D2 discovery | 20pts | 65/100 |
| D3 efficiency | 15pts | 58/100 |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 100/100 |

_Unscored in this run (need live mode): D1inter, D4._

### Advisory signals (NOT in the weighted aggregate)

- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: _unscored (run --d4 in live mode)_
- **Asset support recall** — deferred `assets/*` gold (router defers these on demand): 58/100

## Funnel

- passed: 18
- routed-intra: 6
- browser: 6

**Headline bottleneck: routed-intra**

## Ranked bottlenecks

| Severity | Class | Locus | Finding |
| -------- | ----- | ----- | ------- |
| P1 | funnel_attrition | routed-intra | 6 scenario(s) first fail at stage 'routed-intra' |

## Scenarios

| Scenario | Class | Stage | Score | First failing stage |
| -------- | ----- | ----- | ----- | ------------------- |
| SD-001 | routing | routing | 100/100 | passed |
| SD-002 | routing | routing | 0/100 | routed-intra |
| SD-003 | routing | negative | 0/100 | routed-intra |
| LS-001 | routing | routing | 100/100 | passed |
| LS-002 | routing | routing | 0/100 | routed-intra |
| LS-003 | routing | routing | 100/100 | passed |
| LS-004 | routing | routing | 0/100 | routed-intra |
| RD-001 | routing | negative | 100/100 | passed |
| RD-002 | advisor | routing | 100/100 | passed |
| SA-001 | advisor | routing | 100/100 | passed |
| MR-001 | browser | routing | 100/100 | passed |
| MR-002 | browser | routing | 50/100 | browser |
| MR-003 | browser | routing | 50/100 | browser |
| MR-004 | browser | routing | 50/100 | browser |
| CB-001 | browser | routing | 50/100 | browser |
| CB-002 | browser | routing | 50/100 | browser |
| CB-003 | browser | routing | 50/100 | browser |
| CS-001 | routing | routing | 79/100 | passed |
| CS-002 | routing | negative | 67/100 | passed |
| CS-003 | routing | routing | 0/100 | routed-intra |
| CS-004 | routing | negative | 60/100 | passed |
| CS-005 | routing | negative | 50/100 | passed |
| CS-006 | routing | routing | 100/100 | passed |
| CS-007 | routing | routing | 100/100 | passed |
| DR-001 | routing | negative | 0/100 | routed-intra |
| DR-002 | routing | routing | 100/100 | passed |
| DR-003 | routing | routing | 100/100 | passed |
| DR-004 | routing | routing | 100/100 | passed |
| TH-001 | routing | routing | 100/100 | passed |
| TH-002 | routing | routing | 100/100 | passed |

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode. Advisory signals: mode precision unscored; relative ranking unscored (no advisor probe or no rank-below gold); route gold rows 0; telemetry missing n/a (0/0); route misses n/a (0/0); alias misses n/a (0/0); bundle misses n/a (0/0); recipe misses n/a (0/0).
- Scenario count: 30.
