# Deep Research Strategy

## Research Topic

sk-design reference and asset expansion matrix for the five existing modes: `design-interface`, `design-foundations`, `design-motion`, `design-audit`, and `design-md-generator`.

## Known Context

- Prior corpus research settled the taxonomy and current five-mode shape. This phase must not reopen taxonomy, architecture, net-new sub-skills, or implementation [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/009-reference-asset-expansion/spec.md:44].
- Prior gap analysis identifies the highest-priority missing content as Brand-vs-Product operating register, transform verbs, model-specific tells, interaction/gesture craft, gpt-taste structure, forward DESIGN.md authoring, redesign remediation, data visualization, three-dial intake, realistic mock content, and mechanical layout preflight [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/001-corpus-research/research/gap-analysis.md:14].
- Live inventory shows `interface` is already reference-rich and aesthetics-aware but has no assets [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:156]. `foundations`, `motion`, and `audit` each have five focused references and no assets [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:269], [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:289], [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:312]. `md-generator` already has the heaviest reference and asset surface [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:86].
- resource-map.md not present at spec init; local lineage emits an evidence-derived `resource-map.md`.

## Key Questions

- [x] What is the live references/assets inventory per mode?
- [x] Which prior corpus gaps still translate into reference or asset additions without reopening architecture?
- [x] Which additions are highest leverage for each existing mode?
- [x] What should explicitly not be added in this follow-up?
- [x] What sequence should a gated implementation follow?

## Answered Questions

- Live inventory and gaps are summarized in `research.md` and `resource-map.md`.
- Expansion recommendations are constrained to existing mode owners.
- Asset recommendations are intentionally small prompt/checklist cards, not large new workflows.

## What Worked

- Starting from current mode reference lists avoided duplicate recommendations.
- Treating `gap-analysis.md` as a severity seed and revalidating against current mode ownership kept the result focused.
- Separating references from assets exposed a common pattern: references carry durable guidance; assets should package recurring checklists and prompt cards.

## What Failed

- Broad external corpus enumeration created noise. The useful signal came from a small subset of high-specificity docs already highlighted by prior research.
- New-child recommendations from prior phases were intentionally excluded because this phase is reference/asset expansion only.

## Exhausted Approaches

- Do not add process-lifecycle references from `designer-skills-main`; prior gap analysis classifies that as a scope ruling, not a content gap [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/001-corpus-research/research/gap-analysis.md:28].
- Do not add canvas/poster or slide-design workflow material to the five existing modes unless a later scope ruling brings presentation into the family [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/001-corpus-research/research/gap-analysis.md:28].
- Do not add extraction-backend features to `md-generator` for this phase; its highest gap is forward authoring/brief-to-style-reference, not measured extraction [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:42].

## Ruled-Out Directions

- Net-new sub-skills.
- Architecture or taxonomy changes.
- Direct implementation of the recommended references or assets.
- CLI or tool workflow changes.

## Next Focus

Synthesis is complete. Next phase should implement only the approved rows from `research.md`, starting with shared register and mechanical preflight assets.
