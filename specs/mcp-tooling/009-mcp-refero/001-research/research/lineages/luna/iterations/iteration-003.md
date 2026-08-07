# Iteration 003

## Focus

Broaden the review across the current Refero tool contract, the official `refero_skill` workflows for styles/screens/flows and app/element discovery, commercial gating, `mcp-remote` transport/auth, and the read-only Code Mode plus `sk-design` pairing boundary. Resolve documentation drift without treating a live endpoint probe as completed.

## Actions Taken

- Re-read the local `refero` UTCP manual and the phase-2 authoring specification, including its explicit read-only, Code Mode, and `sk-design` constraints.
- Reviewed the current official Refero tools page, documentation index, getting-started page, and plans page.
- Reviewed the current raw official `refero_skill` `SKILL.md` and `references/mcp-tools.md`.
- Rechecked the upstream `geelen/mcp-remote` README for OAuth storage, custom Bearer headers, transport selection, debugging, and tool filtering.
- Compared the retrieved sources against iterations 1–2; no live `tools/list`, OAuth challenge, or installation test was possible in this environment.

## Findings

### 1. Current authoritative inventory is eight tools, but source retrieval can expose a stale four-tool view

The detailed official tools page currently documents three layers and eight tools:

| Layer | Tools | Contract highlights |
|---|---|---|
| Styles | `refero_search_styles`, `refero_get_style` | Semantic `query`; `page` pagination; style UUID(s); optional `response_format`; full guidance covers visual thesis, token roles, typography, spacing, surfaces, components, imagery, and do/don't rules. |
| Screens | `refero_search_screens`, `refero_get_screen`, `refero_get_similar_screens`, `refero_get_screen_image` | Search requires `query` and `platform` (`web`/`ios`); use `page`; screen identifiers are UUID strings; detail accepts one of `screen_id`/`screen_ids`; similar lookup accepts UUID plus `limit` 1–20; image lookup accepts UUID plus `image_size` thumbnail/full. |
| Flows | `refero_search_flows`, `refero_get_flow` | Search requires `query` and `platform`; use `page`; flow identifiers are numeric; detail accepts one of `flow_id`/`flow_ids`; results include steps and journey metadata. |

The same page explicitly forbids old `_tool` names, numeric screen IDs, and `image_size`/`include_similar` on `refero_get_screen`; those capabilities are split into dedicated tools. The current raw official skill reference agrees with this eight-tool contract. However, a search-result extraction of the same official tools URL still presented an older four-tool screen/flow inventory. Packet authoring must cite the retrieved page/repository revision and include a surface-drift warning; do not copy search snippets or historical examples as contracts.

Sources: [official tools](https://doc.refero.design/mcp/tools), [current official tool reference](https://github.com/referodesign/refero_skill/blob/master/references/mcp-tools.md).

### 2. App and element workflows remain query-driven, not separate tools

The official skill routes company/product discovery through semantic screen or flow queries containing the product name, then uses returned `site` metadata. Element discovery uses literal queries such as table, modal, toggle, empty state, or recovery codes and compares `ui_elements`, `ux_patterns`, `page_types`, and content descriptions. There is no separate `search_apps` or `search_elements` tool in the current inventory. Styles establish visual language first; screens provide concrete patterns; flows provide sequencing, goals, actions, system responses, recovery, and completion states. If flows are sparse, the skill permits reconstructing a journey from related screens, but that is synthesis rather than a new transport capability.

Sources: [official skill](https://github.com/referodesign/refero_skill/blob/master/SKILL.md), [official examples](https://doc.refero.design/mcp/examples).

### 3. Commercial language has an operational ambiguity that must be preserved

The current plans page says Free has limited web results and no MCP, Refero Skill, or Figma plugin. Pro enables full results, flows, downloads, MCP, and the skill; Team adds administration, shared bookmarks, and SSO; Lifetime is described as unlimited access. Separately, the MCP getting-started page states Pro includes 8,000 tool calls per month and business plans have higher/custom limits. The packet should say MCP requires Pro and record the documented 8,000 monthly MCP quota as the operational limit; it must not translate “unlimited access” into unlimited MCP calls. No authoritative per-minute, concurrency, or per-tool limit was found.

Sources: [plans](https://doc.refero.design/help/plans), [MCP getting started](https://doc.refero.design/mcp/getting-started).

### 4. `mcp-remote` behavior is documented upstream, but runtime persistence is environment-dependent

`mcp-remote` bridges a stdio-only client to the remote HTTP MCP endpoint. Upstream documents OAuth credential storage under `~/.mcp-auth`, configurable with `MCP_REMOTE_CONFIG_DIR`; session separation also depends on server URL, `--resource`, and custom headers. Static credentials use `--header` with an environment-backed `Authorization: Bearer ${AUTH_TOKEN}` value. `--transport` (`http-first` default, plus HTTP/SSE-only variants), `--debug`, `--auth-timeout`, and `--ignore-tool` are useful troubleshooting or hardening flags, not additions to the minimal existing manual. Ephemeral homes, client argument escaping, package caching, and the target host's actual auth challenge still require installation/live verification.

Source: [upstream mcp-remote README](https://github.com/geelen/mcp-remote).

### 5. The packet boundary is evidence transport, not design authority

The local phase-2 specification and `sk-design` contract require `mutatesWorkspace:false`, no Write/Edit/Task, and Code Mode as the only Refero dispatch path through the existing `refero` manual. Refero results are evidence; `sk-design` owns taste, accessibility, responsive judgment, synthesis, and acceptance. The packet must not add CLI-primary behavior, invent a local Refero write path, or let a transport response become a design approval. It should document the eight tools, the `refero.refero_<tool>` Code Mode naming convention, source-confidence labels, auth/quota troubleshooting, and a live-surface drift check.

Sources: local [phase-2 authoring spec](../../../../../../002-skill-authoring/spec.md), local [UTCP manual](../../../../../../../../.utcp_config.json), local [sk-design contract](../../../../../../../../../../skills/sk-design/SKILL.md).

## Questions Answered

- Complete inventory and contracts: answered as an eight-tool documented surface, with explicit source-drift and stale-snippet warnings.
- Authentication and limits: OAuth or Bearer through the remote endpoint; upstream OAuth storage and static-header flags are documented; Pro’s documented MCP quota is 8,000 monthly calls; finer-grained limits remain unknown.
- App/screen/flow/element workflows: answered; apps/products and elements are query dimensions and returned metadata, while styles/screens/flows are the actual research layers.
- Free versus paid: answered for Free, Pro, Team, and Lifetime at the documented capability level, with the “unlimited” versus 8,000-call ambiguity retained.
- Packet constraints: answered; read-only Code Mode transport, no local mutation, and mandatory `sk-design` judgment pairing.

## Questions Remaining

- Live endpoint `tools/list` and the actual OAuth challenge remain unverified because the API hostname was unreachable in this environment.
- A real installation against the target host, including package/cache behavior, client argument escaping, and persistence across runtime restarts, remains unperformed.
- Exact Refero throttling beyond the documented monthly quota remains undocumented.
- The apparent four-tool search-index extract versus the current eight-tool detailed page should be rechecked during packet authoring or installation-time schema inspection.

## Next Focus

No further research iteration is available under the configured three-iteration cap. Synthesis/authoring should use the current official detailed tools page and current raw skill reference, label live behavior as unverified, and encode the commercial, transport, and `sk-design` boundaries without inventing contracts.

