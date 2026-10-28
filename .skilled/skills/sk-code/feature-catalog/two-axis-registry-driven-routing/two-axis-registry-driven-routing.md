---
title: "Two-Axis Registry-Driven Routing"
description: "`mode-registry.json` lists the modes and their packets, discriminated by `workflowMode`, `packetKind`, and `backendKind`. The hub's `SKILL.md` section 2 names `hub-router.json` as the mode vocabulary and `ROUTER.md` as the leaf-set router."
trigger_phrases:
  - "two-axis registry-driven routing"
  - "sk-code workflow and surface axis"
  - "mode-registry mode and packet list"
  - "sk-code smart routing"
version: 1.0.4.1
---

# Two-Axis Registry-Driven Routing (sk-code)

## 1. OVERVIEW

The skill advisor routes every code-related prompt to the single identity `sk-code`; the hub itself then resolves which packet(s) actually run. Resolution reads `mode-registry.json` for the mode and packet list rather than re-deriving it in prose, and the routing authority is named once in the hub's `SKILL.md` section 2, where `hub-router.json` is the mode vocabulary and `ROUTER.md` is the leaf-set router.

Every registry entry carries a discriminator of `workflowMode` (the public mode key), `packetKind` (`workflow` or `surface`), and `backendKind` (which backend runs it). This keeps the hub a declarative router: adding or changing a packet is a registry edit, not a routing-logic rewrite.

---

## 2. HOW IT WORKS

### Workflow Vs Surface Axis

The WORKFLOW axis is process: `sk-code-quality` (`backendKind: surface-router`) and `sk-code-review` (`backendKind: review-cache`) are modes that act. The SURFACE axis is read-only domain evidence: `sk-code-ci` and `sk-code-skilled` (each `backendKind: evidence-base`) never act on their own — they are advisor-invisible (`routingClass: metadata`) and reached only when the hub bundles them alongside a workflow mode via `routerPolicy.outcomes.surfaceBundle`, workflow mode ordered first. A prompt such as "review my typescript module for jank" resolves to the ordered bundle `[sk-code-review, sk-code-skilled]`.

### Declared Surface Detection Order

Stack detection reads its order from data. A surface entry in `mode-registry.json` may carry a `surfaceDetection` block with a `label`, a `role` of `specific` or `fallback`, and path, file and content markers. A skill outside the hub that names `"family": "sk-code"` in its `graph-metadata.json` declares the same block as `surface_detection`, and it is always specific. Detection tries every specific surface first, then the one fallback, `sk-code-skilled` (SKILLED), then UNKNOWN. When a specific surface and SKILLED both match, the specific surface leads and SKILLED comes along as second evidence.

The registry compiler rejects a hub that does not declare exactly one fallback or that does not rank it last in `routerPolicy.tieBreak`. The compiled router carries the fallback in `routingModel.surfaceDetection`, so a `SKILLED` session hint never moves SKILLED ahead of another surface. `sk-code-ci` declares no block, because the hub bundles it from request vocabulary alone.

### Registry-Driven, Not Keyed-Resource

`sk-code` is a simple intent-to-packet router, not a root `references/<key>/` resource router: root `references/` and `assets/` directories are intentionally absent at the hub level, and resource slicing lives inside the nested packets plus root `ROUTER.md`. Implement/debug/verify phase doctrine is consolidated in `shared/references/workflow-implement.md`, `workflow-debug.md`, and `workflow-verify.md`, then symlinked into each surface packet rather than duplicated per packet.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/sk-code/SKILL.md` | Shared | States the routing contract, the workflow/surface discriminator, and the bundling rule. |
| `.skilled/skills/sk-code/ROUTER.md` | Shared | Owns stage-two intent/resource maps and the explicit hub-shared control allowlist. |
| `.skilled/skills/sk-code/mode-registry.json` | Shared | Declarative two-axis registry; lists each mode and packet with its `workflowMode`/`packetKind`/`backendKind`/`advisorRoutingContract`. |
| `.skilled/skills/sk-code/hub-router.json` | Shared | Router signal and tie-break data consumed alongside the registry. |
| `.skilled/skills/sk-code/shared/references/stack-detection.md` | Shared | The surface detection order and the `surfaceDetection` contract. |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs` | Compiler | Validates the declared surfaces and compiles the fallback into the routing model. |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs` | Compiled router | Applies a session surface hint, which never moves the fallback forward. |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs` | Replay | Detects surfaces from request text in the declared order. |
| `.opencode/plugins/system-skill-advisor.js` | Plugin | Detects the workspace surface in the declared order and sends it as the surface hint. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Automated test | Structural hub conformance, including the invariant that hub `allowed-tools` equals the union of every registered mode's `toolSurface.allowed`. |
| `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` | Automated test | A declared surface outranks SKILLED, SKILLED alone still routes, and the compiler rejects a misplaced or missing fallback. |
| `.skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts` | Automated test | The plugin hints an outside declared surface ahead of SKILLED and refuses SKILLED for a symlinked local skill. |

---

## 4. SOURCE METADATA

- Group: Two-Axis Registry-Driven Routing
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `two-axis-registry-driven-routing/two-axis-registry-driven-routing.md`

Related references:
- [compiled-routing-and-legacy-fallback.md](../compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md) — the opt-in compiled-routing layer that resolves ahead of this registry-driven routing when enabled.
