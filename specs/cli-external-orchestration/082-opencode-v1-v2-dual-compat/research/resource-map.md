---
title: "Resource Map — How to make the Skilled repo perfectly compatible with both OpenCode v1 (1.19.x) and OpenCode v2 (2.0.x) at the same time: every agent, command, plugin, skill, hook and config file, plus the cli-opencode skill dispatching to both versions and documenting side-by-side and single-version installs"
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 135
- **By category**: READMEs=1, Documents=9, Commands=9, Agents=7, Skills=22, Specs=49, Scripts=33, Tests=0, Config=5, Meta=0
- **Missing on disk**: 7
- **Scope**: research convergence output for 082-opencode-v1-v2-dual-compat
- **Generated**: 2026-10-18T10:35:51.179Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/plugins/README.md | Cited | OK | Citations=3; Iterations=3 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/skills | Cited | OK | Citations=1; Iterations=1 |
| .opencode/plugins/ | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/opencode-v2/lib/node_modules/@opencode/cli/bin/opencode.exe | Cited | OK | Citations=1; Iterations=1 |
| ~/.local/bin/opencode2 | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.local/opencode-v2/bin/ | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.local/share/opencode/ | Cited | MISSING | Citations=1; Iterations=1 |
| npm:@opencode/cli | Cited | MISSING | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/agent-router.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/create/README.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/deep/assets/compiled/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/deep/assets/legacy/deep-research.body.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/deep/research.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/design/extract.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/README.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/scripts/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/speckit/search.md | Cited | OK | Citations=1; Iterations=1 |

---

## 4. Agents

> `.skilled/agents/**`, `.claude/agents/**`, `.skilled/agents/**`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/agents/ai-council.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/agents/code.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/agents/debug.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/agents/deep-research.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/agents/deep-review.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/agents/markdown.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/agents/orchestrate.md | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/cli-external-orchestration/cli-claude-code/benchmark/reports/2026-07-29--manual-testing-playbook--goal-hook/skill-benchmark-report.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-opencode/assets/prompt-templates.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cross-repo-cross-server/attach-remote-server.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-opencode/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/opencode-tools.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/mcp-code-mode/mcp-server/index.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-communication | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-design/sk-design-md-generator/backend/node_modules/playwright-core/lib/tools/skills | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-vision/hooks/opencode/sk-vision.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-vision/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-vision/vision-runtime/src/opencode/attachments.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-vision/vision-runtime/src/opencode/command.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-vision/vision-runtime/src/plugin.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook-validation.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/SKILL.md | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/research/deep-research-state.jsonl | Cited | OK | Citations=2; Iterations=2 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/research/deltas/iter-001.jsonl | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/research/deltas/iter-004.jsonl | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/research/iterations/iteration-002.md | Cited | OK | Citations=2; Iterations=2 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/research/iterations/iteration-003.md | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/research/iterations/iteration-005.md | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/research/iterations/iteration-006.md | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/research/iterations/iteration-008.md | Cited | OK | Citations=2; Iterations=2 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/research/iterations/iteration-014.md | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/research/iterations/iteration-018.md | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/research/iterations/iteration-020.md | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/research/steering-log.md | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v1probe/markers/load.log | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v1probe/project/.opencode/plugins/01-b-object.js | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/adapter.js | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/app.d.ts | Cited | MISSING | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/command.d.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/event.d.ts | Cited | OK | Citations=2; Iterations=2 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/index.d.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/options.d.ts | Cited | MISSING | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/plugin.d.ts | Cited | OK | Citations=4; Iterations=4 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/plugin.js | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/registration.d.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/rpc.d.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/session.d.ts | Cited | OK | Citations=2; Iterations=2 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/dist/promise/tool.d.ts | Cited | OK | Citations=2; Iterations=2 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v2pkg/package/package.json | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a7-probe/.opencode/agents/probe.md | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a7-probe/.opencode/plugin/v1-singular.js | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a7-probe/opencode.json | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a12-probe/b1.json | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a12-probe/c1.json | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a12-probe/env.log | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a12-probe/opencode.json | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v1-debug-help.txt | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v1-help.txt | Cited | OK | Citations=2; Iterations=2 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v1-run-help.txt | Cited | OK | Citations=2; Iterations=2 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v1-version.txt | Cited | OK | Citations=2; Iterations=2 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v2-api-help.txt | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v2-debug-help.txt | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v2-help.txt | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v2-openapi.json | Cited | OK | Citations=8; Iterations=8 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v2-run-help.txt | Cited | OK | Citations=3; Iterations=3 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v2-serve-help.txt | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v2-service-help.txt | Cited | OK | Citations=2; Iterations=2 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v2-uninstall-help.txt | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v2-upgrade-help.txt | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v2-version.txt | Cited | OK | Citations=2; Iterations=2 |
| specs/system-deep-loop/039-deprecate-improvement-modes/001-removal-research/001-model-benchmark-inventory/research/lineages/deepseek/logs/fanout-lineage.out | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts | Cited | OK | Citations=2; Iterations=2 |
| .opencode/node_modules/@opencode-ai/plugin/dist/tool.d.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/node_modules/@opencode-ai/plugin/dist/tool.js | Cited | OK | Citations=1; Iterations=1 |
| .opencode/node_modules/@opencode-ai/plugin/dist/v2/promise/context.d.ts | Cited | OK | Citations=3; Iterations=3 |
| .opencode/node_modules/@opencode-ai/plugin/dist/v2/promise/index.d.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/node_modules/@opencode-ai/plugin/dist/v2/promise/plugin.d.ts | Cited | OK | Citations=2; Iterations=2 |
| .opencode/node_modules/@opencode-ai/plugin/dist/v2/promise/registration.d.ts | Cited | OK | Citations=2; Iterations=2 |
| .opencode/plugins/classifier-injection-screen.js | Cited | OK | Citations=2; Iterations=2 |
| .opencode/plugins/cli-dispatch-audit.js | Cited | OK | Citations=3; Iterations=3 |
| .opencode/plugins/codex-hooks-watchdog.js | Cited | OK | Citations=1; Iterations=1 |
| .opencode/plugins/lib/opencode-message-identity.js | Cited | OK | Citations=1; Iterations=1 |
| .opencode/plugins/lib/skill-advisor-render.js | Cited | OK | Citations=1; Iterations=1 |
| .opencode/plugins/mcp-route-guard.js | Cited | OK | Citations=1; Iterations=1 |
| .opencode/plugins/opencode-goal.js | Cited | OK | Citations=4; Iterations=4 |
| .opencode/plugins/session-cleanup.js | Cited | OK | Citations=1; Iterations=1 |
| .opencode/plugins/sk-code-post-edit-quality.js | Cited | OK | Citations=1; Iterations=1 |
| .opencode/plugins/sk-git-message-gate.js | Cited | OK | Citations=1; Iterations=1 |
| .opencode/plugins/sk-git-preflight-advisory.js | Cited | OK | Citations=1; Iterations=1 |
| .opencode/plugins/sk-vision.js | Cited | OK | Citations=2; Iterations=2 |
| .opencode/plugins/system-completion-sentinel.js | Cited | OK | Citations=3; Iterations=3 |
| .opencode/plugins/system-deep-loop-guard.js | Cited | OK | Citations=1; Iterations=1 |
| .opencode/plugins/system-dist-freshness-guard.js | Cited | OK | Citations=1; Iterations=1 |
| .opencode/plugins/system-skill-advisor.js | Cited | OK | Citations=4; Iterations=4 |
| .opencode/plugins/system-spec-gate.js | Cited | OK | Citations=3; Iterations=3 |
| .opencode/plugins/system-speckit-completion.js | Cited | OK | Citations=2; Iterations=2 |
| .skilled/hooks/dispatch/lib/dispatch-audit.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/plugins/opencode-goal.js | Cited | OK | Citations=1; Iterations=1 |
| .skilled/plugins/system-completion-sentinel.js | Cited | OK | Citations=2; Iterations=2 |
| .skilled/plugins/system-skill-advisor.js | Cited | OK | Citations=1; Iterations=1 |
| .skilled/plugins/system-spec-gate.js | Cited | OK | Citations=2; Iterations=2 |
| file:/Users/michelkerkmeester/.config/opencode/plugins/orca-opencode-status.js | Cited | MISSING | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/workflows/dispatch-enforcement-guard.yml | Cited | OK | Citations=1; Iterations=1 |
| .opencode/node_modules/@opencode-ai/plugin/package.json | Cited | OK | Citations=1; Iterations=1 |
| .opencode/package.json | Cited | OK | Citations=6; Iterations=6 |
| .skilled/package.json | Cited | OK | Citations=2; Iterations=2 |
| opencode.json | Cited | OK | Citations=1; Iterations=1 |

---
