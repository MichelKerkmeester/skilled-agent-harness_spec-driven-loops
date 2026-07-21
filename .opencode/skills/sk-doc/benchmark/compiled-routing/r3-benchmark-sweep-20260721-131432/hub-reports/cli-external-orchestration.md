# Skill Benchmark Report — cli-external-orchestration

> Rendered from report.json (do not hand-edit). Scoring: `mode-a-router-replay` · trace mode: `router`.

**Verdict: PASS** · aggregate 92/100

## Coverage

- Scored (text executors): **8** · routed out to browser harness: **0**
- By class — routing: 8 · advisor: 0 · browser: 0
- By stage — holdout: 2 · negative (suppression): 0

## Generalization (fitted vs holdout)

- Fitted (6): **92/100** · Holdout (2): **100/100** · Gap: **-8**
- Negatives (suppression): 0
- _holdout excluded from the fitted aggregate; gap = fitted minus holdout_

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | 85/100 |
| D2 discovery | 20pts | 100/100 |
| D3 efficiency | 15pts | 100/100 |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 100/100 |

_Unscored in this run (need live mode): D1inter, D4._

### Advisory signals (NOT in the weighted aggregate)

- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: _unscored (run --d4 in live mode)_
- **Asset support recall** — deferred `assets/*` gold (router defers these on demand): _deferred (router) or no asset gold_

## Route gold (hard lane)

- Gate: **ENFORCED** (flag `on`) · rows scored: **8** · matches: **8** · violations: **0** (gold parse failures: 0)

## Compiled routing parity

- Sub-verdict: **compiled-serving** · child flag forced on: **yes** · parent flag: `force-on` · parity mode: `on`
- Scored: **8** · match: **8** · drift: **0** · vacuous: **0** · resolver-missing: **0** · n/a: **0**
- Eligible rows: **8** · drift rows: **0** · breakages: **0**
- Frozen scorer hashes unchanged: **yes**
- Drift gate: single blocking owner `lane-c-compiled-parity` · report-only consumers: routing-registry-drift-ci

| Scenario | Hub | Status | Front door | Reason | First difference |
| -------- | --- | ------ | ---------- | ------ | ---------------- |
| CE-P01 | cli-external-orchestration | match | defer | routing-parity-match |  |
| CE-P02 | cli-external-orchestration | match | defer | routing-parity-match |  |
| CE-003 | cli-external-orchestration | match | defer | routing-parity-match |  |
| CE-002 | cli-external-orchestration | match | route | routing-parity-match |  |
| CE-H01 | cli-external-orchestration | match | route | routing-parity-match |  |
| CE-H02 | cli-external-orchestration | match | route | routing-parity-match |  |
| CE-001 | cli-external-orchestration | match | route | routing-parity-match |  |
| CE-CR-001 | cli-external-orchestration | match | route | routing-parity-match |  |

## Funnel

- passed: 8

## Ranked bottlenecks

_None._

## Scenarios

| Scenario | Class | Stage | Score | First failing stage |
| -------- | ----- | ----- | ----- | ------------------- |
| CE-P01 | routing | routing | 84/100 | passed |
| CE-P02 | routing | routing | 84/100 | passed |
| CE-003 | routing | routing | 84/100 | passed |
| CE-002 | routing | routing | 100/100 | passed |
| CE-H01 | routing | holdout | 100/100 | passed |
| CE-H02 | routing | holdout | 100/100 | passed |
| CE-001 | routing | routing | 100/100 | passed |
| CE-CR-001 | routing | routing | 100/100 | passed |

## Contamination findings (router mode — drift, not failures)

_Playbook prompts intentionally carry trigger words; these are reported as drift signals, not scenario failures._
- CE-002: anthropic cli second opinion, extended thinking
- CE-H01: full plugin and memory stack
- CE-H02: deeply-reasoned opinion
- CE-001: opencode, spec kit memory
- CE-CR-001: opencode, spec kit memory

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode. Advisory signals: mode precision unscored; relative ranking unscored (no advisor probe or no rank-below gold); route gold rows 0; telemetry missing n/a (0/0); route misses n/a (0/0); alias misses n/a (0/0); bundle misses n/a (0/0); recipe misses n/a (0/0).
- Scenario count: 8.
