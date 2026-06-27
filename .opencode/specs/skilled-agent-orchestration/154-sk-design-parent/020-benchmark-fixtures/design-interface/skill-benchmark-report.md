# Skill Benchmark Report — design-interface

> Rendered from report.json (do not hand-edit). Scoring: `mode-a-router-replay` · trace mode: `router`.

**Verdict: PASS** · aggregate 98/100

## Coverage

- Scored (text executors): **14** · routed out to browser harness: **0**
- By class — routing: 14 · advisor: 0 · browser: 0

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | 94/100 |
| D2 discovery | 20pts | 100/100 |
| D3 efficiency | 15pts | 100/100 |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 100/100 |

_Unscored in this run (need live mode): D1inter, D4._

### Advisory signals (NOT in the weighted aggregate)

- **D4 task-outcome** — routine-task usefulness (skill-on vs off), separate from D4 hallucination: _unscored (run --d4 in live mode)_
- **Asset support recall** — deferred `assets/*` gold (router defers these on demand): _deferred (router) or no asset gold_

## Funnel

- passed: 14

## Ranked bottlenecks

_None._

## Scenarios

| Scenario | Class | Score | First failing stage |
| -------- | ----- | ----- | ------------------- |
| ID-014 | routing | 100/100 | passed |
| ID-013 | routing | 100/100 | passed |
| ID-012 | routing | 100/100 | passed |
| ID-011 | routing | 100/100 | passed |
| ID-010 | routing | 100/100 | passed |
| ID-008 | routing | 100/100 | passed |
| ID-009 | routing | 100/100 | passed |
| ID-007 | routing | 100/100 | passed |
| ID-005 | routing | 89/100 | passed |
| ID-006 | routing | 89/100 | passed |
| ID-004 | routing | 100/100 | passed |
| ID-003 | routing | 100/100 | passed |
| ID-002 | routing | 100/100 | passed |
| ID-001 | routing | 100/100 | passed |

## Contamination findings (router mode — drift, not failures)

_Playbook prompts intentionally carry trigger words; these are reported as drift signals, not scenario failures._
- ID-014: design, dials, variance, density, design read
- ID-013: register, what fails, copy, lorem, ai-tell phrasing, fake-precise
- ID-012: layout, contrast, what fails, mechanical, layout gate, hero lines
- ID-011: pre-flight, ship or fix
- ID-010: design, deviate
- ID-008: design, existing design system, design system
- ID-009: design, actually rendered, matches the intent
- ID-007: design
- ID-006: readme
- ID-004: the cliche, typical look
- ID-003: landing page, quality floor, accessibility, what fails, before i ship
- ID-002: palette, contrast
- ID-001: design, distinctive, landing page

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode.
- Scenario count: 14.
