# Skill Benchmark Report — design-foundations

> Rendered from report.json (do not hand-edit). Scoring: `mode-a-router-replay` · trace mode: `router`.

**Verdict: PASS** · aggregate 100/100

## Coverage

- Scored (text executors): **7** · routed out to browser harness: **0**
- By class — routing: 7 · advisor: 0 · browser: 0

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

- passed: 7

## Ranked bottlenecks

_None._

## Scenarios

| Scenario | Class | Score | First failing stage |
| -------- | ----- | ----- | ------------------- |
| 001-worked-examples-not-presets | routing | 100/100 | passed |
| 001-token-starter-handoff | routing | 100/100 | passed |
| 001-chart-encoding-and-color | routing | 100/100 | passed |
| 001-layout-rhythm-responsive | routing | 100/100 | passed |
| 002-context-adaptation-matrix | routing | 100/100 | passed |
| 001-type-roles-and-measure | routing | 100/100 | passed |
| 001-oklch-palette-and-dark-mode | routing | 100/100 | passed |

## Contamination findings (router mode — drift, not failures)

_Playbook prompts intentionally carry trigger words; these are reported as drift signals, not scenario failures._
- 001-worked-examples-not-presets: complete foundations answer
- 001-token-starter-handoff: dark mode, token system
- 001-chart-encoding-and-color: density, data visualization
- 001-layout-rhythm-responsive: layout
- 002-context-adaptation-matrix: print
- 001-type-roles-and-measure: typography
- 001-oklch-palette-and-dark-mode: color, dark mode, token system

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode.
- Scenario count: 7.
