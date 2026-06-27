# Skill Benchmark Report — design-audit

> Rendered from report.json (do not hand-edit). Scoring: `mode-a-router-replay` · trace mode: `router`.

**Verdict: PASS** · aggregate 100/100

## Coverage

- Scored (text executors): **7** · routed out to browser harness: **2**
- By class — routing: 7 · advisor: 0 · browser: 2

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
| 001-ai-fingerprint-tells | routing | 100/100 | passed |
| 008-anti-slop-production-hardening | routing | 100/100 | passed |
| 009-hardening-edge-cases | routing | 100/100 | passed |
| 006-accessibility-performance-gate | browser | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| 007-a11y-quick-fixes | browser | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| 002-findings-first-score | routing | 100/100 | passed |
| 003-transform-remediation-routing | routing | 100/100 | passed |
| 004-evidence-capture | routing | 100/100 | passed |
| 005-audit-report-template | routing | 100/100 | passed |

## Contamination findings (router mode — drift, not failures)

_Playbook prompts intentionally carry trigger words; these are reported as drift signals, not scenario failures._
- 001-ai-fingerprint-tells: audit, ai-generated, fingerprint
- 008-anti-slop-production-hardening: slop, ai-generated, theme, token, pseudo, copy
- 009-hardening-edge-cases: critique, harden, edge case, i18n, production readiness
- 002-findings-first-score: audit, score, release readiness, severity, quality score
- 003-transform-remediation-routing: bolder, quieter, distill, remediation, make it bolder
- 004-evidence-capture: evidence, screenshot, source target
- 005-audit-report-template: audit, score, quality score, report template

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode.
- Scenario count: 9.
