---
title: Token Starter
description: Fill-in scaffold for an OKLCH color ramp, a type scale and a spacing scale, keyed to the shared register for color strategy and density.
trigger_phrases:
  - "token starter"
  - "design token scaffold"
  - "oklch ramp fill-in"
  - "type and spacing scale starter"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Token Starter

Fill this in to scaffold a static token system: an OKLCH color ramp, a type scale and a spacing scale. Read the register first, because it sets the color strategy and the density this scaffold inherits. Channel mechanics, contrast repair and semantic role rules live in the color and type references. This card is the fill-in, not the theory.

---

## 1. READ THE REGISTER FIRST

The register decides how much color carries the surface and how dense the system is. Set it on the register card, then copy the two answers here. Full rationale: `../../shared/register.md`.

| Input | Answer |
| --- | --- |
| Register | [ ] Brand (design IS the product) [ ] Product (design SERVES the product) |
| Color strategy | [ ] Restrained [ ] Committed [ ] Full palette [ ] Drenched |
| Density | [ ] Generous, one big move (Brand) [ ] Dense and efficient (Product) |
| Brand hue (OKLCH H, 0 to 360) | `__________` (from brand evidence, not the blue or warm-orange default) |
| Dark mode needed? | [ ] Yes [ ] No |

Restrained keeps one accent at 10 percent or less and is the Product default. Committed, Full palette and Drenched deliberately spend more color and belong to Brand or to data-rich surfaces.

---

## 2. COLOR RAMP

Pick the hue from brand evidence, ramp lightness first, then reduce chroma near white and black. Fill OKLCH as `oklch(L C H)` with three decimals on L and C. Tint neutrals toward the brand hue with a tiny chroma, usually `C 0.005` to `0.015`.

### Neutral scale

| Token | OKLCH | Typical use |
| --- | --- | --- |
| `--neutral-50` | `oklch(____ ____ ____)` | page background |
| `--neutral-100` | `oklch(____ ____ ____)` | raised surface |
| `--neutral-300` | `oklch(____ ____ ____)` | hairline border |
| `--neutral-600` | `oklch(____ ____ ____)` | secondary text |
| `--neutral-900` | `oklch(____ ____ ____)` | primary text |

### Primary and accent

| Token | OKLCH | Typical use |
| --- | --- | --- |
| `--color-primary` | `oklch(____ ____ ____)` | key action, selection, focus |
| `--color-primary-hover` | `oklch(____ ____ ____)` | hover and active state |
| `--color-on-primary` | `oklch(____ ____ ____)` | text on the primary fill |

### Semantic

| Token | OKLCH | Meaning |
| --- | --- | --- |
| `--color-success` | `oklch(____ ____ ____)` | success, paired with icon or text |
| `--color-warning` | `oklch(____ ____ ____)` | warning, paired with icon or text |
| `--color-danger` | `oklch(____ ____ ____)` | error, paired with icon or text |
| `--color-info` | `oklch(____ ____ ____)` | info, paired with icon or text |

Restrained surfaces follow 60-30-10 by visual weight: roughly 60 percent neutral, 30 percent secondary, 10 percent accent. Keep semantic colors meaning the same thing everywhere, and never let color be the only signal.

---

## 3. TYPE SCALE

Set the roles first, then fill sizes from a modular ratio such as 1.2 for dense Product or 1.25 to 1.333 for expressive Brand. Body sits near 16 px, and line height loosens as the column widens.

| Role | Size | Weight | Line height | Use |
| --- | --- | --- | --- | --- |
| Display | `______` | `______` | `______` | one hero moment, Brand only |
| H1 | `______` | `______` | `______` | page title |
| H2 | `______` | `______` | `______` | section title |
| Body | `______` | `______` | `______` | running text, at least 16 px |
| Caption | `______` | `______` | `______` | helper and metadata |
| Utility | `______` | `tabular-nums` | `______` | data, numbers, tables |

Keep the readable measure near 45 to 75 characters. Reserve the display role for Brand, since a Product surface rarely earns it.

---

## 4. SPACING SCALE

Use a 4-point base so dense and airy surfaces both have a value to reach for. Tight gaps group, generous gaps separate and `clamp()` lets section spacing breathe on large screens.

| Token | Value | Use |
| --- | --- | --- |
| `--space-2xs` | `4px` | icon-to-label, inline |
| `--space-xs` | `8px` | tight grouping of siblings |
| `--space-sm` | `12px` | grouped controls |
| `--space-md` | `16px` | default block gap |
| `--space-lg` | `24px` | card padding |
| `--space-xl` | `32px` | subsection gap |
| `--space-2xl` | `48px` | section gap floor |
| `--space-section` | `clamp(48px, 8vw, 96px)` | between major sections |

Brand leans toward the generous end with one big move, and Product holds the tighter end where whitespace earns its place. Pull every value from this scale rather than typing one-off numbers.

---

## 5. DARK MODE (IF NEEDED)

Skip this block when dark mode is not in scope. Dark mode is its own surface system, so redefine semantic tokens and rebuild depth with lightness, not by inverting the light values.

| Token | OKLCH | Note |
| --- | --- | --- |
| `--surface-base` | `oklch(____ ____ ____)` | deep brand-tinted canvas near L 0.15 |
| `--surface-raised` | `oklch(____ ____ ____)` | one step lighter, near L 0.20 |
| `--surface-overlay` | `oklch(____ ____ ____)` | highest elevation, near L 0.25 |
| `--text-primary-dark` | `oklch(____ ____ ____)` | light text, slightly reduced weight |

Hold the hue and chroma steady across the surface steps and vary only lightness, and desaturate accents slightly to cut glare.

---

## 6. HAND OFF

When the scaffold is filled, the system is ready for implementation. Confirm before handing to `sk-code`:

- Every color token has an OKLCH value or a deliberate compatibility reason.
- Text pairs meet the contrast target on every surface they sit on.
- The type scale has roles, sizes and a readable measure, with tabular numerals on data.
- Spacing values all come from the scale.
- Dark mode, when in scope, has its own surface and text pairs rather than inverted light values.

If a filled value contradicts the register, the register wins for posture and this scaffold carries the craft within it.
