# Mobbin MCP transport packet research

Research topic: the official Mobbin MCP server and official Mobbin skills needed to author a read-only, Code Mode-only `mcp-mobbin` transport under `mcp-tooling`, register a `mobbin` manual in `.utcp_config.json`, and pair retrieved evidence with `sk-design` judgment.

Evidence labels used below:

- **Confirmed** — current official documentation/source, a verified local contract, or a direct unauthenticated observation.
- **Inferred** — strongly supported but not exercised through authenticated Code Mode.
- **Unknown** — requires a paid authenticated runtime or unpublished provider policy.

## 1. Executive Summary

Author `mcp-mobbin` as a non-mutating evidence transport: `packetKind: "transport"`, `mutatesWorkspace: false`, Code Mode calls only, no Write/Edit/Task, and mandatory cross-hub pairing with `sk-design` whenever Mobbin evidence informs a design decision. The transport retrieves real-world design evidence; it never decides taste, accessibility, responsiveness, or readiness. [SOURCE: file:.opencode/specs/mcp-tooling/010-mcp-mobbin/002-skill-authoring/spec.md:79] [SOURCE: file:.opencode/skills/sk-design/SKILL.md:263]

The official server is hosted at `https://api.mobbin.com/mcp` over Streamable HTTP. It uses browser OAuth, not a Mobbin API key. Public metadata and official docs confirm OAuth protected-resource discovery, Dynamic Client Registration, authorization-code flow, PKCE S256, access/refresh tokens, and `openid`. The official server repository contains registration/docs artifacts rather than a local runtime package. [SOURCE: https://github.com/mobbin/mobbin-mcp-server] [SOURCE: https://docs.mobbin.com/mcp/build-an-integration] [SOURCE: https://api.mobbin.com/.well-known/oauth-protected-resource/mcp]

The complete public documented tool baseline at 2026-07-16 is one read tool: `search_screens`. Its official skill-level contract accepts a natural-language query, `ios` or `web`, and a conservative result limit; it returns ordered screen metadata plus inline images. App, screen, flow, and element research are search/analysis intents over those screen results, not four published MCP tool families. Authenticated `tools/list` completeness and the exact server JSON Schema remain runtime UNKNOWNs and must be captured during validation. [SOURCE: https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md] [SOURCE: https://api.github.com/repos/mobbin/skills/contents/skills]

Register a Code Mode manual named `mobbin` that launches `npx -y mcp-remote https://api.mobbin.com/mcp` with an empty environment. This adapts Code Mode's current stdio manual shape to Mobbin's remote HTTP/OAuth service. No API key, token, or client secret belongs in `.utcp_config.json` or `.env`. [SOURCE: file:.utcp_config.json:147] [SOURCE: file:.opencode/skills/mcp-code-mode/references/configuration.md:468] [SOURCE: https://github.com/geelen/mcp-remote]

MCP is unavailable on Free and included on Pro, Team, and Enterprise. The separately documented REST API is Team/Enterprise only and uses a workspace API key; it is not the MCP credential or transport. MCP is rate-limited to 60 requests per 60 seconds per user. [SOURCE: https://docs.mobbin.com/overview] [SOURCE: https://docs.mobbin.com/mcp/introduction] [SOURCE: https://docs.mobbin.com/rate-limits]

## 2. Scope, Method, and Evidence Boundary

Five evidence iterations were run because `stopPolicy: max-iterations` made early convergence telemetry non-terminal:

1. Hosted server, transport, authorization, and install baseline.
2. Official skill surface and app/screen/flow/element workflows.
3. Free/paid eligibility, MCP/API separation, and rate limits.
4. Local Code Mode manual, packet architecture, and `sk-design` pairing.
5. Live public protocol metadata, repository freshness, contradiction review, and terminal acceptance gates.

Evidence was restricted to official Mobbin repositories/docs/endpoints, the `mcp-remote` maintainer repository, direct unauthenticated read-only protocol probes, and local integration contracts. No Mobbin login, paid authorization, token exchange, MCP tool call, OAuth-cache read/write, or remote mutation occurred. The 401/protected-resource checks prove endpoint/auth shape but cannot enumerate authenticated tools. [SOURCE: https://api.mobbin.com/mcp] [SOURCE: https://github.com/geelen/mcp-remote]

Freshness snapshot: the official server repository's latest observed commit was `bbee2a6be34d251c580ba80bb8b407c87587aba7` dated 2026-06-03; the skills repository's latest observed commit was `9657786338c5e7fed597031982398a8d99681fec` dated 2026-05-04, and `skills/` contained only `mobbin-search`. [SOURCE: https://api.github.com/repos/mobbin/mobbin-mcp-server/commits?per_page=1] [SOURCE: https://api.github.com/repos/mobbin/skills/commits?per_page=1] [SOURCE: https://api.github.com/repos/mobbin/skills/contents/skills]

## 3. Server, Transport, Install, and Runtime

| Concern | Confirmed contract | Packet implication |
|---|---|---|
| Server URL | `https://api.mobbin.com/mcp` | Single remote endpoint |
| Provider transport | Streamable HTTP | Do not describe Mobbin itself as stdio |
| Local adapter | `mcp-remote` launched over stdio | Lets current Code Mode consume remote HTTP/OAuth |
| Provider install | None | Do not clone/build/install a Mobbin server |
| Adapter install | On-demand through `npx -y` | Avoid interactive package confirmation |
| Runtime | Node.js 18+ and working `npx` | Doctor checks both before OAuth |
| Network | Outbound HTTPS plus localhost OAuth callback | Headless sessions need operator-visible escalation |
| Account | Pro, Team, or Enterprise | Free is not a reduced MCP mode |

[SOURCE: https://github.com/mobbin/mobbin-mcp-server] [SOURCE: https://docs.mobbin.com/mcp/clients/other] [SOURCE: https://github.com/geelen/mcp-remote]

`mcp-remote` defaults to HTTP-first and falls back to SSE only on an HTTP 404. Mobbin explicitly requires Streamable HTTP, so no forced SSE flag is needed. The adapter describes itself as experimental and is externally versioned; static compatibility does not equal a completed local OAuth/discovery run. [SOURCE: https://github.com/geelen/mcp-remote#transport-strategies] [SOURCE: https://docs.mobbin.com/mcp/clients/other]

## 4. Authentication, Credential Storage, and Security

Mobbin's official client flow requires no API key or manually copied token. On first use, the client opens a browser, the user signs in and authorizes access, and the client receives OAuth access/refresh tokens. Custom integrations use DCR and authorization code with PKCE S256. Client access is revocable. [SOURCE: https://docs.mobbin.com/mcp/introduction] [SOURCE: https://docs.mobbin.com/mcp/build-an-integration] [SOURCE: https://docs.mobbin.com/mcp/disconnect]

A live unauthenticated request returned HTTP 401 and:

```text
WWW-Authenticate: Bearer resource_metadata="https://api.mobbin.com/.well-known/oauth-protected-resource/mcp"
{"error":{"code":"unauthorized","message":"Missing or invalid Authorization header"}}
```

The protected-resource document names resource `https://api.mobbin.com/mcp`, the Supabase authorization server, and `openid`. Authorization-server metadata publishes authorization, token, and registration endpoints plus PKCE S256. This matches the written integration contract. [SOURCE: https://api.mobbin.com/mcp] [SOURCE: https://api.mobbin.com/.well-known/oauth-protected-resource/mcp] [SOURCE: https://ujasntkfphywizsdaapi.supabase.co/auth/v1/.well-known/oauth-authorization-server]

Security rules for the packet:

- Keep manual `env` empty; never add `MOBBIN_API_KEY`, the REST workspace key, access/refresh tokens, or a client secret.
- Never accept credentials in prompts or tool arguments.
- Never print Authorization headers, OAuth codes, token responses, adapter debug logs, or auth-cache contents.
- Treat adapter auth state as operator-owned. Do not clear it automatically; reauthorization is an explicit operator action.
- Use PKCE S256 even though live authorization metadata also advertises `plain`.
- Interpret a pre-authorization 401 as the expected protected-resource challenge after reachability is proven, not as evidence that a static key is missing.

[SOURCE: https://github.com/geelen/mcp-remote] [SOURCE: https://docs.mobbin.com/mcp/build-an-integration]

## 5. Official MCP Tool Surface

### Public documented baseline

| Tool | Posture | Skill-level inputs | Skill-level result |
|---|---|---|---|
| `search_screens` | Read/search | `query`: natural language; `platform`: `ios` or `web`; `limit`: default 5, normally no more than about 15 when broader variety is requested | `screens[]` metadata, `failed[]`, then ordered inline image blocks |

The official skill describes screen metadata as:

```text
screens: [{ index, id, app_name, mobbin_url, image_url, platform }]
failed:  []
```

Inline images arrive in the same response after metadata, so the workflow can analyze visible screens without inventing a second image-download tool. Preserve metadata/image order and report partial image failures. [SOURCE: https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md]

### Completeness boundary

The official `skills/` tree contains one skill, `mobbin-search`, and its instructions name only `search_screens`. The official server repository publishes endpoint/registration artifacts but no public server implementation or authenticated `tools/list` export. Therefore:

- **Confirmed:** `search_screens` is the only public documented tool.
- **Unknown:** whether authenticated `tools/list` currently contains only that tool.
- **Unknown:** the exact MCP JSON Schema and callable name produced by current Code Mode.
- **Not allowed:** inventing `search_apps`, `search_flows`, `search_elements`, detail, image, or mutation tools.

[SOURCE: https://api.github.com/repos/mobbin/skills/contents/skills] [SOURCE: https://github.com/mobbin/mobbin-mcp-server] [SOURCE: https://api.mobbin.com/mcp]

The packet's read-only guarantee is an authorization boundary, not an unsupported universal claim about every future provider tool. Allow only verified read/search tools. If live discovery returns a mutation-capable tool, refuse it and require an explicit reviewed contract change.

## 6. Result Handling and Context Discipline

Use conservative retrieval:

1. Clarify the product/surface, research intent, and required platform.
2. Start with `limit: 5`.
3. Inspect ordered metadata and images together.
4. Ask the user before widening materially; do not jump above about 15 merely to create variety.
5. Report `failed[]` and missing images as partial success, never silently discard them.
6. Retain `mobbin_url` as provenance for every selected reference.

The provider skill's visual-analysis sequence is: observe content/structure/styling/interaction cues; compare repeated patterns and meaningful differences; synthesize principles; and answer with evidence tied to the returned screens. The transport may describe observable facts, but any design recommendation or acceptance conclusion belongs to `sk-design`. [SOURCE: https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md] [SOURCE: file:.opencode/skills/sk-design/SKILL.md:176]

Do not create the upstream skill's optional HTML evidence board inside `mcp-mobbin`. The requested packet is non-mutating. Artifact authoring can occur only in a separate explicitly authorized workflow outside this transport.

## 7. App, Screen, Flow, and Element Research Workflows

There are not four documented MCP tool families. Use one retrieval surface with intent-specific query design:

### App research

Name the app/company/category and the comparison goal: for example, “banking apps onboarding identity verification.” Compare returned `app_name`, platform, screen structure, and visible patterns. Multiple results are evidence, not a design chooser.

### Screen research

Use the concrete screen/state/job: “iOS subscription cancellation confirmation,” “web empty-state dashboard,” or “mobile checkout payment error.” Start at five results and cite each Mobbin URL used.

### Flow research

Describe the user journey and target step: “first-run onboarding progression,” “card replacement flow,” or “forgot-password recovery.” The current public contract returns screens, not a first-class ordered flow object, so reconstruct sequence only when visual evidence supports it and label reconstruction as inference.

### Element research

Name the component plus context/state: “bottom-sheet destructive confirmation,” “segmented control in analytics,” or “inline validation on signup.” Analyze how the element behaves within returned screens. Do not fabricate an element-detail tool or claim isolated component metadata.

For all four intents, use deep semantic queries for complex requests, keep platform explicit, and perform grounded visual comparison only after results arrive. [SOURCE: https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md]

## 8. Plans, MCP/API Separation, and Rate Limits

| Surface | Free | Pro | Team | Enterprise | Credential |
|---|---:|---:|---:|---:|---|
| Mobbin website | Limited browsing | Full paid features | Included | Included | User session |
| Mobbin MCP | No | Yes | Yes | Yes | Browser OAuth |
| Mobbin REST API | No | No | Yes | Yes | Workspace API key |

[SOURCE: https://mobbin.com/pricing] [SOURCE: https://docs.mobbin.com/overview] [SOURCE: https://docs.mobbin.com/api/quickstart]

Do not conflate the Team/Enterprise REST API's Bearer API key or `POST /v1/screens/search` with MCP. No reviewed source documents different MCP tool sets for Pro versus Team versus Enterprise, so the stable packet should not invent per-tool tier gates. Exact Free-account MCP denial behavior is UNKNOWN: authorization might fail at different stages, and public docs do not publish its precise status/payload. Finance+ is a separate paid add-on, but public sources do not establish its MCP result coverage. [SOURCE: https://docs.mobbin.com/mcp/introduction] [SOURCE: https://mobbin.com/pricing]

MCP limit: 60 requests per 60 seconds per user. A 429 includes `Retry-After`; honor it, then use exponential backoff with jitter for continuing failures. Metadata-first, small-limit queries also reduce rate and context pressure. [SOURCE: https://docs.mobbin.com/rate-limits]

## 9. Code Mode Manual and Calling Convention

Phase 002 should ship this paste-ready manual; phase 003 should add it to `manual_call_templates[]`:

```json
{
  "name": "mobbin",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "mobbin": {
        "transport": "stdio",
        "command": "npx",
        "args": [
          "-y",
          "mcp-remote",
          "https://api.mobbin.com/mcp"
        ],
        "env": {}
      }
    }
  }
}
```

[SOURCE: file:.utcp_config.json:147] [SOURCE: file:.opencode/skills/mcp-code-mode/references/configuration.md:162] [SOURCE: https://docs.mobbin.com/mcp/clients/other]

The mandatory runtime sequence is:

1. `list_tools()` or `search_tools({ task_description: "Mobbin screen design research", limit: 10 })`.
2. Filter to the `mobbin` manual.
3. Run `tool_info()` on the exact dotted discovery name.
4. Only then call through `call_tool_chain({ code })` with the callable syntax `tool_info()` reports.

Code Mode's general convention predicts dotted discovery `mobbin.mobbin.search_screens` and callable `mobbin.mobbin_search_screens(...)`, but both are **INFERRED** until live discovery. The skill-level argument example below is illustrative until `tool_info()` confirms its schema:

```typescript
call_tool_chain({
  code: `
    const result = await mobbin.mobbin_search_screens({
      query: "iOS banking app onboarding identity verification",
      platform: "ios",
      limit: 5
    });
    return { success: true, data: result, errors: [], timestamp: new Date().toISOString() };
  `
});
```

[SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md:252] [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md:365]

## 10. `mcp-mobbin` Packet Architecture and `sk-design` Pairing

Recommended skill permission surface:

```text
Read, Glob, Grep,
mcp__code_mode__list_tools,
mcp__code_mode__search_tools,
mcp__code_mode__tool_info,
mcp__code_mode__call_tool_chain
```

Do not grant Write, Edit, Task, or a direct Mobbin MCP tool. The remote call path is Code Mode only. Shell-based doctor/install scripts may be shipped as user-invoked assets if phase standards require them, but the transport skill itself does not need Bash to query Mobbin.

Registry/hub contract:

- `workflowMode: "mcp-mobbin"`
- `packetKind: "transport"`
- `backendKind`: a Mobbin Code Mode transport discriminator chosen consistently across registry/docs
- `routingClass: "metadata"`
- `toolPolicy.mutatesWorkspace: false`
- `extensions.transport-axis.transports[]` contains `mcp-mobbin`
- `crossHubPairing: mcp-mobbin -> sk-design`

[SOURCE: file:.opencode/specs/mcp-tooling/010-mcp-mobbin/003-hub-integration/spec.md:79]

Pairing lifecycle for design-affecting research:

1. `sk-design` gathers goal, surface, inputs, constraints, and proof expectations.
2. It selects the smallest design-judgment mode (interface, foundations, motion, or audit).
3. `mcp-mobbin` retrieves cited screens through Code Mode.
4. Results return to the selected judgment mode.
5. `sk-design`, not transport rank or images alone, owns taste, accessibility, responsive, and ready decisions.

Pure setup/doctor or factual tool-surface reporting does not make a design verdict, but the registry still declares the pairing. [SOURCE: file:.opencode/skills/sk-design/SKILL.md:20] [SOURCE: file:.opencode/skills/sk-design/SKILL.md:172] [SOURCE: file:.opencode/skills/sk-design/SKILL.md:263]

## 11. Recommendations

1. Treat `search_screens` as the only stable documented tool and make live discovery the runtime authority.
2. Fail closed on missing, renamed, expanded, or mutation-capable tool surfaces; do not silently widen permissions.
3. Register exactly one `mobbin` manual using the stdio `mcp-remote` bridge and empty environment.
4. Document Node 18+, `npx`, outbound HTTPS, browser/localhost OAuth, and paid account prerequisites.
5. Put no Mobbin credential in `.env`; keep auth state operator-owned and outside packet logic.
6. Separate website, OAuth MCP, and API-key REST entitlements everywhere.
7. Route app/flow/element intents through semantic screen searches; never manufacture separate tools or structured flow semantics.
8. Keep limits small, preserve result/image ordering and failures, cite `mobbin_url`, and honor 429 `Retry-After`.
9. Make `mcp-mobbin` transport owner and `sk-design` judgment owner; transport output is evidence, not acceptance.
10. Split deterministic packet/hub tests from operator-authorized paid OAuth smoke tests.

## Eliminated Alternatives

| Alternative | Reason eliminated | Evidence | Iteration |
|---|---|---|---:|
| Static `MOBBIN_API_KEY` for MCP | MCP uses browser OAuth; no manual key setup | [SOURCE: https://docs.mobbin.com/mcp/introduction] | 1 |
| Reuse the REST workspace key | REST and MCP are separate surfaces and plans | [SOURCE: https://docs.mobbin.com/overview] | 3 |
| Clone/install a local Mobbin server | Official repository declares a hosted remote and has no runtime package | [SOURCE: https://github.com/mobbin/mobbin-mcp-server] | 1 |
| Describe Mobbin itself as stdio | Stdio belongs to the local adapter; provider transport is HTTP | [SOURCE: https://docs.mobbin.com/mcp/clients/other] | 4 |
| Direct unproven Code Mode HTTP manual | Current local precedent uses stdio plus `mcp-remote` for hosted OAuth | [SOURCE: file:.utcp_config.json:147] | 4 |
| Separate app/flow/element/detail/image tools | Current official skill names only `search_screens` | [SOURCE: https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md] | 2 |
| Free as a limited MCP tier | MCP begins at Pro; Free browsing is a different product surface | [SOURCE: https://docs.mobbin.com/mcp/introduction] | 3 |
| Per-tool Pro/Team/Enterprise claims | No reviewed source documents paid-tier tool differences | [SOURCE: https://docs.mobbin.com/overview] | 3 |
| HTML evidence-board creation in transport | Violates non-mutating packet boundary | [SOURCE: file:.opencode/specs/mcp-tooling/010-mcp-mobbin/002-skill-authoring/spec.md:81] | 2 |
| Guess `mobbin.mobbin_search_screens` | Code Mode requires discovery and `tool_info()` | [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md:256] | 4 |
| Treat public catalog as authenticated `tools/list` | Protected endpoint prevents public enumeration | [SOURCE: https://api.mobbin.com/mcp] | 5 |
| Treat transport results as taste authority | `sk-design` owns judgment and acceptance | [SOURCE: file:.opencode/skills/sk-design/SKILL.md:263] | 4 |
| Auto-clear adapter auth state | Destructive to operator-owned sessions | [SOURCE: https://github.com/geelen/mcp-remote#troubleshooting] | 5 |

## Divergence Map

| Direction | Status | Evidence resolution | Remaining frontier |
|---|---|---|---|
| API key vs OAuth | Saturated | Docs plus live protected-resource metadata agree on OAuth/DCR/PKCE | Paid local round trip only |
| Local package vs hosted server | Saturated | Official manifests/tree contain registration assets, no runtime | None for architecture |
| One tool vs app/flow/element families | Saturated for public contract | Official skill tree contains one skill naming `search_screens` | Authenticated live list drift |
| Free vs paid | Saturated for eligibility | Free excluded; Pro/Team/Enterprise included | Exact Free denial payload |
| MCP vs REST API | Saturated | OAuth MCP versus Team/Enterprise workspace-key REST | None for manual design |
| Direct HTTP vs stdio bridge | Resolved by local precedent | Current Code Mode remote examples and `refero` manual use `mcp-remote` | End-to-end local OAuth/refresh |
| Transport vs judgment authority | Saturated | Phase specs and `sk-design` require non-mutating transport/pairing | Downstream graph and playbook proof |
| Finance+ coverage | Public sources exhausted | Pricing documents add-on but not MCP inclusion | Provider/paid runtime evidence |

No formal divergent-mode pivot or Council artifact was produced. Breadth came from successive evidence angles: provider metadata, official skill behavior, entitlements, local integration contracts, and adversarial live public probes. The remaining frontier is operator-authorized runtime validation, not additional unauthenticated searching.

## 12. Open Questions

No open question blocks phase-002 packet authorship. Preserve these as explicit downstream UNKNOWNs:

1. What exact names and JSON Schemas do authenticated Code Mode `list_tools()` and `tool_info()` expose on the validation date?
2. Does the current local Code Mode + `mcp-remote` version complete first-use Mobbin OAuth, refresh, and reconnect reliably?
3. What precise status/payload/UX does a Free account receive during MCP authorization or tool use?
4. Does Finance+ change the dataset returned through standard MCP search?

## 13. Verification Plan

### Deterministic no-account checks

- JSON-parse the ready-to-paste manual and confirm one name-keyed `mobbin` entry.
- Assert endpoint, `npx -y mcp-remote`, stdio adapter, and empty `env` exactly.
- Assert no `MOBBIN_API_KEY`, REST key, token, secret, Authorization header, or `.env` requirement appears.
- Assert packet frontmatter/registry forbid Write/Edit/Task and declare `mutatesWorkspace:false`.
- Assert only Code Mode discovery/execution meta-tools are allowed for remote calls.
- Fixture the public `search_screens` query/platform/limit and ordered metadata/failed/images contract, labeled skill-level rather than live schema.
- Negative fixtures reject invented app/flow/element/detail/image/mutation tools and pre-discovery callable guesses.
- Routing holdouts distinguish Mobbin evidence search from Figma transport, browser inspection, generic `sk-design`, and unrelated MCP setup.
- Verify hub registry/router/description/graph metadata, transport list, pairing edge, and manual name remain synchronized.
- Verify every design-affecting scenario returns evidence to `sk-design` before acceptance.

### Operator-authorized paid live checks

1. Confirm Node/npx and load the new manual; restart Code Mode.
2. Observe the expected 401/protected-resource challenge before authorization without treating it as key failure.
3. Complete browser OAuth with an eligible account; capture no tokens/log secrets.
4. Run `list_tools()`, filter `mobbin`, and record exact dated dotted names.
5. Run `tool_info()` for every exposed tool and compare the read-only allow-boundary.
6. Execute one minimal `search_screens` call with `limit: 1`; verify query/platform schema, metadata, image order, and Mobbin URL.
7. Run app-, flow-, and element-intent queries and confirm they remain screen-search workflows rather than fabricated tool families.
8. Verify partial image failures remain visible.
9. If safely observable, validate 429/`Retry-After` behavior without deliberately exhausting service quotas.
10. Record unexpected tools/schema drift as a fail-closed packet update requirement.

Paid/OAuth scenarios should allow `SKIP` with the missing entitlement/operator authorization stated.

## 14. Troubleshooting, Risks, and Mitigations

| Symptom/risk | Interpretation | Safe action |
|---|---|---|
| Endpoint returns 401 before auth | Expected protected-resource challenge | Complete browser OAuth; do not add an API key |
| Browser does not open/callback fails | Headless session, port, timeout, or client problem | Move to interactive session or request operator action; never ask for token paste |
| No `mobbin.*` tools | Manual load/start/auth/plan failure | Validate JSON, name, Node/npx, restart, OAuth, then eligibility |
| Tool name/schema mismatch | Provider/adapter drift | Re-run `list_tools` + `tool_info`; fail closed and update reviewed docs |
| 429 | Per-user request window exceeded | Honor `Retry-After`; exponential backoff with jitter; reduce query volume |
| Free account cannot connect/use tools | Expected entitlement boundary | Explain MCP starts at Pro; do not guess precise failure semantics |
| Token refresh/stale state | Operator-owned adapter auth state | Use diagnostics without printing secrets; clear only with explicit reauthorization consent |
| Unexpected mutation tool | Provider surface expanded | Refuse; read-only packet requires explicit contract review |
| Large image/result response | Context pressure | Default five; preserve/compare metadata first; widen only deliberately |
| Individual images fail | Partial provider/storage failure | Preserve `failed[]`, return usable results plus errors |
| Unpinned experimental adapter changes | Compatibility drift | Smoke-test after dependency change; consider pinning only in a separately reviewed change |
| Design copied or generic | Transport mistaken for authority | Cite evidence; use `sk-design` critique/judgment; never copy wholesale |

[SOURCE: https://docs.mobbin.com/rate-limits] [SOURCE: https://github.com/geelen/mcp-remote] [SOURCE: file:.opencode/skills/mcp-code-mode/references/configuration.md:642]

## 15. Phase 002–003 Authoring Checklist

Phase 002 creates `.opencode/skills/mcp-tooling/mcp-mobbin/` only:

- `SKILL.md` — transport identity, Code Mode-only permissions, discovery gate, read-only rules, pairing boundary.
- `README.md` — user-facing purpose, prerequisites, public surface, plan/auth caveats.
- `INSTALL_GUIDE.md` — Node/npx, manual snippet, first-use OAuth, discovery verification; no provider server install.
- `assets/` — paste-ready `mobbin` UTCP manual with empty env; no secret template.
- `references/mcp_wiring.md` — remote HTTP versus local stdio adapter, discovery/call naming, confirmed/inferred labels.
- `references/tool_surface.md` — single public documented baseline, response shape, authenticated-live UNKNOWNs.
- `references/workflows.md` or equivalent — app/screen/flow/element semantic query recipes and grounded analysis.
- `references/troubleshooting.md` — 401, OAuth callback, manual discovery, plan, 429, drift, partial images.
- `feature_catalog/` — capability inventory marked read-only.
- `scripts/` — non-mutating doctor/snippet helpers that print no auth state.
- `manual_testing_playbook/` — positive routing, at least two holdouts, negative/troubleshoot, deterministic and paid-live splits.
- `mcp-servers/mobbin-mcp/README.md` — explicitly document hosted provider server and absence of local package source.
- `changelog/` and package metadata required by the skill-authoring standard.
- Run `package_skill.py --check` (and strict gate in phase 004) with every tool claim traced here.

Phase 003 owns shared integration after sibling serial dependencies:

- add `mcp-mobbin` to `mode-registry.json` as transport/metadata/non-mutating;
- add transport-axis membership and `mcp-mobbin -> sk-design` cross-hub pairing;
- add narrow router signals for Mobbin/app-screen-flow-element design-reference research plus holdouts;
- update parent SKILL/README/description/graph metadata and hub changelog/playbook;
- paste the `mobbin` manual into `.utcp_config.json` once;
- regenerate the advisor skill graph and sweep all references for key/name/count consistency.

[SOURCE: file:.opencode/specs/mcp-tooling/010-mcp-mobbin/002-skill-authoring/spec.md:70] [SOURCE: file:.opencode/specs/mcp-tooling/010-mcp-mobbin/003-hub-integration/spec.md:68]

## 16. References

Primary Mobbin sources:

- [SOURCE: https://github.com/mobbin/mobbin-mcp-server]
- [SOURCE: https://raw.githubusercontent.com/mobbin/mobbin-mcp-server/main/mcp.json]
- [SOURCE: https://raw.githubusercontent.com/mobbin/mobbin-mcp-server/main/server.json]
- [SOURCE: https://github.com/mobbin/skills]
- [SOURCE: https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md]
- [SOURCE: https://docs.mobbin.com/mcp/introduction]
- [SOURCE: https://docs.mobbin.com/mcp/clients/other]
- [SOURCE: https://docs.mobbin.com/mcp/build-an-integration]
- [SOURCE: https://docs.mobbin.com/mcp/disconnect]
- [SOURCE: https://docs.mobbin.com/overview]
- [SOURCE: https://docs.mobbin.com/api/quickstart]
- [SOURCE: https://docs.mobbin.com/rate-limits]
- [SOURCE: https://mobbin.com/mcp]
- [SOURCE: https://mobbin.com/pricing]
- [SOURCE: https://api.mobbin.com/mcp]
- [SOURCE: https://api.mobbin.com/.well-known/oauth-protected-resource/mcp]
- [SOURCE: https://ujasntkfphywizsdaapi.supabase.co/auth/v1/.well-known/oauth-authorization-server]
- [SOURCE: https://api.github.com/repos/mobbin/mobbin-mcp-server/commits?per_page=1]
- [SOURCE: https://api.github.com/repos/mobbin/skills/contents/skills]
- [SOURCE: https://api.github.com/repos/mobbin/skills/commits?per_page=1]

Transport and local sources:

- [SOURCE: https://github.com/geelen/mcp-remote]
- [SOURCE: file:.utcp_config.json:147]
- [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md]
- [SOURCE: file:.opencode/skills/mcp-code-mode/references/configuration.md]
- [SOURCE: file:.opencode/skills/mcp-code-mode/references/naming_convention.md]
- [SOURCE: file:.opencode/skills/mcp-tooling/mcp-figma/SKILL.md]
- [SOURCE: file:.opencode/skills/mcp-tooling/mcp-figma/references/mcp_wiring.md]
- [SOURCE: file:.opencode/skills/sk-design/SKILL.md]
- [SOURCE: file:.opencode/specs/mcp-tooling/010-mcp-mobbin/002-skill-authoring/spec.md]
- [SOURCE: file:.opencode/specs/mcp-tooling/010-mcp-mobbin/003-hub-integration/spec.md]

## 17. Convergence Report

- Stop reason: `maxIterationsReached`.
- Total iterations: 5.
- Questions answered: 5 / 5 to the public/static evidence boundary.
- Remaining authoring-blocking questions: 0.
- Runtime/provider UNKNOWNs retained: 4 (authenticated schema, local OAuth/refresh, exact Free denial, Finance+ coverage).
- Last three iterations: run 3 — plan gating/API separation/rate limits (0.88); run 4 — Code Mode manual/packet architecture (0.82); run 5 — adversarial completeness/risk audit (0.58).
- New-information ratios: 1.00, 0.93, 0.88, 0.82, 0.58.
- Last-three rolling average: 0.76, above threshold 0.05.
- MAD noise floor: 0.089; latest ratio 0.58 remained above it.
- Question coverage: 1.00; composite stop telemetry did not supersede the configured hard-cap reason.
- Stop-policy interpretation: all five required iterations ran; early convergence was telemetry only and review broadened through product, workflow, entitlement, local architecture, and adversarial protocol angles.
- Divergence summary: no formal pivot/Council artifacts; public tool enumeration, static auth/install, entitlement, and packet placement were saturated. Paid runtime validation is the remaining frontier.
- Confidence: high for the published endpoint/auth/plan/rate/public-tool/local architecture contract; medium for adapter compatibility; unknown for authenticated live schema and paid-runtime behavior.
