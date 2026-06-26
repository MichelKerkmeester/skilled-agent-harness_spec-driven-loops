# Iteration 7: Cross-Mode Assets And Do-Not-Add Rules

## Focus

Identify shared assets and exclusions so follow-up implementation does not sprawl.

## Findings

- Add a shared Brand/Product register first. Prior gap analysis calls it must-add and says it gates transform verbs, model-specific tells, remediation, mock content, and preflight [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/001-corpus-research/research/gap-analysis.md:41].
- Add small reusable assets, not new workflows: `preflight_card.md`, `register_card.md`, `copy_mock_data_card.md`, `motion_failure_card.md`, and `a11y_snippets_card.md`. This fits current modes because the shared base is vocabulary and children own workflow application [SOURCE: .opencode/skills/sk-design/shared/anti_slop_principles.md:24].
- Do not add full process lifecycle. Prior analysis classifies designer-skills process lifecycle as a scope ruling rather than a content gap [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/001-corpus-research/research/gap-analysis.md:28].
- Do not add slides/canvas/poster workflows to these five modes in this phase. The phase spec excludes taxonomy and net-new sub-skills, and prior analysis marks presentation/canvas as scope-ruling territory [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/009-reference-asset-expansion/spec.md:53], [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/001-corpus-research/research/gap-analysis.md:28].

## Sources Consulted

- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/001-corpus-research/research/gap-analysis.md:41`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/001-corpus-research/research/gap-analysis.md:47`
- `.opencode/skills/sk-design/shared/anti_slop_principles.md:24`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/009-reference-asset-expansion/spec.md:53`

## Assessment

- newInfoRatio: 0.31
- Novelty: Medium-low. The main contribution is packaging and exclusion clarity.
- Confidence: High.

## Reflection

What worked: converting gaps into asset names exposed where a shared file avoids duplication.
What failed: there is no evidence that large new asset packs outperform concise cards.
Ruled out: importing all external corpus docs as references.

## Recommended Next Focus

Prioritize all rows and estimate implementation effort.
