---
title: "Resource Map — DeepSeek Harness (dsh, github.com/deepseek-ai/deepseek-harness, installed 0.2.2-rc.1) as a new cli-external-orchestration runtime mode that mirrors cli-pi: headless dispatch contract, providers (LLM Gateway and OpenCode Go DeepSeek V4.1 Flash), repo-local runtime folder, skills, agents, commands, plugins and hooks to port, third-party Pi plugins to migrate or drop, MCP, deep-loop fan-out executor support, every cross-repo touch point, and the phase plan. FIRST read specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/research-angles.md (ten angles, rules of engagement) and resource-map.md (known context, do not rediscover). One angle per iteration."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 189
- **By category**: READMEs=43, Documents=81, Commands=1, Agents=0, Skills=21, Specs=5, Scripts=18, Tests=1, Config=17, Meta=2
- **Missing on disk**: 153
- **Scope**: research convergence output for 001-deep-research
- **Generated**: 2026-11-05T22:57:56.893Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .pi/extensions/README.md | Cited | OK | Citations=1; Iterations=1 |
| dsh-src/apps/cli/reference/README.md | Cited | MISSING | Citations=4; Iterations=4 |
| dsh-src/packages/boot/app-boot/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/boot/plugin-manager/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/bundle/headless/README.md | Cited | MISSING | Citations=5; Iterations=5 |
| dsh-src/packages/compaction/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/context/agent-instructions/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/core/agent-default-model/README.md | Cited | MISSING | Citations=2; Iterations=2 |
| dsh-src/packages/experimental/hooks-claude-code/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/goal/command-goal/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/goal/goal-round-driver/README.md | Cited | MISSING | Citations=2; Iterations=2 |
| dsh-src/packages/goal/goal/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/goal/tool-goal/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/guard/README.md | Cited | MISSING | Citations=2; Iterations=2 |
| dsh-src/packages/interaction/commands/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/interaction/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/interaction/user-questions/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/llm/llm-deepseek/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/llm/llm-pi-ai/README.md | Cited | MISSING | Citations=3; Iterations=3 |
| dsh-src/packages/llm/token-meter/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/mcp/mcp-client/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/mcp/mcp-manager/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/plan/plan-mode/README.md | Cited | MISSING | Citations=3; Iterations=3 |
| dsh-src/packages/plan/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/preset/agent-preset-registry/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/preset/persona/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/sandbox/README.md | Cited | MISSING | Citations=2; Iterations=2 |
| dsh-src/packages/sandbox/sandbox/README.md | Cited | MISSING | Citations=2; Iterations=2 |
| dsh-src/packages/session/session-log-deepseek/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/session/session-telemetry-otel/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/settings/settings/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/skill/skill-filesystem/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/skill/skill/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/skill/tool-skill/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/subagent/README.md | Cited | MISSING | Citations=2; Iterations=2 |
| dsh-src/packages/subagent/subagent-dsh-sdk/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/subagent/tool-subagent/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/team/agent-team/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/todo/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/todo/tool-todo/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/util/home-paths/README.md | Cited | MISSING | Citations=2; Iterations=2 |
| dsh-src/packages/web/tool-web/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/workflow/workflow/README.md | Cited | MISSING | Citations=2; Iterations=2 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .hermes/SYNC.md | Cited | OK | Citations=4; Iterations=4 |
| .pi/extensions/pi-cache-optimizer/README.md:37-50,58-64 | Cited | MISSING | Citations=1; Iterations=1 |
| .pi/extensions/pi-fast-mode-w-subagent-support/README.md:9-24,59-96 | Cited | MISSING | Citations=1; Iterations=1 |
| .pi/extensions/README.md:38-80,99-120 | Cited | MISSING | Citations=1; Iterations=1 |
| .pi/PLUGINS.md | Cited | OK | Citations=1; Iterations=1 |
| .pi/PLUGINS.md:37-41,88-92 | Cited | MISSING | Citations=1; Iterations=1 |
| .pi/prompts/goal-pi.md | Cited | OK | Citations=1; Iterations=1 |
| .pi/SYNC.md | Cited | OK | Citations=4; Iterations=4 |
| .pi/SYNC.md:8-45,64-87 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/bin/mcp-code-mode-launcher.cjs:22-34,67-80 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/apps/cli/README.md:11,38-47 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/apps/cli/reference/README.md:11-17,83-87 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/apps/cli/reference/README.md:13-17,83-87 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/apps/cli/reference/README.md:17,55,60 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/apps/cli/reference/README.md:45-55,60 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/apps/cli/src/profile-boot.ts:224-235,271-295 | Cited | MISSING | Citations=2; Iterations=2 |
| dsh-src/docs/architecture.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/docs/cli-help.md | Cited | MISSING | Citations=5; Iterations=5 |
| dsh-src/docs/config-catalog.md | Cited | MISSING | Citations=3; Iterations=3 |
| dsh-src/docs/cordis-primer.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/docs/cordis-primer.md:9-13,29-45 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/docs/cordis-primer.md:9-13,37-45 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/docs/event-producer-consumer.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/docs/subsystems/core.md:382-405,874-940,1013-1032,1091-1116 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/docs/subsystems/core.md:874-940,1013-1032,1091-1116 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/docs/subsystems/tools.md:458-468,531-563,769-881 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/docs/subsystems/tools.md:458-468,531-563,818-840 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/docs/subsystems/tools.md:531-563,769-881 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/docs/tool-catalog.md | Cited | MISSING | Citations=2; Iterations=2 |
| dsh-src/docs/user/guide/mcp-memory.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/docs/user/guide/mcp-memory.md:5-33,46-55,66-72 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/docs/user/guide/network-proxy.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/docs/user/guide/plugin-market.md | Cited | MISSING | Citations=2; Iterations=2 |
| dsh-src/docs/user/guide/providers.md | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/docs/user/guide/providers.md:13,27-39,49-56 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/docs/user/guide/providers.md:27-39,49-56,67-80 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/bundle/base/cordis.patch.yml:79-81,336-364,445-446,499-503 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/bundle/base/cordis.patch.yml:315-453,521-526 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/bundle/headless/README.md:12,46,92,104 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/bundle/headless/README.md:56,100 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/bundle/headless/README.md:87-100,128-136 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/bundle/headless/README.md:92-100,132 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/bundle/headless/README.md:92,136 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/bundle/headless/README.md:104,134-136 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/bundle/headless/README.md:110,128-136 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/bundle/headless/src/json-stream.ts:230-237,244-327 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/bundle/headless/src/startup.ts:53-75,84-92,117-155 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/bundle/headless/src/startup.ts:53-75,117-155 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/compaction/compaction/README.md:12-51,73-82 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/core/tools/README.md:88-92,108-112 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/feedback/command-feedback/README.md:12,25-28 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/llm/llm-pi-ai/README.md:28-38,77-85 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/llm/llm-pi-ai/README.md:38,123 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/mcp/mcp-client/README.md:12,28-32,55-65,74-78 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/mcp/mcp-client/README.md:28,55-70,94-103,161 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/plan/plan-mode/README.md:63,93 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/preset/agent-preset/README.md:28-48,84-85 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/sandbox/sandbox/README.md:12,58-60,134 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/skill/skill-filesystem/README.md:28-56,67-77 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/skill/skill-filesystem/README.md:40,79-85 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/skill/skill-filesystem/src/index.ts:86,913-930 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/skill/skill-filesystem/src/index.ts:811-852,1014-1055 | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/skill/tool-skill/README.md:38-54,261-266 | Cited | MISSING | Citations=1; Iterations=1 |
| executor-audit.ts:93-120,129-180,994-1010 | Cited | MISSING | Citations=1; Iterations=1 |
| executor-audit.ts:93-127,151-224,965-1010 | Cited | MISSING | Citations=1; Iterations=1 |
| executor-config.ts:11-15,68-82,93-148 | Cited | MISSING | Citations=1; Iterations=1 |
| fanout-run.cjs:504-513,3579-3585,3648-3675 | Cited | MISSING | Citations=1; Iterations=1 |
| fanout-run.cjs:504-513,3579-3689,4043-4057 | Cited | MISSING | Citations=1; Iterations=1 |
| fanout-run.cjs:1815-1829,2104-2118,4043-4049 | Cited | MISSING | Citations=1; Iterations=1 |
| fanout-run.cjs:3579-3585,4038-4057 | Cited | MISSING | Citations=1; Iterations=1 |
| iteration-001.md | Cited | MISSING | Citations=2; Iterations=2 |
| iteration-002.md | Cited | MISSING | Citations=1; Iterations=1 |
| iteration-003.md | Cited | MISSING | Citations=2; Iterations=2 |
| iteration-008.md | Cited | MISSING | Citations=1; Iterations=1 |
| iteration-009.md | Cited | MISSING | Citations=1; Iterations=1 |
| lineage-local .dsh-home profile | Cited | MISSING | Citations=1; Iterations=1 |
| orchestrate-session.cjs:193-202,266-275,375-384 | Cited | MISSING | Citations=1; Iterations=1 |
| README.md:71,867-871,1558 | Cited | MISSING | Citations=1; Iterations=1 |
| resource-map.md | Cited | MISSING | Citations=2; Iterations=2 |
| runtime/lib/deep-loop/executor-audit.ts:129-186,994-1010 | Cited | MISSING | Citations=1; Iterations=1 |
| runtime/scripts/fanout-run.cjs:2884-3120,3620-3730,4045-4056 | Cited | MISSING | Citations=1; Iterations=1 |

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
| .skilled/skills/cli-external-orchestration/cli-claude-code/references/cli-reference.md:102-110,126-146,152-154 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-codex/references/cli-reference.md:92-106,153-162 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-cursor/references/cli-reference.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-devin/references/cli-reference.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-hermes/references/cli-reference.md:36-66,74-83 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-pi/hard-rules.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-pi/references/cli-reference.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-pi/references/cli-reference.md:38-44,90-110 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:89,99 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/mode-registry.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/hub-router.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/hub-router.json | Cited | OK | Citations=1; Iterations=1 |
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
| specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/resource-map.md | Cited | OK | Citations=3; Iterations=3 |
| specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/resource-map.md:18-21,27-31 | Cited | MISSING | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .pi/extensions/completion-evidence.ts | Cited | OK | Citations=1; Iterations=1 |
| .pi/extensions/session-relaunch.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/dispatch/lib/dispatch-audit.mjs | Cited | OK | Citations=1; Iterations=1 |
| adapter-fixture.ts | Cited | MISSING | Citations=1; Iterations=1 |
| dispatch-audit.mjs | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/apps/cli/src/args.ts | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/bundle/headless/src/index.ts | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/bundle/headless/src/json-stream.ts | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/bundle/headless/src/startup.ts | Cited | MISSING | Citations=2; Iterations=2 |
| dsh-src/packages/experimental/hook-protocol/src/matcher.ts | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/llm/llm-deepseek/src/models.ts | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/llm/llm-pi-ai/src/provider-data.generated.ts | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/skill/skill-filesystem/src/index.ts | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/skill/skill/src/index.ts | Cited | MISSING | Citations=1; Iterations=1 |
| executor-audit.ts | Cited | MISSING | Citations=1; Iterations=1 |
| executor-config.ts | Cited | MISSING | Citations=1; Iterations=1 |
| matrix-manifest.ts | Cited | MISSING | Citations=1; Iterations=1 |
| runtime/lib/deep-loop/executor-config.ts | Cited | MISSING | Citations=1; Iterations=1 |

---

## 8. Tests

> Test files, fixtures, and snapshots. Tests take precedence over `Scripts`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| dsh-src/packages/bundle/headless/tests/headless.spec.ts | Cited | MISSING | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/settings.json | Cited | OK | Citations=1; Iterations=1 |
| .pi/mcp.json | Cited | OK | Citations=1; Iterations=1 |
| .pi/settings.json | Cited | OK | Citations=2; Iterations=2 |
| /Users/michelkerkmeester/.local/lib/node_modules/@deepseek-ai/dsh/node_modules/@deepseek-ai/dsh-mcp-client/package.json | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/lib/node_modules/@deepseek-ai/dsh/package.json | Cited | OK | Citations=1; Iterations=1 |
| agents-md-manifest.json | Cited | MISSING | Citations=1; Iterations=1 |
| deep-ai-council-auto.yaml | Cited | MISSING | Citations=1; Iterations=1 |
| deep-research-auto.yaml | Cited | MISSING | Citations=1; Iterations=1 |
| deep-review-auto.yaml | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/apps/cli/config/examples/ptc.yml | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/apps/cli/config/examples/team-mode.yml | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/bundle/base/cordis.patch.yml | Cited | MISSING | Citations=6; Iterations=6 |
| dsh-src/packages/bundle/headless/cordis.patch.yml | Cited | MISSING | Citations=5; Iterations=5 |
| dsh-src/packages/bundle/web-app/cordis.patch.yml | Cited | MISSING | Citations=2; Iterations=2 |
| dsh-src/packages/experimental/hooks-claude-code/package.json | Cited | MISSING | Citations=1; Iterations=1 |
| dsh-src/packages/subprocess/subprocess-local/package.json | Cited | MISSING | Citations=1; Iterations=1 |
| installed dsh package.json | Cited | MISSING | Citations=1; Iterations=1 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| AGENTS.md | Cited | OK | Citations=2; Iterations=2 |
| README.md | Cited | OK | Citations=1; Iterations=1 |

---

---

## Lineage Delta Sources

| Lineage | Delta |
|---------|-------|
| deepseek | lineages/deepseek/deltas/iter-001.jsonl |
| deepseek | lineages/deepseek/deltas/iter-002.jsonl |
| deepseek | lineages/deepseek/deltas/iter-003.jsonl |
| deepseek | lineages/deepseek/deltas/iter-004.jsonl |
| deepseek | lineages/deepseek/deltas/iter-005.jsonl |
| deepseek | lineages/deepseek/deltas/iter-006.jsonl |
| deepseek | lineages/deepseek/deltas/iter-007.jsonl |
| deepseek | lineages/deepseek/deltas/iter-008.jsonl |
| deepseek | lineages/deepseek/deltas/iter-009.jsonl |
| deepseek | lineages/deepseek/deltas/iter-010.jsonl |
| luna | lineages/luna/deltas/iter-001.jsonl |
| luna | lineages/luna/deltas/iter-002.jsonl |
| luna | lineages/luna/deltas/iter-003.jsonl |
| luna | lineages/luna/deltas/iter-004.jsonl |
| luna | lineages/luna/deltas/iter-005.jsonl |
| luna | lineages/luna/deltas/iter-006.jsonl |
| luna | lineages/luna/deltas/iter-007.jsonl |
| luna | lineages/luna/deltas/iter-008.jsonl |
| luna | lineages/luna/deltas/iter-009.jsonl |
| luna | lineages/luna/deltas/iter-010.jsonl |
