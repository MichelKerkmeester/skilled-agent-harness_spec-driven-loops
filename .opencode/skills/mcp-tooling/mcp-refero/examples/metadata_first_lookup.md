---
title: "Example: Single-Tool Metadata-First Lookup"
description: "Worked Code Mode walkthrough of a metadata-first screen lookup: one search call answers the question from titles, ux_patterns, and ui_elements, and detail is fetched only for a justified shortlist, with the mandatory tool_info confirmation first."
trigger_phrases:
  - "refero metadata first example"
  - "refero single tool lookup"
  - "refero empty state lookup"
version: 1.1.0.0
---

# Example: Single-Tool Metadata-First Lookup

A worked walkthrough for the cheapest useful lane: *"What do real empty states look like in web dashboards?"* Most of the answer lives in search **metadata** — titles, `ux_patterns`, `ui_elements`, `page_types`, colors, content — so one search call does the work, and detail is fetched only when a shortlist earns it. Every tool and argument traces to [`references/tool_surface.md`](../references/tool_surface.md).

> This is also the pattern for the **elements facet**: there is no `search_elements` tool. Element research is a literal query term (`empty state`, `table`, `modal`, `toggle`, `recovery codes`) compared through the `ui_elements` and `ux_patterns` arrays in screen results.

---

## Step 0 — Verify the wiring (always runs; no auth needed)

```bash
bash .opencode/skills/mcp-tooling/mcp-refero/scripts/install.sh
# -> OK 'refero' manual registered in .utcp_config.json (read-only; never edited)
```

## Step 1 — Confirm the callable (MANDATORY; live discovery is OAuth-gated)

```typescript
const info = await tool_info({ tool_name: "refero.refero_refero_search_screens" });
// Confirm the doubled-prefix name and the live schema (incl. whether this client
// exposes response_format on this tool) before any call. Fail closed on drift.
```

**SKIP-valid:** without operator-completed OAuth (Pro or higher), record `SKIP (auth blocker)` with the exact command above and stop; unauthenticated calls return HTTP 401.

## Step 2 — One search call, metadata does the answering

```typescript
call_tool_chain({
  code: `
    const hits = refero.refero_refero_search_screens({
      query: "dashboard empty state",
      platform: "web",
      response_format: "json"
    });
    // Answer from metadata alone: which sites, which ux_patterns, which ui_elements.
    const summary = (hits.records||[]).map(r => ({
      site: r.site, url: r.refero_url,
      ux_patterns: r.ux_patterns, ui_elements: r.ui_elements, page_types: r.page_types
    }));
    return { pagination: hits.pagination, summary };
  `
});
```

The response is `{ pagination: { count, page, next_page, total_count, total_pages }, records: [...] }`. Preserve unknown fields — the provider documents that fields can grow. **SKIP-valid** with the auth blocker.

## Step 3 — Detail only if a shortlist earns it (optional)

Fetch full metadata only for UUIDs the Step 2 metadata could not answer:

```typescript
call_tool_chain({
  code: `
    const detail = refero.refero_refero_get_screen({
      screen_ids: ["<uuid-1>", "<uuid-2>"],          // exactly one of screen_id | screen_ids
      response_format: "json"
    });
    return detail;
  `
});
```

Never pass `image_size` or `include_similar` here (deprecated legacy surface); a screenshot request is its own tool and its own walkthrough ([screen_image_fetch.md](screen_image_fetch.md)). **SKIP-valid** with the auth blocker.

---

## Expected outcome

- The question was answered from one search call's metadata; detail ran only for a justified shortlist.
- Every cited screen carries its `refero_url`; the account tier for any live result was recorded.
- No taste verdict was issued: "these five dashboards use illustration-plus-CTA empty states" is transport evidence; whether that is the right direction belongs to `sk-design`.
- In an unauthenticated environment: Step 0 passed and Steps 1-3 were recorded as SKIP with the auth blocker.
