# Skill Benchmark Report — sk-code

> Rendered from report.json (do not hand-edit). Scoring: `mode-a-router-replay` · trace mode: `router`.

**Verdict: CONDITIONAL** · aggregate 83/100

## Coverage

- Scored (text executors): **23** · routed out to browser harness: **7**
- By class — routing: 21 · advisor: 2 · browser: 7
- By stage — holdout: 0 · negative (suppression): 6

## Generalization (fitted vs holdout)

- Fitted aggregate: **83/100** · holdout: _none declared_ · negatives: 6
- _no holdout-staged scenarios; fitted aggregate equals the overall score (score-preserving)_

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | 90/100 |
| D2 discovery | 20pts | 84/100 |
| D3 efficiency | 15pts | 66/100 |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 100/100 |

_Unscored in this run (need live mode): D1inter, D4._

### Advisory signals (NOT in the weighted aggregate)

- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: _unscored (run --d4 in live mode)_
- **Asset support recall** — deferred `assets/*` gold (router defers these on demand): _deferred (router) or no asset gold_

## Funnel

- discovered: 1
- passed: 22

**Headline bottleneck: discovered**

## Ranked bottlenecks

| Severity | Class | Locus | Finding |
| -------- | ----- | ----- | ------- |
| P1 | funnel_attrition | discovered | 1 scenario(s) first fail at stage 'discovered' |

## Scenarios

| Scenario | Class | Stage | Score | First failing stage |
| -------- | ----- | ----- | ----- | ------------------- |
| SD-001 | routing | routing | 39/100 | discovered |
| SD-002 | routing | routing | 59/100 | passed |
| SD-003 | routing | negative | 100/100 | passed |
| LS-001 | routing | routing | 59/100 | passed |
| LS-002 | routing | routing | 77/100 | passed |
| LS-003 | routing | routing | 61/100 | passed |
| LS-004 | routing | routing | 77/100 | passed |
| RD-001 | routing | negative | 100/100 | passed |
| RD-002 | advisor | routing | 100/100 | passed |
| SA-001 | advisor | routing | 100/100 | passed |
| MR-001 | browser | routing | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| MR-002 | browser | routing | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| MR-003 | browser | routing | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| MR-004 | browser | routing | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| CB-001 | browser | routing | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| CB-002 | browser | routing | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| CB-003 | browser | routing | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| CS-001 | routing | routing | 55/100 | passed |
| CS-002 | routing | negative | 100/100 | passed |
| CS-003 | routing | routing | 59/100 | passed |
| CS-004 | routing | negative | 100/100 | passed |
| CS-005 | routing | negative | 75/100 | passed |
| CS-006 | routing | routing | 81/100 | passed |
| CS-007 | routing | routing | 67/100 | passed |
| DR-001 | routing | negative | 100/100 | passed |
| DR-002 | routing | routing | 100/100 | passed |
| DR-003 | routing | routing | 100/100 | passed |
| DR-004 | routing | routing | 100/100 | passed |
| TH-001 | routing | routing | 100/100 | passed |
| TH-002 | routing | routing | 100/100 | passed |

## Contamination findings (router mode — drift, not failures)

_Playbook prompts intentionally carry trigger words; these are reported as drift signals, not scenario failures._
- SD-001: src/2_javascript, javascript, lenis, intersectionobserver
- SD-002: opencode, mcp, typescript, skill
- LS-001: opencode, mcp, config, skill
- LS-002: opencode, mcp, json, skill
- LS-003: add set -euo pipefail, opencode, skill
- LS-004: json
- RD-001: review, lenis, opencode, skill
- RD-002: sk-code, skill.md, skill
- CS-001: webflow, src/2_javascript, javascript, cdn, animation
- CS-002: sk-code, webflow, references
- CS-003: sk-code, review, opencode, skill
- CS-004: css, references
- CS-005: sk-code, webflow, references
- CS-006: sk-code, webflow, src/2_javascript, javascript, references
- CS-007: sk-code, webflow, src/2_javascript, javascript
- DR-001: opencode, mcp, skill
- DR-002: opencode, mcp, config, skill
- DR-003: review, opencode, skill
- TH-001: validation, opencode, mcp, skill
- TH-002: comment hygiene

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode. Advisory signals: mode precision unscored; relative ranking unscored (no advisor probe or no rank-below gold); route gold rows 0; telemetry missing n/a (0/0); route misses n/a (0/0); alias misses n/a (0/0); bundle misses n/a (0/0); recipe misses n/a (0/0).
- Scenario count: 30.
