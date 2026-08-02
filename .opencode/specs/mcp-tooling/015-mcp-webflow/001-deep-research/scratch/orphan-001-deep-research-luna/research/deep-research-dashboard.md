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
- Topic: Webflow MCP 2.0 capabilities, authentication, safety boundaries, and mcp-tooling integration
- Started: 2026-08-02T18:13:47.937Z
- Status: INITIALIZED
- Iteration: 6 of 5
- Session ID: dr-20260802T181347937Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Capabilities and official documentation first | architecture | 1.00 | 6 | complete |
| 2 | Concrete repository packet design: registry keys, remote transport configuration, Code Mode discovery, routing vocabulary, and validation/playbook coverage. | architecture | 1.00 | 5 | complete |
| 3 | Per-tool mutation confirmation semantics and the complete list of Bridge-dependent tools. | safety | 0.75 | 4 | complete |
| 3 | Per-tool mutation confirmation semantics and the complete list of Bridge-dependent tools. | safety | 0.88 | 4 | complete |
| 4 | Per-tool mutation confirmation semantics and the complete list of Bridge-dependent tools. | safety | 0.88 | 4 | complete |
| 5 | Per-tool mutation confirmation semantics and the complete list of Bridge-dependent tools. | safety | 0.75 | 4 | complete |

- iterationsCompleted: 6
- keyFindings: 23
- openQuestions: 1
- resolvedQuestions: 3

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 3/4
- [x] What capabilities and tool surfaces does Webflow MCP 2.0 document?
- [x] What safety boundaries and mutating-operation risks are documented?
- [x] How should the existing mcp-tooling architecture integrate it safely?
- [ ] How are authentication, authorization, scopes, and credentials handled? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 1
- [ ] How are authentication, authorization, scopes, and credentials handled?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █████▆▄▂▁▂▃▄▅▅▅▅▄▃▂▁
- score sparkline: █████▆▄▂▁▂▃▄▅▅▅▅▄▃▂▁
- Last 3 ratios: 0.88 -> 0.88 -> 0.75
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.75
- coverageBySources: {"code":17,"developers.webflow.com":10}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Adding Webflow as an unregistered ad hoc native MCP call was ruled out by the hub's registry-driven routing and Code Mode ownership contracts. [SOURCE: .opencode/skills/mcp-tooling/SKILL.md:41-66] [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:18-23] (iteration 1)
- The guessed Webflow MCP authentication page `https://developers.webflow.com/mcp/reference/authentication` returned Page Not Found; the general Data API authentication guide was used as the bounded fallback. The MCP-specific authorization details need a narrower follow-up against the official getting-started/OAuth links. (iteration 1)
- Treating Webflow MCP as a CMS-only integration was ruled out by the official capability inventory. [SOURCE: https://developers.webflow.com/mcp] (iteration 1)
- A local-mutating `workflow` classification was ruled out because the remote MCP server is the external execution surface and the repository's transport axis defines workspace mutation as false. [SOURCE: .opencode/skills/mcp-tooling/mode-registry.json:18-29] (iteration 2)
- Generic `design`/`CMS` routing vocabulary was ruled out because it would overlap existing modes and violate the hub's provider-specific scoring/defer contract. [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:27-31] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:105-119] (iteration 2)
- The first attempted Magnific wiring-reference path did not exist in that packet; the available `SKILL.md` architecture contract and the structurally parallel Mobbin wiring reference supplied the needed transport comparison. [SOURCE: .opencode/skills/mcp-tooling/mcp-magnific/SKILL.md:28-40] [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/references/mcp-wiring.md:23-42] (iteration 2)
- Claiming provider-enforced confirmation or dry-run behavior; no such per-tool contract was found in the consulted official MCP pages. (iteration 3)
- Retrying the guessed MCP authentication URL; prior strategy marks it blocked, and the official overview/how-it-works pages now supply the relevant workspace and remote-authentication constraints. (iteration 3)
- Treating every mutation as Bridge-dependent; official documentation explicitly separates Data API-backed mutations from live-Designer operations. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works] (iteration 3)
- Claiming provider-enforced confirmation or dry-run behavior remains unsupported by the consulted references. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md] (iteration 4)
- Live callable discovery was unavailable in this iteration; no guessed tool name or schema was promoted. (iteration 4)
- Treating every Webflow mutation as Bridge-dependent was not supported by the official separation between Data API and live Designer capabilities. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md] (iteration 4)
- Claiming provider-enforced confirmation, dry-run, or per-tool safety metadata without a published contract; the remaining conclusion is caller-owned policy. [SOURCE: https://developers.webflow.com/mcp] [INFERENCE: based on the reviewed official documentation] (iteration 5)
- Treating Bridge absence as a transport outage or requiring the Bridge for all mutations; official documentation separates live-Designer capabilities from Data API-backed operations. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works] (iteration 5)
- Treating MCP resources or Agent Instructions as callable tool schemas; the official architecture distinguishes resources from tools. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works] (iteration 5)

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
Exact MCP OAuth scope names, authorization UX, workspace selection, and reconnect/revocation behavior remain unresolved.

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
