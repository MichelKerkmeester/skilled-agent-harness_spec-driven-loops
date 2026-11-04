# Iteration 2: CI Surface References and Assets

## Focus

Audit the sk-code-ci skill, router, references and assets for duplicated or misplaced content and reader-oriented order, comparing the Markdown structure with the sk-doc reference and asset templates.

## Actions Taken

- Rechecked the lineage steer file before the iteration; it was absent.
- Read the CI surface SKILL.md and ROUTER.md, the four owned rule references, three assets, the reference template and the asset template. The shared workflow doctrine references are aliases already reviewed in iteration 1.
- Scanned the CI Markdown files for post-frontmatter setext candidates, consecutive standalone bold-label lines, bare URLs and empty OVERVIEW sections. The initial empty-overview candidates came from the scanner stopping at H3 headings and were discarded after checking the source; no confirmed instance of those rendering defects was found in this pass.
- The workflow graph-convergence command persists a snapshot using the packet spec folder. I skipped it because the user bound writes to this lineage; the max-iterations policy makes convergence a telemetry step before the cap. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:759] [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:776] [SOURCE: specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research/spec.md:42] [SOURCE: specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research/spec.md:90]

## Findings

1. Two CI references repeat their main list of topics in the intro and the immediately following OVERVIEW: job-shape-rules.md lists timeout, permissions, concurrency, setup and switch in both places; trigger-and-filter-rules.md lists events, paths, rebuild commits and exceptions in both places. The reference template separates intro summary from overview content, and the asset guidance explicitly says not to duplicate between them. [SOURCE: .skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md:17] [SOURCE: .skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md:23] [SOURCE: .skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md:16] [SOURCE: .skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md:22] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:136] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:145] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md:174]
2. The CI router's OVERVIEW is a long paragraph that includes the detailed CI_WORKFLOW trigger list, four-reference map, default resource and no-match behavior; the next INTENT MODEL section repeats the signal list and resource map. Keep the overview at orientation level and reserve the exact trigger and ordered resource declaration for the intent section. [SOURCE: .skilled/skills/sk-code/sk-code-ci/ROUTER.md:23] [SOURCE: .skilled/skills/sk-code/sk-code-ci/ROUTER.md:25] [SOURCE: .skilled/skills/sk-code/sk-code-ci/ROUTER.md:33]

## Questions Answered

None fully. This pass adds confirmed CI examples for the reference and asset structure question.

## Questions Remaining

- Which rendering defects occur in each sk-code area, and where are they visible?
- Which references and assets diverge from their respective template structure or place content poorly?
- Which section and item sequences follow authoring history instead of a reader task?
- Why did the templates, authoring guidance and validator miss each defect class?
- Which fixes belong in templates, guidance or validation, and which checks can run mechanically?

## Sources Consulted

- .skilled/skills/sk-code/sk-code-ci/SKILL.md:28
- .skilled/skills/sk-code/sk-code-ci/ROUTER.md:21
- .skilled/skills/sk-code/sk-code-ci/ROUTER.md:23
- .skilled/skills/sk-code/sk-code-ci/ROUTER.md:33
- .skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md:20
- .skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md:17
- .skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md:21
- .skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md:16
- .skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md:20
- .skilled/skills/sk-code/sk-code-ci/references/protected-set.md:21
- .skilled/skills/sk-code/sk-code-ci/assets/workflow-template.yml:4
- .skilled/skills/sk-code/sk-code-ci/assets/job-block-template.yml:2
- .skilled/skills/sk-code/sk-code-ci/assets/ci-profile.template.json:1
- .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:136
- .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md:174
- .skilled/commands/deep/assets/deep-research-auto.yaml:759
- .skilled/commands/deep/assets/deep-research-auto.yaml:776
- specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research/spec.md:42

## Assessment

The repeated topic inventories are directly visible and template guidance supports keeping the intro and overview distinct. A validator could detect exact repeated phrases and repeated item sequences, but deciding whether an overview genuinely adds new information still needs editorial judgment. The CI router repeats its trigger/resource declaration across prose and the machine-readable intent section; the next validator review should establish whether that duplication is in scope for linting or belongs in authoring guidance.

## Reflection

This CI surface has no confirmed rendering break from the scanned classes. Its clearest problems are semantic repetition at the start of reference and router files, which can survive a syntax-only Markdown validator.

## Recommended Next Focus

Audit sk-code-frontend references, assets, SKILL.md and ROUTER.md for rendering defects, duplicate content and task-order mismatches.
