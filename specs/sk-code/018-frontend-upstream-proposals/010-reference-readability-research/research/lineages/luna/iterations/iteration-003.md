# Iteration 3: Frontend Reference Order

## Focus

Audit the sk-code-frontend skill and router plus its reference files for reader flow, section and item ordering, duplication and rendering defects. The packet inventory has no assets directory; the shared workflow doctrine aliases were audited in iteration 1.

## Actions Taken

- Rechecked the lineage steer file before the iteration; it was absent.
- Reviewed the frontend README, SKILL.md, ROUTER.md, the nine reference files, and the reference template. A structure scan found no confirmed post-frontmatter setext headings, consecutive standalone bold-label lines, bare URLs or OVERVIEW AND sections without an overview.
- Checked the visible P and I rule-id order against the frontend changelog. P10 appears before P8 and P9 because the changelog says it moved into the interaction section while the image-delivery items stayed under their own reader task. I8 was intentionally removed and I9 retained as a stable id. These are explained content placements, not findings. [SOURCE: .skilled/skills/sk-code/sk-code-frontend/changelog/v1.0.2.0.md:32] [SOURCE: .skilled/skills/sk-code/sk-code-frontend/changelog/v1.0.2.0.md:33] [SOURCE: .skilled/skills/sk-code/sk-code-frontend/changelog/v1.0.2.0.md:39]
- The graph-convergence command persists a snapshot against the packet spec folder, outside the bound lineage. I skipped that telemetry step; the configured max-iterations policy makes it non-stopping before the cap. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:759] [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:776] [SOURCE: specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research/spec.md:42] [SOURCE: specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research/spec.md:90]

## Findings

1. The frontend SKILL.md places SMART ROUTING last, after Surface Standards and Frontend Overrides. Surface Standards already says to load a topic when its ROUTER condition applies, but the earlier Reference Map does not link to ROUTER.md and the later SMART ROUTING section is where the reader is told to open it. The sk-create-skill section guidance places SMART ROUTING immediately after WHEN TO USE, before later workflow and rules sections. [SOURCE: .skilled/skills/sk-code/sk-code-frontend/SKILL.md:25] [SOURCE: .skilled/skills/sk-code/sk-code-frontend/SKILL.md:43] [SOURCE: .skilled/skills/sk-code/sk-code-frontend/SKILL.md:47] [SOURCE: .skilled/skills/sk-code/sk-code-frontend/SKILL.md:63] [SOURCE: .skilled/skills/sk-code/sk-code-frontend/SKILL.md:69] [SOURCE: .skilled/skills/sk-code/sk-code-frontend/SKILL.md:71] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md:451] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md:502]
2. The Figma check defines its five passes and final verdict before explaining which Figma-side transport can run them. Its preceding workflow step sends readers forward to the tool ladder, while that ladder appears only after the verdict; the tool-specific coverage matrix and capture mechanics come later still. Put the transport choice before the pass procedure so the reader can select a viable path before executing it. [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md:88] [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md:111] [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md:122] [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md:133] [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md:137] [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md:144] [SOURCE: .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md:159]

## Questions Answered

None fully. The frontend skill and Figma reference add new examples for reader-oriented section sequencing.

## Questions Remaining

- Which rendering defects occur in each sk-code area, and where are they visible?
- Which references and assets diverge from their respective template structure or place content poorly?
- Which section and item sequences follow authoring history instead of a reader task?
- Why did the templates, authoring guidance and validator miss each defect class?
- Which fixes belong in templates, guidance or validation, and which checks can run mechanically?

## Sources Consulted

- .skilled/skills/sk-code/sk-code-frontend/README.md:16
- .skilled/skills/sk-code/sk-code-frontend/SKILL.md:17
- .skilled/skills/sk-code/sk-code-frontend/SKILL.md:25
- .skilled/skills/sk-code/sk-code-frontend/SKILL.md:43
- .skilled/skills/sk-code/sk-code-frontend/SKILL.md:69
- .skilled/skills/sk-code/sk-code-frontend/ROUTER.md:18
- .skilled/skills/sk-code/sk-code-frontend/ROUTER.md:35
- .skilled/skills/sk-code/sk-code-frontend/references/frontend-practice.md:20
- .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md:19
- .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md:86
- .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md:98
- .skilled/skills/sk-code/sk-code-frontend/references/web-accessibility-patterns.md:8
- .skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md:8
- .skilled/skills/sk-code/sk-code-frontend/references/web-elements-and-attributes.md:8
- .skilled/skills/sk-code/sk-code-frontend/references/web-internationalization.md:116
- .skilled/skills/sk-code/sk-code-frontend/references/web-layout-and-sizing.md:8
- .skilled/skills/sk-code/sk-code-frontend/references/web-markup-and-css.md:8
- .skilled/skills/sk-code/sk-code-frontend/references/web-performance-and-loading.md:111
- .skilled/skills/sk-code/sk-code-frontend/changelog/v1.0.2.0.md:32
- .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md:100
- .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md:451
- .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md:502
- .skilled/commands/deep/assets/deep-research-auto.yaml:759
- .skilled/commands/deep/assets/deep-research-auto.yaml:776
- specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research/spec.md:42

## Assessment

The skill's route-after-use sequence is a checkable section-order and dependency issue. The Figma procedure's transport-after-verdict sequence needs a reader-task judgment; it is not a generic Markdown syntax rule. Numbering anomalies in the performance and internationalization files are explained by documented moves and stable identifiers, so numeric sort alone would create false positives.

## Reflection

This packet shows why validators need separate structural and editorial checks: heading order and missing route links are mechanically discoverable, while deciding when a procedure should expose tool choice requires the authoring task model.

## Recommended Next Focus

Audit sk-code-quality references and assets, then compare their checklists and section order with the sk-doc reference and asset templates.
