# Refero MCP Developer Surface — Canonical Fan-Out Research Synthesis

> **Fan-out synthesis** of 3 detached deep-research lineages, 10 total iterations: **sol** (gpt-5.6-sol, xhigh, 5 iterations), **glm** (glm-5.2, 2 iterations), **luna** (gpt-5.6-luna, max, 3 iterations). Stop policy: `max-iterations` (forced depth; convergence telemetry-only). All lineages completed on the first attempt (scoped-`CODEX_HOME` launch, zero failed attempts). This document supersedes per-lineage syntheses for downstream authoring; lineage files remain under `lineages/` for provenance.
>
> **Attribution convention:** claims confirmed by 2+ lineages are stated once with merged citations. Single-lineage claims are tagged `[sol only]`, `[glm only]`, `[luna only]`. Disagreements are preserved verbatim as `[CONFLICT: ...]` — never averaged. Claims with no source in any lineage are marked UNVERIFIED.

---

## 1. Executive Summary

The Refero MCP is a **read-only UI/UX design-reference search service** at `https://api.refero.design/mcp` exposing **eight tools across three layers** — styles, screens, flows. "Apps" and "elements" are query/result facets (site metadata, `ui_elements`), not separate tool families. [SOURCE: https://doc.refero.design/mcp/tools] [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/references/mcp-tools.md] (all three lineages)

The repository's **existing `refero` UTCP manual works as-is** — `npx -y mcp-remote https://api.refero.design/mcp`, stdio bridge, empty `env` — and must be preserved byte-for-byte; the packet consumes it and documents prerequisites only. [SOURCE: file:.utcp_config.json:148] (all three lineages)

Live MCP access is **paid and authenticated**: Free has no MCP access at all (access denial, not a reduced tool set), Pro is the first tier with MCP and carries a published **8,000-tool-calls-per-month** quota. No source publishes per-second, burst, concurrency, or `Retry-After` behavior. [SOURCE: https://doc.refero.design/help/plans] [SOURCE: https://doc.refero.design/mcp/getting-started] (sol + luna; see [CONFLICT-2] — glm, working from a narrower source set, recorded gating/limits as wholly undocumented)

The official `referodesign/refero_skill` repository is a **design-methodology skill, not an MCP server implementation** — a peer of `sk-design`, usable without live MCP. The `mcp-refero` packet must NOT duplicate its methodology; it is a thin, read-only, Code Mode-only transport under `mcp-tooling` (simpler peer of `mcp-figma`), with `sk-design` as mandatory judgment partner for any design-affecting use. [SOURCE: https://github.com/referodesign/refero_skill] [SOURCE: file:.opencode/skills/mcp-tooling/mode-registry.json] [SOURCE: file:.opencode/skills/sk-design/SKILL.md] (all three lineages)

The single load-bearing cross-lineage disagreement is the **Code Mode callable name** ([CONFLICT-1]): sol's live-verified local evidence says the doubled prefix `refero.refero_refero_<tool>(...)`; glm derived the single-prefix `refero.refero_<tool>` from the naming convention; luna refused to assert either and requires post-registration discovery. The doubled form has the strongest sourcing, but all lineages agree discovery-first (`list_tools`/`tool_info`) is mandatory regardless.

---

## 2. Background

Phase `001-research` of the `mcp-tooling/009-mcp-refero` packet: gather everything needed to author the `mcp-refero` TRANSPORT packet (phase 002) — read-only, Code Mode only, mandatory `sk-design` judgment pairing — atop the EXISTING `refero` manual in `.utcp_config.json`. Pinned product page: [refero.design/mcp](https://refero.design/mcp). Pinned official repo: [github.com/referodesign/refero_skill](https://github.com/referodesign/refero_skill). Research was explicitly read-only: no paid login, no browser OAuth, no Code Mode launch, no auth-cache mutation, no edits to the manual, skills, or hub routing (all three lineages held this boundary).

## 3. Objectives

The five charter questions, common to all lineages:

1. Current Refero MCP tool inventory and each tool's input/output contract.
2. Authentication and limits through the `mcp-remote` bridge.
3. UI-design-reference search workflows covering apps, screens, flows, and elements.
4. Free-versus-paid access gating.
5. Constraints for a read-only, Code Mode-only packet paired with `sk-design`.

All five were answered at documentation level by every lineage; live-endpoint behaviors remain open (Section: Open Questions).

## 4. Methodology

| Lineage | Executor / model | Iterations | Approach |
|---|---|---|---|
| sol | cli-codex, gpt-5.6-sol (xhigh) | 5 | Official docs → plans/quotas/data shapes → `mcp-remote` transport/OAuth source review → local architecture (`mcp-tooling`, Code Mode, `sk-design`) → contradiction review against the official repo and local conventions. Performed direct **unauthenticated live HTTP probes** (401 observed). |
| glm | glm-5.2 | 2 | Broad survey (tool surface, auth, coverage, repo conventions vs `mcp-figma`) → gating/rate-limit negative-knowledge probe (SPA scrape attempts), auth lifecycle, packet layout. Sources: skill repo + refero.design SPA + local contracts; did **not** reach `doc.refero.design`. |
| luna | cli-codex, gpt-5.6-luna (max) | 3 | Official inventory/workflow/pricing → upstream `mcp-remote` persistence and header flags → deliberate broadening across contract drift, gating, transport boundary, `sk-design` pairing. Live probe failed at DNS in its environment. |

Evidence classes used throughout: **Documented/Confirmed** (current official source or verified local contract), **Inferred** (supported but not exercised end-to-end), **Unknown/UNVERIFIED** (requires authenticated access or unpublished provider policy). Where a lineage claim needed verification during synthesis, it was re-checked against the live repo (e.g., `file:.opencode/skills/sk-design/design-interface/references/mcp_tooling/refero_tools.md` and `file:.utcp_config.json` were re-read and match sol's citations).

## 5. Cross-Lineage Reconciliation Ledger

| # | Topic | Verdict | Lineages | Resolution |
|---|---|---|---|---|
| R1 | Eight read-only tools, three layers | MERGED | sol+glm+luna | Identical inventory in all three; stated once in Findings §A. |
| R2 | Deprecated/legacy surface (`_tool` names, `get_design_guidance`, numeric screen IDs, `limit`/`offset`, `image_size`/`include_similar` on `refero_get_screen`) | MERGED | sol+glm+luna | Encode as fail-closed negative knowledge. |
| R3 | Apps/elements = query facets, not tools | MERGED | sol+luna (glm consistent by omission) | No `search_apps`/`search_elements` exposed. |
| R4 | Existing UTCP manual valid as-is | MERGED | sol+glm+luna | Preserve byte-for-byte; consume, don't modify. |
| R5 | OAuth default + Bearer header alternative | MERGED | sol+glm+luna | OAuth browser flow is the default path of the existing manual; Bearer is an env-backed variant, never in the base manual. |
| R6 | Auth state in `~/.mcp-auth` / `MCP_REMOTE_CONFIG_DIR` | MERGED | sol+luna | Operator-owned; packet must never inspect/clear/repair. |
| R7 | Pro = 8,000 MCP calls/month; Free = no MCP | MERGED with conflict note | sol+luna vs glm | See [CONFLICT-2]. |
| R8 | No fine-grained rate/burst/concurrency/retry contract published | MERGED | sol+glm+luna | Do not invent client-side QPS/backoff. |
| R9 | `refero_skill` = methodology skill, works without live MCP | MERGED | sol+glm+luna | Transport must not vendor its methodology. |
| R10 | Styles → screens → flows research funnel; metadata-first; no averaging of references | MERGED | sol+glm+luna | Workflow contract in Findings §D. |
| R11 | Packet identity: transport under `mcp-tooling`, read-only, Code Mode only, `mutatesWorkspace:false`, `sk-design` pairing | MERGED | sol+glm+luna | Findings §G/§H. |
| R12 | Code Mode callable name | **[CONFLICT-1]** | sol vs glm vs luna | Preserved below; sol strongest-sourced. |
| R13 | `response_format` availability per tool | **[CONFLICT-3]** | sol vs glm vs luna | Preserved below; resolve via `tool_info`. |
| R14 | Live endpoint observability | DIVERGED (environmental) | sol (401 observed) vs luna (DNS failure) vs glm (SPA only) | Not a factual conflict; sol's observation stands as the only live datum. |

**Counts:** 18 merged findings · 3 explicit conflicts ([CONFLICT-1..3]) · 17 single-lineage attestations (tagged inline) · 10 open questions.

---

<!-- ANCHOR:findings -->
## Findings

### A. MCP Tool Surface (merged — all three lineages)

Authoritative baseline; runtime rule: treat the table as the expected contract, then use Code Mode `list_tools`/`search_tools`/`tool_info` as the final live schema before calling. [SOURCE: https://doc.refero.design/mcp/tools] [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/references/mcp-tools.md] [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md:285]

| Layer | Tool | Required args | Optional args / bounds | Returns |
|---|---|---|---|---|
| Styles | `refero_search_styles` | `query: string` | `page` (default 1); `response_format?` (see [CONFLICT-3]) | `{pagination, records[]}`: style UUID, title, source URL, preview URL, platform, description |
| Styles | `refero_get_style` | exactly one of `style_id: string` \| `style_ids: string[]` | `response_format?` | Visual thesis, color/token roles, typography, layout, spacing, surfaces/elevation, components, imagery, do/don't rules |
| Screens | `refero_search_screens` | `query: string`, `platform: "web"\|"ios"` | `page`; `response_format?` | Paginated UUID records with `site`, `page_url`, `refero_url`, thumbnail, `page_types`, `ux_patterns`, `ui_elements`, colors, content |
| Screens | `refero_get_screen` | exactly one of `screen_id: string` \| `screen_ids: string[]` | `response_format?` | Full screen metadata, fonts, tags, description/layout/functions. Never pass `image_size` or `include_similar` here |
| Screens | `refero_get_similar_screens` | `screen_id: string` | `limit` 1–20, default 10; `response_format?` | Comparable screen records |
| Screens | `refero_get_screen_image` | `screen_id: string` | `image_size: "thumbnail"\|"full"` (default thumbnail) | Raw screenshot image content |
| Flows | `refero_search_flows` | `query: string`, `platform: "web"\|"ios"` | `page`; `response_format?` | Paginated summaries with **numeric** flow IDs, site, steps summary, problem, description |
| Flows | `refero_get_flow` | exactly one of `flow_id: number` \| `flow_ids: number[]` | `response_format?` | Ordered steps: screen UUID, goal, action, system response, metadata, `related_queries` |

Hard constraints (merged):
- **ID typing is not interchangeable:** styles and screens use UUID strings; flows use numeric IDs. [SOURCE: https://doc.refero.design/mcp/data-model]
- Search pagination uses `page`, never legacy `limit`/`offset`; `limit` belongs only to `refero_get_similar_screens`. [SOURCE: https://doc.refero.design/mcp/tools]
- No `search_apps`, `get_app`, `search_elements`, or `get_element` exist — search company/pattern/state/element terms and inspect `site` and `ui_elements` in results. [SOURCE: https://doc.refero.design/mcp/tools] [sol + luna]
- JSON search responses follow `{ pagination: { count, page, next_page, total_count, total_pages }, records: [...] }`; the provider says fields can grow — preserve unknown structured fields rather than decoding into a closed schema. [SOURCE: https://doc.refero.design/mcp/data-model] [sol only, corroborated by file:.opencode/skills/sk-design/design-interface/references/mcp_tooling/refero_tools.md:104]
- Full styles are large — roughly 10–15k characters each; keep style batches to 3–4. [SOURCE: file:.opencode/skills/sk-design/design-interface/references/mcp_tooling/refero_tools.md:56] [sol only]
- Content scale: 150,000+ real app screens and 6,000+ user flows. [SOURCE: https://github.com/referodesign/refero_skill] [glm only]
- Styles coverage is web marketing/product pages ONLY (landing, pricing, editorial, SaaS sites) — not in-app dashboards, auth/settings screens, or iOS screens as style systems; screens/flows do support `platform: web|ios`. [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/references/mcp-tools.md] [glm only, corroborated by file:.opencode/skills/sk-design/design-interface/references/mcp_tooling/refero_tools.md:33]

**[CONFLICT-3: `response_format` scope]** — glm: only `refero_get_style` documents `response_format`, and it should be used only when the client's shown schema includes it [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/references/mcp-tools.md]. sol: documented on all **seven text-returning tools**, conditionally exposed by clients, and must never be added to `refero_get_screen_image` [SOURCE: https://doc.refero.design/mcp/tools]. luna: lists `response_format` as optional on **all eight** tools including `refero_get_screen_image` [SOURCE: https://doc.refero.design/mcp/tools]. The local live-verified catalog shows it on all tools except `refero_get_screen_image` [SOURCE: file:.opencode/skills/sk-design/design-interface/references/mcp_tooling/refero_tools.md:62-96], which corroborates sol. Resolution: sol's seven-text-tools reading is strongest-sourced; treat per-tool availability as a `tool_info` runtime check, and never pass it to the image tool.

### B. Transport / Auth Handshake (merged: sol+glm+luna unless tagged)

The existing manual — verified against the repo during synthesis:

```json
{ "name": "refero", "call_template_type": "mcp",
  "config": { "mcpServers": { "refero": {
    "transport": "stdio", "command": "npx",
    "args": ["-y", "mcp-remote", "https://api.refero.design/mcp"], "env": {}
  } } } }
```
[SOURCE: file:.utcp_config.json:148]

- `mcp-remote` presents a local stdio MCP to Code Mode and proxies to Refero's remote HTTP endpoint; the default transport strategy is HTTP-first with SSE fallback only after HTTP 404 — do not force SSE. [SOURCE: https://github.com/geelen/mcp-remote#transport-strategies] [sol + luna]
- With no custom header, first use triggers **browser OAuth** with a localhost callback (port 3334 by default, another free port if occupied; 30-second default callback timeout [sol only, SOURCE: https://github.com/geelen/mcp-remote]). Auth data — client info, tokens, PKCE state — persists under `MCP_REMOTE_CONFIG_DIR` or `~/.mcp-auth`, namespaced by package version and a server-derived hash. [SOURCE: https://github.com/geelen/mcp-remote/blob/main/src/lib/mcp-auth-config.ts] [sol + luna]
- An empty manual `env` does NOT mean anonymous access — Refero documents OAuth or `Authorization: Bearer <token>`. [SOURCE: https://doc.refero.design/mcp/getting-started] [luna framing; sol+glm consistent]
- Static Bearer alternative (documented upstream, env-backed, never in the base manual) — **kept exactly as luna, the strongest-sourced lineage for this snippet, wrote it**:
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
  For clients that mishandle spaces in an argument, upstream documents `Authorization:${AUTH_HEADER}` with `AUTH_HEADER` containing `Bearer <token>`. [SOURCE: https://github.com/geelen/mcp-remote#custom-headers] [luna only, with glm's path-B framing]
- If a token is wired via env under Code Mode, env vars are prefixed with the manual name (`refero_<NAME>`). [SOURCE: file:.opencode/skills/mcp-tooling/mcp-figma/references/mcp_wiring.md §3] [glm only]
- **Live unauthenticated observation** [sol only]: direct GET and JSON-RPC `initialize` both returned HTTP 401 advertising Bearer auth, scope `files:read`, and a protected-resource metadata URL; that URL (`/.well-known/oauth-protected-resource`) returned **404** during research, but current `mcp-remote` source treats a 404 as a discovery miss and tries alternate well-known locations; `/.well-known/oauth-authorization-server` IS available and advertises authorization-code/client-credentials grants, dynamic registration, token/revocation endpoints, and `read`/`files:read` scopes. End-to-end OAuth recovery is **Inferred** until an operator completes it. [SOURCE: https://api.refero.design/mcp] [SOURCE: https://api.refero.design/.well-known/oauth-authorization-server] [SOURCE: https://github.com/geelen/mcp-remote/blob/main/src/lib/protected-resource-metadata.ts] (luna's environment could not resolve the API hostname at all — environmental divergence, not a contradiction)
- The manual intentionally uses **unpinned** `mcp-remote`; researched npm version 0.1.38; the project self-describes as experimental. Document, don't pin, unless separately requested. [SOURCE: https://www.npmjs.com/package/mcp-remote] [sol only]
- Operational: first invocation requires a browser-capable session; headless/CI likely needs the Bearer path. [Inferred] [glm only]. Ephemeral runtimes without a persistent home may require re-authentication; troubleshooting flags (`--debug`, `--transport`, `--auth-timeout`, `--resource`, `MCP_REMOTE_CONFIG_DIR`) are environment-specific and do not belong in the minimal base manual. [SOURCE: https://github.com/geelen/mcp-remote#troubleshooting] [luna only]
- Local runtime constraint: Code Mode must run on **Node 24** — isolated-vm has no Node 25 build, so `call_tool_chain` SIGSEGVs under Node 25. Treat as current local operational evidence, not a server property. [SOURCE: file:.opencode/skills/sk-design/design-interface/references/mcp_tooling/refero_tools.md:19] [sol only]

### C. Rate Limits / Plan Gating

**[CONFLICT-2: is gating/quota documented at all?]** — sol and luna, reading `doc.refero.design`, confirm concrete entitlements (table below). glm, whose source set was the skill repo plus the `refero.design` SPA (which renders no crawlable body — root, `/mcp`, and `/pricing` all return only the page title), recorded rate limits and tier boundaries as **NOT documented in any authoritative source** and closed them as negative knowledge [SOURCE: glm lineage iteration-002 F7, WebFetch on refero.design routes]. Resolution: the sol/luna entitlement facts stand (2-of-3, primary docs); glm's finding is retained as accurate **for its source set** and as proof the marketing site alone cannot answer gating questions.

Merged entitlement table [SOURCE: https://doc.refero.design/help/plans] [SOURCE: https://doc.refero.design/mcp/getting-started] (sol + luna):

| Tier | MCP implication |
|---|---|
| Free | **No MCP access** (also no Refero Skill or Figma plugin [luna only]). Do not model a reduced/free tool list — denial, not degradation. |
| Pro | First individual tier with MCP/Skill; **8,000 MCP tool calls per month**. |
| Team | Inherits Pro capabilities; adds admin/shared bookmarks/SSO [luna only]. Do not infer a different MCP tool contract without account evidence. |
| Business | Higher/custom volume. The published example — $0.001/request, $2,000 minimum (2,000,000 initial requests) — is commercial illustration, not a universal throttling contract. [SOURCE: https://doc.refero.design/mcp/business] (sol + luna) |
| Lifetime | Plan copy says "unlimited access"; must NOT be read as unlimited MCP calls given the documented monthly quota. [SOURCE: https://doc.refero.design/help/plans] [luna only] |

Unknown across all lineages (merged): per-second, per-minute, burst, concurrency, page-size, `Retry-After`, and authenticated 429 behavior. The packet must not invent a client-side QPS number or backoff guarantee; on 429, preserve the provider message and header-derived guidance only. The public availability of the GitHub skill's craft methodology does not make the live MCP free — plan entitlement and public methodology are different layers. [SOURCE: https://github.com/referodesign/refero_skill] (sol; glm consistent: "craft knowledge loads immediately, no account required" vs live tools require auth)

### D. UI-Design-Reference Search Workflows (merged — all three lineages)

The official research funnel [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/SKILL.md] [SOURCE: https://doc.refero.design/mcp/examples]:

1. **Styles first** for any visual task: search 3–5 semantic angles (product/domain/audience + concrete aesthetic direction), inspect metadata, then `refero_get_style` for shortlisted UUIDs. Select one primary direction; borrow bounded details; never average strong references into a generic middle.
2. **Screens** for concrete UI patterns: literal semantic query (screen type, component, state, company) + required `platform`; inspect metadata/UUIDs; get detail for the most relevant; `refero_get_similar_screens` only after one screen is materially relevant; request an image (`thumbnail` before `full`) only when text cannot answer.
3. **Flows** for multi-step journeys: search task + platform; get one relevant numeric flow; use step goals/actions/system responses/completion states and `related_queries` to widen. If flows are sparse, broaden the query or reconstruct from related screens — and report reconstruction as inference.
4. **Apps/products**: put a company/industry/domain term in screen/flow queries and inspect returned `site` metadata. **Elements**: literal queries (`table`, `modal`, `toggle`, `empty state`, `recovery codes`) compared through `ui_elements`, `ux_patterns`, `page_types`, content.
5. **Metadata-first context discipline**: search/compare titles-descriptions-tags → fetch details only for shortlisted IDs → similar screens → thumbnail → full, in that order. Batch detail lookups modestly; on batch failure retry with fewer IDs.

Local reconciliation (sol, corroborated by file:.opencode/skills/sk-design/design-interface/references/design_grounding/design_references_mcp.md:76): upstream permits multi-reference comparison, but the local `sk-design` contract is stricter for design-affecting use — resolve ONE matching live reference, name the category default, never show a chooser, never copy. Reconcile by allowing breadth during transport research while requiring `sk-design` to collapse evidence to one declared critique reference before design judgment. Multiple results may still be returned for explicit competitive research. Pure factual lookups ("list Refero screens matching X") may return evidence without a taste verdict; if that evidence will influence a design, it must route back through `sk-design`.

### E. `refero_skill` Repo Structure (merged: sol+glm+luna unless tagged)

`referodesign/refero_skill` is a **standalone design-methodology skill** — methodology, not an MCP server or wrapper implementation. It works without live MCP ("useful on its own as a design methodology and craft reference"); live styles/screens/flows are an enhancement. [SOURCE: https://github.com/referodesign/refero_skill]

- Structure: root `SKILL.md` (version 1.1 [sol only]) + ten focused `references/` (`typography`, `color`, `motion`, `icons`, `craft-details`, `anti-ai-slop`, `copywriting`, `visual-workflow`, `mcp-tools`, `example-workflow`) + `assets/` banner. Contributing rule: keep `SKILL.md` focused, push conditional detail into `references/`. [glm structure list; sol count]
- License MIT; install: `npx skills add https://github.com/referodesign/refero_skill --skill refero-design`. [glm only]
- Default branch is **`master`** (not `main`); researched head `f78b4eccf112d7a179b92afeafdd7e8684560ac2` — use `master` or an immutable commit in downstream provenance. [SOURCE: https://api.github.com/repos/referodesign/refero_skill] [sol only]
- `references/mcp-tools.md` is the authoritative tool inventory and the source for the "common mistakes" guardrails in §A/R2. [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/references/mcp-tools.md]
- Adopt from it: research-before-design; styles→screens→flows role separation; concrete semantic queries; metadata-first; reference specificity with source URLs; no wholesale copying; no averaging; preserve token/component/media roles. Reject for the transport: its claim to be the primary design authority; direct implementation/CSS editing/image generation/visual-QA ownership; the default three-direction chooser; the direct bearer-header install example; any ready/accessible/responsive/taste verdict; any caching/copying of third-party reference content into the repo. [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/SKILL.md] [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/references/visual-workflow.md] (sol's adopt/adapt/reject; glm/luna consistent: "must NOT duplicate the methodology — that collides with sk-design")

### F. UTCP Wiring Status — Does the Existing Manual Work As-Is?

**Verdict (merged, all three lineages): YES, structurally — preserve `.utcp_config.json` byte-for-byte.** The manual is the correct shape for the job: Code Mode consumes stdio, Refero speaks remote HTTP, and `mcp-remote` bridges them with the HTTP-first strategy matching Refero's documented setup. [SOURCE: file:.utcp_config.json:148] [SOURCE: https://github.com/geelen/mcp-remote#transport-strategies] No lineage found any needed change; no lineage proposed replacing it with a direct Bearer setup (explicitly eliminated). Caveats that stop short of "live-verified end-to-end": completing OAuth, token refresh, and dynamic registration despite the advertised protected-resource-metadata 404 remains **Inferred** [sol]; luna could not resolve the API hostname; nobody launched Code Mode or performed authorization (out of research scope). The local `refero_tools.md` records prior live-verified invocation through this exact manual [SOURCE: file:.opencode/skills/sk-design/design-interface/references/mcp_tooling/refero_tools.md:98], which is the strongest available evidence that the wiring functions with a paid, OAuth-completed account.

**[CONFLICT-1: Code Mode callable name]** — the one disagreement a packet author must not paper over:

| Lineage | Claim | Sourcing |
|---|---|---|
| sol | Doubled prefix. Discovery name `refero.refero.refero_search_styles`; callable `refero.refero_refero_search_styles(...)` inside `call_tool_chain` — because the manual-prefix rule (`{manual}.{manual}_{tool}`) applies to tools whose own names already begin with `refero_`. | [SOURCE: file:.opencode/skills/mcp-code-mode/README.md:112] [SOURCE: file:.opencode/skills/sk-design/design-interface/references/mcp_tooling/refero_tools.md:18] — the local file marks this **verified live** and its §5 code example uses `refero.refero_refero_search_styles({...})`. Re-confirmed against the file during this synthesis. |
| glm | Single prefix: `refero.refero_<tool>`, e.g. `refero.refero_search_styles`, `refero.refero_get_flow`. | Derived from the `{manual}.{manual}_{tool}` convention [SOURCE: file:.opencode/skills/mcp-tooling/mcp-figma/references/mcp_wiring.md §3-5] — but applying that convention to a tool literally named `refero_search_styles` actually yields sol's doubled form; glm appears to have collapsed the tool's own `refero_` prefix into the manual prefix. |
| luna | Refuses to assert: "repository naming conventions may yield `refero.refero_search_screens`, but that name must be confirmed after registration rather than hard-coded." | Post-registration discovery required. |

Resolution posture: author against sol's doubled form (live-verified local evidence) while honoring luna's rule — the packet must confirm actual callable names via `list_tools`/`tool_info` at install/first-use and fail closed on drift. Call synchronously inside the Code Mode body (no top-level `await`) per the verified pattern. [SOURCE: file:.opencode/skills/sk-design/design-interface/references/mcp_tooling/refero_tools.md:98] [sol only]

### G. Transport-Packet Authoring Inputs (phase 002)

Registry identity (sol's proposal, consistent with glm/luna constraints) [SOURCE: file:.opencode/skills/mcp-tooling/mode-registry.json]:

```json
{
  "workflowMode": "mcp-refero",
  "packetKind": "transport",
  "backendKind": "refero-code-mode-transport",
  "toolSurface": {
    "allowed": ["Read", "Glob", "Grep",
      "mcp__code_mode__search_tools", "mcp__code_mode__list_tools",
      "mcp__code_mode__tool_info", "mcp__code_mode__call_tool_chain"],
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
[sol only — the concrete JSON; the read-only/Code-Mode-only/`mutatesWorkspace:false` constraints are merged across all three]

Also (sol only unless noted):
- Add `mcp-refero` to `extensions.transport-axis.transports` and map it to `sk-design` in `crossHubPairing`; keep `mcp-code-mode` as external infrastructure, not a mode. [SOURCE: file:.opencode/skills/mcp-tooling/mode-registry.json]
- Router: append after existing modes in `tieBreak`; narrow signals only (`refero`, `refero mcp`, `search Refero screens`, `find UI references`) — never generic `design`/`UI`/`screen`/`flow`, which collide with `sk-design`, Figma, and browser workflows; add holdout tests. [SOURCE: file:.opencode/skills/mcp-tooling/hub-router.json]
- Allowlist exactly the eight underlying tools; fail closed if the live catalog is missing, renamed, or expanded — new provider tools require a reviewed packet update.
- Validate documented unions/enums/bounds (exactly-one-of ID unions; UUID vs numeric; platform enum; page ≥ 1; similar limit 1–20; image enum) before execution while passing unknown response fields through.
- Error envelope: `{ success, data, errors: [{ class, message, retryable, operatorAction }], timestamp }`, with recognized classes for discovery/schema drift, entitlement/auth, callback timeout, stale auth state (report, never auto-delete), transport, invalid args, quota/429, oversized output, and runtime closure; bounded timeouts (30s simple / 60s multi-call); never turn a partial multi-call failure into a successful design result. [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md:365]
- File layout (glm's proposal, compatible with sol's checklist): `SKILL.md` (focused contract, sk-design pairing), `references/` for tool surface + wiring + workflows + troubleshooting, `assets/` for a paste-ready manual snapshot and env template; mcp-refero is a **simpler** peer of mcp-figma — MCP-only, read-only-only, no CLI-primary and no mutating/destructive gating taxonomy. [SOURCE: file:.opencode/skills/mcp-tooling/mcp-figma/SKILL.md] [glm only]
- Sol's fuller authoring checklist adds: `README.md`, `INSTALL_GUIDE.md` (verify-only — explicitly no config rewrite), `manual_testing_playbook/` (routing, discovery, read-only workflows, negative fixtures with SKIP allowed for paid/OAuth scenarios), `changelog/v1.0.0.0.md`, plus synchronized updates to `mcp-tooling` hub SKILL/README/description/graph-metadata and the manual-testing playbook. [SOURCE: file:.opencode/skills/mcp-tooling/mcp-figma/manual_testing_playbook/manual_testing_playbook.md] [sol only]
- **De-duplication** [sol only]: `sk-design/design-interface/references/mcp_tooling/refero_tools.md` already carries the tool catalog, doubled prefix, Node 24 note, and troubleshooting. Make `mcp-refero` the canonical transport/tool-surface owner; slim the old catalog to a pointer; keep `design_references_mcp.md` as the judgment-side contract; update `design-interface` integration prose to "mcp-refero transport over mcp-code-mode". [SOURCE: file:.opencode/skills/sk-design/design-interface/references/mcp_tooling/refero_tools.md] [SOURCE: file:.opencode/skills/sk-design/design-interface/references/design_grounding/design_references_mcp.md]
- Gating hygiene [glm only]: record tier context per finding (which plan a result was observed under); never claim a capability is free/paid without a live probe.
- Never: change `.utcp_config.json`, add a second Refero manual, vendor the remote server, accept/print/cache/clear credentials, or grant workspace mutation. (merged)

### H. `sk-design` Pairing Implications (merged: sol detailed contract; glm/luna consistent)

Hard ordering for design-affecting requests [SOURCE: file:.opencode/skills/sk-design/SKILL.md] [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:309]:

1. `sk-design` hub manager intake (goal, surface, inputs, constraints, proof expectations).
2. Select the smallest judgment mode; UI build/redesign loads the interface+foundations bundle.
3. Set Brand/Product register before palette/layout/motion/copy decisions.
4. Show selected route, evidence plan, and transport role.
5. `mcp-refero` retrieves only requested evidence.
6. Evidence returns to the design mode; transport output can never satisfy taste, accessibility, responsiveness, or ready gates by itself.

`interface` is the primary Refero consumer; `audit` may evaluate against evidence; `foundations` can interpret explicit style-system evidence; `motion` may use flow sequences; `md-generator` is not a default partner (it owns measured live-site extraction). [sol only]. Reference locks and decision ledgers are judgment artifacts owned by `sk-design`; the transport supplies IDs, metadata, images, and source-backed facts — a transport response is untrusted reference evidence and must not become design approval. (merged: sol + luna framing)

<!-- /ANCHOR:findings -->

---

<!-- ANCHOR:eliminated-alternatives -->
## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Lineage(s) |
|---|---|---|---|
| Use the stale four-tool / `_tool` / `get_design_guidance` / numeric-screen-ID / `limit`-`offset` surface | Current docs define eight tools and list these as mistakes; older extractions are retrieval drift | [SOURCE: https://doc.refero.design/mcp/tools] [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/references/mcp-tools.md] | sol, glm, luna |
| Expose `search_apps` / `get_app` / `search_elements` / `get_element` | No such tools exist; apps/elements are query + metadata facets | [SOURCE: https://doc.refero.design/mcp/tools] | sol, luna |
| Model Free as a smaller MCP tool set | Free has no MCP access — denial, not degradation | [SOURCE: https://doc.refero.design/help/plans] | sol, luna |
| Treat 8,000/month as a burst/short-window rate | It is a monthly Pro quota; no short-window limit is published | [SOURCE: https://doc.refero.design/mcp/getting-started] | sol, luna |
| Invent per-minute/per-tool/concurrency/retry limits or client backoff | No authoritative values found in any lineage | three-lineage source review | sol, glm, luna |
| Promise unlimited MCP usage from "unlimited access" plan copy | The MCP page states a monthly quota; plan marketing is not an MCP limit contract | [SOURCE: https://doc.refero.design/help/plans] | luna |
| Treat rate limits / tier gating as answerable from the marketing site | `refero.design` is a client-rendered SPA; root, `/mcp`, `/pricing` return only the title | glm iteration-001/002 WebFetch probes | glm |
| Rigidly strip unknown response fields into a closed local schema | Official data model can grow | [SOURCE: https://doc.refero.design/mcp/data-model] | sol |
| Force SSE transport | Refero documents HTTP; bridge defaults HTTP-first | [SOURCE: https://github.com/geelen/mcp-remote#transport-strategies] | sol |
| Treat the empty manual `env` as anonymous access | Refero documents OAuth/Bearer; access is plan/account dependent | [SOURCE: https://doc.refero.design/mcp/getting-started] | luna, glm |
| Put bearer tokens in calls, skill files, or the base manual | Credentials belong to operator env/OAuth state; leaks prevent safe reuse | [SOURCE: https://github.com/geelen/mcp-remote#custom-headers] | sol, luna |
| Add every `mcp-remote` flag to the minimal manual | Transport/debug/auth-timeout flags are environment-specific troubleshooting | [SOURCE: https://github.com/geelen/mcp-remote] | luna |
| Automatically clear `~/.mcp-auth` | Destructive operator-owned credential state | [SOURCE: https://github.com/geelen/mcp-remote#troubleshooting] | sol |
| Replace the existing manual with a direct bearer setup | Explicit scope requires the existing `mcp-remote` manual | [SOURCE: file:.utcp_config.json:148] | sol |
| Make Refero a standalone hub or an `sk-design` mode | It is a transport under `mcp-tooling`; judgment stays in `sk-design` | [SOURCE: file:.opencode/skills/mcp-tooling/SKILL.md] | sol |
| Vendor the official Refero Skill methodology into the transport | It is a peer of `sk-design`; duplicating it collides with `sk-design` authority; its default-authority/chooser/implementation scope conflicts with local boundaries | [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/SKILL.md] | sol, glm |
| Grant Bash because the manual launches `npx` | Code Mode owns stdio process launch; the packet has no shell role | [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md:269] | sol |
| Add Write/Edit/Task or a local Refero mutation/scraper/CLI-primary path | The transport is read-only and Code Mode only | phase spec constraints | luna, sol, glm |
| Treat search rank/similarity as taste authority | Transport evidence cannot replace design acceptance | [SOURCE: file:.opencode/skills/sk-design/SKILL.md:263] | sol, luna |
| Hardcode one authenticated schema snapshot | `tool_info`/`tools/list` is runtime authority; fields evolve | [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md:285] | sol, luna |
| Route on generic "design"/"UI"/"screen" signals | Collides with Figma, browser, and `sk-design` routing | [SOURCE: file:.opencode/skills/mcp-tooling/hub-router.json] | sol |
| Run credentialed discovery / live OAuth during research | Would launch OAuth and write auth state outside the allowed artifact root | [SOURCE: https://github.com/geelen/mcp-remote] | sol, luna |
| Claim live `tools/list` or OAuth behavior was verified | API unreachable in luna's environment; installation intentionally not run anywhere | lineage limitations | luna, sol |

<!-- /ANCHOR:eliminated-alternatives -->

<!-- ANCHOR:divergence-map -->
## Divergence Map

| Direction | Status | What resolved (or preserved) it | Remaining frontier |
|---|---|---|---|
| **[CONFLICT-1] Code Mode callable naming** (sol doubled `refero.refero_refero_*` vs glm single `refero.refero_*` vs luna abstain) | PRESERVED — strongest source favors sol | Local live-verified catalog documents the doubled prefix with a working code example; glm's form is a convention misapplication; luna's discover-first rule adopted as mandatory regardless | Post-registration `list_tools`/`tool_info` confirmation |
| **[CONFLICT-2] Gating/quota documented?** (glm "undocumented anywhere" vs sol/luna "Pro 8,000/mo, Free excluded") | RESOLVED with note | Divergence traced to source sets: glm never reached `doc.refero.design`; sol/luna cite it directly. glm's negative knowledge stands for the SPA/skill-repo layer only | Team-tier specifics; live quota/429 behavior |
| **[CONFLICT-3] `response_format` scope** (glm get_style-only vs sol seven text tools vs luna all eight) | PRESERVED — sol favored | Local catalog shows it on all tools except the image tool, matching sol; never pass it to `refero_get_screen_image` | Per-tool `tool_info` at runtime |
| Current vs stale MCP surface | Saturated (all lineages) | Current Tools/Data Model/Examples pages consistently support eight UUID/page-based tools; older four-tool extractions labeled drift | Authenticated live `tools/list` drift only |
| Live endpoint observability | ENVIRONMENTAL divergence | sol observed a live 401 with auth metadata; luna hit DNS failure; glm hit an unscrapable SPA. Not contradictory — different network vantage points | Operator OAuth completion |
| Official skill as transport implementation | Rejected/pivoted (sol, glm) | Repository inspection showed methodology, not server/wrapper code | None for packet architecture |
| Upstream skill authority vs local design authority | Resolved by audited override (sol; glm/luna consistent) | Local `sk-design` contract overrides upstream default-authority/chooser behavior; retrieval mechanics retained | Keep cross-skill docs non-duplicative |
| "Unlimited access" plan copy vs 8,000/mo quota | Resolved conservatively (luna) | Quota kept as the operational MCP statement; "unlimited" treated as plan language | Account-level confirmation |
| Packet placement | Saturated (all lineages) | Existing Figma transport-axis precedent and registry contracts | Downstream implementation/validation |

No lineage produced a deep-council artifact or divergent-pivot file; pivots were evidence-driven (stale docs → current docs, assumed `main` → actual `master` [sol], upstream authority → local transport/judgment split, generic packet design → de-duplication against the existing local Refero catalog [sol]). The remaining frontier is operational testing, not unresolved architectural research.

<!-- /ANCHOR:divergence-map -->

<!-- ANCHOR:open-questions -->
## Open Questions

Union of unanswered questions across lineages. None blocks packet authorship; all are runtime/provider unknowns that authoring cannot confirm.

| # | Question | Lineage(s) | Required evidence |
|---|---|---|---|
| 1 | Does authenticated `tools/list` exactly match the eight documented tools — and does Code Mode expose the expected doubled `refero.refero_refero_<tool>` names ([CONFLICT-1])? | sol, luna | Post-registration discovery + `tool_info` capture |
| 2 | Which tools actually expose `response_format` through this Code Mode client ([CONFLICT-3])? | sol, glm, luna | Live `tool_info` per tool |
| 3 | What search page size applies, and can it vary by layer or plan? | sol | Authenticated search capture |
| 4 | What per-second, burst, concurrency, 429, and `Retry-After` behavior applies? | sol, glm, luna | Account-tier documentation or controlled quota test |
| 5 | Does the existing bridge complete OAuth authorization, refresh, and dynamic registration despite the advertised protected-resource metadata 404? What survives a runtime restart / ephemeral home? | sol, luna | Operator browser OAuth on persistent and ephemeral homes |
| 6 | How does an operator obtain a Refero Bearer token (path-B grant flow), and does `--header` argument escaping behave as documented in the target host? | glm, luna | Refero account/dashboard access; safe token fixture |
| 7 | Is the local "flow batch max 10" observation still true? Not a published contract. | sol | `tool_info` or authenticated batch test |
| 8 | Does the Node 24-only Code Mode constraint persist after future Code Mode / isolated-vm releases? | sol | Re-test on runtime upgrades |
| 9 | Does the current `refero_skill` repository revision remain aligned with the detailed tools page (four-tool/stale-parameter drift)? | luna | Pin/record repo revision (`master` @ `f78b4ecc…`) and compare on packet freeze |
| 10 | Exact Team-tier MCP behavior (same contract as Pro?) and whether tier context changes any tool's results | glm, luna | Account evidence per tier; record tier context per finding |

<!-- /ANCHOR:open-questions -->

---

<!-- ANCHOR:convergence-report -->
## Appendix: Convergence Report

- **Stop reason:** `maxIterationsReached` — forced depth; the configured convergence threshold (**0.05**) was telemetry-only in every lineage.
- **Total iterations:** 10 (sol 5, glm 2, luna 3). All lineages first-attempt, zero failed attempts (scoped-`CODEX_HOME` launch).

| Lineage | Model / effort | Iterations | Wall time | New-information ratios | Final convergence telemetry | Failed attempts |
|---|---|---|---|---|---|---|
| sol | gpt-5.6-sol, xhigh | 5 | 23.9 min | 1.00 → 0.78 → 0.66 → 0.58 → 0.44 (mean 0.692) | 0.44 | 0 |
| glm | glm-5.2 | 2 | 20.0 min | (per attribution) final 0.7 | 0.7 | 0 |
| luna | gpt-5.6-luna, max | 3 | 23.0 min | 0.91 → 0.68 → 0.83 | n/a (not reported to reducer) | 0 |

- **Question resolution:** sol 5/5 answered (7 operational unknowns retained); glm 4/6 resolved with Q3/Q4 closed as confirmed negative knowledge for its source set; luna 0/5 machine-resolved (charter questions imported as legacy without structured resolution records) but all five covered in narrative.
- **Registry note:** the merged `deep-research-findings-registry.json` consolidates **glm + sol** only (`mergedFrom: ["glm","sol"]`); luna emitted no merge-compatible registry, so its `research.md` and iteration narratives were weighed directly in this synthesis.
- **Divergence handling:** three explicit conflicts preserved ([CONFLICT-1] naming, [CONFLICT-2] gating documentation, [CONFLICT-3] `response_format` scope); one environmental divergence (endpoint observability). No council artifacts or divergent-pivot files in any lineage.
- **Confidence:** high for published tool/plan facts and local architecture contracts; medium for OAuth-recovery inference; unknown for authenticated live drift, throttling, and refresh behavior.

### References

- `research/fanout-attribution.md` — lineage table (labels, iterations, convergence, salvage, verdicts).
- `research/deep-research-findings-registry.json` — merged reducer registry (glm + sol; 10 reconstructed key findings).
- `research/lineages/sol/research.md`, `research/lineages/sol/resource-map.md`, `research/lineages/sol/findings-registry.json`
- `research/lineages/glm/research.md`, `research/lineages/glm/convergence-report.md`, `research/lineages/glm/findings-registry.json`, `research/lineages/glm/iterations/iteration-00{1,2}.md`
- `research/lineages/luna/research.md`, `research/lineages/luna/resource-map.md`, `research/lineages/luna/iterations/iteration-00{1,2,3}.md`

Primary external sources (merged from all lineages):
[SOURCE: https://doc.refero.design/mcp/getting-started] · [SOURCE: https://doc.refero.design/mcp/tools] · [SOURCE: https://doc.refero.design/mcp/data-model] · [SOURCE: https://doc.refero.design/mcp/examples] · [SOURCE: https://doc.refero.design/mcp/business] · [SOURCE: https://doc.refero.design/help/plans] · [SOURCE: https://api.refero.design/mcp] · [SOURCE: https://api.refero.design/.well-known/oauth-authorization-server] · [SOURCE: https://refero.design/mcp] · [SOURCE: https://github.com/referodesign/refero_skill] (master @ `f78b4eccf112d7a179b92afeafdd7e8684560ac2`) · [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/SKILL.md] · [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/references/mcp-tools.md] · [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/references/visual-workflow.md] · [SOURCE: https://github.com/geelen/mcp-remote] · [SOURCE: https://github.com/geelen/mcp-remote/blob/main/src/lib/mcp-auth-config.ts] · [SOURCE: https://github.com/geelen/mcp-remote/blob/main/src/lib/protected-resource-metadata.ts] · [SOURCE: https://www.npmjs.com/package/mcp-remote]

Primary local sources:
[SOURCE: file:.utcp_config.json:148] · [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md] · [SOURCE: file:.opencode/skills/mcp-code-mode/README.md] · [SOURCE: file:.opencode/skills/mcp-tooling/SKILL.md] · [SOURCE: file:.opencode/skills/mcp-tooling/mode-registry.json] · [SOURCE: file:.opencode/skills/mcp-tooling/hub-router.json] · [SOURCE: file:.opencode/skills/mcp-tooling/graph-metadata.json] · [SOURCE: file:.opencode/skills/mcp-tooling/mcp-figma/SKILL.md] · [SOURCE: file:.opencode/skills/mcp-tooling/mcp-figma/manual_testing_playbook/manual_testing_playbook.md] · [SOURCE: file:.opencode/skills/sk-design/SKILL.md] · [SOURCE: file:.opencode/skills/sk-design/shared/context_loading_contract.md] · [SOURCE: file:.opencode/skills/sk-design/design-interface/references/mcp_tooling/refero_tools.md] · [SOURCE: file:.opencode/skills/sk-design/design-interface/references/design_grounding/design_references_mcp.md]

<!-- /ANCHOR:convergence-report -->
