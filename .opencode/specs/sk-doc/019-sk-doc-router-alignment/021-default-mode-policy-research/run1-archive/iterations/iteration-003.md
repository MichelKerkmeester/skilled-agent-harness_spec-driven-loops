# Iteration 3: Exact zero-signal canon and route-gold encoding

## Focus

Specify the create-skill canon and route-gold benchmark encoding for three deliberate zero-signal policies: named-child default, null/defer, and null/detect-and-bundle. The rendered prompt pack's exact-canon focus controls this iteration; the strategy's defer-versus-detect focus is treated as a prerequisite policy distinction within it.

## Actions Taken

1. Read the rendered iteration prompt, config, append-only state, reducer strategy, and findings registry before selecting evidence.
2. Confirmed that `iteration-003.md` and `iter-003.jsonl` did not already exist and precomputed all writes inside the resolved packet.
3. Inspected the create-skill parent-hub template/canon for its current `defaultMode`, outcome, guidance, and checklist declarations.
4. Inspected the route-gold scenario contract, hard-gate documentation, and replay telemetry fields that are observable on zero signal.
5. Compared the shipped `sk-doc` defer contract with the `sk-code` detect-and-bundle contract.

## Findings

1. **The current create-skill scaffold presumes a named-child default instead of making zero-signal policy an authored decision.** Its template sets `routerPolicy.defaultMode` to `[workflow-mode-a]`, places catch-all hub identity only on that default, and describes that mode as the default; the broader canon names `single`, `orderedBundle`, `defer`, and optional `surfaceBundle`, but its checklist does not require an explicit zero-signal strategy or evidence burden. [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json:5-16] [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json:37] [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_template.md:155-179] [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_template.md:275-278]

2. **The exact create-skill declaration should retain `routerPolicy.defaultMode` and add a required `routerPolicy.zeroSignalPolicy` object.** Its fields should be `strategy` (`named-child | defer | detect-and-bundle`), `outcome` (`single | defer | surfaceBundle`), `detectionAxis` (`null | surface`), `onDetectionMiss` (`defer`), and `evidence`. Validation should enforce: `named-child` has a non-null registered workflow mode, `outcome: single`, `detectionAxis: null`, plus non-placeholder `evidence.corpusRef`, `evidence.costModelRef`, and `evidence.dominanceClaim`; `defer` has `defaultMode: null`, `outcome: defer`, and `detectionAxis: null`; `detect-and-bundle` has `defaultMode: null`, `outcome: surfaceBundle`, a registered surface axis, and a deterministic detection rule with defer-on-miss. New hubs should start at `defer`; named-child is the evidence-bearing exception, never inferred from registry order or a template placeholder. [INFERENCE: based on the current named-child-presuming template at .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json:5-16,37, the explicit null/defer behavior at .opencode/skills/sk-doc/SKILL.md:80-97, and the null/detect behavior at .opencode/skills/sk-code/SKILL.md:86-122]

3. **`sk-doc` defines the pure defer variant as “no selected workflow and a clarification contract,” not merely `defaultMode: null`.** When confidence is low or no mode wins under a null default, it loads only a fallback reference and returns `UNKNOWN_FALLBACK` with a checklist for workflow, target, inputs, and validation expectations. Its gold outcome therefore needs `workflowMode: null`, `routeOutcome: defer`, `defaultApplied: false`, `needsDisambiguation: true`, no detected surfaces, and no forbidden guessed workflow. [SOURCE: .opencode/skills/sk-doc/SKILL.md:76-97] [INFERENCE: the listed observable tuple is the benchmark representation of that contract]

4. **`sk-code` defines a distinct detect-and-bundle variant: null prevents a guessed workflow, but surface detection can still produce useful evidence and doctrine.** With no dominant workflow, it detects a surface and can load a pure surface bundle; only unresolved workflow/action details require disambiguation. Its positive detection gold therefore needs `workflowMode: null`, `routeOutcome: surfaceBundle`, `defaultApplied: false`, `needsDisambiguation: false`, and an exact detected-surface set; a paired detection-miss fixture must instead expect `defer`, an empty detected-surface set, and `needsDisambiguation: true`. [SOURCE: .opencode/skills/sk-code/SKILL.md:86-122] [INFERENCE: the paired assertions separate successful detection from a null policy that always defers]

5. **The present route-gold contract cannot fully encode those three outcomes.** Scenario guidance currently limits `routeOutcome` to `single`, `orderedBundle`, or `defer` and centers `workflowMode`/`forbiddenWorkflowModes`; deterministic intent gold is exact-set, while replay leaves `workflowMode: null` on zero score and exposes only `defaultApplied` plus `deferReason`. Consequently empty expected intents pass for both named-child and null policies, and `defaultApplied` alone still cannot prove that the named child became the effective route. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scenario_authoring.md:34-42] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:176-178] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:342-352]

6. **Route gold should add a strict `expected_route` tuple and three zero-signal fixture classes, rather than overload `expected_intent`.** The exact fields should be `zeroSignalStrategy`, `workflowMode` (string or null), `routeOutcome` (including `surfaceBundle`), `selectedIntents` (exact set), `defaultApplied`, `deferReason` (string or null), `needsDisambiguation`, `detectedSurfaces` (exact set), and `forbiddenWorkflowModes` (exact absence). Named-child gold expects `single`, the named child, empty scored intents, and `defaultApplied: true`; defer gold expects null/defer/false plus clarification; detect-and-bundle gold expects null/surfaceBundle/false plus an exact surface and no clarification, with the paired detection-miss case above. Parsing any present field must be loud and every field must compare independently, so a same-set intent success cannot mask a fallback mismatch. [INFERENCE: based on the current loud hard-gate contract at .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:176-178, current scenario fields at .opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scenario_authoring.md:34-42, and replay telemetry at .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:342-352]

## Ruled Out

- Reusing only `expected_intent: []` for zero-signal policy: exact-set success is identical for named-child and null under current replay. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:176-178] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:342-352]
- Treating the first workflow placeholder or hub-identity vocabulary owner as an implicit dominance declaration: those are scaffold mechanics, not traffic or expected-loss evidence. [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json:5-16] [SOURCE: .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json:37]

## Dead Ends

None. The next implementation-design pass should inspect validator and parser integration points rather than repeat intent same-set or current-default analysis.

## Edge Cases

- Ambiguous input: the prompt pack's exact-canon focus is narrower than strategy `NEXT FOCUS`; the prompt pack is authoritative, and defer-versus-detect was covered only as needed to specify the canon.
- Contradictory evidence: none.
- Missing dependencies: memory context and resource map were unavailable per packet state; direct repository evidence was used.
- Partial success: none.

## Sources Consulted

- `.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json:5-16,37`
- `.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_template.md:155-179,275-278`
- `.opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/scenario_authoring.md:34-42`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:176-178`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:342-352`
- `.opencode/skills/sk-doc/SKILL.md:76-97`
- `.opencode/skills/sk-code/SKILL.md:86-122`

## Questions Answered

- How should `sk-doc` defer and `sk-code` detect-and-bundle differ in fleet policy?
- What exact create-skill canon declaration and evidence burden is required?
- How must route gold observe named-child, defer, and detect fallback despite same-set limitations?

## Questions Remaining

- Which validator, template, scenario parser, evaluator, report, and test files must change to implement this canon without weakening existing route-gold?
- What migration rule should grandfather shipped hubs whose named defaults lack the newly required corpus and cost evidence?
- Which five provisional fleet verdicts survive representative zero-signal corpus validation?

## Assessment

- New information ratio: 1.00 (6 fully new, 0 partially new, 0 redundant findings).
- Questions addressed: distinct null variants; exact create-skill declaration/validation; exact zero-signal route-gold assertions.
- Questions answered: all three iteration-focus questions above.

## Reflection

- What worked and why: comparing the scaffold, benchmark contract, and two shipped null variants exposed both the missing author declaration and the missing observable assertion surface.
- What did not work and why: current intent exact-set gold cannot distinguish the policy variants because zero signal emits the same empty intent set.
- What I would do differently: next inspect only the concrete validators and route-gold parser/evaluator tests to map the smallest implementation delta and backward-compatibility boundary.

## SCOPE VIOLATIONS

None. No researched source or reducer-owned file was modified.

## Next Focus

Map the proposed fields to exact create-skill validator/template and route-gold parser/evaluator/test integration points, including a grandfathering rule for existing hubs and a failing-before/passing-after fixture matrix.
