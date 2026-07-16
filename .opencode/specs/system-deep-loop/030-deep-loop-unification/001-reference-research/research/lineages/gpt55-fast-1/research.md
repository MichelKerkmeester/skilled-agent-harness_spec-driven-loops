# Research Synthesis: gpt55-fast-1

## Verdict

The merge design is viable with a disciplined split: preserve the public workflow/mode-packet layer and nest the runtime as internal backend infrastructure under the unified `system-deep-loop` identity. Do not flatten runtime code into mode packets, do not turn runtime into a workflow mode, and do not duplicate system-spec-kit governance tools.

The core merge should proceed through child 002/003 as staged. Fallback-router wiring should not block the structural merge. Keep child 004 optional/operator-gated; if it proceeds, revise it so model-aware substitution policy lives in `fanout-run.cjs` or an explicit retry-exhausted hook, with registry/mapping, attribution, and forced-failure integration coverage.

## Execution Summary

- Lineage: `gpt55-fast-1`
- Session: `fanout-gpt55-fast-1-1783486518892-2qss01`
- Executor: `cli-opencode` with `openai/gpt-5.5-fast`
- Iterations completed: 5
- Stop reason: converged, all key questions answered
- newInfoRatio trend: 0.82, 0.74, 0.69, 0.57, 0.46
- Artifact root: `.opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/research/lineages/gpt55-fast-1`

## Key Findings

### 1. Preserve Hub And Backend Separation

`deep-loop-workflows` is the public, advisor-routable hub/mode-packet layer and `deep-loop-runtime` is the MCP-free backend consumed by those modes. The merged shape should keep those roles distinct inside one `system-deep-loop` skill identity.

Evidence:
- `.opencode/skills/deep-loop-workflows/SKILL.md:12`
- `.opencode/skills/deep-loop-workflows/SKILL.md:37-43`
- `.opencode/skills/deep-loop-runtime/README.md:120-127`

Recommendation:
- Rename the family identity to `system-deep-loop` with runtime nested as infrastructure.
- Keep `deep-research`, `deep-review`, `deep-ai-council`, and `deep-improvement` as workflow packets.

### 2. Path Coupling Requires Atomic Repair

The move must update command YAML, compiled contracts, doctor routes/assets, orchestrator and agent prompt contracts, advisor Python/TypeScript/tests/metadata, system-spec-kit test/optimizer paths, and runtime integration docs together. Generated command contracts are outputs, not authoritative sources.

Evidence:
- `.opencode/commands/deep/assets/deep_research_auto.yaml:64-77`
- `.opencode/commands/deep/assets/compiled/deep_research.contract.md:1-80`
- `.opencode/commands/doctor/_routes.yaml:100-110`
- `.opencode/agents/orchestrate.md:185-206`
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2570-2587`
- `.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts:15-22`

Recommendation:
- Treat source YAML/advisor/test files as the rewrite inputs.
- Regenerate compiled command contracts after source rewrites.
- Preserve system-spec-kit reverse test coverage after path-depth repair.

### 3. system-spec-kit Governance Stays External

Spec-folder topology, validation, memory/context save, and canonical resource-map extraction should remain system-spec-kit ownership. Deep-loop should consume them through narrow seams rather than copying governance tools into `system-deep-loop`.

Evidence:
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs:4-18`
- `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs:166-214`
- `.opencode/skills/system-spec-kit/SKILL.md:61`
- `.opencode/skills/system-spec-kit/SKILL.md:414-439`
- `.opencode/skills/deep-loop-workflows/shared/synthesis/resource-map.cjs:4-18`
- `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:14-20`

Recommendation:
- Keep `validate.sh`, `generate-context.js`, memory tools, artifact topology, and resource-map extraction as external contracts.
- Path-rewrite system-spec-kit consumers such as Vitest and optimizer manifests; do not move those tools into deep-loop.

### 4. External Reference Migration Needs Staging, Not Blind Replacement

Child 003's staged plan is directionally correct. It should update skill identity, structured routing fields, advisor constants/projections/corpus labels, generated command contracts, agent mirrors, hooks/plugins/CI, graph metadata edges, and live docs/playbooks/catalogs. It should freeze `/deep:*` command names and agent names, and leave historical specs out of the residual-grep scope.

Evidence:
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/spec.md:57-82`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/spec.md:143-149`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:66-104`
- `.opencode/agents/orchestrate.md:185-206`
- `.claude/agents/orchestrate.md:150-195`
- `.opencode/plugins/mk-deep-loop-guard.js:35`
- `.opencode/hooks/pre-commit:36-45`
- `.github/workflows/agent-mirror-sync.yml:14-23`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:22-77`

Recommendation:
- Keep field-scoped advisor corpus label updates and routing accuracy re-baseline as mandatory closeout gates.
- Update `.opencode/agents` and `.claude/agents` together and validate mirror sync.
- Collapse duplicate sibling graph edges to one meaningful `system-deep-loop` edge.

### 5. Fallback-Router Wiring Is Valuable But Optional

`fallback-router.ts` is mature pure routing code, but the active fan-out path retries the same lineage/model and never calls it. Current GLM and MiMo model profiles also document no automatic fallback. Real wiring needs registry/config, canonical-id to provider-slug mapping, lineage attribution, and integration tests.

Evidence:
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:57-74`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:299-431`
- `.opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts:36-166`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:618-653`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1343-1375`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:241-282`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md:35-62`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/plan.md:48-94`
- `.opencode/skills/sk-prompt-models/references/models/glm-5.2.md:139-158`
- `.opencode/skills/sk-prompt-models/references/models/mimo-v2.5-pro.md:154-169`

Recommendation:
- Do not make fallback-router wiring a blocker for child 002/003 or closeout.
- If child 004 proceeds, amend it before implementation: model policy belongs in `fanout-run.cjs` or an explicit retry-exhausted callback, not hardcoded inside generic `fanout-pool.cjs`.
- Add a forced-failure test proving provider-prefixed `zai-coding-plan/glm-5.2` re-dispatches as provider-prefixed MiMo with clear attribution.

## Verification Implications

Completion for the merge should not be claimed until at least these gates pass:

1. Unified skill package validation for hub and mode packets.
2. Runtime tests and typecheck after path-depth repairs.
3. `system-spec-kit` reverse test discovery or equivalent council validation remains green.
4. Live short `/deep:research` or `/deep:review` smoke, or equivalent command-level coverage.
5. Advisor routing drift guard and generated projection freshness.
6. Advisor corpus accuracy re-baseline at or above Stage-A baseline.
7. Agent mirror sync for `.opencode` and `.claude` agent files.
8. Residual grep for old skill names, excluding historical specs and explicit allowlist only.
9. No temporary compatibility symlinks or shims left before final success criteria.

## Ruled-Out Directions

- Flattening runtime and workflow packets into one directory.
- Moving directories first and relying on generated contracts to catch up.
- Duplicating system-spec-kit validation, memory, topology, or resource-map tooling inside `system-deep-loop`.
- Repo-wide blind find/replace across all old skill references.
- Renaming `/deep:*` commands or `@agent` names as part of the skill-identity migration.
- Treating fallback-router wiring as mandatory merge closeout.
- Hardcoding GLM-to-MiMo substitution inside the generic capped-pool primitive.

## Residual Risks

- The authoritative old-reference count still belongs to child 003 Stage A and must be recaptured immediately before implementation.
- Line-number citations reflect the current live files and may shift after the physical move.
- Fallback-router wiring remains useful hardening; deferral accepts same-model retry/salvage/manual re-dispatch for GLM failures.

## Final Recommendation

Proceed with the staged `system-deep-loop` merge. Keep child 002 focused on structure and internal path-depth repair, child 003 on external references and advisor re-baseline, and child 004 optional/operator-gated. Before implementing child 004, amend it for provider-slug mapping, orchestration-layer substitution, attribution, and forced-failure integration testing.
