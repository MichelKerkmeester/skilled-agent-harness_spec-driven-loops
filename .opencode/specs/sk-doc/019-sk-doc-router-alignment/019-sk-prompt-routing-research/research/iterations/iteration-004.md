# Iteration 4: Benchmark producer-to-report reconciliation

## Route Proof

`Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true`

## Focus

Trace the Lane-C benchmark from playbook gold through scenario scoring and report aggregation, reconcile the hub's 100-point reports with the `prompt-improve` D5-only/null report, and determine what routing-quality measurement is available before and after valid typed gold. The two report classes are treated as different benchmark targets rather than contradictory measurements of one target.

## Findings

1. The D5-only/null artifact is the **child** `prompt-improve` report, not the hub baseline: it names `targetSkill.id: prompt-improve`, has verdict `NO-SCENARIOS`, `aggregateScore: null`, D1-intra/D2/D3 null, and D5 16. Its rendered report confirms a zero-scenario denominator and seven P1 `dead_intent_key` findings. [SOURCE: .opencode/skills/sk-prompt/prompt-improve/benchmark/router_mode_a/skill-benchmark-report.json:7] [SOURCE: .opencode/skills/sk-prompt/prompt-improve/benchmark/router_mode_a/skill-benchmark-report.json:11] [SOURCE: .opencode/skills/sk-prompt/prompt-improve/benchmark/router_mode_a/skill-benchmark-report.json:29] [SOURCE: .opencode/skills/sk-prompt/prompt-improve/benchmark/router_mode_a/skill-benchmark-report.md:7] [SOURCE: .opencode/skills/sk-prompt/prompt-improve/benchmark/router_mode_a/skill-benchmark-report.md:35]

2. The canonical **hub** router and live reports both say aggregate 100, but that headline is normalized over only the measured scenario dimensions: D1-intra 100 and D2 100; D1-inter, D3, and weighted D4 are null, while D5 100 is a hard gate. The contract says Mode A normalizes over measured D1-intra/D2/D3 (plus opt-in D1-inter) and computes D5 separately as the structural gate. Therefore this 100 is not 100/100 full-dimensional routing quality. [SOURCE: .opencode/skills/sk-prompt/benchmark/router_final/skill-benchmark-report.json:11] [SOURCE: .opencode/skills/sk-prompt/benchmark/router_final/skill-benchmark-report.json:29] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md:22] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md:30]

3. The current hub denominator is four hub scenarios, each reported as 100. Their frontmatter names packet `SKILL.md` paths, but the loader's resource extractor recognizes only `code-*`, `references/`, `assets/`, and `../shared/` paths, so packet `SKILL.md` entries produce no positive resource gold. The scorer then neutralizes missing resource recall to 1 for D1-intra and D2 and makes D3 not applicable. Thus the hub 100 primarily confirms intent/packet replay for four cases; it does not measure leaf-resource recall or over-routing. [SOURCE: .opencode/skills/sk-prompt/manual_testing_playbook/hub_routing/generic_prompt_improve.md:6] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:168] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:364] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:200] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:227] [SOURCE: .opencode/skills/sk-prompt/benchmark/router_final/skill-benchmark-report.json:193]

4. Typed routing is currently unmeasurable: the hub report has `routeGoldRows: 0`, every route-miss denominator is 0, and scenario `expectedSurface`/`observedSurface`/`surfaceMatch` are null. The producer deliberately leaves scenarios without `expected_leaf_resources` ungated by the typed taxonomy, so untyped scenarios must not be interpreted as typed zeros or typed passes. [SOURCE: .opencode/skills/sk-prompt/benchmark/router_final/skill-benchmark-report.json:83] [SOURCE: .opencode/skills/sk-prompt/benchmark/router_final/skill-benchmark-report.json:116] [SOURCE: .opencode/skills/sk-prompt/benchmark/router_final/skill-benchmark-report.json:268] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:121]

5. After independently authored, manifest-valid typed gold exists, the harness can report per-scenario typed-pair recall and use that recall in D1-intra/D2, while D3 becomes typed-pair precision (`hit / observedCount`); the headline will then be the fitted-scenario average of resulting normalized per-row scores. No honest post-typed numeric score can be predicted now because the required gold and corresponding observed typed pairs do not exist. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:375] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1343] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1422] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1499] [INFERENCE: the numeric result depends on authored typed expectations and replay observations that are absent from the current corpus]

6. Provenance inspection found the checked-in hub reports unchanged between the historical hyphenated run-label paths and commit `f2ba7f29dde`, which renamed them to underscore paths with zero content changes; targeted status showed no working-tree report modifications. The current generated artifacts and committed hub history therefore agree on 100, while the D5-only/null claim is separately and correctly preserved by the checked-in child report. [SOURCE: .opencode/skills/sk-prompt/benchmark/BENCHMARK-SUMMARY.md:7] [SOURCE: .opencode/skills/sk-prompt/benchmark/router_final/skill-benchmark-report.md:3] [SOURCE: .opencode/skills/sk-prompt/prompt-improve/benchmark/router_mode_a/skill-benchmark-report.md:3] [INFERENCE: based on bounded `git status`, `git log`, `git ls-tree`, and `git show` inspection of the three report paths]

## Ruled Out

- Treating aggregate 100 as full D1-D5 coverage; three routing/usefulness dimensions remain null. [SOURCE: .opencode/skills/sk-prompt/benchmark/router_final/skill-benchmark-report.md:12]
- Treating the child `prompt-improve` D5=16 report as the hub baseline; its target and scenario denominator differ. [SOURCE: .opencode/skills/sk-prompt/prompt-improve/benchmark/router_mode_a/skill-benchmark-report.json:7]
- Counting untyped scenarios as typed failures or passes; absent typed gold intentionally does not engage the taxonomy scorer. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:121]

## Dead Ends

- No new exhausted category. A read-only benchmark rerun was unnecessary because the checked-in machine reports, producer code, rendered reports, and clean targeted Git status already established provenance and denominator semantics.

## Edge Cases

- Ambiguous input: “baseline” referred to two targets. This iteration distinguishes the hub `sk-prompt` reports from the child `prompt-improve` report.
- Contradictory evidence: resolved. Aggregate 100 and aggregate null are compatible because they belong to different targets and scenario denominators.
- Missing dependencies: independently authored typed gold and a hub `leaf-manifest.json` are absent, so the post-typed numeric score remains unmeasurable.
- Partial success: none. The artifact conflict and present measurement are resolved; the future numeric score is explicitly unknowable until valid typed gold is authored and replayed.

## Sources Consulted

- `.opencode/skills/sk-prompt/benchmark/router_final/skill-benchmark-report.json:11`
- `.opencode/skills/sk-prompt/benchmark/live_final/skill-benchmark-report.json:11`
- `.opencode/skills/sk-prompt/prompt-improve/benchmark/router_mode_a/skill-benchmark-report.json:7`
- `.opencode/skills/sk-prompt/benchmark/BENCHMARK-SUMMARY.md:7`
- `.opencode/skills/sk-prompt/manual_testing_playbook/hub_routing/generic_prompt_improve.md:6`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:121`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1332`
- `.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scoring_contract.md:20`

## Assessment

- New information ratio: 0.92
- Questions addressed: Why does the baseline report 100 while routing dimensions remain null, and what score appears once typed routing is measured?
- Questions answered: provenance of both score classes; exact current hub denominator and measured dimensions; what typed scoring can report
- Questions unresolved: the post-typed numeric score, which requires valid authored typed gold and replay observations
- Novelty basis: five findings are fully new and one partially extends the prior baseline caveat: `(5 + 0.5) / 6 = 0.9167`, rounded to 0.92.

## Reflection

- What worked and why: joining target identity, scenario-loader parsing, scorer null-handling, aggregate logic, and Git history separated artifact provenance from metric semantics.
- What did not work and why: searching only the hub benchmark directory could not locate the D5=16 claim because that report lives under the child packet.
- What I would do differently: begin future score reconciliations by grouping reports by `targetSkill.id` and scenario count before comparing headline values.

## Recommended Next Focus

Classify the 32 playbook scenarios by genuine routing decision, select only independently authorable typed-gold candidates, and specify their expected `(workflowMode, leafResourceId)` pairs without deriving them from router output.
