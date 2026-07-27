# Skill Benchmark Report — code-webflow

> Rendered from report.json (do not hand-edit). Scoring: `mode-a-router-replay` · trace mode: `router`.

**Verdict: PASS** · aggregate 91/100

## Coverage

- Scored (text executors): **9** · routed out to browser harness: **4**
- By class — routing: 9 · advisor: 0 · browser: 4

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | 100/100 |
| D2 discovery | 20pts | 100/100 |
| D3 efficiency | 15pts | 72/100 |
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
| WF-013 | routing | 97/100 | passed |
| WF-010 | routing | 94/100 | passed |
| WF-011 | routing | 90/100 | passed |
| WF-012 | routing | 84/100 | passed |
| WF-006 | browser | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| WF-007 | browser | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| WF-008 | browser | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| WF-009 | browser | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| WF-001 | routing | 100/100 | passed |
| WF-002 | routing | 90/100 | passed |
| WF-003 | routing | 92/100 | passed |
| WF-004 | routing | 90/100 | passed |
| WF-005 | routing | 84/100 | passed |

## Contamination findings (router mode — drift, not failures)

_Playbook prompts intentionally carry trigger words; these are reported as drift signals, not scenario failures._
- WF-013: standards, typescript, .ts, commonjs, .cjs, docstring
- WF-010: verify, deploy, cdn, wrangler, minify, staging
- WF-011: build, form upload, filepond, field validation, focus trap
- WF-012: video, hls, adaptive stream, video player
- WF-001: implement, create, feature, component, module, smooth-scroll
- WF-002: lint, format, quality gate, naming, code smell
- WF-003: debug, broken, stack trace, console error, regression
- WF-004: verify, passing, type-check, alignment drift, completion claim
- WF-005: unit test, integration test, coverage, vitest, animation

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode. Advisory signals: mode precision unscored; relative ranking unscored (no advisor probe or no rank-below gold); route gold rows 0; telemetry missing n/a (0/0); route misses n/a (0/0); alias misses n/a (0/0); bundle misses n/a (0/0); recipe misses n/a (0/0).
- Scenario count: 13.
