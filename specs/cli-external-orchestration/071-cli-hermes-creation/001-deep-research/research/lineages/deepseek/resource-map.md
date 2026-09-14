---
title: "Resource Map: evidence-derived inventory for the deepseek lineage"
description: "Files, live commands and web sources cited across iterations 1-10 of the deepseek lineage of the Hermes runtime research."
contextType: "research"
---

# Resource Map — deepseek lineage (evidence-derived)

Emitted from the converged deltas of this lineage (10 iterations, 60 findings). The packet's
authoritative `resource-map.md` at the spec folder level remains the known-context inventory;
this lineage-local map records what this lineage actually cited.

## Sources consulted (by class)

- **Hermes installed source** (`~/.hermes/hermes-agent/`, v0.21.1, upstream `dc90a75a`):
  `hermes_cli/_parser.py`, `hermes_cli/oneshot.py`, `hermes_cli/main.py`, `cli.py`,
  `hermes_cli/models_catalog_static.py`, `hermes_cli/models_reasoning_caps.py`,
  `hermes_cli/providers.py`, `hermes_cli/runtime_provider_custom.py`,
  `hermes_cli/config_providers.py`, `hermes_cli/auth_codex.py`, `agent/coding_context.py`,
  `agent/skill_utils.py`, `agent/shell_hooks.py`, `agent/turn_author.py`, `agent/estop.py`,
  `tools/skills_tool.py`, `tools/skills_guard.py`, `tools/skill_linter.py`,
  `tools/skill_manager_tool.py`, `tools/skills_ast_audit.py`, `tools/delegate_tool.py`,
  `tools/mcp_tool_config.py`, `tools/mcp_tool.py` (family), `tools/environments/`,
  `hermes_cli/hooks.py`, `hermes_cli/plugins.py`, `hermes_cli/agent_plugins.py`,
  `hermes_cli/agent_import.py`, `hermes_cli/profiles.py`, `hermes_cli/mcp_config.py`,
  `hermes_cli/mcp_security.py`, `hermes_cli/tools_config_mcp.py`,
  `hermes_cli/config_defaults.py`, `hermes_cli/main_agent_cmds.py`, `plugins/AGENTS.md`,
  `docs/rfcs/plugin-config-state-bridge.md`, `skills/AGENTS.md`, `README.md`, root
  `AGENTS.md`, `cli-config.yaml.example`.
- **Live read-only command output** (2026-09-14): `hermes chat --help`, `hermes status`,
  `hermes config show`, `hermes skills list`, `hermes skills check`, `hermes hooks list`,
  `hermes plugins list`, `hermes mcp list`, `hermes mcp add --help`, `hermes mcp serve
  --help`, `hermes tools --help`, `hermes import-agent --help`, `hermes pause --help`,
  `time hermes --version`.
- **User-level config inventory** (read-only, key names only): `~/.hermes/config.yaml`,
  `~/.hermes/.env` key-name list, `~/.hermes/SOUL.md` presence, `~/.hermes/` layout.
- **Repo runtime infrastructure**: `executor-config.ts`, `executor-audit.ts`,
  `fanout-run.cjs`, `fanout-merge.cjs`, `dispatch-audit.mjs`, `combo-matrix.vitest.ts`,
  `append-mode-event.cjs`, `mode-append-gateway/`, `deep-research-ledger-schema/`,
  `legacy-projections/`.
- **Repo packets**: six `cli-*` skill packets under
  `.opencode/skills/cli-external-orchestration/` (SKILL.md, references/cli-reference.md,
  references/providers-and-models.md); parent spec.md; research-angles.md; resource-map.md.
- **Web**: https://agentskills.io/specification.md (fetched 2026-09-14).

## Counts

- Findings citing installed Hermes source: 40
- Findings citing live command output: 12
- Findings citing repo packets/infrastructure: 18
- Findings citing web sources: 1
- Total key findings: 60 (overlaps counted per finding)
