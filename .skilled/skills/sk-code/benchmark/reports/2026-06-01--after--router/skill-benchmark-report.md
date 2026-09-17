# Skill Benchmark Report — sk-code

> Rendered from report.json (do not hand-edit). Scoring: `mode-a-router-replay` · trace mode: `router`.

**Verdict: CONDITIONAL** · aggregate 69/100

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | _unscored-mode-a_ |
| D1 intra (router) | 13pts | 100/100 |
| D2 discovery | 20pts | 100/100 |
| D3 efficiency | 15pts | 0/100 |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 91/100 |

_Unscored in this run (need live mode): D1inter, D4._

## Funnel

- passed: 2

## Ranked bottlenecks

| Severity | Class | Locus | Finding |
| -------- | ----- | ----- | ------- |
| P2 | orphan_reference | references/phase-detection.md | references/phase-detection.md is not reachable from any RESOURCE_MAP intent |
| P2 | orphan_reference | references/smart-routing.md | references/smart-routing.md is not reachable from any RESOURCE_MAP intent |
| P2 | orphan_reference | references/stack-detection.md | references/stack-detection.md is not reachable from any RESOURCE_MAP intent |

## Scenarios

| Scenario | Tier | Mode A score | First failing stage |
| -------- | ---- | ------------ | ------------------- |
| sk-code-loadspeed-001 | T2 | 69/100 | passed |
| sk-code-motion-002 | T2 | 69/100 | passed |

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode.
- Scenario count: 2.
