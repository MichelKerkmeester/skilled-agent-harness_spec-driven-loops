---
title: "Resource Map — Is the root README.md still accurate after every change described in .skilled/changelog/skilled/v4.0.0.4.md (per-doc version model, install steps and Node 24, unknown-option refusal, playbook and catalog path checks, advisor CI agreement, retired deep-loop modes, hooks, routing, code review output and the rest of the note), and are the related READMEs accurate: every README the root README links to or that documents the same setup or features (for example .skilled/README.md, install guides, and the hub READMEs for sk-doc, sk-code, sk-git, system-spec-kit, system-skill-advisor and cli-pi, plus any README the v4.0.0.4 changes touch). For each finding give README path:line, the claim, repository evidence (path:line or a command and its output), a class (STALE, MISSING, WRONG or OK-VERIFIED) and a severity, and propose the smallest correct wording fix with no restructure."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 103
- **By category**: READMEs=5, Documents=13, Commands=14, Agents=5, Skills=55, Specs=0, Scripts=9, Tests=0, Config=1, Meta=1
- **Missing on disk**: 1
- **Scope**: research convergence output for 023-readme-freshness-research
- **Generated**: 2026-10-12T15:33:21.755Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/lib/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/bin/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/hooks/session-lifecycle/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/README.md | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/scripts/git-hooks/README.md | Cited | OK | Citations=2; Iterations=2 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .hermes/prompts/speckit-complete.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/agents | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/ | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/agent-mirror-crosswalk.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/lib | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/lib/ | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.4.md | Cited | OK | Citations=9; Iterations=9 |
| .skilled/commands | Cited | OK | Citations=1; Iterations=1 |
| .skilled/plugins | Cited | OK | Citations=1; Iterations=1 |
| .skilled/plugins/ | Cited | OK | Citations=1; Iterations=1 |
| .skilled/scripts/git-hooks/pre-commit | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills | Cited | OK | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/ | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/create/changelog.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/deep/ai-council.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/deep/research.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/deep/review.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/ | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-update-compat-action.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/mcp.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/parent-skill-check.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/scripts/route-validate.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/route-validate.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/update.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/README.txt | Cited | OK | Citations=1; Iterations=1 |

---

## 4. Agents

> `.skilled/agents/**`, `.claude/agents/**`, `.skilled/agents/**`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/agents/ | Cited | OK | Citations=1; Iterations=1 |
| .skilled/agents/ai-council.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/agents/deep-research.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/agents/deep-review.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/agents/README.txt | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/ | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/ | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-hermes/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/mcp-code-mode/INSTALL-GUIDE.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/mcp-code-mode/mcp-server/package.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/mcp-code-mode/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/mcp-tooling/mcp-click-up/feature-catalog/feature-catalog.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/mcp-tooling/mcp-click-up/feature-catalog/FEATURE-CATALOG.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/mcp-tooling/mcp-click-up/INSTALL-GUIDE.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/manual-testing-playbook.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/mcp-tooling/mcp-click-up/references/mcp-tools.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/mcp-tooling/mcp-click-up/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/mcp-tooling/mode-registry.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-design/sk-design-chart/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-design/sk-design-chart/references/catalog.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-design/sk-design-chart/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/mode-registry.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-git/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-git/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/mode-registry.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/ | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/INSTALL-GUIDE.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/config/route-exclusions.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/package.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/tools/advisor-recommend.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/package.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/package.json | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/ | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/SKILL.md | Cited | OK | Citations=2; Iterations=2 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/check-agent-mirror-sync.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/lib/mirror-sync-verify.cjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/bin/lib/model-server-supervision.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/lib/node-engine-resolver.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/mcp-code-mode-launcher.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/skill-advisor.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/shared/hook-flags.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/scripts/install-git-hooks.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/vitest.config.bin.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/workflows/message-contract.yml | Cited | OK | Citations=1; Iterations=1 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| README.md | Cited | OK | Citations=7; Iterations=7 |

---
