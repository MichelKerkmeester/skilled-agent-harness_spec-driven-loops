# Iteration 1: Structural Layout And Bidirectional Path Repair

## Focus

Validate whether the proposed `system-deep-loop/` target layout and path-repair classes match live code rather than only the plan documents.

## Findings

1. The target layout should treat `runtime/` as infrastructure, not a workflow mode. Child 002's architecture addendum places `runtime/` under `system-deep-loop/` and explicitly says it is not a `workflowMode`, while the live registry enumerates mode entries for research, review, ai-council, and improvement lanes only. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:154] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:169] [SOURCE: file:.opencode/skills/deep-loop-workflows/mode-registry.json:29]
2. The forward/reverse path-repair rule is correct and should remain the central implementation invariant. Runtime-to-workflows calls, such as `render-command-contract.cjs` requiring `../../deep-loop-workflows/shared/rollout/resolve-injection-mode.cjs`, are a different class from workflow-to-runtime imports, such as `deep-research/scripts/reduce-state.cjs` requiring `../../../deep-loop-runtime/lib/deep-loop/artifact-root.cjs`. [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:8] [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:14] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:68]
3. The `system-spec-kit` borrow is load-bearing. `artifact-root.cjs` says the single implementation lives in `system-spec-kit` and re-exports `review-research-paths.cjs`; runtime typecheck also points at `../system-spec-kit/node_modules`, and system-spec-kit vitest includes `../deep-loop-runtime/tests`. [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs:4] [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs:16] [SOURCE: file:.opencode/skills/deep-loop-runtime/package.json:10] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts:18]
4. Child 002 is right to keep TypeScript tooling decoupling out of scope. The existing plan repairs paths only and explicitly defers genuine decoupling so merge failures and tooling-decoupling failures remain distinguishable. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:90] [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:99]
5. The reducer is unsafe as a stock helper for this detached lineage. `reduceResearchState()` derives `researchDir` by calling `resolveArtifactRoot(resolvedSpecFolder, 'research')`; the fanout prompt instead requires direct binding to `config.fanout_lineage_artifact_dir`. [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:2510] [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:2516] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1010]

## Sources Consulted

- `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md`
- `.opencode/skills/deep-loop-workflows/mode-registry.json`
- `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs`
- `.opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs`
- `.opencode/skills/deep-loop-runtime/package.json`
- `.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts`

## Assessment

- newInfoRatio: 0.92
- Novelty justification: first pass established the concrete path-seam and topology evidence for the proposed merge.
- Confidence: high for the structural recommendation because both specs and live code agree on the path classes.
- Code graph note: code graph status is stale, so no structural graph answer is used as proof.

## Reflection

- Worked: comparing plan tables to actual imports exposed the two path-repair classes clearly.
- Failed: stock reducer execution is not safe for a detached lineage override.
- Ruled out: adding `runtime` as a registry mode.

## Recommended Next Focus

External reference and advisor migration risk.
