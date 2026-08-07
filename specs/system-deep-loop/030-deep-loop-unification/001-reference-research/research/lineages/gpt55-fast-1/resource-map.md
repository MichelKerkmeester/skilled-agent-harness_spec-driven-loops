# Resource Map: gpt55-fast-1

## Lineage Artifacts

| Path | Purpose |
| --- | --- |
| `deep-research-config.json` | Immutable lineage configuration and artifact boundary |
| `deep-research-state.jsonl` | Append-only state log with config, iteration, convergence, and synthesis events |
| `deep-research-strategy.md` | Reducer strategy, answered questions, ruled-out directions, and next focus |
| `deep-research-findings-registry.json` | Machine-readable normalized findings registry |
| `deep-research-dashboard.md` | Human-readable convergence and risk dashboard |
| `research.md` | Final lineage synthesis |
| `resource-map.md` | This map |
| `iterations/iteration-001.md` | Structural layout and ownership seams |
| `iterations/iteration-002.md` | Bidirectional path-coupling inventory |
| `iterations/iteration-003.md` | system-spec-kit tooling borrow |
| `iterations/iteration-004.md` | External reference migration |
| `iterations/iteration-005.md` | Fallback-router wiring decision |
| `deltas/iter-001.jsonl` | Machine delta for iteration 1 |
| `deltas/iter-002.jsonl` | Machine delta for iteration 2 |
| `deltas/iter-003.jsonl` | Machine delta for iteration 3 |
| `deltas/iter-004.jsonl` | Machine delta for iteration 4 |
| `deltas/iter-005.jsonl` | Machine delta for iteration 5 |

## Primary Spec Sources

| Path | Use In Research |
| --- | --- |
| `.opencode/specs/system-deep-loop/030-deep-loop-unification/spec.md` | Parent scope, requirements, optional fallback classification |
| `.opencode/specs/system-deep-loop/030-deep-loop-unification/001-reference-research/spec.md` | Fanout research requirements and GLM failure handling |
| `.opencode/specs/system-deep-loop/030-deep-loop-unification/001-reference-research/plan.md` | Exact executor payload and manual GLM fallback plan |
| `.opencode/specs/system-deep-loop/030-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md` | Internal path-repair and system-spec-kit tooling-borrow path-depth plan |
| `.opencode/specs/system-deep-loop/030-deep-loop-unification/003-external-reference-migration/spec.md` | External reference scope, freeze decisions, success criteria |
| `.opencode/specs/system-deep-loop/030-deep-loop-unification/003-external-reference-migration/plan.md` | Staged external migration and verification order |
| `.opencode/specs/system-deep-loop/030-deep-loop-unification/004-fallback-router-wiring/spec.md` | Optional fallback-router scope and requirements |
| `.opencode/specs/system-deep-loop/030-deep-loop-unification/004-fallback-router-wiring/plan.md` | Optional fallback-router implementation concept |

## Runtime And Workflow Sources

| Path | Use In Research |
| --- | --- |
| `.opencode/skills/deep-loop-workflows/SKILL.md` | Public hub/mode-packet ownership evidence |
| `.opencode/skills/deep-loop-workflows/mode-registry.json` | Registry source-of-truth and migration-critical routing data |
| `.opencode/skills/deep-loop-workflows/shared/synthesis/resource-map.cjs` | Workflow resource-map synthesis seam |
| `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs` | Reducer layering and runtime/system-spec-kit seams |
| `.opencode/skills/deep-loop-runtime/README.md` | Runtime backend ownership boundary |
| `.opencode/skills/deep-loop-runtime/SKILL.md` | Runtime rules and no-MCP/no-old-mcp-import constraints |
| `.opencode/skills/deep-loop-runtime/package.json` | Runtime dependency and typecheck tooling evidence |
| `.opencode/skills/deep-loop-runtime/tsconfig.json` | Borrowed system-spec-kit type roots evidence |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs` | Artifact topology seam |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts` | Fallback router implementation evidence |
| `.opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts` | Fallback router pure unit coverage |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Current same-item retry and retry-exhaustion behavior |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Model-aware lineage orchestration and command construction |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | Fanout schema and absence of fallback registry surface |

## Cross-Surface Sources

| Path | Use In Research |
| --- | --- |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Command YAML path-coupling evidence |
| `.opencode/commands/deep/assets/compiled/deep_research.contract.md` | Generated contract and content-hash evidence |
| `.opencode/commands/doctor/_routes.yaml` | Doctor runtime-script path evidence |
| `.opencode/agents/orchestrate.md` | OpenCode agent registry-path evidence |
| `.claude/agents/orchestrate.md` | Claude agent mirror registry-path evidence |
| `.opencode/plugins/mk-deep-loop-guard.js` | Plugin registry-path evidence |
| `.opencode/hooks/pre-commit` | Local mirror-checker path evidence |
| `.github/workflows/agent-mirror-sync.yml` | CI mirror-checker path evidence |
| `.github/workflows/routing-registry-drift.yml` | Routing drift workflow coverage evidence |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Python advisor identity/path constants |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts` | TypeScript merged-skill alias evidence |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts` | Drift guard registry/hash evidence |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/fixtures/intent-prompt-corpus.ts` | Advisor corpus expected-label evidence |
| `.opencode/skills/cli-opencode/graph-metadata.json` | Sibling graph edge dedupe evidence |
| `.opencode/skills/sk-code/graph-metadata.json` | Sibling graph edge evidence |
| `.opencode/skills/sk-prompt/graph-metadata.json` | Sibling graph edge evidence |
| `.opencode/skills/system-spec-kit/SKILL.md` | Spec validation/memory governance evidence |
| `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs` | Artifact topology implementation |
| `.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts` | Reverse runtime test discovery evidence |
| `.opencode/skills/system-spec-kit/scripts/optimizer/optimizer-manifest.json` | Optimizer path-coupling evidence |
| `.opencode/skills/sk-prompt-models/references/models/glm-5.2.md` | GLM model profile, quota pool, no-fallback contract |
| `.opencode/skills/sk-prompt-models/references/models/mimo-v2.5-pro.md` | MiMo model profile, manual reroute/no-fallback contract |
