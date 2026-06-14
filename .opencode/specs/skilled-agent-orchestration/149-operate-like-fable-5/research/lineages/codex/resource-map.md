# Resource Map - Codex Lineage

`resource-map.md` was not present in the target spec folder during phase_init. This lineage emits a local evidence-derived map from the completed research deltas.

## External Doctrine

| Path | Role | Evidence |
|------|------|----------|
| `.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md` | Source doctrine for evidence, verification, baseline, rollback, scope, and communication behavior | Iterations 1 and 5 |

## Agent Contracts

| Path | Role | Evidence |
|------|------|----------|
| `.opencode/agents/deep-research.md` | Existing research-agent evidence and output-verification contract | Iterations 2 and 4 |
| `.codex/agents/deep-research.toml` | Active Codex mirror of the deep-research contract | Iteration 2 |
| `.opencode/agents/code.md` | Existing implementation-agent verification, return, and Builder/Critic/Verifier contract | Iterations 2, 4, and 5 |
| `.opencode/agents/orchestrate.md` | Existing orchestration accountability, task-package, and output-review contract | Iterations 2, 4, and 5 |

## Workflow Runtime

| Path | Role | Evidence |
|------|------|----------|
| `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` | Deep-research lifecycle, fan-out artifact binding, post-dispatch validation, synthesis | Iterations 3 and 5 |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Fan-out lineage prompt generation and subprocess boundary behavior | Iteration 3 |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` | Machine-checkable iteration output validation and executor provenance checks | Iterations 4 and 5 |
| `.opencode/skills/deep-research/scripts/reduce-state.cjs` | Reducer path behavior relevant to fan-out lineage-local writes | Iteration 3 |

## Outputs

| Path | Role |
|------|------|
| `deep-research-config.json` | Lineage config |
| `deep-research-state.jsonl` | Append-only loop state |
| `deep-research-strategy.md` | Final strategy and negative knowledge |
| `deep-research-findings-registry.json` | Resolved questions and findings |
| `deep-research-dashboard.md` | Human-readable loop status |
| `iterations/iteration-001.md` through `iterations/iteration-005.md` | Per-iteration findings |
| `deltas/iter-001.jsonl` through `deltas/iter-005.jsonl` | Per-iteration structured deltas |
| `research.md` | Final synthesis |
