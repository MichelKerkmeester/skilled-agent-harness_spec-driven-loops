# Iteration 3: Authentication model, authorization gating, and rate limits

## Focus

Pin down the authentication and authorization model (Q2): remote OAuth vs local token mechanics, token types (site/workspace/OAuth), scopes, role gating, and rate limits per plan.

## Findings

1. **Remote mode = OAuth, per-site/workspace authorization, no local credential.** The remote server at `https://mcp.webflow.com/sse` runs OAuth; the user authorizes selected Webflow sites/workspaces in the browser ("Select the Webflow sites and Workspaces ... and click Authorize App"), and tokens are stored locally by the MCP client (`~/.mcp-auth`; reset via `rm -rf ~/.mcp-auth`). Remote authorization relies on the `mcp-remote` npm package, which is **experimental**. Authorization is the only supported connection flow for the remote surface — there is no client-specific flow. [SOURCE: https://developers.webflow.com/data/v2.0.0/docs/ai-tools.md; https://raw.githubusercontent.com/webflow/mcp-server/main/README.md]
2. **Role gate: only site owners and admins can authorize.** Official FAQ: "Currently, only site owners and admins can authorize the MCP server and app. If you aren't a site owner or admin, you can't authorize the MCP server and app." Greyed-out sites on the authorization page are the symptom. [SOURCE: https://developers.webflow.com/data/v2.0.0/docs/ai-tools.md §FAQs]
3. **Local mode = bearer token in `WEBFLOW_TOKEN` env var.** `npx -y webflow-mcp-server@latest` with `WEBFLOW_TOKEN` uses a Data API v2 bearer token (`Authorization: Bearer <token>`). Three token types exist: **Site Token** (single site; "internal tools and single-site integrations"), **Workspace Token** (workspace-level; "best suited for read-only uses, such as monitoring and auditing multiple sites"; **Enterprise-only** and exposes only `workspace_activity:read` — it has NO site scope and cannot access site endpoints like Get Site), and **OAuth token** (multi-site, user-specific; public integrations / Marketplace apps). [SOURCE: https://developers.webflow.com/data/reference/authentication.md; https://developers.webflow.com/data/reference/authentication/workspace-token.md]
4. **Scopes are resource-paired `:read`/`:write`.** Site-level scopes: `assets`, `cms`, `comments`, `components`, `custom_code`, `ecommerce`, `forms`, `pages`, `sites`, `site_config`, `users`, `webhooks`, `workspace` (read/write pairs), plus read-only `site_activity:read`, `authorized_user:read`. Workspace-level: `workspace_activity:read`. **`custom_code:read/write` are available only to Data Client apps — site tokens cannot access custom code endpoints** (relevant to the scripts tool). Each endpoint lists its required scopes. [SOURCE: https://developers.webflow.com/data/v2.0.0/reference/scopes.md]
5. **Rate limits are plan-based and per API key.** Starter/Basic = 60 requests/min; CMS, eCommerce, Business = 120 rpm; Enterprise = custom. Exceeding returns HTTP 429 with `Retry-After` (typically 60 s). Rate limit tracking headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`. Limits apply per API key, independent across keys. **Endpoint-specific limit: Site Publish is limited to one successful publish per minute.** [SOURCE: https://developers.webflow.com/data/v2.0.0/reference/rate-limits.md]
6. **Retry behavior.** The official Webflow SDK includes built-in exponential backoff for 429s; non-SDK consumers must respect `Retry-After`. Webhooks are recommended over polling to avoid rate-limit pressure. [SOURCE: https://developers.webflow.com/data/v2.0.0/reference/rate-limits.md]
7. **Token lifecycle and security practices.** Tokens revoked from Site Settings or programmatically via OAuth revoke endpoint; docs prescribe env-var storage, rotation, minimal scopes, and graceful expiry handling. [SOURCE: https://developers.webflow.com/data/reference/authentication.md]

## Sources Consulted

- [SOURCE: https://developers.webflow.com/data/v2.0.0/docs/ai-tools.md] (role gate FAQ, companion app install)
- [SOURCE: https://developers.webflow.com/data/reference/authentication.md]
- [SOURCE: https://developers.webflow.com/data/reference/authentication/workspace-token.md]
- [SOURCE: https://developers.webflow.com/data/v2.0.0/reference/scopes.md]
- [SOURCE: https://developers.webflow.com/data/v2.0.0/reference/rate-limits.md]
- [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/README.md]

## Assessment

- **newInfoRatio: 0.70** — Token types, scopes, role gate, and rate-limit numbers are net-new; connection-mode existence carried from iteration 1.
- Confidence: high — all claims from official developer docs. Residual unknown: whether the remote OAuth token for MCP carries site-scope granularity identical to Data Client app OAuth (docs describe per-site authorization, exact scope set on the MCP OAuth app not published).

## Reflection

- What worked: `/data/reference/*.md` paths give clean official markdown; FAQ section answered the role-gate question directly.
- What failed: `v2.0.0/docs/authentication.md` 404'd — correct path is `/data/reference/authentication.md`; initial scopes URL guess needed correction.
- Ruled out: workspace token as a general write credential for local mode (Enterprise-only, workspace_activity:read only, no site scope).

## Recommended Next Focus

Permission scopes + publish semantics + non-production test target (Q4): what a safe live-smoke setup looks like (test workspace/site, read-only scope baseline, `publishToWebflowSubdomain` staging behavior), plus publish confirmation semantics for Q5.
