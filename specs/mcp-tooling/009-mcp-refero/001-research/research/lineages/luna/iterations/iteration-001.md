# Iteration 001

## Focus

Establish the authoritative Refero MCP inventory, input/output contracts, authentication and quota behavior, official skill workflows, access-tier gating, and implications for a read-only Code Mode transport paired with `sk-design`.

## Actions Taken

- Read the existing local transport manual in `.utcp_config.json` and the lineage strategy/config.
- Consulted the current official Refero MCP documentation: getting started, tools, data model, examples, plans, and business integration pages.
- Consulted the official `referodesign/refero_skill` README, `SKILL.md`, and `references/mcp-tools.md`.
- Attempted an unauthenticated live `initialize` request to `https://api.refero.design/mcp`; DNS resolution was unavailable in this execution environment, so runtime schema/auth behavior was not independently probed.

## Findings

### 1. Current authoritative tool inventory is eight tools

The current official documentation lists eight tools in three layers; the repository's `references/mcp-tools.md` is stale because it documents only the four screen/flow tools and omits styles, screenshot images, and similar screens. The current inventory and contracts are:

| Tool | Required inputs | Optional inputs | Output contract documented by Refero |
|---|---|---|---|
| `refero_search_styles` | `query: string` | `page: number` (default 1), `response_format: "md"|"json"` when supported | Pagination plus compact style records: `uuid`, `title`, `url`, `platform`, `preview_url`, `description`. |
| `refero_get_style` | Exactly one of `style_id: string` or `style_ids: string[]` | `response_format` | Full style guidance: visual thesis, theme, color roles, typography/type scale, spacing, layout, elevation, components, imagery, do/don't rules, and custom implementation notes. |
| `refero_search_screens` | `query: string`, `platform: "web"|"ios"` | `page`, `response_format` | Pagination plus screen records containing UUID, platform, URLs, site metadata, page types, UX patterns, UI elements, colors/fonts where available, and content description. |
| `refero_get_screen` | Exactly one of `screen_id: string` or `screen_ids: string[]` | `response_format` | Full screen metadata and content: site, platform, URLs, fonts, page types, UX patterns, UI elements, and `content.description/layout/functions`. Current docs explicitly say not to pass `image_size` or `include_similar` here. |
| `refero_get_similar_screens` | `screen_id: string` | `limit: number`, range 1–20, default 10; `response_format` | Visually/functionally related screen records using the screen shape. |
| `refero_get_screen_image` | `screen_id: string` | `image_size: "thumbnail"|"full"`, default thumbnail; `response_format` | Raw screenshot image content. |
| `refero_search_flows` | `query: string`, `platform: "web"|"ios"` | `page`, `response_format` | Pagination plus flow records: numeric `id`, platform, name, screen count, Refero URL, description, problem, compact steps, and site metadata. |
| `refero_get_flow` | Exactly one of `flow_id: number` or `flow_ids: number[]` | `response_format` | Complete flow with site, steps, goals, user actions, system responses, related screen metadata, and `related_queries`. |

Important identifier distinction: screens and styles use UUID strings; flows use numeric IDs. The current docs use `page` pagination for search tools. The older skill reference mentions `limit`/`offset` response shapes and old screen IDs in examples; packet authoring should follow current official docs and label the repository reference as stale.

There are no separate `search_apps` or `search_elements` tools in the current official inventory. App/product research is expressed through semantic `query` terms (company/product/industry) and returned `site` metadata; element research is expressed through query terms and the returned `ui_elements` field. This answers the requested app/element workflow without inventing tools.

Sources: [official tools](https://doc.refero.design/mcp/tools), [official data model](https://doc.refero.design/mcp/data-model).

### 2. Search workflow is styles → screens → flows, with targeted expansion

For visual work, the official skill mandates styles first: search several visual angles, retrieve a few full styles, select one primary foundation, and borrow only bounded details. Use screen search for concrete structure, states, content hierarchy, components, and product patterns; retrieve full screens and optionally similar screens or raw images. Use flow search for multi-step journeys, then retrieve full flow details including goals, actions, system responses, recovery, and related queries. Batch detail calls modestly (`style_ids`, `screen_ids`, `flow_ids`) to control context size.

For app/company research, include the product name in screen/flow queries and inspect the returned `site` object. For element research, query literal UI terms such as `table`, `modal`, `toggle`, or `empty state`, then use `ui_elements`, `ux_patterns`, and `page_types` to compare results. Platform is required for current screen/flow search (`web` or `ios`); style search has no platform parameter and is primarily desktop/web marketing coverage.

The skill’s judgment layer is explicit: do not copy one reference, do not average conflicting references into a generic midpoint, preserve source token/media roles, synthesize a reference lock/decision ledger, and validate substantial visual work against the locked target. These are judgment rules for `sk-design`, not MCP transport behavior.

Sources: [official skill](https://github.com/referodesign/refero_skill/blob/master/SKILL.md), [skill tool reference](https://github.com/referodesign/refero_skill/blob/master/references/mcp-tools.md), [official examples](https://doc.refero.design/mcp/examples).

### 3. Authentication and transport

The official endpoint is `https://api.refero.design/mcp` over remote HTTP MCP. Current docs state authorization may be OAuth or `Authorization: Bearer <token>`; if OAuth is used, the client opens a sign-in flow. The repository skill README describes the first call opening a browser and then becoming automatic, while also showing Bearer-token configuration for clients that use static credentials.

The existing local manual wraps this endpoint in stdio via `npx -y mcp-remote https://api.refero.design/mcp`, with an empty environment. Therefore the transport packet should preserve that manual shape, describe `mcp-remote` as the stdio bridge to the remote HTTP endpoint, and document that actual OAuth/token persistence is client/mcp-remote setup dependent. It must not claim that an empty `env` proves anonymous access. An unauthenticated live probe could not run because this environment could not resolve the API hostname.

Sources: [official getting started](https://doc.refero.design/mcp/getting-started), [repository README](https://github.com/referodesign/refero_skill#connect-live-design-research), [local manual](../../../../../../../../.utcp_config.json).

### 4. Free vs paid and limits

The official plans page says Free has limited web search results and explicitly has no MCP, Refero Skill, or Figma plugin access. Pro unlocks full search results, user flows, downloads, MCP, and the skill. Official MCP getting-started docs state Pro includes 8,000 MCP tool calls per month; business plans provide higher/custom limits. Business documentation additionally describes usage-based pricing as an example of `$0.001/request` with a `$2,000` minimum commitment, not as a general consumer-plan rate limit.

No per-minute, per-tool, concurrency, or HTTP status rate limits are documented in the authoritative pages reviewed. The packet should state only the documented 8,000 monthly Pro quota and “higher/custom limits” for business, and route quota/auth failures to troubleshooting rather than inventing retry numbers.

Sources: [official plans](https://doc.refero.design/help/plans), [official MCP limits](https://doc.refero.design/mcp/getting-started), [business usage](https://doc.refero.design/mcp/business).

### 5. Transport-packet constraints

The later authoring spec and local manual establish the implementation boundary: read-only, `mutatesWorkspace:false`, no Write/Edit/Task, Code Mode as the only dispatch path, and mandatory cross-hub pairing with `sk-design` because Refero supplies evidence while `sk-design` owns taste/judgment. The packet should expose the eight current names and contracts, retain the existing `mcp-remote` stdio snippet byte-shape, call out stale repository docs, and distinguish documented contracts from unverified live behavior.

## Questions Answered

- Complete current inventory and contracts: answered from official docs, with stale-repository discrepancy recorded.
- Authentication and limits: OAuth or Bearer; Pro quota is 8,000 MCP calls/month; finer-grained throttling is undocumented.
- App/screen/flow/element workflows: answered; there are no separate app/element tools, and those concepts map to query plus `site`/`ui_elements` metadata.
- Free vs paid: answered; Free excludes MCP/skill, Pro enables them and full results/flows.
- Packet constraints: answered from local manual and downstream authoring boundary.

## Questions Remaining

- Live endpoint `tools/list` schema and actual unauthenticated/OAuth challenge behavior remain unverified due to DNS failure in this environment.
- Whether `mcp-remote` itself persists OAuth credentials in the target runtime, and the exact CLI flags needed for static Bearer headers, should be verified during packet installation testing.
- The GitHub skill’s `references/mcp-tools.md` should be reconciled against current docs during authoring; its older parameter/response examples must not be copied as current contracts.

## Next Focus

Verify the endpoint/tool schema and mcp-remote auth behavior if network access is available; otherwise deepen the packet-ready troubleshooting and source-confidence matrix using the official docs and local transport exemplar.
