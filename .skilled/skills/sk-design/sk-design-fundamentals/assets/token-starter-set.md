---
title: Token Starter Set
description: What tokens.css contains, how to retune it for a project, and the role-layer rule that makes its dark mode work.
trigger_phrases:
  - "starter design tokens css"
  - "retune the token file"
  - "semantic role layer tokens"
  - "which grey for which text"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Token Starter Set

`tokens.css` is a complete, contrast-verified expression of every scale in this skill, ready to copy into a project and retune.

---

## 1. OVERVIEW

### Core Principle

Copy it in and retune the hues. Re-deriving the scales from prose wastes the work already done and reintroduces the ad hoc values the system exists to eliminate.

### When to Use

- Starting a project with no established design system.
- Adding a token layer to a codebase that currently hardcodes values.
- Needing a worked example of a ramp that already satisfies the saturation and contrast rules.

### What It Is Not

It is not a theme, a component library, or a brand. It is the decisions, made once, with the hues chosen to be replaced.

---

## 2. WHAT IS IN THE FILE

| Group | Tokens | Notes |
|---|---|---|
| Spacing and sizing | `--space-1` through `--space-16` | 4px to 768px, no two neighbours closer than about 25% |
| Type scale | `--text-xs` through `--text-7xl` | 12px to 72px, `px` values |
| Weight | `--weight-normal`, `--weight-bold` | 400 and 600; nothing below 400 exists |
| Line-height and measure | `--leading-tight` to `--leading-loose`, `--measure` | `--measure: 34em` keeps lines at 45 to 75 characters |
| Greys | `--grey-100` through `--grey-900` | Cool-tinted, hue about 209 to 212. Each carries its measured contrast ratio in a comment |
| Primary | `--primary-100` through `--primary-900` | Nine shades; `500` is the button-background shade |
| Accents | `red`, `yellow`, `green` at `100`, `500`, `800` | The trio that "flip the contrast" needs: tint, solid fill, text on the tint |
| Elevation | `--shadow-1` through `--shadow-5` | The five-elevation scale, with heavier alphas in dark mode |
| Radius | `--radius`, `--radius-full` | 4px neutral default |
| Border width | `--border-width`, `--border-width-thick` | 1px and 2px, for the "keep the soft color, go to 2px" fix |
| Opacity | `--opacity-1` through `--opacity-6` | `.05` to `.8`, so overlays stop being eyeballed |
| Semantic roles | `--surface`, `--text-primary`, `--action`, and the rest | The layer components actually reference |

---

## 3. THE ROLE LAYER

**Reference the roles in components, not the raw ramps.** This is what makes the dark-mode block work: the dark override redefines only the roles, so every component that points at `--text-secondary` follows automatically, while a component pointing at `--grey-700` does not.

```css
/* Right - follows the mode */
.card { background: var(--surface-raised); color: var(--text-primary); }

/* Wrong - locked to light mode */
.card { background: #fff; color: var(--grey-900); }
```

Two roles are deliberately distinct and are the pair most often collapsed by mistake:

- `--border` is **decorative** — dividers and separators, about 1.3:1. It has no contrast obligation.
- `--border-strong` is **functional** — input outlines, checkbox edges, focus rings. Anything that is the only thing identifying a control needs 3:1 against its background under WCAG 1.4.11.

Collapsing them into one token either makes dividers too loud or makes controls unidentifiable.

---

## 4. WHICH GREY FOR WHICH TEXT

The grey ramp is not interchangeable. Each step has a verified role.

| Token | Ratio vs `--grey-100` | Use for |
|---|---|---|
| `--grey-400` | 2.7:1 | Disabled text only. WCAG exempts inactive components — it does **not** exempt placeholders, which are active content |
| `--grey-500` | 3.9:1 | Large text only: 24px regular or 18.66px bold. Not safe for a 12px eyebrow label |
| `--grey-600` | 5.6:1 | Tertiary text — footnotes, copyright |
| `--grey-700` | 8.0:1 | Secondary text |
| `--grey-900` | 13.4:1 | Primary text |

On pure white each ratio is about 10% higher than the figure above.

The "three text colors, maximum" rule in `SKILL.md` maps to `--text-primary`, `--text-secondary` and `--text-tertiary`. All three carry body-size text, so all three clear 4.5:1 — which is why tertiary is `--grey-600` and not something paler.

---

## 5. RETUNING FOR A PROJECT

1. **Change the primary hue first.** Rotate all nine `--primary-*` shades together and keep their lightness and saturation relationships intact.
2. **Re-check the base.** `--primary-500` must still work as a button background with white text. Different hues need different lightness to do that, so verify rather than assuming the rotation preserved it.
3. **Decide grey temperature.** The file ships cool greys at hue 209 to 212. For warm greys, move the hue to about 39 to 41 and keep the saturation pattern.
4. **Keep saturation rising toward the ends.** If a shade gets edited, the palest and darkest steps must stay *more* saturated than the base, or they drift toward neutral.
5. **Expand accents only when used heavily.** The `100/500/800` trio covers pills, badges and alerts. A full nine-shade ramp is worth building only when a color carries a real surface.
6. **Re-verify every text and surface pair after retuning.** The shipped ratios are measured against the shipped values; a hue rotation changes them.

The deliberate sub-threshold values — disabled text, decorative dividers, the large-text-only step — are exempt by criterion and are commented inline in the file. Keep the comments when copying; they are why the next person does not "fix" a value that is correct.

---

## 6. REFERENCES AND RELATED RESOURCES

- [`tokens.css`](tokens.css) — the file itself.
- [`../references/color-system.md`](../references/color-system.md) — the construction method behind these ramps, and what to do when a brand color cannot reach its ratio.
- [`../references/depth-and-detail.md`](../references/depth-and-detail.md) Section 3 — the two-part shadow alternative to `--shadow-1` through `--shadow-5`, for designs where shadows are prominent.
