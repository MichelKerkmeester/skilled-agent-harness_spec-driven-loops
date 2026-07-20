---
title: "Two-Axis Registry-Driven Routing"
description: "How the sk-code hub dispatches a single advisor identity to a WORKFLOW mode plus zero-or-more read-only SURFACE evidence packets via mode-registry.json."
trigger_phrases:
  - "two-axis registry-driven routing"
  - "sk-code workflow and surface axis"
  - "mode-registry.json single source of truth"
  - "sk-code smart routing"
version: 1.0.0.0
---

# Two-Axis Registry-Driven Routing (sk-code)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The skill advisor routes every code-related prompt to the single identity `sk-code`; the hub itself then resolves which packet(s) actually run. Resolution reads `mode-registry.json` as the single source of truth rather than re-deriving the mapping in prose.

Every registry entry carries a discriminator of `workflowMode` (the public mode key), `packetKind` (`workflow` or `surface`), and `backendKind` (which backend runs it). This keeps the hub a declarative router: adding or changing a packet is a registry edit, not a routing-logic rewrite.

---

## 2. HOW IT WORKS

### Workflow Vs Surface Axis

The WORKFLOW axis is process: `quality` (`backendKind: surface-router`) and `code-review` (`backendKind: review-cache`) are modes that act. The SURFACE axis is read-only domain evidence: `code-webflow` and `code-opencode` (both `backendKind: evidence-base`) never act on their own — they are advisor-invisible (`routingClass: metadata`) and reached only when the hub bundles them alongside a workflow mode via `routerPolicy.outcomes.surfaceBundle`, workflow mode ordered first. A prompt such as "review my webflow animation for jank" resolves to the ordered bundle `[code-review, code-webflow]`.

### Registry-Driven, Not Keyed-Resource

`sk-code` is a simple intent-to-packet router, not a root `references/<key>/` resource router: root `references/` and `assets/` directories are intentionally absent at the hub level, and resource slicing lives inside the nested packets plus `shared/references/smart-routing.md`. Implement/debug/verify phase doctrine is consolidated once in `shared/references/workflow_*.md` and symlinked into each surface packet rather than duplicated per packet.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-code/SKILL.md` | Shared | States the routing contract, the workflow/surface discriminator, and the bundling rule. |
| `.opencode/skills/sk-code/mode-registry.json` | Shared | Declarative two-axis registry; single source of truth for `workflowMode`/`packetKind`/`backendKind`/`advisorRoutingContract` per packet. |
| `.opencode/skills/sk-code/hub-router.json` | Shared | Router signal and tie-break data consumed alongside the registry. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | Automated test | Structural hub conformance, including the invariant that hub `allowed-tools` equals the union of every registered mode's `toolSurface.allowed`. |

---

## 4. SOURCE METADATA

- Group: Two-Axis Registry-Driven Routing
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `two-axis-registry-driven-routing/two-axis-registry-driven-routing.md`

Related references:
- [compiled-routing-and-legacy-fallback.md](../compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md) — the opt-in compiled-routing layer that resolves ahead of this registry-driven routing when enabled.
