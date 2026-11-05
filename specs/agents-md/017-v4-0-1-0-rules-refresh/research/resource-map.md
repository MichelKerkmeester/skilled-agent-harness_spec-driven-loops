---
title: "Resource Map — Check whether anything shipped in the Skilled v4.0.1.0 release means AGENTS.md (repo root, which CLAUDE.md mirrors), REPO RULES.md or the rule files under .skilled/repo-rules/ need updating or refining. Source of what changed: .skilled/changelog/skilled/v4.0.1.0.md, the per-skill changelog entries it names, and git log v4.0.0.0..v4.0.1.0 (or the commit range those tags cover). For each change, ask: does a gate, law, rule, trigger-table row, path, command name, skill or mode name, script path or workflow in AGENTS.md or a repo rule now point at something renamed, removed, added or behaving differently; is there a new mandatory behavior the rules should state; is any rule now redundant with something a tool now enforces. Check every path and command the rules cite still exists. Report gaps as findings ranked by impact, each with the exact file:line in AGENTS.md or the rule file, the v4.0.1.0 change that causes it (file:line or commit), and the proposed one-line edit. Say plainly when nothing needs to change. Read-only: write only under the spec folder. Cite file:line for every finding."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 39
- **By category**: READMEs=1, Documents=8, Commands=4, Agents=0, Skills=20, Specs=3, Scripts=1, Tests=0, Config=1, Meta=1
- **Missing on disk**: 2
- **Scope**: research convergence output for 017-v4-0-1-0-rules-refresh
- **Generated**: 2026-11-05T20:30:34.763Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/hooks/git/README.md | Cited | OK | Citations=2; Iterations=2 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .pi/PLUGINS.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/changelog/skilled/v4.0.1.0.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/repo-rules/ | Cited | OK | Citations=1; Iterations=1 |
| .skilled/repo-rules/answer-the-actual-request.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/repo-rules/communication-handoff.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/repo-rules/skill-hub-routing.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills | Cited | OK | Citations=1; Iterations=1 |
| REPO RULES.md | Cited | OK | Citations=4; Iterations=4 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/doctor/agents-md.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/assets/agents-md-manifest.json | Cited | OK | Citations=3; Iterations=3 |
| .skilled/commands/doctor/scripts/agents-md-check.cjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/commands/doctor/scripts/parent-skill-check.cjs | Cited | OK | Citations=2; Iterations=2 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-code/ROUTER.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/ROUTER.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/changelog/v0.17.24.0.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/references/memory/save-workflow.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/references/validation/validation-rules.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/references/workflows/quick-reference.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/ROUTER.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/generate-context.js | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/goal.cjs | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/SKILL.md | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/agents-md/016-doctor-agents-md/goal.md | Cited | OK | Citations=1; Iterations=1 |
| specs/agents-md/016-doctor-agents-md/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-doc/051-hub-routing-quality/002-skill-routing-and-clarity/spec.md | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/skill-advisor.cjs | Cited | OK | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .codex/config.toml | Cited | OK | Citations=2; Iterations=2 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| AGENTS.md | Cited | OK | Citations=4; Iterations=4 |

---
