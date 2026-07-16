# Deep Research Strategy: gpt55-fast-4

## Scope

Validate and stress-test the merge design for folding `deep-loop-runtime` into `deep-loop-workflows` as `system-deep-loop`.

## Execution Contract

- Lineage: `gpt55-fast-4`
- Session: `fanout-gpt55-fast-4-1783486518892-2qss01`
- Executor: `cli-opencode` using `openai/gpt-5.5-fast`
- Artifact directory: `.opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/research/lineages/gpt55-fast-4`
- Artifact root handling: bound directly to `config.fanout_lineage_artifact_dir`; `resolveArtifactRoot` was not used.
- Stop policy: run at least 3 iterations, continue until legal convergence or max 10 iterations.

## Key Questions

1. Is the proposed `system-deep-loop` layout sound, especially keeping `runtime/` as infrastructure rather than a workflow mode?
2. Does the bidirectional path-repair plan cover live internal coupling between runtime and workflow scripts?
3. Is the `system-spec-kit` tooling-borrow correctly scoped as path repair rather than dependency decoupling?
4. Does the external reference migration plan cover commands, agents, plugin/hook surfaces, READMEs, graph metadata, and advisor corpus safely?
5. Should `fallback-router.ts` wiring be part of the required merge, and where should it attach if implemented?

## Answered Questions

1. The target layout is sound if `runtime/` remains nested infrastructure and does not become a `mode-registry` workflow mode.
2. The path-repair table is mostly sound but should add `deep-ai-council/scripts/replay-graph-from-artifacts.cjs` to the internal repair scope.
3. Runtime package dependencies are local, but TypeScript tooling and shared test discovery still borrow `system-spec-kit` paths; repairing those paths is necessary and sufficient for the structural merge.
4. The external migration order is sound because it updates hard constants before generated projections, compiled contracts, corpus/prose, graph metadata, and validation gates.
5. `fallback-router.ts` wiring should remain optional for the structural merge. If implemented, model fallback policy belongs in `fanout-run.cjs`, with the generic pool exposing or receiving a retry-exhausted substitution seam.

## What Worked

- Reading the parent and child specs before live code kept the research aligned with the intended phase boundaries.
- Splitting passes by risk area exposed the missing `replay-graph-from-artifacts.cjs` internal path and the advisor duplicated identity constants.
- Comparing `fanout-pool.cjs` with `fanout-run.cjs` separated generic retry infrastructure from model-aware fanout policy.

## What Failed

- Treating child 002's named internal path table as exhaustive missed one live deep-ai-council script.
- Broad phrasing that the runtime is dependency-self-contained needs qualification: runtime dependencies are local, but TypeScript tooling remains borrowed from `system-spec-kit`.
- This lineage did not recompute the complete old-reference hit count; Stage A of child 003 still owns the authoritative baseline inventory.

## Exhausted Approaches

- Adding `runtime/` as a workflow mode was rejected because the target architecture requires runtime to be infrastructure.
- Fully decoupling TypeScript tooling during the structural move was rejected because it would blur merge validation with dependency/tooling cleanup.
- Blind old-id replacement across the repo was rejected because advisor corpus and divergence ledgers require field-scoped edits and accuracy rebaseline.

## Ruled-Out Directions

- Leaving compatibility symlinks through final completion.
- Hardcoding GLM-5.2 to MiMo-v2.5-Pro routing inside `fanout-pool.cjs`.
- Treating fallback-router wiring as a blocker for the hub rename and runtime nesting.

## Next Focus

Feed the correction set into fanout-level synthesis:

1. Add `deep-ai-council/scripts/replay-graph-from-artifacts.cjs` to child 002 Stage 3a internal path repair.
2. Clarify child 004 so fallback model policy is owned by `fanout-run.cjs`, not hardcoded into generic pool code.
3. Preserve child 003 advisor drift, generated projection, corpus accuracy, mirror sync, and residual grep gates.
