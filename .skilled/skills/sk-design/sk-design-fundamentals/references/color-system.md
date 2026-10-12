---
title: Building the Color System
description: How to pick the actual HSL values for a shade ramp, keep them from washing out at the ends, extend them to dark mode, and hit contrast ratios without ugly color.
trigger_phrases:
  - "build a color palette"
  - "hsl shade ramp"
  - "keep saturation from washing out"
  - "hue rotation for contrast"
  - "dark mode color ramp"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Building the Color System

The scales in `SKILL.md` say *what* to define. This says how to pick the values, and how to keep them from looking washed out or failing contrast.

---

## 1. OVERVIEW

### Core Principle

A palette is built once, from the edges inward, and adjusted by eye. The moment new shades get added outside the system, there is no system.

### When to Use

- Designing a palette or token set from scratch.
- Extending an existing ramp to a new accent or to dark mode.
- A color fails contrast and raising lightness is making it worse.
- Greys look flat, or the palest and darkest shades have drifted toward neutral.

### Prerequisites

The shade-count and naming rules — 8 to 10 greys, 5 to 10 shades per primary and accent, named `100` through `900` with base `500` — are in `SKILL.md` Section 3. This document assumes them.

---

## 2. WHY HSL

Hex and RGB describe colors in terms a machine cares about. HSL describes them in the terms the eye already uses.

- **Hue** is position on the wheel, in degrees: 0 red, 120 green, 240 blue. This is what makes two different colors both read as "blue".
- **Saturation** is how vivid. 0% is grey, at which point hue is meaningless; 100% is intense.
- **Lightness** is 0% black, 100% white, 50% the pure hue.

Two shades of the same color share a hue in HSL and look nothing alike in hex.

Design tools mostly show HSB and browsers only understand HSL, so do not confuse them. In HSB, 100% brightness is only white when saturation is 0; HSB at S100/B100 equals HSL at S100/L50.

---

## 3. BUILDING THE RAMP

### Picking the base (500)

There is no formula. For a primary or accent color, pick the shade that **works as a button background** — dark enough that white text sits on it comfortably, light enough that the button does not read as black. Rules such as "start at 50% lightness" do not hold, because every hue behaves differently. Use your eyes.

For greys the base matters less. Work from the edges instead: the darkest grey is whatever the darkest text should be, and the lightest is a subtle off-white background.

### Finding the edges (900 and 100)

Choose them by imagining where they will be used. `900` is almost always a text color and `100` is almost always a background tint. A simple alert component uses both at once — dark text on a pale tinted panel — so design one and read both values off it.

### Filling the gaps

With `900`, `500` and `100` fixed, add `700` and `300` as the perfect compromise between the shades on either side. That leaves four holes — `800`, `600`, `400`, `200` — filled the same way. Nine shades is convenient because it divides cleanly.

Then adjust by eye. A systematic build gets 90% of the way there; expect to nudge a saturation or push a shade lighter once it is in use.

What must *not* happen is new shades appearing outside the system when something does not quite fit. That is the failure this whole method exists to prevent.

---

## 4. KEEPING SATURATION ALIVE

In HSL, saturation's effect weakens as lightness approaches 0% or 100%. The same S value that looks vivid at L50 looks washed out at L90.

**So: increase saturation as lightness moves away from 50%, in both directions.** The lightest and darkest shades should carry *more* saturation than the base, not the same amount. The difference is subtle per swatch and very visible once the color covers a large area.

This applies to greys too. Tinted greys without raised saturation at the ends will drift back toward neutral at the palest and darkest steps.

---

## 5. PERCEIVED BRIGHTNESS AND HUE ROTATION

Every hue has an inherent perceived brightness. Yellow and blue at identical HSL lightness look nothing alike, because the eye weights the channels unevenly:

```text
perceived brightness = sqrt(0.299·r² + 0.587·g² + 0.114·b²) / 255
```

Across the wheel this gives three local maxima — **60° yellow, 180° cyan, 300° magenta** — and three minima — **0° red, 120° green, 240° blue**.

That is a second way to change how light a color looks, without touching lightness and without draining its intensity:

- **To lighten:** rotate the hue toward the nearest of 60°, 180° or 300°.
- **To darken:** rotate the hue toward the nearest of 0°, 120° or 240°.

**Cap the rotation at 20 to 30 degrees total.** Beyond that it reads as a different color rather than a lighter or darker one.

This is the fix for scales built on light hues. A yellow darkened by lightness alone goes muddy olive-brown; a yellow darkened by rotating gradually toward orange gives warm, rich dark shades. Combine both approaches freely — take some brightness from hue and some from lightness.

### Warm and cool greys

True grey is S0%, no color at all. Most greys in good UIs are saturated noticeably.

- **Cool**, blue-ish: hue about 207 to 210, saturation about 12 to 21%.
- **Warm**, yellow or orange-ish: hue about 39 to 41, saturation about 12 to 21%.

How far to push it is a personality decision. The saturation rule in Section 4 still applies: raise S at the light and dark ends or the extremes will look flat next to the mid-tones.

---

## 6. HITTING CONTRAST RATIOS WITHOUT UGLY COLOR

WCAG wants 4.5:1 for normal text. The relaxed 3:1 threshold applies only to *large* text, defined as 18pt (24px) regular or 14pt (about 18.66px) bold. 18px regular text is normal text and needs the full 4.5:1; the book's "about 18px" phrasing is looser than the spec.

Dark on light is easy. Color is where it gets hard, and two moves solve almost every case.

### Escape hatch 1: flip the contrast

White text on a colored background needs the background to be *very* dark to reach 4.5:1, and a page full of dark saturated badges grabs attention those elements do not deserve.

Invert instead: **dark colored text on a light colored tint.** A green `800` on a green `100` easily clears AAA, keeps the semantic color, and sits quietly in the hierarchy. This is the default treatment for status pills, tags and badges.

### Escape hatch 2: rotate the hue toward a brighter one

For colored text on a colored background — secondary text inside a dark colored panel — raising lightness alone drives the text to near-white before the ratio is met, and then primary and secondary text look identical.

Use perceived brightness instead: **rotate the text's hue toward cyan, magenta or yellow.** That gains contrast while keeping the text visibly colored and visibly secondary. A blue-violet panel with cyan-shifted body text can clear AAA and still look like part of the panel.

---

## 7. DARK MODE

Dark mode is beyond the book, which predates it, but the ramp rules extend to it cleanly.

**Do not invert the ramp mechanically.** Swapping `100` for `900` produces harsh, glaring UI, because the two modes are not symmetric.

- **Never use pure black as the surface.** Use something around `grey-900`, and build **elevation by getting lighter**, not darker. "Raised is lighter than the page" holds in both modes; what changes is that shadows barely register against a dark surface, so lightness has to carry the depth cue alone. Surfaces stack upward in lightness and shadows do progressively less work.
- **A raised dark surface usually also needs a hairline border.** Adjacent steps on a grey ramp are a thin cue, typically under 1.3:1. Do not just reach for a lighter surface: pushing it further up the ramp squeezes the text sitting on it, and tertiary text fails first.
- **Desaturate the accents.** A `500` tuned to carry white text on a light page will vibrate against a dark one. Shift toward the `300` or `400` end and drop saturation.
- **Re-check contrast rather than assuming it mirrors.** Light on dark at the same nominal ratio reads heavier, so text often wants to be a shade *dimmer* than the equivalent light-mode pairing, not brighter. `grey-100` on `grey-900` is usually too much; `grey-200` or `grey-300` is the comfortable body color.
- **Both escape hatches work in reverse.** On a dark colored panel, rotating hue toward cyan, magenta or yellow buys contrast without washing to white.

---

## 8. REFERENCES AND RELATED RESOURCES

- [`../assets/tokens.css`](../assets/tokens.css) — a built ramp that already follows every rule here, including the dark-mode role overrides. Retune its hues rather than deriving a new ramp from this prose.
- [`../assets/token-starter-set.md`](../assets/token-starter-set.md) — what the token file contains and how to adapt it.
- [`diagnosis-table.md`](diagnosis-table.md) Section 3 — the color and contrast symptoms this document fixes.
