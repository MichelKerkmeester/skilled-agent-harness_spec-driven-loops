---
title: "Resource Map — luna-max detached inventory lineage"
trigger_phrases: []
---
# Resource Map — luna-max detached inventory lineage

This map was emitted during phase_synthesis. It is a pointer catalog for the lineage; the exhaustive path-plus-line record is inventory.external.json.

## Parent context

| Path | Role | Read before research |
|---|---|---|
| .opencode/specs/system-speckit/049-memory-decommission/spec.md | Parent scope, phase order, estimates, exclusions | yes |
| .opencode/specs/system-speckit/049-memory-decommission/goal.md | Frozen D1–D5 replacement and non-goals | yes |
| .opencode/specs/system-speckit/049-memory-decommission/006-legacy-memory-surface-inventory/spec.md | Child scaffold and target packet | yes |

## Runtime registrations and environment

| Path | Role | Handoff |
|---|---|---|
| .claude/mcp.json | Claude memory/advisor server registrations and HF/IPC env | 002 split, 003 remove memory registration |
| .codex/config.toml | Codex memory/advisor registrations and grants | 002 split, 003 remove memory registration |
| .cursor/mcp.json | Cursor memory/advisor registrations | 002 split, 003 remove memory registration |
| .pi/mcp.json | Pi memory/advisor registrations | 002 split, 003 remove memory registration |
| opencode.json | OpenCode memory/advisor registrations and shared socket notes | 002 split, 003 remove memory registration |
| .env.example | DB, launcher, IPC, embedding, advisor, CLI, and graph flags | 002 classify, 003 remove server-only rows |
| .utcp_config.json | Negative-control MCP config | no target row; preserve |

## Commands, agents, hooks, and plugins

| Path family | Role | Handoff |
|---|---|---|
| .opencode/commands/memory and .opencode/commands/doctor | /memory routes and doctor-memory/causal routes | 002 rewire, 003 delete obsolete routes |
| .opencode/commands/deep/assets/deep-research-auto.yaml | deep-loop memory persistence and grants | 002 replace persistence; preserve loop |
| .opencode/commands/create/assets | generated command/skill/agent/catalog/playbook templates | 002 update producers |
| .opencode/agents, .claude/agents, .codex/agents, .pi/agents | mirrored agent instructions and grants | 002 rewire |
| .opencode/hooks/spec-memory and .opencode/hooks/shared/hook-flags.cjs | continuity injection and plugin aliases | 002 replace injection, 003 delete memory adapter |
| .opencode/plugins/system-spec-memory.js | plugin/bridge/status contract | 003 delete after replacement |
| .opencode/plugins/tests/system-spec-memory.test.cjs | old plugin assertions | 002 replacement proof, 003 delete obsolete suite |
| .opencode/bin/system-spec-memory-launcher.cjs | memory server launcher | 003 delete |
| .opencode/bin/spec-memory.cjs | memory CLI shim | 003 delete |
| .opencode/bin/lib/launcher-session-proxy.cjs | launcher/session/checkpoint/embedder allowlists | 002 split, 003 remove memory IDs |

## Skills, references, templates, catalogs, and playbooks

| Path family | Role | Handoff |
|---|---|---|
| .opencode/skills/system-spec-kit/references/memory | memory contract, save workflow, embeddings, trigger configuration | 002 replacement contract; 003 remove server-only references |
| .opencode/skills/system-spec-kit/templates | packet, context-index, resource-map, and generated-doc templates | 002 update producers |
| .opencode/skills/system-spec-kit/feature-catalog | memory retrieval, health, session, causal, embedding, and quality catalog | 002 retain/rewrite useful contracts; 003 retire delete-only entries |
| .opencode/skills/system-spec-kit/manual-testing-playbook | plugin, hook, launcher, and memory acceptance procedures | 002 replacement tests; 003 delete obsolete procedures |
| .opencode/skills/system-spec-kit/assets/template-mapping.md | template propagation map | 002 update |

## Code, package, process, and shared infrastructure

| Path | Role | Handoff |
|---|---|---|
| .opencode/skills/system-spec-kit/mcp-server | target MCP server tree, represented as one aggregate | 003 delete as one unit |
| .opencode/skills/system-spec-kit/package.json | server workspace, bins, scripts, dependencies | 003 remove server entries |
| .opencode/skills/system-spec-kit/package-lock.json | lock metadata for server workspace | 003 regenerate after removal |
| .opencode/skills/system-spec-kit/scripts/core/workflow.ts | server indexing API and daemon branches | 002 replace imports/branches |
| .opencode/skills/system-spec-kit/scripts/core/daemon-detect.ts | memory launcher lease detection | 002 split, 003 remove memory lease |
| .opencode/skills/system-spec-kit/scripts/deploy-mcp.sh | server build/recycle process control | 003 remove memory-only lifecycle |
| .opencode/scripts/orphan-mcp-sweeper.sh | context-server, DB, daemon, and HF socket supervision | 002 split shared paths |
| .opencode/scripts/session-cleanup.sh | launcher/context-server cleanup | 003 remove memory-only targets |
| .opencode/skills/system-spec-kit/shared/config.ts | DB directory resolution | 002 separate retained ownership |
| .opencode/skills/system-spec-kit/shared/embeddings | shared adapter, Ollama, and HF-local providers | retain shared owner; remove memory branches |
| .opencode/skills/system-spec-kit/shared/ipc/socket-server.ts | shared IPC/socket limits and paths | retain shared owner; remove memory branch |

## Research artifacts and proof

| Path | Role |
|---|---|
| inventory.external.json | exhaustive final external inventory plus MCP aggregate |
| iterations/iteration-001.md through iteration-005.md | write-once iteration narratives |
| deltas/iter-001.jsonl through iter-005.jsonl | structured iteration deltas |
| event-inputs/iteration-001.json through iteration-005.json | gateway event inputs |
| dispatch-receipts/iteration-001.json through iteration-005.json | gateway sequence and authorization receipts |
| research/deep-research-state.jsonl | gateway-projected state: config plus five iteration records |
| orchestration-status.log | phase and scope audit trail |
| research.md | canonical synthesis report |

## Scope and exclusions

- z_archive is excluded from the exhaustive scan.
- The target MCP server tree is not expanded into external rows; its aggregate records current worktree/tracked census, exposed tools, target matches, and flags.
- The current lineage is excluded from its own scan.
- Parent packet writeback, fanout merge, generated-context, memory save, validation, and git writes were not performed because the lineage directory was the entire authorized write surface.
