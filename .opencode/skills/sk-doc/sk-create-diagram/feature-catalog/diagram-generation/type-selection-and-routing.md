---
title: "Type selection and routing"
description: "Classifies each request into GENERATE, IMPORT, or EXPORT, then selects one of the 27 supported diagram types and loads the matching references/type-*.md convention before drawing."
trigger_phrases:
  - "Type selection and routing"
  - "diagram type selection guide"
  - "27 diagram types"
  - "create diagram"
  - "/create:diagram"
version: 1.0.0.0
---

# Type selection and routing (/create:diagram)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Classifies each request into GENERATE, IMPORT, or EXPORT, then selects one of the 27 supported diagram types and loads the matching `references/type-*.md` convention before drawing.

Every diagram request starts in the router: it decides what kind of work is being asked for and, for a generate request, which of the 27 type grammars fits. The type choice is the single most load-bearing decision — an architecture, flowchart, sequence, and swimlane each carry different layout conventions, per-type ceilings, and anti-patterns. The typical caller is the `/create:diagram` command or natural-language routing, and the main failure mode is picking a type by vocabulary rather than by what the reader is being shown.

---

## 2. HOW IT WORKS

### Request shape routing

The router detects the request shape from source extensions and intent vocabulary. Generate requests match type vocabulary plus "diagram" with no file source; import requests match a `.drawio`, `.mmd`, or `.mermaid` path or extension; export requests match `export`, `png`, `svg`, `rasterize`, or "save as". Each intent scores keyword hits, the top-scoring intent wins, and when the top two scores sit within an ambiguity delta of 1 both are returned so the caller can resolve the near-tie. A request with no recognized signal falls back to a disambiguation checklist asking for the request shape, target path, style-guide status, and verification expectations.

### Type selection

For generate requests the selection guide maps what is being shown to a diagram type — components plus connections in a system maps to Architecture, decision logic with branches to Flowchart, time-ordered messages between actors to Sequence, entities plus fields to ER/data model, cross-functional handoffs to Swimlane, and so on across all 27 types. The rules of thumb are stable: if a 3-column table communicates the same thing, pick the table; if two types both fit, pick the dominant axis rather than hybridizing grammars; if the request is past the complexity budget, split into an overview plus detail.

### Resource loading

The router loads `references/style-guide.md` on every diagram and loads the matching `references/type-*.md` conditionally for generate requests, the import or export reference for those shapes, and primitives and assets only on demand. Every path is guarded and loaded only if it exists, so a missing reference simply does not load and the route falls back to the nearest guidance already loaded.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `SKILL.md` (Smart Routing + selection guide) | Handler | Request-shape classification, 27-type selection guide, resource loading levels, and the routing pseudocode |
| `references/type-*.md` (27 files) | Shared | Per-type layout conventions, per-type ceilings, and anti-patterns loaded conditionally for generate requests |
| `.opencode/commands/create/assets/create-diagram-auto.yaml`, `create-diagram-confirm.yaml` | Shared | Workflow YAML that carries the generate/import/export detection steps executed by the `/create:diagram` router |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/diagram-generation/type-selection-and-routing.md` | Manual playbook | Scenario DIA-001 verifies request classification, selection-guide mapping, and that the matching type reference is loaded before drawing |
| `references/style-guide.md` | Reference | Anchor for the always-loaded design-system tokens that accompany the type reference |

---

## 4. SOURCE METADATA

- Group: DIAGRAM GENERATION
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `diagram-generation/type-selection-and-routing.md`

Related references:
- [editorial-style-and-connectors.md](editorial-style-and-connectors.md) — the design system and connector rules applied once a type is selected
- [onboarding-flow.md](onboarding-flow.md) — the style-guide gate that precedes the first diagram in a project
