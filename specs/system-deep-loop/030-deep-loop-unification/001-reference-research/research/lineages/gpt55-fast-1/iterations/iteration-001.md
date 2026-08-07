# Iteration 1: Structural Layout and Ownership Seams

## Focus
This iteration verified the live relationship between `deep-loop-workflows`, `deep-loop-runtime`, and `/deep:*` command YAML before judging the proposed merge into `system-deep-loop`. The selected interpretation was structural ownership and public-surface preservation, not implementation mechanics.

## Actions Taken
- Read the research lineage state files before research.
- Read the `deep-loop-workflows` hub contract, mode registry, and README.
- Read the `deep-loop-runtime` skill contract, README, library README, and integration-points reference.
- Searched command YAML for runtime/workflow path references to test whether the split is only conceptual or actively coupled.

## Findings
1. The current architecture already expresses the desired future shape as a hub plus backend: `deep-loop-workflows` is the public advisor-routable skill and `deep-loop-runtime` is the frozen, MCP-free backend consumed by all active modes [SOURCE: .opencode/skills/deep-loop-workflows/SKILL.md:12]. This supports a merged `system-deep-loop` only if the merge preserves those two roles as distinct subdomains rather than flattening them.
2. The `deep-loop-workflows` layout is a parent hub with `mode-registry.json`, exactly one `graph-metadata.json`, four active mode packets, and `shared/synthesis/` helpers [SOURCE: .opencode/skills/deep-loop-workflows/SKILL.md:72-82]. The merge design should keep that as the user-facing layer, likely as `system-deep-loop/workflows/` or equivalent, not intermix mode packet docs with runtime libraries.
3. `mode-registry.json` is load-bearing because it binds `workflowMode`, `runtimeLoopType`, `backendKind`, packet, command, agent, aliases, and advisor projection data [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:1-17] [SOURCE: .opencode/skills/deep-loop-workflows/mode-registry.json:29-53]. Any structural move must migrate this registry and its drift guards before or atomically with file-path rewrites.
4. `deep-loop-runtime` explicitly has no user-facing command or MCP tool surface; it is consumed through TypeScript imports and `.cjs` script calls [SOURCE: .opencode/skills/deep-loop-runtime/README.md:23-30] [SOURCE: .opencode/skills/deep-loop-runtime/README.md:166-168]. In a merged system, runtime should remain an internal backend package, not another advisor-routable nested skill.
5. The runtime has three internal component families (`lib/deep-loop/`, `lib/coverage-graph/`, `lib/council/`) plus scripts and database ownership [SOURCE: .opencode/skills/deep-loop-runtime/README.md:88-103]. That argues for a structural layout that keeps runtime modules under a single stable root so `.cjs` scripts and TS imports are mechanically rewriteable.
6. `/deep:research` YAML currently calls both the workflow packet and runtime paths directly: it references the deep-research skill assets plus runtime scripts/libs for fan-out, lock, convergence, prompt-pack, audit, validation, graph upsert, and telemetry [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:64-77] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:819-859] [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:1017-1039]. The merge cannot be just a directory move; command assets are primary migration targets.

## Questions Answered
- Partially answered: structural layout should preserve `workflows` as the public hub/mode-packet layer and `runtime` as the internal backend layer under a single `system-deep-loop` root.

## Questions Remaining
- Exact path-coupling inventory for commands, agents, docs, tests, scripts, and advisor corpus.
- Which system-spec-kit tooling is borrowed versus duplicated.
- Whether fallback-router should become active fallback wiring.

## Ruled Out
- Flattening all mode packets and runtime modules into one directory is ruled out because the live contracts say the hub holds no per-mode logic and the runtime is an internal backend with no user command surface [SOURCE: .opencode/skills/deep-loop-workflows/SKILL.md:37-39] [SOURCE: .opencode/skills/deep-loop-runtime/README.md:108-127].

## Dead Ends
- Treating `deep-loop-runtime` as a separate user-facing skill after the merge is a dead end: its own README says it has no slash commands or MCP tools and works on one consumer skill [SOURCE: .opencode/skills/deep-loop-runtime/README.md:23-30].

## Edge Cases
- Ambiguous input: The phrase "folding deep-loop-runtime into deep-loop-workflows as system-deep-loop" could mean physical nesting or logical unification. Evidence supports logical unification with nested internal runtime boundaries.
- Contradictory evidence: None found in this iteration.
- Missing dependencies: No prior `resource-map.md` existed in the spec folder, so this iteration used direct source reads and grep results.
- Partial success: Structural direction is answered; the full path inventory remains for the next focus.

## Sources Consulted
- `.opencode/skills/deep-loop-workflows/SKILL.md:12`
- `.opencode/skills/deep-loop-workflows/SKILL.md:72-85`
- `.opencode/skills/deep-loop-workflows/mode-registry.json:1-17`
- `.opencode/skills/deep-loop-workflows/mode-registry.json:29-53`
- `.opencode/skills/deep-loop-runtime/README.md:23-30`
- `.opencode/skills/deep-loop-runtime/README.md:88-103`
- `.opencode/commands/deep/assets/deep_research_auto.yaml:64-77`
- `.opencode/commands/deep/assets/deep_research_auto.yaml:819-859`

## Assessment
- New information ratio: 0.82
- Novelty justification: First evidence pass surfaced the core structural invariant and showed that command YAML actively couples both skill roots, while leaving detailed migration inventory for later.
- Questions addressed: structural layout; initial path-coupling context.
- Questions answered: structural layout partially answered.
- Confidence: High for ownership boundaries; medium for exact target directory names because implementation design is not in-scope to execute here.

## Reflection
- What worked and why: Reading hub/runtime contracts first clarified ownership before getting lost in path inventories.
- What did not work and why: Broad glob output was noisy because deep-loop-workflows contains large catalogs and playbooks; exact path searches will be better next.
- What I would do differently: Use targeted grep against command/agent/docs/advisor surfaces in the next iteration.

## Recommended Next Focus
Path-coupling inventory: enumerate concrete references to `.opencode/skills/deep-loop-runtime` and `.opencode/skills/deep-loop-workflows` across commands, agents, docs, scripts, tests, and advisor surfaces, and classify which must rewrite atomically for the merge.
