# Resource Map: gpt55-fast-6

## Scope

This map summarizes resources consulted or produced by the detached deep-research lineage `gpt55-fast-6`. It is derived from iteration deltas and synthesis evidence.

## Generated Artifacts

| Path | Purpose |
|---|---|
| `deep-research-config.json` | Immutable lineage configuration. |
| `deep-research-state.jsonl` | Append-only config, iteration, and synthesis state log. |
| `deep-research-strategy.md` | Current question set, answered questions, ruled-out directions, and next focus. |
| `deep-research-findings-registry.json` | Canonical finding and question registry. |
| `deep-research-dashboard.md` | Iteration table, convergence trend, and stop status. |
| `iterations/iteration-001.md` | Structural layout and identity evidence. |
| `iterations/iteration-002.md` | Bidirectional path-coupling evidence. |
| `iterations/iteration-003.md` | System-spec-kit seam evidence. |
| `iterations/iteration-004.md` | External reference migration evidence. |
| `iterations/iteration-005.md` | Fallback-router wiring decision evidence. |
| `iterations/iteration-006.md` | Convergence validation evidence. |
| `deltas/iter-001.jsonl` through `deltas/iter-006.jsonl` | Per-iteration machine-readable deltas. |
| `research.md` | Final synthesis. |

## Source Evidence By Category

### Skills And Runtime

- `.opencode/skills/deep-loop-workflows/SKILL.md`
- `.opencode/skills/deep-loop-workflows/mode-registry.json`
- `.opencode/skills/deep-loop-workflows/graph-metadata.json`
- `.opencode/skills/deep-loop-runtime/SKILL.md`
- `.opencode/skills/deep-loop-runtime/graph-metadata.json`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`

### Workflow Scripts And Tests

- `.opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs`
- `.opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs`
- `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs`
- `.opencode/skills/deep-loop-workflows/deep-review/scripts/reduce-state.cjs`
- `.opencode/skills/deep-loop-workflows/deep-review/scripts/runtime-capabilities.cjs`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/replay-graph-from-artifacts.cjs`
- `.opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts`
- `.opencode/skills/deep-loop-runtime/tests/unit/artifact-root.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/council-playbook-anchor-integrity.vitest.ts`

### Advisor, Hooks, And Metadata

- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts`
- `.opencode/hooks/pre-commit`
- `.github/workflows/agent-mirror-sync.yml`
- `.opencode/plugins/mk-deep-loop-guard.js`
- `.opencode/commands/doctor/scripts/parent-skill-check.cjs`
- `.opencode/skills/cli-opencode/graph-metadata.json`
- `.opencode/skills/system-skill-advisor/graph-metadata.json`
- `.opencode/skills/sk-prompt/graph-metadata.json`

### Commands And Contracts

- `.opencode/commands/deep/assets/deep_ai-council_confirm.yaml`
- `.opencode/commands/deep/assets/compiled/deep_research.contract.md`

### Spec Plans

- `.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/plan.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/plan.md`
