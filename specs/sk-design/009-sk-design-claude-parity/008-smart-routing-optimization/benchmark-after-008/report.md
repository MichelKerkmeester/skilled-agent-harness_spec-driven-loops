# Skill Benchmark Report — sk-design

> Rendered from report.json (do not hand-edit). Scoring: `mode-a-router-replay` · trace mode: `router`.

**Verdict: CONDITIONAL** · aggregate 69/100

## Coverage

- Scored (text executors): **18** · routed out to browser harness: **6**
- By class — routing: 12 · advisor: 6 · browser: 6

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | 100/100 |
| D2 discovery | 20pts | 100/100 |
| D3 efficiency | 15pts | 0/100 |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 100/100 |

_Unscored in this run (need live mode): D1inter, D4._

### Advisory signals (NOT in the weighted aggregate)

- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: _unscored (run --d4 in live mode)_
- **Asset support recall** — deferred `assets/*` gold (router defers these on demand): _deferred (router) or no asset gold_

## Funnel

- passed: 18

## Ranked bottlenecks

_None._

## Scenarios

| Scenario | Class | Score | First failing stage |
| -------- | ----- | ----- | ------------------- |
| MR-001 | browser | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| MR-002 | browser | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| MR-003 | browser | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| MR-004 | browser | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| MR-005 | browser | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| MR-006 | browser | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| AI-001 | routing | 69/100 | passed |
| AI-002 | routing | 69/100 | passed |
| AI-003 | routing | 69/100 | passed |
| TV-001 | routing | 69/100 | passed |
| TV-002 | routing | 69/100 | passed |
| TV-003 | routing | 69/100 | passed |
| TV-004 | routing | 69/100 | passed |
| TV-005 | routing | 69/100 | passed |
| MG-001 | advisor | 69/100 | passed |
| MG-002 | advisor | 69/100 | passed |
| MG-003 | advisor | 69/100 | passed |
| SR-001 | routing | 69/100 | passed |
| SR-002 | routing | 69/100 | passed |
| SR-003 | routing | 69/100 | passed |
| SR-004 | routing | 69/100 | passed |
| PB-001 | advisor | 69/100 | passed |
| PB-002 | advisor | 69/100 | passed |
| PB-003 | advisor | 69/100 | passed |

## Contamination findings (router mode — drift, not failures)

_Playbook prompts intentionally carry trigger words; these are reported as drift signals, not scenario failures._
- AI-003: sk-design
- TV-003: hero section, clarify, hierarchy
- TV-005: audit
- MG-001: tokens.json, design.md
- MG-002: tokens.json, design.md
- MG-003: tokens.json, design fidelity check, design.md, design fidelity
- SR-001: less generic
- SR-004: audit, design audit
- PB-001: sk-design, less generic
- PB-002: hierarchy
- PB-003: md-generator, design.md

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode. Advisory signals: mode precision unscored; relative ranking unscored (no advisor probe or no rank-below gold); route gold rows 0; telemetry missing n/a (0/0); route misses n/a (0/0); alias misses n/a (0/0); bundle misses n/a (0/0); recipe misses n/a (0/0).
- Scenario count: 24.
