# Iteration 3: Official Webflow authentication, authorization, and test-target boundaries

## Focus
This iteration investigated the explicit dispatch focus: Webflow MCP and Data API authentication, OAuth, token types, scopes, role gates, secret handling, and documented non-production implications. The dispatch focus conflicts with a stale strategy entry that marked authentication as blocked because it had been deferred in iteration 2; the open registry question Q3 and this iteration prompt are more specific, so the authentication focus was selected. Non-production was interpreted narrowly as documented beta, sandbox, staging, or test-target guidance rather than inferred environment names.

## Findings
1. The current remote MCP path is OAuth-based: the client connects to Webflow's remote MCP server, the user authorizes selected sites or workspaces, and Webflow describes token-based access with automatic refresh and no local API-key storage. The current setup documentation says authorization installs the companion app automatically. `[SOURCE: https://developers.webflow.com/mcp/reference/getting-started.md]` `[SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md]`
2. Remote MCP authorization is constrained by Webflow account governance rather than by a separately documented MCP scope list: the MCP documentation says agents operate within the user's existing permissions, roles, and custom roles, and the AI-tools documentation states that only site owners and admins can authorize the MCP server and app. Each MCP authorization is limited to one workspace; using another workspace requires re-authentication. `[SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md]` `[SOURCE: https://developers.webflow.com/data/docs/ai-tools.md]` `[SOURCE: https://developers.webflow.com/mcp/reference/overview.md]`
3. Webflow documents three distinct Data API credential models that must not be conflated: OAuth Data Client apps use the Authorization Code Grant and exchange a single-use authorization code for an access token; site tokens are site-scoped tokens created by site administrators; workspace tokens are Enterprise-only tokens for workspace resources and audit logs, created by workspace administrators. The official MCP repository separately documents a local stdio deployment driven by the `WEBFLOW_TOKEN` environment variable, so local token mode and remote OAuth mode are different deployment paths. `[SOURCE: https://developers.webflow.com/data/v2.0.0/reference/oauth-app.md]` `[SOURCE: https://developers.webflow.com/data/v2.0.0/reference/authentication/site-token.md]` `[SOURCE: https://developers.webflow.com/data/v2.0.0/reference/authentication/workspace-token.md]` `[SOURCE: https://github.com/webflow/mcp-server]`
4. Data API permissions are scope-driven and resource-specific. Site-level scopes include paired `:read`/`:write` permissions for assets, CMS, comments, components, custom code, ecommerce, forms, pages, sites, users, and workspace resources, plus read-only scopes such as `authorized_user:read` and `site_activity:read`; workspace-level tokens use `workspace_activity:read`. `custom_code:*` is available to Data Client apps but not site tokens, and workspace tokens do not carry the site scope. OAuth install URLs must request only scopes registered for the app. `[SOURCE: https://developers.webflow.com/data/reference/scopes.md]` `[SOURCE: https://developers.webflow.com/data/v2.0.0/reference/oauth-app.md]` `[SOURCE: https://developers.webflow.com/data/v2.0.0/reference/authentication/workspace-token.md]`
5. Webflow's official secret-handling guidance requires client secrets, OAuth access tokens, and API tokens to stay out of source and terminal output: the OAuth tutorial uses environment variables for client credentials and recommends secure database or environment-variable storage for access tokens; site/workspace token guidance says to copy generated tokens to a secure location, use minimal scopes, mint per-use-case tokens, rotate/revoke them, and avoid reuse. OAuth authorization codes are single-use and valid for 15 minutes; site/workspace tokens expire after 365 consecutive days of inactivity and can be revoked. No fetched official source documents a production-like staging sandbox or a separate non-production credential class. The getting-started page does identify a Beta MCP server for in-development functionality, but it does not establish that Beta is an isolated staging environment. `[SOURCE: https://developers.webflow.com/data/v2.0.0/reference/oauth-app.md]` `[SOURCE: https://developers.webflow.com/data/v2.0.0/reference/authentication/site-token.md]` `[SOURCE: https://developers.webflow.com/data/v2.0.0/reference/authentication/workspace-token.md]` `[SOURCE: https://developers.webflow.com/mcp/reference/getting-started.md]`

## Ruled Out
- Webflow MCP tool calls, OAuth handshakes, token generation, and credential testing were not attempted because the dispatch explicitly forbids MCP tool invocation and credential use.
- Non-official authentication articles, community guidance, and third-party repositories were excluded to preserve the official Webflow-source boundary.
- Three guessed unversioned Data API auth URLs returned official “Page Not Found” responses; the official `llms.txt` index was used to locate the canonical versioned OAuth, site-token, workspace-token, and scopes references. `[SOURCE: https://developers.webflow.com/data/docs/authenticating]` `[SOURCE: https://developers.webflow.com/data/docs/oauth]` `[SOURCE: https://developers.webflow.com/data/docs/authorization]` `[SOURCE: https://developers.webflow.com/llms.txt]`

## Dead Ends
The strategy's authentication-blocked entry was a prior deferral, not evidence that Q3 was unanswerable. It was not retried as an earlier web-search approach; instead, the canonical documentation index and versioned references were used. The official material still leaves the staging/sandbox question unresolved.

## Edge Cases
- Ambiguous input: “non-production/staging” was limited to what Webflow officially documents as Beta, sandbox, staging, or test-target behavior; no environment was invented.
- Contradictory evidence: current deployed MCP docs describe remote OAuth, while the official OSS repository documents a local stdio path using `WEBFLOW_TOKEN`; these are treated as separate deployment modes, not interchangeable credentials. `[INFERENCE: comparing https://developers.webflow.com/mcp/reference/how-it-works.md and https://github.com/webflow/mcp-server]`
- Missing dependencies: no official source found in the fetched documentation defines a staging sandbox or non-production credential type; Beta is the only explicit alternative test-like surface found, and its isolation properties remain unknown. `[INFERENCE: based on https://developers.webflow.com/mcp/reference/getting-started.md and https://developers.webflow.com/llms.txt]`
- Partial success: authentication, OAuth, token, scope, role, and secret rules were mapped; non-production isolation was not confirmed. The iteration is complete for the available evidence, with that limitation carried forward.

## Sources Consulted
- https://developers.webflow.com/mcp/reference/getting-started.md
- https://developers.webflow.com/mcp/reference/how-it-works.md
- https://developers.webflow.com/mcp/reference/overview.md
- https://developers.webflow.com/data/docs/ai-tools.md
- https://developers.webflow.com/data/v2.0.0/reference/oauth-app.md
- https://developers.webflow.com/data/v2.0.0/reference/authentication/site-token.md
- https://developers.webflow.com/data/v2.0.0/reference/authentication/workspace-token.md
- https://developers.webflow.com/data/reference/scopes.md
- https://developers.webflow.com/llms.txt
- https://github.com/webflow/mcp-server

## Assessment
- New information ratio: 0.90
- Questions addressed: Q3: What authentication, OAuth, token, scope, role, and secret-handling rules apply?
- Questions answered: Q3 is substantially answered for remote MCP and Data API credential paths; documented staging isolation remains open.
- Fully new findings: 4
- Partially new findings: 1 (role enforcement extends the prior MCP governance finding)

## Reflection
- What worked and why: starting from the official documentation index and following its versioned authentication references avoided stale unversioned paths and exposed the distinct OAuth, site-token, and workspace-token models.
- What did not work and why: the initial unversioned authentication URL guesses were obsolete and returned Page Not Found; they did not provide evidence about current auth behavior.
- What I would do differently: next iteration should use the official operational-reference index first, then compare current changelog and endpoint documentation for rate limits, token lifecycle changes, and error behavior without attempting live calls.

## Recommended Next Focus
Q4: official rate limits, pagination, errors, retries, publishing constraints, and changelog evolution. Keep the staging/sandbox boundary as an explicit unresolved question and verify whether Webflow documents a test workspace, Beta isolation, or other non-production safety boundary.
