# Skill Benchmark Report — sk-code

> Rendered from report.json (do not hand-edit). Scoring: `mode-a-router-replay` · trace mode: `router`.

**Verdict: FAIL** · aggregate 41/100

## Coverage

- Scored (text executors): **17** · routed out to browser harness: **7**
- By class — routing: 15 · advisor: 2 · browser: 7

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | 57/100 |
| D2 discovery | 20pts | 44/100 |
| D3 efficiency | 15pts | 24/100 |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 100/100 |

_Unscored in this run (need live mode): D1inter, D4._

## Funnel

- discovered: 4
- passed: 8
- routed-intra: 5

**Headline bottleneck: routed-intra**

## Ranked bottlenecks

| Severity | Class | Locus | Finding |
| -------- | ----- | ----- | ------- |
| P1 | funnel_attrition | routed-intra | 5 scenario(s) first fail at stage 'routed-intra' |

## Scenarios

| Scenario | Class | Score | First failing stage |
| -------- | ----- | ----- | ------------------- |
| SD-001 | routing | 63/100 | discovered |
| SD-002 | routing | 66/100 | passed |
| SD-003 | routing | 0/100 | routed-intra |
| LS-001 | routing | 51/100 | passed |
| LS-002 | routing | 51/100 | passed |
| LS-003 | routing | 51/100 | passed |
| LS-004 | routing | 11/100 | routed-intra |
| RD-001 | routing | 100/100 | passed |
| RD-002 | advisor | 69/100 | passed |
| SA-001 | advisor | 69/100 | passed |
| MR-001 | browser | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| MR-002 | browser | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| MR-003 | browser | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| MR-004 | browser | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| CB-001 | browser | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| CB-002 | browser | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| CB-003 | browser | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| CS-001 | routing | 31/100 | discovered |
| CS-002 | routing | 0/100 | routed-intra |
| CS-003 | routing | 50/100 | passed |
| CS-004 | routing | 0/100 | routed-intra |
| CS-005 | routing | 0/100 | routed-intra |
| CS-006 | routing | 43/100 | discovered |
| CS-007 | routing | 46/100 | discovered |

## Contamination findings (router mode — drift, not failures)

_Playbook prompts intentionally carry trigger words; these are reported as drift signals, not scenario failures._
- SD-001: lenis, javascript
- SD-002: typescript, .ts, opencode
- LS-001: config, .ts, opencode
- LS-002: .py, opencode, scripts
- LS-003: .sh, opencode, scripts
- RD-001: lenis, opencode, scripts
- RD-002: sk-code
- CS-001: cdn, animation, webflow, javascript
- CS-002: sk-code, motion.dev, references, webflow, snippets
- CS-003: sk-code, .ts, opencode, scripts
- CS-004: implementation, implement, motion.dev, references
- CS-005: sk-code, naming, references, webflow
- CS-006: sk-code, motion.dev, references, webflow, javascript
- CS-007: sk-code, motion.dev, webflow, javascript

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode.
- Scenario count: 24.
