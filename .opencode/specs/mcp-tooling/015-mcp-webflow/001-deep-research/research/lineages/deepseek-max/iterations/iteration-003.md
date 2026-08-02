# Iteration 3: Authentication model, rate limits, and authorization gating

## Focus

Pin down the Q2 authentication surface: remote OAuth mechanics, local token modes, scopes/consent, rate limits, and who may authorize. Also record the live-vs-draft CMS mutation semantics that shape Q5.

## Findings

1. **Remote mode = OAuth, no local credentials.** The server runs remotely "to enable OAuth authentication... authorize multiple Webflow sites without storing API keys locally." Authorization is per-site/per-workspace consent (Claude connector and Cursor plugin both present a "Select the Webflow sites and Workspaces... Authorize App" flow). The remote transport is `mcp-remote` npm package, explicitly labeled **experimental**. [SOURCE: https://developers.webflow.com/data/docs/ai-tools.md]
2. **Local mode = bearer token.** `npx webflow-mcp-server@latest` with `WEBFLOW_TOKEN`. Three token kinds: **Site Token** (single site, internal tools), **Workspace Token** (all sites in workspace; docs recommend read-only monitoring/auditing), **OAuth token** (multi-site user-specific, for public apps). Local mode additionally requires a registered/published MCP Bridge App Designer extension for Designer API tools. [SOURCE: https://developers.webflow.com/data/reference/authentication.md, https://raw.githubusercontent.com/webflow/mcp-server/main/README.md]
3. **Authorization role gate**: only site owners and admins can authorize the MCP server and app — sites of other roles are greyed out. [SOURCE: https://developers.webflow.com/data/docs/ai-tools.md (FAQ)]
4. **Data API rate limits are plan-based**: Starter/Basic 60 req/min; CMS, eCommerce, Business 120 req/min; Enterprise custom. Exceeding returns HTTP 429 with `Retry-After` (~60s). Limits are per API key; `X-RateLimit-Limit`/`X-RateLimit-Remaining` headers are returned. Site Publish is endpoint-limited to **one successful publish per minute**. The official SDK (used by the MCP server) has built-in exponential backoff. [SOURCE: https://developers.webflow.com/data/reference/rate-limits.md]
5. **Designer vs Data gating**: Data API tools work with Webflow closed; Designer API tools require the companion (Bridge) app open in the Designer — it auto-installs to authorized sites after OAuth. [SOURCE: https://developers.webflow.com/data/docs/ai-tools.md]
6. **Live-vs-draft CMS semantics (safety-critical)**: official FAQ states collection items can be "create[d] and delete[d] directly in the live site, or... create queued/drafted items to publish later." So CMS mutations are NOT implicitly draft-safe — the client must choose; publishing is a separate explicit action (`publish_collection_items`). [SOURCE: https://developers.webflow.com/data/docs/ai-tools.md (FAQ), src/tools/cms.ts]
7. **Tool-surface limit**: "the MCP server supports a limited set of tools for the Data and Designer APIs" — it is not a full API passthrough. [SOURCE: https://developers.webflow.com/data/docs/ai-tools.md (FAQ)]

## Sources Consulted

- [SOURCE: https://developers.webflow.com/data/docs/ai-tools.md]
- [SOURCE: https://developers.webflow.com/data/reference/authentication.md]
- [SOURCE: https://developers.webflow.com/data/reference/rate-limits.md]
- [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/cms.ts]

## Assessment

- **newInfoRatio: 0.70** — Auth details, rate limits, and role gate are new; connection modes were known from iteration 1.
- Confidence: high (all official docs). Q2 is now answered: remote OAuth (experimental mcp-remote transport) OR local bearer token (site/workspace/OAuth) with optional Designer bridge app.

## Reflection

- What worked: `.md` suffix on developer docs returns clean markdown; `/data/reference/rate-limits.md` exists though `/data/docs/rate-limits.md` redirects to a 404 page.
- What failed: auth doc at `docs/authentication` redirects (301); canonical is `reference/authentication`.
- Ruled out: workspace token as general-purpose write credential — docs recommend read-only use (Q4-relevant).

## Recommended Next Focus

Non-production test target (Q4): investigate Webflow staging environments, site duplication/backup/restore, and workspace-token limitations; then examine Agent Instructions + Skills + prompt library for integration design (Q6) and workflow/deploy semantics for Q3 classification.
