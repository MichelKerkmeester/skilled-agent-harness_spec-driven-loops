# Skill Benchmark Report — code-webflow

> Rendered from report.json (do not hand-edit). Scoring: `mode-b-live` · trace mode: `live`.

**Verdict: PASS** · aggregate 86/100

## Coverage

- Scored (text executors): **9** · routed out to browser harness: **0**
- By class — routing: 9 · advisor: 0 · browser: 4

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | 69/100 |
| D2 discovery | 20pts | 69/100 |
| D3 efficiency | 15pts | 56/100 |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 100/100 |

_Unscored in this run (need live mode): D1inter, D4._

### Advisory signals (NOT in the weighted aggregate)

- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: _unscored (run --d4 in live mode)_
- **Asset support recall** — deferred `assets/*` gold (router defers these on demand): _deferred (router) or no asset gold_

## Funnel

- passed: 9
- browser: 4

**Headline bottleneck: browser**

## Ranked bottlenecks

| Severity | Class | Locus | Finding |
| -------- | ----- | ----- | ------- |
| P1 | funnel_attrition | browser | 4 scenario(s) first fail at stage 'browser' |

## Scenarios

| Scenario | Class | Score | First failing stage |
| -------- | ----- | ----- | ------------------- |
| WF-013 | routing | 100/100 | passed |
| WF-010 | routing | 92/100 | passed |
| WF-011 | routing | 76/100 | passed |
| WF-012 | routing | 84/100 | passed |
| WF-006 | browser | — | browser |
| WF-007 | browser | — | browser |
| WF-008 | browser | — | browser |
| WF-009 | browser | — | browser |
| WF-001 | routing | 91/100 | passed |
| WF-002 | routing | 79/100 | passed |
| WF-003 | routing | 100/100 | passed |
| WF-004 | routing | 84/100 | passed |
| WF-005 | routing | 69/100 | passed |

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode. Advisory signals: mode precision unscored; relative ranking unscored (no advisor probe or no rank-below gold); route gold rows 0; telemetry missing n/a (0/0); route misses n/a (0/0); alias misses n/a (0/0); bundle misses n/a (0/0); recipe misses n/a (0/0).
- Scenario count: 13.
