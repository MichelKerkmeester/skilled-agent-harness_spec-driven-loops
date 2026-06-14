---
title: "Design Inventory (critique-against catalog)"
description: "An inventory of the common, expected answers in UI design (styles, palettes, font pairings, per-product recommendations) used to name the default for a brief so you can deviate from it deliberately."
trigger_phrases:
  - "design inventory critique against catalog"
  - "expected default ui look"
  - "ui style palette typography catalog"
  - "per product design recommendation"
  - "deviate from templated default"
importance_tier: normal
contextType: implementation
---

# Design Inventory (critique-against catalog)

An inventory of the common, expected answers in UI design: the styles, palettes, font pairings, and per-product recommendations that most interfaces converge on. Its job here is the opposite of a generator.

---

## 1. OVERVIEW

### Core Principle

`design_principles.md` says a design that reads as a templated default has failed. This catalog is how you find out what the default *is* for a given brief, so you can deviate from it deliberately. Read it as "what everyone else does," not "what to do."

### When to Use

- When you need to name the expected look for a product type or mood in one line.
- When critiquing a design plan against AI-default looks before writing code.
- When you want to make a justified move away from the convention rather than ship it.

### Key Sources

- Data sets live in [`../assets/data/`](../assets/data/), queryable via [`../scripts/design_search.py`](../scripts/design_search.py).
- Adopted from the MIT-licensed `ui-ux-pro-max` repo. See [`../THIRD-PARTY-NOTICES.md`](../THIRD-PARTY-NOTICES.md).
- All counts here are measured from the CSVs, not upstream marketing figures.
- When the data says luxury e-commerce points to glassmorphism plus premium-minimal plus Playfair and Inter, that is the cliche to subvert, not the answer to ship. Use it to name the expected look in one line, then make a justified move away from it.

---

## 2. HOW TO USE IT IN THE PROCESS

This catalog plugs into **STEP 2 (critique the plan against AI-default looks)** of the `design_principles.md` process:

1. Name the subject and brief (STEP 0-1).
2. Query the catalog for the expected pattern for that product type or mood.
3. Write one line: "the expected look here is X." That X is now a constraint to push against.
4. Take your one justified aesthetic risk *away* from X. Keep the quality floor (`ux_quality_reference.md`).

If a brief explicitly pins the direction, the brief wins (NEVER override a pinned brief), even if it asks for the expected look.

---

## 3. THE CATALOGS AND HOW EACH IS CRITIQUE-AGAINST FUEL

| Catalog | File | Rows | Read it as |
|---------|------|------|------------|
| UI styles | `styles.csv` | 84 | The named looks (Minimalism, Glassmorphism, Brutalism, and the rest) with their effects, best-for, and contraindications. The "Do Not Use For" and contraindication fields are often more useful than "Best For": they tell you where a popular style is wrong. |
| Color palettes | `colors.csv` | 160 | Full shadcn-style semantic token sets (primary, accent, muted, destructive, ring, plus foregrounds) with WCAG-pair notes. Use the **token schema and contrast discipline** directly (that is quality, not taste). Treat the specific palettes as common starting points to shift off. |
| Type pairings | `typography.csv` | 73 | Conventional heading and body pairings by mood (for example, Playfair plus Inter for "elegant or luxury"). These are the expected pairings. Knowing them is how you avoid reaching for the same one. |
| Product reasoning | `ui-reasoning.csv` | 161 | The per-product-type "recommended pattern, style priority, color and type mood, anti-patterns." This is the most dangerous file to take literally: its `Recommended_Pattern` and `Decision_Rules` are exactly the templated defaults. Mine its `Anti_Patterns` column (what to avoid) and treat `Recommended_Pattern` as the cliche to subvert. |
| Product patterns | `products.csv` | 161 | Per-product-type style, landing, dashboard, and palette-focus recommendations. Same rule: the expected answer, not the answer. |
| Landing patterns | `landing.csv` | 34 | Conventional section orders and CTA placements. Useful for knowing the default flow so a deliberate reorder reads as a choice, not an accident. |

---

## 4. HARD RULES FOR THIS CATALOG

- **NEVER wire this data into an auto-recommend or generator flow.** The upstream repo's design-system generator and its `--design-system` and `--persist` modes were deliberately not adopted, for exactly this reason. The search script is query-only.
- **NEVER present a catalog recommendation as the design decision.** It is the baseline to deviate from. The decision comes from the subject and the brief, per `design_principles.md`.
- **The quality floor still applies.** A deviation that breaks contrast, touch targets, or motion sensitivity is not a bold choice, it is a defect (`ux_quality_reference.md`).
- **Use the token schema and WCAG pairings from `colors.csv` directly.** Semantic tokens and contrast are quality, not aesthetics, so those are safe to adopt as-is.

---

## 5. RELATED RESOURCES

- [design_principles.md](./design_principles.md) sets the aesthetic direction this catalog helps you deviate from.
- [ux_quality_reference.md](./ux_quality_reference.md) holds the quality floor every deviation must still clear.
- [`../assets/data/`](../assets/data/) holds the queryable CSV catalogs.
- [`../scripts/design_search.py`](../scripts/design_search.py) is the query-only search script over the catalogs.
- [`../THIRD-PARTY-NOTICES.md`](../THIRD-PARTY-NOTICES.md) records the `ui-ux-pro-max` data provenance.
