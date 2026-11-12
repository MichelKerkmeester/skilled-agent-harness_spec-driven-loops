---
title: "Resource Map — How should the skill advisor surface slash commands (all 45 under .skilled/commands, not only /doctor) so a model either runs the matching command workflow by itself or asks the user first, and how does a request typed as plain chat with no slash command still reach the proper command workflow on every runtime?"
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 41
- **By category**: READMEs=0, Documents=3, Commands=12, Agents=0, Skills=23, Specs=2, Scripts=0, Tests=0, Config=0, Meta=1
- **Missing on disk**: 0
- **Scope**: research convergence output for 007-command-surfacing-and-workflow-enforcement
- **Generated**: 2026-11-12T09:57:06.712Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/commands | Cited | OK | Citations=1; Iterations=1 |
| .devin/SYNC.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/commands | Cited | OK | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/create/assets/create-skill-auto.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/create/README.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/create/skill.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/deep/assets/deep-research-auto.yaml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/deep/assets/deep-research-confirm.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/deep/research.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/_routes.yaml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/git.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/skill-advisor.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/prompt/improve.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/README.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/speckit/assets/speckit-plan.yaml | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-design/command-metadata.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/command-metadata.json | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-doc/mode-registry.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/command-metadata.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/deep-research/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/mode-registry.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration-baseline.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/compat/contract.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/render.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/allow-list.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/command-bridge-resolution-guard.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/command-metadata-e2e.vitest.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/opencode-deepseek/iterations/iteration-003.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/spec.md | Cited | OK | Citations=1; Iterations=1 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| AGENTS.md | Cited | OK | Citations=4; Iterations=4 |

---
