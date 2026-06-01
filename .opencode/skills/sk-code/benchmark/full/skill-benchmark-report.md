# Skill Benchmark Report — sk-code

> Rendered from report.json (do not hand-edit). Scoring: `mode-a-router-replay` · trace mode: `router`.

**Verdict: CONDITIONAL** · aggregate 55/100

## Dimension scores

| Dimension | Weight | Score |
| --------- | ------ | ----- |
| D1 inter (advisor) | 12pts | 0/100 |
| D1 intra (router) | 13pts | 100/100 |
| D2 discovery | 20pts | 100/100 |
| D3 efficiency | 15pts | 0/100 |
| D4 usefulness | 25pts | _unscored-mode-a_ |
| D5 connectivity (hard gate) | 15pts | 91/100 |

_Unscored in this run (need live mode): D4._

## Funnel

- activated-inter: 2

**Headline bottleneck: activated-inter**

## Ranked bottlenecks

| Severity | Class | Locus | Finding |
| -------- | ----- | ----- | ------- |
| P1 | funnel_attrition | activated-inter | 2 scenario(s) first fail at stage 'activated-inter' |
| P2 | orphan_reference | references/phase_detection.md | references/phase_detection.md is not reachable from any RESOURCE_MAP intent |
| P2 | orphan_reference | references/smart_routing.md | references/smart_routing.md is not reachable from any RESOURCE_MAP intent |
| P2 | orphan_reference | references/stack_detection.md | references/stack_detection.md is not reachable from any RESOURCE_MAP intent |

## Scenarios

| Scenario | Tier | Mode A score | First failing stage |
| -------- | ---- | ------------ | ------------------- |
| sk-code-loadspeed-001 | T2 | 55/100 | activated-inter |
| sk-code-motion-002 | T2 | 55/100 | activated-inter |

## Methodology / caveats

- Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode.
- Scenario count: 2.
