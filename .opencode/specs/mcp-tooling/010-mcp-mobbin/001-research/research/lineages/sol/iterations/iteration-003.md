# Iteration 3: Plan Gating, MCP/API Separation, and Rate Limits

## Focus

Resolve the free-versus-paid boundary without conflating the hosted MCP product with the separately authenticated REST API or with ordinary Mobbin website browsing limits.

## Actions Taken

1. Read the official Mobbin overview comparison of MCP and API.
2. Reviewed the MCP introduction, integration requirements, and product setup page.
3. Read the API quick start and official rate-limit policy.
4. Cross-checked the current pricing comparison for Free, Pro, Team, and Enterprise capabilities.

## Findings

1. MCP access is unavailable on the Free plan and included on every paid plan: Pro, Team, and Enterprise. The official product page says "included in all paid plans," while the docs name the three eligible tiers. The packet should present this as a server-level entitlement gate, not as a tool-by-tool gate. [SOURCE: https://docs.mobbin.com/mcp/introduction] [SOURCE: https://docs.mobbin.com/mcp/build-an-integration] [SOURCE: https://mobbin.com/mcp]
2. No official source reviewed documents different MCP tool sets for Pro versus Team versus Enterprise. The safe contract is one documented MCP surface for eligible paid users; any claim that some MCP tools are Pro-only or Team-only would be invented. [SOURCE: https://docs.mobbin.com/overview] [SOURCE: https://docs.mobbin.com/mcp/introduction] [INFERENCE: plan eligibility is documented, but per-tool entitlement differences are not]
3. The REST API is a distinct integration surface available only to Team and Enterprise plans. It uses a workspace-scoped API key sent as a Bearer token and exposes `POST /v1/screens/search`; this static key must not be repurposed as the MCP credential in `.utcp_config.json`. [SOURCE: https://docs.mobbin.com/overview] [SOURCE: https://docs.mobbin.com/api/quickstart]
4. MCP rate limiting is documented as 60 requests per 60 seconds per user. The API has the same numeric window per workspace. A limit breach returns HTTP 429 plus `Retry-After`; callers should honor that header and use exponential backoff with jitter for continued failures. [SOURCE: https://docs.mobbin.com/rate-limits]
5. The Free website product has limited browsing—latest four apps/sites and limited flows, animations, filter/search results, and app history—but this does not imply a limited free MCP mode. Official MCP eligibility starts at Pro. [SOURCE: https://mobbin.com/pricing] [SOURCE: https://docs.mobbin.com/mcp/introduction]
6. Exact free-account MCP failure behavior is not documented: the reviewed sources do not establish whether OAuth authorization is refused, connection succeeds but tools return an entitlement error, or an upgrade page is shown. Troubleshooting must say `UNKNOWN` for the exact payload/status and advise checking plan eligibility before debugging transport. [SOURCE: https://docs.mobbin.com/mcp/introduction] [SOURCE: https://mobbin.com/mcp] [INFERENCE: eligibility is explicit while the wire-level failure response is absent]
7. Finance+ is a separate Team/Enterprise add-on on the public pricing page. No reviewed MCP source states whether standard MCP searches include Finance+ content, so the transport packet must not promise add-on dataset coverage. [SOURCE: https://mobbin.com/pricing] [INFERENCE: add-on product scope is documented, MCP content entitlement is not]
8. Rate-limit guidance belongs in transport troubleshooting even though the surface is read-only: repeated search calls can still receive 429, and "show me more" follow-ups in the upstream skill can amplify request volume. [SOURCE: https://docs.mobbin.com/rate-limits] [SOURCE: https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md]

## Questions Answered

- Which capabilities are available to free users versus Pro subscribers, and what failure/upgrade behavior must the packet document without guessing? Answered at the entitlement level: Free has no MCP; Pro/Team/Enterprise do. Exact wire-level free-plan failure remains an explicit UNKNOWN.

## Questions Remaining

- Can Code Mode's current UTCP manual schema and transport adapters perform Mobbin's browser OAuth directly?
- If not, what exact `mcp-remote` (or equivalent) stdio bridge invocation preserves OAuth securely?
- What local transport packet surfaces and hub pairing rules are required?
- Can live `tools/list` or an exported schema close the residual single-tool completeness gap?

## Ruled Out

- Reusing a Team/Enterprise REST API key as the MCP credential.
- Describing Free as a limited MCP tier based on the website's limited browsing features.
- Claiming per-tool MCP differences among Pro, Team, and Enterprise without evidence.
- Promising Finance+ content through the base MCP entitlement.

## Dead Ends

- Public documentation does not publish the exact unauthorized/free-entitlement error response, so retrying adjacent pricing/help pages cannot establish its status code or payload.

## Edge Cases

- Ambiguous input: "free vs Pro" could refer to website, MCP, or API. This iteration separates all three.
- Contradictory evidence: none after surface separation.
- Missing dependencies: no Free account was used to probe the OAuth/tool-call failure path.
- Partial success: eligibility and rate limits are authoritative; exact free-plan error payload is unknown.

## Sources Consulted

- https://docs.mobbin.com/overview
- https://docs.mobbin.com/mcp/introduction
- https://docs.mobbin.com/mcp/build-an-integration
- https://docs.mobbin.com/api/quickstart
- https://docs.mobbin.com/rate-limits
- https://mobbin.com/mcp
- https://mobbin.com/pricing
- https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md

## Assessment

- New information ratio: 0.88
- Novelty justification: Six findings are new entitlement/rate-limit facts and two convert earlier workflow facts into concrete troubleshooting constraints.
- Confidence: high for plan eligibility, MCP/API credential separation, and published limits; low for exact free-plan wire error and Finance+ MCP coverage.

## Reflection

- What worked and why: The official overview table cleanly separated OAuth MCP from API-key REST access, preventing a high-risk manual-registration mistake.
- What did not work and why: Pricing pages explain product entitlements but not protocol-level denial responses.
- What I would do differently: Build troubleshooting from documented invariants first and label response payloads UNKNOWN instead of guessing familiar 401/403 semantics.

## Recommended Next Focus

Local integration architecture: inspect `.utcp_config.json`, Code Mode manual schemas, current transport exemplars, and `sk-design` pairing contracts to derive the exact Mobbin manual/packet shape and identify the OAuth bridge decision.
