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
- Topic: Moving the machine router of each of the 16 skills in the AI Systems repository at /Users/michelkerkmeester/MEGA/Development/AI Systems (folder 'AI Systems/', ignore specs/, runtime/, scratch/ and node_modules/) into a sibling ROUTER.md, following this repository's new canon (machine router under a final '## MACHINE ROUTER' heading in ROUTER.md, a link from SKILL.md). Answer RQ-1 to RQ-5 in the spec: per-skill split of routing prose versus machine data with word counts; what loads these skills (opencode.json, .claude/, the Claude Project sync loop in 'AI Systems/z — Claude Project Sync Loop' and its hand-written knowledge files) and whether each loads a sibling file; every check or benchmark gate in that repository that reads a routing section or ROUTER.md, with file:line; the four existing ROUTER.md files against the new canon; a per-skill migration with Claude Project changes, token savings and an order that avoids other sessions' uncommitted edits. Read only in that repository, never open a .env file, write only in this phase's research folder.
- Started: 2026-10-29T11:45:00Z
- Status: COMPLETE
- Iteration: 3 of 3
- Session ID: fanout-deepseek-1793273952691-3ci03m
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
| 1 | RQ-1: per-skill split of routing prose versus machine data, with word counts, across the 16 AI Systems SKILL.md files | router-inventory | 1.00 | 10 | complete |
| 2 | RQ-2 loaders and RQ-3 gates: what reads SKILL.md, what reads a sibling ROUTER.md, and which checks break when a routing section moves | loaders-and-gates | 1.00 | 15 | complete |
| 3 | RQ-4 the four existing ROUTER.md files against the canon and RQ-5 the per-skill migration, Project changes, token saving and order | migration-design | 1.00 | 13 | complete |

- iterationsCompleted: 3
- keyFindings: 38
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] RQ-1: For each of the 16 skills, which parts of its routing section are agent-facing prose and which are machine data (assignment blocks, pseudocode, resource lists), and what is the word count of each part?
- [x] RQ-2: What loads these skills (OpenCode through opencode.json, Claude Code through .claude/, the Claude Project sync loop in 'AI Systems/z - Claude Project Sync Loop' and its hand-written knowledge files, and any other runtime), and does each loader load a file beside SKILL.md on its own?
- [x] RQ-3: Which check, benchmark gate or script in the AI Systems repository reads a SKILL.md routing section or a ROUTER.md, with file:line, and which of this repository's tools (package_skill.py, the router resolver) apply there?
- [x] RQ-4: How does each of the four existing ROUTER.md files classify against the new canon, and what does each need?
- [x] RQ-5: What is the per-skill migration design: target shape per skill, Claude Project knowledge-file changes, token saving per skill, and the order that avoids colliding with other sessions working in that repository?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
- score sparkline: ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
- Last 3 ratios: 1.00 -> 1.00 -> 1.00
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 1.00
- coverageBySources: {"code":23,"other":11}
- WARNING event: novelty_signal_inert metric=newInfoRatio run=3 window=3 sparkline=▄▄▄ — newInfoRatio held flat at 1 across 3 iterations — the novelty signal is uninformative, so convergence and "not exhausted" claims derived from it are untrustworthy.
- Advisory event: trend_flatline metric=score run=3 window=3 sparkline=▄▄▄

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Counting routing words with `wc -w` over the raw section. It inflates fenced blocks and tables, because punctuation and markdown markers collapse into fewer tokens than my tokenizer produces: `wc -w` reads 8,213 words for `sk-barter-copywriter` while the tokenizer reads 8,018 for the whole file. Rejected in favour of one consistent tokenizer, and the rule is stated above so phase 008 can reproduce the numbers. (iteration 1)
- Reading `### Executable Contract` as a machine-data marker. In `sk-barter-copywriter` (line 232), `sk-barter-deal-templates` (line 115) and `sk-media-editor` (line 126) that heading holds plain prose describing the contract, not the contract itself. A heading-name heuristic would misclassify all three. (iteration 1)
- Treating the whole `SKILL.md` as "the routing section". The spec's measured behavior anchors on `## .*SMART ROUTING`, and every other section (WHEN TO USE, RULES, RESOURCES, DELIVERY) is skill content that the move must not touch. (iteration 1)
- Assuming `.claude/skills` or `.opencode/skills` holds the 16 project skills. Both are symlinks into `Code_Environment/Public` and hold the same 17 shared skills; the project skills are reached only by `Commands/agent-router.md`. (iteration 2)
- Assuming a packaging script will rewrite a Claude Project from the skill source. `AGENTS.md` section 5 retires the compiler and forbids a manifest, lock or checksum, so the Project update is a hand edit or a recorded "no change needed". (iteration 2)
- Reading the AI Systems `specs/` harnesses (`AI Systems/Sales - HubSpot & Automation/specs/.../harness.py`, `AI Systems/Barter - Deal Templates/specs/.../harness.py`) as live gates. They live under `specs/`, which the topic excludes, and the replay is kept under `benchmark/`. (iteration 2)
- Searching for a skill loader in `opencode.json`. There is no skill key to extend, so the only way a sibling router reaches a runtime is the `SKILL.md` pointer and the agent's own follow-the-link behaviour. (iteration 2)
- Giving every Claude Project the repository's `ROUTER.md` verbatim. Product Owner's router is 1,229 words and `sk-moneybird-accountant`'s is 2,435, which would move cost into every Project retrieval rather than cut it; the residency class work in iteration 2 already shows that shape being rejected by hand. (iteration 3)
- Looking for an existing Project routing doc to extend. There is none, so the first one is an authoring decision and belongs in phase 008's plan rather than a find-and-replace. (iteration 3)
- Migrating Product Owner first because it is the most visible. Its commit cadence (daily) and its packet gate make it the worst first target. (iteration 3)
- Renaming `## 2. SMART ROUTING` to `## MACHINE ROUTER` in place. It leaves prose inside the machine section (finding 4) and, for Product Owner, leaves two sections after it (finding 3). (iteration 3)

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
