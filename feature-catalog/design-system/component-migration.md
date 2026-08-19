---
title: "Component Migration"
description: "Moves the app's ~55 hand-styled components onto the Phase 1 token library, one component group at a time, and registers each surface in a live catalog."
trigger_phrases:
  - "migrate a component to the design system"
  - "update the component library"
  - "move a surface onto the token library"
version: 1.0.0.0
---

# Component Migration (design-system)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Moves the app's ~55 hand-styled components onto the Phase 1 token library, one component group at a time, and registers each surface in a live catalog.

The design-system catalog is a standalone visual index of every migrated surface, fed by a registry and per-surface previews. Migration is deliberately incremental: each component group is independently shippable and verifiable, and every migrated surface reads semantic and per-surface component tokens instead of hard-coded values. No source palette value or security boundary changes as a result of the migration.

Current status: shipped.

---

## 2. HOW IT WORKS

### Per-component-group token adoption

Each hand-styled component group is migrated one at a time onto the semantic token library. The applied `@ds` inline-comment grammar marks per-surface component-token blocks, and these blocks resolve to semantic roles defined in `style.css`. Every migrated surface reads those tokens instead of hard-coded values, so styling stays consistent while each group ships and verifies independently.

### Honored design invariants

The Ink-on-parchment palette, Inter + Source Serif 4 type stack, and light + dark themes are preserved; no applied source palette value is changed during migration. WCAG AA contrast and a minimum 44px touch-target size are kept as targets, enforced by the applied palette across migrated surfaces. Clay and pastel fills are never used as the sole state signal.

### Catalog indexing and live registration

Each migrated surface is registered in the design-system catalog through a shared registry that maps surfaces to their per-surface preview renders. `Catalog.tsx` is the live shell that indexes every migrated surface, and `previews.tsx` renders each surface for visual reference. The `@ds` grammar provides per-state editable seams so individual component states can be adjusted without touching other surfaces.

### Unchanged security boundary

Migration touches only styling and registration; the read-only-by-default model, one-use revision-bound mutation tickets with fail-closed behavior, allowlist plus structural redaction, content-free push, and operator-only full-access all remain as shipped invariants, untouched by the component migration.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `apps/pi-remote-web/src/style.css` | Shared | Per-surface component-token blocks resolving to semantic roles |
| `apps/pi-remote-web/src/design-system/catalog/Catalog.tsx` | Component | Live catalog shell indexing every migrated surface |
| `apps/pi-remote-web/src/design-system/catalog/registry.ts` | Shared | Registry of catalog surfaces and their previews |
| `apps/pi-remote-web/src/design-system/catalog/previews.tsx` | Component | Per-surface catalog preview renders |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `apps/pi-remote-web/tests/contrast.test.tsx` | unit | Proves the applied palette across migrated surfaces stays WCAG-compliant (no dedicated catalog unit test) |

---

## 4. SOURCE METADATA

- Group: DESIGN SYSTEM
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `design-system/component-migration.md`
- Current status: shipped

Related references:

- [design-tokens.md](design-tokens.md) - The token library migrated surfaces read from