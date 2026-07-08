# Skill Benchmark Report — deep-loop-workflows

> Rendered from report.json (do not hand-edit). Scoring: `mode-a-router-replay` · trace mode: `router`.

**Verdict: PASS** · aggregate 100/100

## Coverage

- Scored (text executors): **16** · routed out to browser harness: **4**
- By class — routing: 16 · advisor: 0 · browser: 4

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

- passed: 16

## Ranked bottlenecks

_None._

## Scenarios

| Scenario | Class | Score | First failing stage |
| -------- | ----- | ----- | ------------------- |
| MR-001 | browser | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| MR-002 | browser | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| MR-003 | browser | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| MR-004 | browser | _routed-out_ | browser scenario — run in live mode (needs bdg) |
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

## Contamination findings (router mode — drift, not failures)

_Playbook prompts intentionally carry trigger words; these are reported as drift signals, not scenario failures._
- IL-002: model-benchmark, model benchmark
- IL-003: skill-benchmark, skill benchmark, skill
- IL-004: ai-system-improvement, non-dev ai system
- AI-001: research
- AI-002: research, deep-research, iterative investigation workflow
- AI-003: benchmark a model
- RB-001: research
- RB-002: ai council deliberation
- RB-003: agent-improvement
- RB-004: ai-system-improvement
- SC-001: review
- SC-002: ai council deliberation
- SC-003: research
- SC-004: deep-loop-workflows, deep-loop, review

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode. Advisory signals: mode precision unscored; relative ranking unscored (no advisor probe or no rank-below gold); route gold rows 0; telemetry missing n/a (0/0); route misses n/a (0/0); alias misses n/a (0/0); bundle misses n/a (0/0); recipe misses n/a (0/0).
- Scenario count: 20.
