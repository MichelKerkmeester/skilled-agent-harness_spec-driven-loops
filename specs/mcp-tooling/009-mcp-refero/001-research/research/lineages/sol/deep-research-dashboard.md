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
- Topic: Refero MCP developer surface for an mcp-tooling transport mode: the Refero MCP server per https://refero.design/mcp (tool surface, auth, rate limits, transport via mcp-remote) and the official refero_skill repo https://github.com/referodesign/refero_skill — UI-design-reference search workflows (apps, screens, flows, elements), free vs paid gating, everything needed to author the mcp-refero transport packet (read-only, Code Mode only, sk-design judgment pairing) atop the EXISTING refero manual in .utcp_config.json (npx -y mcp-remote https://api.refero.design/mcp)
- Started: 2026-07-16T10:39:36.499Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Session ID: fanout-sol-1784198125985-iw9229
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Authoritative Refero MCP surface and live unauthenticated behavior | - | 1.00 | 6 | complete |
| 2 | Limits, plan gating, batch behavior, and current data shapes | - | 0.78 | 8 | complete |
| 3 | mcp-remote OAuth, local state, and failure boundary | - | 0.66 | 8 | complete |
| 4 | downstream transport architecture and judgment boundary | - | 0.58 | 9 | complete |
| 5 | contradiction review and implementation-readiness matrix | - | 0.44 | 9 | complete |

- iterationsCompleted: 5
- keyFindings: 40
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] What tools does the live Refero MCP expose for apps, screens, flows, and elements, with which parameters, defaults, and response shapes?
- [x] What authentication, session, transport, and error behavior applies when the existing `.utcp_config.json` manual launches `mcp-remote` against `https://api.refero.design/mcp`?
- [x] What rate, pagination, result, image, and free-versus-paid limits are documented or observable, and which claims remain unknown?
- [x] How does the official `referodesign/refero_skill` repository structure UI-reference search workflows, prompts, output handling, and failure guidance?
- [x] What exact read-only Code Mode surface, `sk-design` judgment pairing, safety boundary, and verification plan should the downstream `mcp-refero` packet adopt?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▇▆▆▅▅▅▄▄▄▃▃▃▃▂▂▂▁▁
- score sparkline: █▇▇▆▆▅▅▅▄▄▄▃▃▃▃▂▂▂▁▁
- Last 3 ratios: 0.66 -> 0.58 -> 0.44
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.44
- coverageBySources: {"api.github.com":1,"api.refero.design":2,"code":11,"doc.refero.design":6,"github.com":11,"raw.githubusercontent.com":6,"www.npmjs.com":1}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Treat Refero MCP as anonymously usable: the live endpoint rejects both GET and `initialize` without Bearer authorization. [SOURCE: https://api.refero.design/mcp] (iteration 1)
- Treat the cached four-tool, numeric-ID, `limit`/`offset` documentation as current: the current official Tools page explicitly defines an eight-tool UUID/page-based surface and lists the older patterns as mistakes. [SOURCE: https://doc.refero.design/mcp/tools] (iteration 1)
- Unauthenticated `tools/list`: authentication blocks live tool enumeration, so official schemas are the authoritative source until a credentialed verification is available. [SOURCE: https://api.refero.design/mcp] (iteration 1)
- Derive per-minute or concurrency limits from unauthenticated responses: the 401 responses expose no rate headers and cannot establish authenticated runtime limits. [SOURCE: https://api.refero.design/mcp] (iteration 2)
- Encode 8,000 calls/month as a request-rate limit: it is a monthly quota; no burst/window rate is published. [SOURCE: https://doc.refero.design/mcp/getting-started] (iteration 2)
- Model Free as a smaller MCP plan: official Plans documentation states that Free has no MCP access. [SOURCE: https://doc.refero.design/help/plans] (iteration 2)
- Strip unknown response fields into a rigid local model: official Data Model documentation says exact fields can grow over time. [SOURCE: https://doc.refero.design/mcp/data-model] (iteration 2)
- Automatically delete `~/.mcp-auth` on failures: it is credential state and destructive cleanup requires operator intent. [SOURCE: https://github.com/geelen/mcp-remote#troubleshooting] (iteration 3)
- Credential-free confirmation of Refero OAuth success: browser authorization and token exchange require a Refero account and would write local auth state outside the lineage. [SOURCE: https://doc.refero.design/mcp/getting-started] (iteration 3)
- Force SSE for Refero: official Refero docs specify HTTP and `mcp-remote` already defaults to HTTP-first. [SOURCE: https://doc.refero.design/mcp/getting-started] (iteration 3)
- Put bearer tokens in Code Mode calls or skill files: secrets belong in operator-controlled environment/manual configuration. [SOURCE: https://github.com/geelen/mcp-remote#custom-headers] (iteration 3)
- Allow Bash because `mcp-remote` is launched with `npx`: Code Mode owns launching the existing stdio manual; the packet itself has no shell responsibility. [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md:269] (iteration 4)
- Create a standalone Refero hub or embed Refero in `sk-design`: it is an MCP bridge and belongs as a transport mode under `mcp-tooling`; design judgment remains in `sk-design`. [SOURCE: file:.opencode/skills/mcp-tooling/SKILL.md] (iteration 4)
- Live Code Mode tool discovery was intentionally not invoked: it can launch `mcp-remote`, trigger browser OAuth, and write credential state outside the bound artifact directory. [SOURCE: https://github.com/geelen/mcp-remote] (iteration 4)
- Treat search rank or image similarity as a design verdict: Refero supplies reference evidence and `sk-design` owns acceptance. [SOURCE: file:.opencode/skills/sk-design/SKILL.md:263] (iteration 4)
- Add generic “design” as a strong Refero router keyword: it would collide with Figma and the design hub; narrow Refero/reference-research phrases are safer. [SOURCE: file:.opencode/skills/mcp-tooling/hub-router.json] (iteration 5)
- Credential-free tests cannot validate paid tool execution or OAuth refresh without violating the lineage’s no-outside-write boundary. [SOURCE: https://github.com/geelen/mcp-remote] (iteration 5)
- Hardcode a single authenticated schema snapshot: Code Mode discovery and `tool_info` are the runtime authority, with the official docs as expected baseline. [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md:285] (iteration 5)
- Public documentation does not disclose per-second, burst, concurrency, or retry-header behavior. [SOURCE: https://doc.refero.design/mcp/tools] (iteration 5)
- Replace the existing manual with the upstream bearer-header example: the operator explicitly scoped the packet atop the existing `mcp-remote` manual. [SOURCE: file:.utcp_config.json:148] (iteration 5)
- Vendor or install the upstream Refero Skill wholesale: its authority, implementation, image-generation, and QA scope conflicts with the local transport/taste separation. [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/SKILL.md] (iteration 5)

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
