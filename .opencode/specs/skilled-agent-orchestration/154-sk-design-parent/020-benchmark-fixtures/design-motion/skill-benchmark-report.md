# Skill Benchmark Report — design-motion

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
| 001-advanced-craft-popover-tooltip | routing | 100/100 | passed |
| 001-restraint-gate | routing | 100/100 | passed |
| 001-micro-interactions-feedback | routing | 100/100 | passed |
| 001-performance-and-reduced-motion | browser | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| 002-motion-performance-failure-card | browser | _routed-out_ | browser scenario — run in live mode (needs bdg) |
| 001-animate-presence-exit-rules | routing | 100/100 | passed |
| 002-animate-presence-checklist | routing | 100/100 | passed |
| 001-purposeful-motion-plan | routing | 100/100 | passed |
| 002-motion-pattern-card | routing | 100/100 | passed |

## Contamination findings (router mode — drift, not failures)

_Playbook prompts intentionally carry trigger words; these are reported as drift signals, not scenario failures._
- 001-advanced-craft-popover-tooltip: motion for, popover, tooltip, dense toolbar
- 001-restraint-gate: animation everywhere, command palette, polished, hover
- 001-micro-interactions-feedback: hover, active, loading, delight, icon, morph
- 001-animate-presence-exit-rules: presence, animatepresence, modal
- 002-animate-presence-checklist: exit, modal, checklist
- 001-purposeful-motion-plan: design the motion, motion for, premium, feel premium
- 002-motion-pattern-card: toast, drawer, notification

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode.
- Scenario count: 9.
