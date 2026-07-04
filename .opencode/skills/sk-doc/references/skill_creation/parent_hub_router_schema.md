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

**Worked example**: `sk-code` currently publishes five workflow modes in `mode-registry.json`: `implement`, `quality`, `debug`, `verify`, and `review`. The two-axis parent-hub contract extends that same shape with surface packets such as `webflow`, `opencode`, and `animation`; those surfaces become ordinary registry modes and ordinary router signal entries.

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
    "defaultMode": "implement",
    "ambiguityDelta": 1,
    "tieBreak": ["implement", "quality", "debug", "verify", "review", "webflow", "opencode", "animation"],
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
| `defaultMode` | Must be a real registry `workflowMode`. For `sk-code`, the default is `implement`. |
| `ambiguityDelta` | Integer threshold for bundling near-tied scores instead of forcing a single winner. |
| `tieBreak` | Must list every registry mode exactly once, with workflow modes first and surface packets after them. |
| `outcomes` | Must include `single`, `orderedBundle`, `defer`, and `surfaceBundle`. |
| `defaultResource` | Array of hub-root-relative, packet-qualified paths to load when no more specific resource wins. |

### Tie-break order

Workflow modes always sort before surface packets. For `sk-code`, the workflow order is:

| Order | Mode | Kind |
| ---: | --- | --- |
| 1 | `implement` | Workflow |
| 2 | `quality` | Workflow |
| 3 | `debug` | Workflow |
| 4 | `verify` | Workflow |
| 5 | `review` | Workflow |

When surfaces are present, append them after every workflow mode. This keeps process selection primary and surface evidence secondary.

### Outcomes

| Outcome | Meaning |
| --- | --- |
| `single` | One dominant mode wins outside the ambiguity threshold. |
| `orderedBundle` | Multiple workflow modes are clearly requested and should run in tie-break order. |
| `defer` | The request is unclear, contradictory, or below routing confidence. |
| `surfaceBundle` | One workflow mode is primary, with zero-or-more surface packets attached as evidence. |

`surfaceBundle` is the two-axis outcome. It prevents surface vocabulary such as `webflow` or `animation` from stealing the route from a process word such as `review`, `debug`, or `verify`.

### Optional `bundleRules[]`

`bundleRules[]` lets a hub encode prose bundle rules declaratively. Each rule must reference real registry modes only. The surface rule below is valid only after `webflow` and `animation` exist in the registry and on disk.

```json
{
  "bundleRules": [
    {
      "name": "review-with-surface-evidence",
      "whenPrimary": "review",
      "includeSurfaces": ["webflow", "animation"],
      "outcome": "surfaceBundle"
    },
    {
      "name": "implement-then-verify",
      "whenAll": ["implement", "verify"],
      "outcome": "orderedBundle"
    }
  ]
}
```

Use `bundleRules[]` when a hub has a durable prose rule such as "if the request asks for review plus a supported surface, route the workflow first and attach the surface evidence packets." The JSON rule is the machine-readable version of that prose; the prose remains useful for humans, but the validator can enforce the referenced modes.

---

## 4. ROUTER SIGNALS

`routerSignals` is keyed by mode. Every key maps to a scoring weight, vocabulary classes, and resources. The `review` entry below reflects the current `sk-code` workflow packet; the `webflow` entry shows the same shape for a surface packet once that packet exists.

```json
{
  "routerSignals": {
    "review": {
      "weight": 4,
      "classes": ["review-aliases", "review-findings", "review-security", "review-pr", "hub-identity"],
      "resources": ["code-review/SKILL.md"]
    },
    "webflow": {
      "weight": 3,
      "classes": ["webflow-aliases", "webflow-runtime"],
      "resources": ["webflow/SKILL.md"]
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
    "review-aliases": {
      "keywords": ["review", "code review", "security review", "pr review"]
    },
    "webflow-aliases": {
      "keywords": ["webflow", "frontend", "browser", "cdn"]
    },
    "webflow-runtime": {
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
| `<surface>-aliases` | Surface identity phrases | `webflow-aliases` |
| `<surface>-runtime` | Surface library/runtime evidence | `webflow-runtime` |
| `<mode>-aliases` | Workflow/process phrases | `review-aliases` |
| `hub-identity` | Parent hub identity and shared router vocabulary | `hub-identity` |

Retire ad-hoc names like `surface-webflow` into owned classes such as `webflow-aliases` and `webflow-runtime`. Owned names make vocabulary sync safer because each alias has a clear home.

---

## 6. SURFACE SIGNALS AND TWO-AXIS ROUTING

The router has two axes:

| Axis | Question | Examples |
| --- | --- | --- |
| Workflow | What process should run? | `implement`, `quality`, `debug`, `verify`, `review` |
| Surface | Which evidence base should inform it? | `webflow`, `opencode`, `animation` |

A request such as `review my webflow animation` carries one workflow signal and two surface signals:

| Token | Matching class | Routed mode |
| --- | --- | --- |
| `review` | `review-aliases` | `review` |
| `webflow` | `webflow-aliases` | `webflow` |
| `animation` | `animation-aliases` | `animation` |

The correct outcome is `surfaceBundle`:

```json
{
  "outcome": "surfaceBundle",
  "modes": ["review", "webflow", "animation"]
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
| Surface + surface with no workflow | `defer` or fall back to `defaultMode`, depending on the hub policy. |

### Tie-break ordering

`tieBreak` is the deterministic final sorter. It also encodes policy: workflow modes appear before surface packets, so a surface cannot outrank a workflow when both are selected for one bundle.

---

## 8. RESOURCE RULES

All resource paths must be hub-root-relative and packet-qualified.

| Good | Problem if omitted |
| --- | --- |
| `code-review/SKILL.md` | The router can load the selected packet contract directly. |
| `webflow/references/runtime.md` | Surface evidence stays under the owning surface packet once that packet exists. |
| `shared/README.md` | Default resources are clearly hub-level shared context. |

Avoid unqualified names like `SKILL.md` in router resources. A parent hub has multiple packet roots, so every resource must identify the packet or shared hub location that owns it.

---

## 9. CONFORMANCE

`parent-skill-check` check 5 is the enforcement point for `hub-router.json` validity.

It validates:
- `routerSignals` keys match `mode-registry.json > modes[].workflowMode` bidirectionally.
- `routerPolicy.tieBreak` covers every registry mode exactly once.
- `routerPolicy.outcomes` includes `surfaceBundle` alongside `single`, `orderedBundle`, and `defer`.
- Every `bundleRules[]` reference points to a real registry mode.
- Every signal class exists in `vocabularyClasses`.
- Every router resource resolves on disk from the hub root.

Treat check 5 warnings as schema drift. The parent hub may still route during migration, but the published contract is the shape above.

---

## 10. RELATED RESOURCES

- [parent_skills_nested_packets.md](./parent_skills_nested_packets.md) - parent-skill pattern, single advisor identity, and registry routing contract.
- [parent_skill_hub_template.md](../../assets/skill/parent_skill_hub_template.md) - routing-only hub `SKILL.md` scaffold.
- [parent_skill_registry_template.json](../../assets/skill/parent_skill_registry_template.json) - mode registry scaffold for parent hubs.
