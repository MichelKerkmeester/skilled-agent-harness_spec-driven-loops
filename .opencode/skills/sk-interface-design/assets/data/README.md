# Design data sets

Nine CSV data sets that back `sk-interface-design`. They are read-only reference data, queried (optionally) by [`../../scripts/design_search.py`](../../scripts/design_search.py). They are never an auto-generator: the design decision always comes from the brief and `references/design_principles.md`.

## Files

| File | Rows | Role | Used as |
|------|------|------|---------|
| `ux-guidelines.csv` | 98 | Accessibility, motion, touch, responsive, forms rules | Quality floor (`references/ux_quality_reference.md`) |
| `app-interface.csv` | 29 | Mobile/interface accessibility rules | Quality floor |
| `charts.csv` | 25 | Chart selection + data-viz a11y | Quality floor |
| `styles.csv` | 84 | Named UI styles, effects, contraindications | Critique-against inventory (`references/design_inventory.md`) |
| `colors.csv` | 160 | shadcn-style semantic token palettes with WCAG notes | Token schema direct; palettes as critique-against |
| `typography.csv` | 73 | Heading/body font pairings by mood | Critique-against inventory |
| `ui-reasoning.csv` | 161 | Per-product recommended patterns + anti-patterns | Critique-against (mine anti-patterns; subvert the recommended) |
| `products.csv` | 161 | Per-product style/landing/dashboard recommendations | Critique-against inventory |
| `landing.csv` | 34 | Conventional landing section orders + CTA placement | Critique-against inventory |

## Provenance

Adopted verbatim from the MIT-licensed `ui-ux-pro-max` repo. See [`../../THIRD-PARTY-NOTICES.md`](../../THIRD-PARTY-NOTICES.md) and [`../../LICENSE-ui-ux-pro-max.txt`](../../LICENSE-ui-ux-pro-max.txt). Row counts are measured from the files, not upstream marketing figures.
