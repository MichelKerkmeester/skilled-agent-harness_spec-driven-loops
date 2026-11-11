---
title: "Resource Map — How can this repository make sure that a deep loop (research, review or council) started through natural conversation follows its proper workflow and does not skip steps? An incident record is at specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/scratch/incident-chat-started-loop.md and the driver the session had to write is at specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/scratch/single-executor-driver.py. Read both first. Then read .skilled/commands/deep/research.md, .skilled/commands/deep/assets/deep-research-auto.yaml and deep-research-presentation.txt, .skilled/skills/system-deep-loop/SKILL.md and its deep-research/SKILL.md, runtime/scripts/fanout-run.cjs, verify-iteration.cjs, fanout-merge.cjs and synthesis-closeout.cjs, AGENTS.md Gate 4 and PLAN-WORKFLOW LOCK, and .skilled/repo-rules/delegation-and-orchestration.md. Establish which workflow steps are enforced by code and which only by prose, why a fan-out lineage runs all its iterations in one process, and what would have caught the incident. Recommend the smallest set of changes to existing files that keeps a chat-started loop on its workflow, and say what not to build. Prefer changing an existing line or making an existing script refuse or report over a new command, agent, hook or document."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 28
- **By category**: READMEs=0, Documents=1, Commands=8, Agents=0, Skills=14, Specs=4, Scripts=0, Tests=0, Config=0, Meta=1
- **Missing on disk**: 0
- **Scope**: research convergence output for 005-goldfish-cold-read-plan-review
- **Generated**: 2026-11-11T20:22:23.666Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/repo-rules/delegation-and-orchestration.md | Cited | OK | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/deep/ai-council.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/deep/assets/deep-research-auto.yaml | Cited | OK | Citations=5; Iterations=5 |
| .skilled/commands/deep/assets/deep-research-presentation.txt | Cited | OK | Citations=4; Iterations=4 |
| .skilled/commands/deep/assets/deep-review-auto.yaml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/deep/assets/deep-review-confirm.yaml | Cited | OK | Citations=3; Iterations=3 |
| .skilled/commands/deep/assets/deep-review-presentation.txt | Cited | OK | Citations=3; Iterations=3 |
| .skilled/commands/deep/research.md | Cited | OK | Citations=6; Iterations=6 |
| .skilled/commands/deep/review.md | Cited | OK | Citations=3; Iterations=3 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-research/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | Cited | OK | Citations=6; Iterations=6 |
| .skilled/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/hooks-plugins-extensions/hook-injection-pipeline/002-injection-bloat-reduction/per-prompt-injection-audit/research/deep-research-config.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/006-fanout-deep-review/review/deep-review-config.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/006-fanout-deep-review/review/lineages/deepseek/deep-review-config.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/scratch/single-executor-driver.py | Cited | OK | Citations=1; Iterations=1 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| AGENTS.md | Cited | OK | Citations=1; Iterations=1 |

---
