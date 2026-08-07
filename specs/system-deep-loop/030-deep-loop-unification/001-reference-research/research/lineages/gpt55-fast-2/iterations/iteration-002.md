# Iteration 002 - Bidirectional Path Coupling

## Focus

Stress-test Class A and Class B path repair after moving `deep-loop-runtime` under `system-deep-loop/runtime`.

## Findings

1. The Class A rule is correct for runtime-to-workflow content. For example, `render-command-contract.cjs` currently uses `../../deep-loop-workflows/shared/...`; after nesting, `../../shared/...` is the same hop count with the old segment deleted. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:8-13] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:68-77]

2. The Class B rule is correct in principle but the table is incomplete. Workflow scripts that import runtime need one fewer parent hop after runtime becomes a child of the hub. Confirmed examples include research reducer, review reducer, research/review runtime capability shims, council scripts, and improvement journal/reducer paths. [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:14-20] [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/scripts/reduce-state.cjs:11-15] [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/scripts/runtime-capabilities.cjs:17-18] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs:13-18]

3. New P0: `artifact-root.cjs` is a missed runtime-to-system-spec-kit code seam. It currently climbs from `deep-loop-runtime/lib/deep-loop` to `.opencode/skills/system-spec-kit`. After nesting under `system-deep-loop/runtime`, the same `../../../system-spec-kit` resolves inside `system-deep-loop`, so it needs one more `..`. [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs:16-18]

4. The tests guarding that seam must move too. `artifact-root.vitest.ts` loads the original system-spec-kit resolver with `../../../system-spec-kit/...`, which will be wrong from `system-deep-loop/runtime/tests/unit`. `dependency-seams.vitest.ts` computes `skillsRoot = resolve(runtimeRoot, '..')`; after nesting that points at `system-deep-loop`, not `.opencode/skills`, making the sibling guard less meaningful unless adjusted. [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/artifact-root.vitest.ts:10-25] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/dependency-seams.vitest.ts:16-18] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/dependency-seams.vitest.ts:46-52]

5. Absolute repo-root lookups must be migrated explicitly. `replay-graph-from-artifacts.cjs` searches for `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs`; after the move that should point at `.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs`, not a relative hop rewrite. [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs:51-65]

## Ruled Out

- A single regex transform for all `../../../deep-loop-runtime` paths is unsafe because tests and nested `scripts/tests` directories sit at different depths.
- The four-site tooling-borrow table is not enough by itself; code imports to system-spec-kit also exist.

## Next Focus

Validate the `system-spec-kit` tooling borrow and external identity migration.
