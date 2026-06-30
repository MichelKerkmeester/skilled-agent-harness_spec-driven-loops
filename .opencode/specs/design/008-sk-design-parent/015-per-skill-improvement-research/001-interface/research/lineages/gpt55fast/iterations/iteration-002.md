# Iteration 2: Routing Benchmark Bottlenecks And Score Discrepancy

## Focus

Ground improvements in the current routing benchmark, including the operator-provided Mode A score claim.

## Findings

1. The current report artifact does not show `78/100`; it shows `CONDITIONAL` with aggregate `70/100` [SOURCE: file:.opencode/specs/design/008-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:5]. The prompt's `78 of 100` appears stale or from a different run. Use the report artifact as the current truth until a newer benchmark file exists.
2. The strongest dimensions are discovery and connectivity, not intra-router precision. D2 discovery is `91/100`, D5 connectivity is `100/100`, while D1 intra is `54/100` and D3 efficiency is `57/100` [SOURCE: file:.opencode/specs/design/008-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:17] [SOURCE: file:.opencode/specs/design/008-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:18] [SOURCE: file:.opencode/specs/design/008-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:19] [SOURCE: file:.opencode/specs/design/008-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:21].
3. The funnel has 12 passed scenarios and 2 routed-intra failures, with `routed-intra` named as the headline bottleneck [SOURCE: file:.opencode/specs/design/008-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:32] [SOURCE: file:.opencode/specs/design/008-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:35].
4. The two failing rows are ID-011 and ID-005. ID-011, the mechanical preflight card scenario, scores `59/100` and first fails at `routed-intra` [SOURCE: file:.opencode/specs/design/008-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:50]. ID-005, the pure-logic route-away scenario, scores `31/100` and first fails at `routed-intra` [SOURCE: file:.opencode/specs/design/008-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:55].
5. ID-011 actually observed the preflight asset read, but D1/D2 still under-scored it. The JSON shows `observedReads` includes `assets/interface_preflight_card.md` [SOURCE: file:.opencode/specs/design/008-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.json:338], while D1 resource recall is only `0.6666` [SOURCE: file:.opencode/specs/design/008-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.json:284]. This suggests expected preflight resources and the router map are not aligned, likely around `brief_to_dials.md` and/or quality-floor context.
6. ID-005 returns no resources and no agent, not an explicit route-away. The JSON response head shows empty `resources`, empty `assets`, and `agent: none` [SOURCE: file:.opencode/specs/design/008-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.json:647]. The skill does say pure logic should use `sk-code` [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:36], but the parseable routing output needs to encode that abstention so the router and benchmark can observe it.

## Sources Consulted

- `014-routing-benchmark/design-interface/skill-benchmark-report.md`
- `014-routing-benchmark/design-interface/skill-benchmark-report.json`
- `design-interface/SKILL.md`

## Assessment

- newInfoRatio: 0.72
- Novelty justification: This pass replaced a stale aggregate prompt claim with concrete benchmark artifacts and failure rows.
- Confidence: High for report values; moderate for exact cause of ID-011 recall loss because fixture expectations are not fully shown in the report.

## Reflection

What worked: scenario rows turned a vague score into actionable router fixes.

What failed or was ruled out: improving a generic aggregate without scenario-level diagnosis.

## Recommended Next Focus

Analyze router resource loading and efficiency with D3 in mind.
