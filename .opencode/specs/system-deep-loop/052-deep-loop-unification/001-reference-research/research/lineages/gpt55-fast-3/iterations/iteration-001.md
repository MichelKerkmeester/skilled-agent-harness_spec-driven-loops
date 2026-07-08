# Iteration 1: Structural Layout And Path-Coupling Rules

## Focus
Validate the proposed physical layout and internal bidirectional path-coupling repair rules against the live `deep-loop-workflows` and `deep-loop-runtime` files.

## Findings

1. The unified `system-deep-loop/runtime/` layout is directionally correct, and `runtime/` should not become a workflow mode. The live hub says it is a routing-only parent over active mode packets while `deep-loop-runtime` is the consumed backend [SOURCE: .opencode/skills/deep-loop-workflows/SKILL.md:12]. The registry only exposes workflow modes with `runtimeLoopType`/`backendKind`, beginning with `research`, `review`, and `ai-council`; runtime is described as the backend key, not a mode entry [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:1] [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:19] [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:31]. The current separate graph metadata also proves why one unified identity is needed: workflows depends on and siblings runtime [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:8], while runtime points back to workflows repeatedly [SOURCE: .opencode/skills/deep-loop-runtime/graph-metadata.json:16].

2. The forward coupling rule is mostly correct: when former runtime scripts move to `system-deep-loop/runtime/scripts`, references into hub-level shared files should keep the same upward hop-count and remove the old sibling segment. Example: `render-command-contract.cjs` currently imports `../../deep-loop-workflows/shared/rollout/resolve-injection-mode.cjs` [SOURCE: .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:8]; after nesting, `../../shared/rollout/resolve-injection-mode.cjs` is the right shape because `scripts -> runtime -> system-deep-loop` still needs two upward hops.

3. Correction to child 002 plan: `render-command-contract.cjs` also has a `WORKSPACE_ROOT` depth constant that must gain one more `..` after nesting. The plan calls out this root-depth repair for `compile-command-contracts.cjs`, but the same issue exists in `render-command-contract.cjs`: `const WORKSPACE_ROOT = path.resolve(__dirname, '..', '..', '..', '..')` [SOURCE: .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs:13]. After the move, `runtime/scripts` sits one directory deeper (`system-deep-loop/runtime/scripts`), so four ups resolves to `.opencode/`, not the repo root; it should become five ups. `compile-command-contracts.cjs` has the same root pattern already noted by the plan [SOURCE: .opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs:8].

4. The reverse coupling rule is confirmed: workflow packet code should use one fewer `..` and target `runtime/`. `deep-research/scripts/reduce-state.cjs` currently reaches runtime with `../../../deep-loop-runtime/...` [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:14], and `deep-review` mirrors it [SOURCE: .opencode/skills/deep-loop-workflows/deep-review/scripts/reduce-state.cjs:13]. After the hub move, these files sit inside `system-deep-loop/<packet>/scripts`, and `../../runtime/...` is the correct target. Nested test/helper cases need the same relative-depth classification: `deep-ai-council/scripts/tests/...` currently uses four ups [SOURCE: .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/tests/orchestrate-session.vitest.ts:9], while `deep-improvement/scripts/shared/reduce-state.cjs` currently needs four ups to reach sibling runtime [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/reduce-state.cjs:122]; after nesting, the latter becomes three ups to `runtime`, matching the plan.

5. The `system-spec-kit` tooling-borrow repair is load-bearing and correctly belongs in child 002, not external-reference child 003. Runtime's `typecheck` script currently borrows the TypeScript binary from `../system-spec-kit` [SOURCE: .opencode/skills/deep-loop-runtime/package.json:10], and `tsconfig.json` borrows `../system-spec-kit/node_modules/@types` [SOURCE: .opencode/skills/deep-loop-runtime/tsconfig.json:12]. Separately, `system-spec-kit`'s council test command directly includes runtime integration tests under `../../deep-loop-runtime/...` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/package.json:31], and its Vitest config discovers `../deep-loop-runtime/tests/**/*` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/vitest.config.ts:18]. Missing any of these creates either a broken typecheck or a silent runtime-test discovery hole.

## Sources Consulted
- `.opencode/skills/deep-loop-workflows/SKILL.md`
- `.opencode/skills/deep-loop-workflows/mode-registry.json`
- `.opencode/skills/deep-loop-workflows/graph-metadata.json`
- `.opencode/skills/deep-loop-runtime/graph-metadata.json`
- `.opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs`
- `.opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs`
- `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs`
- `.opencode/skills/deep-loop-workflows/deep-review/scripts/reduce-state.cjs`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/reduce-state.cjs`
- `.opencode/skills/deep-loop-runtime/package.json`
- `.opencode/skills/deep-loop-runtime/tsconfig.json`
- `.opencode/skills/system-spec-kit/mcp_server/package.json`
- `.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts`

## Assessment
- newInfoRatio: 0.86
- Novelty justification: The layout and asymmetric path rules were mostly confirmed, but the `render-command-contract.cjs` `WORKSPACE_ROOT` miss is a new concrete correction to the staged plan.
- Confidence: High for path-depth findings because they are grounded in live file locations and exact relative imports.

## Reflection
- What worked: Checking actual executable imports before broader reference migration quickly separated code-depth risks from prose rename work.
- What failed: Broad grep results were noisy; targeted reads of executable files produced the useful correction.
- Ruled out: Treating `runtime/` as an eighth workflow mode is eliminated because the live registry models it as backend infrastructure, not a public mode.

## Recommended Next Focus
Inventory external reference migration categories and stress-test whether child 003 covers all executable, generated, advisor, agent, README, hook, and graph surfaces without over-rewriting historical specs.
