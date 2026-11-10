---
title: "Resource Map — How can the skill advisor guide users to the right doctor command when they ask setup or health questions in plain words, such as 'help me set up skilled', 'is my repo set up right', 'check my git hooks' or 'why is this rule not enforced'? Study how the advisor routes today: .skilled/bin/skill-advisor.cjs, .skilled/skills/system-skill-advisor/ (its scorer, hooks/skill-advisor-hook.md, graph and trigger data), how commands are surfaced to the advisor versus skills, and the doctor family: .skilled/commands/doctor/*.md, .skilled/commands/doctor/_routes.yaml (its trigger_phrases per route), /doctor:sk-code setup, /doctor:git setup, /doctor:speckit, /doctor:env, /doctor:update, /doctor:mcp and /doctor:skill-advisor. Measure what the advisor returns today for at least ten such prompts (run node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{\"prompt\":\"...\"}' --format json). Then design how it should point to doctor commands: whether _routes.yaml trigger phrases should feed the advisor, a dedicated onboarding or 'set up skilled' entry point, how to avoid stealing prompts from skills, and how to test routing accuracy. Name ideas to reject with the reason. Cite path:line for every claim. End with ranked recommendations and proposed implementation phases."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 27
- **By category**: READMEs=0, Documents=0, Commands=7, Agents=0, Skills=17, Specs=2, Scripts=1, Tests=0, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 034-doctor-command-guidance
- **Generated**: 2026-10-15T14:06:28.952Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/doctor/_routes.yaml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/assets/doctor-env.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-skill-advisor-tune.yaml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/env.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/git.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/skill-advisor.md | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/command-metadata.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/render.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/types.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/doc-frontmatter.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/allow-list.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/agents/016-repo-rule-advisor-surfacing/001-advisor-surfacing/research/research.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/swe-2-max/.executor-state/baseline-probes.jsonl | Cited | OK | Citations=2; Iterations=2 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/skill-advisor.cjs | Cited | OK | Citations=1; Iterations=1 |

---
