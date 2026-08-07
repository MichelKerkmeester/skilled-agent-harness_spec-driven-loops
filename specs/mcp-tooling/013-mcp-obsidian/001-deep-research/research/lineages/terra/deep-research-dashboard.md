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
- Topic: Map Obsidian automation surfaces (official help/developer docs and plugin API, community CLIs, MCP servers, the Local REST API community plugin, and the obsidian:// URI scheme) to decide BUILD-vs-ADOPT for (a) an Obsidian CLI tool and (b) an Obsidian MCP tool for a new mcp-obsidian mode that mirrors mcp-click-up (dual CLI+MCP). Must verify each candidate package/binary identity, determine whether tools work headlessly or require a running Obsidian app + Local REST API token, capture the auth/config/env-prefix pattern to mirror in .utcp_config.json + .env.example, and enumerate the feature surface (note CRUD, search, backlinks, daily notes, tags, frontmatter, templates).
- Started: 2026-08-02T06:31:31.226Z
- Status: COMPLETE
- Iteration: 3 of 3
- Session ID: fanout-terra-1785652123667-7lklw5
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
| 1 | Official Obsidian automation contract and local dual-surface precedent | official-contract | 1.00 | 7 | complete |
| 2 | CLI candidate identity and genuine headless boundary | cli-selection | 0.80 | 6 | complete |
| 3 | MCP identity, runtime boundary, and Code Mode configuration | mcp-and-config | 0.75 | 8 | complete |

- iterationsCompleted: 3
- keyFindings: 21
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Which official Obsidian surfaces are automation-capable, and what is their supported feature and runtime boundary?
- [x] Which community CLI candidates have a verified package/binary identity, usable feature coverage, and true headless execution?
- [x] Which MCP-server candidates have a verified identity and transport, and do they require the Local REST API plugin and a running Obsidian app?
- [x] How does the Local REST API community plugin authenticate and what CRUD/search/backlink/daily-note/tag/frontmatter/template operations does it expose?
- [x] What configuration, auth, environment-prefix, and build-vs-adopt choice best mirrors the local mcp-click-up dual CLI+MCP pattern?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▇▆▆▅▄▄▃▃▂▂▂▂▂▂▁▁▁▁
- score sparkline: █▇▇▆▆▅▄▄▃▃▂▂▂▂▂▂▁▁▁▁
- Last 3 ratios: 1.00 -> 0.80 -> 0.75
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.75
- coverageBySources: {"code":3,"docs.obsidian.md":1,"github.com":2,"obsidian.md":3,"pypi.org":2,"www.npmjs.com":2}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Calling the official `obsidian` CLI headless: the official documentation requires a running desktop app and launches it on first use. [SOURCE: https://obsidian.md/help/cli] (iteration 1)
- Do not adopt the existing ClickUp package name as a template without a registry verification; the local documentation records a 404 for it. [SOURCE: .opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/clickup-mcp/README.md:65] (iteration 1)
- Treating `obsidian://` as a full data-plane API: it lacks the documented rich query and metadata surface needed for agent operations. [SOURCE: https://obsidian.md/help/Extending%2BObsidian/Obsidian%2BURI] (iteration 1)
- A third-party CLI that reuses the `obsidian` binary name introduces ambiguous invocation and an avoidable installer/configuration conflict. [SOURCE: https://pypi.org/project/obsidian-cli/] (iteration 2)
- Adopting PyPI `obsidian-cli` as the mcp-obsidian CLI: it shares the `obsidian` executable name with the official CLI but its documented scope is vault setup/opening rather than the requested operational surface. [SOURCE: https://pypi.org/project/obsidian-cli/] (iteration 2)
- Treating `@obsidian-vfs/core` as a drop-in executable: npm describes it as a shared engine/library and its useful graph/search functions are unavailable while Obsidian is down. [SOURCE: https://www.npmjs.com/package/%40obsidian-vfs/core] (iteration 2)
- Treating official Obsidian Headless (`ob`) as an automation API: its documented surface is Sync administration, not note CRUD/search/backlink tooling. [SOURCE: https://obsidian.md/help/sync/headless] (iteration 2)
- Configuring the built-in HTTP MCP directly in `.utcp_config.json` before Code Mode's HTTP-manual and custom-header schema is verified. [INFERENCE: based on .utcp_config.json:66] (iteration 3)
- Enabling unrestricted command execution or whole-vault writes by default for an autonomous client. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] (iteration 3)
- Treating any Local REST API wrapper as headless: every verified wrapper delegates to the plugin running inside Obsidian. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] [SOURCE: https://pypi.org/project/mcp-obsidian/] (iteration 3)

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
