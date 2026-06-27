# Iteration 1: Baseline Inventory And Path Reality

## Focus

Establish the live foundations surface, confirm the actual on-disk path, and compare current state against prior corpus recommendations.

## Findings

1. The prompt's `.opencode/skills/sk-design/foundations` target maps to the live packet `.opencode/skills/sk-design/design-foundations/`. The parent hub says workflow mode `foundations` routes to packet `sk-design/design-foundations/`, and `mode-registry.json` records `workflowMode: foundations` with `packet: design-foundations`. [SOURCE: file:.opencode/skills/sk-design/SKILL.md:23-29], [SOURCE: file:.opencode/skills/sk-design/mode-registry.json:27-37]
2. Foundations owns static visual-system decisions, not interface direction, motion, audit, extraction, or pure code implementation. The skill lists color, typography, layout, responsive adaptation, data visualization, and token handoff as activation triggers, then routes direction to interface, motion to motion, review to audit, extraction to md-generator, and implementation-only work to sk-code. [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:23-40]
3. The 009 research recommendation for foundations is no longer a gap list. It recommended `data_viz.md`, `adaptation_matrix.md`, and `token_starter.md` for foundations. [SOURCE: file:.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/009-reference-asset-expansion/research/research.md:70-82]
4. Phase 012 implemented the foundations additions named by 009: `references/data_viz.md`, `references/layout/adaptation_matrix.md`, and `assets/token_starter.md`, and wired them into `design-foundations/SKILL.md`. [SOURCE: file:.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/012-foundations-motion-audit/implementation-summary.md:57-76]
5. The live corpus map shows the foundations references were distilled from the intended source clusters: OKLCH, colorize, layout, baseline, adapt, designer-skills typography/data-viz, and scale sources. This makes the current packet stronger than the 009 baseline and shifts improvement from missing topics to usability, routing, and validation. [SOURCE: file:.opencode/skills/sk-design/design-foundations/references/corpus_map.md:31-42]

## Sources Consulted

- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/design-foundations/SKILL.md`
- `.opencode/skills/sk-design/design-foundations/references/corpus_map.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/009-reference-asset-expansion/research/research.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/012-foundations-motion-audit/implementation-summary.md`

## Assessment

- newInfoRatio: 1.0
- Novelty: First iteration established the true current state and avoided re-recommending completed 009 work.
- Confidence: High for file inventory and phase-012 completion; medium for external-corpus depth because the exact `external/` directory requested by the prompt was not present locally.

## Reflection

- What worked: Read the parent registry before judging foundations directly.
- What failed: The exact target path in the prompt was not an on-disk folder.
- Ruled out: Treating 009's foundations recommendations as still-open gaps.

## Recommended Next Focus

Investigate routing and the operator-provided Mode A score, especially parent registry aliases versus child-level trigger coverage.
