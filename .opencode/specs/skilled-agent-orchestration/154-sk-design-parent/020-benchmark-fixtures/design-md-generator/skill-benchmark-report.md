# Skill Benchmark Report — design-md-generator

> Rendered from report.json (do not hand-edit). Scoring: `mode-a-router-replay` · trace mode: `router`.

**Verdict: PASS** · aggregate 100/100

## Coverage

- Scored (text executors): **15** · routed out to browser harness: **0**
- By class — routing: 15 · advisor: 0 · browser: 0

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

- passed: 15

## Ranked bottlenecks

_None._

## Scenarios

| Scenario | Class | Score | First failing stage |
| -------- | ----- | ----- | ------------------- |
| 015-editorial-exemplar-study | routing | 100/100 | passed |
| 014-guided-run-smoke-lane | routing | 100/100 | passed |
| 013-source-of-truth-card | routing | 100/100 | passed |
| 012-authoring-boundary | routing | 100/100 | passed |
| 011-framework-icon-motion-detection | routing | 100/100 | passed |
| 010-accessibility-section | routing | 100/100 | passed |
| 009-oklch-clustering | routing | 100/100 | passed |
| 008-interaction-state-matrix | routing | 100/100 | passed |
| 007-report-generation | routing | 100/100 | passed |
| 006-anti-bot-escalation | routing | 100/100 | passed |
| 005-tool-readiness | routing | 100/100 | passed |
| 004-dark-mode-gate | routing | 100/100 | passed |
| 003-verbatim-value-fidelity | routing | 100/100 | passed |
| 002-phantom-hex-detection | routing | 100/100 | passed |
| 001-live-extraction | routing | 100/100 | passed |

## Contamination findings (router mode — drift, not failures)

_Playbook prompts intentionally carry trigger words; these are reported as drift signals, not scenario failures._
- 015-editorial-exemplar-study: extract, study, reference, editorial, ecommerce, non-saas
- 014-guided-run-smoke-lane: extract, design.md, wrapper, smoke, design
- 013-source-of-truth-card: design system, design
- 012-authoring-boundary: extract, design system, live, design
- 011-framework-icon-motion-detection: extract
- 010-accessibility-section: capture, design system, design
- 009-oklch-clustering: extract, design system, design
- 008-interaction-state-matrix: extract, design system, example, design
- 007-report-generation: design.md, tokens.json, report, preview, visual, html
- 006-anti-bot-escalation: extract, design system, design
- 005-tool-readiness: extract, url, design system, design
- 004-dark-mode-gate: extract, design.md, design system, live, design
- 003-verbatim-value-fidelity: tokens.json, check, reference
- 002-phantom-hex-detection: tokens.json, validate, reference
- 001-live-extraction: extract, design system, example, design

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode.
- Scenario count: 15.
