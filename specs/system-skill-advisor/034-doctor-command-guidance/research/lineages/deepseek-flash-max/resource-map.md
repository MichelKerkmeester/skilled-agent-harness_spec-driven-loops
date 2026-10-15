---
title: "Resource Map — How can the skill advisor guide users to the right doctor command when they ask setup or health questions in plain words, such as 'help me set up skilled', 'is my repo set up right', 'check my git hooks' or 'why is this rule not enforced'? Study how the advisor routes today: .skilled/bin/skill-advisor.cjs, .skilled/skills/system-skill-advisor/ (its scorer, hooks/skill-advisor-hook.md, graph and trigger data), how commands are surfaced to the advisor versus skills, and the doctor family: .skilled/commands/doctor/*.md, .skilled/commands/doctor/_routes.yaml (its trigger_phrases per route), /doctor:sk-code setup, /doctor:git setup, /doctor:speckit, /doctor:env, /doctor:update, /doctor:mcp and /doctor:skill-advisor. Measure what the advisor returns today for at least ten such prompts (run node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{\"prompt\":\"...\"}' --format json). Then design how it should point to doctor commands: whether _routes.yaml trigger phrases should feed the advisor, a dedicated onboarding or 'set up skilled' entry point, how to avoid stealing prompts from skills, and how to test routing accuracy. Name ideas to reject with the reason. Cite path:line for every claim. End with ranked recommendations and proposed implementation phases."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 57
- **By category**: READMEs=0, Documents=0, Commands=9, Agents=0, Skills=25, Specs=22, Scripts=1, Tests=0, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 034-doctor-command-guidance
- **Generated**: 2026-10-15T14:07:17.826Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/doctor/_routes.yaml | Cited | OK | Citations=5; Iterations=5 |
| .skilled/commands/doctor/assets/doctor-skill-advisor-tune.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/env.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/git.md | Cited | OK | Citations=4; Iterations=4 |
| .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/route-validate.sh | Cited | OK | Citations=4; Iterations=4 |
| .skilled/commands/doctor/skill-advisor.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/commands/doctor/update.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/README.txt | Cited | OK | Citations=2; Iterations=2 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-doc/command-metadata.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/ARCHITECTURE.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/lib/render.ts | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/derived.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/types.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/weights-config.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/doc-frontmatter.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/allow-list.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/ambiguity-prompts.jsonl | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/tests/command-bridges-drift-guard.vitest.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/SKILL.md | Cited | OK | Citations=2; Iterations=2 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-01.json | Cited | OK | Citations=4; Iterations=4 |
| specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-02.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-03.json | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-04.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-06.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-10.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-11.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-index.json | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-control-01.json | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-control-07.json | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-control-08.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-control-09.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-control-10.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-doctor-01.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-doctor-02.json | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-doctor-05.json | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-doctor-06.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-doctor-09.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-doctor-11.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-doctor-12.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-doctor-14.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-index.json | Cited | OK | Citations=3; Iterations=3 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/skill-advisor.cjs | Cited | OK | Citations=1; Iterations=1 |

---
