# Iteration 2: Official Skill and Design-Research Workflow Surface

## Focus

Determine the public tool contract and the authoritative workflow for app, screen, flow, and element research from `mobbin/skills`, while separating MCP retrieval from visual judgment and from optional artifact authoring.

## Actions Taken

1. Enumerated the official skills repository tree and README.
2. Read the complete `skills/mobbin-search/SKILL.md` contract.
3. Cross-checked the skill's examples against the official Mobbin MCP product page and documentation index.
4. Searched official Mobbin repositories/docs for additional named app, flow, or element tools.

## Findings

1. The current official skills repository contains exactly one skill directory, `skills/mobbin-search`, and that skill identifies exactly one required MCP tool by name: `search_screens`. No `search_apps`, `search_flows`, `search_elements`, detail-fetch, or image-fetch tool is documented in the current public repository. [SOURCE: https://github.com/mobbin/skills] [SOURCE: https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md]
2. The documented `search_screens` planning contract has three user-facing inputs: a natural-language query; `platform` constrained by the skill to `ios` or `web`; and `limit`, defaulting to 5 and raised to roughly 15 only when the user asks for variety/count. The skill says the server's deep search handles complex queries, so callers should not prematurely split or over-specify the query. [SOURCE: https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md]
3. `search_screens` returns both structured metadata and inline images in one tool response. The metadata shape is `{ screens: [{index, id, app_name, mobbin_url, image_url, platform}], failed: [...] }`; image blocks follow in the same index order. The official skill explicitly says no download step, secondary Read call, or URL fetch is needed for visual analysis. [SOURCE: https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md] [SOURCE: https://docs.mobbin.com/mcp/introduction]
4. App, flow, and element research are search-and-analysis dimensions rather than separate public tools. Apps are represented by `app_name` and Mobbin links in screen results; a flow is reconstructed/analyzed across a returned sequence/batch of screens; element questions such as bottom sheets or pull-to-refresh are natural-language screen queries. [SOURCE: https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md] [SOURCE: https://mobbin.com/mcp] [INFERENCE: the absence of additional documented tools means the transport packet must not invent tool names for these dimensions]
5. The workflow is staged: preserve the user's wording, infer `ios`/`web` only from clear implementation context (otherwise clarify), choose a conservative limit, announce and call in the same turn, visually inspect every returned image, ground observations in visible details, then either answer directly with Mobbin links or offer a deeper evidence-board format. [SOURCE: https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md]
6. Evidence-board creation is outside the MCP transport boundary. The upstream skill may write a temporary HTML board only after the user selects a structure, but the requested `mcp-mobbin` transport is read-only and should expose retrieval doctrine only. Any local visual artifact must be delegated to a separately authorized authoring/design workflow; it must not make the transport packet `mutatesWorkspace:true`. [SOURCE: https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md] [INFERENCE: packet scope requires read-only Code Mode transport while the upstream agent skill contains an optional write workflow]
7. The official skill's aggressive trigger guidance should not be copied literally into a shared MCP tooling router. A safe transport route should require design-reference intent and pair with `sk-design`; Mobbin supplies evidence while `sk-design` owns taste, selection, and recommendations. [SOURCE: https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md] [INFERENCE: the local parent-hub contract requires transport/judgment separation]

## Questions Answered

- How do the official skills implement app, screen, flow, and element design-research workflows, including staged discovery and image/detail retrieval? Answered: one `search_screens` retrieval path plus visual analysis; other concepts are query/analysis dimensions, not separately documented tools.

## Questions Remaining

- Does authenticated live `tools/list` expose more than the single publicly documented `search_screens` tool?
- What precise JSON Schema field names/types does the live MCP tool advertise beyond the skill-level query/platform/limit contract?
- What does a free account see during authorization or first tool use?
- What Code Mode manual shape can preserve OAuth without a static secret?

## Ruled Out

- Inventing `search_apps`, `search_flows`, `search_elements`, `get_screen`, or `get_image` names from the research topic: none appears in the current official public skill or docs.
- Treating optional HTML evidence-board generation as part of a read-only transport packet.
- Copying the upstream skill's aggressive design-question trigger unchanged into the broader local hub.

## Dead Ends

- Public docs and repository search cannot prove the authenticated live `tools/list` result; that requires a paid authorized account or an exported schema from Mobbin.

## Edge Cases

- Ambiguous input: "app/screen/flow/element workflows" sounds like four tool families, but the official public surface supports only the screen-search tool plus semantic query patterns.
- Contradictory evidence: none; product examples and the official skill agree on screen-image search.
- Missing dependencies: authenticated live tool discovery was unavailable.
- Partial success: the documented tool/workflow surface is authoritative, while completeness against the live server remains explicitly unverified.

## Sources Consulted

- https://github.com/mobbin/skills
- https://raw.githubusercontent.com/mobbin/skills/main/README.md
- https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md
- https://mobbin.com/mcp
- https://docs.mobbin.com/mcp/introduction
- https://docs.mobbin.com/llms.txt

## Assessment

- New information ratio: 0.93
- Novelty justification: Six of seven findings add new workflow/tool-contract facts and one refines the read-only architecture established in iteration 1.
- Confidence: high for the public skill contract; medium for complete live-server enumeration.

## Reflection

- What worked and why: Reading the official skill end-to-end exposed the usable parameters, exact response metadata, and staged visual-analysis behavior that the registration repository omits.
- What did not work and why: Search-engine queries for hypothetical app/flow/element tools found no official definitions; absence is useful negative knowledge but not a live schema dump.
- What I would do differently: Treat "complete tool surface" as two layers—documented public contract and authenticated live discovery—and never merge them into one confidence claim.

## Recommended Next Focus

Plan gating and availability: distinguish free, Pro, Team, and Enterprise across MCP versus REST API; capture official pricing/availability language, rate-limit scope, likely failure modes, and safe UNKNOWN statements.
