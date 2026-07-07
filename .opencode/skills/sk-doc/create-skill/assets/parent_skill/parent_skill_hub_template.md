---
title: Parent Skill Hub Template - Canonical Two-Axis Hub
description: Copy-paste template for a parent skill hub with a thin SKILL.md plus companion metadata over workflow and surface packets.
trigger_phrases:
  - "parent skill hub template"
  - "two-axis parent hub"
  - "mode registry routing"
  - "surface packet scaffold"
importance_tier: normal
contextType: general
version: 2.0.0.0
---

# Parent Skill Hub Template - Canonical Two-Axis Hub

Template for a **parent skill hub**: one advisor-routable identity with a thin `SKILL.md` plus companion metadata. The canonical live example is `sk-code`: the hub routes by `mode-registry.json`, declares routing behavior in `hub-router.json`, and keeps one `graph-metadata.json` identity for the whole family.

The core is always the same **2-tier shape**:

1. Hub tier: `SKILL.md`, `mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json`.
2. Packet tier: workflow packets and optional surface packets listed in one `modes[]` array.

Deep-loop-style runtime machinery is not the core shape. If a hub needs it, declare it under top-level `extensions` in `mode-registry.json`; do not create a third physical tier.

---

## 1. OVERVIEW

### When to Use This Template

Use for a family that must keep one public skill identity while routing to multiple packet contracts:

- Workflow packets for process/lifecycle modes such as implementation, review, verification, research, or audit.
- Surface packets for read-only domain evidence such as a platform, framework, runtime, or reference corpus.

For two or three near-identical procedures with no independent packet contracts, prefer one regular `SKILL.md` with mode subsections.

### The Hard Invariant

Exactly **one** `graph-metadata.json` per parent hub. Packet folders and shared resources carry none. The advisor sees the hub identity; the hub router selects packets.

### Canonical Example

Model the hub on `sk-code`:

- `SKILL.md` is thin and routes by mode.
- `mode-registry.json` is the packet registry and discriminator source.
- `hub-router.json` owns router policy, signals, vocabulary classes, and bundle outcomes.
- `description.json` is the advisor-facing summary.
- `graph-metadata.json` is the one skill-graph identity node.

---

## 2. TWO-AXIS MODEL

Every packet is one entry in `mode-registry.json > modes[]`. Use `packetKind` to choose the axis; do not create a separate surface array.

| Axis | `packetKind` | Purpose | Naming | Tool posture | Advisor routing |
|------|--------------|---------|--------|--------------|-----------------|
| Workflow | `workflow` | A process or lifecycle mode | `[hub-prefix]-[mode]` or existing packet name | Mutating or read-only per role | `lexical`, `alias-fold`, `metadata`, or `command-bridge` |
| Surface | `surface` | A domain evidence base | Hub-prefixed `[hub-prefix]-[surface]` | Read-only only | `metadata` |
| Transport | `transport` | Bridges to an external tool's CLI/MCP surface (declared via `transport-axis`) | `[hub-prefix]-[mode]` | Read/Bash only; `mutatesWorkspace:false` (writes land externally); forbids Write/Edit/Task | `metadata` |

Surface packets have these required properties:

- `backendKind: "evidence-base"`.
- `toolSurface.mutatesWorkspace: false`.
- `toolSurface.allowed` is a subset of `Read`, `Bash`, `Grep`, and `Glob`.
- `toolSurface.forbidden` includes `Write`, `Edit`, and `Task`.
- `advisorRouting.routingClass: "metadata"` so the surface stays advisor-invisible.

---

## 3. REQUIRED COMPANION FILES

| Scope | File or directory | Required | Purpose |
|-------|-------------------|----------|---------|
| Hub | `SKILL.md` | Yes | Thin routing entry point; no packet-local logic |
| Hub | `mode-registry.json` | Yes | Single packet array with `packetKind`, `toolSurface`, and `advisorRouting` |
| Hub | `hub-router.json` | Yes | Router policy, tie-breaks, outcomes, signals, vocabulary classes |
| Hub | `description.json` | Yes | Advisor-facing hub description and triggers |
| Hub | `graph-metadata.json` | Yes | One skill-graph identity node for the whole hub |
| Hub | `changelog/` | Yes | Real changelog files for the hub |
| Hub | `manual_testing_playbook/` | Yes | Baseline manual validation package |
| Hub | `benchmark/` | Yes | Baseline benchmark or evidence package |
| Workflow packet | `SKILL.md` | Yes | Self-contained workflow contract |
| Workflow packet | `README.md` | Yes | Human orientation for the packet |
| Workflow packet | `changelog/` | Yes | Real changelog files for the packet |
| Surface packet | `SKILL.md` | Yes | Read-only evidence-base contract |
| Surface packet | `README.md` | Yes | Human orientation for the evidence base |
| Surface packet | `references/` | Yes | Read-only source material |
| Surface packet | `assets/` | Yes | Read-only reusable snippets or examples |
| Surface packet | `changelog/` | Yes | Real changelog files for the packet |

---

## 4. HUB FRONTMATTER

```yaml
---
name: [parent-skill-name]
description: "[Unified skill: routes [workflow-count] workflow packet(s) and [surface-count] surface packet(s) through mode-registry.json; holds no packet-local logic.]"
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.0.0
---
```

- `name` must match the hub folder name.
- `description` names routing, the registry, and the no-packet-logic invariant.
- `allowed-tools` is the union required by workflow modes; read-only surfaces do not justify mutating tools.
- `version` is four-part `X.Y.Z.W`.

---

## 5. COPY-PASTE HUB SCAFFOLD

Copy the block below into the hub `SKILL.md` and fill every `[bracketed]` placeholder.

```markdown
---
name: [parent-skill-name]
description: "[Unified skill that routes workflow and surface packets through mode-registry.json; holds no packet-local logic.]"
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.0.0
---

<!-- Keywords: [parent-skill-name], mode-registry, hub-router, workflowMode, packetKind, [workflow-mode-a], [surface-name], [domain keywords] -->

# [Parent Skill Title]

[One sentence: one public skill identity, [workflow-count] workflow packet(s), and [surface-count] optional surface evidence packet(s).] This hub holds no packet-local logic. It routes by `workflowMode` through `mode-registry.json` and uses `hub-router.json` for router policy, signals, and bundle outcomes.

---

## 1. WHEN TO USE

Use this skill when the request belongs to the [family/domain] family and should route to one of these packets:

| Packet | Kind | Use it for | Tool posture |
|--------|------|------------|--------------|
| `[workflow-mode-a]` | workflow | [process outcome] | [mutating/read-only] |
| `[workflow-mode-b]` | workflow | [process outcome] | [mutating/read-only] |
| `[surface-name]` | surface | [read-only evidence domain] | read-only evidence-base |

### When NOT to Use

- Requests outside [family/domain].
- Direct runtime/backend maintenance unless that is an explicit workflow packet.
- Mutating work inside a surface packet; surfaces are read-only evidence bases.

---

## 2. SMART ROUTING

Routing is registry-driven. `mode-registry.json` lists every workflow and surface packet in one `modes[]` array. `hub-router.json` decides whether the result is a single mode, ordered workflow bundle, defer response, or surface bundle.

### Two-Axis Model

- `packetKind: "workflow"` means a process/lifecycle packet.
- `packetKind: "surface"` means a read-only evidence-base packet.
- Surface packets use `backendKind: "evidence-base"`, `routingClass: "metadata"`, and `mutatesWorkspace: false`.
- There is no separate surface array; consumers derive packet roots and vocabulary ownership from `modes[]`.

### Routing Rule

```text
read hub-router.json
  -> score routerSignals and vocabularyClasses
  -> apply routerPolicy.tieBreak, workflow modes first then surfaces
  -> read mode-registry.json for packetKind, backendKind, toolSurface, and advisorRouting
  -> load the selected packet(s)
```

### Outcomes

- `single`: one dominant workflow mode.
- `orderedBundle`: multiple workflow modes, ordered by policy.
- `surfaceBundle`: one workflow primary plus zero or more read-only surface evidence packets.
- `defer`: unclear or contradictory intent asks for disambiguation.

---

## 3. HOW IT WORKS

### Layout

```text
[parent-skill-name]/
  SKILL.md
  mode-registry.json
  hub-router.json
  description.json
  graph-metadata.json
  changelog/
  manual_testing_playbook/
  benchmark/
  [workflow-packet-a]/
    SKILL.md
    README.md
    changelog/
  [surface-name]/
    SKILL.md
    README.md
    references/
    assets/
    changelog/
```

### Companion Metadata

- `mode-registry.json` owns `workflowMode`, `packetKind`, `backendKind`, `toolSurface`, packet folder identity, alias phrases, and `advisorRouting`.
- `hub-router.json` owns `routerPolicy`, `routerSignals`, `vocabularyClasses`, and bundle rules.
- `description.json` owns advisor-facing summary fields and optional hub-specific arrays.
- `graph-metadata.json` owns the one skill-graph identity node.

### Optional Extensions

Use top-level `extensions` in `mode-registry.json` only when the hub needs extra machinery:

- `runtime-loop`: activates per-mode `runtimeLoopType` and convergence backend fields.
- `advisor-projection`: declares the drift-guard path for lexical or alias-fold routes.
- `transform-verbs`: declares verb-transform routing for design-like hubs.
- `deprecated-modes`: documents retired modes kept as shims.
- `surface-axis`: declares that the hub includes `packetKind: "surface"` packets.

These extensions activate in-place fields. They do not move `advisorRouting` data and do not create a third physical tier.

---

## 4. RULES

### ALWAYS

- Resolve packets through `mode-registry.json`; never hardcode packet roots in prose-only logic.
- Keep `SKILL.md` thin: routing, invariants, and navigation only.
- Keep every packet in `modes[]` and give every packet a `packetKind`.
- Keep surfaces read-only with `backendKind: "evidence-base"` and `routingClass: "metadata"`.
- Keep exactly one `graph-metadata.json`, at the hub root.
- Keep `hub-router.json` signal keys and registry `workflowMode` values bidirectionally aligned.

### NEVER

- Never add `surfacePackets[]` or any second packet array.
- Never put mutating tools on a surface packet.
- Never add packet-local `graph-metadata.json` files.
- Never infer extension-only fields from `workflowMode`; declare the extension and field explicitly.
- Never move `advisorRouting` fields away from mode entries.

### ESCALATE IF

- A packet cannot be classified as `workflow` or `surface`.
- A surface needs mutation; it is no longer a surface evidence base.
- A lexical or alias-fold route lacks a drift guard.
- Router signals, vocabulary classes, and registry modes cannot be made bidirectionally consistent.

---

## 5. REFERENCES

- Registry: `mode-registry.json`.
- Router: `hub-router.json`.
- Advisor description: `description.json`.
- Skill graph identity: `graph-metadata.json`.
- Workflow packets: `[workflow-packet-a]/SKILL.md`, `[workflow-packet-b]/SKILL.md`.
- Surface packets: `[surface-name]/SKILL.md`, `[surface-name]/references/`, `[surface-name]/assets/`.
```

---

## 6. CHECKLIST

Before claiming the hub complete:

- [ ] Hub `SKILL.md` is thin and contains no packet-local workflow or surface logic.
- [ ] `mode-registry.json` has one `modes[]` array with `packetKind` on every entry.
- [ ] Every mode has `toolSurface` and `grandfatheredFolderMismatch`.
- [ ] Every surface is read-only, `backendKind: "evidence-base"`, and `routingClass: "metadata"`.
- [ ] `hub-router.json` has base outcomes (`single`, `orderedBundle`, `defer`) — plus `surfaceBundle` iff surface packets exist — workflow-first `tieBreak`, bidirectional mode keys, and defined vocabulary classes.
- [ ] `description.json` has the required advisor-facing fields and a four-part version.
- [ ] `graph-metadata.json` is the only advisor identity node for the hub.
- [ ] Changelog directories use real files, not symlinks.

---

## 7. RELATED RESOURCES

- `parent_skill_registry_template.json` - companion `mode-registry.json` scaffold.
- `parent_skill_hub_router_template.json` - companion `hub-router.json` scaffold.
- `parent_skill_description_template.json` - companion `description.json` scaffold.
- `parent_skill_graph_metadata_template.json` - companion `graph-metadata.json` scaffold.
- `skill_md_template.md` - packet-level `SKILL.md` template.
- Canonical example: `sk-code` hub metadata files.
