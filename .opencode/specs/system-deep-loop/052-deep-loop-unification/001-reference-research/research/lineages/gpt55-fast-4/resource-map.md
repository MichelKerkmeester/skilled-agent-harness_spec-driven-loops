# Resource Map: gpt55-fast-4

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
| `iterations/iteration-001.md` | Structural layout and identity boundary pass |
| `iterations/iteration-002.md` | system-spec-kit tooling-borrow pass |
| `iterations/iteration-003.md` | External reference and advisor corpus pass |
| `iterations/iteration-004.md` | fallback-router wiring pass |
| `iterations/iteration-005.md` | Final verification and convergence pass |
| `deltas/iter-001.jsonl` | Machine delta for iteration 1 |
| `deltas/iter-002.jsonl` | Machine delta for iteration 2 |
| `deltas/iter-003.jsonl` | Machine delta for iteration 3 |
| `deltas/iter-004.jsonl` | Machine delta for iteration 4 |
| `deltas/iter-005.jsonl` | Machine delta for iteration 5 |

## Primary Spec Sources

| Path | Use In Research |
| --- | --- |
| `.opencode/specs/system-deep-loop/052-deep-loop-unification/spec.md` | Parent identity, success criteria, symlink/shim completion constraints |
| `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md` | Target layout and runtime-as-infrastructure rule |
| `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md` | Structural path-repair and validation sequence |
| `.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md` | External reference migration order and closeout gates |
| `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md` | Optional fallback-router scope |
| `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/plan.md` | Optional fallback-router implementation direction |

## Runtime And Workflow Sources

| Path | Use In Research |
| --- | --- |
| `.opencode/skills/deep-loop-runtime/package.json` | Runtime dependency and typecheck tooling evidence |
| `.opencode/skills/deep-loop-runtime/tsconfig.json` | Borrowed `system-spec-kit` type roots evidence |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts` | Fallback router implementation evidence |
| `.opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts` | Fallback router behavior tests |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Current same-item retry and retry-exhausted behavior |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Model-aware fanout orchestration seam |
| `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs` | Missing internal old-runtime path repair site |

## Cross-Surface Sources

| Path | Use In Research |
| --- | --- |
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | Reverse council test-discovery path evidence |
| `.opencode/skills/system-spec-kit/mcp_server/vitest.config.ts` | Shared Vitest include path evidence |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Python advisor identity/path constants |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts` | TypeScript merged skill alias |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts` | Drift guard path and projection hash evidence |
| `.opencode/agents/orchestrate.md` | OpenCode agent mirror old-path evidence |
| `.claude/agents/orchestrate.md` | Claude agent mirror old-path evidence |
| `.opencode/agents/ai-council.md` | OpenCode AI council mirror old-path evidence |
| `.claude/agents/ai-council.md` | Claude AI council mirror old-path evidence |
