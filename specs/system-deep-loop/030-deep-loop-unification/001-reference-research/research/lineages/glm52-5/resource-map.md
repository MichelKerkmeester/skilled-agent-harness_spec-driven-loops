# Resource Map — glm52-5 Lineage

Emitted from converged research-delta evidence (`config.resource_map.emit: true`). resource-map.md was NOT present at init (`config.resource_map_present: false`); this file is the post-synthesis coverage map, not a pre-existing exclusion set.

## Coverage By Source Family

| Family | Entries | Theme |
|---|---:|---|
| Commands | 3 | `deep_research_auto.yaml` spec.md-mutation branches + fan-out boundary; `/deep:*` command surfaces. |
| Skills — runtime | 7 | `artifact-root.cjs`, `fallback-router.ts`, `fanout-pool.cjs`, `cli-guards.cjs`, convergence-floor test, runtime package/tsconfig. |
| Skills — workflows | 6 | `mode-registry.json`, reverse-coupling reducers/shims, `replay-graph-from-artifacts.cjs`, council test fixtures. |
| Specs | 6 | Children 002/003/004 spec.md + plan.md; this phase's spec.md. |
| Advisor | 4 | `skill_advisor.py`, `aliases.ts`, drift-guard, approved-divergences fixture. |
| Model registry | 1 | `sk-prompt-models/assets/model_profiles.json` (GLM/MiMo quota pools + fallback_target). |
| system-spec-kit | 2 | `mcp_server/package.json` test:council, `mcp_server/vitest.config.ts` include glob. |
| Agents | 2 | `.opencode/agents` + `.claude/agents` deep agent mirrors. |
| README | 1 | Root README deep-loop reference lines. |
| Sibling graphs | 5 | system-spec-kit, system-skill-advisor, sk-code, sk-prompt, cli-opencode `graph-metadata.json` edges. |

## Net-New Files Flagged As Gaps (relative to the Plan agents' design)

These are files the plan tables did not enumerate but the research found load-bearing:

| File | Gap Class |
|---|---|
| `deep-loop-runtime/tests/unit/deep-research-convergence-floor.vitest.ts` | REQ-002 enforcer; hardcodes old skill path |
| `deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs` | Third repair class (repo-root absolute probe) |
| `deep-loop-workflows/deep-review/scripts/{reduce-state,runtime-capabilities}.cjs` | Class B omissions |
| `system-spec-kit/mcp_server/vitest.config.ts` | Silent test-set-shrink gate |
