# Skill Benchmark Report — deep-improvement

> Rendered from report.json (do not hand-edit). Scoring: `mode-b-live` · trace mode: `live`.

**Verdict: PASS** · aggregate 90/100

## Coverage

- Scored (text executors): **10** · routed out to browser harness: **0**
- By class — routing: 10 · advisor: 0 · browser: 0

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | 100/100 |
| D2 discovery | 20pts | 100/100 |
| D3 efficiency | 15pts | 67/100 |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 100/100 |

_Unscored in this run (need live mode): D1inter, D4._

### Advisory signals (NOT in the weighted aggregate)

- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: _unscored (run --d4 in live mode)_
- **Asset support recall** — deferred `assets/*` gold (router defers these on demand): _deferred (router) or no asset gold_

## Funnel

- passed: 10

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
| DI-R02 | routing | 75/100 | passed |
| DI-R03 | routing | 100/100 | passed |
| DI-R04 | routing | 76/100 | passed |
| DI-R05 | routing | 71/100 | passed |
| DI-R06 | routing | 100/100 | passed |
| DI-R07 | routing | 100/100 | passed |
| DI-R08 | routing | 100/100 | passed |
| DI-R09 | routing | 76/100 | passed |
| DI-R10 | routing | 100/100 | passed |

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode. Advisory signals: mode precision unscored; relative ranking unscored (no advisor probe or no rank-below gold); route gold rows 0; telemetry missing n/a (0/0); route misses n/a (0/0); alias misses n/a (0/0); bundle misses n/a (0/0); recipe misses n/a (0/0).
- Scenario count: 10.
