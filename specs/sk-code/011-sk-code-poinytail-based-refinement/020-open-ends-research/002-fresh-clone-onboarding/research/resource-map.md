---
title: "Resource Map — Walking a fresh clone of this framework from install to the first routed request and the first spec packet, as an external repo user: what are all the stumbles, ranked by user impact? For each known stumble (advisor runtime Node 20.19 vs spec-kit CLI Node 22.12 floor mismatch; sk-vision tests failing until vision-runtime/dist is built; the compiled-routing rebuild depending on an authored source under specs/sk-doc/z_archive referenced by .skilled/bin/lib/compiled-route-layout.cjs; worktree provisioning; hook trust via skilled.trustRepoHooks) is it real today and what does it cost the user? What is the smallest set of fixes, ranked by user impact, each passed through .skilled/repo-rules/prevent-overengineering.md?"
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 68
- **By category**: READMEs=3, Documents=15, Commands=1, Agents=0, Skills=18, Specs=3, Scripts=16, Tests=0, Config=11, Meta=1
- **Missing on disk**: 3
- **Scope**: research convergence output for 002-fresh-clone-onboarding
- **Generated**: 2026-10-11T17:34:51.003Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .pi/extensions/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/bin/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/hooks/README.md | Cited | OK | Citations=1; Iterations=1 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/SYNC.md | Cited | OK | Citations=2; Iterations=2 |
| .codex/SYNC.md | Cited | OK | Citations=1; Iterations=1 |
| .gitignore | Cited | OK | Citations=1; Iterations=1 |
| .skilled_skills_cli-orca | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/agent-mirror-crosswalk.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/cli-jev/cli-usage | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/changelog/cli-jev/parent | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/hooks/git/pre-commit | Cited | OK | Citations=2; Iterations=2 |
| .skilled/repo-rules/prevent-overengineering.md | Cited | OK | Citations=4; Iterations=4 |
| .skilled/scripts/git-hooks/post-commit | Cited | OK | Citations=1; Iterations=1 |
| .skilled/scripts/git-hooks/pre-commit | Cited | OK | Citations=3; Iterations=3 |
| /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/security.md | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/settings.md | Cited | OK | Citations=1; Iterations=1 |
| CONTRIBUTING.md | Cited | OK | Citations=2; Iterations=2 |
| PUBLIC-RELEASE.md | Cited | OK | Citations=2; Iterations=2 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/mcp-code-mode/INSTALL-GUIDE.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/mcp-code-mode/mcp-server/package.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/mcp-code-mode/mcp-server/scripts/check-node.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-git/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-vision/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-vision/vision-runtime/package.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-vision/vision-runtime/python/runtime.test.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-vision/vision-runtime/scripts/build.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/package.json | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/package.json | Cited | OK | Citations=5; Iterations=5 |
| .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/package.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/package.json | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-spec-kit/shared/package.json | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/002-fresh-clone-onboarding/research/iterations/iteration-006.md | Cited | OK | Citations=2; Iterations=2 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/002-fresh-clone-onboarding/research/iterations/iteration-007.md | Cited | OK | Citations=2; Iterations=2 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/002-fresh-clone-onboarding/research/iterations/iteration-008.md | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .hermes/plugins/repo-guards/__init__.py | Cited | OK | Citations=1; Iterations=1 |
| .opencode/plugins/session-cleanup.js | Cited | OK | Citations=1; Iterations=1 |
| .opencode/plugins/sk-vision.js | Cited | MISSING | Citations=3; Iterations=3 |
| .pi/extensions/lib/claude-hook-adapter.ts | Cited | OK | Citations=2; Iterations=2 |
| .pi/extensions/session-start-context.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/bin/check-agent-mirror-sync.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/bin/check-git-hooks.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/compiled-route-guard.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/compiled-route-sync.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/install-codex-hooks.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/lib/compiled-route-layout.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/bin/lib/mirror-sync-verify.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/mcp-code-mode-launcher.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/bin/skill-advisor.cjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/scripts/install-git-hooks.sh | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/settings-manager.js | Cited | OK | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/mcp.json | Cited | OK | Citations=1; Iterations=1 |
| .claude/settings.json | Cited | OK | Citations=3; Iterations=3 |
| .codex/hooks.json | Cited | OK | Citations=3; Iterations=3 |
| .cursor/hooks.json | Cited | OK | Citations=3; Iterations=3 |
| .devin/hooks.v1.json | Cited | OK | Citations=2; Iterations=2 |
| .devin/mcp_config.json | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/agent-mirror-sync.yml | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/spec-kit-check.yml | Cited | OK | Citations=2; Iterations=2 |
| .pi/mcp.json | Cited | OK | Citations=1; Iterations=1 |
| .pi/settings.json | Cited | OK | Citations=2; Iterations=2 |
| .utcp_config.json | Cited | OK | Citations=1; Iterations=1 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| README.md | Cited | OK | Citations=10; Iterations=10 |

---
