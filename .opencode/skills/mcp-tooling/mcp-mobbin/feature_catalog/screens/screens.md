---
title: "Screens"
description: "Concrete screen research through Mobbin's search_screens tool: name the screen type, state, or job plus platform, inspect ordered screens[] metadata and inline images, cite mobbin_url, report failed[] honestly, read-only."
trigger_phrases:
  - "mobbin screens"
  - "mobbin screen examples"
  - "mobbin search screens"
  - "mobbin ui patterns"
version: 1.1.0.0
---

# Screens (search_screens, the documented tool)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Carries concrete UI-pattern research from real shipped apps: screen types, states, and jobs ("iOS subscription cancellation confirmation", "web empty-state dashboard"), for both `ios` and `web` platforms. This is the home domain of the **single documented tool** — every other intent (apps, flows, elements) is a query design over it.

The capability is READ-ONLY. The live-declared result schema (2026-07-16 fixture) is `{ query, screens[{id, app_name, mobbin_url, image_url, platform}] }`; no detail or image-download tool exists. The formerly disputed `deep` parameter is confirmed as the client-settable `mode` input (`"deep" | "standard" | "fast"`), alongside `limit`, `exclude_screen_ids`, and `image_format`; the actual authenticated response shape is unexercised until a live call.

---

## 2. HOW IT WORKS

The inferred callable `mobbin.mobbin_search_screens({ query, platform, limit? })` takes a natural-language `query` derived from the user's actual words, the required-in-practice `platform: "ios"|"web"` (infer from context; unclear -> ask), and `limit` defaulting to 5 (~15 ceiling guidance; ask before widening materially). It returns `screens: [{ index, id, app_name, mobbin_url, image_url, platform }]`, a `failed[]` list, and inline images in the same order as the metadata — `index` correlates image to record. Follow the official operating sequence: announce a short search plan, call in the same turn, visually inspect the returned references (content, structure, styling, interaction; compare repeats and meaningful differences), and answer from evidence tied to returned screens. Cite by `mobbin_url`; report `failed[]` and missing images as partial success; preserve unknown response fields untouched.

### Query-intent recipes

| Goal | Query shape | Example |
|---|---|---|
| Screen type + state | `<platform-context> <screen> <state>` | `"iOS subscription cancellation confirmation"` |
| Job-to-be-done | `<surface> <job>` | `"web empty-state dashboard"` |
| Smoke check | Any concrete screen phrase at `limit: 1` | `"onboarding"` with `limit: 1` |

### Cross-cutting constraints (traced to [`tool-surface.md`](../../references/tool-surface.md))

- **Rate limit** (§3): 60 requests per 60 seconds per user; on 429 honor `Retry-After`, then exponential backoff with jitter — never invent finer burst contracts.
- **Plan gating** (§3): MCP requires Pro, Team, or Enterprise (Free excluded; exact denial semantics UNVERIFIED — relay the provider's message verbatim).
- **Context pressure** (§1 hard constraints): each screen carries an inline image; keep `limit` at 5 and widen only after asking.
- **Schema honesty** (§1): the `deep` conflict is resolved (a `mode` input, 2026-07-16 fixture); no invented parameters, no stripped unknown fields.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/tool-surface.md` | Shared | Inputs, response shape, inline-image ordering, and the resolved `deep` mode |
| `references/mcp-wiring.md` | Shared | Inferred callable naming and the discovery-first contract |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/read-only/screens-search.md` | Manual playbook | The screen-search contract and citation discipline |
| `manual_testing_playbook/pairing/sk-design-pairing.md` | Manual playbook | Screen evidence routes through sk-design before any design verdict |

---

## 4. SOURCE METADATA

- Group: Screens
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `screens/screens.md`

Related references:
- [apps.md](../apps/apps.md) covers category comparison over the same tool
- [elements.md](../elements/elements.md) covers component-in-context analysis within returned screens
