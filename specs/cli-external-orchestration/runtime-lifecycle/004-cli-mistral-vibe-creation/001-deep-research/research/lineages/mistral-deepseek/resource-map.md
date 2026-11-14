---
title: "Resource Map — Mistral Vibe (vibe 3.1.2, installed) as a governed cli-external-orchestration runtime mode, and feature parity of its extensions, hooks, plugins, skills, commands and agents with cli-opencode"
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 33
- **By category**: READMEs=1, Documents=2, Commands=0, Agents=0, Skills=5, Specs=3, Scripts=21, Tests=0, Config=1, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 001-deep-research
- **Generated**: 2026-11-14T12:42:16.084Z

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
| .opencode/plugins | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/system-deep-loop/deep-research/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/tests/unit/executor-branch-contract.vitest.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/evidence/vibe-help.txt | Cited | OK | Citations=3; Iterations=3 |
| specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/lineages/mistral-deepseek/evidence/vibe-config-schema.json | Cited | OK | Citations=2; Iterations=2 |
| specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/lineages/mistral-deepseek/scratch/smoke1/stderr.txt | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/mistralai_vibe_local_harness/session_api/app_server/session/models/configuration.py | Cited | OK | Citations=2; Iterations=2 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/agent.py | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/acp/commands/registry.py | Cited | OK | Citations=1; Iterations=1 |
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
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/hooks/models.py | Cited | OK | Citations=2; Iterations=2 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/paths/_local_config_files.py | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/plugins/_catalog.py | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/skills/manager.py | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/skills/models.py | Cited | OK | Citations=2; Iterations=2 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/tools/builtins/task.py | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/permissions.py | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/utils/api_keys.py | Cited | OK | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/plugins/builtins/vibe/plugin.json | Cited | OK | Citations=1; Iterations=1 |

---
