# Iteration 1: Capabilities and official documentation first

## Focus
Investigate the documented Webflow MCP 2.0 capability surface and establish the initial authentication, safety, and mcp-tooling integration implications. The narrow interpretation is official Webflow documentation plus the repository's current MCP hub and Code Mode configuration; implementation and credential provisioning are deferred.

## Actions Taken
- Consulted Webflow's official MCP overview, architecture/how-it-works documentation, and Data API authentication/CMS documentation.
- Inspected the repository's `mcp-tooling` hub, `mcp-code-mode` contract, and `.utcp_config.json` to compare the documented transport model with current integration patterns.
- Checked for existing Webflow-specific MCP registration or packet files; no Webflow manual is currently registered in `.utcp_config.json`.

## Findings
1. Webflow MCP 2.0 exposes a broad tool surface spanning Designer-style construction (elements, styles, components, variables, branches, custom code, fonts), site/content management (CMS, pages, assets, forms, sitemap, SEO, comments, audits), analytics through Webflow Analyze, and multi-step automation. This is materially broader than a CMS-only adapter and should be modeled as several operation families rather than one undifferentiated tool. [SOURCE: https://developers.webflow.com/mcp]
2. The server is a remote MCP-to-Webflow-API translation layer. Webflow documents the remote endpoint as `https://mcp.webflow.com/mcp`, with OAuth-authenticated access, automatic token refresh, and no local credentials; the MCP overview separately advertises the documentation connection endpoint `https://developers.webflow.com/_mcp/server`. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works] [SOURCE: https://developers.webflow.com/mcp]
3. The documented safety boundary is permission-preserving rather than read-only: agents inherit the user's Webflow permissions, roles, and custom roles, and changes are recorded in the site's activity log. The same capability list includes destructive or production-impacting operations such as deleting assets/forms/branches, publishing or unpublishing CMS items, changing custom code, and modifying SEO, so integration must surface mutation risk and preserve explicit confirmation at the caller layer. [SOURCE: https://developers.webflow.com/mcp] [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works]
4. The Bridge App is required only for live Designer-session capabilities such as visual snapshots and current selection/page/mode/branch/canvas/breakpoint state; most content and design mutations use the Data API without the Designer open. This implies a capability-aware integration should distinguish remote API tools from Bridge-dependent tools and report `ModeForbidden` or unavailable-bridge conditions without treating them as generic transport failures. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works]
5. The repository's current MCP hub is registry-driven and routes external MCP tools through Code Mode; its documented packet set contains no Webflow packet, while `.utcp_config.json` registers ClickUp, Figma, Refero, Mobbin, Obsidian, Magnific, and other manuals but no Webflow entry. A Webflow integration therefore needs a new registry/manual path and must follow the existing Code Mode substrate rather than adding ad hoc native calls. [SOURCE: .opencode/skills/mcp-tooling/SKILL.md:15-16] [SOURCE: .opencode/skills/mcp-tooling/SKILL.md:41-66] [SOURCE: .utcp_config.json:14-238]
6. Webflow's general API authentication documentation distinguishes site tokens, workspace tokens, and OAuth tokens, recommends environment variables and token rotation/revocation, and requires scopes appropriate to each operation. This supports OAuth for the remote MCP path and least-privilege scope mapping for any direct API fallback, but the MCP-specific page for authentication was unavailable at the guessed URL; the exact connector authorization UX and scope names remain to be verified in the linked getting-started/OAuth docs. [SOURCE: https://developers.webflow.com/data/reference/authentication.md] [INFERENCE: based on https://developers.webflow.com/mcp/reference/how-it-works and https://developers.webflow.com/data/reference/authentication.md]

## Questions Answered
- What capabilities and tool surfaces does Webflow MCP 2.0 document? — Answered at high level, with operation families and Bridge-dependent limitations.

## Questions Remaining
- Exact MCP OAuth authorization flow, scope names, workspace/site selection, and reconnect/revocation behavior.
- Detailed safety treatment for each mutating tool, including publish/delete/custom-code confirmation expectations.
- Concrete repository packet design: registry keys, remote transport configuration, Code Mode discovery, routing vocabulary, and validation/playbook coverage.

## Ruled Out
- Treating Webflow MCP as a CMS-only integration was ruled out by the official capability inventory. [SOURCE: https://developers.webflow.com/mcp]
- Adding Webflow as an unregistered ad hoc native MCP call was ruled out by the hub's registry-driven routing and Code Mode ownership contracts. [SOURCE: .opencode/skills/mcp-tooling/SKILL.md:41-66] [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:18-23]

## Dead Ends
- The guessed Webflow MCP authentication page `https://developers.webflow.com/mcp/reference/authentication` returned Page Not Found; the general Data API authentication guide was used as the bounded fallback. The MCP-specific authorization details need a narrower follow-up against the official getting-started/OAuth links.

## Edge Cases
- Ambiguous input: “Webflow MCP 2.0” was interpreted as the official remote Webflow MCP server and its documented integration, not a community server or direct Data API client.
- Contradictory evidence: none found between the official MCP overview and how-it-works pages.
- Missing dependencies: MCP-specific authentication page unavailable at the guessed URL; official general authentication documentation supplied partial coverage.
- Partial success: capability and architecture coverage is strong; exact OAuth scopes and per-tool mutation semantics remain unresolved, so those questions are carried forward.

## Sources Consulted
- https://developers.webflow.com/mcp
- https://developers.webflow.com/mcp/reference/how-it-works
- https://developers.webflow.com/data/reference/authentication.md
- https://developers.webflow.com/data/reference
- .opencode/skills/mcp-tooling/SKILL.md:15-180
- .opencode/skills/mcp-code-mode/SKILL.md:18-23
- .utcp_config.json:14-238

## Assessment
- New information ratio: 1.00 (six findings; all are new to the empty registry, with the final integration conclusion explicitly derived from repository evidence).
- Questions addressed: capabilities/tool surfaces; initial architecture and safety implications.
- Questions answered: capabilities/tool surfaces.

## Reflection
- What worked and why: Official MCP overview/how-it-works pages plus local hub/config inspection triangulated product capability, transport, governance, and repository fit.
- What did not work and why: The guessed MCP authentication URL was unavailable, preventing exact scope and connector-flow confirmation.
- What I would do differently: Follow the official getting-started and OAuth links directly next iteration instead of guessing the MCP authentication route.

## Recommended Next Focus
Verify the official OAuth authorization flow and exact scopes, then map those permissions and mutation classes onto a registry-driven Webflow packet and Code Mode remote transport.
