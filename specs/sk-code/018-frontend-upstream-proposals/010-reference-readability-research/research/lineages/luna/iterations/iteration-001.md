# Iteration 1: Hub and Shared References

## Focus

Audit the sk-code hub entry points and shared references against the sk-doc skill and reference-template guidance.

## Actions Taken

- Rechecked the lineage steer file before the iteration; it was absent.
- Confirmed the reference and asset inventory contains 99 Markdown files. A pattern scan of the hub and shared references found no confirmed bold-label joins, setext headings, OVERVIEW AND headings or bare URLs. The scan excluded frontmatter and fenced examples.
- The workflow pre-init branch would append research context to the packet spec, outside this lineage. I skipped that mutation because the packet scope says the only writes are under the phase folder and the dispatcher further bound writes to Luna. The run-opening event payload was kept inside the lineage instead of the workflow command's temporary file under /tmp. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:387] [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:487] [SOURCE: specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research/spec.md:42] [SOURCE: specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research/spec.md:90]

## Findings

1. The hub's WHEN TO USE section contains two navigation tables, a repeated surface list and implement/debug/verify workflow instructions. The sk-create-skill contract limits this section to activation triggers, use cases and when-not-to-use boundaries, and assigns routing and execution detail to SMART ROUTING and HOW IT WORKS. [SOURCE: .skilled/skills/sk-code/SKILL.md:32] [SOURCE: .skilled/skills/sk-code/SKILL.md:47] [SOURCE: .skilled/skills/sk-code/SKILL.md:56] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/SKILL.md:80] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/SKILL.md:81] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md:455]

2. The shared references vary from the sk-doc overview sequence. workflow-implement.md, workflow-debug.md and code-quality-standards.md place Core Principle before When to Use. workflow-verify.md places its Iron Law before When to Use. The reference template's example orders Purpose, When to Use and Core Principle. [SOURCE: .skilled/skills/sk-code/shared/references/workflow-implement.md:22] [SOURCE: .skilled/skills/sk-code/shared/references/workflow-implement.md:26] [SOURCE: .skilled/skills/sk-code/shared/references/workflow-implement.md:30] [SOURCE: .skilled/skills/sk-code/shared/references/workflow-debug.md:22] [SOURCE: .skilled/skills/sk-code/shared/references/workflow-debug.md:26] [SOURCE: .skilled/skills/sk-code/shared/references/workflow-debug.md:30] [SOURCE: .skilled/skills/sk-code/shared/references/workflow-verify.md:22] [SOURCE: .skilled/skills/sk-code/shared/references/workflow-verify.md:26] [SOURCE: .skilled/skills/sk-code/shared/references/workflow-verify.md:32] [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:23] [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:27] [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:31] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:100] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:103] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:108]

## Questions Answered

None fully. The findings confirm a content-placement issue in the hub and a repeated overview-order mismatch in shared references.

## Questions Remaining

- Which rendering defects occur in each sk-code area, and where are they visible?
- Which references and assets diverge from their respective template structure or place content poorly?
- Which section and item sequences follow authoring history instead of a reader task?
- Why did the templates, authoring guidance and validator miss each defect class?
- Which fixes belong in templates, guidance or validation, and which checks can run mechanically?

## Sources Consulted

- .skilled/skills/sk-code/SKILL.md:28
- .skilled/skills/sk-code/ROUTER.md:22
- .skilled/skills/sk-code/shared/references/workflow-implement.md:22
- .skilled/skills/sk-code/shared/references/workflow-debug.md:22
- .skilled/skills/sk-code/shared/references/workflow-verify.md:22
- .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:21
- .skilled/skills/sk-code/shared/references/phase-detection.md:20
- .skilled/skills/sk-code/shared/references/stack-detection.md:20
- .skilled/skills/sk-code/shared/references/universal/rule-overrides.md:21
- .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:98
- .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md:451
- .skilled/skills/sk-doc/sk-create-skill/SKILL.md:80
- specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research/spec.md:42

## Assessment

The hub placement issue is directly checkable against the authoring contract. The shared overview sequence is mechanically detectable, but whether the exact order improves navigation remains an authoring judgment.

## Reflection

The template provides an example sequence, but the authoring contract is clearer about the WHEN TO USE boundary than about the order of every overview subsection. The audit should separate strict placement rules from preferred ordering.

## Recommended Next Focus

Audit the sk-code-ci router, skill contract, references and workflow asset for content placement, section order and rendering candidates.
