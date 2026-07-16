---
title: "Flows"
description: "Journey research through Mobbin's search_screens tool: describe the journey and target step, reconstruct sequence from returned screens only when visual evidence supports it, and label every reconstruction as inference, read-only."
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

Carries multi-step journey research: onboarding progressions, recovery paths, checkout journeys, and other flows as they ship in real apps. There is **no `search_flows` tool and no ordered flow object in the contract** — flow research is a query intent over the single documented `search_screens` tool, and any step sequence is a reconstruction from the returned screen evidence.

The capability is READ-ONLY, with one hard honesty rule: reconstruction is inference, and it is always labeled as such.

---

## 2. HOW IT WORKS

Compose the query from the journey and the target step — for example `"first-run onboarding progression"` or `"forgot-password recovery"` — plus the platform (`ios`|`web`, inferred or asked), starting at `limit: 5`. The inferred callable is `mobbin.mobbin_search_screens({ query, platform, limit? })` (confirm with `tool_info` in a fresh Code Mode session). The response is screens, not steps: inspect the returned metadata and inline images, and reconstruct a sequence **only when the visual evidence supports it** — matching app, coherent progression, consistent state transitions — reporting the reconstruction explicitly as inference, never as retrieved fact. Cite every screen used by its `mobbin_url`, report `failed[]` as partial success, and hand any design-affecting conclusion to `sk-design`.

### Query-intent recipes

| Goal | Query shape | Example |
|---|---|---|
| Journey overview | `<journey> progression` | `"first-run onboarding progression"` |
| Target step | `<journey> <step>` | `"checkout payment method selection"` |
| Recovery path | `<failure> recovery` | `"forgot-password recovery"` on `web` |

### Cross-cutting constraints (traced to [`tool_surface.md`](../../references/tool_surface.md))

- **Rate limit** (§3): 60 requests per 60 seconds per user — reconstructing a journey often takes several queries; budget the window, and on 429 honor `Retry-After`, then exponential backoff with jitter.
- **Plan gating** (§3): MCP requires Pro, Team, or Enterprise (Free excluded); entitlement denials are relayed verbatim, never guessed.
- **No flow tool** (§1 completeness boundary): `search_flows` does not exist and is never invented; sequence claims stay labeled inference.
- **Schema honesty** (§1): the `deep` conflict stays open; no invented parameters.

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
