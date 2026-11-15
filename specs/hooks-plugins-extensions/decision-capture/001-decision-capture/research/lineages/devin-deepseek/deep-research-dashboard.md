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
- Topic: Three open gaps in operator decision capture: routing words for decision requests, per-project scoping of the shared state folder, and reducing model judgment for chat answers
- Started: 2026-11-03T08:36:56.698Z
- Status: COMPLETE
- Iteration: 4 of 5
- Session ID: fanout-devin-deepseek-1793694885417-825i4p
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: converged

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Where a decision request should route | - | 0.88 | 8 | complete |
| 2 | Scoping the shared decision-capture state folder | - | 0.86 | 10 | complete |
| 3 | Reducing judgment for chat answers | - | 0.84 | 10 | complete |
| 4 | Ownership, sequencing and interaction of the three fixes | - | 0.72 | 10 | complete |

- iterationsCompleted: 4
- keyFindings: 38
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Which routing surface decides that "record my chat reply as a decision" belongs to a skill, and what is the smallest metadata change that makes it route without stealing another skill's prompts?
- [x] Which packet should own the routing-vocabulary change, given that 043's goal D1 limits its children to the decision-capture pipeline, the writer or the save step?
- [x] What is the smallest correct scoping fix that keeps linked projects' queues, consumed log and orphan scan separate when `.skilled` is symlinked whole into each project?
- [x] Can a deterministic or cheaper check reduce the saving model's judgment for chat candidates without auto-accepting a non-answer, and what must it reject per ADR-002's probe?
- [x] Do the three fixes interact, and what order and verification cost do they imply?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ████▇▇▇▇▇▇▇▆▆▆▅▄▃▃▂▁
- score sparkline: ████▇▇▇▇▇▇▇▆▆▆▅▄▃▃▂▁
- Last 3 ratios: 0.86 -> 0.84 -> 0.72
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.72
- coverageBySources: {"other":59}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **A new child under 043.** Parent goal D1 limits every 043 child to the decision-capture pipeline, the writer or the save step; routing metadata is none of those, and 007's Known Limitations already calls the advisor metadata "another artifact". (iteration 1)
- **Adding a bare `decision` keyword to `system-spec-kit/SKILL.md`.** It would fire on every prompt that mentions a decision, and `sk-design` already owns "decision tree", "colour decision" and "color decision" signals. The keyword pass weights a single keyword at 1.0 while a three-word signal reaches 1.6, so the broad keyword is both weaker and more likely to steal. (iteration 1)
- **Adding the exact sentence "record my chat reply as a decision" as a signal.** It fixes one phrasing and nothing adjacent, and the phrase-boundary rule would still miss "record this as a decision". (iteration 1)
- **Relying on `PHRASE_INTENT_BOOSTERS`.** It is a hard-coded code map; a metadata signal is the smaller change and the one 031 used for the same class of gap. (iteration 1)
- Looking for a `keywords:` frontmatter field on system-spec-kit's SKILL.md: the file carries an HTML `<!-- Keywords: -->` comment, which the frontmatter parser does not read, so editing that comment changes nothing. (iteration 1)
- Searching the trigger index for the phrase: the index is a document-retrieval corpus, not the skill router, so a hit there would not have changed skill selection. (iteration 1)
- **Changing `doctor:symlink` to merge mode or to leave `.skilled/skills/.state` unmirrored.** It cannot help a whole `.skilled` link, it changes every skill's state folder rather than this feature's, and it is outside 043's goal D1. (iteration 2)
- **Keying the folder by project basename.** Two checkouts named `app` would share a folder, which is the same bug with a smaller blast radius. (iteration 2)
- **Moving the queue to a temp directory.** Pending answers must survive a reboot and be found by a later save; a temp path loses them. (iteration 2)
- **Per-row `project` field with read-time filtering only.** It fixes the scan and the consumed log, but it leaves isolation to every present and future reader, and pre-fix rows have no field to filter on. The subdirectory isolates by construction. (iteration 2)
- Looking for a `realpath` trick that keeps the state under the project: the symlink sits inside the project, so every path under it resolves to the checkout. (iteration 2)
- Looking for an existing project identifier in the queue record: records carry runtime, session and tool ids only. (iteration 2)
- **A full local classifier.** It is a larger change than the evidence block, needs training data the packet does not have, and adds a new model surface to a save path that must stay deterministic. (iteration 3)
- **A lexical-overlap threshold as an accept rule.** "yes" answers a yes/no question with zero overlap, and "make it blue" answers "which color?" with zero overlap against the question's words. (iteration 3)
- **Auto-accept a candidate whose reply matches an option label.** It would accept "b" to a product question with options, but it still cannot tell a reply that names an option from one that merely mentions it, and most questions offer no options. (iteration 3)
- **Auto-accept a lone candidate.** ADR-002's probe shows a lone candidate can be an off-topic reply. (iteration 3)
- **Ranking candidates and asking the model only about the top one per reply.** Several candidates can share one reply, so a ranking cut can drop the real answer. (iteration 3)
- Looking for a confidence score on candidates: the detector emits none. (iteration 3)
- Looking for a question-type field: candidates carry only key, kind, question, answer and turn ids. (iteration 3)
- Looking for a save-side deterministic check: the save step is a model instruction, not a script. (iteration 3)
- **A strict real-path containment check as the gap-2 fix.** It would reject every linked project and disable capture there; the token scopes data without refusing the sanctioned install shape. (iteration 4)
- **Landing gap 3 before gap 2.** It would add evidence to candidate payloads while the queue rows they describe may move. (iteration 4)
- **One combined child for gaps 2 and 3 with a single acceptance gate.** It hides two different proofs behind one closure verdict. (iteration 4)
- **Putting gap 1 in a 043 child.** D1 freezes 043 children to the pipeline, writer or save step; routing metadata is none of those, and 031 is the precedent owner. (iteration 4)
- Looking for a graph convergence snapshot path inside the lineage: the tool takes only `--spec-folder` and writes under the packet, outside this lineage. (iteration 4)
- Looking for an existing decision phrase in another skill's signals: none exists, so the collision check is a phrase-overlap check rather than a live routing comparison. (iteration 4)

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
