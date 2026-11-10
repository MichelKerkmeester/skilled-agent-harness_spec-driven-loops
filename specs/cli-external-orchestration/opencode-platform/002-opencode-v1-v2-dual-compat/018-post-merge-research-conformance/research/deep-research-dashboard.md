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
- Topic: Where do the code and docs changed by the four branches merged to main on 2026-10-19 (OpenCode dual compatibility, the Pi fast-mode copy claim, worktree provisioning, the adapter suite runner) miss the sk-code-skilled and sk-doc contracts
- Started: 2026-10-19T19:09:15.446Z
- Status: INITIALIZED
- Iteration: 2 of 2
- Session ID: 2026-10-19T19:09:15.446Z
- Parent Session: 2026-10-19T18:32:11.270Z
- Lifecycle Mode: restart
- Generation: 2
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | A28 sk-code-skilled conformance: which code files changed by the four branches merged to main on 2026-10-19 miss the sk-code-skilled contract (headers, dividers, naming, comment hygiene, error handling, test coverage) | - | 0.95 | 0 | insight |
| 2 | A29 sk-doc conformance: which docs changed by the four branches merged to main on 2026-10-19 miss their sk-doc mode? List the changed .md files outside specs/ with git log --name-only over the merge commits fe1f8a9a53, 8e8e95e8e6, 6358d81eba and their branch commits (cli-opencode references, .opencode/plugins/README.md, sk-vision hooks README, doctor command docs, .pi/extensions/pi-fast-mode-w-subagent-support/README.md and its src/tests READMEs, sk-git references, SECURITY.md). Load .skilled/skills/sk-doc/SKILL.md, route each doc to its mode, and run the mode's validator (for example validate_document.py) read-only. Also check the README test counts and claims against the current code. Output: a per-doc conformance table with validator output, file:line and severity. Check: validators read-only; never edit files outside this research packet. | - | 0.90 | 0 | insight |

- iterationsCompleted: 2
- keyFindings: 7
- openQuestions: 1
- resolvedQuestions: 1

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 1/2
- [x] Which changed code files miss sk-code-skilled, and how?
- [ ] Which changed docs miss their sk-doc mode, and how? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 1
- [ ] Which changed docs miss their sk-doc mode, and how?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ██▇▇▇▆▆▅▅▅▄▄▄▃▃▂▂▂▁▁
- score sparkline: ██▇▇▇▆▆▅▅▅▄▄▄▃▃▂▂▂▁▁
- Last 3 ratios: 0.95 -> 0.90
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.90
- coverageBySources: {}
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
None carried. This is the final iteration of the run.

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
