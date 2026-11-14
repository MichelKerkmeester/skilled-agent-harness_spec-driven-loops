---
title: "Resource Map — Mistral Vibe (vibe 3.1.2, installed) as a governed cli-external-orchestration runtime mode, and feature parity of its extensions, hooks, plugins, skills, commands and agents with cli-opencode"
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 88
- **By category**: READMEs=1, Documents=9, Commands=0, Agents=0, Skills=7, Specs=4, Scripts=66, Tests=0, Config=1, Meta=0
- **Missing on disk**: 40
- **Scope**: research convergence output for 001-deep-research
- **Generated**: 2026-11-14T12:47:00.922Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .dsh/plugins/repo-guards/README.md | Cited | OK | Citations=1; Iterations=1 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .dsh/SYNC.md | Cited | OK | Citations=2; Iterations=2 |
| .opencode | Cited | OK | Citations=1; Iterations=1 |
| .opencode/agents | Cited | OK | Citations=1; Iterations=1 |
| .opencode/commands | Cited | OK | Citations=2; Iterations=2 |
| .opencode/hooks | Cited | OK | Citations=1; Iterations=1 |
| .opencode/plugins | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills | Cited | OK | Citations=1; Iterations=1 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/_bin/vibe-rs | Cited | MISSING | Citations=2; Iterations=2 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/tools/builtins | Cited | MISSING | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/system-deep-loop/deep-research/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/tests | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/unit/executor-branch-contract.vitest.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/evidence/vibe-help.txt | Cited | OK | Citations=6; Iterations=6 |
| specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/lineages/devpass-deepseek/evidence/vibe-config-schema.json | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/lineages/mistral-deepseek/evidence/vibe-config-schema.json | Cited | OK | Citations=2; Iterations=2 |
| specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/lineages/mistral-deepseek/scratch/smoke1/stderr.txt | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/plugins/cli-dispatch-audit.js | Cited | OK | Citations=1; Iterations=1 |
| .opencode/plugins/opencode-goal.js | Cited | OK | Citations=1; Iterations=1 |
| .opencode/plugins/session-relaunch.js | Cited | OK | Citations=1; Iterations=1 |
| .opencode/plugins/system-spec-gate.js | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/mistralai_vibe_local_harness/session_api/app_server/session/models/configuration.py | Cited | OK | Citations=2; Iterations=2 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/agent.py | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/commands/controller.py | Cited | OK | Citations=2; Iterations=2 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/commands/registry.py | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/entrypoint.py | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/_billing.py | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/_host_hooks.py | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/_unified_permissions.py | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/protocol.py | Cited | OK | Citations=3; Iterations=3 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/run_export.py | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/cli/launcher.py | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/agents/models.py | Cited | OK | Citations=2; Iterations=2 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/harness_files/_harness_manager.py | Cited | OK | Citations=2; Iterations=2 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/harness_files/_paths.py | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/layers/project.py | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/config.py | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/models.py | Cited | OK | Citations=2; Iterations=2 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/paths/_local_config_files.py | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/plugins/_catalog.py | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/skills/manager.py | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/skills/models.py | Cited | OK | Citations=2; Iterations=2 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/tools/builtins/task.py | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/permissions.py | Cited | OK | Citations=2; Iterations=2 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/utils/api_keys.py | Cited | OK | Citations=1; Iterations=1 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/mistralai_vibe_local_harness/protocol.py | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/mistralai_vibe_local_harness/vibe/_protected_paths.py | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/mistralai_vibe_local_harness/vibe/_sandbox.py | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/agent.py | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/entrypoint.py | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/utils.py | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/agents.py | Cited | MISSING | Citations=2; Iterations=2 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/_billing.py | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/_session_peers.py | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/models.py | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/run_export.py | Cited | MISSING | Citations=4; Iterations=4 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/cli/launcher.py | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/agents/models.py | Cited | MISSING | Citations=3; Iterations=3 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/auth/mcp_oauth.py | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/_defaults.py | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/harness_files/_harness_manager.py | Cited | MISSING | Citations=3; Iterations=3 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/layers/agent_profile.py | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/layers/project.py | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/models.py | Cited | MISSING | Citations=3; Iterations=3 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/vibe_schema.py | Cited | MISSING | Citations=5; Iterations=5 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/config.py | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/models.py | Cited | MISSING | Citations=2; Iterations=2 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/llm/reasoning.py | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/model_catalog/_constants.py | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/paths/_local_config_files.py | Cited | MISSING | Citations=2; Iterations=2 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/paths/_vibe_home.py | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/platform_auth/_mistral.py | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/plugins/_foreign.py | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/plugins/_native.py | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/prompts/__init__.py | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/skills/manager.py | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/skills/models.py | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/skills/parser.py | Cited | MISSING | Citations=2; Iterations=2 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/system_prompt.py | Cited | MISSING | Citations=2; Iterations=2 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/tools/builtins/skill.py | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/tools/builtins/task.py | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/tools/models.py | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/setup/auth/whoami.py | Cited | MISSING | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/plugins/builtins/vibe/plugin.json | Cited | OK | Citations=1; Iterations=1 |

---

---

## Lineage Delta Sources

| Lineage | Delta |
|---------|-------|
| devpass-deepseek | lineages/devpass-deepseek/deltas/iter-001.jsonl |
| devpass-deepseek | lineages/devpass-deepseek/deltas/iter-002.jsonl |
| devpass-deepseek | lineages/devpass-deepseek/deltas/iter-003.jsonl |
| devpass-deepseek | lineages/devpass-deepseek/deltas/iter-004.jsonl |
| devpass-deepseek | lineages/devpass-deepseek/deltas/iter-005.jsonl |
| devpass-deepseek | lineages/devpass-deepseek/deltas/iter-006.jsonl |
| devpass-deepseek | lineages/devpass-deepseek/deltas/iter-007.jsonl |
| devpass-deepseek | lineages/devpass-deepseek/deltas/iter-008.jsonl |
| mistral-deepseek | lineages/mistral-deepseek/deltas/iter-001.jsonl |
| mistral-deepseek | lineages/mistral-deepseek/deltas/iter-002.jsonl |
| mistral-deepseek | lineages/mistral-deepseek/deltas/iter-003.jsonl |
| mistral-deepseek | lineages/mistral-deepseek/deltas/iter-004.jsonl |
| mistral-deepseek | lineages/mistral-deepseek/deltas/iter-005.jsonl |
| mistral-deepseek | lineages/mistral-deepseek/deltas/iter-006.jsonl |
| mistral-deepseek | lineages/mistral-deepseek/deltas/iter-007.jsonl |
| mistral-deepseek | lineages/mistral-deepseek/deltas/iter-008.jsonl |
