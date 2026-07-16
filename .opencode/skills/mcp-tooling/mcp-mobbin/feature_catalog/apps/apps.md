---
title: "Apps"
description: "App and category research through Mobbin's single search_screens tool: name the app, company, or category plus the comparison goal, then compare app_name, platform, and visible patterns across returned screens, read-only."
trigger_phrases:
  - "mobbin apps"
  - "mobbin app research"
  - "mobbin app comparison"
  - "mobbin category research"
version: 1.1.0.0
---

# Apps (app-intent queries over search_screens)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Carries app- and category-level research: how a named app, company, or product category handles a design problem, compared across real shipped screens. There is **no `search_apps` tool** — app research is a query intent over the single documented `search_screens` tool, compared through the `app_name` and `platform` fields of the returned metadata and the visible patterns in the inline images.

The capability is READ-ONLY. Multiple results are evidence for comparison, never a design chooser: choosing belongs to `sk-design`.

---

## 2. HOW IT WORKS

Compose the query from the app/company/category and the comparison goal — for example `"banking apps onboarding identity verification"` — plus `platform: "ios"` or `"web"` inferred from context (ask when unclear), starting at `limit: 5`. The inferred callable is `mobbin.mobbin_search_screens({ query, platform, limit? })` (confirm with `tool_info` in a fresh Code Mode session; the name has never been observed live). Compare the returned `screens[]` records through `app_name`, `platform`, structure, and visible patterns; correlate each inline image to its record by `index`; cite every reference used by its `mobbin_url`; and report `failed[]` entries as partial success. Widening beyond ~15 results needs an explicit ask first.

### Query-intent recipes

| Goal | Query shape | Example |
|---|---|---|
| Category comparison | `<category> apps <design problem>` | `"banking apps onboarding identity verification"` |
| Named-app study | `<app or company> <surface or state>` | `"Airbnb search results filtering"` |
| Cross-platform contrast | Same query, one call per `platform` value | `"subscription paywall"` on `ios`, then `web` |

### Cross-cutting constraints (traced to [`tool_surface.md`](../../references/tool_surface.md))

- **Rate limit** (§3): 60 requests per 60 seconds per user — comparison sweeps across many categories consume the window fast; on 429 honor `Retry-After`, then exponential backoff with jitter.
- **Plan gating** (§3): MCP requires Pro, Team, or Enterprise (Free excluded); per-plan usage caps within eligible tiers are undocumented — never claim a caps matrix.
- **Auth** (§3, via `mcp_wiring.md` §4): browser OAuth only; no API key exists to wire.
- **Schema honesty** (§1): never hardcode the disputed `deep` parameter; preserve unknown response fields.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/tool_surface.md` | Shared | The single-tool contract, app-intent query design, and the completeness boundary |
| `references/mcp_wiring.md` | Shared | Inferred callable naming and the discovery-first contract |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/read_only/screens_search.md` | Manual playbook | The search contract app-intent queries run on |
| `manual_testing_playbook/pairing/sk_design_pairing.md` | Manual playbook | App evidence routes through sk-design before any design verdict |

---

## 4. SOURCE METADATA

- Group: Apps
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `apps/apps.md`

Related references:
- [screens.md](../screens/screens.md) covers the underlying screen-search contract
- [flows.md](../flows/flows.md) covers journey reconstruction across an app's screens
