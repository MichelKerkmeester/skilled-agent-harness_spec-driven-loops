# Iteration 2: Bidirectional Path-Coupling Repair

## Focus

This iteration stress-tested the Class A and Class B path-repair rules against live runtime scripts, workflow reducers, council scripts, improvement scripts, and runtime tests.

## Findings

1. The Class A rule is directionally correct for runtime scripts reaching workflow content: remove the old sibling segment when runtime nests under `system-deep-loop/runtime/`. `render-command-contract.cjs` currently imports `../../deep-loop-workflows/shared/rollout/resolve-injection-mode.cjs`; after `runtime/scripts/` moves under the unified hub, `../../shared/rollout/resolve-injection-mode.cjs` is the analogous target [SOURCE: .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:8-13]. Child 002 already records this exact example [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:68-76].
2. `compile-command-contracts.cjs` remains a special Class A case because it mixes repository-root derivation with many absolute-ish `.opencode/skills/deep-loop-workflows/...` source literals. Its `WORKSPACE_ROOT` currently climbs four levels from `deep-loop-runtime/scripts/`, and after nesting it must climb five [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:8]. Its shared sources and command source lists also require `system-deep-loop` path rewrites [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:13-30] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:32-78].
3. The Class B rule is directionally correct but the table is incomplete. Research and review reducers import runtime through `../../../deep-loop-runtime/...`, which should become `../../runtime/...` after the workflow packets remain one level above nested runtime [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:14-20] [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/scripts/reduce-state.cjs:13-15]. The same reverse-coupling shape exists in research/review runtime-capability shims, and those are tested explicitly by runtime's own unit suite [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/scripts/runtime-capabilities.cjs:4-19] [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/scripts/runtime-capabilities.cjs:4-19] [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/runtime-capabilities.vitest.ts:10-12].
4. Council path repair must include both `orchestrate-topic.cjs` and `orchestrate-session.cjs`; child 002 names topic only, but session imports runtime council primitives too [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs:13-18] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-session.cjs:16-18]. The runtime integration-points document already lists both as active consumers [SOURCE: .opencode/skills/deep-loop-runtime/references/integration_points.md:160-166].
5. `deep-ai-council/scripts/replay-graph-from-artifacts.cjs` is an internal workflow-to-runtime path-coupling site, not merely external reference migration. Its usage text and `findRepoRoot()`/`runtimeUpsertScript()` logic hardcode `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs` [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs:21-32] [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs:51-66]. If phase 002 moves runtime before phase 003, this replay command breaks unless updated in 002 or protected by a temporary compatibility path.
6. Improvement host shims are also real Class B sites. `improvement-journal.cjs` imports runtime lifecycle taxonomy through four `..` segments [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/improvement-journal.cjs:17-24], and `reduce-state.cjs` computes `RUNTIME_DEEP_LOOP` through a `path.join` array that names `deep-loop-runtime` [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/reduce-state.cjs:118-125]. Child 002 includes these two, and that inclusion is correct [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:84-87].
7. Runtime tests need a wider static inventory than the plan's short table implies. The unit suite has direct references to workflow shims and assets, including host-driven improvement [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/host-driven-improvement.vitest.ts:12-14], runtime-capability shims and expected asset suffixes [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/runtime-capabilities.vitest.ts:103-110], and deep-research reducer imports [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/deep-research-reduce-state.vitest.ts:10-15]. These should be classified as executable import, path expectation, fixture, or historical prose before the move.

## Ruled Out

- A blind global replace of `deep-loop-runtime` and `deep-loop-workflows`: ruled out because relative hop counts differ by file depth and some references are historical prose, generated contract source lists, or expected-path assertions rather than live imports.
- Deferring `replay-graph-from-artifacts.cjs` to broad external reference migration: ruled out because it is an internal executable workflow script with a runtime script lookup.

## Dead Ends

- Broad grep over all workflow markdown was noisy due to playbooks, changelogs, benchmarks, and feature catalogs; executable `.cjs` and targeted test reads were more useful.

## Edge Cases

- Ambiguous input: "path-coupling repair" includes both executable imports and validation expectations; this iteration classified both but did not treat every prose hit as a phase 002 blocker.
- Contradictory evidence: Child 002 says "All 12 files follow this pattern" [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md:88], but direct grep/read found additional workflow-to-runtime shims (`runtime-capabilities.cjs`, `orchestrate-session.cjs`, `replay-graph-from-artifacts.cjs`) that need explicit ownership.
- Missing dependencies: None.
- Partial success: The iteration did not exhaust every generated contract literal; it identified representative classes and concrete omissions.

## Sources Consulted

- `.opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:8-13`
- `.opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:8-78`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:938-969`
- `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:14-20`
- `.opencode/skills/deep-loop-workflows/deep-review/scripts/reduce-state.cjs:13-15`
- `.opencode/skills/deep-loop-workflows/deep-research/scripts/runtime-capabilities.cjs:4-19`
- `.opencode/skills/deep-loop-workflows/deep-review/scripts/runtime-capabilities.cjs:4-19`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs:13-18`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-session.cjs:16-18`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs:21-66`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/improvement-journal.cjs:17-24`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/reduce-state.cjs:118-125`
- `.opencode/skills/deep-loop-runtime/tests/unit/runtime-capabilities.vitest.ts:10-12`
- `.opencode/skills/deep-loop-runtime/tests/unit/host-driven-improvement.vitest.ts:12-14`
- `.opencode/skills/deep-loop-runtime/tests/unit/deep-research-reduce-state.vitest.ts:10-15`

## Assessment

- New information ratio: 0.74
- Novelty justification: Confirms the planned directional rules and adds new concrete omissions in reverse-coupling and tests.
- Questions addressed: bidirectional path-coupling repair.
- Questions answered: Are the bidirectional path-coupling repair rules complete for workflow-to-runtime and runtime-to-workflow references after the move?
- Confidence: High that direction is correct; high that the current table is incomplete; medium on total count until a full classified residual inventory is produced.

## Reflection

- What worked and why: Narrow executable grep followed by targeted Read separated live imports from noisy prose references.
- What did not work and why: Broad markdown grep across the workflow tree produced too many documentation hits to classify in one iteration.
- What I would do differently: For implementation, run a classified residual grep with buckets for import/require, command YAML, test expectation, graph metadata, and prose docs.

## Recommended Next Focus

Validate the `system-spec-kit` tooling-borrow repair and hidden seams, especially runtime artifact-root, test:council fixtures, and cross-package vitest globs.
