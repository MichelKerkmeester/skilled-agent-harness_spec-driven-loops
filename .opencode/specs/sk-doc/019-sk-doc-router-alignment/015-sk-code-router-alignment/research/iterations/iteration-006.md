# Iteration 6: Leaf-Recall Optimization Ranking

## Focus

Rank concrete `INTENT_SIGNALS`, `RESOURCE_MAP`, router-template, scoring-logic, leaf-manifest, and benchmark-JSON changes by expected leaf-recall gain, regression risk, and validation burden. The rendered iteration prompt takes precedence over the reducer strategy's stale `Next Focus`. This pass distinguishes true routing changes from contract-only and measurement-only changes and does not implement any recommendation.

## Findings

1. **First fix the D3 measurement contract; it is not currently a sound guard for router optimization.** The sk-code loader copies every path under “Expected references loaded” into `expectedResources`, with no sk-code-shape completeness flag, while D3 treats every routed path not exactly in that list as waste. Yet `SD-001` calls its list “exact” and then defines PASS as loading *at least three* implementation paths, making its gold a minimum set rather than a complete inventory. This explains why the committed row labels 23 of 26 routed pairs as waste even though the authored test does not forbid the other implementation guidance. Add an independent-gold field such as `resourceGoldCompleteness: "minimum" | "exhaustive"`; compute precision-style D3 only for `exhaustive`, and use declared forbidden prefixes/budget caps for `minimum`. **Expected benefit:** high confidence in no-waste claims, but no true recall gain. **Regression risk:** medium because aggregate D3 changes; old rows must default fail-closed or be migrated explicitly. **Validation burden:** medium. **Falsifying test:** an `SD-001` minimum-set row must no longer call all useful extras waste, while an exhaustive synthetic row must retain the current `1 - unexpected/routed` result. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:258-315] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:235-291] [SOURCE: .opencode/skills/sk-code/manual_testing_playbook/surface_detection/webflow_detection.md:30-48] [SOURCE: .opencode/skills/sk-code/manual_testing_playbook/surface_detection/webflow_detection.md:84-89] [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:380-440]

2. **Highest-ranked true router change: replace monolithic intent unions with a two-tier resource-map template.** The current template selects every intent within one point of the top score and unions each selected intent's entire list before surface/language slicing. Broad rows such as `IMPLEMENTATION` contain dozens of unrelated leaves, while cross-stack prompts legitimately match several unit-weight intents. Introduce a small per-intent `required` set plus `supplemental` rules keyed by specific phrases/path facts (for example Motion.dev + in-view, CDN, reduced-motion, target language). This can add a missed expected leaf while removing unrelated supplements in the same route, lifting recall without mechanically increasing routed count. **Expected benefit:** high recall and D3 improvement. **Regression risk:** medium-high because resource selection changes, but hub mode/surface routing is a separate layer. **Validation burden:** high. **Falsifying test:** fitted positive recall must rise, current negative/forbidden cases must not regress, routed-count budgets must not rise, and all 18 surface expectations must remain unchanged. [SOURCE: .opencode/skills/sk-code/shared/references/smart_routing.md:320-458] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:435-459] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:555-599] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:629-655] [INFERENCE: current-source replay of the authored prompts returned 31 resources for SD-001 and 43 for CS-001, confirming that broad unioning—not surface selection—is the dominant candidate-set expansion]

3. **Second-ranked true router change: make signal scoring specificity-aware only after map tiering.** The projection gives one weight to every keyword in an intent and selects all intents within `AMBIGUITY_DELTA`; substring matching is the default except for four hard-coded boundary terms. Adding more ordinary keywords before tiering can therefore increase broad-map activation and D3 waste. A safer template supports phrase-specific weights or exact/context predicates and uses generic verbs only as weak evidence; narrow terms such as `prefers-reduced-motion`, `motion.dev`, target extensions, and path markers should dominate generic `build`, `create`, or `animation`. **Expected benefit:** medium-high recall through better conditional supplements and fewer accidental ties. **Regression risk:** high if applied to hub mode/surface signals; confine it first to the retained leaf router. **Validation burden:** high. **Falsifying test:** replay must preserve the hub's 18/18 surface outputs, improve holdout Recall@k, and not increase selected-intent count or routed-count p95 on negative prompts. [SOURCE: .opencode/skills/sk-code/shared/references/smart_routing.md:304-341] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:70-96] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:411-459] [SOURCE: .opencode/skills/sk-code/manual_testing_playbook/cross_stack_routing/prefers_reduced_motion.md:33-60]

4. **Leaf-manifest and universal-preamble qualification remain contract changes, not recall optimizations.** Typed-gold derivation filters independently authored body gold to resolvable leaves in the dominant manifest mode, while replay first chooses raw resources and only then builds typed pairs. Regenerating `leaf-manifest.json`, adding a truthful alias, or introducing a non-routable shared identity can clear unresolved-resource errors and increase typed eligibility, but cannot add a missing raw leaf. Rank this below routing changes for recall and validate it with a raw-route invariance test. **Expected benefit:** zero true raw recall; high contract accuracy. **Regression risk:** low for truthful aliases, high for a new ordinary registry mode. **Validation burden:** medium. **Falsifying test:** identity-only changes must leave selected raw resources, flat hit counts, D1/D2, D3, and all surface routes unchanged; only unresolved counts, typed eligibility, manifest digest, and contract verdict may change. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:427-475] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:486-518] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:629-655] [SOURCE: .opencode/specs/sk-doc/031-sk-doc-router-alignment/015-sk-code-router-alignment/research/findings-registry.json:423-480]

5. **Benchmark JSON should prove generalization, never manufacture a gain.** Add independently authored holdout prompts, exhaustive/minimum gold semantics, forbidden-resource negatives, route-count budgets, and frozen 18/18 surface expectations to source fixtures; do not edit generated report JSON or derive gold from current output. The current committed report has zero holdouts, and the current source probe no longer reproduces its exact routed counts, so it is useful historical evidence but not a post-change oracle. **Expected benefit:** no direct recall gain, high protection against fitted gaming. **Regression risk:** low if additive and independently authored. **Validation burden:** medium-high because a clean baseline and controlled candidate run are required. **Falsifying test:** a candidate that improves fitted recall but regresses holdout recall, negative suppression, route budgets, or any surface expectation must fail. [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:176-184] [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:356-440] [SOURCE: .opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:1543-1629] [SOURCE: .opencode/skills/sk-code/manual_testing_playbook/cross_stack_routing/webflow_plus_motion_dev.md:33-59] [INFERENCE: current-source replay returned different resource counts than the committed baseline, so exact before/after claims require a freshly generated baseline from the same source revision]

## Ranked Recommendation Matrix

| Rank | Change | Classification | Expected recall gain | Regression risk | Validation burden |
|---:|---|---|---|---|---|
| 0 | Explicit minimum-vs-exhaustive gold and conditional D3 | Measurement prerequisite | None directly | Medium | Medium |
| 1 | Two-tier `RESOURCE_MAP` (`required` + predicate-gated supplements) | True router improvement | High | Medium-high | High |
| 2 | Specificity-aware leaf-intent scoring and tie control | True router improvement | Medium-high | High | High |
| 3 | Independent holdout/negative/budget benchmark fixtures | Measurement/validation | None directly | Low | Medium-high |
| 4 | Truthful manifest alias or explicit non-routable shared identity | Contract only | None | Low to high by design | Medium |
| 5 | Edit generated benchmark report JSON | Invalid measurement manipulation | None | Critical | Invalid |

## Ruled Out

- Broadly adding keywords to `INTENT_SIGNALS` before resource-map tiering: under unit weights and near-tie unioning this can only activate more monolithic rows, so it has an uncontrolled D3 cost. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:411-459]
- Editing `leaf-manifest.json` or generated benchmark report JSON as a way to claim leaf recall: these alter identity/measurement artifacts after raw routing and do not select missing raw resources. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:629-655] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:427-475]
- Treating the committed D3 values as an exhaustive waste oracle: authored sk-code scenarios use minimum pass criteria but the scorer assumes complete equality gold. [SOURCE: .opencode/skills/sk-code/manual_testing_playbook/surface_detection/webflow_detection.md:84-89] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:241-291]

## Dead Ends

- Generated-report editing is definitively invalid as an optimization path because it changes neither the router nor independent gold.
- Manifest-only recall optimization is definitively exhausted; retain manifest work only as typed-contract remediation.

## Edge Cases

- Ambiguous input: The rendered prompt's focus differs from reducer strategy `Next Focus`; the explicit rendered iteration prompt was selected and the stale strategy focus was deferred.
- Contradictory evidence: The committed report records 26 routed pairs for `SD-001` and 19 for `CS-001`, while a current-source replay of the authored prompts returned 31 and 43. The report is treated as historical evidence, not a current oracle; a fresh same-revision baseline is required before implementation claims.
- Missing dependencies: The packet resource map is absent by config, so ranking used direct router, scorer, playbook, and report evidence. This did not block answering the optimization question.
- Partial success: None. The ranking answers the in-scope question, but no candidate was executed because implementation is forbidden.

## Sources Consulted

- `.opencode/skills/sk-code/shared/references/smart_routing.md:298-572`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:39-218,400-696`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:179-298`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:250-527`
- `.opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:150-704,1540-1919,2030-2409`
- `.opencode/skills/sk-code/manual_testing_playbook/surface_detection/webflow_detection.md:25-89`
- `.opencode/skills/sk-code/manual_testing_playbook/language_sub_detection/opencode_typescript.md:20-74`
- `.opencode/skills/sk-code/manual_testing_playbook/cross_stack_routing/webflow_plus_motion_dev.md:20-79`
- `.opencode/skills/sk-code/manual_testing_playbook/cross_stack_routing/prefers_reduced_motion.md:20-79`
- Current-source `node` replay probe for `SD-001`, `LS-001`, `CS-001`, `CS-003`, and `CS-007` using `router-replay.cjs`

## Assessment

- New information ratio: 0.90
- Questions addressed: Which routing template, scoring logic, and JSON artifact changes are most likely to lift leaf-file recall without increasing D3 waste or weakening 18/18 surface routing?
- Questions answered: A two-tier predicate-gated resource map is the highest-value true router change; specificity-aware leaf scoring is second; explicit gold completeness is a measurement prerequisite; manifest work is contract-only; independently authored holdouts and negatives validate rather than create gains.

## Reflection

- What worked and why: Comparing authored pass criteria with loader and scorer mechanics exposed that low D3 is partly a gold-semantics problem, then current-source replay localized true candidate-set expansion to monolithic leaf-map unioning without reopening surface selection.
- What did not work and why: Exact routed counts in the committed report did not reproduce against current source, so the report cannot support quantitative projected gains without a fresh same-revision baseline.
- What I would do differently: In a permitted implementation experiment, first freeze and rerun the baseline with explicit gold completeness, then test resource-map tiering and scoring changes independently rather than bundling them.

## Recommended Next Focus

Define the concrete fitted/holdout/negative/topology validation matrix for the ranked candidates: freeze 18/18 surface expectations, add independent holdouts and explicit gold completeness, set Recall@k and routed-count non-regression thresholds, and specify raw-route invariants for contract-only manifest changes.
