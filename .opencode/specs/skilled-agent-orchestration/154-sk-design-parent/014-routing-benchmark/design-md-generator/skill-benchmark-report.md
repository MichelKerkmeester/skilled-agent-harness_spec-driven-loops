# Skill Benchmark Report — design-md-generator

> Rendered from report.json (do not hand-edit). Scoring: `mode-b-live` · trace mode: `live`.

**Verdict: CONDITIONAL** · aggregate 61/100

## Coverage

- Scored (text executors): **13** · routed out to browser harness: **0**
- By class — routing: 13 · advisor: 0 · browser: 0

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | 53/100 |
| D2 discovery | 20pts | 88/100 |
| D3 efficiency | 15pts | 32/100 |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 100/100 |

_Unscored in this run (need live mode): D1inter, D4._

### Advisory signals (NOT in the weighted aggregate)

- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: _unscored (run --d4 in live mode)_
- **Asset support recall** — deferred `assets/*` gold (router defers these on demand): _deferred (router) or no asset gold_

## Funnel

- routed-intra: 3
- passed: 10

**Headline bottleneck: routed-intra**

## Ranked bottlenecks

| Severity | Class | Locus | Finding |
| -------- | ----- | ----- | ------- |
| P1 | funnel_attrition | routed-intra | 3 scenario(s) first fail at stage 'routed-intra' |

## Scenarios

| Scenario | Class | Score | First failing stage |
| -------- | ----- | ----- | ------------------- |
| 013-source-of-truth-card | routing | 33/100 | routed-intra |
| 012-authoring-boundary | routing | 33/100 | routed-intra |
| 011-framework-icon-motion-detection | routing | 66/100 | passed |
| 010-accessibility-section | routing | 66/100 | passed |
| 009-oklch-clustering | routing | 66/100 | passed |
| 008-interaction-state-matrix | routing | 66/100 | passed |
| 007-report-generation | routing | 89/100 | passed |
| 006-anti-bot-escalation | routing | 64/100 | passed |
| 005-tool-readiness | routing | 66/100 | passed |
| 004-dark-mode-gate | routing | 66/100 | passed |
| 003-verbatim-value-fidelity | routing | 37/100 | routed-intra |
| 002-phantom-hex-detection | routing | 79/100 | passed |
| 001-live-extraction | routing | 66/100 | passed |

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode.
- Scenario count: 13.
