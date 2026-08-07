---
title: Deep Research Strategy — Mobbin MCP Sol Lineage
description: Detached five-iteration research strategy for the Mobbin MCP developer surface.
---

# Deep Research Strategy — Mobbin MCP Sol Lineage

## 1. Overview

This is the persistent state for detached lineage `sol`. The loop is forced to five iterations by `stopPolicy: max-iterations`; convergence before iteration five is telemetry only.

## 2. Topic

Verify the official Mobbin MCP server and skills repositories deeply enough to author a read-only, Code-Mode-only `mcp-mobbin` transport packet paired with `sk-design`, and to define an accurate name-keyed `mobbin` manual for `.utcp_config.json`.

<!-- ANCHOR:key-questions -->
## 3. Key Questions (remaining)

- [x] What is the complete official MCP tool surface, including input fields, returned artifacts, read-only posture, transport, install path, and runtime prerequisites?
- [x] What credential model does the server use, how is the key provisioned/stored, and what does a correct Code Mode manual need to expose?
- [x] How do the official skills implement app, screen, flow, and element research workflows, including staged discovery and image/detail retrieval?
- [x] Which capabilities are available to free users versus Pro subscribers, and what failure/upgrade behavior must the packet document without guessing?
- [x] What exact transport packet, `sk-design` pairing, discovery-first calling convention, UTCP registration shape, and troubleshooting guidance should phases 002–003 author?
<!-- /ANCHOR:key-questions -->

## 4. Non-Goals

- Do not edit `.utcp_config.json`, the MCP tooling hub, or any future phase packet.
- Do not invoke Mobbin tools with a real credential or expose secrets.
- Do not treat the design-reference transport as a taste or implementation authority.
- Do not infer undocumented pricing, quotas, response schemas, or mutation capabilities.

## 5. Stop Conditions

- Complete exactly five evidence iterations unless state corruption or an unrecoverable source failure prevents valid artifacts.
- Treat convergence before iteration five as telemetry and broaden into an uncovered angle.
- Stop at iteration five with `maxIterationsReached`, retaining explicit unknowns.

<!-- ANCHOR:answered-questions -->
## 6. Answered Questions

- OAuth/DCR/PKCE is authoritative for MCP; a static Mobbin API key is not part of the MCP client setup. The eventual manual needs URL/OAuth handling, not a secret key field. (iteration 1)
- The current official `mobbin-search` skill uses one `search_screens` call with query/platform/limit, ordered metadata plus inline images, followed by grounded visual analysis. App/flow/element research is expressed through queries and result analysis rather than separate documented tools. (iteration 2)
- Free has no MCP access; Pro, Team, and Enterprise do. MCP uses OAuth, while the Team/Enterprise REST API uses a workspace API key. MCP is limited to 60 requests per 60 seconds per user. Exact Free denial payload and Finance+ MCP coverage remain UNKNOWN. (iteration 3)
- The Code Mode manual is `mobbin` -> stdio `npx -y mcp-remote https://api.mobbin.com/mcp` with empty env. Calls are discovery-first through Code Mode; the packet is non-mutating evidence retrieval paired with `sk-design` for judgment. (iteration 4)
- The complete public documented baseline is one read tool, `search_screens`, and live endpoint/OAuth metadata confirms the hosted protected resource. Authenticated tool-list completeness and exact server schemas remain validation-time UNKNOWNs. (iteration 5)
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. What Worked

- Official Mobbin repository manifests plus Mobbin-hosted docs: mutually consistent endpoint, transport, OAuth, and plan evidence. (iteration 1)
- Reading the complete official skill: exposed exact planning inputs, response metadata, visual-analysis stages, and the optional-board boundary. (iteration 2)
- Triangulating overview, MCP docs, API quick start, limits, and pricing: separated three easily conflated entitlement/credential surfaces. (iteration 3)
- Local UTCP/Code Mode contracts plus the existing remote-manual precedent: yielded a paste-ready manual and exact discovery/calling lifecycle. (iteration 4)
- Unauthenticated protocol probes plus official GitHub API trees: proved endpoint/auth metadata and bounded the current public tool catalog without crossing the credential boundary. (iteration 5)
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. What Failed

- Generic web/code search: returned unrelated similarly named MCP servers and was discarded in favor of named primary sources. (iteration 1)
- Search for hypothetical app/flow/element tool names: produced no official contracts and cannot substitute for authenticated `tools/list`. (iteration 2)
- Pricing/help pages for protocol errors: describe eligibility but do not publish the wire-level Free denial payload. (iteration 3)
- Static wiring review cannot prove the live OAuth handshake or authenticated `tools/list` surface. (iteration 4)
- Unauthenticated endpoint probing cannot enumerate protected tools; public source review cannot substitute for a paid live schema. (iteration 5)
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. Exhausted Approaches

- Static `MOBBIN_API_KEY` for MCP: official docs explicitly state no API key or manual token setup is needed. (iteration 1)
- Local npm server package: official repository declares a hosted Streamable HTTP remote and publishes no runtime package. (iteration 1)
- Public repository tool enumeration beyond `search_screens`: exhausted without authenticated live discovery; do not invent names. (iteration 2)
- Exact Free entitlement response and Finance+ MCP coverage: public sources exhausted; retain UNKNOWN until live/proprietary evidence exists. (iteration 3)
- Direct Code Mode HTTP transport: no current local manual proves it; use the established `mcp-remote` stdio adapter unless live infrastructure validation establishes a replacement. (iteration 4)
- Public enumeration beyond `search_screens`: exhausted across the official skill tree, server registration tree, docs, and unauthenticated endpoint; move the remaining question to paid live validation. (iteration 5)
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. Ruled-Out Directions

- Static `MOBBIN_API_KEY` for MCP: contradicted by official OAuth documentation. (iteration 1)
- Local npm/stdio Mobbin server: contradicted by official remote-server manifests. (iteration 1)
- Separate `search_apps`, `search_flows`, `search_elements`, detail-fetch, or image-fetch tools: absent from the current public official contract. (iteration 2)
- HTML evidence-board authoring inside `mcp-mobbin`: violates the read-only transport boundary. (iteration 2)
- REST API key in the MCP manual: wrong authorization surface. (iteration 3)
- Limited Free MCP inferred from limited Free website browsing: wrong entitlement surface. (iteration 3)
- MCP secrets in `.env`, pre-discovery callable assumptions, and transport-owned design judgment: contradicted by Mobbin OAuth and local Code Mode/sk-design contracts. (iteration 4)
- A 401 interpreted as a static-key failure, public docs represented as live `tools/list`, and bridge compatibility represented as a successful deployment: all exceed the evidence boundary. (iteration 5)
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. Saturated Directions and Divergence Frontier

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: official public tool-name enumeration; public free-denial/Finance+ detail; unauthenticated live schema enumeration
- Remaining frontier: paid-account Code Mode OAuth/discovery validation and runtime schema capture
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. Carried-Forward Open Questions

- What exact tools does `tools/list` expose, and do official skill references match the live surface?
- Does `search_screens` expose a public JSON Schema beyond the skill-level query/platform/limit contract?
- Does a clean first run complete Mobbin OAuth through the current `mcp-remote` version in this environment?
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. Next Focus

Synthesis. Preserve authenticated live schema, local OAuth round-trip, exact Free denial, and Finance+ coverage as downstream validation questions.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. Known Context

- Primary sources: `https://github.com/mobbin/mobbin-mcp-server` and `https://github.com/mobbin/skills`.
- Local integration consumers are `.utcp_config.json`, the `mcp-tooling` transport packet pattern, Code Mode discovery/call conventions, and the `sk-design` judgment pairing.
- `resource-map.md` was not present at init; the repository coverage gate is informationally skipped.
- The phase specification requires all writes to stay within this research packet and defers actual packet/manual authoring.

## 13. Research Boundaries

- Max iterations: 5
- Convergence threshold: 0.05
- Stop policy: max-iterations
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Executor provenance: `cli-codex`, model `gpt-5.6-sol`, effort `xhigh`, service tier `fast`
- Session: `fanout-sol-1784199634206-lfqjyo`
- Allowed write root: `.opencode/specs/mcp-tooling/010-mcp-mobbin/001-research/research/lineages/sol`
