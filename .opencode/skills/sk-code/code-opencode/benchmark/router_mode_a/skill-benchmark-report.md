# Skill Benchmark Report — code-opencode

> Rendered from report.json (do not hand-edit). Scoring: `mode-a-router-replay` · trace mode: `router`.

**Verdict: PASS** · aggregate 86/100

## Coverage

- Scored (text executors): **9** · routed out to browser harness: **0**
- By class — routing: 9 · advisor: 0 · browser: 0

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | 100/100 |
| D2 discovery | 20pts | 100/100 |
| D3 efficiency | 15pts | 55/100 |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 100/100 |

_Unscored in this run (need live mode): D1inter, D4._

### Advisory signals (NOT in the weighted aggregate)

- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: _unscored (run --d4 in live mode)_
- **Asset support recall** — deferred `assets/*` gold (router defers these on demand): _deferred (router) or no asset gold_

## Funnel

- passed: 9

## Ranked bottlenecks

_None._

## Scenarios

| Scenario | Class | Score | First failing stage |
| -------- | ----- | ----- | ------------------- |
| OC-001 | routing | 79/100 | passed |
| OC-002 | routing | 88/100 | passed |
| OC-003 | routing | 88/100 | passed |
| OC-009 | routing | 79/100 | passed |
| OC-004 | routing | 90/100 | passed |
| OC-005 | routing | 79/100 | passed |
| OC-006 | routing | 100/100 | passed |
| OC-007 | routing | 88/100 | passed |
| OC-008 | routing | 84/100 | passed |

## Contamination findings (router mode — drift, not failures)

_Playbook prompts intentionally carry trigger words; these are reported as drift signals, not scenario failures._
- OC-001: implement, feature, module, standards, typescript, .ts
- OC-002: standards, python, .py, docstring
- OC-003: standards, shell, shell script, bash, .sh
- OC-009: implement, feature, module, standards, typescript, rust
- OC-004: config, jsonc, descriptor, config schema
- OC-005: hooks, session-prime, pre-tool-use
- OC-006: implement, module, authoring
- OC-007: lint, format, quality gate, naming, standards, code smell
- OC-008: verify, passing, type-check, alignment drift, completion claim

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode. Advisory signals: mode precision unscored; relative ranking unscored (no advisor probe or no rank-below gold); route gold rows 0; telemetry missing n/a (0/0); route misses n/a (0/0); alias misses n/a (0/0); bundle misses n/a (0/0); recipe misses n/a (0/0).
- Scenario count: 9.
