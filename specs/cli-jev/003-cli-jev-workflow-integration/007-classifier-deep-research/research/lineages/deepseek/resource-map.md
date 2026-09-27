# Resource Map — DeepSeek Lineage, Classifier Round 3

Lineage `deepseek` in `007-classifier-deep-research`. Produced at synthesis from the ten iteration deltas. Paths are repo-relative; each row names what the lineage read or produced.

## Primary sources opened

| Path | Used by |
|---|---|
| `context/deem-main/serve/deem_server.py` | iterations 1, 2, 4, 6, 8 (health, stub, handlers, exit taxonomy) |
| `context/deem-main/serve/deem_mcp.py` | iteration 1 (stdio MCP apart) |
| `context/deem-main/serve/README.md` | iterations 1, 2 (deployment, env, vendor binds) |
| `context/deem-local.md` | all iterations (measured 0.8B facts) |
| `~/.local/share/deem/bin/deem-ctl` | iteration 2 (ALL-1; audited, never executed) |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh`, `runtime/cli/lib/validator-registry.json`, `runtime/cli/rules/` | iteration 3 (40-rule map) |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` | iteration 3 (four checks and residues) |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/{user-prompt-submit,shared,compact-inject}.ts` | iterations 4, 8 (budgets) |
| `.skilled/hooks/skill-advisor/claude/user-prompt-submit.ts` | iterations 4, 5 (advisor budget chain) |
| `.claude/settings.json` | iterations 1, 4, 8 (hook deadlines and matchers) |
| `.skilled/bin/compiled-route.cjs`, `runtime/cli/retrieval/lookup-trigger-index.mjs` | iteration 4 (routing seams) |
| `specs/cli-jev/001-cli-jev-creation/context/jev-cli-main/src/jev_cli/__init__.py` | iteration 6 (wire and failure map) |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`, `dispatch-audit.mjs` | iterations 6, 7 (guard rules, shape table) |
| `.skilled/skills/cli-jev/**` (hub files) | iterations 5, 7 (registry, router, graph) |
| `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` | iteration 7 (eleven surfaces) |
| `.skilled/repo-rules/skill-hub-routing.md` | iteration 7 (two-stage routing rule) |
| `context/external repo's/jev-cli-main/plugin/hooks/types/claude-code.d.ts` | iteration 8 (precompute contract) |
| `specs/cli-jev/003-cli-jev-workflow-integration/002-*/spec.md`, `003-*/spec.md`, `005-*/spec.md`, `006-*/spec.md` | iterations 5, 10 (gate lines, exclusions, keep rules) |
| Sibling iterations: `grok/iteration-002,003,004,006,010`, `swe/iteration-001,002`, `mimo/iteration-001`, `glm/iteration-001` | W2-W4 cross-reads |

## Lineage outputs

| Path | Content |
|---|---|
| `iterations/iteration-001..010.md` | The ten iteration records |
| `deltas/iter-001..010.jsonl` | Iteration and finding records |
| `deep-research-state.jsonl` | Full event log (binding, init, iterations, telemetry, synthesis) |
| `findings-registry.json` | Resolved questions, key findings, ideas with verdicts |
| `deep-research-strategy.md` | Strategy, key questions, worked/failed |
| `research.md` | Terminal synthesis |
| `resource-map.md` | This file |

## Key external artifacts cited

| Path | Why |
|---|---|
| `benchmark/reports/2026-09-20-post-migration-reverification/raw/probe-matrix.txt` | Recorded probes: endpoint/key/refused behavior |
| `validator-registry.json` | The 40-rule map |
| `validation-rules.md` | AC_COVERAGE / AC_CLOSURE / freshness contracts |
| `parent-skills-nested-packets.md` | The move's surface list and verification |
| `.claude/settings.json` | The installed deadlines |
| `context/deem-main/serve/deem_server.py` | The probe's pass conditions |
