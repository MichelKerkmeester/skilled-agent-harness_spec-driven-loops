---
title: Brand-vs-Product Operating Register
description: The operating register for measured design references. Declare whether a captured surface IS the product or SERVES it, then read the six downstream dials that decision sets.
trigger_phrases:
  - "brand vs product register"
  - "design operating register"
  - "design is the product"
  - "design serves the product"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Brand-vs-Product Operating Register

The first thing to read off a surface, before color, type, layout, or motion: is this a Brand surface or a Product surface? That one call sets six downstream dials. Missing it is the most common reason a Style Reference flattens to a generic default.

---

## 1. OVERVIEW

### Purpose

Give a measured extraction one shared, up-front reading that calibrates how the rest of the surface is interpreted. "Brand" and "Product" are not styles, they are operating postures. Naming the posture once lets the six dials inherit it, so a landing page and an admin dashboard are never read against the same defaults by accident.

### Usage

Read the register from the surface being extracted, before recording tokens, components, or motion. This skill **records** the register the captured surface already expresses; it never authors a register from a brief. The register is shared vocabulary, not a mode.

---

## 2. THE REGISTER DECISION

A surface takes one of two postures:

- **Brand (design IS the product).** Marketing sites, landing pages, campaigns, long-form content, portfolios. The design is the thing being consumed, so expression, identity and a memorable moment are the job.
- **Product (design SERVES the product).** App UI, admin, dashboards, tools, settings, forms. The design carries the user to a task, so clarity, density and consistency are the job.

### How to read it (first match wins)

1. **Task cue.** Words like "landing page", "campaign" and "portfolio" point to Brand. Words like "dashboard", "admin", "settings" and "tool" point to Product.
2. **Surface in focus.** The actual page, route, or file being captured, even inside a mixed app. A marketing page inside a product app is still Brand.
3. **Declared register.** A `register` field in the project's PRODUCT.md or DESIGN.md, when present, is authoritative.

A mixed product has both postures: the marketing surface is Brand, the app shell is Product. Read the register per surface, not per project.

---

## 3. THE SIX DIALS

The register sets these six. When the surface is unlabeled and internal, Product is the safer read. Brand is the read only when the surface is clearly the thing being sold.

| Dial | Brand (design IS the product) | Product (design SERVES the product) |
|---|---|---|
| **Density** | Generous and expressive, with room for one big move | Information-dense and efficient, whitespace earns its place |
| **Motion budget** | Motion is voice: one well-rehearsed entrance beats scattered reveals, with scroll motion reserved for moments that earn it | 150 to 250 ms state transitions only, no page-load choreography, motion conveys feedback, reveal, loading and view changes |
| **Color dosage** | Palette is voice: Committed, Full, or Drenched strategies may exceed the 10% accent rule | Semantic-first and almost always Restrained, accent reserved for primary action, selection and state, never decoration |
| **Copy register** | Expressive and voice-led, the words carry identity | Plain, functional and consistent, one copy register across every screen |
| **Anti-slop strictness** | Reject the brand defaults: cream or sand body background, an eyebrow above every section, numbered section scaffolding, over-rounded cards | Reject the product defaults: low-contrast muted-gray text, color used as decoration, undifferentiated card grids |
| **Audit severity** | Weight distinctiveness and voice, a generic-but-functional brand surface is a real finding | Weight affordance, accessibility and consistency, an expressive-but-unclear product surface is a real finding |

### The color-strategy axis

Color dosage resolves to one of four strategies, ordered by how much color carries the surface:

- **Restrained**: tinted neutrals plus one accent at 10% or less. The Product default.
- **Committed**: one saturated color carries 30 to 60% of the surface. The Brand default for identity-driven pages.
- **Full palette**: three to four named color roles, each used deliberately. Brand campaigns and Product data visualization.
- **Drenched**: the surface itself is the color. Brand heroes and campaign pages only.

---

## 4. HOW THIS SKILL USES IT

This skill records the register of the surface it extracts, so a captured Style Reference carries the posture forward — a downstream implementer reads the register and knows whether the reference means expression or efficiency before touching a token.
