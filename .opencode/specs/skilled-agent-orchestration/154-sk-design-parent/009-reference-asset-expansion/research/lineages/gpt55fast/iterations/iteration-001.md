# Iteration 1: Live Inventory And Gap Baseline

## Focus

Establish the current `sk-design` reference/asset inventory and bind prior corpus gaps to this phase's narrower scope.

## Findings

- `design-interface` is already reference-rich across design process, real-UI loop, aesthetics, and MCP grounding, but has no `assets/` files [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:156].
- `design-foundations`, `design-motion`, and `design-audit` each expose five focused references and no assets, so their most useful expansion is selective decision matrices and prompt cards, not broad libraries [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:269], [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:289], [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:312].
- `design-md-generator` already owns a large extraction/write/validate reference base plus two assets, so expansion should avoid duplicating existing operational docs [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:86].
- Prior gap analysis elevates Brand-vs-Product operating register to must-add and lists the main should-adds by owner [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/001-corpus-research/research/gap-analysis.md:14].

## Sources Consulted

- `.opencode/skills/sk-design/design-interface/SKILL.md:156`
- `.opencode/skills/sk-design/design-foundations/SKILL.md:269`
- `.opencode/skills/sk-design/design-motion/SKILL.md:289`
- `.opencode/skills/sk-design/design-audit/SKILL.md:312`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md:86`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/001-corpus-research/research/gap-analysis.md:14`

## Assessment

- newInfoRatio: 0.72
- Novelty: High. This iteration established the baseline that all later recommendations must fit.
- Confidence: High for inventory and scope; all sources are current local files.

## Reflection

What worked: starting from live mode inventories prevented duplicate reference recommendations.
What failed: broad corpus listing was too noisy at this stage.
Ruled out: taxonomy changes and net-new sub-skills because the phase spec excludes them [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/009-reference-asset-expansion/spec.md:53].

## Recommended Next Focus

Investigate interface-specific additions because it is the flagship mode and has the highest number of current references but no assets.
