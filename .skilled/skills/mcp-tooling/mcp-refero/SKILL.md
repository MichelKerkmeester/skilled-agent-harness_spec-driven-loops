---
name: mcp-refero
description: "Refero MCP transport: read-only UI reference search via Code Mode, paired with sk-design-md-generator for a Style Reference."
compatibility: Requires a Refero Pro plan (Free has no MCP access), the npx mcp-remote bridge, and Node.js >=18; this project's Code Mode currently runs on Node 24.
allowed-tools: [Read, Bash, Grep, Glob, mcp__code_mode__call_tool_chain]
version: 1.1.7.0
user-invocable: true
---

<!-- Keywords: refero, refero-mcp, design-reference, ui-reference-search, refero-search-styles, refero-screens, refero-flows, mcp-remote, code-mode, sk-design-md-generator, design-reference-transport -->

# Refero (mcp-refero)

Search **Refero's library of real shipped UI**. The official repo reports 150,000+ app screens and 6,000+ user flows.
An agent can use the **Refero MCP via Code Mode** to find styles for visual direction, screens for concrete UI patterns and flows for multi-step journeys.
This packet is a read-only TRANSPORT (`packetKind: transport`, `mutatesWorkspace: false`). Every read and "write" happens against the external Refero service, never this repo. The packet is **never the taste authority**.
Pair any design-affecting use with `sk-design-md-generator` for a measured Style Reference (extracted design tokens). Deep operational detail lives in [`references/tool-surface.md`](references/tool-surface.md) and [`references/mcp-wiring.md`](references/mcp-wiring.md).

> **Naming trap (read first).** Refero tools inside `call_tool_chain` use a **DOUBLED prefix**. Their callable form is `refero.refero_refero_<tool>(...)`, for example `refero.refero_refero_search_styles`.
> Code Mode's `{manual}.{manual}_{tool}` rule applies because these tools' names already begin with `refero_`.
> **CONFIRMED by live discovery 2026-07-16** (`references/discovery-fixture-2026-07-16.json`). Pre-auth `list_tools` returned all eight registry names in the dotted doubled form `refero.refero.refero_<tool>`. Discovery needed no OAuth.
> The fixture's `Access as:` line shows the TypeScript callable `refero.refero_refero_search_styles(args)`.
> Per-session `tool_info` re-confirmation stays mandatory. Confirm, then call. Fail closed on drift.
>
> **Access trap.** Live MCP access is paid and authenticated. The Free plan has **no MCP access at all** (denial, not a reduced tool set). Pro is the first tier with MCP and carries a published quota of **8,000 tool calls per month**. Unauthenticated calls return HTTP 401.

---

## 1. WHEN TO USE

### Activation Triggers

**Use when** the user wants to:
- Search Refero for design references: visual styles, real app screens, or user flows.
- Find real-app screen examples for a UI pattern, state, or component ("show me real onboarding screens", "empty-state examples from shipped apps").
- Pull the full detail of a shortlisted style, screen, or flow (metadata, tokens, step goals, screenshots) as evidence for a design decision.
- Research a company's or domain's shipped UI through screen or flow queries and `site` metadata.
- Wire, verify, or troubleshoot the `refero` Code Mode manual, its OAuth or Bearer authentication, or its plan gating.

**Keyword Triggers**: "refero", "refero mcp", "ui reference search", "real app screens", "refero styles", "refero flows", "search refero".

### Use Cases

**Styles research (read-only).** Search 3-5 semantic angles for visual direction, inspect metadata, then fetch full style references for shortlisted UUIDs. Styles cover web marketing and product pages only.

**Screens research (read-only).** Literal semantic queries (screen type, component, state, company) plus a required platform (`web` or `ios`); fetch detail for the most relevant UUIDs; similar screens and images only when text cannot answer.

**Flows research (read-only).** Search task journeys, fetch one relevant numeric flow, and use its ordered step goals, actions, and system responses.

**Wiring and auth verification.** Confirm the existing `refero` manual is registered, discovery resolves the doubled-prefix names, and authentication state is what the operator expects. Never repair auth state yourself.

### When NOT to Use

**Skip this skill when:**
- The work is the design judgment itself (palette, type, layout, taste verdicts, accessibility or readiness calls). This packet is only an evidence transport and issues no such verdict.
- The task is app or screen research through Mobbin. That is `mcp-mobbin` (a future sibling transport, not this packet).
- The task is browser automation, live-page inspection, or visual preview of a built page. That is `mcp-chrome-devtools`.
- The work is generic app coding with no design-reference input: use `sk-code`.
- The user asks to change this repo's files, the `.utcp_config.json` manual, or auth state. This transport forbids Write/Edit/Task and never mutates the workspace.

---

## 2. SMART ROUTING

`mcp-tooling` routes a Refero design-reference request here when the request names Refero, or asks for real shipped app screens, user journeys, or a UI reference search.
The hub's `mcp-refero` mode signal selects this packet, and generic design, UI or screen wording does not.

A scored route loads the documents its intent maps to. `references/tool-surface.md` is the default resource, offered as a fallback suggestion and never loaded on a scored route.

Read [`ROUTER.md`](./ROUTER.md) before selecting skill-local resources; open only the matched files.

---

## 3. HOW IT WORKS

### First Step (Always): confirm wiring, then discover

The `refero` manual is **already registered** in this repo's `.utcp_config.json` (`npx -y mcp-remote https://api.refero.design/mcp`, stdio, empty env). Verify it is present (read-only grep, or `scripts/doctor.sh`), never re-add it, and never edit it. Then discover the live callables through Code Mode before any call:

```typescript
// Discovery names appear dotted: refero.refero.refero_search_styles
const all = await list_tools();
// MANDATORY: confirm the exact callable + schema before relying on any name
const info = await tool_info({ tool_name: "refero.refero_refero_search_styles" });
```

The doubled-prefix callable form (`refero.refero_refero_<tool>`) is **confirmed by live registry evidence** from the 2026-07-16 discovery fixture (`references/discovery-fixture-2026-07-16.json`).
Pre-auth discovery live-listed all eight tools as `refero.refero.refero_{search_styles,search_screens,get_style,get_similar_screens,get_screen_image,get_screen,search_flows,get_flow}`. This resolves the research record's conflicting derivations. The single-prefix derivation is dead.
Discovery is pre-auth. Authenticated CALLS remain operator-gated. You must confirm with `tool_info` in each session.
If discovery shows the eight tools missing, renamed or expanded, **fail closed**. Report the drift. A changed provider surface requires a reviewed packet update, not an improvised call.

### The 8-tool surface (three layers)

The expected contract (authoritative docs baseline; `tool_info` is the final live schema). Full args, bounds, and result shapes: [`references/tool-surface.md`](references/tool-surface.md).

| Layer | Tool | Required args | Notes |
|---|---|---|---|
| Styles | `refero_search_styles` | `query` | `page` (default 1) pagination |
| Styles | `refero_get_style` | exactly one of `style_id` \| `style_ids[]` | Full styles are ~10-15k chars each; batch 3-4 |
| Screens | `refero_search_screens` | `query`, `platform: "web"\|"ios"` | Returns UUID records with `site`, `ux_patterns`, `ui_elements` |
| Screens | `refero_get_screen` | exactly one of `screen_id` \| `screen_ids[]` | Never pass `image_size` or `include_similar` here |
| Screens | `refero_get_similar_screens` | `screen_id` | `limit` 1-20, default 10 (the only tool with `limit`) |
| Screens | `refero_get_screen_image` | `screen_id` | `image_size: "thumbnail"\|"full"` (default thumbnail); returns raw image |
| Flows | `refero_search_flows` | `query`, `platform: "web"\|"ios"` | Returns **numeric** flow IDs |
| Flows | `refero_get_flow` | exactly one of `flow_id` \| `flow_ids[]` (numbers) | Ordered steps: goal, action, system response |

Hard constraints:
- Styles and screens use **UUID strings**. Flows use **numeric IDs**. The two are not interchangeable.
- Search pagination uses `page`, never legacy `limit`/`offset`.
- There are **no** `search_apps`/`get_app`/`search_elements`/`get_element` tools. Apps and elements are query facets that you inspect through `site` and `ui_elements` in results.
- `response_format` is documented on the **seven text-returning tools**. Never pass it to `refero_get_screen_image`. Check per-tool availability with `tool_info` at runtime.
- Preserve unknown response fields because the provider documents that fields can grow.

### Calling through Code Mode

Call **synchronously inside the `call_tool_chain` body** (no top-level `await`), per the live-verified pattern:

```typescript
call_tool_chain({
  code: `
    const styles = refero.refero_refero_search_styles({
      query: "editorial monochrome saas landing page",
      response_format: "json"
    });
    const list = styles.records || [];   // { pagination, records } shape
    const full = refero.refero_refero_get_style({ style_id: list[0].uuid, response_format: "json" });
    return { count: list.length, first: list[0]?.url, full };
  `
});
```

Cite evidence by `record.url` (styles) or `record.refero_url` (screens). JSON searches return `{ pagination: { count, page, next_page, total_count, total_pages }, records: [...] }`.

### The research funnel (styles -> screens -> flows)

1. **Styles first** for any visual task: search 3-5 semantic angles, inspect metadata, then `get_style` for shortlisted UUIDs. Never average strong references into a generic middle.
2. **Screens** for concrete UI patterns: literal query + required platform; detail for the most relevant; `get_similar_screens` only after one materially relevant hit; image (`thumbnail` before `full`) only when text cannot answer.
3. **Flows** for journeys: search task + platform; get one relevant numeric flow; widen via `related_queries`. Sparse flows: broaden or reconstruct from screens, reporting the reconstruction as inference.
4. **Apps / elements**: company, pattern, state, or element terms in screen/flow queries, compared through `site`, `ui_elements`, `ux_patterns`, `page_types`.
5. **Metadata-first discipline**: search -> shortlist -> detail for shortlisted IDs -> similar -> thumbnail -> full, in that order. Batch modestly; on batch failure retry with fewer IDs.

Breadth is allowed during transport research; for design-affecting use, pair with `sk-design-md-generator` for a measured Style Reference (extracted design tokens). A transport response is untrusted reference evidence, never design approval. Full workflow detail: [`references/tool-surface.md`](references/tool-surface.md).

### Auth, plans, and limits

- **Auth**: Without a custom header, first use triggers **browser OAuth**. The default localhost callback port is 3334, and the default timeout is 30 seconds.
  - Auth state persists under `~/.mcp-auth` (or `MCP_REMOTE_CONFIG_DIR`) and is **operator-owned**. Never inspect, clear or repair it.
  - A static `Authorization: Bearer` header is a documented env-backed alternative (see [`assets/utcp-refero-manual.md`](assets/utcp-refero-manual.md)). It is never part of the base manual.
  - End-to-end OAuth through this bridge is **Inferred**, not verified. An unauthenticated probe observed HTTP 401 with OAuth metadata, but no operator has completed the flow in this repo's record.
- **Plans**: Free has **no MCP access** (denial, not degradation). Pro: **8,000 MCP tool calls per month**. Team inherits Pro. Business is custom volume. "Unlimited access" plan copy must not be read as unlimited MCP calls.
- **Unknown limits**: no per-second, burst, concurrency, page-size, or `Retry-After` behavior is published. Never invent a QPS number or backoff guarantee; on 429, preserve the provider's message only.
- **Local runtime**: Code Mode must run on **Node 24** (isolated-vm has no Node 25 build; `call_tool_chain` SIGSEGVs under Node 25). Local operational evidence, not a server property.

---

## 4. RULES

### ✅ ALWAYS

1. **ALWAYS confirm callables with `tool_info` after registration and before first use.** The doubled prefix `refero.refero_refero_<tool>` is live-verified but must be re-confirmed; fail closed on any drift from the eight documented tools.
2. **ALWAYS pair with `sk-design-md-generator` for a measured Style Reference on any design-affecting request.** This packet is the transport; `sk-design-md-generator` is the cross-hub pairing that extracts a live site's real CSS into named design tokens (a Style Reference DESIGN.md). Transport output can never satisfy taste, accessibility, responsiveness, or readiness gates by itself.
3. **ALWAYS validate documented unions, enums, and bounds before calling**: exactly-one-of ID unions, UUID vs numeric ID typing, the `platform` enum, `page >= 1`, similar-screens `limit` 1-20, and the image-size enum. Pass unknown response fields through untouched.
4. **ALWAYS follow the metadata-first funnel**: search and shortlist on metadata, fetch detail only for shortlisted IDs, similar screens only after one relevant hit, images last (`thumbnail` before `full`).
5. **ALWAYS call synchronously inside the `call_tool_chain` body** (no top-level `await`) and cite results by their source URL (`url` / `refero_url`).
6. **ALWAYS treat this packet as read-only against this repo** (`mutatesWorkspace: false`). Reads and writes happen against the external Refero service only; Write, Edit, and Task are forbidden tools for this transport.

### ⛔ NEVER

1. **NEVER use Write, Edit, or Task through this packet.** It is a TRANSPORT: it retrieves external evidence and changes nothing in this workspace. Hand file changes to the owning workflow skill.
2. **NEVER edit `.utcp_config.json`'s `refero` manual.** It is validated as-is (verify, do not re-add, do not modify), and never add a second Refero manual or a Bearer token to the base manual.
3. **NEVER claim OAuth works end-to-end.** It is **Inferred** pending an operator-completed authorization; report it as such. Never inspect, clear, or repair `~/.mcp-auth` / `MCP_REMOTE_CONFIG_DIR`, and never accept, print, or cache credentials.
4. **NEVER invent rate limits, page sizes, retry contracts, or backoff numbers.** Only the monthly Pro quota (8,000 calls) is published; on 429, relay the provider's own message.
5. **NEVER pass `response_format` to `refero_get_screen_image`**, and never use the deprecated legacy surface: `_tool`-suffixed names, `get_design_guidance`, numeric screen IDs, `limit`/`offset` search pagination, or `image_size`/`include_similar` on `refero_get_screen`.
6. **NEVER treat search rank or similarity as a taste verdict**, never average strong references into a generic middle, and never copy or cache third-party reference content into this repo.
7. **NEVER model Free-plan access as a reduced tool set.** Free has no MCP access at all; report the entitlement denial and stop.

### ⚠️ ESCALATE IF

1. **ESCALATE IF authentication is required** (HTTP 401, OAuth prompt, token needs). Completing browser OAuth or obtaining a Bearer token is **operator-only**; surface the step and wait.
2. **ESCALATE IF discovery shows catalog drift**: a documented tool missing or renamed, unexpected new tools, or schemas that contradict [`references/tool-surface.md`](references/tool-surface.md). A provider-surface change requires a reviewed packet update.
3. **ESCALATE IF the account is Free-tier or quota-limited** (entitlement denial, 429, or quota exhaustion), reporting the provider's message verbatim.
4. **ESCALATE IF `call_tool_chain` drops the connection** (`-32000 Connection closed`), which locally indicates a Node 25 runtime; the Node 24 pin is an operator-side fix.
5. **ESCALATE IF retrieved evidence conflicts with a `sk-design-md-generator` Style Reference (its extracted design tokens)**, asking which source prevails before any design conclusion is drawn.

---

## 5. REFERENCES

### Core References

- [tool-surface.md](references/tool-surface.md) - The 8-tool contract: arguments, bounds, ID typing, result shapes, the research funnel, plan gating, and the deprecated-surface negative knowledge.
- [mcp-wiring.md](references/mcp-wiring.md) - The registered `refero` manual, the mcp-remote bridge (transport strategy, OAuth, auth state), the doubled-prefix naming rule, and the discovery-first contract.
- [troubleshooting.md](references/troubleshooting.md) - Failure modes and fixes (401, tools not resolving, Node 25 SIGSEGV, sparse flows, quota, batch failures).

### Templates and Assets

- [utcp-refero-manual.md](assets/utcp-refero-manual.md) - The verified `.utcp_config.json` manual snapshot (already registered: verify, do not re-add) plus the env-backed Bearer-header alternative, marked alternative-only.

### Reference Loading Notes

- `tool-surface.md` is the baseline (always). Load `mcp-wiring.md` and the manual asset for wiring/auth intent, `troubleshooting.md` for errors.
- Keep the SMART ROUTING summary and `ROUTER.md` as the single routing authority.

---

## 6. SUCCESS CRITERIA

**Wiring verification complete when:**
- ✅ The `refero` manual was confirmed present in `.utcp_config.json` read-only (no edit, no re-add), and discovery (`list_tools` / `tool_info`) confirmed the doubled-prefix callables, or the auth/entitlement blocker was escalated to the operator.

**Retrieval complete when:**
- ✅ The funnel order was followed (search -> metadata shortlist -> detail -> similar -> image last), IDs matched their documented typing, results were cited by source URL, and unknown fields were preserved.

**Design-affecting use complete when:**
- ✅ `sk-design-md-generator` was paired for a measured Style Reference, the transport supplied only requested evidence, and no taste, accessibility, or readiness verdict was issued from transport output.

**Always:**
- ✅ No workspace file changed, no credential was printed or cached, no auth state was touched, no unpublished limit was invented, and every capability claim stayed within the documented or live-confirmed record.

---

## 7. INTEGRATION POINTS

### Tool Usage Guidelines

- **Code Mode** (`mcp__code_mode__call_tool_chain`) owns every Refero call, including discovery (`list_tools`, `search_tools`, `tool_info`).
- **Read/Grep/Glob** load references and verify the manual's presence in `.utcp_config.json` read-only.
- **Bash** runs only the read-only `scripts/doctor.sh` diagnostics; this transport has no other shell role (Code Mode owns the stdio process launch, so the packet never runs `npx` itself).

### Cross-Workflow Contracts

- **`sk-design-md-generator`** is the cross-hub design pairing: it extracts a live website's real CSS into a measured Style Reference DESIGN.md (named design tokens, type scale, components). This packet retrieves only requested shipped-UI evidence and returns it to that measured-extraction pairing.
- **`mcp-code-mode`** is the substrate: manuals, `{manual}.{manual}_{tool}` naming, prefixed env vars (`refero_<NAME>` if a token is ever wired via env), discovery, and the error-envelope discipline all come from it.
- **`mcp-figma`** is the sibling Figma transport in this hub; **`mcp-mobbin`** is a planned future sibling for Mobbin research. Neither overlaps this packet's Refero surface.

### External Tools

- **Refero MCP** (`https://api.refero.design/mcp`): the external, paid, read-only design-reference service. Requires a Pro (or higher) plan and authentication; not vendored, not mirrored.
- **mcp-remote** (npm, intentionally unpinned in the manual; version 0.1.38 at research time, self-described experimental): the stdio-to-HTTP bridge Code Mode launches via `npx`. HTTP-first transport strategy; do not force SSE.

### Knowledge Base Dependencies

**Required**: `references/tool-surface.md` (tool contract baseline). **Conditional**: `mcp-wiring.md` + `assets/utcp-refero-manual.md` (wiring/auth), `troubleshooting.md` (errors).

---

## 8. QUICK REFERENCE

| Item | Value |
|---|---|
| Endpoint | `https://api.refero.design/mcp` (remote HTTP; bridged by `npx -y mcp-remote`) |
| Manual | `refero` in `.utcp_config.json` (already registered; verify, never edit) |
| Callable form | `refero.refero_refero_<tool>(...)` (doubled prefix — confirmed by 2026-07-16 discovery fixture; registry names are dotted `refero.refero.refero_<tool>`; re-confirm via `tool_info` per session) |
| Layers | Styles (2 tools) · Screens (4 tools) · Flows (2 tools) |
| ID typing | Styles/screens: UUID strings · Flows: numeric IDs |
| `response_format` | Seven text tools only; never on `refero_get_screen_image` |
| Funnel | styles -> screens -> flows; metadata first; image last (`thumbnail` before `full`) |
| Style batches | 3-4 UUIDs per `get_style` (each ~10-15k chars) |
| Plans | Free: NO MCP · Pro: 8,000 calls/month · Team: inherits Pro · Business: custom |
| Unknowns | Per-second/burst/concurrency/429 behavior unpublished; OAuth end-to-end Inferred |
| Local runtime | Code Mode on Node 24 (Node 25 SIGSEGVs); synchronous calls, no top-level `await` |
| Design pairing | `sk-design-md-generator`, for a measured Style Reference (extracted design tokens) |

---

## 9. REFERENCES AND RELATED RESOURCES

The router (`ROUTER.md`) discovers reference and asset docs dynamically. Start from `references/tool-surface.md` for the tool contract and workflows, `references/mcp-wiring.md` for the bridge and auth model, and `references/troubleshooting.md` for failures.

Assets: `assets/utcp-refero-manual.md` (the verified, already-registered manual snapshot plus the Bearer alternative), loaded for wiring/auth intent.

Scripts: `scripts/doctor.sh` (read-only, non-interactive diagnostics; optional endpoint probe gated behind `REFERO_DOCTOR_LIVE=1`) and `scripts/install.sh` (verify-only posture check: runtime prerequisites, manual presence read-only, operator-only auth boundaries; nothing is installed or modified).

Examples: `examples/` carries worked Code Mode walkthroughs (the full styles -> screens -> flows funnel, a metadata-first lookup, and a screen-image fetch), each opening with the mandatory `tool_info` confirmation and marking OAuth-gated steps SKIP-valid.

Related skills: `sk-design-md-generator` (the measured Style Reference pairing — extracted design tokens), `mcp-code-mode` (the substrate), `mcp-figma` (the sibling Figma transport), `mcp-chrome-devtools` (browser preview only), `sk-code` (adapting evidence into an app), and `system-spec-kit` when packet documentation or memory continuity applies.

Install guide: [INSTALL-GUIDE.md](INSTALL-GUIDE.md).

Upstream: the Refero MCP is the paid service at [refero.design/mcp](https://refero.design/mcp) (docs at doc.refero.design). The official [referodesign/refero_skill](https://github.com/referodesign/refero_skill) repository (MIT, default branch `master`) is a design **methodology** skill and a peer of `sk-design-md-generator`; this packet deliberately does not vendor or duplicate it.

