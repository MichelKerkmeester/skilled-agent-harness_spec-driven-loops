# Skill Benchmark Report — sk-code

> Rendered from report.json (do not hand-edit). Scoring: `mode-b-live` · trace mode: `live`.

**Verdict: CONDITIONAL** · aggregate 66/100

## Coverage

- Scored (text executors): **30** · routed out to browser harness: **0**
- By class — routing: 21 · advisor: 2 · browser: 7

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | 67/100 |
| D2 discovery | 20pts | 67/100 |
| D3 efficiency | 15pts | 53/100 |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 100/100 |

_Unscored in this run (need live mode): D1inter, D4._

### Advisory signals (NOT in the weighted aggregate)

- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: _unscored (run --d4 in live mode)_
- **Asset support recall** — deferred `assets/*` gold (router defers these on demand): 29/100

## Funnel

- routed-intra: 5
- passed: 18
- browser: 6
- surface-mismatch: 1

**Headline bottleneck: browser**

## Ranked bottlenecks

| Severity | Class | Locus | Finding |
| -------- | ----- | ----- | ------- |
| P1 | funnel_attrition | browser | 6 scenario(s) first fail at stage 'browser' |

## Scenarios

| Scenario | Class | Score | First failing stage |
| -------- | ----- | ----- | ------------------- |
| SD-001 | routing | 45/100 | routed-intra |
| SD-002 | routing | 63/100 | passed |
| SD-003 | routing | 0/100 | routed-intra |
| LS-001 | routing | 95/100 | passed |
| LS-002 | routing | 88/100 | passed |
| LS-003 | routing | 100/100 | passed |
| LS-004 | routing | 73/100 | passed |
| RD-001 | routing | 100/100 | passed |
| RD-002 | advisor | 100/100 | passed |
| SA-001 | advisor | 100/100 | passed |
| MR-001 | browser | 100/100 | passed |
| MR-002 | browser | 50/100 | browser |
| MR-003 | browser | 50/100 | browser |
| MR-004 | browser | 50/100 | browser |
| CB-001 | browser | 50/100 | browser |
| CB-002 | browser | 50/100 | browser |
| CB-003 | browser | 50/100 | browser |
| CS-001 | routing | 45/100 | routed-intra |
| CS-002 | routing | 50/100 | passed |
| CS-003 | routing | 0/100 | routed-intra |
| CS-004 | routing | 20/100 | surface-mismatch |
| CS-005 | routing | 67/100 | passed |
| CS-006 | routing | 60/100 | passed |
| CS-007 | routing | 57/100 | passed |
| DR-001 | routing | 20/100 | routed-intra |
| DR-002 | routing | 100/100 | passed |
| DR-003 | routing | 100/100 | passed |
| DR-004 | routing | 100/100 | passed |
| TH-001 | routing | 100/100 | passed |
| TH-002 | routing | 100/100 | passed |

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode. Advisory signals: mode precision unscored; relative ranking unscored (no advisor probe or no rank-below gold); route gold rows 0; telemetry missing n/a (0/0); route misses n/a (0/0); alias misses n/a (0/0); bundle misses n/a (0/0); recipe misses n/a (0/0).
- Scenario count: 30.
