---
title: "Resource Map — Generation 2 extension of the expansive-depth sub-mode research for system-deep-loop deep-research and deep-review. Generation 1 (7 iterations, archived at specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research_archive/20261117T103614Z/research.md) designed an opt-in --depth-mode=expansive frontier sub-mode and registered defects D1-D9. This generation verifies and deepens it: (a) adversarially verify the design and D1-D9 against the code, correcting anything wrong; (b) close the generation-1 open questions: review-side pivot adapter divergent-review-pivot.ts and fanout-merge.cjs internals, whether a divergent pivot after all_questions_answered buys only about one iteration, and who should produce coverage-graph quality_class with what closed vocabulary; (c) find further reasons loops stay narrow that generation 1 missed (deep-review reducer, prompt packs, agent definitions, skill-advisor scorer df-idf.ts for example target 2); (d) refine the implementation plan into concrete, testable change slices with risks."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 47
- **By category**: READMEs=0, Documents=0, Commands=5, Agents=1, Skills=35, Specs=6, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 8
- **Scope**: research convergence output for 007-expansive-depth-mode
- **Generated**: 2026-11-17T11:47:35.879Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/deep/assets/deep-research.yaml | Cited | OK | Citations=4; Iterations=4 |
| .skilled/commands/deep/assets/deep-research.yaml:46,60,1131-1135,1171-1176,1206-1207 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/commands/deep/assets/deep-research.yaml:1061,1163-1169 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/commands/deep/assets/deep-review.yaml | Cited | OK | Citations=4; Iterations=4 |
| .skilled/commands/deep/research.md | Cited | OK | Citations=1; Iterations=1 |

---

## 4. Agents

> `.skilled/agents/**`, `.claude/agents/**`, `.skilled/agents/**`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/agents/deep-research.md | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/system-deep-loop/ARCHITECTURE.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence-reference-only.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts:198-285,354-402 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:285-288,733,739 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:286,298-307 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/lifecycle-taxonomy.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/references/integration-points.md:47,60 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1115,1149-1150 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/iteration-graph-upsert.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/loop-lock.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/ | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/integration/convergence-script.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/df-idf.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-prompt-policy.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/tests/deep-review-auto-restart-contract.vitest.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/deep-research-config.json | Cited | OK | Citations=2; Iterations=2 |
| specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/deep-research-config.json:7,97 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/deep-research-state.jsonl | Cited | OK | Citations=1; Iterations=1 |
| specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/iterations/iteration-001.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/iterations/iteration-003.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/iterations/iteration-004.md | Cited | OK | Citations=1; Iterations=1 |

---
