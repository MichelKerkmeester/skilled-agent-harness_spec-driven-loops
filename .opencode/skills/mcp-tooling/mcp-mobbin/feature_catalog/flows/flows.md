---
title: "Flows"
description: "Journey research through Mobbin's live-discovered search_flows tool (2026-07-16), with search_screens as the screens-level fallback: describe one journey, use the returned ordered per-screen previews, and label anything beyond the returned ordering as inference, read-only."
trigger_phrases:
  - "mobbin flows"
  - "mobbin ux flow"
  - "mobbin user journey"
  - "mobbin flow references"
version: 1.1.0.0
---

# Flows (flow-intent queries over search_screens)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Carries multi-step journey research: onboarding progressions, recovery paths, checkout journeys, and other flows as they ship in real apps. **Live discovery on 2026-07-16 supersedes the research baseline** (`../../references/discovery_fixture_2026-07-16.json`): a dedicated **`search_flows` tool exists** — registry name `mobbin.mobbin.search_flows`, TS callable `mobbin.mobbin_search_flows(...)` — returning flow objects with `name`, `actions[]`, `screen_count`, and ordered per-screen previews (`screens[].position`). `search_screens` remains available for screens-level journey queries.

The capability is READ-ONLY, with one hard honesty rule: anything beyond the tool's returned ordering is inference, and it is always labeled as such.

---

## 2. HOW IT WORKS

Compose the query as one user journey — for example `"onboarding with personalization steps"` or `"forgot-password recovery"` — plus the platform (`"ios"`|`"web"`, inferred or asked), with a low `limit`. The confirmed callable is `mobbin.mobbin_search_flows({ query, platform, limit?, page? })` (2026-07-16 fixture; re-confirm with `tool_info` per session; `page` max 20). The response is flow objects with ordered per-screen previews — use the returned `position` ordering as retrieved fact, and label any interpolation beyond it (skipped screens, inferred intermediate states) explicitly as inference. For screens-level queries, `mobbin.mobbin_search_screens({ query, platform, limit? })` still applies with the old reconstruction-as-inference discipline. Cite every flow and screen used by its `mobbin_url`, report missing images as partial success, and hand any design-affecting conclusion to `sk-design`.

### Query-intent recipes

| Goal | Query shape | Example |
|---|---|---|
| Journey overview | `<journey> progression` | `"first-run onboarding progression"` |
| Target step | `<journey> <step>` | `"checkout payment method selection"` |
| Recovery path | `<failure> recovery` | `"forgot-password recovery"` on `web` |

### Cross-cutting constraints (traced to [`tool_surface.md`](../../references/tool_surface.md))

- **Rate limit** (§3): 60 requests per 60 seconds per user — reconstructing a journey often takes several queries; budget the window, and on 429 honor `Retry-After`, then exponential backoff with jitter.
- **Plan gating** (§3): MCP requires Pro, Team, or Enterprise (Free excluded); entitlement denials are relayed verbatim, never guessed.
- **Flow tool exists** (§1 completeness boundary, updated 2026-07-16): `search_flows` is live-discovered; sequence claims beyond its returned ordering stay labeled inference. No other flow-family tools may be invented.
- **Schema honesty** (§1): the `deep` conflict is resolved (a `mode` input on `search_screens`); no invented parameters on any tool.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/tool_surface.md` | Shared | The flow-intent workflow and the reconstruction-as-inference rule |
| `references/mcp_wiring.md` | Shared | Inferred callable naming and the discovery-first contract |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/read_only/flow_intent.md` | Manual playbook | Flow-intent search with labeled reconstruction |
| `manual_testing_playbook/pairing/sk_design_pairing.md` | Manual playbook | Flow evidence routes through sk-design before any design verdict |

---

## 4. SOURCE METADATA

- Group: Flows
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `flows/flows.md`

Related references:
- [screens.md](../screens/screens.md) covers the underlying screen-search contract flows reconstruct from
- [apps.md](../apps/apps.md) covers comparing the same journey across apps
