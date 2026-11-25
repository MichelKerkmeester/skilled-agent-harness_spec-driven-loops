---
title: "Resource Map — v4.2.0.0 logic and features: remaining bugs, docs that drifted from the code, and bad UX in what shipped since v4.1.0.0"
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 32
- **By category**: READMEs=0, Documents=2, Commands=4, Agents=0, Skills=25, Specs=0, Scripts=1, Tests=0, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 007-v4-2-0-0-release-audit-research
- **Generated**: 2026-11-25T17:25:56.347Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/skilled-loop | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/session-handover/goal-carry-over.md | Cited | OK | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/deep/assets/deep-research.yaml | Cited | OK | Citations=3; Iterations=3 |
| .skilled/commands/deep/research.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-overlay-presentation.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/overlay-engine.cjs | Cited | OK | Citations=2; Iterations=2 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-git/scripts/worktree-naming.sh | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/workflow-steps.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-stop-identity.vitest.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/feature-catalog/python-compat/cli-shim.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/response-envelope.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/render.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/hooks/decision-capture/lib/capture-core.mjs | Cited | OK | Citations=1; Iterations=1 |

---
