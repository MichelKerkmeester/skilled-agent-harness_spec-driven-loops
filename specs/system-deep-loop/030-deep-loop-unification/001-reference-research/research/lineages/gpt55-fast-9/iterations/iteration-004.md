# Iteration 4: Reference Migration Classification

## Focus

This iteration classified which references must move when `deep-loop-workflows` and `deep-loop-runtime` become one `system-deep-loop` skill, and which public names should intentionally remain stable.

## Findings

1. Command YAML references are the highest-risk migration surface because they contain executable paths, not only prose. `deep_ai-council_confirm.yaml` still binds `skill: deep-loop-workflows`, mode `SKILL.md`, council scripts, and runtime primitives under both old skill roots [SOURCE: .opencode/commands/deep/assets/deep_ai-council_confirm.yaml:39-52]. The deep-research YAML likewise declares `skill_reference` paths under `deep-loop-workflows` and template paths under the old root [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:66-76]. These need deterministic rewrite plus regenerated compiled command contracts after the move.
2. Public command and agent names should remain stable. The hub README says active `/deep:*` commands and deep agents dispatch into matching mode packets, with `@context` remaining one-shot retrieval [SOURCE: .opencode/skills/deep-loop-workflows/README.md:84-86]. `orchestrate.md` exposes the stable OpenCode agents `@deep-research`, `@deep-review`, `@ai-council`, and `@deep-improvement` [SOURCE: .opencode/agents/orchestrate.md:161-163], and its `Deep Route` rule makes `mode-registry.json` the source of truth rather than inferring new agent names [SOURCE: .opencode/agents/orchestrate.md:184-206].
3. Agent-internal helper paths must migrate even when agent slugs remain stable. `orchestrate.md` still tells callers to persist council artifacts through `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/persist-artifacts.cjs` [SOURCE: .opencode/agents/orchestrate.md:163], while `ai-council.md` assigns graph updates to `deep-loop-runtime` CLI reducers and cites workflow helper schema paths under `deep-loop-workflows` [SOURCE: .opencode/agents/ai-council.md:398-426]. These are executable or contract-bearing references, not historical prose.
4. README migration should preserve the public/backend split rather than flatten it. The workflow README says one advisor identity routes by `workflowMode` through `mode-registry.json`, while the backend `deep-loop-runtime` does executor config, validation, state, graph, and scoring [SOURCE: .opencode/skills/deep-loop-workflows/README.md:36-68]. The runtime README says runtime is imported or called from workflow YAML, has one consumer, and exposes no MCP tools or slash commands [SOURCE: .opencode/skills/deep-loop-runtime/README.md:23-44]. After the move, runtime documentation should become nested backend documentation, not a second routable skill README/SKILL pair.
5. Graph metadata should be freshly authored as one `system-deep-loop` identity. The current workflow graph says `skill_id: deep-loop-workflows` and depends on `deep-loop-runtime` [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:3-18], while the runtime graph says `skill_id: deep-loop-runtime` and has repeated edges back to the workflow skill [SOURCE: .opencode/skills/deep-loop-runtime/graph-metadata.json:4-56]. The merged graph should remove the inter-skill workflow/runtime edges and represent runtime as intra-skill backend structure.
6. Advisor corpus and parity fixtures need explicit re-baselining. `system-skill-advisor` currently routes autonomous research, review, improvement, and council requests to `deep-loop-workflows` [SOURCE: .opencode/skills/system-skill-advisor/graph-metadata.json:35-77], while the approved divergence fixture still contains a case where native top-1 is `deep-loop-runtime` even though the gold target is `deep-loop-workflows` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/local-native-approved-divergences.json:525-531]. A rename-only path risks stale advisor expectations unless graph metadata, skill graph artifacts, labeled prompts, and approved divergences are updated together.
7. Model-prompt references should remain model-owned, not deep-loop-owned. `cli-opencode` states shared small-model facts and fallback targets live in `sk-prompt-models/assets/model_profiles.json` [SOURCE: .opencode/skills/cli-opencode/SKILL.md:291-293], and the prompt quality card lists GLM-5.2 and MiMo profile references under `sk-prompt-models` [SOURCE: .opencode/skills/cli-opencode/assets/prompt_quality_card.md:47-53]. The merge should not rename model IDs or model profile files; only deep-loop references to those models may consume them.

## Ruled Out

- Renaming `/deep:*` commands or OpenCode agent slugs as part of the skill merge: ruled out because the command/agent surfaces are stable entrypoints over registry-backed routing, and changing them would broaden the blast radius without solving the duplicate-skill-identity problem.
- Migrating `sk-prompt-models` model IDs or model profile paths into `system-deep-loop`: ruled out because model prompt profiles are executor/model assets, not deep-loop workflow assets.

## Dead Ends

- Broad unscoped grep over all docs is noisy; the useful split is executable command/agent references, graph/advisor corpus, README navigation, and historical prose.

## Edge Cases

- Ambiguous references: Some old `deep-loop-workflows` mentions in changelogs and completed specs are historical and should remain unless they are used by advisor tests or generated metadata.
- Contradictory evidence: The runtime is currently a separate skill in graph metadata, but its README says it has one consumer and no direct invocation surface. The merge resolves this by demoting runtime identity rather than deleting runtime code.
- Missing dependencies: A full generated-contract regeneration was not run in this research lineage because writes are restricted to the lineage artifact directory.
- Partial success: This iteration classifies migration buckets but does not produce a full residual hit list.

## Sources Consulted

- `.opencode/commands/deep/assets/deep_ai-council_confirm.yaml:39-52`
- `.opencode/commands/deep/assets/deep_research_auto.yaml:66-76`
- `.opencode/agents/orchestrate.md:161-206`
- `.opencode/agents/ai-council.md:398-426`
- `.opencode/skills/deep-loop-workflows/README.md:36-92`
- `.opencode/skills/deep-loop-runtime/README.md:23-44`
- `.opencode/skills/deep-loop-workflows/graph-metadata.json:3-18`
- `.opencode/skills/deep-loop-runtime/graph-metadata.json:4-56`
- `.opencode/skills/system-skill-advisor/graph-metadata.json:35-77`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/local-native-approved-divergences.json:525-531`
- `.opencode/skills/cli-opencode/SKILL.md:291-293`
- `.opencode/skills/cli-opencode/assets/prompt_quality_card.md:47-53`

## Assessment

- New information ratio: 0.46
- Novelty justification: The broad need to migrate references was known, but this pass separates stable public names from executable path migrations, graph/advisor corpus re-baselines, and model-profile non-migrations.
- Questions addressed: reference migration across commands, agents, READMEs, graph metadata, advisor corpus, and model-prompt references.
- Questions answered: What command, agent, README, graph metadata, advisor-corpus, and model-prompt references must migrate, and which should intentionally remain stable?
- Confidence: High for migration buckets; medium for exhaustive residual counts until an implementation-time classified sweep runs.

## Reflection

- What worked and why: Reading representative command YAML, agent contracts, graph metadata, and advisor fixtures separated live breakage from historical prose.
- What did not work and why: Whole-repo reference grep was too broad to classify every hit in one iteration.
- What I would do differently: Implementation should run a deterministic residual classifier with buckets for executable path, generated contract, advisor corpus, graph metadata, README/navigation, historical prose, and intentionally stable public API.

## Recommended Next Focus

Decide whether `fallback-router.ts` should stay optional/deferred or be wired now for GLM-5.2 to MiMo-v2.5-Pro substitution.
