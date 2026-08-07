# Iteration 8: Implementation-Ready Deliverables

## Focus

Turn the corrected findings into concrete phase deliverables.

## Findings

1. Deliverable A: replace Phase 0 self-assessment gates in all 7 `/deep:*` command docs with deterministic invocation-context checks. The current check asks the model to decide if it is `@general`; that is the Mode-D trap. [SOURCE: .opencode/commands/deep/research.md:39-72]
2. Deliverable B: canonicalize ai-council route-proof fields everywhere: registry remains `workflowMode=ai-council`, `agent=ai-council`; YAML validator and `orchestrate-topic.cjs` should emit/expect that canonical identity. [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:66-72] [SOURCE: .opencode/commands/deep/assets/deep_ai-council_auto.yaml:117-136] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs:305-313]
3. Deliverable C: add an NDP-safe deep-route branch to `orchestrate.md`: when deep intent is detected, read registry, build the same Deep Route header shape as `deep.md`, load the resolved leaf definition, and dispatch the leaf directly at depth 1. [SOURCE: .opencode/agents/orchestrate.md:196-225] [SOURCE: .opencode/agents/deep.md:69-78]
4. Deliverable D: add a route-guard plugin only after B/C are canonical, so the plugin does not freeze wrong council values. [SOURCE: .opencode/plugins/README.md:24-50]
5. Deliverable E: run the benchmark only after A/B/C, and report failure classes rather than one generic fail bucket.

## Sources Consulted

- `.opencode/commands/deep/research.md:39-72`
- `.opencode/commands/deep/assets/deep_ai-council_auto.yaml:117-136`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs:305-313`
- `.opencode/agents/orchestrate.md:196-225`
- `.opencode/agents/deep.md:69-78`

## Assessment

- newInfoRatio: 0.48
- Novelty justification: Consolidates prior findings into a concrete, ordered implementation sequence.
- Confidence: 0.86

## Reflection

- What worked: Ordering fixes by whether they prevent benchmark contamination.
- What failed: Plugin-before-canonicalization would encode the council bug.
- Ruled out: Treating phase 008 as only smoke/benchmark.

## Recommended Next Focus

Apply self-bias review to this GPT-critical lineage.
