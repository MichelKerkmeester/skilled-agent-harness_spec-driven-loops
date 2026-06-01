# Skill Benchmark Report — sk-code

> Rendered from report.json (do not hand-edit). Scoring: `mode-b-live` · trace mode: `live`.

**Verdict: CONDITIONAL** · aggregate 76/100

## Coverage

- Scored (text executors): **3** · routed out to browser harness: **0**
- By class — routing: 2 · advisor: 1 · browser: 0

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | 96/100 |
| D2 discovery | 20pts | 94/100 |
| D3 efficiency | 15pts | 33/100 |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 91/100 |

_Unscored in this run (need live mode): D1inter, D4._

## Funnel

- passed: 3

## Ranked bottlenecks

| Severity | Class | Locus | Finding |
| -------- | ----- | ----- | ------- |
| P2 | orphan_reference | references/phase_detection.md | references/phase_detection.md is not reachable from any RESOURCE_MAP intent |
| P2 | orphan_reference | references/smart_routing.md | references/smart_routing.md is not reachable from any RESOURCE_MAP intent |
| P2 | orphan_reference | references/stack_detection.md | references/stack_detection.md is not reachable from any RESOURCE_MAP intent |

## Scenarios

| Scenario | Class | Score | First failing stage |
| -------- | ----- | ----- | ------------------- |
| SD-001 | routing | 68/100 | passed |
| RD-002 | advisor | 69/100 | passed |
| CS-001 | routing | 90/100 | passed |

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode.
- Scenario count: 3.
