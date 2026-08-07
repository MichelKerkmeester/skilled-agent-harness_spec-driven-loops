# Refero MCP Developer Surface — Luna Lineage Synthesis

> Detached fan-out lineage `luna` (`cli-codex`, `gpt-5.6-luna`), three forced iterations, `stopPolicy: max-iterations`. This is a research handoff for the `mcp-refero` transport packet; it does not modify the existing `refero` manual, skills, hub routing, or packet-authoring files.

<!-- ANCHOR:summary -->
## 1. Executive Summary

The Refero MCP is a remote HTTP MCP service at `https://api.refero.design/mcp`. The repository's existing `refero` UTCP manual already wraps it as a stdio server through `npx -y mcp-remote https://api.refero.design/mcp`; that manual is the transport baseline for the later packet phase. Refero documents OAuth and static Bearer authentication, requires an eligible paid plan for MCP access, and documents Pro as including 8,000 MCP tool calls per month. The reviewed sources do not establish authoritative per-minute, per-tool, concurrency, or retry limits. [SOURCE: [Refero MCP getting started](https://doc.refero.design/mcp/getting-started); local `.utcp_config.json`]

The current detailed Refero tools documentation describes eight read-oriented tools across styles, screens, and flows. Styles use semantic search and style UUIDs; screens use semantic search plus a required `platform` and screen UUIDs; flows use semantic search plus `platform` and numeric flow IDs. Apps/products and elements are workflow dimensions expressed through queries and returned metadata, not separate `search_apps` or `search_elements` tools. [SOURCE: [Refero MCP tools](https://doc.refero.design/mcp/tools); [Refero data model](https://doc.refero.design/mcp/data-model)]

The official `refero_skill` workflow is styles → screens → flows: establish a visual foundation, inspect concrete screens and states, then inspect multi-step flows. Query terms and returned `site`, `ui_elements`, `ux_patterns`, `page_types`, and content fields support product/app and element research. Refero supplies design-reference evidence; `sk-design` remains the judgment layer for taste, accessibility, responsive behavior, synthesis, and acceptance. [SOURCE: [official `refero_skill`](https://github.com/referodesign/refero_skill)]

The packet should remain read-only and Code Mode only: preserve the existing stdio bridge, expose no Write/Edit/Task behavior, set `mutatesWorkspace:false`, keep secrets in environment variables when static headers are used, and label live endpoint behavior as unverified until an authorized installation test succeeds. The exact packet-level callable name should be discovered after registration rather than assumed from a naming convention.
<!-- /ANCHOR:summary -->

## 2. Background and Scope

This lineage investigated the Refero developer surface needed to author the phase-002 `mcp-refero` transport packet. The pinned product page is [refero.design/mcp](https://refero.design/mcp), and the pinned official skill repository is [referodesign/refero_skill](https://github.com/referodesign/refero_skill). The existing local transport is the `refero` entry at `.utcp_config.json:148-163`:

```json
{
  "name": "refero",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "refero": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "mcp-remote", "https://api.refero.design/mcp"],
        "env": {}
      }
    }
  }
}
```

The research scope covered tool names and contracts, transport/auth, rate-limit evidence, free-versus-paid gating, `refero_skill` workflows, and the boundary between Refero evidence and `sk-design` judgment. It excluded implementation, `.utcp_config.json` changes, hub registration, and live installation side effects.

## 3. Research Questions and Handoff Objectives

The five charter questions were:

1. What is the current Refero MCP tool inventory and each tool's input/output contract?
2. How do authentication and limits work through `mcp-remote`?
3. What workflows cover apps, screens, flows, and elements?
4. What differs between Free and paid Refero access?
5. What constraints apply to a read-only, Code Mode-only packet paired with `sk-design`?

All five questions were addressed in the iteration narratives. The reducer retains them as unchecked legacy-import questions because no machine-readable question-resolution records were emitted; the final packet should therefore treat the narrative answers as researched coverage with explicit remaining evidence gaps, not as proof that every live behavior is verified.

## 4. Method and Evidence Model

Three detached iterations were run under the required maximum-iteration policy. Iteration 1 established the official inventory, workflow, pricing, and packet boundary. Iteration 2 reviewed upstream `mcp-remote` persistence and header flags. Iteration 3 deliberately broadened the review across contract drift, workflow semantics, gating, transport boundaries, and `sk-design` pairing rather than synthesizing early.

Evidence is separated into three confidence classes:

| Class | Meaning in this report |
|---|---|
| Documented contract | Stated on current Refero pages, the official repository, upstream `mcp-remote` documentation, or the existing local packet/spec contract. |
| Cross-source reconciliation | A packet recommendation derived by comparing current detailed docs, the official skill, upstream bridge behavior, and local constraints. |
| Installation/live verification required | Behavior that could not be probed because `api.refero.design` was not reachable in this environment, or because a real install would write package/auth caches outside the allowed lineage packet. |

Iteration artifacts are retained in [`iterations/iteration-001.md`](iterations/iteration-001.md), [`iterations/iteration-002.md`](iterations/iteration-002.md), and [`iterations/iteration-003.md`](iterations/iteration-003.md). The reducer-owned registry, strategy, dashboard, state log, deltas, and [`resource-map.md`](resource-map.md) are the machine trace for this synthesis.

<!-- ANCHOR:findings -->
## 5. Contract Reconciliation Ledger

| Topic | Research result | Authoring posture |
|---|---|---|
| Current tool inventory | Detailed current Refero docs describe eight tools; an older/search-index extraction exposed four screen/flow tools. | Use the detailed current docs and current raw skill reference, but add a source-drift warning and perform installation-time schema inspection. |
| Apps and elements | No dedicated app or element search tool was found. | Use semantic query terms and inspect `site`, `ui_elements`, `ux_patterns`, `page_types`, and content metadata. |
| Transport | Refero is remote HTTP MCP; the local manual bridges it through stdio with `mcp-remote`. | Preserve the existing `npx -y mcp-remote` manual shape. |
| Authentication | Refero documents OAuth or `Authorization: Bearer <token>`. | Keep OAuth as the default path; document static Bearer as an environment-backed troubleshooting/configuration variant. |
| Quota | Pro documentation states 8,000 monthly MCP calls; business plans have higher/custom limits. | State the documented monthly quota; do not infer unlimited MCP calls from plan marketing language. |
| Fine-grained limits | No authoritative per-minute, per-tool, concurrency, or retry limit was found. | Do not invent backoff or concurrency guarantees. |
| Design authority | Refero returns evidence; `sk-design` owns judgment. | Make the transport read-only and require `sk-design` pairing for design decisions. |

<!-- /ANCHOR:findings -->

## 6. Refero MCP Tool Surface

The current detailed tools page lists these eight tools:

| Layer | Tool | Required inputs | Optional inputs and documented result |
|---|---|---|---|
| Styles | `refero_search_styles` | `query: string` | `page`, optional `response_format`; paginated compact style records with UUID, title, URL, platform, preview, and description. |
| Styles | `refero_get_style` | Exactly one of `style_id: string` or `style_ids: string[]` | Optional `response_format`; returns full style guidance including visual thesis, theme, color roles, typography, spacing, layout, elevation, components, imagery, and do/don't rules. |
| Screens | `refero_search_screens` | `query: string`, `platform: "web" | "ios"` | `page`, optional `response_format`; returns paginated screen records with UUID, URLs, site metadata, page types, UX patterns, UI elements, and content metadata. |
| Screens | `refero_get_screen` | Exactly one of `screen_id: string` or `screen_ids: string[]` | Optional `response_format`; returns full screen metadata/content. Current docs say not to pass old `image_size` or `include_similar` options here. |
| Screens | `refero_get_similar_screens` | `screen_id: string` | `limit` 1–20, optional `response_format`; returns related screen records. |
| Screens | `refero_get_screen_image` | `screen_id: string` | `image_size: "thumbnail" | "full"`, optional `response_format`; returns screenshot image content. |
| Flows | `refero_search_flows` | `query: string`, `platform: "web" | "ios"` | `page`, optional `response_format`; returns paginated flow summaries with numeric ID, site, description, problem, and compact steps. |
| Flows | `refero_get_flow` | Exactly one of `flow_id: number` or `flow_ids: number[]` | Optional `response_format`; returns flow goals, steps, user actions, system responses, related screens, and `related_queries`. |

Identifiers are not interchangeable: style and screen identifiers are UUID strings, while flow identifiers are numeric. Current search pagination is documented with `page`; older examples mentioning `limit`/`offset`, numeric screen IDs, or combining image/similar behavior into `refero_get_screen` must not be copied as current contracts. The detailed page also separates screenshot and similar-screen capabilities into their own tools.

The tool inventory is documented rather than live-verified in this environment. The API hostname could not be resolved for an unauthenticated `initialize`/`tools/list` request. The packet should therefore rediscover the live schema during installation or first-use diagnostics and treat `tools/list` as the runtime authority if it differs from the docs.

Sources: [Refero tools](https://doc.refero.design/mcp/tools), [Refero data model](https://doc.refero.design/mcp/data-model), [official `mcp-tools.md`](https://github.com/referodesign/refero_skill/blob/master/references/mcp-tools.md).

## 7. UI-Reference Search Workflows

The official skill's workflow is a research funnel:

1. Search and retrieve several styles to establish a visual foundation. Select one primary direction and borrow bounded details rather than averaging unrelated references.
2. Search screens for concrete structure, states, content hierarchy, components, and product patterns; retrieve full screens, similar screens, or images as needed.
3. Search flows for multi-step journeys; retrieve goals, actions, system responses, recovery states, completion states, related screens, and related queries.
4. Compare multiple references and preserve the source's token/media roles in a reference lock or decision ledger.

Apps/products are found by putting a product, company, industry, or domain term into screen/flow queries and inspecting returned `site` metadata. Elements are found with literal semantic queries such as `table`, `modal`, `toggle`, `empty state`, or `recovery codes`, then compared through `ui_elements`, `ux_patterns`, `page_types`, and content descriptions. There is no separate app or element tool to expose in the transport packet.

Platform is required for current screen and flow search (`web` or `ios`). Style search is a separate, primarily visual-language step. Batch detail lookups modestly with the plural ID fields to control context size. If flows are sparse, the skill permits reconstructing a journey from related screens, but that is downstream synthesis, not a new MCP capability.

The skill's judgment rules are important packet context: do not copy one reference literally; do not average contradictory references into a generic midpoint; retain visual token and media roles; and validate substantial work against the locked target. Those rules belong to `sk-design`, not to the transport adapter.

Sources: [official `refero_skill` `SKILL.md`](https://github.com/referodesign/refero_skill/blob/master/SKILL.md), [official examples](https://doc.refero.design/mcp/examples).

## 8. Transport and Authentication

The remote service endpoint is `https://api.refero.design/mcp`. The existing manual starts `mcp-remote` as a local stdio child, which lets a stdio-only host reach Refero's remote HTTP MCP. The minimal manual should remain:

```json
{
  "transport": "stdio",
  "command": "npx",
  "args": ["-y", "mcp-remote", "https://api.refero.design/mcp"],
  "env": {}
}
```

An empty `env` object means the existing manual supplies no explicit environment variable; it does not prove anonymous access. Refero documents OAuth and Bearer authentication. OAuth may open a browser sign-in flow. For static credentials, upstream `mcp-remote` documents an environment-backed header form:

```json
{
  "command": "npx",
  "args": [
    "-y", "mcp-remote", "https://api.refero.design/mcp",
    "--header", "Authorization: Bearer ${AUTH_TOKEN}"
  ],
  "env": { "AUTH_TOKEN": "<token>" }
}
```

For clients that mishandle spaces in an argument, upstream documents `Authorization:${AUTH_HEADER}` with `AUTH_HEADER` containing `Bearer <token>`. The packet must never place a real token in the manual or logs.

Upstream `mcp-remote` documents OAuth credential storage under `~/.mcp-auth`, overridable through `MCP_REMOTE_CONFIG_DIR`. The server URL, `--resource`, and custom headers can distinguish OAuth sessions. This is an upstream behavior, not a guarantee that the target host persists a home directory. Ephemeral runtimes may require re-authentication. Relevant troubleshooting options include `--debug`, `--transport` (`http-first` default, with HTTP/SSE-only variants), `--auth-timeout`, `--resource`, and `MCP_REMOTE_CONFIG_DIR`; none belongs in the minimal base manual unless a concrete host requires it.

Sources: [Refero getting started](https://doc.refero.design/mcp/getting-started), [upstream `mcp-remote` custom headers](https://github.com/geelen/mcp-remote#custom-headers), [upstream credential storage](https://github.com/geelen/mcp-remote#troubleshooting), [upstream transports](https://github.com/geelen/mcp-remote#transport-strategies).

## 9. Access Tiers, Quota, and Rate-Limit Evidence

The reviewed plan documentation distinguishes the tiers as follows:

| Tier | Relevant documented behavior |
|---|---|
| Free | Limited web results; no MCP, Refero Skill, or Figma plugin access. |
| Pro | Full results, flows, downloads, MCP, and Refero Skill; MCP getting-started documentation states 8,000 tool calls per month. |
| Team | Adds team administration, shared bookmarks, and SSO according to the plans page; do not infer a different MCP tool contract without account evidence. |
| Business | Higher/custom limits; the business page's example `$0.001/request` and `$2,000` minimum is usage/pricing language, not a universal per-request or rate-limit contract. |
| Lifetime | Plan copy uses “unlimited access”; that wording must not be translated into unlimited MCP calls when the MCP page states a monthly quota. |

The safe packet statement is: MCP access requires the eligible paid tier; Pro's documented quota is 8,000 monthly MCP calls; business limits are higher/custom; all finer-grained throttling is unknown. No authoritative per-minute, per-tool, concurrency, HTTP-status, or retry-after policy was found. Error handling should surface the upstream response and advise account/quota review rather than promise automatic retry behavior.

Sources: [Refero plans](https://doc.refero.design/help/plans), [MCP getting started](https://doc.refero.design/mcp/getting-started), [business usage](https://doc.refero.design/mcp/business).

## 10. Read-Only Code Mode and `sk-design` Boundary

The packet is an evidence transport, not a design-authority or workspace-mutation surface. The downstream authoring constraints require:

- `mutatesWorkspace:false`.
- Code Mode as the only Refero dispatch path.
- No Write, Edit, or Task capability in the Refero packet.
- No direct local write path, scraper, or CLI-primary substitute invented around the existing manual.
- `sk-design` pairing for visual taste, accessibility, responsive judgment, synthesis, and acceptance.
- Explicit source-confidence labels so a returned reference is not mistaken for a design approval.

The Code Mode adapter should progressively discover the registered Refero tools, inspect schemas, translate the actual callable names, and return structured results with timeouts and redaction. Repository naming conventions may yield a callable such as `refero.refero_search_screens`, but that name must be confirmed after registration rather than hard-coded as an invariant. A transport response is untrusted reference evidence; it must not override `sk-design` judgment or authorize mutations.

Local boundary evidence: phase-1 [`spec.md`](../../../spec.md), the existing [`.utcp_config.json`](../../../../../../../../.utcp_config.json), and the repository's `mcp-code-mode`/`sk-design` contracts.

## 11. Packet-Authoring Checklist

Phase 002 can author from this packet with the following inputs:

1. Retain the existing `refero` stdio manual and endpoint; do not change it in research.
2. Document the eight current tools and the UUID-versus-numeric ID distinction.
3. Document styles → screens → flows, plus query-driven app/product and element discovery.
4. State `platform` requirements for current screen/flow searches and `page` pagination.
5. Label the older four-tool/old-parameter material as stale or retrieval-drift evidence.
6. Document OAuth as the default supported path and static Bearer `--header` configuration as a secret-safe alternative.
7. Explain `~/.mcp-auth`, `MCP_REMOTE_CONFIG_DIR`, ephemeral-home reauthentication, and troubleshooting flags without bloating the base manual.
8. State Free exclusion, Pro requirement, 8,000 monthly Pro MCP-call quota, and business higher/custom limits.
9. Do not invent per-minute, per-tool, concurrency, or retry guarantees.
10. Keep the packet read-only, Code Mode only, and paired with `sk-design`.
11. Add installation-time `initialize`/`tools/list` inspection and current-doc/source revision checks.
12. Redact tokens and sensitive returned reference data from diagnostics; preserve enough response detail to distinguish auth, quota, transport, and schema drift.

## 12. Validation and Installation Plan

The following checks belong to packet authoring/validation, not this research lineage:

| Check | Expected evidence | Current status |
|---|---|---|
| JSON/manual shape | Existing `refero` entry parses and remains unchanged. | Present locally; not modified. |
| Remote reachability | `mcp-remote` starts and completes MCP initialization. | Not run; API DNS failed in research environment. |
| Auth | OAuth challenge or Bearer request succeeds without logging secrets. | Documented; live behavior unverified. |
| Schema | `tools/list` matches or explains differences from the current eight-tool docs. | Required installation-time check. |
| Workflow | A safe read-only search/detail sequence covers styles, screens, flows, and query-driven app/elements. | Contract-derived; live result shapes unverified. |
| Quota handling | Pro quota/account error is surfaced without invented retry semantics. | Required packet test. |
| Code Mode | Post-registration discovery confirms actual callable names and schemas. | Required; naming convention is not proof. |
| Boundary | No Write/Edit/Task path and no `mutatesWorkspace` violation. | Required packet test. |
| Pairing | `sk-design` owns judgment and acceptance; Refero is treated as evidence. | Required documentation/route test. |

## 13. Risks and Failure Modes

- **Contract drift:** the detailed tools page/current raw skill reference and an older four-tool/search extraction do not agree. The packet must cite current detailed sources and rediscover the live schema.
- **Auth ambiguity:** an empty `env` is not anonymous access. OAuth persistence depends on the runtime filesystem, and static headers require careful argument escaping.
- **Quota ambiguity:** “unlimited access” plan language conflicts operationally with the MCP page's 8,000 monthly Pro quota. Preserve both statements with the quota caveat.
- **Unavailable endpoint:** DNS failure prevented live schema and OAuth challenge verification. Do not label documented contracts as live-tested.
- **Fine-grained throttling unknown:** no safe retry, concurrency, or per-tool limit can be promised.
- **Secret leakage:** Bearer tokens, OAuth state, returned screenshots, and private reference data must stay out of logs and examples.
- **Authority inversion:** Refero evidence must not become design approval; `sk-design` must remain the judgment and acceptance layer.
- **Scope drift:** research must not edit the manual or packet files; later authoring must preserve this phase boundary.

## 14. Source-Confidence Matrix

| Claim | Confidence | Basis |
|---|---|---|
| Endpoint is `https://api.refero.design/mcp` | Documented | Refero MCP docs and existing local manual. |
| Existing bridge is stdio via `npx -y mcp-remote` | Confirmed local/documented | `.utcp_config.json`; Refero setup docs. |
| Eight current tools and their documented contracts | Documented, live verification pending | Current detailed tools page and iteration-3 raw skill review; older retrieval drift remains. |
| Apps/elements are query dimensions, not standalone tools | Cross-source documented | Official skill workflow plus current inventory. |
| OAuth or Bearer supported | Documented | Refero getting-started page. |
| OAuth state under `~/.mcp-auth` / configurable directory | Documented upstream bridge behavior | `mcp-remote` README; target runtime persistence still pending. |
| Pro has 8,000 monthly MCP calls | Documented | Refero MCP getting-started page. |
| No authoritative per-minute/per-tool/concurrency limit | Research result | Three iterations found no primary limit statement; absence is not a guarantee of unlimited behavior. |
| Read-only Code Mode and `sk-design` pairing | Local authoring contract | Phase spec/manual and repository skill contracts. |

<!-- ANCHOR:eliminated-alternatives -->
## 15. Eliminated Alternatives

| Approach | Reason eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Add separate `search_apps` or `search_elements` tools | Current inventory has no such tools; app and element research is query plus metadata. | Official tools/skill references | 1, 3 |
| Copy the older four-tool or old `limit`/`offset` screen contract | Current detailed docs split styles, similar screens, and images into an eight-tool surface and use current parameters. | Official tools page; source-drift comparison | 1, 3 |
| Treat an empty manual `env` as anonymous access | Refero documents OAuth/Bearer and access is plan/account dependent. | Getting-started page; existing manual | 1, 2 |
| Put a real Bearer token in the base manual | It leaks secrets and prevents safe reuse. | Upstream `mcp-remote` header guidance | 2 |
| Add every `mcp-remote` flag to the minimal manual | Transport/debug/auth-timeout flags are environment-specific troubleshooting controls. | Upstream README | 2 |
| Promise unlimited MCP usage from plan copy | MCP documentation states a Pro monthly quota; plan “unlimited” language is not a fine-grained MCP limit. | Plans and getting-started pages | 3 |
| Invent per-minute, per-tool, concurrency, or retry limits | No authoritative values were found. | Three-iteration source review | 1–3 |
| Make Refero the design decision or acceptance authority | The local packet boundary assigns taste and judgment to `sk-design`. | Phase spec and repository contracts | 1, 3 |
| Add Write/Edit/Task or a local Refero mutation path | The requested transport is read-only and Code Mode only. | Phase spec/manual constraints | 1, 3 |
| Claim live `tools/list` or OAuth behavior was verified | The API hostname was unreachable and installation was intentionally not run. | Iteration-1 and iteration-3 limitations | 1, 3 |

<!-- /ANCHOR:eliminated-alternatives -->

<!-- ANCHOR:divergence-map -->
## 16. Divergence Map

The principal divergence was between current detailed documentation and an older/search-index or historical four-tool view. Iteration 3 broadened the review and retained the conflict rather than averaging it away: authoring should use the current detailed eight-tool page and current raw skill reference while requiring installation-time schema inspection.

The second divergence is commercial wording: plans describe “unlimited access” for Lifetime while the MCP getting-started page documents 8,000 monthly Pro tool calls and higher/custom business limits. The synthesis resolves this conservatively by preserving the quota as the operational MCP statement and treating “unlimited” as plan-language that does not establish unlimited MCP calls.

No divergent pivot or graph convergence decision was recorded. Graph telemetry was skipped because the user constrained all writes to the lineage packet and did not authorize the external graph database. The three iterations nevertheless broadened from inventory/workflows to bridge behavior and then to packet-boundary/source-drift review. Under `stopPolicy: max-iterations`, the ratios (`0.91 → 0.68 → 0.83`) were telemetry only; the run continued to the cap.

<!-- /ANCHOR:divergence-map -->

<!-- ANCHOR:open-questions -->
## 17. Open Questions

| # | Question | Why it matters | Required evidence |
|---|---|---|---|
| 1 | What does a live authenticated `tools/list` response return, and does it match the eight-tool documentation? | Freezes the packet's runtime schema and drift policy. | Authorized initialization and schema capture. |
| 2 | What is the actual Refero OAuth challenge and what survives a runtime restart? | Determines first-use and reauthentication guidance. | Installation test with persistent and ephemeral home directories. |
| 3 | Do client argument escaping and `mcp-remote --header` behave as documented in the target host? | Prevents broken static Bearer configuration. | Safe token fixture or vendor-approved test. |
| 4 | What are the actual per-minute, concurrency, per-tool, and retry-after limits? | Prevents unsafe retry/concurrency claims. | Account-tier documentation or controlled quota test. |
| 5 | Does the current skill repository revision remain aligned with the detailed tools page? | Resolves the four-tool/stale-parameter drift before packet freeze. | Pin or record the repository revision and compare references. |
| 6 | Does Code Mode expose the expected `refero.refero_<tool>` names after registration? | Confirms the only permitted invocation path. | Post-registration discovery and `tool_info` check. |

<!-- /ANCHOR:open-questions -->

<!-- ANCHOR:convergence-report -->
## Appendix: Convergence Report

- **Stop reason:** `maxIterationsReached`.
- **Total iterations:** 3.
- **Executor:** `cli-codex`, model `gpt-5.6-luna`.
- **New-information ratios:** `0.91 → 0.68 → 0.83`.
- **Convergence threshold:** `0.05`; telemetry only under the configured max-iterations policy.
- **Machine-tracked questions:** `0/5` resolved in the reducer registry because the charter questions were imported as legacy questions and no structured resolution records were emitted.
- **Narrative coverage:** all five charter questions are addressed, with live schema, OAuth challenge, installation persistence, and fine-grained throttling explicitly left open.
- **Resource map:** emitted at [`resource-map.md`](resource-map.md).
- **Scope handling:** spec writeback, external graph convergence, memory save, and git staging were deferred because the user restricted writes to this lineage directory.

<!-- /ANCHOR:convergence-report -->

## References

### Pinned sources

- [Refero MCP product page](https://refero.design/mcp)
- [Official `refero_skill` repository](https://github.com/referodesign/refero_skill)

### Primary Refero sources

- [MCP getting started](https://doc.refero.design/mcp/getting-started)
- [MCP tools](https://doc.refero.design/mcp/tools)
- [MCP data model](https://doc.refero.design/mcp/data-model)
- [MCP examples](https://doc.refero.design/mcp/examples)
- [Refero plans](https://doc.refero.design/help/plans)
- [Business MCP usage](https://doc.refero.design/mcp/business)
- [Official skill workflow](https://github.com/referodesign/refero_skill/blob/master/SKILL.md)
- [Official skill tool reference](https://github.com/referodesign/refero_skill/blob/master/references/mcp-tools.md)

### Bridge and local contract sources

- [`mcp-remote` custom headers](https://github.com/geelen/mcp-remote#custom-headers)
- [`mcp-remote` credential storage](https://github.com/geelen/mcp-remote#troubleshooting)
- [`mcp-remote` transport strategies](https://github.com/geelen/mcp-remote#transport-strategies)
- Local [`.utcp_config.json`](../../../../../../../../.utcp_config.json), existing `refero` manual
- Local [phase specification](../../spec.md)
- Lineage [iteration 001](iterations/iteration-001.md), [iteration 002](iterations/iteration-002.md), and [iteration 003](iterations/iteration-003.md)
- Lineage [`deep-research-state.jsonl`](deep-research-state.jsonl), [`findings-registry.json`](findings-registry.json), and [`resource-map.md`](resource-map.md)
