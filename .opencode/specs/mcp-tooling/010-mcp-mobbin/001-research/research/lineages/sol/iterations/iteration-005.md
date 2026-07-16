# Iteration 5: Adversarial Completeness and Risk Audit

## Focus

Challenge the proposed surface and wiring at the public protocol boundary, separate what can be proven without credentials from what requires paid authenticated validation, and leave phases 002–004 with executable acceptance gates.

## Actions Taken

1. Sent unauthenticated read-only requests to the official MCP endpoint and its advertised protected-resource metadata URL.
2. Inspected the authorization server's public OAuth metadata without initiating authorization.
3. Queried the official GitHub repository trees and latest commits for source freshness and surface inventory.
4. Re-audited every tool, install, auth, entitlement, read-only, and Code Mode claim against the accumulated evidence.

## Findings

1. The endpoint is live and protected. An unauthenticated `GET https://api.mobbin.com/mcp` returned HTTP 401 with JSON `{error:{code:"unauthorized",message:"Missing or invalid Authorization header"}}` and `WWW-Authenticate: Bearer resource_metadata="https://api.mobbin.com/.well-known/oauth-protected-resource/mcp"`. This is useful doctor evidence: a 401 before browser authorization confirms reachability, not a bad static API key. [SOURCE: live unauthenticated HTTP probe 2026-07-16] [SOURCE: https://api.mobbin.com/mcp]
2. The advertised protected-resource document returned the exact resource `https://api.mobbin.com/mcp`, one authorization server, and `openid`. That authorization server's metadata publishes authorization, token, and dynamic client-registration endpoints plus PKCE `S256` support. The live protocol metadata agrees with Mobbin's DCR/PKCE documentation. [SOURCE: https://api.mobbin.com/.well-known/oauth-protected-resource/mcp] [SOURCE: https://ujasntkfphywizsdaapi.supabase.co/auth/v1/.well-known/oauth-authorization-server] [SOURCE: https://docs.mobbin.com/mcp/build-an-integration]
3. The official server repository remains a registration/documentation repository: its root contains `README.md`, `mcp.json`, `server.json`, rules, and plugin metadata, but no server runtime/package source. Its latest observed commit was `bbee2a6` on 2026-06-03. The official skills repository's latest observed commit was `9657786` on 2026-05-04, and its `skills/` tree contains exactly one directory, `mobbin-search`. [SOURCE: https://api.github.com/repos/mobbin/mobbin-mcp-server/contents] [SOURCE: https://api.github.com/repos/mobbin/mobbin-mcp-server/commits?per_page=1] [SOURCE: https://api.github.com/repos/mobbin/skills/contents/skills] [SOURCE: https://api.github.com/repos/mobbin/skills/commits?per_page=1]
4. The **complete public documented tool surface at this evidence date is one read operation, `search_screens`**. Its skill-level contract is natural-language `query`, `platform` (`ios` or `web`), and `limit` (default 5, normally capped near 15), returning ordered screen metadata, failed items, and inline images. Separate app, flow, element, detail, or image tool names are not documented. App/flow/element are research intents expressed through the query and grounded analysis of screen results. [SOURCE: https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md] [SOURCE: https://api.github.com/repos/mobbin/skills/contents/skills]
5. That public catalog is **not proof of authenticated live completeness**. The server blocks `tools/list` without OAuth, no paid credential was used, and neither official repository publishes a machine-readable live `tools/list` export or JSON Schema. Phase 004 must therefore record both: `search_screens` is the only documented baseline, while the exact current live list, server schema, callable spelling, and absence of mutations remain `UNKNOWN` until Code Mode `list_tools()` plus `tool_info()` succeeds. [SOURCE: https://api.mobbin.com/mcp] [SOURCE: https://github.com/mobbin/mobbin-mcp-server] [INFERENCE: authentication prevents public live enumeration]
6. Transport eligibility is proven, but deployment compatibility is not. Mobbin advertises standard Streamable HTTP/OAuth metadata, and `mcp-remote` supports HTTP-first OAuth/DCR, so the proposed manual is well-founded. Still, the adapter is externally versioned and described as experimental; a clean local `mobbin` discovery run is required before claiming the integration works. [SOURCE: https://docs.mobbin.com/mcp/clients/other] [SOURCE: https://github.com/geelen/mcp-remote] [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:385]
7. The minimum troubleshooting matrix is now bounded:
   - endpoint 401 before authorization -> expected protected-resource challenge; complete browser OAuth;
   - browser/callback unavailable -> run in an interactive environment or surface operator action, do not request a token paste;
   - no `mobbin.*` tools -> validate JSON/manual name, Node/npx, restart Code Mode, then plan eligibility and OAuth;
   - stale/failed OAuth -> use adapter diagnostics and clear its auth state only with explicit operator awareness because reauthorization is destructive to cached sessions;
   - 429 -> honor `Retry-After`, then exponential backoff with jitter;
   - unexpected mutating tool -> refuse it and retain the packet's read-only allow-boundary;
   - Free account -> explain that MCP begins at Pro; do not invent the exact denial status beyond observed evidence. [SOURCE: https://docs.mobbin.com/rate-limits] [SOURCE: https://github.com/geelen/mcp-remote] [SOURCE: .opencode/skills/mcp-code-mode/references/configuration.md:642]
8. The terminal acceptance checklist for later phases is: JSON-parse the manual; confirm no secret interpolation; start via `npx -y mcp-remote`; complete browser OAuth with an eligible account; `list_tools()` filtered to `mobbin`; use `tool_info()` on every exposed read tool; verify `search_screens` schema and a minimal `limit:1` read; confirm returned metadata/image ordering; verify 401/429 guidance; prove no Write/Edit/Task in the packet; prove `mutatesWorkspace:false` and cross-hub `sk-design` pairing; regenerate/validate the hub graph; and record live tool names/date without promoting undocumented tools into the stable contract. [SOURCE: .opencode/specs/mcp-tooling/010-mcp-mobbin/002-skill-authoring/spec.md] [SOURCE: .opencode/specs/mcp-tooling/010-mcp-mobbin/003-hub-integration/spec.md] [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:256]

## Questions Answered

- What is the complete official MCP tool surface, including inputs, returned artifacts, read-only posture, transport, install, and runtime prerequisites? Answered to the strongest public evidence boundary: one documented read tool (`search_screens`) with skill-level query/platform/limit and metadata+image response contract; hosted Streamable HTTP/OAuth; on-demand `mcp-remote` bridge; Node 18+/npx/browser/paid account prerequisites. Authenticated live-list completeness and exact server JSON Schema remain explicit validation-time UNKNOWNs.

## Questions Remaining

- What exact names and JSON Schemas does a paid authenticated `tools/list`/`tool_info` expose on the validation date?
- Does the current Code Mode plus `mcp-remote` version complete Mobbin OAuth and refresh reliably on this machine?
- What exact denial response does a Free account receive, and does Finance+ alter MCP result coverage?

These are downstream live-validation questions, not reasons to invent authoring-time contracts.

## Ruled Out

- Claiming the unauthenticated 401 indicates an API-key configuration failure.
- Calling the public one-tool baseline an authenticated live export.
- Promoting any undocumented app/flow/element/detail/image or mutation tool into the packet.
- Declaring the adapter operational before a clean paid-account Code Mode discovery run.

## Dead Ends

- Public endpoint probing cannot cross the OAuth boundary into `tools/list` without an eligible account.
- Repository tree and docs searches cannot replace a dynamic server schema because the hosted server implementation is not published there.

## Edge Cases

- Auth metadata currently advertises PKCE `plain` as well as `S256`; the client must use the documented stronger `S256` method.
- A future server expansion could add tools not covered by the packet. Read-only authorization remains narrower than server capability.
- Images are remote evidence and may fail individually; ordered metadata plus `failed[]` must support partial-success reporting.
- Search phrasing can conflate app, flow, screen, and element. The workflow should clarify intent/platform before broad queries and keep default result counts small.

## Sources Consulted

- https://api.mobbin.com/mcp
- https://api.mobbin.com/.well-known/oauth-protected-resource/mcp
- https://ujasntkfphywizsdaapi.supabase.co/auth/v1/.well-known/oauth-authorization-server
- https://api.github.com/repos/mobbin/mobbin-mcp-server/contents
- https://api.github.com/repos/mobbin/mobbin-mcp-server/commits?per_page=1
- https://api.github.com/repos/mobbin/skills/contents/skills
- https://api.github.com/repos/mobbin/skills/commits?per_page=1
- https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md
- https://github.com/geelen/mcp-remote
- local Code Mode, sk-design, and phase contracts cited above

## Assessment

- New information ratio: 0.58
- Novelty justification: Live public protocol probes and repository freshness checks add four new facts; the remaining findings adversarially qualify earlier claims and convert them into terminal validation gates.
- Confidence: high for endpoint/auth metadata, public documented surface, manual design, entitlement, and packet boundary; deliberately unverified for authenticated live schema and local OAuth round-trip.

## Reflection

- What worked and why: The unauthenticated protected-resource challenge proved endpoint and OAuth metadata without crossing the credential boundary, while GitHub API trees bounded the public surface at a specific date.
- What did not work and why: Public probes cannot enumerate protected tools, so exact live completeness remains impossible without an eligible authorization flow.
- What I would do differently: None at the research boundary; the next responsible action is the explicitly gated paid-account validation, not more unauthenticated searching.

## Recommended Next Focus

Synthesize now because iteration 5 reached `maxIterations`. Preserve the live-schema/OAuth-round-trip/Free-denial/Finance+ questions in the final Open Questions and Divergence Map.
