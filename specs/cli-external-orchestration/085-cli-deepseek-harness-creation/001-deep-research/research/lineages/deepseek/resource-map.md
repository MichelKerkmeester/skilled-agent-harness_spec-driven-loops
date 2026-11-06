---
title: "Resource Map — DeepSeek Harness (dsh, github.com/deepseek-ai/deepseek-harness, installed 0.2.2-rc.1) as a new cli-external-orchestration runtime mode that mirrors cli-pi: headless dispatch contract, providers (LLM Gateway and OpenCode Go DeepSeek V4.1 Flash), repo-local runtime folder, skills, agents, commands, plugins and hooks to port, third-party Pi plugins to migrate or drop, MCP, deep-loop fan-out executor support, every cross-repo touch point, and the phase plan. FIRST read specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/research-angles.md (ten angles, rules of engagement) and resource-map.md (known context, do not rediscover). One angle per iteration."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 74
- **By category**: READMEs=28, Documents=12, Commands=1, Agents=0, Skills=11, Specs=4, Scripts=4, Tests=0, Config=12, Meta=2
- **Missing on disk**: 46
- **Scope**: research convergence output for 001-deep-research
- **Generated**: 2026-11-05T22:14:31.928Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .pi/extensions/README.md | Cited | OK | Citations=1; Iterations=1 |
| dsh-src/packages/boot/app-boot/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/boot/plugin-manager/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/bundle/headless/README.md | Cited | MISSING | Citations=5; Iterations=5 |
| dsh-src/packages/context/agent-instructions/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/core/agent-default-model/README.md | Cited | MISSING | Citations=2; Iterations=2 |
| dsh-src/packages/experimental/hooks-claude-code/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/goal/command-goal/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/goal/goal-round-driver/README.md | Cited | MISSING | Citations=2; Iterations=2 |
| dsh-src/packages/goal/goal/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/goal/tool-goal/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/llm/llm-pi-ai/README.md | Cited | MISSING | Citations=2; Iterations=2 |
| dsh-src/packages/llm/token-meter/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/mcp/mcp-client/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/mcp/mcp-manager/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/plan/plan-mode/README.md | Cited | MISSING | Citations=3; Iterations=3 |
| dsh-src/packages/preset/agent-preset-registry/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/preset/persona/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/sandbox/sandbox/README.md | Cited | MISSING | Citations=2; Iterations=2 |
| dsh-src/packages/session/session-telemetry-otel/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/settings/settings/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/skill/skill-filesystem/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/skill/skill/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/skill/tool-skill/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/subagent/tool-subagent/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/team/agent-team/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/todo/tool-todo/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/util/home-paths/README.md | Cited | MISSING | Citations=2; Iterations=2 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .hermes/SYNC.md | Cited | OK | Citations=4; Iterations=4 |
| .pi/PLUGINS.md | Cited | OK | Citations=1; Iterations=1 |
| .pi/SYNC.md | Cited | OK | Citations=3; Iterations=3 |
| dsh-src/docs/architecture.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/docs/cli-help.md | Cited | MISSING | Citations=5; Iterations=5 |
| dsh-src/docs/config-catalog.md | Cited | MISSING | Citations=3; Iterations=3 |
| dsh-src/docs/cordis-primer.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/docs/event-producer-consumer.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/docs/tool-catalog.md | Cited | MISSING | Citations=2; Iterations=2 |
| dsh-src/docs/user/guide/mcp-memory.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/docs/user/guide/plugin-market.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/docs/user/guide/providers.md | Cited | MISSING | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/doctor/assets/agents-md-manifest.json | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/cli-external-orchestration/cli-pi/hard-rules.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-pi/references/cli-reference.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/mode-registry.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/research/lineages/deepseek/.dsh-home/profiles/headless/cordis.patch.yml | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/research/lineages/deepseek/.dsh-home/profiles/headless/cordis.yml | Cited | OK | Citations=2; Iterations=2 |
| specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/research/lineages/deepseek/.events/smoke-1.stderr | Cited | OK | Citations=2; Iterations=2 |
| specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/resource-map.md | Cited | OK | Citations=2; Iterations=2 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/hooks/dispatch/lib/dispatch-audit.mjs | Cited | OK | Citations=1; Iterations=1 |
| dsh-src/packages/experimental/hook-protocol/src/matcher.ts | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/skill/skill-filesystem/src/index.ts | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/skill/skill/src/index.ts | Cited | MISSING | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/settings.json | Cited | OK | Citations=1; Iterations=1 |
| .pi/mcp.json | Cited | OK | Citations=1; Iterations=1 |
| .pi/settings.json | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/lib/node_modules/@deepseek-ai/dsh/node_modules/@deepseek-ai/dsh-mcp-client/package.json | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/lib/node_modules/@deepseek-ai/dsh/package.json | Cited | OK | Citations=1; Iterations=1 |
| dsh-src/apps/cli/config/examples/ptc.yml | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/apps/cli/config/examples/team-mode.yml | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/bundle/base/cordis.patch.yml | Cited | MISSING | Citations=5; Iterations=5 |
| dsh-src/packages/bundle/headless/cordis.patch.yml | Cited | MISSING | Citations=3; Iterations=3 |
| dsh-src/packages/bundle/web-app/cordis.patch.yml | Cited | MISSING | Citations=2; Iterations=2 |
| dsh-src/packages/experimental/hooks-claude-code/package.json | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/subprocess/subprocess-local/package.json | Cited | MISSING | Citations=1; Iterations=1 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| AGENTS.md | Cited | OK | Citations=1; Iterations=1 |
| README.md | Cited | OK | Citations=1; Iterations=1 |

---
