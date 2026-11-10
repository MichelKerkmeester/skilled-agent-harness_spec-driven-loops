---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Audit every reference and asset under .skilled/skills/sk-code/ (hub shared/, sk-code-ci, sk-code-frontend, sk-code-quality, sk-code-review, sk-code-skilled, plus their SKILL.md and ROUTER.md) for readability, structure, layout and the sort order of sections and items inside each file, against the sk-doc reference and asset templates (.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md and skill-asset-template.md). Find rendering defects (consecutive bold-label lines that Markdown joins into one paragraph, a text line directly above --- that renders as a setext heading, 'OVERVIEW AND <topic>' sections with no overview, duplicated or misplaced content, bare URLs, items ordered by authoring history instead of reader task). Then trace why .skilled/skills/sk-doc/sk-create-skill (templates, authoring guidance, scripts) and .skilled/skills/sk-doc/scripts/validate_document.py let such defects pass (the pre-fix web-cascade-and-selectors.md at commit cd00629166 validated VALID with 0 issues), and propose template, guidance and validator changes that would catch each defect class, saying which are mechanically checkable. Read-only: write only under the research artifact directory. Cite file:line for every finding.
- Started: 2026-11-03T21:45:56Z
- Status: COMPLETE
- Iteration: 8 of 8
- Session ID: fanout-deepseek-1793742315296-80sid6
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Template contract and hub root files | - | 0.80 | 5 | complete |
| 2 | sk-code-ci reference and asset family | - | 0.85 | 4 | complete |
| 3 | sk-code-frontend references and the pre-fix cascade control | - | 0.75 | 8 | complete |
| 4 | sk-code-quality references | - | 0.80 | 4 | complete |
| 5 | sk-code-review references and assets | - | 0.80 | 4 | complete |
| 6 | sk-code-skilled references and checklist assets | - | 0.70 | 5 | complete |
| 7 | Validator and guidance gap trace | - | 0.90 | 6 | complete |
| 8 | Template, guidance and validator changes | - | 0.85 | 9 | complete |

- iterationsCompleted: 8
- keyFindings: 45
- openQuestions: 0
- resolvedQuestions: 8

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 8/8
- [x] What section-order and container contract does the sk-doc skill-reference template define, and how do the hub SKILL.md, hub ROUTER.md and shared/ references diverge from it?
- [x] Which sk-code-ci references and assets violate heading shape, section order or item order, and at which exact lines?
- [x] Which sk-code-frontend references, including web-cascade-and-selectors.md, carry the enumerated rendering defects, and at which exact lines?
- [x] Which sk-code-quality references carry the enumerated rendering defects or structural divergence, and at which exact lines?
- [x] Which sk-code-review references and assets carry the enumerated rendering defects or structural divergence, and at which exact lines?
- [x] Which sk-code-skilled references and checklist assets carry the enumerated defects, and is the divergence systematic across a file family?
- [x] Why do the sk-doc templates, authoring guidance and validate_document.py fail to detect each defect class, traced check by check?
- [x] Which template, guidance and validator changes would catch each defect class, and which are mechanically checkable at what precision?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▅▅▆▆▅▃▃▄▄▅▅▄▃▂▂▅▇█▇▆
- score sparkline: ▅▅▆▆▅▃▃▄▄▅▅▄▃▂▂▅▇█▇▆
- Last 3 ratios: 0.70 -> 0.90 -> 0.85
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.85
- coverageBySources: {"code":42,"other":29}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- A purely regex-driven "authoring order" detector: section order can only be judged against a named reader task, so this iteration compares sibling files against each other and the template rather than inventing a universal order. (iteration 1)
- Treating `## Rule overrides` in `rule-overrides.md:51` as a stray heading: it sits inside a fenced example, and the fence-aware scan correctly excluded it. (iteration 1)
- Treating every `firstH2NotOverview` hit on a `SKILL.md` as a template violation: skill bodies follow a different template, so only reference and asset files were scored against the reference/asset contract. (iteration 1)
- Treating long prose lines as rendering defects: they wrap in rendered Markdown, so they were recorded as a style signal, not a finding. (iteration 1)
- `ci-workflow-standards.md:54` naming `assets/workflow-template.yml` looked like a dangling link, but the asset exists at 81 lines, so it is a valid pointer. (iteration 2)
- Scoring the ci references against the asset template's Purpose/Usage pair: they are references, not assets, so the reference template's Purpose/When to Use pair is the correct baseline. (iteration 2)
- The blank double line before `---` in two references is whitespace noise, not a rendering defect. (iteration 2)
- The three scaffold assets are YAML/JSON, not Markdown; their `#<<...>>` template directives are intentional scaffold syntax rather than rendering defects. (iteration 2)
- Searching for current bare URLs in the frontend references: all nine were repaired in the restructure, so the class is now historical in this family but live elsewhere. (iteration 3)
- Treating `frontend-practice.md:95` and `:102` (`**Layers**`, `**Web topic files**`) as adjacent bold joins: they are separated by blank lines and body text, so they render as separate label paragraphs. (iteration 3)
- Treating the `**Deeper:**` handoff lines in `web-markup-and-css.md` as orphaned labels: each closes a section with a valid link. (iteration 3)
- Treating the current `web-cascade-and-selectors.md` as still defective: the diff shows the bold-label blocks became bullet lists and the bare URLs became named links, so the file now matches the template shape. (iteration 3)
- `quality-config.md:99` looked like a stray unnumbered `## Rule overrides` heading, but it sits inside a fenced markdown example; the fence-aware scan excludes it. (iteration 4)
- Counting `SKILL.md` §8 REFERENCES AND RELATED RESOURCES as misplaced: it is the last section of the skill body, which matches the skill template's expectation. (iteration 4)
- Looking for bare URLs or adjacent bold labels in this family: none at HEAD, because these documents use bullets and tables rather than label paragraphs. (iteration 4)
- Treating the `runner-contract.md` CLI tables as the overview: they are the section content, which is the defect, not evidence that an overview exists. (iteration 4)
- Claiming the three checklist assets lack a closing related section: their tails carry link lists under a related heading, so the omission is specific to `pr-state-dedup.md`. (iteration 5)
- Looking for adjacent bold labels in the review references: the packet uses bullets and tables, so the class is absent here. (iteration 5)
- Treating `quick-reference.md`'s `### Usage` heading as a template violation on its own: the deeper defect is the incomplete table, not the heading name. (iteration 5)
- Treating `review-core.md` §9's long Python resolver as misplaced: it is an executable contract the section names, not unrelated prose. (iteration 5)
- A file-by-file read of all 45 skilled references: the boilerplate and heading signals are dense enough to characterize the family, and reading every rule body would not change the structural verdict. (iteration 6)
- Treating the checklist assets as boilerplate: their Purpose paragraphs are specific (`This split checklist protects DTO, error, panic, unsafe-code ... boundaries`), so the boilerplate is confined to the references. (iteration 6)
- Treating the repeated `### Scope`, `### Exempted Standards` and `### What Still Applies` headings in `security-testing-and-exemptions.md` as duplication: the repeat is deliberate parallel structure for two exemption tiers, and both instances carry distinct content. (iteration 6)
- Treating the same `**Evidence**:` path in `overview-modules-and-docs.md:137` and `:155` as a duplicate paragraph: two different rules cite the same implementation file, which is legitimate shared evidence. (iteration 6)
- "Frontmatter validation catches these files": all ten frontmatter fields are present in the tested files, so the frontmatter path has nothing to report. (iteration 7)
- "The citation-drift advisory would catch it": that advisory checks file-and-line citations and never changes the exit code; it has no URL, adjacency or ordering check. (iteration 7)
- "The validator is disabled for these paths": the explicit `--type reference` run returned a real verdict, not a skip, and `valid: true` came from `blocking_errors == []`. (iteration 7)
- Looking for a hidden link checker under a different rule id: the `reference` rule block has no link or URL key, and the orchestration calls no link function. (iteration 7)
- A cross-file "same purpose sentence" rule as blocking: the rust boilerplate differs by topic word and would need fuzzy matching, which is too imprecise for a blocking gate. (iteration 8)
- A validator rule that rejects every bold-label paragraph: separate label paragraphs are legitimate; only adjacency is a rendering defect. (iteration 8)
- A validator rule that rejects every raw URL: fenced command examples and generated reports can carry them; only unfenced, unlinked prose URLs are the defect. (iteration 8)
- Trying to make "reader-task order" fully mechanical: no static analysis can know the reader's task; monotonic ids and related-last are the only defensible proxies. (iteration 8)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
