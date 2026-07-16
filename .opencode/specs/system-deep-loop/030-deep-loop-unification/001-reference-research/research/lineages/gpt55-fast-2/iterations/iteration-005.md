# Iteration 005 - Synthesis And Execution Order

## Focus

Consolidate all findings into ranked revisions for the downstream phases.

## Findings

1. Child 002 should not start until the fan-out/YAML boundary decision is made. Either skip pre-init/post-synthesis `spec.md` mutation when `config.fanout_lineage_artifact_dir` is present, or change the detached prompt and sandbox model so spec writeback is explicitly allowed and serialized. Given fan-out isolation, skip/defer is safer. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:128-139] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:1510-1532]

2. Child 002's Stage 3b should add `artifact-root.cjs` plus its tests to the load-bearing path-repair table. This is not documentation cleanup; research and review reducers import it through runtime and will fail if the relative path resolves inside `system-deep-loop`. [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:14-20] [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs:16-18]

3. Child 003 should keep command and agent names stable while renaming identity. This matches its spec decision: skill identity becomes `system-deep-loop`, but `/deep:*` commands, mode-packet folder names, and agents remain stable. [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/spec.md:143-149]

4. The fallback-router work is useful but separable. It can improve GLM fan-out resilience, but the current plan must be extended for model-id normalization and failure classification. If time is tight, accept manual re-dispatch for this research phase and wire fallback in child 004 with a forced-failure integration test. [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/plan.md:65-94]

5. Validation gates should include a real short `/deep:research` or `/deep:review` run after the move because static grep cannot prove the reverse-direction reducer imports and artifact-root seam resolve at runtime. This is already in child 002 and should be treated as non-optional. [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:124-131]

## Final Ranked Revisions

1. P0 - Add fan-out branch to defer/skip spec.md mutations outside the lineage directory.
2. P0 - Add `runtime/lib/deep-loop/artifact-root.cjs`, `tests/unit/artifact-root.vitest.ts`, and `tests/unit/dependency-seams.vitest.ts` to child 002 Stage 3b.
3. P1 - Expand child 002 reverse-coupling inventory with runtime-capability shims, review reducer, replay graph lookup, deep-improvement runtime profile, and runtime tests that import workflow files.
4. P1 - Preserve child 003's advisor re-baseline requirements exactly; do not collapse them into residual grep.
5. P1 - Wire GLM to MiMo fallback only with canonical id mapping, explicit approval, distinct lineage labels, and quota/auth/timeout failure classification.

## Stop Decision

All five key questions have evidence-backed answers and the final pass produced mostly consolidation, so the loop reached legal convergence after iteration 5.
