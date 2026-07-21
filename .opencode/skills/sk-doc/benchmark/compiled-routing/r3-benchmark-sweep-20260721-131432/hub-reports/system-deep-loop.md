# Skill Benchmark Report — system-deep-loop

> Rendered from report.json (do not hand-edit). Scoring: `mode-a-router-replay` · trace mode: `router`.

**Verdict: PASS** · aggregate 99/100

## Coverage

- Scored (text executors): **21** · routed out to browser harness: **0**
- By class — routing: 21 · advisor: 0 · browser: 0
- By stage — holdout: 0 · negative (suppression): 2

## Generalization (fitted vs holdout)

- Fitted aggregate: **99/100** · holdout: _none declared_ · negatives: 2
- _no holdout-staged scenarios; fitted aggregate equals the overall score (score-preserving)_

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | 98/100 |
| D2 discovery | 20pts | 100/100 |
| D3 efficiency | 15pts | 100/100 |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 100/100 |

_Unscored in this run (need live mode): D1inter, D4._

### Advisory signals (NOT in the weighted aggregate)

- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: _unscored (run --d4 in live mode)_
- **Asset support recall** — deferred `assets/*` gold (router defers these on demand): _deferred (router) or no asset gold_

## Route gold (hard lane)

- Gate: **ENFORCED** (flag `on`) · rows scored: **21** · matches: **21** · violations: **0** (gold parse failures: 0)

## Compiled routing parity

- Sub-verdict: **compiled-serving** · child flag forced on: **yes** · parent flag: `force-on` · parity mode: `on`
- Scored: **21** · match: **21** · drift: **0** · vacuous: **0** · resolver-missing: **0** · n/a: **0**
- Eligible rows: **21** · drift rows: **0** · breakages: **0**
- Frozen scorer hashes unchanged: **yes**
- Drift gate: single blocking owner `lane-c-compiled-parity` · report-only consumers: routing-registry-drift-ci

| Scenario | Hub | Status | Front door | Reason | First difference |
| -------- | --- | ------ | ---------- | ------ | ---------------- |
| SC-002 | system-deep-loop | match | route | routing-parity-match |  |
| SC-003 | system-deep-loop | match | route | routing-parity-match |  |
| SC-001 | system-deep-loop | match | route | routing-parity-match |  |
| SC-004 | system-deep-loop | match | route | routing-parity-match |  |
| RB-004 | system-deep-loop | match | defer | routing-parity-match |  |
| RB-003 | system-deep-loop | match | route | routing-parity-match |  |
| RB-002 | system-deep-loop | match | route | routing-parity-match |  |
| RB-001 | system-deep-loop | match | route | routing-parity-match |  |
| MO-003 | system-deep-loop | match | route | routing-parity-match |  |
| MO-005 | system-deep-loop | match | route | routing-parity-match |  |
| MO-004 | system-deep-loop | match | route | routing-parity-match |  |
| MO-001 | system-deep-loop | match | route | routing-parity-match |  |
| MO-002 | system-deep-loop | match | route | routing-parity-match |  |
| IL-001 | system-deep-loop | match | route | routing-parity-match |  |
| IL-002 | system-deep-loop | match | route | routing-parity-match |  |
| IL-003 | system-deep-loop | match | route | routing-parity-match |  |
| DL-CR-001 | system-deep-loop | match | route | routing-parity-match |  |
| AI-003 | system-deep-loop | match | defer | routing-parity-match |  |
| AI-002 | system-deep-loop | match | route | routing-parity-match |  |
| AI-004 | system-deep-loop | match | defer | routing-parity-match |  |
| AI-001 | system-deep-loop | match | route | routing-parity-match |  |

## Funnel

- passed: 21

## Ranked bottlenecks

_None._

## Scenarios

| Scenario | Class | Stage | Score | First failing stage |
| -------- | ----- | ----- | ----- | ------------------- |
| SC-002 | routing | routing | 100/100 | passed |
| SC-003 | routing | routing | 100/100 | passed |
| SC-001 | routing | routing | 100/100 | passed |
| SC-004 | routing | routing | 100/100 | passed |
| RB-004 | routing | negative | 100/100 | passed |
| RB-003 | routing | routing | 100/100 | passed |
| RB-002 | routing | routing | 100/100 | passed |
| RB-001 | routing | routing | 100/100 | passed |
| MO-003 | routing | routing | 100/100 | passed |
| MO-005 | routing | routing | 100/100 | passed |
| MO-004 | routing | routing | 100/100 | passed |
| MO-001 | routing | routing | 100/100 | passed |
| MO-002 | routing | routing | 100/100 | passed |
| IL-001 | routing | routing | 100/100 | passed |
| IL-002 | routing | routing | 100/100 | passed |
| IL-003 | routing | routing | 100/100 | passed |
| DL-CR-001 | routing | routing | 100/100 | passed |
| AI-003 | routing | routing | 84/100 | passed |
| AI-002 | routing | routing | 100/100 | passed |
| AI-004 | routing | negative | 100/100 | passed |
| AI-001 | routing | routing | 100/100 | passed |

## Contamination findings (router mode — drift, not failures)

_Playbook prompts intentionally carry trigger words; these are reported as drift signals, not scenario failures._
- SC-002: ai council, ai council deliberation
- SC-003: research, deep research
- SC-001: review, before running deep review
- SC-004: system-deep-loop, review, review request
- RB-003: agent-improvement
- RB-002: ai council, ai council deliberation
- RB-001: research, deep research
- MO-003: ai council
- MO-005: conformance audit, named standard authority, skill
- MO-004: research, research summary, review
- MO-001: research, deep research, research summary
- MO-002: review, deep review of
- IL-001: agent candidate
- IL-002: model-benchmark, /deep:model-benchmark
- IL-003: skill-benchmark, /deep:skill-benchmark, skill
- DL-CR-001: research, deep research, research summary
- AI-002: research, deep-research, iterative investigation workflow
- AI-001: research, deep research, research summary

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode. Advisory signals: mode precision unscored; relative ranking unscored (no advisor probe or no rank-below gold); route gold rows 0; telemetry missing n/a (0/0); route misses n/a (0/0); alias misses n/a (0/0); bundle misses n/a (0/0); recipe misses n/a (0/0).
- Scenario count: 21.
