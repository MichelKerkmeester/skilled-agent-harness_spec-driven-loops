# Refero MCP transport packet research

Research topic: Refero MCP developer surface and official Refero Skill workflows needed to author a read-only, Code Mode-only `mcp-refero` transport under `mcp-tooling`, paired with `sk-design`, on top of the existing `.utcp_config.json` manual.

Evidence status used below:

- **Confirmed** — current official documentation, official source, verified local contract, or direct unauthenticated observation.
- **Inferred** — supported by multiple confirmed facts but not exercised end to end.
- **Unknown** — requires authenticated paid access or unpublished provider policy.

## 1. Executive Summary

Author `mcp-refero` as a fourth `mcp-tooling` mode and a second transport. It is a non-mutating evidence bridge, not a design authority: `packetKind:"transport"`, `backendKind:"refero-code-mode-transport"`, `routingClass:"metadata"`, `mutatesWorkspace:false`, with `sk-design` as its mandatory cross-hub judgment partner whenever retrieved evidence feeds a design decision. It must neither become a standalone hub nor be embedded as a new `sk-design` mode. [SOURCE: file:.opencode/skills/mcp-tooling/mode-registry.json] [SOURCE: file:.opencode/skills/sk-design/SKILL.md]

The server’s current public surface is exactly eight read-only tools across styles, screens, and flows. “Apps” and “elements” are query/result facets—company/site metadata and `ui_elements`—not separate tool families. Current docs explicitly reject old `_tool` names, `get_design_guidance`, numeric screen IDs, and legacy search/detail arguments. [SOURCE: https://doc.refero.design/mcp/tools]

Every external call must use the already-registered Code Mode manual named `refero`; do not alter `.utcp_config.json`. Because the MCP’s own tool names already begin with `refero_`, Code Mode’s manual-prefix rule produces a doubled callable prefix: for example, discovery name `refero.refero.refero_search_styles` becomes `refero.refero_refero_search_styles(...)` inside `call_tool_chain`. The existing local Refero reference records this as live-verified. [SOURCE: file:.opencode/skills/mcp-code-mode/README.md:112] [SOURCE: file:.opencode/skills/sk-design/design-interface/references/mcp_tooling/refero_tools.md:18]

Live MCP access is paid and authenticated. Free is access-denied, not an abbreviated tool set. Pro is the first individual tier with MCP and has a published 8,000-calls-per-month quota. No public source reviewed specifies a per-second, per-minute, burst, concurrency, or `Retry-After` contract. [SOURCE: https://doc.refero.design/help/plans] [SOURCE: https://doc.refero.design/mcp/getting-started]

The existing `npx -y mcp-remote https://api.refero.design/mcp` manual is structurally appropriate: Code Mode consumes stdio while Refero speaks remote HTTP. Without a supplied header, `mcp-remote` performs browser OAuth and persists operator-owned auth state outside the packet. The packet must never accept, inspect, print, cache, clear, or repair credentials. [SOURCE: file:.utcp_config.json:148] [SOURCE: https://github.com/geelen/mcp-remote]

## 2. Scope, Method, and Evidence Boundary

Five iterations were run because `stopPolicy:max-iterations` made early convergence telemetry non-terminal:

1. Current official tools and unauthenticated live behavior.
2. Plans, quotas, pagination, batching, images, and data shapes.
3. `mcp-remote` transport, OAuth discovery, persistence, and failures.
4. Local `mcp-tooling`, Code Mode, Figma transport, and `sk-design` architecture.
5. Contradiction review against the official repository and local router/test conventions.

Sources were restricted to official Refero documentation, the official `referodesign/refero_skill` repository, official `mcp-remote` source/package metadata, direct read-only unauthenticated HTTP observations, and verified local contracts. No paid login, browser authorization, token exchange, Code Mode launch, or auth-cache mutation was performed because those actions would write operator state outside this lineage. [SOURCE: https://api.refero.design/mcp] [SOURCE: https://github.com/referodesign/refero_skill] [SOURCE: https://github.com/geelen/mcp-remote]

The official repository’s current default branch is `master`, with researched head `f78b4eccf112d7a179b92afeafdd7e8684560ac2`; use `master` or an immutable commit in downstream provenance, not `main`. [SOURCE: https://api.github.com/repos/referodesign/refero_skill]

## 3. Confirmed MCP Tool Surface

Runtime rule: treat this table as the expected baseline, then use Code Mode `list_tools`/`search_tools` and `tool_info` as the final live schema before calling. [SOURCE: https://doc.refero.design/mcp/tools] [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md:285]

| Layer | MCP tool | Documented arguments | Default/bounds | Primary result |
|---|---|---|---|---|
| Styles | `refero_search_styles` | `query:string` required; `page?:number`; `response_format?:"md"|"json"` | page 1; format `md` | `{pagination, records[]}`; style UUID/title/source URL/preview/description/platform |
| Styles | `refero_get_style` | exactly one of `style_id:string` or `style_ids:string[]`; optional response format | 3–4 full styles is a practical batch maximum, not a server-enforced published bound | visual thesis, token roles, type, layout, spacing, surfaces, components, imagery, do/don’t |
| Screens | `refero_search_screens` | `query:string`; `platform:"web"|"ios"`; `page?`; `response_format?` | page 1; format `md` | pagination plus UUID records with site/app context, URLs, patterns, elements, colors, and content |
| Screens | `refero_get_screen` | exactly one of `screen_id:string` or `screen_ids:string[]`; optional response format | screen IDs are UUIDs; no published batch maximum | full screen metadata, fonts, page/pattern/element tags, description/layout/functions |
| Screens | `refero_get_similar_screens` | `screen_id:string`; `limit?:number`; optional response format | limit 1–20, default 10 | comparable screen records |
| Screens | `refero_get_screen_image` | `screen_id:string`; `image_size?:"thumbnail"|"full"` | thumbnail default | raw screenshot image content |
| Flows | `refero_search_flows` | `query:string`; `platform:"web"|"ios"`; `page?`; `response_format?` | page 1; format `md` | pagination plus numeric flow IDs, site, steps summary, problem, description |
| Flows | `refero_get_flow` | exactly one of `flow_id:number` or `flow_ids:number[]`; optional response format | no official hard batch maximum; keep batches modest | ordered steps with screen UUID, goal, action, system response, metadata, related queries |

Important call-shape constraints:

- `response_format` is documented on the seven text-returning tools, but the official repository cautions that clients may expose it conditionally. Ask `tool_info`; never add it to `refero_get_screen_image`. [SOURCE: https://doc.refero.design/mcp/tools] [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/references/mcp-tools.md]
- Search uses `page`, never legacy `limit`/`offset`. `limit` belongs only to similar-screen retrieval. [SOURCE: https://doc.refero.design/mcp/tools]
- `image_size` belongs only to `refero_get_screen_image`; `include_similar` is not a current argument. [SOURCE: https://doc.refero.design/mcp/tools]
- Styles and screens use UUID strings. Flows use numeric IDs. [SOURCE: https://doc.refero.design/mcp/data-model]
- Do not expose fabricated `search_apps`, `get_app`, `search_elements`, or `get_element` calls. Search screen text, company, pattern, state, or element terms; inspect `site` and `ui_elements` in results. [SOURCE: https://doc.refero.design/mcp/tools]

## 4. Data Model, Result Handling, and Context Discipline

Search responses in JSON mode follow `{ pagination: { count, page, next_page, total_count, total_pages }, records: [...] }`. Styles carry `uuid`, `title`, `url`, `preview_url`, `platform`, and description. Screens carry a UUID, `site`, `page_url`, `refero_url`, thumbnail, page types, UX patterns, UI elements, colors, and content. Flows use numeric IDs and include ordered steps; full flow steps connect back to screen UUIDs and express goal/action/system-response. [SOURCE: https://doc.refero.design/mcp/tools] [SOURCE: https://doc.refero.design/mcp/data-model]

The provider says fields can grow. Preserve unknown structured fields rather than decoding into a closed local schema that silently drops additions. Validate stable discriminators and argument unions, then pass through the returned record. [SOURCE: https://doc.refero.design/mcp/data-model]

Use metadata first:

1. Search and compare titles/descriptions/tags.
2. Fetch details only for shortlisted IDs.
3. Request similar screens only after one screen is materially relevant.
4. Request `thumbnail` only when metadata is insufficient.
5. Request `full` only for fine visual details.

Full styles are large; the current local live-verified reference estimates roughly 10–15k characters each. Keep style batches to 3–4 and other detail batches modest. If a screen/flow batch fails, retry with fewer IDs; do not invent a hard screen or flow maximum. A local legacy reference mentions ten flows, but the current official docs publish no such maximum, so it is not a transport guarantee until `tool_info` or an authenticated runtime proves it. [SOURCE: file:.opencode/skills/sk-design/design-interface/references/mcp_tooling/refero_tools.md:56] [SOURCE: https://doc.refero.design/mcp/examples]

## 5. Read-Only Research Workflows

### Visual direction

1. `sk-design` grounds the brief and selects the judgment mode.
2. Search styles using the product/domain/audience and a concrete aesthetic direction.
3. Inspect JSON metadata, then get one shortlisted style for local critique-against use.
4. Return style evidence and role constraints to `sk-design`; the transport makes no palette, type, layout, or readiness decision.

Official Refero methodology recommends searching 3–5 angles and comparing several styles. The local `sk-design` contract is stricter for design-affecting use: resolve one matching live reference, name the category default, never show a chooser, and never copy it. Reconcile them by allowing breadth during transport research while requiring `sk-design` to collapse that evidence to one declared critique reference before design judgment. Multiple results may still be returned when the user explicitly asks for competitive research or comparison rather than a design direction. [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/SKILL.md] [SOURCE: file:.opencode/skills/sk-design/design-interface/references/design_grounding/design_references_mcp.md:76]

### Concrete screen/pattern research

1. Search a literal screen, element, state, company, or on-screen concept with required platform.
2. Inspect result metadata and UUIDs.
3. Get detail for the most relevant screen(s).
4. If one screen is close, query similar screens for controlled comparison.
5. Request an image only when the textual metadata cannot answer the question.

### Journey research

1. Search the user task and platform.
2. Get one relevant numeric flow ID.
3. Use step goals, actions, responses, completion state, and `related_queries` to understand or widen the journey.
4. If flows are sparse, broaden the query or reconstruct from related screens; report the reconstruction as inference. [SOURCE: https://doc.refero.design/mcp/examples]

### Competitive or factual lookup

Pure transport requests such as “list Refero screens matching X” may return factual evidence without a taste verdict. If that evidence will influence a design, route it back through `sk-design` before choosing, adapting, implementing, auditing, or claiming ready.

## 6. Authentication, Plans, and Entitlements

Refero documents remote HTTP at `https://api.refero.design/mcp` with OAuth or a Bearer header. Direct unauthenticated GET and JSON-RPC `initialize` both returned HTTP 401. The response advertised Bearer auth, scope `files:read`, and a protected-resource metadata URL. [SOURCE: https://doc.refero.design/mcp/getting-started] [SOURCE: https://api.refero.design/mcp]

Entitlement boundary:

| Tier | MCP implication |
|---|---|
| Free | No MCP access; do not model a reduced/free tool list |
| Pro | First individual tier with MCP/Skill access; 8,000 tool calls per month |
| Team | Inherits Pro capabilities according to plan documentation |
| Business | Negotiated/usage-oriented volume access; published business example is commercial, not a universal limit |

The official GitHub skill is public and its craft methodology can be read without a paid account. That does not make the live MCP free: SaaS plan entitlement and public methodology availability are different layers. [SOURCE: https://doc.refero.design/help/plans] [SOURCE: https://github.com/referodesign/refero_skill]

Packet behavior:

- Never accept tokens as a tool argument or prompt field.
- Never print Authorization headers, OAuth codes, token responses, auth-cache paths containing sensitive values, or debug logs.
- Never edit the existing manual or add a bearer-header snippet by default.
- On 401/auth-required, tell the operator browser authorization or paid entitlement is required.
- On free/gated-tool behavior, report access denial; do not silently downgrade to fabricated results.

## 7. Existing `mcp-remote` Transport

The existing manual is:

```text
manual: refero
stdio command: npx -y mcp-remote https://api.refero.design/mcp
env: {}
```

`mcp-remote` presents a local stdio MCP to Code Mode and proxies to Refero’s remote HTTP endpoint. Its default transport strategy is HTTP-first with SSE fallback only after HTTP 404; this matches Refero’s documented HTTP setup, so the packet should not force SSE. [SOURCE: file:.utcp_config.json:148] [SOURCE: https://github.com/geelen/mcp-remote#transport-strategies]

With no custom header, current bridge behavior is browser OAuth with a localhost callback (3334 by default, another free port if occupied) and a 30-second default callback timeout. Auth data—client information, tokens, and PKCE state—is stored under `MCP_REMOTE_CONFIG_DIR` or `~/.mcp-auth`, namespaced by package version and a server-derived hash. Debug logs also live in that operator-owned area. [SOURCE: https://github.com/geelen/mcp-remote] [SOURCE: https://github.com/geelen/mcp-remote/blob/main/src/lib/mcp-auth-config.ts]

The live 401 advertises `https://api.refero.design/.well-known/oauth-protected-resource`, which returned 404 during research. Current bridge source treats a 404 as a discovery miss and tries alternate well-known locations. Refero’s authorization-server metadata is available and advertises authorization-code/client-credentials grants, dynamic registration, token/revocation endpoints, and `read`/`files:read` scopes. End-to-end recovery is plausible but remains **inferred** until an operator completes OAuth. [SOURCE: https://github.com/geelen/mcp-remote/blob/main/src/lib/protected-resource-metadata.ts] [SOURCE: https://api.refero.design/.well-known/oauth-authorization-server]

The manual intentionally uses unpinned `mcp-remote`; the researched npm version was 0.1.38 and the project calls itself experimental. Document the dependency and test behavior, but do not change the existing command during packet authoring unless separately requested. [SOURCE: https://www.npmjs.com/package/mcp-remote] [SOURCE: https://github.com/geelen/mcp-remote/blob/main/package.json]

The local live-verified Refero reference adds a runtime constraint: Code Mode must use Node 24; its isolated-vm path reportedly crashes under Node 25. Treat this as current local operational evidence and a troubleshooting check, not a server protocol property. [SOURCE: file:.opencode/skills/sk-design/design-interface/references/mcp_tooling/refero_tools.md:19]

## 8. Quotas, Rate Behavior, and Error Contract

Confirmed quota: 8,000 Pro MCP tool calls per month. A Business example cites $0.001/request with a $2,000 minimum (2,000,000 initial requests), but it is a commercial illustration, not a public MCP throttling guarantee. [SOURCE: https://doc.refero.design/mcp/getting-started] [SOURCE: https://doc.refero.design/mcp/business]

Unknown: per-second, per-minute, burst, concurrency, page-size, `Retry-After`, and authenticated 429 behavior. The packet must not invent a client-side QPS number. If a 429 occurs, preserve the provider message and header-derived retry guidance when present; otherwise ask the operator to wait/reduce batching without asserting a duration.

Normalize failures into a structured envelope such as:

```text
{ success, data, errors: [{ class, message, retryable, operatorAction }], timestamp }
```

Recognize at least:

- manual/tool not discovered or schema drift;
- paid entitlement/auth required;
- browser callback timeout or token exchange/refresh failure;
- stale local auth state (report, never auto-delete);
- remote transport unavailable/mismatch;
- invalid ID type, union, enum, page, limit, or obsolete argument;
- quota/rate response;
- context/output too large or execution timeout;
- Node/runtime connection closure.

Use try/catch in `call_tool_chain`, bounded timeouts (30 seconds simple, 60 seconds multi-call, higher only when justified), and structured returns. Never turn a partial multi-call failure into a successful design result. [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md:365]

## 9. Official Refero Skill: Adopt, Adapt, Reject

The official repository is methodology, not an MCP server implementation. At researched head it has root `SKILL.md` version 1.1, ten focused Markdown references, and a banner. It works as craft guidance without live MCP but uses live styles/screens/flows when configured. [SOURCE: https://github.com/referodesign/refero_skill/tree/f78b4eccf112d7a179b92afeafdd7e8684560ac2]

Adopt:

- research before design;
- styles → screens → flows role separation;
- concrete semantic queries and metadata-first retrieval;
- reference specificity and source URLs;
- no wholesale copying;
- no averaging strong references into a generic middle;
- preserve token/component/media roles;
- synthesize evidence before implementation;
- broaden weak queries, inspect later pages, or reconstruct sparse flows from screens.

Adapt to local `sk-design`:

- Upstream’s primary-plus-secondary reference lock becomes a single declared critique reference for ordinary design-affecting use, because local `sk-design` forbids an inspiration chooser. Comparative research remains allowed when explicitly requested.
- Upstream’s design brief maps into the hub’s mandatory manager intake: goal, surface, inputs, constraints, proof.
- Reference locks and decision ledgers are judgment artifacts owned by `sk-design`; `mcp-refero` supplies IDs, metadata, images, and source-backed facts.

Reject from the transport packet:

- upstream’s claim to be the primary/default design authority;
- direct implementation, CSS/frontend editing, image generation, and visual-QA ownership;
- default three-direction chooser behavior;
- direct bearer-header installation example;
- ready/accessible/responsive/taste verdicts;
- any behavior that caches or copies third-party reference content into the repo.

[SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/SKILL.md] [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/references/visual-workflow.md] [SOURCE: file:.opencode/skills/sk-design/design-interface/references/design_grounding/design_references_mcp.md]

## 10. Local `mcp-refero` Architecture

### Registry identity

Recommended mode entry:

```json
{
  "workflowMode": "mcp-refero",
  "packetKind": "transport",
  "backendKind": "refero-code-mode-transport",
  "toolSurface": {
    "allowed": [
      "Read", "Glob", "Grep",
      "mcp__code_mode__search_tools",
      "mcp__code_mode__list_tools",
      "mcp__code_mode__tool_info",
      "mcp__code_mode__call_tool_chain"
    ],
    "forbidden": ["Write", "Edit", "Bash", "Task"],
    "mutatesWorkspace": false,
    "bashAllowlist": []
  },
  "packet": "mcp-refero",
  "packetSkillName": "mcp-refero",
  "grandfatheredFolderMismatch": false,
  "command": null,
  "advisorRouting": { "routingClass": "metadata", "packetSkillName": "mcp-refero" }
}
```

Add `mcp-refero` to `extensions.transport-axis.transports` and map it to `sk-design` in `crossHubPairing`. Keep `mcp-code-mode` external infrastructure rather than a mode. [SOURCE: file:.opencode/skills/mcp-tooling/mode-registry.json]

### Router

Append `mcp-refero` after existing modes in `tieBreak`. Add narrow signals/classes such as:

- aliases: `refero`, `refero mcp`, `refero design`, `refero styles`;
- action phrases: `search Refero screens`, `search Refero flows`, `find UI references`, `real-world UI reference research`;
- resource: `mcp-refero/SKILL.md`.

Do not use generic `design`, `UI`, `screen`, or `flow` alone as strong signals; those collide with `sk-design`, Figma, browser, and task workflows. Add holdout tests for Figma render/export, browser screenshots, generic UI design, and unspecified “find a screen.” [SOURCE: file:.opencode/skills/mcp-tooling/hub-router.json]

### Code Mode namespace

Expected discovery/call translation:

| Underlying MCP tool | `list_tools` dotted name | Callable inside `call_tool_chain` |
|---|---|---|
| `refero_search_styles` | `refero.refero.refero_search_styles` | `refero.refero_refero_search_styles(...)` |
| `refero_get_style` | `refero.refero.refero_get_style` | `refero.refero_refero_get_style(...)` |
| `refero_search_screens` | `refero.refero.refero_search_screens` | `refero.refero_refero_search_screens(...)` |
| `refero_get_screen` | `refero.refero.refero_get_screen` | `refero.refero_refero_get_screen(...)` |
| `refero_get_similar_screens` | `refero.refero.refero_get_similar_screens` | `refero.refero_refero_get_similar_screens(...)` |
| `refero_get_screen_image` | `refero.refero.refero_get_screen_image` | `refero.refero_refero_get_screen_image(...)` |
| `refero_search_flows` | `refero.refero.refero_search_flows` | `refero.refero_refero_search_flows(...)` |
| `refero_get_flow` | `refero.refero.refero_get_flow` | `refero.refero_refero_get_flow(...)` |

Always discover live and inspect exact syntax. The table is the expected contract, not permission to skip `tool_info`. The current local Refero example calls synchronously inside the Code Mode body (no top-level `await`); retain that verified pattern unless live `tool_info` demonstrates a runtime change. [SOURCE: file:.opencode/skills/sk-design/design-interface/references/mcp_tooling/refero_tools.md:74]

### `sk-design` pairing

Order is a hard contract for design-affecting requests:

1. Hub manager intake: goal, surface, inputs, constraints, proof expectations.
2. Select smallest judgment mode; UI build/redesign loads the required interface+foundations bundle.
3. Set Brand/Product register before palette/layout/motion/copy decisions.
4. Show selected route, evidence plan, and transport role.
5. `mcp-refero` retrieves only requested evidence.
6. Return evidence to the selected design mode; transport output cannot satisfy taste, accessibility, responsiveness, or ready gates by itself.

`interface` is the current primary Refero consumer. `audit` may evaluate a surface against evidence; `foundations` can interpret explicit style-system evidence when the hub routes that axis; `motion` may use flow sequences as evidence; `md-generator` is not the default partner because it owns measured live-site extraction. [SOURCE: file:.opencode/skills/sk-design/SKILL.md] [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:309]

### Existing duplicate knowledge

The repository already contains `sk-design/design-interface/references/mcp_tooling/refero_tools.md`, including the exact doubled prefix, Node 24 requirement, result shape, and troubleshooting. The new packet should become the canonical transport/tool-surface owner. Keep `design_references_mcp.md` as the judgment-side “when/how” contract; replace or slim the old tool catalog into a pointer to `mcp-refero` so two schema copies do not drift. Update `design-interface` integration prose from “direct mcp-code-mode reference lookup” to “`mcp-refero` transport over mcp-code-mode.” [SOURCE: file:.opencode/skills/sk-design/design-interface/references/mcp_tooling/refero_tools.md] [SOURCE: file:.opencode/skills/sk-design/design-interface/references/design_grounding/design_references_mcp.md]

## 11. Recommendations

1. Make `mcp-refero` the single local owner of Refero transport, live discovery, exact tool catalog, argument rules, auth/bridge troubleshooting, and read-only workflows.
2. Preserve `.utcp_config.json` byte-for-byte; the packet consumes the existing manual and documents prerequisites only.
3. Put all four Code Mode discovery/execution meta-tools in both packet frontmatter and registry tool surface; do not rely on guessed names.
4. Allowlist the eight underlying tools and fail closed if the live catalog is missing, renamed, or expanded. New provider tools require a reviewed packet update.
5. Validate documented unions/enums/bounds before execution while allowing unknown response fields.
6. Prefer JSON for programmatic comparison when live schema exposes it; use Markdown only for human-readable detail; separate images from metadata.
7. Keep all design decisions and reference selection in `sk-design`; return Refero results as cited evidence only.
8. Preserve the local one-reference/no-chooser/no-copy discipline for design work. Multiple candidates are a research intermediate or explicit comparison output, never a transport-generated taste menu.
9. Separate deterministic no-account tests from operator-authorized paid OAuth smoke tests.
10. Treat Node version, unpinned `mcp-remote`, OAuth metadata inconsistency, and unpublished throttling as explicit operational risks.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Use stale four-tool, `_tool`, numeric-screen-ID, `limit`/`offset` surface | Current docs define eight tools and list these as mistakes | [SOURCE: https://doc.refero.design/mcp/tools] | 1 |
| Model Free as a smaller MCP surface | Free has no MCP access | [SOURCE: https://doc.refero.design/help/plans] | 2 |
| Treat 8,000/month as a burst rate | It is a monthly Pro quota; no short-window limit is published | [SOURCE: https://doc.refero.design/mcp/getting-started] | 2 |
| Rigidly strip unknown response fields | Official data model can grow | [SOURCE: https://doc.refero.design/mcp/data-model] | 2 |
| Force SSE | Refero documents HTTP and bridge defaults HTTP-first | [SOURCE: https://github.com/geelen/mcp-remote#transport-strategies] | 3 |
| Put bearer tokens in calls/skill files | Credentials belong to operator manual/environment/OAuth state | [SOURCE: https://github.com/geelen/mcp-remote#custom-headers] | 3 |
| Automatically clear `~/.mcp-auth` | It is destructive operator-owned credential state | [SOURCE: https://github.com/geelen/mcp-remote#troubleshooting] | 3 |
| Make Refero a standalone hub or `sk-design` mode | It is a transport under `mcp-tooling`; judgment stays in `sk-design` | [SOURCE: file:.opencode/skills/mcp-tooling/SKILL.md] | 4 |
| Grant Bash because the manual launches `npx` | Code Mode owns stdio process launch; packet has no shell role | [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md:269] | 4 |
| Treat search rank/similarity as taste authority | Transport evidence cannot replace design acceptance | [SOURCE: file:.opencode/skills/sk-design/SKILL.md:263] | 4 |
| Vendor the official Refero Skill wholesale | Its primary-design-authority, implementation, image, chooser, and QA scope conflicts with local boundaries | [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/SKILL.md] | 5 |
| Replace existing manual with direct bearer setup | Explicit scope requires the existing `mcp-remote` manual | [SOURCE: file:.utcp_config.json:148] | 5 |
| Hardcode one authenticated schema snapshot | `tool_info` is runtime authority and fields evolve | [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md:285] | 5 |
| Route on generic “design” | It collides with Figma and `sk-design`; Refero needs narrow reference-search signals | [SOURCE: file:.opencode/skills/mcp-tooling/hub-router.json] | 5 |
| Run credentialed discovery during this lineage | It would launch OAuth and write auth state outside the allowed artifact root | [SOURCE: https://github.com/geelen/mcp-remote] | 1–5 |

## Divergence Map

| Direction | Status | What resolved it | Remaining frontier |
|---|---|---|---|
| Current vs stale MCP surface | Saturated | Current Tools/Data Model/Examples pages consistently support eight UUID/page-based tools | Authenticated live `tools/list` drift only |
| Free/paid and rate policy | Saturated for entitlements; open operationally | Plans and Getting Started establish no-Free/8,000-monthly | Burst, concurrency, page size, 429 headers |
| Direct HTTP vs stdio bridge | Saturated | Existing manual plus `mcp-remote` source explains stdio→HTTP and HTTP-first | Successful operator OAuth/refresh |
| Official skill as transport implementation | Rejected/pivoted | Repository inspection showed methodology, not server/wrapper code | None for packet architecture |
| Official skill authority vs local design authority | Resolved by audited override | Explicit user requirement and local `sk-design` contract override upstream default-authority/chooser behavior; useful retrieval mechanics retained | Verify resulting cross-skill docs stay non-duplicative |
| Code Mode naming | Saturated locally | Code Mode prefix rule plus existing live-verified Refero catalog proves doubled callable prefix | Reconfirm with live `tool_info` after auth |
| Packet placement | Saturated | Existing Figma transport-axis precedent and registry contracts | Downstream implementation/validation |

No deep-council artifact or divergent pivot file was produced in this single lineage. The main pivots were evidence-driven: stale docs → current docs, assumed `main` → actual `master`, upstream authority → local transport/judgment split, and generic packet design → reuse/de-duplication of the existing local Refero catalog. The remaining frontier is operational testing, not unresolved architectural research.

## 12. Open Questions

No question blocks packet authorship. Preserve these as runtime/provider unknowns:

1. Does authenticated `list_tools` exactly match the eight documented tools and expected doubled Code Mode names today?
2. Does every documented text tool currently expose `response_format` through this Code Mode client?
3. What search page size is used, and can it vary by layer or plan?
4. What per-second, burst, concurrency, 429, and `Retry-After` behavior applies?
5. Does the existing bridge complete authorization, refresh, and dynamic registration despite the advertised protected-resource metadata 404?
6. Is the local “flow batch max 10” observation still true? It is not a published contract.
7. Does the Node 24-only local constraint remain after future Code Mode/isolated-vm releases?

## 13. Verification Plan

### Deterministic, no-account checks

- Registry/router parity: mode key exists in registry and router; folder/frontmatter name match; transport list and cross-hub pairing align; tie-break/resources/aliases align.
- Projection sync: hub `SKILL.md`, README, description, graph metadata, source docs, key files, entities, and mode/transport counts all mention four modes/two transports.
- Permissions: Write/Edit/Bash/Task denied; no file mutation path; all external calls use Code Mode.
- Naming unit fixtures: underlying name → dotted discovery name → doubled callable name for all eight tools.
- Argument fixtures: exact-one-of ID unions; UUID vs numeric IDs; platform enum; page ≥1; similar limit 1–20; image enum; response-format conditionality; obsolete args rejected.
- Result fixtures: preserve unknown fields; distinguish JSON pagination from Markdown; image separate; partial failures structured.
- Routing: positive Refero prompts plus holdouts for Figma, browser screenshots, generic `sk-design`, Mobbin, and ambiguous “find screens.”
- Judgment ordering: design-affecting prompt must show `sk-design` intake/route/register/proof before Refero retrieval; pure factual search must not emit a taste verdict.
- Negative knowledge: `_tool`, `get_design_guidance`, numeric screen ID, `limit`/`offset` searches, `image_size` on detail, guessed tool, secret argument, and auth-cache cleanup all fail closed.

### Operator-authorized live checks

1. Confirm Code Mode uses the supported Node runtime and reconnect after manual load.
2. Run `list_tools`, filter `refero.refero.*`, and capture the exact eight dotted names or a documented drift failure.
3. Run `tool_info` for every tool before invocation; record actual schemas without credentials.
4. Complete browser OAuth; verify a simple JSON style search.
5. Run one styles→detail workflow, one screen→similar workflow, one flow detail, and one explicit thumbnail retrieval.
6. Exercise invalid UUID/flow ID, bad enum, oversized similar limit, and stale names; confirm provider/packet errors remain structured.
7. If safely available, observe a 401/free/gated response and a quota/429 response; never manufacture quota exhaustion.
8. Confirm no logs or evidence artifacts contain tokens, codes, headers, auth cache, or raw debug logs.

Each manual scenario should follow existing packet convention: exact prompt, command sequence, expected signals, evidence, PASS/PARTIAL/FAIL/SKIP criteria, and failure triage. Paid/OAuth scenarios must permit SKIP with the missing entitlement stated. [SOURCE: file:.opencode/skills/mcp-tooling/mcp-figma/manual_testing_playbook/manual_testing_playbook.md]

## 14. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Provider schema drift | Calls fail or stale args are sent | Discovery + `tool_info`; exact eight-tool reviewed allowlist; fail closed |
| Duplicate local catalogs | `sk-design` and `mcp-refero` diverge | Make packet transport authority; keep judgment reference thin |
| Unpinned experimental bridge | Behavior moves with npm resolution/cache | Document and smoke-test; do not silently alter existing manual |
| Broken protected-resource metadata URL | OAuth discovery may fail | Surface browser/discovery failure; operator test; no credential repair |
| Paid entitlement/monthly quota | CI/live lookup unavailable or exhausted | Deterministic fixtures; operator SKIP; metadata-first, modest calls |
| Undocumented throttling | Bursts may fail | Small batches; structured 429; honor actual headers only |
| Large styles/images | Context/output pressure | JSON metadata first; 3–4 styles; thumbnail before full; output bounds |
| Node/isolated-vm mismatch | Connection closure/crash | Document Node 24 local baseline and recognizable error triage |
| Router vocabulary collision | Wrong tool/design mode selected | Narrow Refero phrases and holdout fixtures |
| Reference copying/IP drift | Design becomes derivative | One-reference critique-against; cite URLs; no cache/copy; `sk-design` acceptance |
| Transport becomes taste authority | Architecture/proof contract breaks | Mandatory cross-hub pairing and explicit evidence-only outputs |

## 15. Authoring Checklist

Create under `mcp-tooling/mcp-refero/`:

- `SKILL.md` — transport identity, smart routing, Code Mode-only workflow, eight-tool allowlist, argument/error/safety rules, `sk-design` boundary.
- `README.md` — user-facing overview, prerequisites, exact doubled namespace, plan/auth caveats.
- `INSTALL_GUIDE.md` — verify the existing manual/runtime/OAuth only; explicitly say no config rewrite is required.
- `references/tool-surface.md` — authoritative eight-tool matrix and current response shapes.
- `references/workflows.md` — styles/screens/flows and factual-vs-design-affecting recipes.
- `references/auth_transport.md` — existing `mcp-remote`, OAuth state ownership, plan/quota boundary.
- `references/troubleshooting.md` — discovery, doubled prefix, Node runtime, auth, timeout, quota, drift.
- `manual_testing_playbook/` — routing, discovery, read-only workflows, recovery/negative fixtures.
- `changelog/v1.0.0.0.md` — packet introduction and integration changes.

Update synchronized owners:

- `mcp-tooling/mode-registry.json` — mode, permission surface, transport list/pairing.
- `mcp-tooling/hub-router.json` — narrow signals, classes, tie-break, resource.
- `mcp-tooling/SKILL.md`, `README.md`, `description.json` — four-mode/two-transport identity.
- `mcp-tooling/graph-metadata.json` — dependencies, signals, key files, entities, causal/source lists.
- `mcp-tooling/manual_testing_playbook/` — Refero positive route and holdouts.
- `sk-design/design-interface/SKILL.md` and README — consume `mcp-refero` as transport, retain judgment.
- `sk-design/design-interface/references/design_grounding/design_references_mcp.md` — retain one-reference critique contract.
- `sk-design/design-interface/references/mcp_tooling/refero_tools.md` — replace with a thin pointer or otherwise de-duplicate so the new packet is canonical.

Do not change `.utcp_config.json`, add a second Refero manual, vendor the remote server, add credentials, or grant workspace mutation.

## 16. References

Primary external sources:

- [SOURCE: https://doc.refero.design/mcp/getting-started]
- [SOURCE: https://doc.refero.design/mcp/tools]
- [SOURCE: https://doc.refero.design/mcp/data-model]
- [SOURCE: https://doc.refero.design/mcp/examples]
- [SOURCE: https://doc.refero.design/mcp/business]
- [SOURCE: https://doc.refero.design/help/plans]
- [SOURCE: https://api.refero.design/mcp]
- [SOURCE: https://api.refero.design/.well-known/oauth-authorization-server]
- [SOURCE: https://github.com/referodesign/refero_skill/tree/f78b4eccf112d7a179b92afeafdd7e8684560ac2]
- [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/SKILL.md]
- [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/references/mcp-tools.md]
- [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/references/visual-workflow.md]
- [SOURCE: https://github.com/geelen/mcp-remote]
- [SOURCE: https://github.com/geelen/mcp-remote/blob/main/src/lib/mcp-auth-config.ts]
- [SOURCE: https://github.com/geelen/mcp-remote/blob/main/src/lib/protected-resource-metadata.ts]
- [SOURCE: https://www.npmjs.com/package/mcp-remote]

Primary local sources:

- [SOURCE: file:.utcp_config.json:148]
- [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md]
- [SOURCE: file:.opencode/skills/mcp-code-mode/README.md]
- [SOURCE: file:.opencode/skills/mcp-tooling/SKILL.md]
- [SOURCE: file:.opencode/skills/mcp-tooling/mode-registry.json]
- [SOURCE: file:.opencode/skills/mcp-tooling/hub-router.json]
- [SOURCE: file:.opencode/skills/mcp-tooling/graph-metadata.json]
- [SOURCE: file:.opencode/skills/mcp-tooling/mcp-figma/SKILL.md]
- [SOURCE: file:.opencode/skills/sk-design/SKILL.md]
- [SOURCE: file:.opencode/skills/sk-design/shared/context_loading_contract.md]
- [SOURCE: file:.opencode/skills/sk-design/design-interface/references/mcp_tooling/refero_tools.md]
- [SOURCE: file:.opencode/skills/sk-design/design-interface/references/design_grounding/design_references_mcp.md]

## 17. Convergence Report

- Stop reason: `maxIterationsReached`.
- Total iterations: 5.
- Questions answered: 5 / 5.
- Remaining research questions: 0 authoring-blocking; 7 operational unknowns retained in Section 12.
- Last three iterations: run 3—`mcp-remote` OAuth/local state/failure boundary (0.66); run 4—transport architecture/judgment boundary (0.58); run 5—contradiction and authoring-readiness matrix (0.44).
- New-information ratios: 1.00, 0.78, 0.66, 0.58, 0.44; mean 0.692. All remained above the configured 0.05 threshold.
- Convergence threshold: 0.05.
- Stop-policy interpretation: early question coverage was telemetry only; the loop broadened through local architecture and contradiction review until iteration 5.
- Divergence summary: no formal divergent-mode pivots or Council artifacts; evidence pivots corrected stale tool docs, the repository branch, Code Mode doubled naming, upstream authority/setup conflicts, and local knowledge duplication.
- Confidence: high for published tool/plan/local architecture facts; medium for unauthenticated OAuth fallback inference; unknown for authenticated live drift, throttling, and refresh behavior.
