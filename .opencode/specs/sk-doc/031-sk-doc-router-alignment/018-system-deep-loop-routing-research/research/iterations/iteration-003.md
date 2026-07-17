# Iteration 3: Skill-Benchmark Typed-Gold Producer-to-Consumer Path

## Focus

Trace how the skill benchmark discovers a hub resource manifest, obtains typed routing gold from playbook scenarios, validates that gold, converts router output to canonical typed pairs, and incorporates pair recall and precision into scenario and aggregate scores. The rendered iteration prompt selected this focus and explicitly marked the strategy file's stale collision follow-up as resolved.

## Actions Taken

1. Located the Lane C skill-benchmark loader, orchestrator, scorer, router replay, committed baseline report, and sk-doc manifest generator.
2. Traced manifest production from `mode-registry.json` and packet files into `leaf-manifest.json`.
3. Traced both supported playbook shapes into normalized scenario gold, including the manifest-gated typed-gold derivation path.
4. Traced pre-score oracle validation, router-side pair production, typed recall/precision scoring, and fitted-set aggregation.
5. Compared the current scoring contract with the committed system-deep-loop baseline to identify which lanes were actually active in that report.

## Findings

1. **The manifest is generated from declared modes and packet inventory, not discovered heuristically during scoring.** `generate-leaf-manifest.cjs` reads `mode-registry.json`, creates one entry per declared `workflowMode`, walks that mode's packet `references/` and `assets/`, adds explicitly authored aliases, rejects duplicate `(workflowMode, leafResourceId)` composites, and emits canonical bytes. The benchmark then only reads the committed `leaf-manifest.json` and snapshots its digest before and after a run, aborting if topology changes mid-score. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:88-129] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:65-77,208-237]
2. **Typed gold is opt-in and has two producer paths.** For sk-doc-shaped playbooks, `expected_leaf_resources` is parsed directly from scenario frontmatter and `expected_workflow_mode` is read only when typed gold exists. For index-table playbooks, typed gold is derived only when the target ships a manifest: packet-qualified body-gold resources are split, checked against manifest membership, and restricted to the dominant mode so the oracle stays inside the selected-map cap. Scenarios without typed gold or hubs without a manifest remain on the legacy flat lane rather than receiving a zero. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:120-140,343-417] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:427-475,486-524]
3. **Fixture validation separates oracle faults from routing failures.** The scorer engages the typed taxonomy only when both scenario typed gold and a target manifest exist, then delegates schema, manifest-membership, and selected-map validation to `validate-playbook-topology.cjs`. A blocked typed fixture is returned as an excluded row before dimensions are computed, and aggregation removes excluded rows from every denominator. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1093-1196] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1287-1300,1499-1507]
4. **The router produces the scored canonical pair bundle, and contract defects outrank ordinary misses.** Router replay dual-reads raw resources through the leaf-resource contract, verifies each pair against the committed manifest, deduplicates by composite key, and records unresolved resources. Full-inventory routes enumerate the manifest by mode to preserve fan-out twins. The scorer then compares exact composite keys; unresolved resources or a selected-map cap excess yield `routing_contract_error`, while a valid but incomplete pair set yields `routing_miss`. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:186-243,246-294] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1215-1257]
5. **Typed pairs correct the existing D1/D2/D3 resource math rather than adding a separately weighted dimension.** On valid typed rows, pair recall supersedes flat-string resource recall for D1-intra and D2, while pair precision replaces flat over-routing for D3; the diagnostic is also exposed as `typedPairRecall`. A scenario's Mode A score normalizes the measured D1-intra (13), D2 (20), D3 (15), and optional D1-inter (12) weights, and the headline aggregate averages fitted scenario scores while excluding holdouts and oracle-fault rows. The committed system-deep-loop baseline is `71`, with D1-intra `100`, D2 `100`, D3 `6`, and zero route-gold rows, so it is evidence of the old flat scoring state rather than evidence that typed scoring ran. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1311-1357,1414-1438] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1066-1079,1499-1524,1569-1575] [SOURCE: .opencode/skills/system-deep-loop/benchmark/baseline/skill-benchmark-report.json:11-56,83-117]

## Questions Answered

- How does the skill-benchmark discover, validate, and score routing gold and typed pairs?

## Questions Remaining

- Which of the roughly 319 scenarios are genuine routing decisions, and which must remain outside typed-gold scoring?
- What dependency-ordered configuration and router changes can raise the routing score without weakening fallback behavior?

## Ruled Out

- **Typed-pair recall is an additional headline weight.** It is instead the canonical resource measure feeding the existing D1-intra, D2, and D3 lanes. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1311-1357]
- **A scenario without typed gold should count as a typed zero.** The typed path is deliberately dormant unless the scenario declares typed gold and the target has a manifest. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1146-1168]
- **Malformed or stale typed gold is a router miss.** It is an oracle fault excluded from score denominators. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1287-1300,1499-1507]

## Dead Ends

None. The producer-to-consumer path was fully traceable from local source and the committed report.

## Edge Cases

- Ambiguous input: none; the rendered prompt explicitly selected benchmark tracing.
- Contradictory evidence: the reducer-owned strategy still names collision enumeration as next focus, while the later rendered prompt says that follow-up is resolved and selects benchmark tracing. Dispatch precedence resolves this in favor of the rendered prompt; the strategy was not edited.
- Missing dependencies: none required for this static source trace.
- Partial success: none.

## Sources Consulted

- `.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:88-161`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:120-140,343-524`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:65-77,148-178,193-250`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:186-294`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1066-1079,1093-1438,1499-1745`
- `.opencode/skills/system-deep-loop/benchmark/baseline/skill-benchmark-report.json:1-164`

## Assessment

- New information ratio: 1.0
- Novelty calculation: 5 fully new findings / 5 total findings = 1.0; no simplicity bonus was needed.
- Questions addressed: How does the skill-benchmark discover, validate, and score routing gold and typed pairs?
- Questions answered: How does the skill-benchmark discover, validate, and score routing gold and typed pairs?

## Reflection

- What worked and why: following the data flow in dependency order—manifest generator, scenario loader, router replay, scorer, then report—made producer/consumer boundaries and dormant gates explicit.
- What did not work and why: broad keyword searches returned unrelated benchmark and manifest surfaces; narrowing to the Lane C scripts and committed report removed that noise.
- What I would do differently: begin the next iteration from the playbook corpus loader's classification and stage fields, then count scenario classes across target playbooks rather than starting from repository-wide benchmark keywords.

## Next Focus

Classify the claimed roughly 319 scenarios by loader shape, `classKind`, stage, presence of route/typed gold, and executor requirements; distinguish genuine mode/leaf routing rows from advisor-only, browser, holdout, negative, recipe, and non-routing behavior.

## Recommended Next Focus

Build a deterministic scenario census using the benchmark loader's actual inclusion and gating rules, with counts by target skill and exclusion reason.
