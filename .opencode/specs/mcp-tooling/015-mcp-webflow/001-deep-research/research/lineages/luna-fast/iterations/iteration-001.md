# Iteration 1: Webflow MCP 2.0 announcement claims and primary-source confirmation

## Focus
Investigate the supplied Webflow MCP 2.0 announcement and compare its material feature claims with official Webflow developer documentation and the official Webflow MCP server repository. The selected interpretation is feature confirmation only; client setup, authentication detail, API limits, and integration design are deferred to later focuses.

## Findings
1. The announcement presents MCP 2.0 as a broad expansion beyond basic site interaction: it claims screenshot-informed component creation, component props/variants/slots/metadata, CSS-variable collection access and mutation, site-authored rules and skills, forms and submissions, page branches and permissions, asset management and image compression, page/site custom code, Enterprise history, and natural-language analytics. `[SOURCE: https://webflow.com/blog/mcp-2-features]`
2. The announcement's “no more bridge app” claim is confirmed with an important boundary: Webflow's current documentation says most work runs through the Data API without the Bridge App, including elements, components, styles, variables, CMS content, pages, and assets; the Bridge App remains required for live-Designer capabilities such as visual snapshots, current selection/page/mode/branch, canvas navigation, and breakpoint reads. `[SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md]`
3. The design-system and component headline is only partially confirmed at the granularity claimed. Official documentation confirms access to and editing of components, styles, and variables, while the fetched primary pages do not explicitly confirm every announcement sub-operation—variable reordering and modes, component props/variants/slots/metadata, or screenshot-to-component generation. This is an unresolved verification gap, not evidence that those operations do not exist. `[INFERENCE: comparing https://webflow.com/blog/mcp-2-features with https://developers.webflow.com/mcp/reference/how-it-works.md and https://developers.webflow.com/data/docs/ai-tools]`
4. Agent-authored context is directly confirmed: Webflow's MCP documentation describes site-level Agent Instructions as markdown rules and skills supplied automatically to connected agents, with references resolved against current site primitives; it also documents shared-library distribution, mode awareness, role enforcement, and activity logging. `[SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md]`
5. Several “more to offer” claims remain unverified by the official primary sources fetched in this iteration. The docs confirm broad Data API coverage and list CMS, assets, pages, custom code, localization, and Designer tools, but they do not in the fetched material explicitly confirm the announcement's forms/submissions, page-branch workflow, image compression to WebP/AVIF, Enterprise history queries, or traffic analytics query surface. The official repository README confirms the MCP server is an open-source Webflow API bridge and points to its tool directory, but does not itself substantiate those MCP 2.0 feature details. `[INFERENCE: comparing https://webflow.com/blog/mcp-2-features, https://developers.webflow.com/data/docs/ai-tools, and https://github.com/webflow/mcp-server]`

## Ruled Out
- Calling Webflow MCP mutation tools was not attempted because the prompt explicitly forbids tool invocation; therefore no runtime mutation evidence was collected.
- Non-official articles, community reports, and broad implementation research were excluded to preserve the supplied official-primary-source scope.
- Client setup, authentication, transport, rate limits, and safe integration design were deferred because they are separate strategy questions rather than this iteration's announcement-confirmation focus.

## Dead Ends
The fetched official repository landing page exposes the tool-directory link but does not provide a feature-by-feature MCP 2.0 confirmation matrix. A later iteration should inspect official per-tool or changelog documentation rather than treating the README as sufficient evidence. `[SOURCE: https://github.com/webflow/mcp-server]`

## Edge Cases
- Ambiguous input: “primary-source confirmation” was interpreted as confirmation from Webflow's own announcement, developer documentation, and official GitHub repository; exact feature implementation proof was not inferred from marketing examples.
- Contradictory evidence: none material. The announcement's “most actions” bridge-app statement is consistent with the docs' Data API versus live-Designer distinction, although older/general documentation describes the companion app more broadly.
- Missing dependencies: the official repository landing page did not enumerate all tools, so per-tool confirmation remains deferred; no unofficial fallback was used.
- Partial success: the announcement's headline categories and bridge-app/context model were confirmed, but several detailed capability claims remain open; status is complete for this bounded mapping and not a claim that every feature is verified.

## Sources Consulted
- https://webflow.com/blog/mcp-2-features
- https://developers.webflow.com/data/docs/ai-tools
- https://developers.webflow.com/mcp/reference/how-it-works.md
- https://github.com/webflow/mcp-server

## Assessment
- New information ratio: 0.80
- Questions addressed: Q1: What did the MCP 2.0 announcement add, and which claims are confirmed by official implementation or developer docs?
- Questions answered: Q1 partially — the material claims are mapped, bridge-app and Agent Instructions claims are confirmed, and detailed unverified claims are identified.
- Fully new findings: 3
- Partially new findings: 2
- Redundant findings: 0

## Reflection
- What worked and why: Fetching the supplied announcement alongside the current MCP “How it works” page, AI-tools page, and official repository separated marketing-level claims from documented capability boundaries.
- What did not work and why: The repository landing page was too high-level to confirm individual MCP 2.0 tools; it links to the tool directory without presenting that inventory inline.
- What I would do differently: Next iteration should use the official tool directory or official changelog entries to verify the unresolved forms, branches, assets, custom-code, history, analytics, variables, and component subclaims one by one.

## Recommended Next Focus
Use official Webflow per-tool documentation, tool-directory entries, and changelog records to verify the unresolved MCP 2.0 feature subclaims, beginning with variables/components and then forms, assets, custom code, history, and analytics. `[INFERENCE: based on the unresolved claim-to-source gaps identified above]`
