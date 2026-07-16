# Skill Benchmark Report — mcp-tooling

> Rendered from report.json (do not hand-edit). Scoring: `mode-a-router-replay` · trace mode: `router`.

**Verdict: PASS** · aggregate 95/100

## Coverage

- Scored (text executors): **13** · routed out to browser harness: **0**
- By class — routing: 13 · advisor: 0 · browser: 0
- By stage — holdout: 6 · negative (suppression): 0

## Generalization (fitted vs holdout)

- Fitted (7): **95/100** · Holdout (6): **87/100** · Gap: **+8**
- Negatives (suppression): 0
- _holdout excluded from the fitted aggregate; gap = fitted minus holdout_

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | 78/100 |
| D2 discovery | 20pts | 100/100 |
| D3 efficiency | 15pts | _unscored_ |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 100/100 |

_Unscored in this run (need live mode): D1inter, D4._

### Advisory signals (NOT in the weighted aggregate)

- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: _unscored (run --d4 in live mode)_
- **Asset support recall** — deferred `assets/*` gold (router defers these on demand): _deferred (router) or no asset gold_

## Funnel

- passed: 13

## Ranked bottlenecks

_None._

## Scenarios

| Scenario | Class | Stage | Score | First failing stage |
| -------- | ----- | ----- | ----- | ------------------- |
| MT-004 | routing | routing | 84/100 | passed |
| MT-007 | routing | routing | 100/100 | passed |
| MT-001 | routing | routing | 100/100 | passed |
| MT-002 | routing | routing | 100/100 | passed |
| MT-003 | routing | routing | 84/100 | passed |
| MT-H04 | routing | holdout | 84/100 | passed |
| MT-H01 | routing | holdout | 100/100 | passed |
| MT-H02 | routing | holdout | 84/100 | passed |
| MT-H06 | routing | holdout | 84/100 | passed |
| MT-H03 | routing | holdout | 84/100 | passed |
| MT-H05 | routing | holdout | 84/100 | passed |
| MT-009 | routing | routing | 100/100 | passed |
| MT-008 | routing | routing | 100/100 | passed |

## Contamination findings (router mode — drift, not failures)

_Playbook prompts intentionally carry trigger words; these are reported as drift signals, not scenario failures._
- MT-004: mcp tool bridge
- MT-007: console errors, aside, aside browser
- MT-001: chrome devtools
- MT-002: clickup, clickup task
- MT-H01: network requests
- MT-009: screen examples, mobbin
- MT-008: refero

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode. Advisory signals: mode precision unscored; relative ranking unscored (no advisor probe or no rank-below gold); route gold rows 0; telemetry missing n/a (0/0); route misses n/a (0/0); alias misses n/a (0/0); bundle misses n/a (0/0); recipe misses n/a (0/0).
- Scenario count: 13.
