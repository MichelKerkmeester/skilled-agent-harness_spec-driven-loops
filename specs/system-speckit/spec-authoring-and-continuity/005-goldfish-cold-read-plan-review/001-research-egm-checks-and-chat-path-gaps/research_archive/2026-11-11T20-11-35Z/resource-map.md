---
title: "Resource Map — How can a natural-chat session get the protection of the spec-kit command workflows without the user typing a command, while staying flexible? Today the skill advisor recommends a skill or command in a hook brief, and a recommendation is not automatic use. A chat session that writes files loads AGENTS.md, the system-spec-kit SKILL.md, its ROUTER.md, the authoring card, the packet templates and validate.sh. It does not load .skilled/commands/speckit/assets/speckit-plan.yaml, speckit-implement.yaml or speckit-complete.yaml. Candidate mechanisms: a gate in AGENTS.md that routes a write request into workflow steps; a small shared step reference both paths read; a hook that injects the one relevant step at prompt or tool time; enforcement carried by templates and validate.sh; the session invoking the command itself when the advisor is confident. Rank them and recommend one, with the smallest set of changes to existing files. Prefer changing an existing line over a new file, hook, command or agent."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 40
- **By category**: READMEs=3, Documents=6, Commands=5, Agents=1, Skills=19, Specs=3, Scripts=0, Tests=0, Config=2, Meta=1
- **Missing on disk**: 1
- **Scope**: research convergence output for 005-goldfish-cold-read-plan-review
- **Generated**: 2026-11-11T20:10:21.499Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .devin/README.md | Cited | OK | Citations=2; Iterations=2 |
| .dsh/plugins/repo-guards/README.md | Cited | OK | Citations=1; Iterations=1 |
| .dsh/README.md | Cited | OK | Citations=1; Iterations=1 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .cursor/rules/skill-routing.md | Cited | OK | Citations=1; Iterations=1 |
| .devin/SYNC.md | Cited | OK | Citations=4; Iterations=4 |
| .dsh/SYNC.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/injection-contract.md | Cited | OK | Citations=1; Iterations=1 |
| iteration-008.md | Cited | MISSING | Citations=1; Iterations=1 |
| specs | Cited | OK | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/deep/review.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/speckit/assets/speckit-complete.yaml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/speckit/assets/speckit-implement.yaml | Cited | OK | Citations=3; Iterations=3 |
| .skilled/commands/speckit/assets/speckit-plan.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/speckit/implement.md | Cited | OK | Citations=1; Iterations=1 |

---

## 4. Agents

> `.skilled/agents/**`, `.claude/agents/**`, `.skilled/agents/**`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/agents/orchestrate.md | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/system-deep-loop/deep-review/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/runtime/data/prompt-policy.default.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/references/ | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/references/structure/folder-structure.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/references/workflows/quick-reference.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md | Cited | OK | Citations=10; Iterations=10 |
| .skilled/skills/system-spec-kit/ROUTER.md | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json | Cited | OK | Citations=5; Iterations=5 |
| .skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl | Cited | OK | Citations=5; Iterations=5 |
| .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/cli-orca/001-mcp-orca-cli/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skilled-doctor/003-removed-folder-classification/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/research/iterations/iteration-007.md | Cited | OK | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .dsh/agents/code.patch.yml | Cited | OK | Citations=1; Iterations=1 |
| .dsh/agents/orchestrate.patch.yml | Cited | OK | Citations=1; Iterations=1 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| AGENTS.md | Cited | OK | Citations=11; Iterations=11 |

---
