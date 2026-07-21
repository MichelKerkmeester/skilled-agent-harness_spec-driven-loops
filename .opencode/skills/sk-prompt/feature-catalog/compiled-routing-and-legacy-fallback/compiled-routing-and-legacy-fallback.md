---
title: "Compiled Routing And Legacy Fallback"
description: "How sk-prompt resolves the compiled per-hub router contract ahead of its own registry-driven routing, and the explicit `SPECKIT_COMPILED_ROUTING=0` kill-switch that falls back to legacy."
trigger_phrases:
  - "compiled routing and legacy fallback"
  - "SPECKIT_COMPILED_ROUTING"
  - "compiled route front door"
  - "sk-prompt compiled routing"
version: 1.0.0.0
---

# Compiled Routing And Legacy Fallback (compiled-route.cjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`sk-prompt`'s `SKILL.md` carries a default-on, flag-gated, additive directive that asks the compiled per-hub router contract to resolve the mode before falling through to the mode-registry-driven routing described in [`prompt-packet-routing.md`](../prompt-packet-routing/prompt-packet-routing.md).

The directive is on by default for `sk-prompt` (a member of the per-hub default-on cohort): the compiled front door resolves and `sk-prompt` follows the returned decision directly. Because compiled routing is verified byte-identical to legacy on every scenario (Lane C parity, `compiledRouting.subVerdict: 'compiled-serving'`), this is a transparent implementation swap, not a behavior change. Setting `SPECKIT_COMPILED_ROUTING=0` is the explicit kill-switch: it forces `sk-prompt` (and every eligible hub) back to legacy registry-driven routing.

---

## 2. HOW IT WORKS

### Resolution Order

By default (and always when `SPECKIT_COMPILED_ROUTING=1`), the directive shells out to `node .opencode/bin/compiled-route.cjs --hub sk-prompt --prompt "<task>"` before running the registry-driven routing above. The front door is a thin, promoted delegate: it resolves `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs` and calls `resolveRoute(hubId, taskText)`, which authorizes a compiled decision only when BOTH the tri-state runtime flag permits it AND `sk-prompt`'s promoted activation manifest (`.opencode/bin/lib/compiled-routing/010-live-activation/activation/sk-prompt/manifest.json`) reports `servingAuthority: "compiled"`. Any other combination, or any error while resolving, prints the legacy sentinel and `sk-prompt` routes unchanged. As of this writing, `sk-prompt`'s promoted manifest already reports `servingAuthority: "compiled"` and `shadowOnly: false`, and `sk-prompt` is a member of the per-hub default-on cohort — so with the flag unset, compiled routing serves by default; `SPECKIT_COMPILED_ROUTING=0` is the only way to withhold it.

### Tri-State Flag

`SPECKIT_COMPILED_ROUTING` is tri-state, parsed identically by the resolver and by the advisor-side consumption path. Each side owns its own per-hub default-on cohort: `sk-prompt` (like all seven eligible hubs) is now a member of the resolver's cohort, so `sk-prompt`'s hub-routing directive resolves to compiled serving when the flag is unset — the advisor-side `compiledRoute` enrichment cohort is tracked separately in `system-skill-advisor/mcp-server/lib/compiled-routing-flag.ts` and is unaffected by this cutover; `1` force-enables compiled resolution wherever the manifest also authorizes it; `0`, `false`, or `off` is an explicit fleet-wide kill-switch that forces legacy regardless of manifest state; any other value fails closed to legacy. `SPECKIT_COMPILED_ROUTING_DEBUG` gates optional stderr-only breadcrumbs for a fallback decision and never changes the served outcome.

### Outcome Handling

A served compiled decision returns one of four actions — `route` (use the returned `targets`), `clarify` or `defer` (disambiguate before proceeding), or `reject` (refuse) — which the `sk-prompt` directive follows directly. The same decision, when returned inside `advisor_recommend`, is additionally attached to that recommendation's `compiledRoute` field and threaded into brief rendering as `metadata.compiledRouteSummary`; see [`advisor-recommend.md`](../../../system-skill-advisor/feature-catalog/mcp-surface/advisor-recommend.md) for the shared advisor-side consumption path.

### Serving Status And Drift

`node .opencode/bin/compiled-route-status.cjs --hub sk-prompt` reports `sk-prompt`'s current serving posture as one stable JSON record with a `causeCode`: `compiled-serving` when the flag permits, the manifest authorizes, and the engine actually routes; `flag-off` or `legacy-authority` when the manifest is ready but the flag or manifest authority withholds it (expected drift, not breakage); `missing-manifest` when no promoted manifest exists; `engine-throw` when the flag and manifest both authorize compiled serving but the engine itself fails (a genuine break, distinct from expected drift). See [`feature-flag-governance.md`](../../../system-spec-kit/feature-catalog/governance/feature-flag-governance.md) for the `SPECKIT_COMPILED_ROUTING` flag-governance entry.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-prompt/SKILL.md` | Shared | Carries the default-on compiled-routing directive `sk-prompt` follows. |
| `.opencode/bin/compiled-route.cjs` | Script | Promoted CLI front door the directive shells out to. |
| `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs` | Shared | Tri-state flag parsing and the manifest serving-authority gate. |
| `.opencode/bin/lib/compiled-routing/010-live-activation/activation/sk-prompt/manifest.json` | Shared | `sk-prompt`'s promoted activation manifest (serving authority, shadow status, selected policy). |
| `.opencode/bin/compiled-route-status.cjs` | Script | Per-hub serving-status probe with a drift-vs-break `causeCode`. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/bin/compiled-routing-foundation.vitest.ts` | Automated test | Resolver, tri-state flag, and promoted-closure parity coverage. |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/compiled-routing-consumption.vitest.ts` | Automated test | Advisor-side attach/consume/invalidate coverage shared by every eligible hub. |

---

## 4. SOURCE METADATA

- Group: Compiled Routing And Legacy Fallback
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md`

Related references:
- [prompt-packet-routing.md](../prompt-packet-routing/prompt-packet-routing.md) — the registry-driven routing this directive resolves ahead of.
- [feature-flag-governance.md](../../../system-spec-kit/feature-catalog/governance/feature-flag-governance.md) — `SPECKIT_COMPILED_ROUTING` flag governance (phased defaults, eligibility, serving status, drift, kill-switch).
- [advisor-recommend.md](../../../system-skill-advisor/feature-catalog/mcp-surface/advisor-recommend.md) — how `advisor_recommend` attaches or omits `compiledRoute`.
