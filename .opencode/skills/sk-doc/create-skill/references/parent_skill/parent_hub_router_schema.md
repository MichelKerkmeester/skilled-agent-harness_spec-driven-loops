---
title: Parent Hub Router Schema
description: Schema reference for hub-router.json, the routing brain used by thin parent hubs to select workflow modes and surface evidence bundles.
trigger_phrases:
  - "parent hub router schema"
  - "hub-router json contract"
  - "surface bundle outcome"
  - "router signals registry parity"
  - "vocabulary class ownership"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Parent Hub Router Schema

Schema reference for `hub-router.json`, the routing brain a thin parent hub uses to pick one mode or bundle compatible modes.

---

## 1. OVERVIEW

`hub-router.json` is the declarative route table for parent skills. The hub `SKILL.md` stays thin: it reads the router policy, scores request language against vocabulary classes, and resolves the selected mode list to packet resources.

**Core Principle**: One hub identity, one registry mode set, one router file that explains how requests become workflow modes plus optional surface evidence.

**Worked example**: `sk-code` publishes two workflow modes in `mode-registry.json` — `quality` and `code-review` — plus two surface packets, `code-webflow` and `code-opencode`. Every mode, workflow or surface, is an ordinary registry mode with an ordinary router signal entry; the surface packets carry `packetKind: surface`. `sk-code` is *surface-primary*: it declares no default workflow, so a request that names only a surface defers rather than assuming a process.

**Consumer inventory**:
- `/deep:skill-benchmark` router-replay reads `projectHubRouter` to replay parent-hub routing decisions.
- `parent-hub-vocab-sync` reads vocabulary ownership so aliases stay attached to the owning mode or surface.
- `parent-skill-check` check 5 validates router conformance against the registry, class vocabulary, and on-disk resources.

---

## 2. FILE SHAPE

`hub-router.json` has four top-level fields:

```json
{
  "skill": "sk-code",
  "version": "1.0.0",
  "routerPolicy": {},
  "routerSignals": {},
  "vocabularyClasses": {}
}
```

| Field | Required | Purpose |
| --- | --- | --- |
| `skill` | Yes | Parent hub id; usually the containing skill folder name. |
| `version` | Yes | Router schema or artifact version for the hub. |
| `routerPolicy` | Yes | Global routing defaults, tie-breaks, outcomes, and optional bundle rules. |
| `routerSignals` | Yes | Per-mode scoring weights, vocabulary class references, and loadable resources. |
| `vocabularyClasses` | Yes | Keyword classes referenced by `routerSignals`. |

---

## 3. ROUTER POLICY

`routerPolicy` controls how the hub turns scored signals into one of the supported outcomes.

```json
{
  "routerPolicy": {
    "defaultMode": null,
    "ambiguityDelta": 1,
    "tieBreak": ["quality", "code-review", "code-webflow", "code-opencode"],
    "outcomes": {
      "single": "one dominant intent routes to one mode",
      "orderedBundle": "multiple workflow intents route to an ordered mode list",
      "defer": "unclear or contradictory intent asks for disambiguation",
      "surfaceBundle": "one workflow mode primary plus zero-or-more surface packets as evidence, workflow ordered first"
    },
    "defaultResource": ["shared/README.md"]
  }
}
```

### Required fields

| Field | Rule |
| --- | --- |
| `defaultMode` | A real registry `workflowMode`, or `null` for a *surface-primary* hub with no default workflow. `sk-code` sets `null`: a request naming only a surface (no process word) defers instead of assuming a workflow. |
| `ambiguityDelta` | Integer threshold for bundling near-tied scores instead of forcing a single winner. |
| `tieBreak` | Must list every registry mode exactly once, with workflow modes first and surface packets after them. |
| `outcomes` | Must include the three base outcomes `single`, `orderedBundle`, and `defer`. `surfaceBundle` is required **only** for a hub that declares the `surface-axis` extension (has ≥1 surface packet); a workflow-only hub omits it. |
| `defaultResource` | Array of hub-root-relative, packet-qualified paths to load when no more specific resource wins. |

### Tie-break order

Workflow modes always sort before surface packets. For `sk-code`, the workflow order is:

| Order | Mode | Kind |
| ---: | --- | --- |
| 1 | `quality` | Workflow |
| 2 | `code-review` | Workflow |

The surface packets `code-webflow` and `code-opencode` sort after every workflow mode. This keeps process selection primary and surface evidence secondary.

### Outcomes

| Outcome | Meaning |
| --- | --- |
| `single` | One dominant mode wins outside the ambiguity threshold. |
| `orderedBundle` | Multiple workflow modes are clearly requested and should run in tie-break order. |
| `defer` | The request is unclear, contradictory, or below routing confidence. |
| `surfaceBundle` | One workflow mode is primary, with zero-or-more surface packets attached as evidence. |

`surfaceBundle` is the two-axis outcome. It prevents surface vocabulary such as `code-webflow` or `code-opencode` from stealing the route from a process word such as `code-review` or `quality`.

### Optional `bundleRules[]`

`bundleRules[]` lets a hub encode prose bundle rules declaratively. Each rule must reference real registry modes only. `sk-code` currently ships none — its two-axis routing rides the `surfaceBundle` outcome and the tie-break order — but the shape below shows how a hub would encode one; every referenced mode must exist in the registry and on disk.

```json
{
  "bundleRules": [
    {
      "name": "review-with-surface-evidence",
      "whenPrimary": "code-review",
      "includeSurfaces": ["code-webflow", "code-opencode"],
      "outcome": "surfaceBundle"
    },
    {
      "name": "quality-then-review",
      "whenAll": ["quality", "code-review"],
      "outcome": "orderedBundle"
    }
  ]
}
```

Use `bundleRules[]` when a hub has a durable prose rule such as "if the request asks for review plus a supported surface, route the workflow first and attach the surface evidence packets." The JSON rule is the machine-readable version of that prose; the prose remains useful for humans, but the validator can enforce the referenced modes.

---

## 4. ROUTER SIGNALS

`routerSignals` is keyed by mode. Every key maps to a scoring weight, vocabulary classes, and resources. The `code-review` entry below reflects the `sk-code` workflow packet; the `code-webflow` entry shows the same shape for a surface packet. These are illustrative shapes, not live snapshots — consult the hub's own `hub-router.json` for current weights and vocabulary classes.

```json
{
  "routerSignals": {
    "code-review": {
      "weight": 4,
      "classes": ["code-review-aliases", "code-review-findings", "code-review-security", "code-review-pr", "hub-identity"],
      "resources": ["code-review/SKILL.md"]
    },
    "code-webflow": {
      "weight": 3,
      "classes": ["code-webflow-aliases", "code-webflow-runtime"],
      "resources": ["code-webflow/SKILL.md"]
    }
  }
}
```

### Bidirectional registry rule

The `routerSignals` key set must match the registry `workflowMode` set bidirectionally:

```text
set(hub-router.routerSignals.keys) == set(mode-registry.modes[].workflowMode)
```

This is stricter than "every workflow has a signal." It also forbids orphan router entries that no registry mode can dispatch.

### Field rules

| Field | Rule |
| --- | --- |
| `weight` | Positive integer. Workflow modes often use higher weights than surfaces because process intent wins over evidence intent. |
| `classes` | Non-empty array of `vocabularyClasses` keys. Every referenced class must exist. |
| `resources` | Non-empty array of hub-root-relative, packet-qualified paths that resolve on disk. |

Surface packets get normal signal entries. They are not special side arrays, and they are not advisor-visible skill identities. They are modes whose `packetKind` is `surface`, whose resources are evidence, and whose router role is to enrich the primary workflow route.

---

## 5. VOCABULARY CLASSES

`vocabularyClasses` owns keyword groups. `routerSignals[].classes[]` references these groups by name.

```json
{
  "vocabularyClasses": {
    "code-review-aliases": {
      "keywords": ["review", "code review", "security review", "pr review"]
    },
    "code-webflow-aliases": {
      "keywords": ["webflow", "frontend", "browser", "cdn"]
    },
    "code-webflow-runtime": {
      "keywords": ["gsap", "lenis", "swiper", "browser test"]
    },
    "hub-identity": {
      "keywords": ["sk-code", "surface-aware", "smart-router"]
    }
  }
}
```

### Class integrity

- Every class referenced by `routerSignals` must exist in `vocabularyClasses`.
- Every class in `vocabularyClasses` should be referenced by at least one router signal.
- Keywords should be lowercase natural-language phrases, stack tokens, or stable file/resource terms that users actually type.
- Avoid duplicate keyword ownership when one class can own the phrase clearly.

### Ownership naming

Use owned class names rather than generic surface labels:

| Pattern | Owner | Example |
| --- | --- | --- |
| `<surface>-aliases` | Surface identity phrases | `code-webflow-aliases` |
| `<surface>-runtime` | Surface library/runtime evidence | `code-webflow-runtime` |
| `<mode>-aliases` | Workflow/process phrases | `code-review-aliases` |
| `hub-identity` | Parent hub identity and shared router vocabulary | `hub-identity` |

Retire ad-hoc names like `surface-webflow` into owned classes such as `code-webflow-aliases` and `code-webflow-runtime`. Owned names make vocabulary sync safer because each alias has a clear home.

---

## 6. SURFACE SIGNALS AND TWO-AXIS ROUTING

The router has two axes:

| Axis | Question | Examples |
| --- | --- | --- |
| Workflow | What process should run? | `quality`, `code-review` |
| Surface | Which evidence base should inform it? | `code-webflow`, `code-opencode` |

A request such as `review my webflow animation code` carries one workflow signal and one surface signal — Motion.dev animation is folded into the `code-webflow` surface, not a separate mode:

| Token | Matching class | Routed mode |
| --- | --- | --- |
| `review` | `code-review-aliases` | `code-review` |
| `webflow` | `code-webflow-aliases` | `code-webflow` |

The correct outcome is `surfaceBundle`:

```json
{
  "outcome": "surfaceBundle",
  "modes": ["code-review", "code-webflow"]
}
```

The workflow mode stays first because it determines the task contract. Surface modes follow because they provide evidence, constraints, libraries, and examples the workflow should consult.

---

## 7. SCORING MODEL

The router scoring model is intentionally simple and replayable.

### Weighted class-keyword matching

For each mode:

1. Read its `routerSignals[mode].classes`.
2. Expand those classes through `vocabularyClasses[class].keywords`.
3. Count matched keywords in the request.
4. Multiply or rank by the mode's `weight`.
5. Sort by score, then by `routerPolicy.tieBreak`.

### Ambiguity bundling

If the next-ranked mode is within `routerPolicy.ambiguityDelta` of the winner, the router may bundle rather than discard it.

| Near tie | Outcome |
| --- | --- |
| Workflow + workflow | `orderedBundle` when the request clearly asks for both processes. |
| Workflow + surface | `surfaceBundle` when one process should run with surface evidence attached. |
| Surface + surface with no workflow | Fall back to `defaultMode` when the hub sets one; a surface-primary hub with `defaultMode: null` (like `sk-code`) defers. |

### Tie-break ordering

`tieBreak` is the deterministic final sorter. It also encodes policy: workflow modes appear before surface packets, so a surface cannot outrank a workflow when both are selected for one bundle.

---

## 8. RESOURCE RULES

All resource paths must be hub-root-relative and packet-qualified.

| Good | Problem if omitted |
| --- | --- |
| `code-review/SKILL.md` | The router can load the selected packet contract directly. |
| `code-webflow/references/runtime.md` | Surface evidence stays under the owning surface packet. |
| `shared/README.md` | Default resources are clearly hub-level shared context. |

Avoid unqualified names like `SKILL.md` in router resources. A parent hub has multiple packet roots, so every resource must identify the packet or shared hub location that owns it.

### Path contract: hubLoadAddress vs leafResourceId

A hub carries two distinct path kinds. Conflating them is the defect this contract exists to prevent.

| Kind | Where it lives | Shape | Example |
| --- | --- | --- | --- |
| **hubLoadAddress** | `routerSignals[].resources` in this file | packet entrypoint the hub loads | `code-review/SKILL.md` |
| **leafResourceId** | the second-layer surface router (`shared/references/smart_routing.md`) | canonical packet-root-relative resource id | `references/validation.md` |

The hub router selects a **mode**; it emits packet pointers, not the per-intent leaf gold. The exact leaf resources an intent should load belong in the surface router, scaffolded from [`parent_skill_smart_routing_template.md`](../../assets/parent_skill/parent_skill_smart_routing_template.md).

A raw path in the surface router is converted to the canonical `(workflowMode, leafResourceId)` pair at **exactly one boundary** — the leaf-resource contract library — through one of two shapes only:
- a **packet-qualified** prefix: `[packet]/references|assets/…` resolves to the mode bound to that packet.
- an **authored shared alias**: a `shared/…` disk path listed in `leaf-aliases.json`.

Never strip a prefix generically, and never infer a shared-tier file into a mode. A hub that keeps its per-intent leaf sets only in this file, with no surface router, re-creates the handoff ambiguity.

---

## 9. CONFORMANCE

`parent-skill-check` check 5 is the enforcement point for `hub-router.json` validity.

It validates:
- `routerSignals` keys match `mode-registry.json > modes[].workflowMode` bidirectionally.
- `routerPolicy.tieBreak` covers every registry mode exactly once.
- `routerPolicy.outcomes` includes the base three `single`, `orderedBundle`, and `defer`; it includes `surfaceBundle` too **iff** the hub has surface packets (declares `surface-axis`).
- Every `bundleRules[]` reference points to a real registry mode.
- Every signal class exists in `vocabularyClasses`.
- Every router resource resolves on disk from the hub root.

Treat check 5 warnings as schema drift. The parent hub may still route during migration, but the published contract is the shape above.

---

## 10. RELATED RESOURCES

- [parent_skills_nested_packets.md](./parent_skills_nested_packets.md) - parent-skill pattern, single advisor identity, and registry routing contract.
- [parent_skill_hub_template.md](../../assets/parent_skill/parent_skill_hub_template.md) - routing-only hub `SKILL.md` scaffold.
- [parent_skill_registry_template.json](../../assets/parent_skill/parent_skill_registry_template.json) - mode registry scaffold for parent hubs.
