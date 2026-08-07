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
- Topic: Aside browser developer surface for an mcp-tooling skill mode: the Aside CLI command surface and the Aside MCP server (tools, auth, transport, install, session/daemon model) per https://docs.aside.com/help/developers#use-mcp — AI-browser-automation workflows (navigate, DOM inspection, screenshots, console/network capture), contrast with Chrome DevTools bdg patterns, everything needed to author the mcp-aside-devtools packet (CLI-primary + Code Mode MCP fallback) and register an aside UTCP manual in .utcp_config.json
- Started: 2026-07-16T10:17:45.892Z
- Status: COMPLETE
- Iteration: 3 of 3
- Session ID: fanout-luna-1784196776045-jwfb3a
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
| 1 | Official Aside CLI and MCP surface | - | 0.95 | 8 | complete |
| 2 | Aside lifecycle, accounts, and unattended boundaries | - | 0.78 | 8 | complete |
| 3 | Aside packet design, bdg contrast, and UTCP registration | - | 0.70 | 9 | complete |

- iterationsCompleted: 3
- keyFindings: 25
- openQuestions: 4
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/4
- [ ] What is the complete stable Aside CLI command and option surface for browser automation? [legacy-import]
- [ ] What exact MCP tools and schemas does `aside mcp` expose, and what is the session/daemon lifecycle? [legacy-import]
- [ ] How do Aside's CLI-primary and Code Mode MCP fallback map to the bdg browser-debugging workflow and UTCP registration? [legacy-import]
- [ ] Which auth, privacy, permission, and unattended-automation boundaries must `mcp-aside-devtools` document? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 4
- [ ] What is the complete stable Aside CLI command and option surface for browser automation?
- [ ] What exact MCP tools and schemas does `aside mcp` expose, and what is the session/daemon lifecycle?
- [ ] How do Aside's CLI-primary and Code Mode MCP fallback map to the bdg browser-debugging workflow and UTCP registration?
- [ ] Which auth, privacy, permission, and unattended-automation boundaries must `mcp-aside-devtools` document?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▇▆▆▅▅▄▄▃▃▃▃▂▂▂▂▁▁▁
- score sparkline: █▇▇▆▆▅▅▄▄▃▃▃▃▂▂▂▂▁▁▁
- Last 3 ratios: 0.95 -> 0.78 -> 0.70
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.70
- coverageBySources: {"code":29,"docs.aside.com":5,"releases.aside.com":1}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- A documented remote HTTP/SSE MCP endpoint or static bearer-token configuration: the official developer page and `aside mcp --help` document only the local stdio command. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local command: `aside mcp --help`, observed 2026-07-16]** (iteration 1)
- Public docs do not enumerate the MCP schema beyond the server launch snippet; live protocol discovery is the authoritative tool inventory for this packet. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local MCP `tools/list`, observed 2026-07-16]** (iteration 1)
- Separate Aside MCP tools named `navigate`, `dom`, `screenshot`, `console`, or `network`: the live `tools/list` inventory returned only `repl`. **[SOURCE: local MCP `tools/list`, observed 2026-07-16]** (iteration 1)
- Treating a fresh `aside mcp` process as sufficient to control any browser: the live unbound-profile error disproves that assumption. **[SOURCE: local MCP `tools/call(repl)` probe, observed 2026-07-16]** (iteration 1)
- A safe browser-bound smoke test could not be performed without selecting or opening a real Aside profile; no profile or website was touched. **[SOURCE: local MCP unbound-profile error, observed 2026-07-16]** (iteration 2)
- Depending on undocumented daemon subcommands or private timeout flags: the public help surface does not expose them. **[SOURCE: local `aside --help` and `aside mcp --help`, observed 2026-07-16]** (iteration 2)
- Public documentation explains task and permission behavior but does not publish a separate MCP session registry or daemon API. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local CLI help, observed 2026-07-16]** (iteration 2)
- Treating `--session` as an MCP browser-target selector: it is documented on agent-task paths; the MCP launcher has no such option. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local CLI help, observed 2026-07-16]** (iteration 2)
- Treating a signed-in account as sufficient for unattended execution: permission gates, browser-profile binding, approvals, MFA, CAPTCHA, and visible verification remain independent prerequisites. **[SOURCE: https://docs.aside.com/help/security] [SOURCE: https://docs.aside.com/help/tasks] [SOURCE: https://docs.aside.com/help/troubleshooting]** (iteration 2)
- A bound Aside page was not available, so screenshot bytes, DOM snapshots, and event-listener behavior remain validation tasks rather than research facts. **[SOURCE: local MCP unbound-profile probe, observed 2026-07-16]** (iteration 3)
- Claiming a stable `aside_console`, `aside_network`, or `aside_har` MCP tool: no such live tools were discovered. **[SOURCE: local MCP `tools/list`, observed 2026-07-16]** (iteration 3)
- Registering Aside as remote HTTP/SSE MCP or adding bearer/OAuth configuration: only the local stdio launch is documented and observed. **[SOURCE: https://docs.aside.com/help/developers] [SOURCE: local `aside mcp --help`, observed 2026-07-16]** (iteration 3)
- Running a live bdg comparison was intentionally skipped because the user requested a research lineage and the lineage boundary prohibits unrelated daemon/profile writes; local references provide the required contrast. **[SOURCE: `.opencode/skills/mcp-tooling/mcp-chrome-devtools/references/cdp_patterns.md`; lineage boundary]** (iteration 3)
- Treating Aside as a CDP-domain-complete replacement for bdg: the live MCP server exposes one REPL tool, not a verified CDP tool catalog. **[SOURCE: local MCP `tools/list`, observed 2026-07-16]** (iteration 3)
- Treating the derived `aside.aside_repl` name as verified without Code Mode discovery: the name follows repository convention but must be confirmed after registration. **[SOURCE: `.opencode/skills/mcp-code-mode/SKILL.md:217-260`]** (iteration 3)

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
Follow up on: The requested lineage can provide the manual and packet design without applying them. The parent `.utcp_config.json`, `mcp-aside-devtools` skill, hub registration, graph persistence, and memory save remain outside thi...

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
- graphConvergenceScore: 0.81
- graphDecision: CONTINUE
- Blocker: Bound-page Aside output and console/network listener behavior remain validation gaps.
- Blocker: The derived Code Mode callable requires post-registration discovery.

<!-- /ANCHOR:graph-convergence -->
