---
title: "Resource Map — Design an expansive-depth sub-mode for system-deep-loop deep-research and deep-review: a mode that smartly widens and deepens its scope instead of staying narrowly focused. Example targets the mode must handle well: (1) 'research the last 100 commits and find bugs, drifts and improvement opportunities'; (2) 'analyze system-skill-advisor and find improvement opportunities for auto-utilization of skills and commands when a user is just chatting'. Diagnose why the current loops do not extend depth enough, converge early or stay narrowly focused (convergence.cjs stop decision, newInfoRatio, minIterations, focus selection, strategy Next Focus, coverage graph, divergent mode, wave_orchestration appendix). Mine the graph-engineering research in specs/system-deep-loop/loop-architecture/002-graph-engineering (children 001-006, research/, reference/, context/) for graph-loop principles (frontier expansion, node/edge discovery, coverage-driven traversal, swarm fan-out) usable here. Propose how the sub-mode integrates into the existing agents (.skilled/agents/deep-research.md, deep-review.md), commands (.skilled/commands/deep/), workflow YAMLs, mode registry and convergence logic without replacing the current deep-loop logic; it must be an additive, opt-in sub-mode. Known defect to record as a finding: dispatch-iteration.cjs honors --claude-config-dir / CLAUDE_CONFIG_DIR only for --loop-type review, so a research run with --executor=cli-claude-code --config-dir is silently not routed to that account."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 45
- **By category**: READMEs=0, Documents=0, Commands=4, Agents=2, Skills=29, Specs=10, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 007-expansive-depth-mode
- **Generated**: 2026-11-17T08:35:59.032Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/deep/assets/deep-research.yaml | Cited | OK | Citations=5; Iterations=5 |
| .skilled/commands/deep/assets/deep-review.yaml | Cited | OK | Citations=5; Iterations=5 |
| .skilled/commands/deep/research.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/deep/review.md | Cited | OK | Citations=1; Iterations=1 |

---

## 4. Agents

> `.skilled/agents/**`, `.claude/agents/**`, `.skilled/agents/**`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/agents/deep-research.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/agents/deep-review.md | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/mode-registry.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/pivot-candidates.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs | Cited | OK | Citations=6; Iterations=6 |
| .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-deep-loop/runtime/scripts/iteration-graph-upsert.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/integration/convergence-script.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/unit/coverage-graph-signals.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts | Cited | OK | Citations=2; Iterations=2 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-deep-loop/loop-architecture/002-graph-engineering/001-agent-swarms/research/research.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-deep-loop/loop-architecture/002-graph-engineering/004-graph-engineering-master/research/research.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-deep-loop/loop-architecture/002-graph-engineering/005-noaa-paper-and-blog-theory/research/research.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-deep-loop/loop-architecture/002-graph-engineering/006-cross-study-integration/research/research.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/deep-research-state.jsonl | Cited | OK | Citations=2; Iterations=2 |
| specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/deltas/iter-004.jsonl | Cited | OK | Citations=1; Iterations=1 |
| specs/system-deep-loop/loop-architecture/002-graph-engineering/reference/02-loops-vs-graphs-decision-guide.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-deep-loop/loop-architecture/002-graph-engineering/reference/03-graph-primitives-and-snippets.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-deep-loop/loop-architecture/002-graph-engineering/reference/05-deep-loop-to-graph-mapping.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-deep-loop/loop-architecture/002-graph-engineering/research/research.md | Cited | OK | Citations=2; Iterations=2 |

---
