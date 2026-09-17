# Skill Benchmark Report — sk-prompt

> Rendered from report.json (do not hand-edit). Scoring: `mode-a-router-replay` · trace mode: `router`.

**Verdict: PASS** · aggregate 100/100

## Coverage

- Scored (text executors): **5** · routed out to browser harness: **0**
- By class — routing: 5 · advisor: 0 · browser: 0

## Generalization (fitted vs holdout)

- Fitted aggregate: **100/100** · holdout: _none declared_ · negatives: 0
- _no holdout-staged scenarios; fitted aggregate equals the overall score (score-preserving)_

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | 100/100 |
| D2 discovery | 20pts | 100/100 |
| D3 efficiency | 15pts | 100/100 |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 100/100 |

_Unscored in this run (need live mode): D1inter, D4._

### Advisory signals (NOT in the weighted aggregate)

- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: _unscored (run --d4 in live mode)_
- **Asset support recall** — deferred `assets/*` gold (router defers these on demand): _deferred (router) or no asset gold_

## Route gold (hard lane)

- Gate: **ENFORCED** (flag `on`) · rows scored: **5** · matches: **5** · violations: **0** (gold parse failures: 0)

## Compiled routing parity

- Sub-verdict: **compiled-serving** · child flag forced on: **yes** · parent flag: `force-on` · parity mode: `on`
- Scored: **5** · match: **5** · drift: **0** · vacuous: **0** · resolver-missing: **0** · n/a: **0**
- Eligible rows: **5** · drift rows: **0** · breakages: **0**
- Frozen scorer hashes unchanged: **yes**
- Drift gate: single blocking owner `lane-c-compiled-parity` · report-only consumers: routing-registry-drift-ci

| Scenario | Hub | Status | Front door | Reason | First difference |
| -------- | --- | ------ | ---------- | ------ | ---------------- |
| SP-003 | sk-prompt | match | route | routing-parity-match |  |
| SP-001 | sk-prompt | match | route | routing-parity-match |  |
| SP-002 | sk-prompt | match | route | routing-parity-match |  |
| SP-004 | sk-prompt | match | route | routing-parity-match |  |
| SP-CR-001 | sk-prompt | match | route | routing-parity-match |  |

## Funnel

- passed: 5

## Ranked bottlenecks

_None._

## Scenarios

| Scenario | Class | Stage | Score | First failing stage |
| -------- | ----- | ----- | ----- | ------------------- |
| SP-003 | routing | routing | 100/100 | passed |
| SP-001 | routing | routing | 100/100 | passed |
| SP-002 | routing | routing | 100/100 | passed |
| SP-004 | routing | routing | 100/100 | passed |
| SP-CR-001 | routing | routing | 100/100 | passed |

## Contamination findings (router mode — drift, not failures)

_Playbook prompts intentionally carry trigger words; these are reported as drift signals, not scenario failures._
- SP-003: prompt
- SP-001: prompt
- SP-002: deepseek, deepseek-v4-pro
- SP-004: prompt, glm-5.2
- SP-CR-001: prompt

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode. Advisory signals: mode precision unscored; relative ranking unscored (no advisor probe or no rank-below gold); route gold rows 0; telemetry missing n/a (0/0); route misses n/a (0/0); alias misses n/a (0/0); bundle misses n/a (0/0); recipe misses n/a (0/0).
- Scenario count: 5.
