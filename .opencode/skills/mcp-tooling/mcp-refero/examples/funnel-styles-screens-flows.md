---
title: "Example: The Styles -> Screens -> Flows Funnel"
description: "Worked Code Mode walkthrough of the full official Refero research funnel: styles for visual direction, screens for concrete patterns, flows for the journey, with the mandatory tool_info confirmation first and metadata-first ordering at every layer."
trigger_phrases:
  - "refero funnel example"
  - "styles screens flows walkthrough"
  - "refero research funnel"
version: 1.1.0.0
---

# Example: The Styles -> Screens -> Flows Funnel

A worked walkthrough of the official research funnel for a realistic brief: *"We are designing a pricing page for a developer-tools SaaS; gather visual direction, real pricing-page patterns, and how products run the upgrade journey."* Every tool, argument, and bound below traces to [`references/tool-surface.md`](../references/tool-surface.md).

> **Design-affecting note.** This brief feeds a design decision, so `sk-design` loads FIRST and owns the judgment; the transport only retrieves what the design mode requests. The funnel below is the retrieval half of that pairing.

---

## Step 0 — Verify the wiring (always runs; no auth needed)

```bash
bash .opencode/skills/mcp-tooling/mcp-refero/scripts/install.sh
# -> OK 'refero' manual registered in .utcp_config.json (read-only; never edited)
```

## Step 1 — Confirm the callables (MANDATORY; live discovery is OAuth-gated)

```typescript
// Inside Code Mode:
const all = await list_tools();                       // discovery names appear dotted
const info = await tool_info({ tool_name: "refero.refero_refero_search_styles" });
// Fail closed if the eight documented tools are missing, renamed, or expanded.
```

**SKIP-valid:** without operator-completed OAuth (Pro or higher), discovery of the live schemas is blocked at HTTP 401. Record `SKIP (auth blocker)` with the exact command above; do not proceed to Steps 2-4 on guessed names.

## Step 2 — Styles first (visual direction)

Search 3-5 semantic angles (product/domain/audience plus a concrete aesthetic direction), shortlist on metadata, then fetch at most 3-4 UUIDs (full styles run ~10-15k characters each):

```typescript
call_tool_chain({
  code: `
    const a1 = refero.refero_refero_search_styles({ query: "developer tools saas pricing page", response_format: "json" });
    const a2 = refero.refero_refero_search_styles({ query: "technical editorial dark landing page", response_format: "json" });
    const a3 = refero.refero_refero_search_styles({ query: "monospace utilitarian product marketing", response_format: "json" });
    // Shortlist on metadata only (title, description, platform) — no detail yet.
    const shortlist = [...(a1.records||[]), ...(a2.records||[]), ...(a3.records||[])].slice(0, 3);
    const full = refero.refero_refero_get_style({ style_ids: shortlist.map(r => r.uuid), response_format: "json" });
    return { angles: 3, shortlisted: shortlist.map(r => ({ uuid: r.uuid, url: r.url })), full };
  `
});
```

Cite each style by `record.url`. Never average strong references into a generic middle — selection of ONE primary direction happens inside `sk-design`, not here. **SKIP-valid** with the auth blocker.

## Step 3 — Screens for the concrete pattern

Literal semantic query plus the required `platform`; detail only for the most relevant UUIDs; `get_similar_screens` only after one screen is materially relevant:

```typescript
call_tool_chain({
  code: `
    const hits = refero.refero_refero_search_screens({ query: "saas pricing page tier comparison", platform: "web", response_format: "json" });
    const top = (hits.records||[])[0];
    const detail = refero.refero_refero_get_screen({ screen_id: top.uuid, response_format: "json" });
    const similar = refero.refero_refero_get_similar_screens({ screen_id: top.uuid, limit: 5 });
    return { cited: top.refero_url, detail, similar };
  `
});
```

Screen IDs are UUID strings. Never pass `image_size` or `include_similar` to `refero_get_screen` (deprecated legacy surface). **SKIP-valid** with the auth blocker.

## Step 4 — Flows for the journey

Task query plus platform; one relevant **numeric** flow; widen through `related_queries`:

```typescript
call_tool_chain({
  code: `
    const flows = refero.refero_refero_search_flows({ query: "upgrade to paid plan", platform: "web", response_format: "json" });
    // Records carry NUMERIC flow IDs (never UUIDs); read the exact field name
    // from the live record/tool_info — the docs pin the typing, not the key.
    const firstFlowId = /* numeric ID from (flows.records||[])[0] */ 0;
    const flow = refero.refero_refero_get_flow({ flow_id: firstFlowId, response_format: "json" });
    return { steps: flow };
  `
});
```

If flows are sparse, broaden the query or reconstruct the journey from related screens — and report the reconstruction as inference, never as retrieved fact. **SKIP-valid** with the auth blocker.

## Step 5 — Hand off to the judgment owner

Return the cited evidence (style `url`s, screen `refero_url`s, the ordered flow steps) to `sk-design`, which collapses it to ONE declared critique reference before any design verdict. The transport issues no taste, accessibility, or readiness call.

---

## Expected outcome

- Funnel order held: styles -> screens -> flows, metadata before detail at every layer.
- Bounds held: style batch <= 4 UUIDs, similar-screens `limit` within 1-20, numeric flow IDs.
- Every claim carries a source URL; unknown response fields preserved untouched.
- In an unauthenticated environment: Step 0 passes, Steps 1-4 recorded as SKIP with the auth blocker, and nothing was guessed.
