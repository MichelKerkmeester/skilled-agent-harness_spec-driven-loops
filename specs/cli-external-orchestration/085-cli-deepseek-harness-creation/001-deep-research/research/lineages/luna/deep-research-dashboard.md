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
- Topic: DeepSeek Harness (dsh, github.com/deepseek-ai/deepseek-harness, installed 0.2.2-rc.1) as a new cli-external-orchestration runtime mode that mirrors cli-pi: headless dispatch contract, providers (LLM Gateway and OpenCode Go DeepSeek V4.1 Flash), repo-local runtime folder, skills, agents, commands, plugins and hooks to port, third-party Pi plugins to migrate or drop, MCP, deep-loop fan-out executor support, every cross-repo touch point, and the phase plan.
- Started: 2026-11-05T22:05:00.000Z
- Status: COMPLETE
- Iteration: 10 of 10
- Session ID: fanout-luna-1793915913100-enoz0j
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
| 1 | Angle 1: headless dispatch contract | - | 1.00 | 6 | complete |
| 2 | Angle 2: provider and model routing | - | 0.92 | 6 | complete |
| 3 | Angle 3: profiles, DSH_HOME, and repo-local configuration | - | 0.90 | 6 | complete |
| 4 | Angle 4: skills | - | 0.95 | 6 | complete |
| 5 | Angle 5: agents, subagents, commands, and goal | - | 0.90 | 6 | complete |
| 6 | Angle 6: plugins, hooks, and guards | - | 0.95 | 6 | complete |
| 7 | Angle 7: third-party Pi plugin migration and dropping | - | 0.94 | 6 | complete |
| 8 | Angle 8: MCP configuration and enablement | - | 0.92 | 5 | complete |
| 9 | Angle 9: deep-loop fan-out executor fitness and complete cross-repo integration surface | - | 0.94 | 5 | complete |
| 10 | Angle 10: constraints, differences, and the phase plan | - | 0.90 | 5 | complete |

- iterationsCompleted: 10
- keyFindings: 57
- openQuestions: 4
- resolvedQuestions: 1

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 1/5
- [x] What dispatch contract does DeepSeek Harness expose for headless execution, and how does it compare with the existing cli-pi contract?
- [ ] How should the two provider routes, repo-local runtime folder, skills, agents, commands, plugins, hooks, and MCP be represented for this mode? [legacy-import]
- [ ] Which Pi extensions and third-party plugins should be ported, deferred, replaced by native features, or dropped? [legacy-import]
- [ ] What fan-out executor support and cross-repository touch points are required to integrate the mode safely? [legacy-import]
- [ ] What constraints, unknowns, and dependency-ordered phases should guide implementation? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 4
- [ ] How should the two provider routes, repo-local runtime folder, skills, agents, commands, plugins, hooks, and MCP be represented for this mode?
- [ ] Which Pi extensions and third-party plugins should be ported, deferred, replaced by native features, or dropped?
- [ ] What fan-out executor support and cross-repository touch points are required to integrate the mode safely?
- [ ] What constraints, unknowns, and dependency-ordered phases should guide implementation?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▅▃▂▁▂▄▃▂▂▄▄▄▄▃▃▃▄▂▁
- score sparkline: █▅▃▂▁▂▄▃▂▂▄▄▄▄▃▃▃▄▂▁
- Last 3 ratios: 0.92 -> 0.94 -> 0.90
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.90
- coverageBySources: {}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Reusing Pi event names directly; DSH exposes its own typed Cordis and Session seams. (iteration 6)
- Treating DSH's loop-hygiene guard group as a replacement for repository policy guards; its documented scope is repeat calls and timeouts. (iteration 6)
- Treating DSH's profile package manager or plugin catalog as project-local extension auto-discovery. (iteration 6)
- Importing Pi-specific provider cache parameters before both DSH routes are pinned. (iteration 7)
- Treating DSH conversation compaction as an equivalent for observational memory. (iteration 7)
- Treating DSH subagents as the same interaction as Pi's parallel /btw sidebar. (iteration 7)
- Claiming a dedicated MCP toggle or live Code Mode connectivity before a credential-free handshake probe confirms it. (iteration 8)
- Passing every inherited environment variable to a local MCP child; the DSH transport intentionally scrubs sensitive-name patterns and `DSH_*`. (iteration 8)
- Treating `.pi/mcp.json` as a config file DSH can load directly; DSH requires its own plugin-entry schema. (iteration 8)
- Treating `--approval-policy never` as a confinement mechanism; it only prevents waiting for human approval. (iteration 9)
- Treating `SPECKIT_DSH_STATE_DIR` by itself as a DSH home override; current runner comments define such markers as detection-only unless a native home environment variable is passed. (iteration 9)
- Treating DSH's nonzero exit like Pi's nondeterministic exit without new counterevidence. (iteration 9)

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
Which optional MCP memory and tool packages are appropriate for this repository?

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
