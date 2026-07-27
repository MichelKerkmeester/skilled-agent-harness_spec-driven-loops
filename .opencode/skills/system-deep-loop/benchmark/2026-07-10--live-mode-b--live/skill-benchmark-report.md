# Skill Benchmark Report — system-deep-loop

> Rendered from report.json (do not hand-edit). Scoring: `mode-b-live` · trace mode: `live`.

**Verdict: PASS** · aggregate 93/100

## Coverage

- Scored (text executors): **20** · routed out to browser harness: **0**
- By class — routing: 16 · advisor: 0 · browser: 4

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | 93/100 |
| D2 discovery | 20pts | 93/100 |
| D3 efficiency | 15pts | 70/100 |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 100/100 |

_Unscored in this run (need live mode): D1inter, D4._

### Advisory signals (NOT in the weighted aggregate)

- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: _unscored (run --d4 in live mode)_
- **Asset support recall** — deferred `assets/*` gold (router defers these on demand): _deferred (router) or no asset gold_

## Funnel

- passed: 17
- browser: 3

**Headline bottleneck: browser**

## Ranked bottlenecks

| Severity | Class | Locus | Finding |
| -------- | ----- | ----- | ------- |
| P1 | funnel_attrition | browser | 3 scenario(s) first fail at stage 'browser' |

## Scenarios

| Scenario | Class | Score | First failing stage |
| -------- | ----- | ----- | ------------------- |
| MR-001 | browser | 100/100 | passed |
| MR-002 | browser | 50/100 | browser |
| MR-003 | browser | 50/100 | browser |
| MR-004 | browser | 50/100 | browser |
| IL-001 | routing | 100/100 | passed |
| IL-002 | routing | 100/100 | passed |
| IL-003 | routing | 100/100 | passed |
| IL-004 | routing | 100/100 | passed |
| AI-001 | routing | 100/100 | passed |
| AI-002 | routing | 100/100 | passed |
| AI-003 | routing | 100/100 | passed |
| AI-004 | routing | 100/100 | passed |
| RB-001 | routing | 100/100 | passed |
| RB-002 | routing | 100/100 | passed |
| RB-003 | routing | 100/100 | passed |
| RB-004 | routing | 100/100 | passed |
| SC-001 | routing | 100/100 | passed |
| SC-002 | routing | 100/100 | passed |
| SC-003 | routing | 100/100 | passed |
| SC-004 | routing | 100/100 | passed |

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode. Advisory signals: mode precision unscored; relative ranking unscored (no advisor probe or no rank-below gold); route gold rows 0; telemetry missing n/a (0/0); route misses n/a (0/0); alias misses n/a (0/0); bundle misses n/a (0/0); recipe misses n/a (0/0).
- Scenario count: 20.
