# Iteration 5: Review References and Checklist Assets

## Focus

Audit sk-code-review's SKILL.md, ROUTER.md, four references and six Markdown checklist assets for readability, structure, rendering defects and order of review tasks.

## Actions Taken

- Rechecked the lineage steer file before the iteration; it was absent.
- Reviewed the review skill and router, all four references, and all six checklist assets. The rendering scan found no confirmed post-frontmatter setext headings, bare URLs or OVERVIEW AND headings. Consecutive bold labels detected in two files are separate Markdown list items, not paragraph joins.
- Compared asset intros with their OVERVIEW sections. The fix-completeness asset repeats its central inventory in both blocks; the other asset intros differ from the detailed Purpose and Usage content.
- The graph-convergence step persists a snapshot outside the lineage under the packet spec folder. I skipped it within the write boundary; max-iterations makes convergence telemetry non-stopping before the cap. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:759] [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:776] [SOURCE: specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research/spec.md:42] [SOURCE: specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research/spec.md:90]

## Findings

1. fix-completeness-checklist.md repeats its entire central inventory in the post-title intro and the Purpose subsection: both list same-class producers, consumers, changed algorithms, matrix coverage and hostile runtime state. The asset template explicitly says the intro is a hook and OVERVIEW provides details. [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/fix-completeness-checklist.md:17] [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/fix-completeness-checklist.md:19] [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/fix-completeness-checklist.md:23] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md:174] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md:175]
2. The review skill puts PR-state efficiency gates in section 9, after Related Resources, even though M-1 can skip redundant analysis and M-2 can skip a full review. Their decision belongs before the review phases that they may bypass; the current placement puts skip rules after the reader has traversed scope, analysis, output, references and integration. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:63] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:97] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:132] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:324] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:342] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:346] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:363] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:372] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:397] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:404]

## Questions Answered

None fully. This pass adds a direct asset intro/overview duplication and a review-gate placement issue.

## Questions Remaining

- Which rendering defects occur in each sk-code area, and where are they visible?
- Which references and assets diverge from their respective template structure or place content poorly?
- Which section and item sequences follow authoring history instead of a reader task?
- Why did the templates, authoring guidance and validator miss each defect class?
- Which fixes belong in templates, guidance or validation, and which checks can run mechanically?

## Sources Consulted

- .skilled/skills/sk-code/sk-code-review/SKILL.md:14
- .skilled/skills/sk-code/sk-code-review/SKILL.md:46
- .skilled/skills/sk-code/sk-code-review/SKILL.md:63
- .skilled/skills/sk-code/sk-code-review/SKILL.md:97
- .skilled/skills/sk-code/sk-code-review/SKILL.md:132
- .skilled/skills/sk-code/sk-code-review/SKILL.md:262
- .skilled/skills/sk-code/sk-code-review/SKILL.md:324
- .skilled/skills/sk-code/sk-code-review/SKILL.md:342
- .skilled/skills/sk-code/sk-code-review/ROUTER.md:21
- .skilled/skills/sk-code/sk-code-review/ROUTER.md:31
- .skilled/skills/sk-code/sk-code-review/references/review-core.md:10
- .skilled/skills/sk-code/sk-code-review/references/review-ux-single-pass.md:8
- .skilled/skills/sk-code/sk-code-review/references/pr-state-dedup.md:4
- .skilled/skills/sk-code/sk-code-review/references/quick-reference.md:8
- .skilled/skills/sk-code/sk-code-review/assets/security-checklist.md:21
- .skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md:21
- .skilled/skills/sk-code/sk-code-review/assets/solid-checklist.md:8
- .skilled/skills/sk-code/sk-code-review/assets/removal-plan.md:8
- .skilled/skills/sk-code/sk-code-review/assets/test-quality-checklist.md:21
- .skilled/skills/sk-code/sk-code-review/assets/fix-completeness-checklist.md:17
- .skilled/skills/sk-code/sk-code-review/assets/fix-completeness-checklist.md:23
- .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md:174
- .skilled/commands/deep/assets/deep-research-auto.yaml:759
- .skilled/commands/deep/assets/deep-research-auto.yaml:776
- specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research/spec.md:42

## Assessment

The fix-completeness duplication is mechanically discoverable as repeated introductory text, although semantic overlap checks should flag candidates for review rather than reject automatically. The PR-state gate placement needs the workflow dependency: a skip decision must be available before the stages it can bypass, so a generic heading-order lint cannot prove it.

## Reflection

The checklist assets mostly separate short intros from their operational detail. Review-specific optimization controls are important enough to affect whether a review runs at all, so their late placement obscures an early decision.

## Recommended Next Focus

Audit sk-code-skilled references, checklists, assets and routing entry points, focusing on recurring render defects and long guidance ordering.
