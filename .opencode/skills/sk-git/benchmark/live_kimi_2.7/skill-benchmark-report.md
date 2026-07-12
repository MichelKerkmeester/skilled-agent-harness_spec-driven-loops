# Skill Benchmark Report — sk-git

> Rendered from report.json (do not hand-edit). Scoring: `mode-b-live` · trace mode: `live`.

**Verdict: PASS** · aggregate 100/100

## Coverage

- Scored (text executors): **22** · routed out to browser harness: **0**
- By class — routing: 22 · advisor: 0 · browser: 0

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | 100/100 |
| D2 discovery | 20pts | 100/100 |
| D3 efficiency | 15pts | _unscored_ |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 97/100 |

_Unscored in this run (need live mode): D1inter, D4._

### Advisory signals (NOT in the weighted aggregate)

- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: _unscored (run --d4 in live mode)_
- **Asset support recall** — deferred `assets/*` gold (router defers these on demand): _deferred (router) or no asset gold_

## Funnel

- passed: 22

## Ranked bottlenecks

| Severity | Class | Locus | Finding |
| -------- | ----- | ----- | ------- |
| P2 | orphan_reference | references/large_reorg_playbook.md | references/large_reorg_playbook.md is not reachable from any RESOURCE_MAP intent |

## Scenarios

| Scenario | Class | Score | First failing stage |
| -------- | ----- | ----- | ------------------- |
| GIT-001 | routing | 100/100 | passed |
| GIT-002 | routing | 100/100 | passed |
| GIT-003 | routing | 100/100 | passed |
| GIT-004 | routing | 100/100 | passed |
| GIT-005 | routing | 100/100 | passed |
| GIT-006 | routing | 100/100 | passed |
| GIT-007 | routing | 100/100 | passed |
| GIT-008 | routing | 100/100 | passed |
| GIT-009 | routing | 100/100 | passed |
| GIT-010 | routing | 100/100 | passed |
| GIT-011 | routing | 100/100 | passed |
| GIT-012 | routing | 100/100 | passed |
| GIT-013 | routing | 100/100 | passed |
| GIT-014 | routing | 100/100 | passed |
| GIT-015 | routing | 100/100 | passed |
| GIT-016 | routing | 100/100 | passed |
| GIT-017 | routing | 100/100 | passed |
| GIT-018 | routing | 100/100 | passed |
| GIT-019 | routing | 100/100 | passed |
| GIT-020 | routing | 100/100 | passed |
| GIT-021 | routing | 100/100 | passed |
| GIT-022 | routing | 100/100 | passed |

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode. Advisory signals: mode precision unscored; relative ranking unscored (no advisor probe or no rank-below gold); route gold rows 0; telemetry missing n/a (0/0); route misses n/a (0/0); alias misses n/a (0/0); bundle misses n/a (0/0); recipe misses n/a (0/0).
- Scenario count: 22.
