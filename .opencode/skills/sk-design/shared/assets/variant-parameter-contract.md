---
title: Variant Parameter Contract
description: Transport-facing schema for the shared design-variant knobs that Figma, Open Design, and live renders must all declare.
trigger_phrases:
  - "variant parameter contract"
  - "design variant knobs"
  - "transport variant schema"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Variant Parameter Contract

This contract names the shared knobs a design variant may carry across transports. It is internal schema for transport handoff, not a user-facing chooser and not a pick-a-vibe menu. The design read, register posture, and rendered critique still decide whether a variant is good.

The checker proves only that every knob row is present, complete, and declared for all canonical transports. It does not prove that a range produces tasteful variants, that a renderer honors the value at runtime, or that an owner mode made the best judgment.

---

## 1. KNOB SCHEMA

| Knob | Range/Values | Step | Owner Mode | Transports | Caveat |
|---|---|---|---|---|---|
| density | 0.6-1.4 | 0.1 | interface | figma, open-design, live | Internal density calibration; Brand/Product posture still decides whether the surface earns open space or compact packing. |
| type-scale | 0.85-1.3 | n/a | foundations | figma, open-design, live | Scales role contrast; readable measure, zoom, and localization can override the ratio. |
| color-amount | 0-1 | 0.05 | foundations | figma, open-design, live | Represents visual dosage, not palette quality; contrast and semantic role checks still win. |
| structure | stack, split, grid, bento, scroll-pinned | n/a | interface | figma, open-design, live | Selects a layout family for transport parity; content count, mobile collapse, and anti-default checks still gate the result. |
| pairing | single-family, display-plus-neutral-body, body-plus-utility, data-legibility | n/a | foundations | figma, open-design, live | Names type-role pairing shape, not a font preset; brand evidence, numeral quality, and legibility still decide the final pairing. |

---

## 2. APPLICATION NOTES

- `interface` owns density and structure because the register and design read set posture, packing, and layout family before render work.
- `foundations` owns type-scale, color-amount, and pairing because those knobs belong to the static token system, color dosage, and type roles.
- `figma`, `open-design`, and `live` must all be declared on every row. Dropping one transport is a contract failure even if the prose otherwise looks complete.
- The value ranges are transport-facing bounds. They are not surfaced to the user as selectable dials and they do not replace grounded design judgment.

Run the schema gate from this directory:

```bash
python3 ../scripts/variant_parameter_check.py variant-parameter-contract.md
```
