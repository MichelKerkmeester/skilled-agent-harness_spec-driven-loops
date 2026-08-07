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
- Topic: Map Obsidian automation surfaces (official help/developer docs and plugin API, community CLIs, MCP servers, the Local REST API community plugin, and the obsidian:// URI scheme) to decide BUILD-vs-ADOPT for (a) an Obsidian CLI tool and (b) an Obsidian MCP tool for a new mcp-obsidian mode that mirrors mcp-click-up (dual CLI+MCP). Must verify each candidate package/binary identity (avoid a 404 like @clickup/mcp-server), determine whether tools work headlessly or require a running Obsidian app + Local REST API token, capture the auth/config/env-prefix pattern to mirror in .utcp_config.json + .env.example, and enumerate the feature surface (note CRUD, search, backlinks, daily notes, tags, frontmatter, templates). Deliver a ranked build-vs-adopt recommendation per surface with citations.
- Started: 2026-08-02T06:40:51.000Z
- Status: COMPLETE
- Iteration: 3 of 3
- Session ID: fanout-luna-1785652123667-7lklw5
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
| 1 | Official Obsidian surfaces, Local REST API, URI scheme, and app/headless boundary | - | 0.94 | 7 | complete |
| 2 | Community CLI and MCP package/binary identity, headless boundary, feature coverage, and env contracts | - | 0.81 | 11 | complete |
| 3 | Feature matrix, normalized auth/config contract, and ranked BUILD-vs-ADOPT decision | - | 0.58 | 13 | complete |

- iterationsCompleted: 3
- keyFindings: 31
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] What official Obsidian automation surfaces exist, and which require a running app?
- [x] Which community CLI packages and binaries are real, identifiable, and feature-complete enough to adopt?
- [x] Which MCP servers and package identities are real, and what are their headless/app and auth requirements?
- [x] What do the Local REST API plugin and obsidian:// URI scheme provide, including auth, configuration, and limits?
- [x] What ranked BUILD-vs-ADOPT choice should be made for each feature and for the dual CLI+MCP mode?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ██▇▇▇▇▆▆▆▆▅▅▄▄▃▃▂▂▁▁
- score sparkline: ██▇▇▇▇▆▆▆▆▅▅▄▄▃▃▂▂▁▁
- Last 3 ratios: 0.94 -> 0.81 -> 0.58
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.58
- coverageBySources: {"docs.obsidian.md":2,"github.com":7,"obsidian.md":3,"pypi.org":1,"registry.npmjs.org":1,"www.npmjs.com":6}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- `obsidian-headless` as a note-operation backend: its verified package identity and documented command surface are Sync/Publish, not arbitrary vault operations. [SOURCE: https://www.npmjs.com/package/obsidian-headless] (iteration 1)
- `obsidian://` as the primary CRUD or MCP transport: it launches desktop actions and has no authenticated data API. [SOURCE: https://obsidian.md/help/Extending%2BObsidian/Obsidian%2BURI] (iteration 1)
- The nested `cli-codex` executor could not initialize its app-server client in this runtime. Direct-mode continuation is recorded in the lineage state; research evidence remains packet-local and citation-backed. (iteration 1)
- Treating the official TypeScript API as a headless binary: it is documented as an Obsidian plugin API. [SOURCE: https://docs.obsidian.md/Plugins/Vault] (iteration 1)
- `@clickup/mcp-server` as an adopted package: the exact name did not resolve during identity verification. [SOURCE: https://www.npmjs.com/package/%40clickup/mcp-server] (iteration 2)
- `@questi0nm4rk/vori` as the dual CRUD CLI: its advertised surface is read-only query/search. [SOURCE: https://www.npmjs.com/package/%40questi0nm4rk/vori] (iteration 2)
- A process being runnable with `npx`, `uvx`, or a native binary does not make the Obsidian backend headless; all Local REST API candidates still need the app/plugin/token. (iteration 2)
- The legacy `obsidian-cli` name as the primary install target: the maintained project explicitly renamed the binary/repository to `notesmd-cli`; use the current identity. [SOURCE: https://github.com/Yakitrak/notesmd-cli] (iteration 2)
- Unscoped package-name assumptions are unsafe. `obsidian-mcp-server`, `@mseep/obsidian-mcp-server`, and `@connorbritain/obsidian-mcp-server` are distinct npm identities even when their names and README text overlap. (iteration 2)
- A single “headless Obsidian” backend covering all semantics: official headless is Sync/Publish, the official CLI is app-backed, and Local REST/MCP requires the desktop plugin. [SOURCE: https://www.npmjs.com/package/obsidian-headless] [SOURCE: https://obsidian.md/help/cli] [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] (iteration 3)
- Building a full replacement note engine as the first implementation: the adopted transports already cover the majority of CRUD/search/tag/frontmatter behavior. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] (iteration 3)
- Convergence telemetry fell below the first iteration ratio but remained above the configured threshold; the max-iterations policy still required this third pass, so synthesis was intentionally deferred until after these feature and configuration checks. (iteration 3)
- The negative package identity remains unresolved as an installable candidate; no dependency should be generated from an unresolvable scoped name. (iteration 3)
- Treating backlinks or template management as guaranteed core Local REST API features: the documented endpoint/tool matrix does not establish those complete portable surfaces. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] (iteration 3)

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
