# Iteration 1: Structural Merge Layout and Directional Coupling

## Focus

Validate whether the target `system-deep-loop/` layout and the bidirectional path-coupling repair rules are mechanically correct.

## Findings

1. The target layout is coherent if former `deep-loop-runtime` becomes `system-deep-loop/runtime/` infrastructure and not another mode packet. The child 002 spec lists the hub-level mode packets and a nested `runtime/` subtree, then states `runtime/` is infrastructure, not a `workflowMode`. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:154] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:169]
2. The forward coupling rule is correct. `render-command-contract.cjs` currently imports `../../deep-loop-workflows/shared/rollout/resolve-injection-mode.cjs`; after the runtime folder is nested under the renamed hub, both source and target move together and the old sibling segment should be deleted without changing hop count. [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:11]
3. The reverse coupling rule is correct. `deep-research/scripts/reduce-state.cjs` imports `../../../deep-loop-runtime/lib/deep-loop/artifact-root.cjs`, and ai-council imports runtime council primitives with the same sibling assumption. After nesting, `runtime/` is one level closer, so these become two-hop hub-local runtime imports. [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:14] [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs:14]
4. One fresh `graph-metadata.json` is the right target. The current hub graph points to runtime as a dependency, and runtime graph points back to workflows; after unification those edges become internal structure and should not remain graph edges. [SOURCE: file:.opencode/skills/deep-loop-workflows/graph-metadata.json:10] [SOURCE: file:.opencode/skills/deep-loop-runtime/graph-metadata.json:18]
5. Stage-0 quiesce is not optional paperwork. The target includes runtime `database/` state, while the parent spec calls out in-flight loop/write-lock risk; baseline checksums and no running fanout/convergence processes are real safeguards. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/spec.md:135]

## Sources Consulted

- `.opencode/specs/system-deep-loop/052-deep-loop-unification/spec.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md`
- `.opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs`
- `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs`

## Assessment

- `newInfoRatio`: 0.82
- Novelty justification: first pass established live code anchors for both coupling directions and confirmed the layout premise.
- Confidence: high for the path-repair rule; medium for exact file count because grep output was sampled/truncated.

## Reflection

- Worked: checking live imports made the asymmetric path rule concrete.
- Failed: a broad grep alone would not distinguish forward from reverse coupling.
- Ruled out: adding `runtime/` as a registry mode, because the target layout explicitly says it is infrastructure.

## Recommended Next Focus

Verify the `system-spec-kit` tooling-borrow and command-contract/codegen paths, because they are load-bearing and not covered by simple in-tree rename logic.
