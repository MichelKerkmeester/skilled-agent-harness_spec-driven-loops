# Iteration 3: Mutation boundaries and Designer Bridge capability map

## Focus
Investigate the strategy's narrow focus: per-tool mutation confirmation semantics and the complete set of Webflow MCP capabilities that require the Designer Bridge. Authentication details were recorded only where they change the safety boundary. Live Code Mode discovery was not attempted because no authenticated Webflow manual is registered in the packet.

## Findings
1. Webflow documents the Bridge-dependent surface as a bounded set of live-Designer operations: capturing visual snapshots; reading or changing the current selection, page, mode, and branch; navigating the Designer canvas; and reading site breakpoints. The documentation states that creating/editing elements, components, styles, and variables, plus managing CMS content, pages, assets, fonts, and other site data, uses the Data API without the Bridge. The packet should therefore classify Bridge absence by capability and preserve `ModeForbidden`, rather than treating it as a general transport outage. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works]
2. Webflow's public MCP documentation enumerates mutating classes—creating/removing elements, deleting page branches or assets, writing custom code, publishing/unpublishing CMS items, updating or deleting forms, and changing SEO metadata—but does not publish a per-tool confirmation or dry-run contract. The safe repository conclusion is an integration requirement, not a provider guarantee: the caller must classify destructive/production-impacting operations and obtain explicit operator confirmation before invoking them. [SOURCE: https://developers.webflow.com/mcp] [SOURCE: .opencode/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/manual-testing-playbook.md:69-82] [INFERENCE: based on the documented mutating surface and the repository's destructive-test confirmation rule]
3. OAuth authorization is workspace-scoped: each authorization grants access to one workspace, and changing workspaces requires re-authentication; connector clients may require removing and reinstalling the connector. The remote deployment avoids local credentials and uses token authentication with automatic refresh. The Webflow packet should expose workspace scope and re-authentication as operator-visible state, and must not add a guessed environment credential field to the Code Mode manual. [SOURCE: https://developers.webflow.com/mcp] [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works]
4. The documented safety boundary includes more than permission inheritance: the MCP server cannot change site or Workspace access settings, cannot create/apply Webflow Interactions (IX3), and cannot create new localized CMS items; these are provider limitations, not authorization failures. The packet should report these as unsupported-capability outcomes and avoid retrying them as generic permission or transport errors. [SOURCE: https://developers.webflow.com/mcp]

## Ruled Out
- Retrying the guessed MCP authentication URL; prior strategy marks it blocked, and the official overview/how-it-works pages now supply the relevant workspace and remote-authentication constraints.
- Treating every mutation as Bridge-dependent; official documentation explicitly separates Data API-backed mutations from live-Designer operations. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works]
- Claiming provider-enforced confirmation or dry-run behavior; no such per-tool contract was found in the consulted official MCP pages.

## Dead Ends
Live callable names, schemas, and per-tool confirmation metadata remain unverified because the bound packet has no registered/authenticated Webflow manual. A future iteration needs operator-gated discovery; it must fail closed if the live inventory differs from the reviewed packet assumptions.

## Edge Cases
- Ambiguous input: “complete list” was interpreted as the complete Bridge-dependent capability categories explicitly listed by Webflow, not an inferred list of every underlying callable.
- Contradictory evidence: none found between the official overview and how-it-works pages.
- Missing dependencies: authenticated Code Mode discovery and a Webflow tool inventory were unavailable; official documentation was used as the bounded fallback.
- Partial success: Bridge categories and documented provider limitations were resolved; exact callable-level confirmation semantics remain undocumented/unverified.

## Sources Consulted
- https://developers.webflow.com/mcp
- https://developers.webflow.com/mcp/reference/how-it-works
- .opencode/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/manual-testing-playbook.md:69-82
- .opencode/specs/mcp-tooling/015-mcp-webflow/001-deep-research-luna/research/deep-research-strategy.md:172-187

## Assessment
- New information ratio: 0.75 (two findings are fully new to the carried-forward registry; two refine prior Bridge/safety evidence).
- Questions addressed: per-tool mutation confirmation semantics; complete documented Bridge-dependent capability categories; authentication workspace boundary.
- Questions answered: the documented Bridge capability boundary; the absence of a published provider confirmation/dry-run contract.

## Reflection
- What worked and why: Re-reading the official overview and architecture page with a mutation/Bridge-specific lens separated provider limitations, live-Designer requirements, and caller-owned safety controls.
- What did not work and why: Repository search found no Webflow-specific live discovery fixture, so callable-level schemas and confirmation metadata could not be verified.
- What I would do differently: Use an operator-authenticated Code Mode session next, beginning with discovery and `tool_info`, before asserting any individual Webflow callable or schema.

## Recommended Next Focus
Run operator-gated live Webflow Code Mode discovery: confirm the registered manual shape, list callable names, inspect each mutation and Bridge-dependent tool with `tool_info`, and record schema drift or unsupported capabilities without invoking mutations.
