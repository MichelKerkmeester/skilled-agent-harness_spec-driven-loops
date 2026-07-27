# Skill Benchmark Report — deep-improvement

> Rendered from report.json (do not hand-edit). Scoring: `mode-a-router-replay` · trace mode: `router`.

**Verdict: PASS** · aggregate 100/100

## Coverage

- Scored (text executors): **9** · routed out to browser harness: **0**
- By class — routing: 9 · advisor: 0 · browser: 0

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

## Funnel

- passed: 9

## Ranked bottlenecks

| Severity | Class | Locus | Finding |
| -------- | ----- | ----- | ------- |
| info | orphan_allowlisted | assets/skill-benchmark/README.md | assets/skill-benchmark/README.md is intentionally unrouted (routing-allowlist) |
| info | orphan_allowlisted | assets/skill-benchmark/fixtures/README.md | assets/skill-benchmark/fixtures/README.md is intentionally unrouted (routing-allowlist) |
| info | orphan_allowlisted | assets/model-benchmark/README.md | assets/model-benchmark/README.md is intentionally unrouted (routing-allowlist) |
| info | orphan_allowlisted | assets/model-benchmark/benchmark_profiles/README.md | assets/model-benchmark/benchmark_profiles/README.md is intentionally unrouted (routing-allowlist) |
| info | orphan_allowlisted | assets/model-benchmark/benchmark_fixtures/README.md | assets/model-benchmark/benchmark_fixtures/README.md is intentionally unrouted (routing-allowlist) |
| info | orphan_allowlisted | assets/agent-improvement/README.md | assets/agent-improvement/README.md is intentionally unrouted (routing-allowlist) |
| info | orphan_allowlisted | assets/agent-improvement/target-profiles/README.md | assets/agent-improvement/target-profiles/README.md is intentionally unrouted (routing-allowlist) |

## Scenarios

| Scenario | Class | Score | First failing stage |
| -------- | ----- | ----- | ------------------- |
| DI-R01 | routing | 100/100 | passed |
| DI-R02 | routing | 100/100 | passed |
| DI-R03 | routing | 100/100 | passed |
| DI-R04 | routing | 100/100 | passed |
| DI-R05 | routing | 100/100 | passed |
| DI-R06 | routing | 100/100 | passed |
| DI-R07 | routing | 100/100 | passed |
| DI-R08 | routing | 100/100 | passed |
| DI-R10 | routing | 100/100 | passed |

## Contamination findings (router mode — drift, not failures)

_Playbook prompts intentionally carry trigger words; these are reported as drift signals, not scenario failures._
- DI-R01: quick reference, short reminder, command example
- DI-R02: run loop, proposal, candidate, score candidate, benchmark
- DI-R03: evaluator, rubric, contract, repeatability, no-go
- DI-R04: promote, rollback, mirror drift, approval gate
- DI-R05: new target, target profile, second target
- DI-R06: integration, scan surfaces, dynamic profile, 5-dimension
- DI-R07: benchmark, evaluator, benchmark a model, optimize a model, model-benchmark
- DI-R08: benchmark, benchmark a skill, skill routing, unprompted discovery, routing accuracy, skill-benchmark
- DI-R10: full setup, initialize runtime, charter, strategy

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode. Advisory signals: mode precision unscored; relative ranking unscored (no advisor probe or no rank-below gold); route gold rows 0; telemetry missing n/a (0/0); route misses n/a (0/0); alias misses n/a (0/0); bundle misses n/a (0/0); recipe misses n/a (0/0).
- Scenario count: 9.
