---
title: Parent Skills with Nested Mode Packets
description: Canonical parent-hub method for one advisor-routable hub with workflow and surface packets declared in a single modes array.
trigger_phrases:
  - "parent skill nested packets"
  - "parent hub mode registry"
  - "mode packet packetKind"
  - "hub router schema"
  - "surface packet workflow packet"
importance_tier: normal
contextType: implementation
version: 2.0.0.0
---

# Parent Skills with Nested Mode Packets

A parent hub is one advisor-routable skill identity that dispatches to self-contained packets. The canonical method is a thin hub, a single `modes[]` registry containing both workflow and surface packets, required hub-router metadata, and optional named extensions.

---

## 1. Overview And Canonical Method

Use this pattern when a skill family needs multiple independently documented packets under one public advisor identity. The hub stays routing-only; packets own the detailed workflow, evidence, examples, tool boundaries, and validation.

The method has one physical shape:

```text
parent-hub/
  SKILL.md
  mode-registry.json
  hub-router.json
  description.json
  graph-metadata.json
  changelog/
  manual_testing_playbook/
  benchmark/
  <workflow-packet>/
    SKILL.md
    README.md
    changelog/
  <surface-packet>/
    SKILL.md
    README.md
    references/
    assets/
    changelog/
```

Core rules:

- **Two-tier core**: one hub directory plus nested packets. Do not add an intermediate tier for backend families, runtime loops, or surface groups.
- **One mode array**: every packet is one entry in `mode-registry.json > modes[]`; do not add a second array such as `surfacePackets[]`.
- **Two-axis modes**: every mode entry declares `packetKind: "workflow" | "surface"`.
- **Workflow packets**: process or lifecycle modes such as implement, quality, review, research, or audit. They may mutate or stay read-only according to their role.
- **Surface packets**: read-only evidence bases such as webflow, opencode, or animation. They are advisor-invisible and enrich a workflow rather than becoming advisor identities.
- **One graph identity**: only the hub has `graph-metadata.json`; packets never carry their own advisor identity.
- **Required router**: every hub has `hub-router.json` with `routerPolicy`, `routerSignals`, `vocabularyClasses`, and resource paths that resolve on disk.
- **Named extensions only**: optional behavior is declared in top-level `extensions`; it never changes the physical layout.

Required fields for every `modes[]` entry:

- `workflowMode`: stable public hub/mode key.
- `packetKind`: `workflow` or `surface`.
- `backendKind`: workflow backend kind or `evidence-base` for surface packets.
- `toolSurface`: allowed tools, forbidden tools, mutation flag, and bash allowlist.
- `packet`: packet folder name.
- `packetSkillName`: packet `SKILL.md` name.
- `grandfatheredFolderMismatch`: `false` unless preserving an existing folder/name mismatch.
- `aliases`: natural-language mode phrases, unique across modes.
- `advisorRouting`: routing class and packet identity.

Surface packet constraints:

- `packetKind` is `surface`.
- `backendKind` is `evidence-base`.
- `toolSurface.mutatesWorkspace` is `false`.
- `toolSurface.allowed` is limited to read/search commands.
- `toolSurface.forbidden` includes write, edit, and task dispatch tools.
- `advisorRouting.routingClass` is `metadata`; the hub remains the single advisor identity.

---

## 2. Registry And Router Contract

`mode-registry.json` is the packet source of truth. Routers and validators read it instead of rediscovering packets from directories.

Top-level registry fields:

- `skill`: hub id.
- `version`: four-part version for hubs that ship releases.
- `description`: concise registry purpose.
- `discriminator`: documentation for `workflowMode`, `packetKind`, `backendKind`, and any extension-activated field.
- `advisorRoutingContract`: how modes project through the single hub identity.
- `modes[]`: all workflow and surface packets.
- `extensions`: optional declaration-only extension map.

`advisorRouting.routingClass` values:

| routingClass | Use | Advisor map entry |
| --- | --- | --- |
| `lexical` | Weighted advisor scoring plus projection maps. | Yes |
| `alias-fold` | Alias projection into an existing advisor id. | Yes |
| `metadata` | Resolved by hub membership. Default for new hubs and all surfaces. | No |
| `command-bridge` | Routed by command surface rather than advisor scoring. | No |

`hub-router.json` is required for every hub. It declares:

- `routerPolicy.defaultMode`, `ambiguityDelta`, `defaultResource`, and `tieBreak`.
- `routerPolicy.outcomes.single`, `orderedBundle`, `defer`, and `surfaceBundle`.
- Optional `routerPolicy.bundleRules[]` for declarative multi-mode bundles.
- `routerSignals` keyed by every `workflowMode` in the registry, including surfaces.
- `vocabularyClasses` referenced by router signals.
- Hub-root-relative `resources[]` paths that resolve on disk.

Tie-break order lists workflow modes first and surface packets after them. `surfaceBundle` means one primary workflow mode plus zero or more surface packets, with the workflow ordered first.

---

## 3. Named Extensions

Extensions declare extra semantics in place. They do not create extra directory tiers or move fields away from their current registry locations.

| Extension | Activates | Use when |
| --- | --- | --- |
| `surface-axis` | `packetKind: "surface"` entries and `surfaceBundle` routing. | The hub has read-only evidence packets attached to workflow modes. |
| `runtime-loop` | Per-mode `runtimeLoopType` plus convergence backend. | Modes run through a loop runtime with explicit loop types. |
| `advisor-projection` | Drift guard path for lexical or alias-fold projection maps. | Any mode has `routingClass: "lexical"` or `routingClass: "alias-fold"`. |
| `transform-verbs` | Verb routing that changes target mode by wording frame. | The hub routes phrases such as applying a transformation versus auditing whether it should happen. |
| `deprecated-modes` | Retired modes kept as redirects or shims. | A public mode remains as replacement guidance without active packet routing. |

A hub with no extensions is the pure two-tier core. Add only the extension needed for real routing semantics.

---

## 4. Three Hubs Extension Matrix

| Hub | Packet axis | Runtime loop | Advisor projection | Transform verbs | Deprecated modes | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `sk-code` | Declares the surface axis in the canonical model: workflow modes resolve code lifecycle steps and surface packets provide read-only evidence such as Webflow, OpenCode, and animation. | No runtime-loop extension; workflows are direct code modes, not convergence loops. | None for modes in the live registry; each mode uses `metadata` and the advisor routes the single `sk-code` identity. | None. | None. | Canonical live example for `mode-registry.json` plus `hub-router.json`; router vocabulary currently includes surface signal classes inside workflow modes. |
| `sk-design` | Workflow-only design modes in the live registry; no surface packets are required for its current shape. | No runtime-loop extension; four guidance modes use a shared reference base and the extraction mode runs its own backend. | None; all modes use `metadata` under the single `sk-design` identity. | Declares transform-verb semantics: phrasing decides whether a mode applies a visual move or audits whether it should happen. | None. | Transform-verbs example with five mode packets and required hub-router vocabulary. |
| `deep-loop-workflows` | Workflow-only active modes; no surface packets in the live registry. | Declares runtime-loop semantics for research, review, and council modes; improvement lanes use host or external adapters. | Required for lexical and alias-fold modes; hardcoded advisor projection maps stay drift-guarded against the registry. | None. | Declares deprecated standalone context routing as replacement guidance. | Extension-heavy example: runtime-loop, advisor-projection, and deprecated-modes semantics. |

Use the matrix to describe current hub behavior without copying one hub's special machinery into another. `runtimeLoopType` belongs only to hubs declaring `runtime-loop`; transform-verb routing belongs only to hubs declaring `transform-verbs`; surface evidence packets belong only to hubs declaring `surface-axis`.

---

## 5. Workflow Packet Vs Surface Packet

Choose a **workflow packet** when the new capability changes the process the assistant follows.

Add a workflow packet when:

- It has a distinct lifecycle, state model, verification gate, or output contract.
- It may need different tool permissions or mutation rules.
- The user intent should route to it as a primary mode.
- It changes the order of work, not just the evidence used during work.

Choose a **surface packet** when the new material is an evidence base for an existing workflow.

Add a surface packet when:

- It is read-only reference material for a domain, stack, platform, or runtime.
- A workflow mode remains primary and the surface is loaded as supporting context.
- The packet should be advisor-invisible under the hub's single identity.
- It needs its own references or assets but not a new lifecycle.

Examples:

- A new code review process is a workflow packet.
- A new frontend platform evidence base is a surface packet used by implement, quality, debug, verify, or review.
- A new iterative convergence loop is a workflow packet plus `runtime-loop` extension, not a surface.
- A new design phrase family such as applying versus auditing a visual move is a `transform-verbs` extension, not a surface packet by itself.

If the request needs both, register the workflow first and attach surfaces through `surfaceBundle` or bundle rules. Do not create a surface packet merely to organize text that could live under an existing workflow packet.

---

## 6. Changelog And Naming Policies

Changelog policy:

- Keep real changelog files at both hub and packet level.
- Do not use symlinks for changelogs.
- Do not point packet changelogs at hub changelogs or vice versa.
- Each hub and each packet owns the release notes readers need at that location.

Naming policy:

- Workflow packet folders use the hub's naming convention. Prefix workflow packets when the hub family uses a prefix; otherwise use the established packet name.
- Surface packet folders are bare nouns such as `webflow`, `opencode`, or `animation`.
- `folder == packetSkillName` is the default for every new packet.
- `grandfatheredFolderMismatch: true` is only for an existing mismatch that must be preserved.
- Never create a new mismatch for convenience.
- Keep natural-language `aliases[]` unique across all modes.
- Name vocabulary classes by owner, such as `<surface>-aliases`, `<surface>-runtime`, or `<mode>-aliases`.

Companion file policy:

- Every hub has `SKILL.md`, `mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json`, `changelog/`, `manual_testing_playbook/`, and `benchmark/`.
- Every packet has `README.md`, `SKILL.md`, and `changelog/`.
- Surface packets also carry `references/` and `assets/` when they need evidence material.
- Shared directories may hold cross-packet vocabulary or synthesis, but never per-mode workflow logic and never their own `graph-metadata.json`.

---

## 7. Related Resources

- [parent_hub_router_schema.md](./parent_hub_router_schema.md) - published router and registry schema details for parent hubs.
- [skill_creation.md](../skill_creation.md) - skill-creation index and route map.
- [overview.md](./overview.md) - skill anatomy and layered structure.
- [creation_workflow.md](./creation_workflow.md) - ordered creation workflow.
- [validation_and_packaging.md](./validation_and_packaging.md) - validation and packaging gates.
- [parent_skill_hub_template.md](../../assets/skill/parent_skill_hub_template.md) - routing-only hub template.
- [parent_skill_registry_template.json](../../assets/skill/parent_skill_registry_template.json) - registry scaffold.
