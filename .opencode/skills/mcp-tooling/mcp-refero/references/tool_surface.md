---
title: "Refero Tool Surface"
description: "The eight-tool Refero MCP contract: arguments, bounds, ID typing, result shapes, the styles-screens-flows research funnel, plan gating, and the deprecated legacy surface as fail-closed negative knowledge."
trigger_phrases:
  - "refero tools"
  - "refero search styles screens flows"
  - "refero get_style get_screen get_flow"
  - "refero tool surface"
  - "refero plan gating"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Refero Tool Surface

The expected contract for the Refero MCP's **eight read-only tools across three layers** (styles, screens, flows). Treat this table as the documented baseline and Code Mode discovery (`list_tools` / `search_tools` / `tool_info`) as the final live schema before calling. Documented facts trace to the official Refero MCP docs (doc.refero.design) and the official `referodesign/refero_skill` repository; live-verified facts trace to this repo's design-reference catalog.

> "Apps" and "elements" are **query and result facets** (the `site` metadata and `ui_elements` arrays), not tool families. There are no `search_apps`, `get_app`, `search_elements`, or `get_element` tools.

---

## 1. THE EIGHT TOOLS

| Layer | Tool | Required args | Optional args / bounds | Returns |
|---|---|---|---|---|
| Styles | `refero_search_styles` | `query: string` | `page` (default 1); `response_format?` | `{pagination, records[]}`: style UUID, title, source URL, preview URL, platform, description |
| Styles | `refero_get_style` | exactly one of `style_id: string` \| `style_ids: string[]` | `response_format?` | Visual thesis, color/token roles, typography, layout, spacing, surfaces/elevation, components, imagery, do/don't rules |
| Screens | `refero_search_screens` | `query: string`, `platform: "web"\|"ios"` | `page`; `response_format?` | Paginated UUID records with `site`, `page_url`, `refero_url`, thumbnail, `page_types`, `ux_patterns`, `ui_elements`, colors, content |
| Screens | `refero_get_screen` | exactly one of `screen_id: string` \| `screen_ids: string[]` | `response_format?` | Full screen metadata, fonts, tags, description/layout/functions. Never pass `image_size` or `include_similar` here |
| Screens | `refero_get_similar_screens` | `screen_id: string` | `limit` 1-20, default 10; `response_format?` | Comparable screen records |
| Screens | `refero_get_screen_image` | `screen_id: string` | `image_size: "thumbnail"\|"full"` (default thumbnail) | Raw screenshot image content |
| Flows | `refero_search_flows` | `query: string`, `platform: "web"\|"ios"` | `page`; `response_format?` | Paginated summaries with **numeric** flow IDs, site, steps summary, problem, description |
| Flows | `refero_get_flow` | exactly one of `flow_id: number` \| `flow_ids: number[]` | `response_format?` | Ordered steps: screen UUID, goal, action, system response, metadata, `related_queries` |

### Hard constraints

- **ID typing is not interchangeable**: styles and screens use UUID strings; flows use numeric IDs.
- Search pagination uses `page`, never legacy `limit`/`offset`. `limit` belongs only to `refero_get_similar_screens` (1-20, default 10).
- JSON search responses follow `{ pagination: { count, page, next_page, total_count, total_pages }, records: [...] }`. The provider documents that fields can grow: **preserve unknown structured fields** rather than decoding into a closed schema.
- Full styles are large, roughly **10-15k characters each**; keep `get_style` batches to **3-4 UUIDs**.
- A local observation records a **flow batch maximum of 10** IDs for `refero_get_flow`. This is not a published contract; treat it as a batching heuristic and confirm via `tool_info` (open question).
- **Styles coverage is web marketing/product pages ONLY** (landing, pricing, editorial, SaaS sites), not in-app dashboards, auth/settings screens, or iOS style systems. Screens and flows do support `platform: web|ios`.
- Content scale per the official repository: **150,000+ real app screens and 6,000+ user flows**.

### `response_format`

Documented on the **seven text-returning tools** (every tool except `refero_get_screen_image`) and conditionally exposed by clients. **Never pass it to `refero_get_screen_image`.** The research record preserves a source conflict on its exact scope, resolved toward the strongest-sourced seven-text-tools reading; per-tool availability is a **`tool_info` runtime check**, not an assumption. With `response_format: "json"` searches return the `{ pagination, records }` object; with the default markdown they return reference text.

---

## 2. DEPRECATED LEGACY SURFACE (FAIL-CLOSED NEGATIVE KNOWLEDGE)

Older extractions of the Refero surface circulate and are **retrieval drift**. If any of these appear in a plan, a prompt, or a generated call, reject the call and re-check discovery:

| Legacy artifact | Status |
|---|---|
| `_tool`-suffixed tool names | Deprecated; not the current surface |
| `get_design_guidance` | Deprecated; does not exist in the current eight-tool surface |
| Numeric screen IDs | Wrong typing; screens use UUID strings (flows are the numeric layer) |
| `limit` / `offset` search pagination | Replaced by `page`; `limit` survives only on `refero_get_similar_screens` |
| `image_size` / `include_similar` on `refero_get_screen` | Never valid there; `image_size` belongs to `refero_get_screen_image` only |
| `search_apps` / `get_app` / `search_elements` / `get_element` | Never existed; apps and elements are query/result facets |

---

## 3. THE RESEARCH FUNNEL (STYLES -> SCREENS -> FLOWS)

The official workflow contract, merged across the provider docs and the official skill repository:

1. **Styles first** for any visual task. Search 3-5 semantic angles (product/domain/audience plus a concrete aesthetic direction), inspect metadata, then `refero_get_style` for shortlisted UUIDs. Select one primary direction; borrow bounded details; **never average strong references into a generic middle**.
2. **Screens** for concrete UI patterns. Literal semantic query (screen type, component, state, company) plus the required `platform`; inspect metadata and UUIDs; get detail for the most relevant; `refero_get_similar_screens` only after one screen is materially relevant; request an image (`thumbnail` before `full`) only when text cannot answer.
3. **Flows** for multi-step journeys. Search task + platform; get one relevant numeric flow; use step goals, actions, system responses, completion states, and `related_queries` to widen. If flows are sparse, broaden the query or reconstruct the journey from related screens, and **report reconstruction as inference**.
4. **Apps / products**: put a company, industry, or domain term in screen/flow queries and inspect the returned `site` metadata. **Elements**: literal queries (`table`, `modal`, `toggle`, `empty state`, `recovery codes`) compared through `ui_elements`, `ux_patterns`, `page_types`, and content.
5. **Metadata-first context discipline**: search and compare titles/descriptions/tags, fetch details only for shortlisted IDs, then similar screens, then thumbnail, then full image, in that order. Batch detail lookups modestly; on batch failure retry with fewer IDs.

### The local judgment boundary

Upstream permits multi-reference comparison; the local `sk-design` contract is stricter for design-affecting use: resolve **ONE** matching live reference, name the category default, never show a chooser, never copy. Reconcile by allowing breadth during transport research while `sk-design` collapses evidence to one declared critique reference before design judgment. Multiple results may still be returned for explicit competitive research. Pure factual lookups ("list Refero screens matching X") may return evidence without a taste verdict; if that evidence will influence a design, it must route back through `sk-design`.

---

## 4. PLAN GATING AND LIMITS

Documented entitlements (official plans and MCP getting-started pages):

| Tier | MCP implication |
|---|---|
| Free | **No MCP access** (denial, not a reduced tool set; also no Refero Skill or Figma plugin). Never model Free as a smaller tool list. |
| Pro | First individual tier with MCP/Skill; **8,000 MCP tool calls per month**. |
| Team | Inherits Pro capabilities; adds admin, shared bookmarks, SSO. Do not infer a different MCP tool contract without account evidence. |
| Business | Higher/custom volume. The published example ($0.001/request, $2,000 minimum) is commercial illustration, not a throttling contract. |
| Lifetime | Plan copy says "unlimited access"; must NOT be read as unlimited MCP calls given the documented monthly quota. |

**Unknown across all sources**: per-second, per-minute, burst, concurrency, page-size, `Retry-After`, and authenticated 429 behavior. Never invent a client-side QPS number or backoff guarantee; on 429, preserve the provider message and header-derived guidance only. The public availability of the GitHub skill's craft methodology does **not** make the live MCP free: plan entitlement and public methodology are different layers.

**Gating hygiene**: record tier context per finding (which plan a result was observed under); never claim a capability is free or paid without a live probe under a known account tier.

---

## 5. OPEN QUESTIONS (UNKNOWN, RUNTIME-ONLY)

These stay UNKNOWN until live evidence exists; none can be resolved by authoring:

1. Does authenticated `tools/list` exactly match the eight documented tools, and does Code Mode expose the doubled `refero.refero_refero_<tool>` names? (Confirm at install/first use.)
2. Which tools actually expose `response_format` through this Code Mode client? (Live `tool_info` per tool.)
3. What search page size applies, and can it vary by layer or plan?
4. What per-second, burst, concurrency, 429, and `Retry-After` behavior applies?
5. Does the existing bridge complete OAuth authorization, refresh, and dynamic registration end to end? (Operator browser OAuth required; currently **Inferred**.)
6. How does an operator obtain a Refero Bearer token, and does `--header` argument escaping behave as documented in the target host?
7. Is the local "flow batch max 10" observation still true? (Not a published contract.)
8. Does the Node 24-only Code Mode constraint persist after future Code Mode / isolated-vm releases?
9. Does the current `refero_skill` repository revision remain aligned with the detailed tools page? (Researched at `master` @ `f78b4ecc…`.)
10. Exact Team-tier MCP behavior (same contract as Pro?), and whether tier context changes any tool's results.

---

## 6. RELATED RESOURCES

- [mcp_wiring.md](mcp_wiring.md) - the registered manual, the mcp-remote bridge, OAuth/Bearer auth, and the doubled-prefix naming rule.
- [troubleshooting.md](troubleshooting.md) - symptom, cause, and fix for the common failure modes.
- [utcp_refero_manual.md](../assets/utcp_refero_manual.md) - the verified manual snapshot and the Bearer alternative.
- [SKILL.md](../SKILL.md) - the runtime contract this reference supports.
