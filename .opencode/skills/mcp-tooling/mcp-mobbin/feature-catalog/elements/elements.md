---
title: "Elements"
description: "Component-in-context research through Mobbin's search_screens tool: name the component plus its context or state, analyze element behavior within returned screens, and never fabricate an element-detail tool, read-only."
trigger_phrases:
  - "mobbin elements"
  - "mobbin component examples"
  - "mobbin element research"
  - "mobbin ui elements"
version: 1.1.0.0
---

# Elements (element-intent queries over search_screens)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Carries component-level research: how real apps handle a specific UI element in a specific context or state — bottom sheets, inline validation, confirmation dialogs, tab bars. There is **no `search_elements` or element-detail tool** — element research is a query intent over the single documented `search_screens` tool, analyzed within the returned screens.

The capability is READ-ONLY, with a hard fabrication boundary: element behavior is observed in the returned evidence, never fetched from an invented detail tool.

---

## 2. HOW IT WORKS

Compose the query from the component plus its context and state — for example `"bottom-sheet destructive confirmation"` or `"inline validation on signup"` — plus the platform (`ios`|`web`, inferred or asked), starting at `limit: 5`. The inferred callable is `mobbin.mobbin_search_screens({ query, platform, limit? })` (confirm with `tool_info` in a fresh Code Mode session). Analyze the element's behavior within the returned screens: placement, states, hierarchy, interaction cues visible in the inline images, compared across the `screens[]` records by `index` and `app_name`. Cite every screen used by its `mobbin_url`, report `failed[]` and missing images as partial success, and route any design-affecting conclusion through `sk-design` — element evidence informs a judgment, it never is one.

### Query-intent recipes

| Goal | Query shape | Example |
|---|---|---|
| Component + context | `<component> <context>` | `"bottom-sheet destructive confirmation"` |
| Component + state | `<component> <state> on <surface>` | `"inline validation on signup"` |
| Behavior comparison | `<component>` compared across `app_name` values in one result set | `"tab bar"` at `limit: 5` |

### Cross-cutting constraints (traced to [`tool-surface.md`](../../references/tool-surface.md))

- **Rate limit** (§3): 60 requests per 60 seconds per user; on 429 honor `Retry-After`, then exponential backoff with jitter.
- **Plan gating** (§3): MCP requires Pro, Team, or Enterprise (Free excluded); no per-tool tier gates may be invented.
- **No detail tool** (§1 completeness boundary): `search_elements` and element-detail tools do not exist; behavior is observed in returned screens only.
- **Schema honesty** (§1): the `deep` conflict is resolved (a `mode` input on `search_screens`, 2026-07-16 fixture); unknown response fields are preserved untouched.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/tool-surface.md` | Shared | The element-intent workflow and the no-fabricated-tools boundary |
| `references/mcp-wiring.md` | Shared | Inferred callable naming and the discovery-first contract |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/read-only/screens-search.md` | Manual playbook | The search contract element-intent queries run on |
| `manual-testing-playbook/pairing/sk-design-pairing.md` | Manual playbook | Element evidence routes through sk-design before any design verdict |

---

## 4. SOURCE METADATA

- Group: Elements
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `elements/elements.md`

Related references:
- [screens.md](../screens/screens.md) covers the underlying screen-search contract
- [flows.md](../flows/flows.md) covers element behavior across a journey's steps
