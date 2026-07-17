---
title: "mcp-refero: Feature Catalog"
description: "Unified capability inventory for the mcp-refero transport: the eight read-only Refero MCP tools across the styles, screens, and flows layers, each with its canonical doubled-prefix callable, arguments, bounds, and read-only classification."
trigger_phrases:
  - "refero"
  - "refero feature catalog"
  - "refero capabilities"
last_updated: "2026-07-16"
version: 1.0.0.0
---

# mcp-refero: Feature Catalog

This document is the canonical capability inventory for the `mcp-refero` skill. The root catalog acts as the system-level directory: it summarizes each tool domain, names the canonical Code Mode callable for each tool, and tags every capability read-only, since the entire provider surface is read-only. The skill searches Refero's library of real shipped UI (styles, screens, flows) through the `refero` Code Mode manual as design-reference evidence, with `sk-design` as the mandatory judgment partner for any design-affecting use.

> **Naming trap (read first).** Callables use the **DOUBLED prefix** `refero.refero_refero_<tool>(...)`, because Code Mode's `{manual}.{manual}_{tool}` rule applies to tools whose own names already begin with `refero_`. The doubled form is live-verified locally; a mandatory `tool_info` confirmation still precedes first use, and the packet fails closed on catalog drift.

> **Verification note.** The tool rows below are the documented contract from the official Refero MCP docs and the official skill repository, cross-checked against this repo's live-verified catalog. Live calls require an authenticated Pro (or higher) account (Free has no MCP access). Verify any argument or result field with `tool_info` before relying on it; the provider documents that response fields can grow, so unknown fields are preserved, never stripped.

---

## 1. OVERVIEW

Use this catalog as the inventory for the live `mcp-refero` surface. The numbered sections below group the eight tools by layer so readers can move from a top-level summary into per-domain detail without losing the read-only context.

The capability surface has one hard prerequisite and three research layers. Everything depends on **access**: the remote endpoint requires authentication (HTTP 401 otherwise) and a Pro or higher plan, bridged by the already-registered `refero` manual (`npx -y mcp-remote`). From there the **styles** layer carries visual direction (web marketing/product pages only), the **screens** layer carries concrete UI patterns for web and iOS, and the **flows** layer carries multi-step journeys with ordered steps. "Apps" and "elements" are query and result facets (`site`, `ui_elements`), not tool families.

A note on what stays out of scope. This skill is the retrieval transport, not the design judgment: taste, accessibility, responsiveness, and readiness verdicts belong to `sk-design`. The transport never mutates this workspace (`mutatesWorkspace: false`; Write/Edit/Task forbidden), never edits the `refero` manual, never touches auth state, and never invents rate limits beyond the published Pro quota of 8,000 calls per month.

### Capability class

Every tool below is READ-ONLY against both this workspace and the provider: Refero exposes no mutating tools. The only writes anywhere in the workflow are the provider-side quota consumption and the operator-owned auth state that `mcp-remote` maintains outside this repo.

### Capability areas

| Capability area | Layer role | Key constraint |
|---|---|---|
| Styles | Visual direction (first stop for any visual task) | Web marketing/product pages only; full styles ~10-15k chars, batch 3-4 |
| Screens | Concrete UI patterns, states, components | Required `platform: "web"\|"ios"`; UUID string IDs; image tool never takes `response_format` |
| Flows | Multi-step journeys | **Numeric** IDs (never UUIDs); steps carry goal/action/system response |

---

## 2. STYLES

Search and retrieve visual-direction references: typography, palette, layout, spacing, surfaces, components, and do/don't rules from real web marketing and product pages. Styles are the official first stop for any visual task; strong references stay strong or get rejected, never averaged into a generic middle.

| Feature | One-line description | Class | Canonical callable |
|---|---|---|---|
| Search styles | Semantic search over style references; paginated UUID records with title, source URL, preview | READ-ONLY | `refero.refero_refero_search_styles({ query, page?, response_format? })` |
| Get style detail | Full style reference(s) for shortlisted UUIDs (exactly one of `style_id` \| `style_ids[]`) | READ-ONLY | `refero.refero_refero_get_style({ style_id \| style_ids, response_format? })` |

See [`styles/styles.md`](styles/styles.md) for the coverage boundary, batching bound, and the funnel role.

---

## 3. SCREENS

Search and retrieve concrete UI patterns from real shipped apps: screen metadata, `ux_patterns`, `ui_elements`, `page_types`, similar screens, and raw screenshots. The platform argument is required on search; company and element research runs through query terms plus the `site` and `ui_elements` result facets.

| Feature | One-line description | Class | Canonical callable |
|---|---|---|---|
| Search screens | Literal semantic search with required platform; paginated UUID records with rich metadata | READ-ONLY | `refero.refero_refero_search_screens({ query, platform, page?, response_format? })` |
| Get screen detail | Full metadata for screen UUID(s) (exactly one of `screen_id` \| `screen_ids[]`); never takes `image_size`/`include_similar` | READ-ONLY | `refero.refero_refero_get_screen({ screen_id \| screen_ids, response_format? })` |
| Similar screens | Comparable screens for one materially relevant hit; `limit` 1-20, default 10 | READ-ONLY | `refero.refero_refero_get_similar_screens({ screen_id, limit?, response_format? })` |
| Screen image | Raw screenshot; `image_size: "thumbnail"\|"full"` (default thumbnail); **never** takes `response_format` | READ-ONLY | `refero.refero_refero_get_screen_image({ screen_id, image_size? })` |

See [`screens/screens.md`](screens/screens.md) for the metadata-first ordering and the image-last rule.

---

## 4. FLOWS

Search and retrieve multi-step journeys: ordered steps with per-step screen UUID, goal, action, system response, and `related_queries` for widening. Flow IDs are numeric, the only numeric layer.

| Feature | One-line description | Class | Canonical callable |
|---|---|---|---|
| Search flows | Task/journey search with required platform; paginated summaries with **numeric** flow IDs | READ-ONLY | `refero.refero_refero_search_flows({ query, platform, page?, response_format? })` |
| Get flow detail | Ordered steps for numeric flow ID(s) (exactly one of `flow_id` \| `flow_ids[]`) | READ-ONLY | `refero.refero_refero_get_flow({ flow_id \| flow_ids, response_format? })` |

See [`flows/flows.md`](flows/flows.md) for the numeric-ID rule and the sparse-flow reconstruction discipline.

---

## 5. CAPABILITY COUNT SUMMARY

Each layer maps to one domain overview file plus one per-tool leaf per documented tool, so every one of the eight tools has its own home.

| Section | Area | Tools listed | Domain overview | Per-tool leaves |
|---|---|---|---|---|
| 2 | Styles | 2 | `styles/styles.md` | `styles/search-styles.md`, `styles/get-style.md` |
| 3 | Screens | 4 | `screens/screens.md` | `screens/search-screens.md`, `screens/get-screen.md`, `screens/get-similar-screens.md`, `screens/get-screen-image.md` |
| 4 | Flows | 2 | `flows/flows.md` | `flows/search-flows.md`, `flows/get-flow.md` |
| **Total** | **3 layers** | **8 tools** | **3 domain files** | **8 per-tool leaves** |

> The eight tools are the complete documented surface. There are no `search_apps`, `get_app`, `search_elements`, or `get_element` tools, and the deprecated legacy surface (`_tool` names, `get_design_guidance`, numeric screen IDs, `limit`/`offset` search paging) must be rejected on sight. The per-tool leaf count MUST equal the 8 documented tools; keep them in sync as the provider surface evolves, and treat any live drift from these 8 tools as a fail-closed escalation.
