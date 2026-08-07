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
- Topic: devin-as-mcp-host-feasibility: Investigate whether Devin CLI can genuinely host this repos MCP servers (spec-kit-memory, code-graph, skill-advisor) as referenced by Devin-as-MCP-host in project INSTALL_GUIDEs (a surface the original cli-devin deprecation explicitly left untouched, per z_archive/022-cli-devin-deprecation/context/context-report.md). Confirm Devin real devin mcp add/list/get/remove/login/logout/enable/disable surface (docs.devin.ai/cli/extensibility/mcp/overview.md and configuration.md) against what these 3 MCP servers actually require (stdio vs http transport, env vars, auth, working directory). Determine whether bringing this into scope for the cli-devin revival (029-cli-devin-revival) is worthwhile, and if so what a new phase would need to cover. This directly resolves Open Question 3 in the parent spec.md (currently scoped OUT by default).
- Started: 2026-07-24T05:28:04.819Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Session ID: research-devin-mcp-host-2026-07-24
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| undefined | Confirm Devin CLI MCP commands, schema, scopes, transports, and compare them with the three repository MCP servers. | - | 0.84 | 0 | insight |
| undefined | Define the least-privilege Devin permission/trust policy for advisor mutation tools and memory writes. | - | 0.78 | 0 | insight |
| undefined | Determine whether Devin normalizes hyphenated MCP server IDs to underscore-separated tool namespaces and whether deny rules must use that spelling. | - | 0.62 | 0 | insight |
| undefined | Determine whether Devin normalizes hyphenated MCP server IDs to underscore-separated tool namespaces and whether deny rules must use that spelling. | - | 0.44 | 0 | insight |
| undefined | Does Devin invoke all three relative launcher commands from the repository root in a clean session? | - | 0.31 | 0 | insight |

- iterationsCompleted: 5
- keyFindings: 35
- openQuestions: 4
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/4
- [ ] What is the real Devin CLI MCP surface (subcommands, config schema, transport options)? [operator]
- [ ] What do spec-kit-memory, code-graph, and skill-advisor MCP servers actually require (transport, env, auth, working directory)? [operator]
- [ ] How well does Devin's MCP surface match what these three servers need? Concrete gap list. [operator]
- [ ] Is bringing this surface into the cli-devin revival worthwhile, and if so what would a new phase need to cover? [operator]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 4
- [ ] What is the real Devin CLI MCP surface (subcommands, config schema, transport options)?
- [ ] What do spec-kit-memory, code-graph, and skill-advisor MCP servers actually require (transport, env, auth, working directory)?
- [ ] How well does Devin's MCP surface match what these three servers need? Concrete gap list.
- [ ] Is bringing this surface into the cli-devin revival worthwhile, and if so what would a new phase need to cover?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ███▇▇▇▇▆▆▅▅▄▄▃▃▂▂▂▁▁
- score sparkline: ███▇▇▇▇▆▆▅▅▄▄▃▃▂▂▂▁▁
- Last 3 ratios: 0.62 -> 0.44 -> 0.31
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.31
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
Do the three commands complete a clean Linux `initialize` plus `tools/list` discovery with dependencies already present in the Devin snapshot?

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
