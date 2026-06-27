# Skill Benchmark Report — design-audit

> Rendered from report.json (do not hand-edit). Scoring: `mode-b-live` · trace mode: `live`.

**Verdict: CONDITIONAL** · aggregate 61/100

## Coverage

- Scored (text executors): **7** · routed out to browser harness: **0**
- By class — routing: 7 · advisor: 0 · browser: 2

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | 43/100 |
| D2 discovery | 20pts | 72/100 |
| D3 efficiency | 15pts | 20/100 |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 100/100 |

_Unscored in this run (need live mode): D1inter, D4._

### Advisory signals (NOT in the weighted aggregate)

- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: _unscored (run --d4 in live mode)_
- **Asset support recall** — deferred `assets/*` gold (router defers these on demand): _deferred (router) or no asset gold_

## Funnel

- passed: 6
- browser: 2
- routed-intra: 1

**Headline bottleneck: browser**

## Ranked bottlenecks

| Severity | Class | Locus | Finding |
| -------- | ----- | ----- | ------- |
| P1 | funnel_attrition | browser | 2 scenario(s) first fail at stage 'browser' |

## Scenarios

| Scenario | Class | Score | First failing stage |
| -------- | ----- | ----- | ------------------- |
| 001-ai-fingerprint-tells | routing | 64/100 | passed |
| 008-anti-slop-production-hardening | routing | 68/100 | passed |
| 009-hardening-edge-cases | routing | 62/100 | passed |
| 006-accessibility-performance-gate | browser | — | browser |
| 007-a11y-quick-fixes | browser | — | browser |
| 002-findings-first-score | routing | 68/100 | passed |
| 003-transform-remediation-routing | routing | 68/100 | passed |
| 004-evidence-capture | routing | 68/100 | passed |
| 005-audit-report-template | routing | 32/100 | routed-intra |

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode.
- Scenario count: 9.
