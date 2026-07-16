# Iteration 3: System-Spec-Kit Tooling Borrow

## Focus
This iteration classified the current `system-spec-kit` boundary around deep-loop artifacts. The goal was to decide what should remain an external contract, what should be wrapped through deep-loop seams, and what should not be duplicated during the proposed `system-deep-loop` merge.

## Actions Taken
- Read the current state, strategy, registry, and prior iteration outputs.
- Read the runtime artifact-root seam and the underlying `system-spec-kit` artifact-topology resolver.
- Read the workflow resource-map synthesis seam and the deep-research reducer imports that consume both seams.
- Read `system-spec-kit` validation, memory-save, test discovery, and optimizer references.
- Read runtime package/config references that still borrow dev tooling from `system-spec-kit`.

## Findings
1. `resolveArtifactRoot` should remain a single implementation owned by the spec-folder contract, with deep-loop consuming it through a backend seam rather than copying it. The runtime file explicitly says the implementation continues to live in `system-spec-kit` and re-exports `resolveArtifactRoot`, `allocateShortSubfolder`, and `normalizeSpecFolderReference` so deep-loop consumers do not reach across directly [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs:4-18]. The implementation itself enforces spec/research/review artifact topology, root-vs-child phase behavior, and shell metacharacter rejection for workflow-interpolated spec folders [SOURCE: .opencode/skills/system-spec-kit/shared/review-research-paths.cjs:166-214].
2. Spec validation and memory continuity should stay external to `system-deep-loop`. `system-spec-kit` states that agents writing authored spec docs must use templates, run `validate.sh`, and route continuity through `/memory:save`, while deep-research packet markdown is an exception with targeted validation after `spec.md` mutation [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:61]. The same skill names `generate-context.js` as the canonical save lane [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:414-418] and requires `validate.sh --strict` before completion claims [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:439]. Duplicating these inside a merged deep-loop skill would split packet governance.
3. Resource-map rendering is correctly a workflow synthesis seam, not runtime backend plumbing. `deep-loop-workflows/shared/synthesis/resource-map.cjs` says the renderer remains byte-identical to the `system-spec-kit` extractor and lives in workflow-shared space because it renders workflow output rather than runtime infrastructure [SOURCE: .opencode/skills/deep-loop-workflows/shared/synthesis/resource-map.cjs:4-18]. `deep-research/scripts/reduce-state.cjs` imports this workflow seam plus the runtime artifact-root seam, demonstrating the desired layering: reducer orchestrates synthesis, workflow shared owns output rendering, runtime owns backend primitives, and system-spec-kit owns canonical templates/topology [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:14-20].
4. `system-spec-kit` test discovery and optimizer metadata should remain external consumers that are path-rewritten, not moved wholesale. The combined Vitest config discovers system-spec-kit tests, deep-loop-runtime tests, and spec-kit script tests together [SOURCE: .opencode/skills/system-spec-kit/mcp_server/vitest.config.ts:15-22]. The optimizer manifest tunes deep-research/deep-review config paths under `deep-loop-workflows` while keeping convergence mode and other schema fields locked as contracts [SOURCE: .opencode/skills/system-spec-kit/scripts/optimizer/optimizer-manifest.json:7-18] [SOURCE: .opencode/skills/system-spec-kit/scripts/optimizer/optimizer-manifest.json:59-114]. In the merge, these files need path updates to the new `system-deep-loop` root but should not become deep-loop-owned tooling.
5. The runtime already rejects re-importing old MCP-server internals: its rules say never register MCP tools and never import from `system-spec-kit/mcp_server/lib/deep-loop/` or `.../coverage-graph/` [SOURCE: .opencode/skills/deep-loop-runtime/SKILL.md:282-286]. Its README states the ownership split directly: `system-spec-kit` owns spec folders, validation, and memory continuity; `sk-code` owns code verification; the runtime owns loop infrastructure only [SOURCE: .opencode/skills/deep-loop-runtime/README.md:120-127]. That boundary should survive the merge.
6. A smaller dev-tool borrow remains: runtime `package.json` invokes `tsc` from `../system-spec-kit/node_modules/.bin/tsc` [SOURCE: .opencode/skills/deep-loop-runtime/package.json:10-17], and `tsconfig.json` reads type roots from `../system-spec-kit/node_modules/@types` [SOURCE: .opencode/skills/deep-loop-runtime/tsconfig.json:12-14]. This is not product governance, but a migration hygiene issue: either make the merged `system-deep-loop` package self-contained for typecheck dependencies or preserve a documented workspace-level dev-tool dependency. Do not copy the MCP server to solve it.

## Questions Answered
- Answered: `system-spec-kit` should keep ownership of spec-folder topology, validation, templates, memory/context save, and canonical resource-map extraction. `system-deep-loop` should consume these through narrow seams and update external consumer configs, not duplicate the tooling.

## Questions Remaining
- What exact reference migration is required across command docs, agents, READMEs, catalogs, playbooks, specs, advisor metadata, and generated records?
- Whether fallback-router should become active GLM-5.2 to MiMo-v2.5-Pro wiring.

## Ruled Out
- Duplicating `validate.sh`, `generate-context.js`, memory tools, or the resource-map template/extractor inside the merged deep-loop system is ruled out because it would split spec-folder governance and canonical continuity ownership.
- Moving old `system-spec-kit/mcp_server/lib/deep-loop` internals back into the loop path is ruled out because runtime rules explicitly prohibit re-importing those emptied legacy locations.

## Dead Ends
- Treating every `system-spec-kit` reference as migration debt is too broad. Some references are intended external contracts (`validate.sh`, `generate-context.js`, memory tools, artifact topology), while others are path-coupled consumers that need rewrite (`vitest.config.ts`, optimizer manifest).

## Edge Cases
- Ambiguous input: "tooling borrow" covers both governance tools and dev-tool dependencies. This iteration separated product-governance boundaries from package/dev-tool hygiene.
- Contradictory evidence: Runtime docs say local dependencies are declared, but the package still invokes `tsc` and type roots through `system-spec-kit` node_modules. Treat this as a narrow dev-tool borrow, not a reason to duplicate spec-kit governance.
- Missing dependencies: No execution was needed because this was a design-boundary pass over static contracts.
- Partial success: The borrow boundary is answered at class level; exact reference migration remains for the next iteration.

## Sources Consulted
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs:4-18`
- `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:166-214`
- `.opencode/skills/system-spec-kit/SKILL.md:61`
- `.opencode/skills/system-spec-kit/SKILL.md:414-418`
- `.opencode/skills/system-spec-kit/SKILL.md:439`
- `.opencode/skills/deep-loop-workflows/shared/synthesis/resource-map.cjs:4-18`
- `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:14-20`
- `.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts:15-22`
- `.opencode/skills/system-spec-kit/scripts/optimizer/optimizer-manifest.json:7-18`
- `.opencode/skills/deep-loop-runtime/SKILL.md:282-286`
- `.opencode/skills/deep-loop-runtime/README.md:120-127`
- `.opencode/skills/deep-loop-runtime/package.json:10-17`
- `.opencode/skills/deep-loop-runtime/tsconfig.json:12-14`

## Assessment
- New information ratio: 0.69
- Novelty justification: This pass converted the prior broad `system-spec-kit` coupling observation into an ownership taxonomy: external governance, narrow seam re-exports, path-rewritten external consumers, and dev-tool dependency hygiene.
- Questions addressed: system-spec-kit tooling borrow; path-coupling refinement.
- Questions answered: system-spec-kit tooling borrow answered at class level with source anchors.
- Confidence: High for governance/tooling boundaries; medium for final package dependency strategy because that depends on the eventual physical layout of `system-deep-loop`.

## Reflection
- What worked and why: Reading the seam files (`artifact-root.cjs`, workflow resource-map re-export, reducer imports) exposed the intended layering directly.
- What did not work and why: Broad grep across `system-spec-kit` was noisy because memory benchmarks and docs mention `resource-map.md` heavily; representative contract files were more useful.
- What I would do differently: For implementation, create a rewrite matrix that separates canonical external contracts from mechanical path references before moving files.

## Recommended Next Focus
Reference migration: enumerate prose, generated, and metadata surfaces that must change from `deep-loop-workflows` or `deep-loop-runtime` to the merged `system-deep-loop` layout, distinct from the executable path rewrites already covered.
