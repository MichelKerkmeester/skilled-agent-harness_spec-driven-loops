# Resource Map — sk- prefix rename surface (lineage glm-5-2)

Inventory of files discovered as consumers of mode packet dirs / workflowMode keys across the four sk- hubs. Generated from 5 research iterations.

## Skills (the four in-scope hubs + their typed manifests)
- .opencode/skills/sk-code/{mode-registry.json, hub-router.json, leaf-manifest.json, description.json, graph-metadata.json}
- .opencode/skills/sk-design/{mode-registry.json, hub-router.json, leaf-manifest.json, description.json, graph-metadata.json, command-metadata.json}
- .opencode/skills/sk-doc/{mode-registry.json, hub-router.json, leaf-manifest.json, leaf-aliases.json, description.json, graph-metadata.json}
- .opencode/skills/sk-prompt/{mode-registry.json, hub-router.json, leaf-manifest.json, description.json, graph-metadata.json}

## Commands (routers + workflow YAML assets)
- .opencode/commands/create/{skill,skill-parent,readme,agent,command,feature-catalog,manual-testing-playbook,benchmark,flowchart,changelog,diff}.md
- .opencode/commands/create/assets/*-auto.yaml, *-confirm.yaml, *-presentation.txt
- .opencode/commands/interface/{design,design-reference}.md
- .opencode/commands/interface/assets/interface-design-*.yaml, interface-design-reference-*.yaml
- .opencode/commands/prompt/improve.md + assets/prompt_improve_*.yaml
- GAP: /doc:quality router file not located

## Agents
- .opencode/agents/{design,markdown,prompt-improver,orchestrate,deep-alignment}.md
- .claude/agents/ (real fork of the above)
- .codex/agents/*.toml (generated)

## Runtime mirrors (real dirs in this worktree)
- .claude/skills/{sk-code,sk-design,sk-doc,sk-prompt}/
- .devin/skills/{create-skill,create-skill-parent,interface-design,interface-design-reference,prompt-improve,...}/ (advisor identities; content in scope, dir names out)
- .cursor/commands, .codex/agents

## Generators (rebuild these, do not edit their output)
- .opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts
- .opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts
- .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py
- skill-benchmark runner (Lane C)

## Benchmark gold (generated reports carrying workflowMode)
- .opencode/skills/{sk-code,sk-design,sk-doc,sk-prompt,cli-external-orchestration,mcp-tooling}/benchmark/reports/**/skill-benchmark-report.json

## Advisor DB/cache/state (skill-identity-keyed — NOT mode-key consumers)
- .claude/skills/.advisor-state/skill-graph-generation.json
- .opencode/skills/system-skill-advisor/mcp-server/tests/scorer/fixtures/.embeddings-cache/skill-embeddings.json
- .opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/labeled-prompts.jsonl

## Verification levers
- .opencode/commands/doctor/scripts/{parent-skill-check.cjs, skill-graph-freshness.cjs, fable-mode-check.cjs, agent-roster-mirror-check.cjs, route-validate.py}
- .opencode/commands/doctor/assets/doctor-{parent-skill,runtime-mirrors,skill-graph-freshness,fable-mode,skill-advisor,agent-roster-mirror}.yaml
- .opencode/skills/sk-design/shared/scripts/{design-command-surface-check.mjs, interface-command-contract.test.mjs}
- .opencode/skills/system-skill-advisor/mcp-server/tests/{command-binding-existence.vitest.ts, routing-registry-drift-guard.vitest.ts, vocabulary-agreement.vitest.ts, parent-skill-check-fixtures.vitest.ts}
