---
title: "Resource Map — How should the skill advisor surface slash commands (all 45 under .skilled/commands, not only /doctor) so a model either runs the matching command workflow by itself or asks the user first, and how does a request typed as plain chat with no slash command still reach the proper command workflow on every runtime? Work through the ten research angles in section 3 of specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/spec.md: inventory, scoring, output contract, run or ask, invocation mechanics, chat-only users, skill and command linkage, measurement, prior art, failure modes. Start from the advisor runtime in .skilled/skills/system-skill-advisor (command-bridges, scorer projection and fusion, render.ts), the commands tree, AGENTS.md gates 2 and 4, and the prior packets 003-doctor-command-surfacing and system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review. Cite path:line for every claim and name evidence that contradicts a recommendation as well as evidence that supports it."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 50
- **By category**: READMEs=5, Documents=3, Commands=15, Agents=0, Skills=25, Specs=1, Scripts=0, Tests=0, Config=0, Meta=1
- **Missing on disk**: 0
- **Scope**: research convergence output for 007-command-surfacing-and-workflow-enforcement
- **Generated**: 2026-11-12T09:36:22.455Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .codex/README.md | Cited | OK | Citations=1; Iterations=1 |
| .cursor/README.md | Cited | OK | Citations=1; Iterations=1 |
| .devin/README.md | Cited | OK | Citations=1; Iterations=1 |
| .pi/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/skill-advisor/dsh/README.md | Cited | OK | Citations=1; Iterations=1 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .cursor/rules/skill-routing.md | Cited | OK | Citations=2; Iterations=2 |
| .devin/SYNC.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/repo-rules/blast-radius.md | Cited | OK | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/commands/create | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/create/agent.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/deep/research.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/commands/deep/review.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/design/diagram.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/design/extract.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/_routes.yaml | Cited | OK | Citations=4; Iterations=4 |
| .skilled/commands/doctor/assets/agents-md-manifest.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/install.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/tests/fixtures/sk-skill-check/hubs/hub-gap/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/setup.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/skill-advisor.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/update.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/speckit/handoff.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/speckit/plan.md | Cited | OK | Citations=3; Iterations=3 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-design/command-metadata.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/command-metadata.json | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-doc/mode-registry.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-git/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/command-metadata.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-research/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/lib/render.ts | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/allow-list.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/doctor-prompts.jsonl | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/tests/command-bridge-resolution-guard.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/SKILL.md | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/spec.md | Cited | OK | Citations=2; Iterations=2 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| AGENTS.md | Cited | OK | Citations=4; Iterations=4 |

---
