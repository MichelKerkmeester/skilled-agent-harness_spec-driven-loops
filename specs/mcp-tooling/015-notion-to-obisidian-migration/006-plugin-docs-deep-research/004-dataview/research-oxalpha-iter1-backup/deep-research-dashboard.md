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
- Topic: Optimize the mcp-obsidian dataview file-layer reference docs for AI operation. Research the real plugin (repo blacksmithgu/obsidian-dataview, docs) for DQL and DataviewJS query patterns, frontmatter and inline-field conventions, and common gotchas most relevant to an AI authoring queries against migrated notes. Recommend concrete additions or updates to references/plugins/dataview/.
- Started: 2026-08-22T14:31:20Z
- Status: INITIALIZED
- Iteration: 1 of 4
- Session ID: dr-004-dataview-1787409080
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Inventory references/plugins/dataview/* and gap-baseline it against the official documented DQL surface (KQ1 + KQ5) | - | 1.00 | 9 | complete |

- iterationsCompleted: 1
- keyFindings: 9
- openQuestions: 5
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/5
- [ ] KQ1: Which DQL query patterns (TABLE/LIST/TASK/CALENDAR plus FROM/WHERE/SORT/GROUP BY/FLATTEN/LIMIT clauses) must `references/plugins/dataview/*` document so an AI authors valid queries against migrated notes, and what syntax gotchas apply? [legacy-import]
- [ ] KQ2: Which DataviewJS APIs (`dv.pages`/`dv.pagePaths`/`dv.page`, `dv.table`/`dv.list`/`dv.task`, renderers, `dv.el`/`dv.paragraph`/`dv.span`, `dv.luxon`/`dv.date`) are essential for AI-authored embedded views, and how do they differ from DQL? [legacy-import]
- [ ] KQ3: What frontmatter and inline-field conventions (field types, coercion rules, dates, links, lists, tags/aliases, inline fields in tasks/lists) does Dataview index, and which matter most when notes are migrated from Notion? [legacy-import]
- [ ] KQ4: What common failure modes and gotchas (null/missing fields, type coercion mismatches, date math, source/path scoping, metadata cache staleness, DQL-vs-DataviewJS differences) most often break AI-authored queries? [legacy-import]
- [ ] KQ5: What concrete additions, updates, or new documents should be made to `references/plugins/dataview/*` to close these gaps against the current file inventory? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 5
- [ ] KQ1: Which DQL query patterns (TABLE/LIST/TASK/CALENDAR plus FROM/WHERE/SORT/GROUP BY/FLATTEN/LIMIT clauses) must `references/plugins/dataview/*` document so an AI authors valid queries against migrated notes, and what syntax gotchas apply?
- [ ] KQ2: Which DataviewJS APIs (`dv.pages`/`dv.pagePaths`/`dv.page`, `dv.table`/`dv.list`/`dv.task`, renderers, `dv.el`/`dv.paragraph`/`dv.span`, `dv.luxon`/`dv.date`) are essential for AI-authored embedded views, and how do they differ from DQL?
- [ ] KQ3: What frontmatter and inline-field conventions (field types, coercion rules, dates, links, lists, tags/aliases, inline fields in tasks/lists) does Dataview index, and which matter most when notes are migrated from Notion?
- [ ] KQ4: What common failure modes and gotchas (null/missing fields, type coercion mismatches, date math, source/path scoping, metadata cache staleness, DQL-vs-DataviewJS differences) most often break AI-authored queries?
- [ ] KQ5: What concrete additions, updates, or new documents should be made to `references/plugins/dataview/*` to close these gaps against the current file inventory?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
- score sparkline: ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
- Last 3 ratios: 1.00
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 1.00
- coverageBySources: {"blacksmithgu.github.io":2,"code":1,"other":4}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- `.claude/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/` as the audit target: path does not exist in this repo; the live tree is under `.opencode/`. All later iterations should use the `.opencode/` path. (iteration 1)
- None. No approach was exhausted this iteration. (iteration 1)

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
Follow up on: **Bracket inline-field syntax `[key:: value]` inside tasks/list items is absent from the local metadata docs** - surfaced by the official nav entry "Metadata on Tasks and Lists"; directly relevant to TASK queries agai...

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
