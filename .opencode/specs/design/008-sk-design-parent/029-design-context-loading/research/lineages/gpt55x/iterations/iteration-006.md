# Iteration 6: Verification and adopt-if-better across fan-out lineages

## Focus

Investigate how a fan-out lineage recommendation should be verified and adopted if it improves the context-loading contract.

## Findings

1. Deep-loop fan-out isolates each CLI lineage into its own `lineages/{label}/` artifact directory and own `session_id`, so convergence and graph writes do not collide. This supports independent research conclusions without shared state contamination. [SOURCE: file:.opencode/skills/deep-loop-runtime/SKILL.md:166] [SOURCE: file:.opencode/skills/deep-loop-runtime/SKILL.md:170]

2. The fan-out merge path deduplicates research findings by id, adds `_lineages` attribution, aggregates iteration counts and averages convergence score. This is a merge/provenance mechanism, not a promotion mechanism. [SOURCE: file:.opencode/skills/deep-loop-runtime/feature_catalog/09--fanout/fanout-merge.md:21] [SOURCE: file:.opencode/skills/deep-loop-runtime/feature_catalog/09--fanout/fanout-merge.md:24] [SOURCE: file:.opencode/skills/deep-loop-runtime/feature_catalog/09--fanout/fanout-merge.md:45]

3. The manual fan-out validation contract says duplicate findings should collapse into a single entry with both contributing lineages in `_lineages`, and metrics should aggregate predictably. This prevents repeated agreement from inflating evidence counts. [SOURCE: file:.opencode/skills/deep-loop-runtime/manual_testing_playbook/09--fanout/fanout-merge-research.md:27] [SOURCE: file:.opencode/skills/deep-loop-runtime/manual_testing_playbook/09--fanout/fanout-merge-research.md:30]

4. For "adopt-if-better," the closest existing contract is the deep-improvement promotion gate. It requires score threshold, benchmark status, repeatability evidence, manifest boundary compliance, and explicit operator approval before canonical mutation. [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-improvement/references/shared/promotion_gate_contract.md:22] [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-improvement/references/shared/promotion_gate_contract.md:32] [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-improvement/references/shared/promotion_gate_contract.md:106]

## Sources Consulted

- `.opencode/skills/deep-loop-runtime/SKILL.md`
- `.opencode/skills/deep-loop-runtime/README.md`
- `.opencode/skills/deep-loop-runtime/feature_catalog/09--fanout/fanout-merge.md`
- `.opencode/skills/deep-loop-runtime/manual_testing_playbook/09--fanout/fanout-merge-research.md`
- `.opencode/skills/deep-loop-workflows/deep-improvement/references/shared/promotion_gate_contract.md`

## Assessment

`newInfoRatio`: 0.38

Novelty justification: mostly synthesis, with new support for lineage attribution and guarded adoption.

Confidence: medium. The fan-out merge contract is direct; applying promotion gates to design-skill context-loading is a reasoned adaptation.

## Reflection

What worked: Merge and adoption are separate. That distinction prevents cross-lineage consensus from becoming an unreviewed canonical change.

What failed or was ruled out: A single lineage cannot be treated as an automatic winner. Even multiple lineages need deduplication, attribution and a promotion gate before canonical mutation.

## Recommended Next Focus

Synthesize the final recommendation: a `sk-design` context loading contract with router bundle rules, dispatch prompt shape, pre-flight proof fields and adoption gates.
