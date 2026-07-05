---
title: "AI Council Strategy: sk-ai-council Shared Runtime Deliberation"
description: "Round 001 charter for evaluating whether sk-ai-council should become a shared runtime."
trigger_phrases:
  - "124 ai-council strategy"
  - "sk-ai-council runtime charter"
importance_tier: "important"
contextType: "decision"
---

# AI Council Strategy - Round 001

## Topic

Should `sk-ai-council` be refactored from a per-skill helper into a shared runtime, similar to how `deep-loop-runtime` was extracted from `system-spec-kit` in arc 118, and would that be useful?

## Dimensions of Analysis

1. What `sk-ai-council` is today: current footprint, consumers, and dispatch entry point.
2. What "sk-ai-council as runtime" would mean: concrete extraction surfaces and consumer wiring.
3. Benefits: reuse, isolation, stable entry points, and parity with deep-loop-runtime patterns.
4. Costs and risks: refactor surface, packet artifact compatibility, over-engineering, and ROI.
5. Recommendation: extract, keep-inline, hybrid, or defer-and-monitor with explicit criteria.

## Convergence Rule

Use `two_of_three_advocates_plus_adjudicator`. If two of the three advocate seats agree and the adjudicator agrees, record convergence. If the advocate seats split three ways, record explicit dissent and let the adjudicator issue a ruling with re-deliberation criteria.

## Seats

| Seat | Lens | Reasoning | Mandate |
|------|------|-----------|---------|
| Seat 01 | Advocate Extract | xhigh | Argue for creating `.opencode/skills/ai-council-runtime/` and moving config/state/orchestration/convergence/report primitives. |
| Seat 02 | Advocate Keep-Inline | xhigh | Argue against extraction using current consumer count, packet-local artifact ownership, and ROI. |
| Seat 03 | Advocate Hybrid | high | Argue for extracting only low-level primitives while keeping orchestration and seat authoring in `sk-ai-council`. |
| Seat 04 | Adjudicator | xhigh | Score evidence quality, risk realism, and ROI clarity; issue final ruling and trigger criteria. |

## Shared Evidence

- `sk-ai-council` is planning-only and keeps council artifacts under packet-local `ai-council/**` while handing implementation to callers (`.opencode/skills/sk-ai-council/SKILL.md:12`, `.opencode/skills/sk-ai-council/SKILL.md:285`).
- The skill already documents artifact persistence, append-only state, convergence checking, and graph-derived recovery surfaces (`.opencode/skills/sk-ai-council/SKILL.md:39`, `.opencode/skills/sk-ai-council/SKILL.md:53`, `.opencode/skills/sk-ai-council/SKILL.md:59`).
- Helper scripts are local to `sk-ai-council`, including `persist-artifacts.cjs` and `replay-graph-from-artifacts.cjs` (`.opencode/skills/sk-ai-council/SKILL.md:122`).
- The agent surface requires packet resolution and canonical artifact persistence before completion (`.opencode/agents/ai-council.md:57`, `.opencode/agents/ai-council.md:380`).
- Council graph state is explicitly derived and packet artifacts win on disagreement (`.opencode/skills/sk-ai-council/references/graph_support.md:15`, `.opencode/skills/sk-ai-council/references/graph_support.md:31`).
- `deep-loop-runtime` is a stronger extraction precedent because it owns runtime modules, scripts, storage, tests, and consumer workflow calls (`.opencode/skills/deep-loop-runtime/SKILL.md:74`, `.opencode/skills/deep-loop-runtime/SKILL.md:142`, `.opencode/skills/deep-loop-runtime/SKILL.md:155`).

## Output Contract Per Seat

Each seat writes a focused markdown file with:

- frontmatter with round, seat, lens, model, reasoning, status, and timestamp.
- a position paragraph.
- evidence-cited arguments using file:line citations.
- risks of opposing positions.
- recommendation line.

Final report records the verdict, convergence signal, dissent map, top findings, criteria, implementation sketch, and risks.
