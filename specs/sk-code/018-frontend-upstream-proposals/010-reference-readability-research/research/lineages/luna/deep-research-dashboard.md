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
- Started: 2026-11-03T21:52:14Z
- Status: COMPLETE
- Iteration: 7 of 7
- Session ID: fanout-luna-1793742315296-80sid6
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
| 1 | Audit the sk-code hub entry points and shared reference structure against the sk-doc templates. | - | 1.00 | 2 | complete |
| 2 | Audit sk-code-ci skill, router, references and assets for rendering defects, content placement and reader-oriented order against sk-doc templates. | - | 1.00 | 2 | complete |
| 3 | Audit sk-code-frontend skill, router and references for task-oriented order, content placement and Markdown rendering defects. | - | 1.00 | 2 | complete |
| 4 | Audit sk-code-quality skill, router, references and JSON assets for overview structure, task order and template alignment. | - | 1.00 | 2 | complete |
| 5 | Audit sk-code-review skill, router, references and Markdown checklist assets for rendering, content placement and task order. | - | 1.00 | 2 | complete |
| 6 | Audit sk-code-skilled references and assets for rendering, template alignment, placement and reader-task order. | - | 1.00 | 1 | complete |
| 7 | Trace templates, sk-create-skill authoring and packaging guidance, and validate_document.py against the pre-fix CSS reference. | - | 0.80 | 4 | complete |

- iterationsCompleted: 7
- keyFindings: 15
- openQuestions: 5
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/5
- [ ] Which rendering defects occur in each sk-code area, and where are they visible? [legacy-import]
- [ ] Which references and assets diverge from their respective template structure or place content poorly? [legacy-import]
- [ ] Which section and item sequences follow authoring history instead of a reader task? [legacy-import]
- [ ] Why did the templates, authoring guidance and validator miss each defect class? [legacy-import]
- [ ] Which fixes belong in templates, guidance or validation, and which checks can run mechanically? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 5
- [ ] Which rendering defects occur in each sk-code area, and where are they visible?
- [ ] Which references and assets diverge from their respective template structure or place content poorly?
- [ ] Which section and item sequences follow authoring history instead of a reader task?
- [ ] Why did the templates, authoring guidance and validator miss each defect class?
- [ ] Which fixes belong in templates, guidance or validation, and which checks can run mechanically?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █████████████████▅▃▁
- score sparkline: █████████████████▅▃▁
- Last 3 ratios: 1.00 -> 1.00 -> 0.80
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.80
- coverageBySources: {"code":102}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None yet

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
Section and item ordering still needs a reviewer to judge the reader's workflow unless each document family defines a canonical sequence.

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
