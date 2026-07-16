---
title: "mcp-mobbin: Feature Catalog"
description: "Unified capability inventory for the mcp-mobbin transport: the single documented read tool search_screens and the four query-intent research domains (apps, screens, flows, elements) it serves, each with the inferred Code Mode callable, documented inputs, and read-only classification."
trigger_phrases:
  - "mobbin"
  - "mobbin feature catalog"
  - "mobbin capabilities"
last_updated: "2026-07-16"
version: 1.1.0.0
---

# mcp-mobbin: Feature Catalog

This document is the canonical capability inventory for the `mcp-mobbin` skill. The root catalog acts as the system-level directory: it names the three live-discovered tools (2026-07-16 fixture), maps the research intents onto them, and tags every capability read-only, since the entire live-listed provider surface is read-only. The skill searches Mobbin's library of real app UI screenshots through the registered `mobbin` Code Mode manual as design-research evidence, with `sk-design` as the mandatory judgment partner for any design-affecting use.

> **Naming status (read first).** The Code Mode callables are **CONFIRMED by live pre-auth discovery 2026-07-16** ([`../references/discovery_fixture_2026-07-16.json`](../references/discovery_fixture_2026-07-16.json)): dotted discovery names `mobbin.mobbin.{search_screens,search_flows,search_sections}`, TS callables `mobbin.mobbin_search_screens(...)` etc. The `mobbin` manual **is registered**; operator OAuth pends for CALLS. A per-session `tool_info` confirmation still precedes first use, and the packet fails closed on drift.

> **Verification note.** Live discovery (2026-07-16) lists **three read-only tools**, superseding the one-tool documented contract from the official `mobbin/skills` repository. Live calls require a paid account (Pro, Team, or Enterprise; Free has no MCP access) and completed browser OAuth — there is no API key. Declared input/output schemas are in the fixture; the actual authenticated response shape is unexercised — verify any argument or result field with `tool_info` before relying on it, and preserve unknown response fields, never strip them.

---

## 1. OVERVIEW

Use this catalog as the inventory for the `mcp-mobbin` surface. The numbered sections below group the four research intents so readers can move from a top-level summary into per-domain detail without losing the read-only, single-tool context.

The capability surface has one hard prerequisite and three live tools. Everything depends on **access**: the hosted endpoint requires browser OAuth for CALLS (HTTP 401 otherwise; no API key exists) on a paid plan, bridged by the registered `mobbin` manual (`npx -y mcp-remote`, empty env), and rate-limited to 60 requests per 60 seconds per user. Live pre-auth discovery (2026-07-16 fixture) lists **three read-only tools**: `search_screens` (`query`, `platform` `"ios"`|`"web"`, `mode` `"deep"`|`"standard"`|`"fast"`, `limit`, `exclude_screen_ids`, `image_format`) serving the app/screen/element intents, plus `search_flows` (journey research with ordered per-screen previews) and `search_sections` (website-section research). Declared `search_screens` output: `{ query, screens[{id, app_name, mobbin_url, image_url, platform}] }`; the research-documented `index`/`failed[]` fields are absent from the declared schema — verify on first authenticated call.

A note on what stays out of scope. This skill is the retrieval transport, not the design judgment: taste, accessibility, responsiveness, and readiness verdicts belong to `sk-design`. The transport never mutates this workspace (`mutatesWorkspace: false`; Write/Edit/Task forbidden), never edits or re-adds the registered `mobbin` manual (operator-owned), never touches auth state, and never invents tools beyond the live-discovered inventory. The formerly disputed `deep` parameter is resolved (2026-07-16): it is a real client-settable `mode` value on `search_screens`.

### Capability class

Every capability below is READ-ONLY against both this workspace and the provider's documented surface. The only writes anywhere in the workflow are the provider-side rate-limit consumption and the operator-owned auth state that `mcp-remote` maintains outside this repo. The official skill's optional evidence-board writer is excluded from this transport. If live discovery ever returns a mutation-capable tool, it is refused — the read-only guarantee is an authorization boundary.

### Capability areas

| Capability area | Intent role | Key constraint |
|---|---|---|
| Apps | Category/company comparison across returned screens | Compare `app_name`/platform/patterns; results are evidence, never a chooser |
| Screens | Concrete UI patterns, states, components | Name the screen/state/job; start at `limit: 5`; cite `mobbin_url` |
| Flows | Journey research via the dedicated `search_flows` tool (live-discovered 2026-07-16) | Ordered per-screen previews (`position`) returned; anything beyond the returned ordering is labeled inference |
| Elements | Component behavior in context | Analyze within returned screens; no element-detail tool exists |
| Sections | Website-section research via `search_sections` (live-discovered 2026-07-16) | One section per query; results carry `site_name` |

---

## 2. APPS

Category and company research: name the app, company, or category plus the comparison goal, then compare `app_name`, platform, structure, and visible patterns across the returned screens.

| Feature | One-line description | Class | Canonical callable (CONFIRMED 2026-07-16) |
|---|---|---|---|
| App-intent screen search | Category/company query over the screen library, compared through `app_name` and visible patterns | READ-ONLY | `mobbin.mobbin_search_screens({ query, platform, limit? })` |

See [`apps/apps.md`](apps/apps.md) for query design and the evidence-not-chooser rule.

---

## 3. SCREENS

Concrete UI-pattern research: name the screen type, state, or job and the platform, inspect the returned metadata and inline images, and cite every used reference by `mobbin_url`.

| Feature | One-line description | Class | Canonical callable (CONFIRMED 2026-07-16) |
|---|---|---|---|
| Screen-intent search | Literal screen/state/job query; ordered `screens[]` metadata + inline images + `failed[]` | READ-ONLY | `mobbin.mobbin_search_screens({ query, platform, limit? })` |

See [`screens/screens.md`](screens/screens.md) for the input contract, response shape, and context discipline.

---

## 4. FLOWS

Journey research: `search_flows` (live-discovered 2026-07-16) returns flow objects with ordered per-screen previews (`screens[].position`), `actions[]`, and `screen_count` — superseding the old screens-only reconstruction guidance. Label anything beyond the returned ordering as inference.

| Feature | One-line description | Class | Canonical callable (CONFIRMED 2026-07-16) |
|---|---|---|---|
| Flow search | One-journey query; ordered flow objects with per-screen previews and pagination (`page` max 20) | READ-ONLY | `mobbin.mobbin_search_flows({ query, platform, limit?, page? })` |
| Flow-intent screen search | Journey/step query over screens when a flow object is not needed | READ-ONLY | `mobbin.mobbin_search_screens({ query, platform, limit? })` |

See [`flows/flows.md`](flows/flows.md) for the reconstruction-as-inference rule.

---

## 5. ELEMENTS

Component-in-context research: name the component plus its context or state, and analyze element behavior within the returned screens; no element-detail tool exists to call.

| Feature | One-line description | Class | Canonical callable (CONFIRMED 2026-07-16) |
|---|---|---|---|
| Element-intent screen search | Component+context/state query; behavior analyzed within returned screens | READ-ONLY | `mobbin.mobbin_search_screens({ query, platform, limit? })` |

See [`elements/elements.md`](elements/elements.md) for query design and the no-fabricated-tools boundary.

---

## 6. CAPABILITY COUNT SUMMARY

Each capability area maps to exactly one per-feature file in its intent folder.

| Section | Area | Tools involved | Per-feature file |
|---|---|---|---|
| 2 | Apps | 1 (`search_screens`) | `apps/apps.md` |
| 3 | Screens | 1 (`search_screens`) | `screens/screens.md` |
| 4 | Flows | 2 (`search_flows`, `search_screens`) | `flows/flows.md` |
| 5 | Elements | 1 (`search_screens`) | `elements/elements.md` |
| **Total** | **4 intent areas** | **3 live tools** (`search_sections` noted in the areas table pending a dedicated leaf) | **4 per-feature files** |

> The live-listed surface (2026-07-16 fixture) is exactly `search_screens`, `search_flows`, and `search_sections` — all read-only. There are still no `search_apps`, `search_elements`, detail, or image-download tools, and none may be invented. Keep the per-feature files in sync as the provider surface evolves, treat any live drift from the fixture three-tool baseline as a fail-closed escalation, and refuse any mutation-capable tool that discovery ever returns.
