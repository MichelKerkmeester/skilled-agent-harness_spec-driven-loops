# Research Synthesis: Webflow MCP 2.0 (luna-fast lineage)

Detached fan-out lineage for Phase 1. Executor: `cli-opencode` with `openai/gpt-5.6-luna-fast` and `xhigh` reasoning. Five iterations ran to the configured `max-iterations` stop; convergence was telemetry only. No Webflow tools, credentials, OAuth handshakes, mutations, publish calls, or deployment actions were used.

## 1. Executive Summary

Webflow MCP 2.0 is a broad official capability expansion, but the announcement is not sufficient as an implementation contract. Current Webflow documentation advertises a remote Streamable HTTP endpoint at `/mcp`, OAuth authorization, site/workspace permission boundaries, Agent Instructions, and a Bridge App boundary for live Designer state. The public `webflow/mcp-server` repository documents a separate local stdio deployment using `WEBFLOW_TOKEN`; its README still shows `/sse` and omits resources, creating a version-surface contradiction that must be handled explicitly. `[SOURCE: https://webflow.com/blog/mcp-2-features]` `[SOURCE: https://developers.webflow.com/mcp/reference/getting-started.md]` `[SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md]` `[SOURCE: https://github.com/webflow/mcp-server]`

The safe integration posture is transport-first and fail-closed: classify actions as read-only, draft/write, destructive, publish, or deployment; require progressively stronger confirmations and rollback/read-back evidence; keep publishing as a separate gate; honor `Retry-After`; never blindly replay ambiguous non-idempotent writes; and require `sk-design` to own design judgment. Staging isolation, idempotency/replay guarantees, and universal pagination remain explicit blockers, not defaults.

## 2. Research Questions

| ID | Question | Result |
|---|---|---|
| Q1 | What did MCP 2.0 add and what is confirmed? | Partially answered; headline categories mapped, detailed subclaims separated into confirmed and unresolved. |
| Q2 | What is the server surface, transport, setup, and capability boundary? | Substantially answered; remote/local version parity remains unresolved. |
| Q3 | What auth, token, scope, role, and secret rules apply? | Substantially answered; staging isolation remains unresolved. |
| Q4 | What operational constraints and change history matter? | Substantially answered; idempotency and universal pagination remain unresolved. |
| Q5 | What safe integration and confirmation model follows? | Substantially answered as a recommendation, not a live capability certification. |

## 3. Methodology and Evidence Rules

Five focused iterations used the supplied announcement, current official Webflow MCP and Data API documentation, versioned authentication references, dated changelog entries, the official `webflow/mcp-server` repository, and local `mcp-tooling`/`sk-design` conventions. Official sources lead. Findings distinguish `[SOURCE: ...]` facts from `[INFERENCE: ...]` recommendations or absence claims. Invalid guessed documentation paths were recorded as dead ends rather than replaced with unofficial sources.

## 4. MCP 2.0 Announcement Claims

The announcement describes screenshot-informed component creation, component props/variants/slots/metadata, CSS-variable collections, Agent Instructions, forms and submissions, page branches and permissions, asset management and image compression, custom code, Enterprise history, and analytics. `[SOURCE: https://webflow.com/blog/mcp-2-features]`

The "no more Bridge App" claim is bounded rather than absolute. Current documentation confirms that most Data API work can run without the Bridge App, while live Designer state such as snapshots, current selection/page/mode/branch, canvas navigation, and breakpoint reads still requires it. Agent-authored site context is also documented as markdown rules/skills with primitive references, shared-library distribution, mode awareness, role enforcement, and activity logging. `[SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md]`

The consulted primary pages did not confirm every detailed announcement sub-operation, including variable reordering/modes, component props/variants/slots/metadata, screenshot-to-component generation, forms/submissions, page-branch workflows, image compression formats, Enterprise history queries, or traffic analytics queries. These are verification gaps, not proof of absence. `[INFERENCE: comparing https://webflow.com/blog/mcp-2-features, https://developers.webflow.com/mcp/reference/how-it-works.md, and https://developers.webflow.com/data/docs/ai-tools]`

## 5. Official Remote Surface

Current Webflow registry metadata and setup guides advertise `com.webflow/mcp` version `2.0.0` over Streamable HTTP at `https://mcp.webflow.com/mcp`. Webflow documents manual connection for MCP-compatible clients and explicit setup paths for Claude Desktop, Claude Code, Cursor, Postman, and Windsurf. `[SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/server.json]` `[SOURCE: https://developers.webflow.com/mcp/reference/getting-started.md]`

The official repository README still shows `https://mcp.webflow.com/sse` for older Cursor/Claude Desktop configuration. Treat `/mcp` versus `/sse` as versioned surface drift until the deployed endpoint contract and repository release are aligned. `[INFERENCE: comparing https://raw.githubusercontent.com/webflow/mcp-server/main/server.json, https://developers.webflow.com/mcp/installing/claude-code.md, and https://github.com/webflow/mcp-server]`

## 6. Official Local OSS Surface

The repository exposes a local `dist/index.js` executable, launches through `npx webflow-mcp-server@latest`, requires `WEBFLOW_TOKEN`, constructs a `WebflowClient`, registers tool groups, and connects an `StdioServerTransport`. This is a distinct local deployment path, not interchangeable with remote OAuth. `[INFERENCE: based on https://raw.githubusercontent.com/webflow/mcp-server/main/package.json, https://raw.githubusercontent.com/webflow/mcp-server/main/README.md, and https://raw.githubusercontent.com/webflow/mcp-server/main/src/index.ts]`

The source taxonomy separates Data API groups, live Designer groups, rules, and local Designer connection tools. Current deployed documentation describes read-only MCP resources and a Webflow Guide, while the repository README says prompts/resources are absent. Do not assume the public OSS snapshot and remote service are identical. `[INFERENCE: comparing https://developers.webflow.com/mcp/reference/how-it-works.md, https://github.com/webflow/mcp-server, and https://raw.githubusercontent.com/webflow/mcp-server/main/src/mcp.ts]`

## 7. Authentication and Authorization

Remote MCP uses OAuth with selected site/workspace authorization, automatic refresh, and no local API-key storage. Authorization installs the companion app automatically. Agent actions remain bounded by existing user permissions, roles, and custom roles; only site owners/admins can authorize the MCP server/app, and an authorization is limited to one workspace. `[SOURCE: https://developers.webflow.com/mcp/reference/getting-started.md]` `[SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md]` `[SOURCE: https://developers.webflow.com/data/docs/ai-tools.md]`

Webflow documents separate Data API credential models: OAuth Data Client apps use Authorization Code Grant; site tokens are site-scoped and created by site administrators; workspace tokens are Enterprise-only workspace credentials created by workspace administrators. The local repository path uses `WEBFLOW_TOKEN`. `[SOURCE: https://developers.webflow.com/data/v2.0.0/reference/oauth-app.md]` `[SOURCE: https://developers.webflow.com/data/v2.0.0/reference/authentication/site-token.md]` `[SOURCE: https://developers.webflow.com/data/v2.0.0/reference/authentication/workspace-token.md]` `[SOURCE: https://github.com/webflow/mcp-server]`

## 8. Scopes and Secret Handling

Permissions are resource-specific, generally paired as `:read` and `:write`. OAuth install URLs must request registered scopes; workspace tokens do not provide site scope; and `custom_code:*` is available to Data Client apps but not site tokens. `[SOURCE: https://developers.webflow.com/data/reference/scopes.md]` `[SOURCE: https://developers.webflow.com/data/v2.0.0/reference/oauth-app.md]` `[SOURCE: https://developers.webflow.com/data/v2.0.0/reference/authentication/workspace-token.md]`

Official guidance is to use minimal scopes, separate tokens by use case, store secrets securely, rotate/revoke them, and keep values out of source and terminal output. OAuth codes are single-use and time-limited; no credential values belong in this packet. `[SOURCE: https://developers.webflow.com/data/v2.0.0/reference/oauth-app.md]` `[SOURCE: https://developers.webflow.com/data/v2.0.0/reference/authentication/site-token.md]` `[SOURCE: https://developers.webflow.com/data/v2.0.0/reference/authentication/workspace-token.md]`

## 9. Action Taxonomy

The recommended adapter taxonomy is:

| Class | Examples | Default posture |
|---|---|---|
| Read-only | resources, guide/schema reads, list/get/inspect, read-back verification | Allow after exact capability and target discovery. |
| Draft/write | content, styles, pages, assets, CMS, component updates without publish | Preview; require exact target, scope, postcondition, and rollback/read-back plan. |
| Destructive | delete, clear, bulk replacement, irreversible custom-code/content changes | Omit from default route; require explicit identifiers and rollback evidence. |
| Publish | any Webflow publish queue request | Separate fresh confirmation after writes verify. |
| Deployment | production-facing consequence of publishing | Separate production decision and status verification; never infer from write success. |

This taxonomy is an integration recommendation derived from official publish/error boundaries and local transport conventions, not a claim that every remote tool has been exhaustively inventoried. `[INFERENCE: based on https://developers.webflow.com/data/reference/sites/publish, .opencode/skills/mcp-tooling/mcp-figma/references/tool-surface.md:46-55,169-205, and .opencode/skills/mcp-tooling/mcp-click-up/examples/README.md:89-98]`

## 10. Operational Constraints

Data API limits are plan-based: 60 requests/minute for Starter/Basic, 120 for CMS/eCommerce/Business, and custom for Enterprise. Responses expose `X-RateLimit-Remaining`, `X-RateLimit-Limit`, and `Retry-After`; endpoint-specific limits can be stricter. `[SOURCE: https://developers.webflow.com/data/reference/rate-limits]`

The official CMS collection-item workflow uses offset pagination with `limit` capped at 100 and `pagination.total`, `pagination.limit`, and `pagination.offset`. This is endpoint-scoped evidence, not a universal MCP/Data API pagination contract. Errors use standard HTTP classes with structured `code`, `message`, `externalReference`, and `details`; SDKs provide exponential backoff and custom clients should honor `Retry-After`. `[SOURCE: https://developers.webflow.com/data/docs/working-with-the-cms/manage-collections-and-items.md]` `[SOURCE: https://developers.webflow.com/data/reference/error-handling.md]`

No consulted official source established an idempotency key or replay guarantee. Automatic replay of ambiguous non-idempotent writes is therefore unsafe; use bounded retries only for clearly retryable failures, honor `Retry-After`, and perform read-back or operator review after an ambiguous outcome. `[INFERENCE: absence of idempotency-key and replay semantics in the consulted official retry, error, rate-limit, and publish references]`

## 11. Publishing and Deployment

Publishing is an explicit permissioned boundary. `POST /v2/sites/{site_id}/publish` requires `sites:write`, accepts explicit domain/subdomain inputs and optional page scope, returns `202` when accepted, and is limited to one successful publish queue per minute. Publishing staged pages to production can publish all staged changes, so page-level edits do not imply page-level production isolation. `[SOURCE: https://developers.webflow.com/data/reference/sites/publish]` `[SOURCE: https://developers.webflow.com/data/docs/working-with-the-cms/manage-collections-and-items.md]`

## 12. Changelog and Capability Drift

Webflow's dated changelog shows breaking evolution within days: a July 27 `translatable=true` contract was changed on July 29 to a target secondary-locale ID. The newer contract makes boolean values return 400, requires a valid secondary locale, and documents additional 403/500 cases. Integrations need version-aware preflight and changelog monitoring. `[SOURCE: https://developers.webflow.com/home/changelog/2026/7/27.md]` `[SOURCE: https://developers.webflow.com/home/changelog/2026/7/29.md]`

## 13. mcp-tooling Integration Recommendation

Register Webflow as a thin transport leaf, not as a workflow or design-judgment system. Keep the transport responsible for endpoint/tool discovery, auth-mode selection, structured evidence, operation classification, and safety gates. Do not put credentials in docs, config, logs, prompts, or generated research. Treat remote `/mcp` and local stdio as separate explicit modes until version parity is proven. `[SOURCE: .opencode/skills/mcp-tooling/SKILL.md:13-15,51-66,138-161]` `[SOURCE: .opencode/skills/mcp-tooling/mode-registry.json:17-29]`

## 14. sk-design Pairing

Design-affecting Webflow work must hand judgment to `sk-design`; the transport should return capability and state evidence but never issue taste, accessibility, or readiness verdicts. Data/API-only work does not require design judgment. This preserves the local hub rule that transport packets do not own taste or acceptance. `[SOURCE: .opencode/skills/sk-design/SKILL.md:181-191,279-285]` `[SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/manual-testing-playbook/pairing/sk-design-pairing.md:13-33,39-55]`

## 15. Recommendations

1. Default to remote OAuth with explicit workspace/site selection and least-privilege permissions; support local `WEBFLOW_TOKEN` only as a separately documented deployment mode.
2. Discover and version the exact remote tool/schema surface before enabling writes; do not infer current parity from the public README.
3. Allow read-only discovery first, then require a preview and explicit approval for draft/write, destructive, publish, and deployment classes with increasing evidence requirements.
4. Treat publish as a separate production gate with domain scope, staged-change blast-radius warning, `sites:write` proof, fresh approval, and post-queue verification.
5. Honor rate headers and `Retry-After`; never blind-replay non-idempotent operations or silently publish after writes.
6. Make pagination and capability metadata tool-specific and keep a changelog/version preflight.
7. Block implementation approval until staging isolation, idempotency/replay, and endpoint-wide pagination contracts are resolved or explicitly accepted by an operator.

## Eliminated Alternatives

| Approach | Reason eliminated | Evidence | Iterations |
|---|---|---|---|
| Treat the announcement as the complete implementation contract | Detailed subclaims remain unconfirmed in fetched primary docs. | `[INFERENCE: comparing announcement, MCP docs, and AI-tools docs]` | 1 |
| Treat `/sse` and `/mcp` as interchangeable current endpoints | Official README and current registry/setup docs are version-skewed. | `[INFERENCE: server.json, setup guides, repository README]` | 2 |
| Treat Beta as an isolated staging sandbox | No official source documented isolation or a non-production credential class. | `[INFERENCE: getting-started and auth references]` | 3, 5 |
| Blindly replay non-idempotent writes | No idempotency-key or replay guarantee was found. | `[INFERENCE: error, rate-limit, and publish references]` | 4, 5 |
| Treat CMS offset pagination as universal | Only the CMS workflow was documented with that contract. | `[SOURCE: CMS workflow]` | 4, 5 |
| Automatically publish after a successful write | Publishing has independent permissions, queue limits, and staged-change blast radius. | `[SOURCE: publish reference]` | 4, 5 |

## Divergence Map

- Remote/deployed surface: Streamable HTTP `/mcp`, resources, OAuth.
- Public OSS surface: local stdio, `WEBFLOW_TOKEN`, README `/sse`, resources omitted.
- Confirmed gaps: staging isolation, idempotency/replay, universal pagination, several announcement sub-features.
- No divergent pivot was used; the loop was forced to five iterations by policy.

## Open Questions

1. Is the remote `/mcp` endpoint and resource surface tied to a published server version that can be reconciled with the current repository release?
2. What Webflow-supported test workspace/site or staging isolation contract is safe for later live smoke testing?
3. Does each mutating endpoint provide idempotency or replay semantics not present in the general error/rate-limit docs?
4. What pagination and continuation schema applies to each MCP list operation outside the CMS workflow?
5. Which detailed MCP 2.0 announcement claims have corresponding versioned tool schemas or changelog entries?

## Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 5
- Questions answered: 5/5 at substantial coverage; three blocking evidence gaps remain explicit
- New information ratios: 0.80, 0.90, 0.90, 1.00, 0.93
- Average newInfoRatio: 0.91
- Convergence mode: off; early convergence was telemetry only
- Quality: official-source diversity, focus alignment, and negative knowledge preserved

## References

- https://webflow.com/blog/mcp-2-features
- https://developers.webflow.com/mcp/reference/getting-started.md
- https://developers.webflow.com/mcp/reference/how-it-works.md
- https://developers.webflow.com/data/docs/ai-tools.md
- https://developers.webflow.com/data/reference/scopes.md
- https://developers.webflow.com/data/reference/rate-limits
- https://developers.webflow.com/data/reference/error-handling.md
- https://developers.webflow.com/data/reference/sites/publish
- https://developers.webflow.com/data/docs/working-with-the-cms/manage-collections-and-items.md
- https://developers.webflow.com/data/v2.0.0/reference/oauth-app.md
- https://developers.webflow.com/data/v2.0.0/reference/authentication/site-token.md
- https://developers.webflow.com/data/v2.0.0/reference/authentication/workspace-token.md
- https://developers.webflow.com/home/changelog/2026/7/27.md
- https://developers.webflow.com/home/changelog/2026/7/29.md
- https://raw.githubusercontent.com/webflow/mcp-server/main/server.json
- https://github.com/webflow/mcp-server
- .opencode/skills/mcp-tooling/SKILL.md
- .opencode/skills/mcp-tooling/mode-registry.json
- .opencode/skills/sk-design/SKILL.md
