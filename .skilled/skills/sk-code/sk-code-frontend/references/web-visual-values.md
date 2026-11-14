---
title: Web Visual Values
description: Spacing, type, colour, shadow, radius, motion and token values for web interfaces.
trigger_phrases:
  - "web visual values"
  - "spacing and type scale"
  - "colour ramp construction"
  - "shadow elevation scale"
  - "design token roles"
importance_tier: important
contextType: implementation
version: 1.0.1.0
---

# Web Visual Values

A small set of decisions, made once, keeps a web interface from drifting into ad hoc values.

---

## 1. OVERVIEW

### Purpose

This file covers the value scales and construction methods for spacing, type, colour, elevation, radius, borders, images and token roles.

### When to Use

- Choosing a spacing, type, colour, shadow, radius, border, opacity or motion value.
- Building a colour ramp or a token set from scratch.
- Refining depth, type detail, component shape or image treatment.
- Choosing which grey carries which text role, or retuning a token file for a project.

### Boundaries

- Visual order and emphasis: [web-visual-hierarchy.md](web-visual-hierarchy.md).
- Motion curves, easing and interaction behavior: [web-motion-and-interaction.md](web-motion-and-interaction.md).
- Focus styling and widget contracts: [web-accessibility-patterns.md](web-accessibility-patterns.md).
- Layout mechanics and sizing behavior: [web-layout-and-sizing.md](web-layout-and-sizing.md).

---

## 2. SPACING, SIZING, OPACITY AND TIMING

### V1. Spacing and sizing scale

- **Rule:** Use base 16px, built from factors and multiples of it. The scale is:
```text
4  8  12  16  24  32  48  64  96  128  192  256  384  512  640  768
```
Use it for margin, padding, width, height, icon sizes and border width.
- **Why:** Tight at the small end and spreading at the large end. No two adjacent values may be closer than about 25%, which is what makes the choice obvious. A linear "multiples of 4" scale fails because it does not help anyone decide between 120px and 124px.
- **When not to:** Only when an established system or a measured reference fixes the value. Then that value wins.
- **Pitfall:** Inventing 120px or 124px beside the scale destroys the decision the scale exists to make.
- **Support:** Judgment, no version gate.
- **See also:** [tokens.css](../assets/tokens.css) carries the scale as custom properties.

### V2. Opacity set

- **Rule:** Fix a small set of opacity values for disabled states, overlays and hover tints, rather than choosing by eye each time:
```text
.05 .1 .2 .4 .6 .8
```
- **Why:** Same logic as the other scales: decide once, reuse everywhere. The token file maps them to `--opacity-1` through `--opacity-6` from `.05` to `.8`.
- **When not to:** A one-off decorative wash that never repeats can be a local value, but it must not become a second opacity system.
- **Pitfall:** A dragged opacity control produces near-identical values that no one can tell apart or reuse.
- **Support:** Judgment, no version gate.
- **See also:** [tokens.css](../assets/tokens.css).

### V3. Space around a group exceeds space within it

- **Rule:** Put more space around a group than within it.
- **Why:** This is the fix for "which label belongs to which field", cramped bullet lists and headings that look attached to the wrong paragraph. For bullet lists, the gap must exceed the line-height. Ambiguous spacing is a functional bug, not only an ugly one.
- **When not to:** When items are deliberately one continuous run, such as words in a sentence, no grouping gap applies.
- **Pitfall:** A gap that matches the line-height reads as another line of the same group.
- **Support:** Judgment, no version gate.
- **See also:** [web-layout-and-sizing.md](web-layout-and-sizing.md).

### V4. Motion duration bands

- **Rule:** Timing is a scale like the others, and consistency across it outranks the perfect value for any one element. The bands are:
```text
120-180ms   press, hover, direct feedback
180-260ms   small state change: toggle, dropdown, tooltip, tab
up to 500ms layout transition: modal, drawer, accordion
```
300ms is the ceiling for anything the user initiated. Similar elements use identical values.
- **Why:** A fixed set of bands makes the interface feel consistent and stops each component from inventing its own sense of speed.
- **When not to:** Animation the user did not initiate can run longer, but it still needs a stated reason.
- **Pitfall:** A unique duration per component makes the interface feel inconsistent even when each value looks smooth alone.
- **Support:** Judgment, no version gate.
- **See also:** [web-motion-and-interaction.md](web-motion-and-interaction.md) carries easing curves, springs and staging.

---

## 3. TYPE SCALE AND TYPE DETAIL

### V5. Type scale and units

- **Rule:** The type scale is:
```text
12  14  16  18  20  24  30  36  48  60  72
```
Use `px` or `rem` only. Never `em`.
- **Why:** This is not a modular scale built from a ratio. Ratios produce fractional pixel values that round inconsistently across browsers, and they are too sparse for interface density. Hand-picked values chosen for how they feel win instead. `em` is relative to the current font size, so `.875em` inside a `1.25em` parent computes to 17.5px, a value not on the scale, and the scale silently stops existing.
- **When not to:** Never for the type scale. The exception is line length, where `max-width` in `em` is correct because measure should scale with its own text.
- **Pitfall:** Nested `em` values compound, so the same declaration produces different sizes at different depths.
- **Support:** Judgment, no version gate.
- **See also:** [tokens.css](../assets/tokens.css) carries `--text-xs` through `--text-7xl`.

### V6. Font weight

- **Rule:** Two weights is enough. Use 400 or 500 for body and most UI text, and 600 or 700 for anything emphasized. Medium-sized headings usually sit best at 500 to 600. Nothing below 400 in UI.
- **Why:** A third weight rarely earns its place, and a lighter weight is the wrong tool for de-emphasis.
- **When not to:** A display face with a genuine optical size or a brand system may supply its own pair. Keep it to two roles.
- **Pitfall:** Weight that changes on hover or selection shifts the layout because the glyph width changes. To de-emphasize, use a lighter colour or a smaller size, never a lighter weight.
- **Support:** Judgment, no version gate.
- **See also:** [tokens.css](../assets/tokens.css) carries `--weight-normal` and `--weight-bold`.

### M13. Stable weight across states

- **Rule:** Never change font weight on hover or on a selected state. Change colour instead.
- **Why:** A weight change alters glyph width and shifts the layout of everything after it.
- **When not to:** Use weight for a state that does not sit in flow, such as a badge whose box is already sized for the heavier weight.
- **Pitfall:** A hover weight change makes a navigation row jump by a pixel, so the whole row appears to twitch.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md#v6-font-weight).

### M14. Weight floor and heading weight

- **Rule:** Never use a weight below 400, and set medium-sized headings at 500 to 600.
- **Why:** Thin stems lose contrast against the background at body size and read as broken rendering.
- **When not to:** Use a lighter weight for a very large display line where the size already carries the emphasis.
- **Pitfall:** A 300 weight at body size on a low-resolution screen reads as a rendering fault rather than a style choice.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md#v6-font-weight).

### V7. Line-height and line length

- **Rule:** Line-height is inversely proportional to font size and proportional to line width. Use 1.5 to 2 for small text or wide columns, and 1 is fine for large headlines. Set line length to 45 to 75 characters, which is `max-width: 20em` to `35em`.
- **Why:** Measure should scale with the text it wraps, and this applies to the paragraph even when its container is wider. Mixed widths in one content area look more polished, not less.
- **When not to:** A single-line label or a code block with its own scrolling model does not carry paragraph measure.
- **Pitfall:** Applying `max-width` in `px` fixes the measure against the root size rather than the text. `em` is correct here, and the "never `em`" rule is scoped to the type scale, where `em` compounds through nesting. Do not "fix" this.
- **Support:** Judgment, no version gate.
- **See also:** [tokens.css](../assets/tokens.css) carries `--leading-tight` through `--leading-loose` and `--measure: 34em`.

### V8. Baseline alignment and letter-spacing

- **Rule:** Align mixed font sizes on the same line to the baseline. Trust the type designer's default tracking except for two cases. Tighten a body face used as a headline by about `-0.05em`, and add about `+0.05em` to all-caps.
- **Why:** Vertical centering offsets baselines and looks subtly wrong, especially when the sizes are close. Faces built for small sizes have wider tracking than headline faces, and caps are uniform blocks that default tracking crowds.
- **When not to:** A headline face does not become legible at small sizes just because it was loosened, so do not reverse the first exception.
- **Pitfall:** A default underline collides with every `g`, `p` and `y`. Set `text-underline-offset: 3px` with `text-decoration-skip-ink: auto` so underlines read as intentional.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-hierarchy.md](web-visual-hierarchy.md) covers emphasis without extra weight.

### V9. Line breaking and font synthesis

- **Rule:** Use `text-wrap: balance` on headings and `text-wrap: pretty` on body text. Pair `text-align: justify` with `hyphens: auto`, or do not justify. Set `font-synthesis: none` where a face lacks a real bold or italic, and leave `font-optical-sizing: auto`.
- **Why:** Balance evens heading line lengths and removes the long-line plus orphan shape. Pretty reduces orphans without balancing every line. Justified text without hyphenation opens rivers of whitespace. A browser-faked weight is a smeared outline and invents a third weight.
- **When not to:** A short label that cannot wrap needs none of the wrapping properties.
- **Pitfall:** Justifying without hyphenation is the common shape of the whitespace-river defect.
- **Support:** Judgment, no version gate.
- **See also:** [web-markup-and-css.md](web-markup-and-css.md) covers text-level markup.

### V10. Numerals and typeface selection

- **Rule:** Use `font-variant-numeric: tabular-nums` wherever a digit change must not shift the layout, such as tables, dashboards, pricing, counters and timers. Use proportional figures in running prose. For code-adjacent interfaces, use a slashed zero and a disambiguation set for `I`, `l` and `1`. For typeface choice, a neutral sans-serif is the safe default, and the system stack is legitimate: `-apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue`.
- **Why:** Tabular figures keep columns steady and proportional figures keep prose even. Ignoring families with fewer than five weights filters a library to 10 or more styles, cuts about 85% of the options and leaves carefully made families. A widely used font is usually a good font.
- **When not to:** A brand system that fixes the typeface overrides the default stack.
- **Pitfall:** A condensed face with a short x-height is hard to read in UI text. Optimize for legibility with a taller x-height and wider default tracking.
- **Support:** Judgment, no version gate.
- **See also:** [tokens.css](../assets/tokens.css) carries the weight and text-size tokens.

### M15. Numerals and text size adjust

- **Rule:** Apply `font-variant-numeric: tabular-nums` to numbers in tables, dashboards and anywhere a digit change would shift the layout, and set `-webkit-text-size-adjust: 100%` to stop unexpected text resizing in iOS landscape.
- **Why:** Tabular figures give every digit the same advance width, so a counter does not jitter, and the text size adjustment keeps the declared scale instead of letting the platform rescale it.
- **When not to:** Keep proportional numerals in running prose, where they sit better between letters.
- **Pitfall:** Tabular numerals in a large headline leave visible gaps around narrow digits such as 1.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-values.md](web-visual-values.md#v10-numerals-and-typeface-selection).

### V11. Personality is four decisions

- **Rule:** Treat personality as four concrete choices: typeface, colour, border radius and language. A serif reads elegant or classic, a rounded sans reads playful and a neutral sans reads plain. Blue is safe, gold reads expensive and pink reads fun. Small radius is neutral, large is playful and none is formal. The wording of a message changes character more than any colour choice.
- **Why:** Personality is not a vibe. These four levers are concrete enough to decide and repeat.
- **When not to:** A brand system that already fixes these four has made the decision.
- **Pitfall:** If the decision will not come, look at the other interfaces the users spend time in, but do not imitate direct competitors or the result looks like a lesser version of them.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-hierarchy.md](web-visual-hierarchy.md).

---

## 4. COLOUR RAMPS

### V12. Ramp counts and naming

- **Rule:** Build greys at 8 to 10 shades, a primary at 5 to 10 shades and each accent at 5 to 10 shades. Name them `100` (lightest) through `900` (darkest), with base `500`. Ten colours at 5 to 10 shades each is normal for a complex UI.
- **Why:** A five-swatch palette generator gives nowhere near enough colours. Almost all of a UI is grey, covering text, backgrounds, panels, borders and form controls, so three or four shades always run out. Start at a very dark grey, not true black, which looks unnatural.
- **When not to:** An accent that appears only as a pill, badge or alert can start as the `100/500/800` trio and expand only when it carries a real surface.
- **Pitfall:** A second primary or an extra accent multiplies the ramp work and weakens the one colour that should mean action.
- **Support:** Judgment, no version gate.
- **See also:** [tokens.css](../assets/tokens.css) carries the grey, primary and accent ramps.

### V13. HSL and no runtime shades

- **Rule:** Write colours as HSL, not hex. Build every shade up front and never generate one at runtime with `lighten()` or `darken()`.
- **Why:** Hex and RGB describe colours in terms a machine cares about, while HSL describes them in the terms the eye already uses. `hsl(220, 95%, 34%)` and `hsl(220, 65%, 61%)` are visibly related, while `#03369E` and `#507DD7` are not. Hue is position on the wheel in degrees. Saturation is how vivid from 0% grey to 100% intense. Lightness runs from 0% black through 50% pure hue to 100% white. Design tools mostly show HSB and browsers understand HSL, so do not confuse them. HSB at S100/B100 equals HSL at S100/L50.
- **When not to:** A brand colour supplied as a fixed hex is still expressed as HSL for the ramp, with the original kept as the brand value.
- **Pitfall:** Runtime shades are how a project ends up with 35 slightly different blues.
- **Support:** Judgment, no version gate.
- **See also:** [tokens.css](../assets/tokens.css) writes every ramp in HSL.

### V14. Build the ramp from 500 outward

- **Rule:** Pick base `500` first, then the `900` and `100` edges, then fill the gaps. For a primary or accent, `500` is the shade that works as a button background, dark enough that white text sits on it comfortably and light enough that the button does not read as black. For greys, the darkest shade is whatever the darkest text should be and the lightest is a subtle off-white background. A simple alert uses both edges at once, with dark text on a pale tinted panel. With `900`, `500` and `100` fixed, add `700` and `300` as the compromise between their neighbours, then fill `800`, `600`, `400` and `200` the same way.
- **Why:** There is no formula for `500`. Rules such as "start at 50% lightness" do not hold because every hue behaves differently, so use your eyes. Nine shades is convenient because it divides cleanly, and a systematic build gets 90% of the way there.
- **When not to:** An established ramp is ground truth. Retune its hues rather than deriving a second ramp beside it.
- **Pitfall:** New shades appearing outside the system when something does not quite fit is the failure the whole method prevents. Expect to nudge a saturation or push a shade lighter once it is in use, but keep it inside the ramp.
- **Support:** Judgment, no version gate.
- **See also:** [tokens.css](../assets/tokens.css) shows a completed nine-shade primary ramp.

### V15. Saturation rises at the ends

- **Rule:** Increase saturation as lightness moves away from 50%, in both directions. The lightest and darkest shades carry more saturation than the base, not the same amount. This applies to greys too.
- **Why:** In HSL, saturation's effect weakens as lightness approaches 0% or 100%. The same S value that looks vivid at L50 looks washed out at L90, and the difference is subtle per swatch and very visible once the colour covers a large area. Tinted greys without raised saturation at the ends drift back toward neutral at the palest and darkest steps.
- **When not to:** A deliberate neutral grey at S0% has no saturation to raise, and that is a decision rather than an oversight.
- **Pitfall:** A ramp built at one saturation looks flat at both ends.
- **Support:** Judgment, no version gate.
- **See also:** [tokens.css](../assets/tokens.css) raises saturation toward both ends.

### V16. Perceived brightness and hue rotation

- **Rule:** Use perceived brightness as a second way to change how light a colour looks:
```text
perceived brightness = sqrt(0.299·r² + 0.587·g² + 0.114·b²) / 255
```
Across the wheel this gives three local maxima at 60° yellow, 180° cyan and 300° magenta, and three minima at 0° red, 120° green and 240° blue. To lighten, rotate the hue toward the nearest of 60°, 180° or 300°. To darken, rotate toward the nearest of 0°, 120° or 240°. Cap the rotation at 20 to 30 degrees total.
- **Why:** Every hue has an inherent perceived brightness, so yellow and blue at identical HSL lightness look nothing alike. This changes how light a colour looks without touching lightness and without draining its intensity. A yellow darkened by lightness alone goes muddy olive-brown, while a yellow darkened by rotating gradually toward orange gives warm, rich dark shades. Combine both approaches freely, taking some brightness from hue and some from lightness.
- **When not to:** Beyond 20 to 30 degrees the rotation reads as a different colour rather than a lighter or darker one.
- **Pitfall:** A scale built on a light hue needs hue rotation as well as lightness, or the dark end goes muddy.
- **Support:** Judgment, no version gate.
- **See also:** [tokens.css](../assets/tokens.css) rotates hue across each ramp.

### V17. Warm and cool greys

- **Rule:** Tint most greys. Cool greys sit at hue about 207 to 210 with saturation about 12 to 21%. Warm greys sit at hue about 39 to 41 with saturation about 12 to 21%.
- **Why:** True grey is S0% with no colour at all, and most greys in good interfaces are saturated noticeably. How far to push it is a personality decision.
- **When not to:** A pure neutral grey is a deliberate choice for a restrained or technical surface.
- **Pitfall:** The saturation rule still applies at the light and dark ends, or the extremes look flat next to the mid-tones.
- **Support:** Judgment, no version gate.
- **See also:** [tokens.css](../assets/tokens.css) ships cool greys and names the warm hue to swap in.

### V18. Contrast ratios and the two escape hatches

- **Rule:** Meet 4.5:1 for normal text. The relaxed 3:1 threshold applies only to large text, defined as 18pt (24px) regular or 14pt (about 18.66px) bold. An 18px regular text is normal text and needs the full 4.5:1. Functional non-text that is the only thing identifying a control needs 3:1 under WCAG 1.4.11. When a colour pair fails, use one of two escape hatches. First, flip the contrast to dark coloured text on a light coloured tint, such as a green `800` on a green `100`. Second, rotate the text's hue toward cyan, magenta or yellow for coloured text on a coloured background.
- **Why:** Dark on light is easy, and colour is where contrast gets hard. A green `800` on a green `100` easily clears AAA, keeps the semantic colour and sits quietly in the visual order. This is the default treatment for status pills, tags and badges. A blue-violet panel with cyan-shifted body text can clear AAA and still look like part of the panel. Raising lightness alone drives the text to near-white before the ratio is met, and then primary and secondary text look identical.
- **When not to:** A decorative hairline that merely divides content has no contrast obligation. Text and non-text are two different tokens.
- **Pitfall:** White text on a coloured background needs the background to be very dark to reach 4.5:1, and a page full of dark saturated badges grabs attention those elements do not deserve.
- **Support:** Judgment, no version gate.
- **See also:** [web-accessibility-patterns.md](web-accessibility-patterns.md) and [tokens.css](../assets/tokens.css).

### V19. Dark mode

- **Rule:** Do not invert the ramp mechanically. Never use pure black as the surface. Use something around `grey-900` and build elevation by getting lighter, not darker. Desaturate the accents and shift them toward the `300` or `400` end. Re-check contrast rather than assuming it mirrors. A raised dark surface usually also needs a hairline border. Both escape hatches work in reverse on a dark coloured panel.
- **Why:** Swapping `100` for `900` produces harsh, glaring UI because the two modes are not symmetric. Raised is lighter than the page in both modes, but shadows barely register against a dark surface, so lightness has to carry the depth cue alone. Adjacent steps on a grey ramp are typically under 1.3:1, and pushing the surface further up the ramp squeezes the text on it. Light on dark at the same nominal ratio reads heavier, so text often wants to be a shade dimmer than the light-mode pairing. `grey-100` on `grey-900` is usually too much, while `grey-200` or `grey-300` is the comfortable body colour.
- **When not to:** A design that deliberately stays in one mode still follows the same contrast minimums.
- **Pitfall:** A `500` tuned to carry white text on a light page will vibrate against a dark one. Tertiary text fails first when the surface is pushed too light.
- **Support:** Judgment, no version gate.
- **See also:** [tokens.css](../assets/tokens.css) carries the dark-mode role overrides.

---

## 5. ELEVATION AND SHADOWS

### V20. Five shadow elevations

- **Rule:** Choose from five elevations:
```css
0 1px 3px   hsla(0,0%,0%,.2)   /* barely raised - buttons */
0 4px 6px   hsla(0,0%,0%,.2)   /* dropdowns */
0 5px 15px  hsla(0,0%,0%,.2)
0 10px 24px hsla(0,0%,0%,.2)
0 15px 35px hsla(0,0%,0%,.2)   /* modals */
```
Ask where on the z-axis the element sits, not what shadow looks nice. Closer to the user means more attention.
- **Why:** A fixed set makes elevation readable across a project. Shrinking a button's shadow on `:active` makes it feel pressed. Growing a list item's shadow when it is picked up for drag-to-reorder reads as "now above its siblings" and doubles as the drag affordance.
- **When not to:** When shadows are prominent, a two-part or layered system may carry elevation better. Pick one of the three and never mix them.
- **Pitfall:** Choosing by appearance rather than z-position produces two elements at the same height with different shadows. Transitioning `box-shadow` directly repaints on every frame, so put the target shadow on a pseudo-element and animate its `opacity` instead.
```css
.card { position: relative; box-shadow: var(--shadow-1); }
.card::after {
  content: ''; position: absolute; inset: 0; border-radius: inherit;
  box-shadow: var(--shadow-3); opacity: 0; transition: opacity 180ms ease;
  pointer-events: none;
}
.card:hover::after { opacity: 1; }
```
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-hierarchy.md](web-visual-hierarchy.md) and [tokens.css](../assets/tokens.css). The 180ms hover transition sits in the direct-feedback band in [web-motion-and-interaction.md](web-motion-and-interaction.md#10-the-enforceable-motion-ruleset).

### V21. One light source for raised and inset

- **Rule:** Decide the element's profile, then mimic how light would hit that shape. Light comes from above and people look slightly down at their screens, so the top edge of a raised element is visible and the bottom edge of an inset one is. Each element needs both the lit edge and the blocked light in a single comma-separated `box-shadow`.
- **Why:** Borrow the real-world cue and stop, because depth comes from mimicking one light source consistently, not from chasing photorealism. Raised and inset are the same trick. Two `box-shadow` declarations on one selector do not combine, and the second silently discards the first.
- **When not to:** A flat surface with no raised or inset cue needs none of this.
- **Pitfall:** Both lit edges are `inset`, because a non-inset shadow with a negative Y offset draws above the element, not on its bottom lip.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-hierarchy.md](web-visual-hierarchy.md) covers the depth cue as emphasis.

### V22. Raised and inset treatments

- **Rule:** For a raised button or card, use a lit top edge and a shadow cast below:
```css
box-shadow:
  inset 0 1px 0 hsl(224, 84%, 74%),   /* top edge, angled toward the light */
  0 1px 3px hsla(0, 0%, 0%, .2);      /* light blocked beneath the element */
```
For an inset well, input or checkbox, use a lit bottom lip and a shadow blocked at the top. The lip must be lighter than the element's own face, so the values depend on how dark that face is:
```css
/* Dark surface - the face is dark, so the lip has room to read as clearly lit. */
box-shadow:
  inset 0 -2px 0 hsl(211, 30%, 34%),    /* bottom lip, on a grey-800 face */
  inset 0 2px 2px hsla(0, 0%, 0%, .25); /* light blocked by the lip above */

/* Light surface - the face is already near-white, so there is almost no room to
   go lighter. Let the top shadow do the work and keep the lip to a hairline. */
box-shadow:
  inset 0 -1px 0 hsl(0, 0%, 100%),      /* on a grey-100 face */
  inset 0 2px 2px hsla(0, 0%, 0%, .06);
```
- **Why:** The lit edge and the blocked light together read as a physical profile. The lip must be lighter than the face, so the values depend entirely on how dark that face is.
- **When not to:** A flat design uses colour, solid shadows and overlap instead.
- **Pitfall:** Hand-pick the lighter colour rather than overlaying semi-transparent white, because white overlays drain saturation from the underlying colour. On a neutral grey or near-black surface there is no saturation to lose, so `hsla(0,0%,100%,.15)` is fine there. Keep blur radii tiny because these edges are sharp in the real world.
- **Support:** Judgment, no version gate.
- **See also:** [tokens.css](../assets/tokens.css) carries the base elevation values these treatments extend.

### V23. Two-part cast and contact shadows

- **Rule:** Build a shadow from two parts. The cast shadow is larger and softer with a bigger Y offset and blur. The contact shadow is tighter with a small offset and blur. They must differ substantially in offset and blur, about a threefold difference in both:
```css
box-shadow:
  0 10px 20px hsla(0, 0%, 0%, .15),  /* cast - larger, softer */
  0 3px 6px   hsla(0, 0%, 0%, .10);  /* contact - tighter, sharper */
```
The full five-step scale is:
```css
/* lowest  */ 0 1px 3px hsla(0,0%,0%,.12), 0 1px 2px hsla(0,0%,0%,.24);
/*         */ 0 3px 6px hsla(0,0%,0%,.15), 0 2px 4px hsla(0,0%,0%,.12);
/*         */ 0 10px 20px hsla(0,0%,0%,.15), 0 3px 6px hsla(0,0%,0%,.10);
/*         */ 0 15px 25px hsla(0,0%,0%,.15), 0 5px 10px hsla(0,0%,0%,.05);
/* highest */ 0 20px 40px hsla(0,0%,0%,.2);
```
- **Why:** The two parts do two different jobs. The cast shadow is thrown behind the object by direct light. The contact shadow is the area underneath that even ambient light cannot reach, and it keeps the edges defined. Which one is darker depends on elevation. At rest the contact shadow is the darker of the two (`.24` against the cast shadow's `.12`). As the object lifts, the contact shadow fades and ends up lighter, until at the top of the scale it is gone entirely.
- **When not to:** When shadows are incidental, the five-elevation scale is the default. At the lowest elevations the two shadows converge in geometry (`0 1px 3px` plus `0 1px 2px`) and the technique buys little beyond a slightly crisper edge.
- **Pitfall:** Do not fix the alphas. Let them cross over, and keep both inside `.05` to `.25`, because anything heavier reads as a smudge.
- **Support:** Judgment, no version gate.
- **See also:** [tokens.css](../assets/tokens.css) holds the single-shadow default this scale replaces.

### V24. Layered three-part set and pick one

- **Rule:** A third option is a layered set of three shadows with increasing blur and decreasing opacity:
```css
box-shadow:
  0 1px 2px  rgba(17, 24, 39, .06),
  0 4px 8px  rgba(17, 24, 39, .04),
  0 12px 24px rgba(17, 24, 39, .03);
```
Pick one system per project. Use five-elevation when shadows are incidental. Use two-part when elevation is a real signal and press or drag states change it. Use layered when the surface treatment is itself the design and the shadows are close to invisible individually.
- **Why:** The three systems are parallel, not compatible. Mixing them in one project makes elevation unreadable.
- **When not to:** A single project never needs two of them. There is no surface that needs both.
- **Pitfall:** Porting an alpha from one system into another breaks it. A single shadow carrying all the depth needs roughly `.2`, while three stacked shadows each carry a fraction and sit near `.03` to `.06`.
- **Support:** Judgment, no version gate.
- **See also:** [tokens.css](../assets/tokens.css) holds the five-elevation set.

### V25. Shadow colour

- **Rule:** The five-elevation scale uses `hsla(0,0%,0%,.2)`, pure black at low alpha. The layered system uses a deep neutral such as `rgba(17, 24, 39, .06)`. Tint the shadow toward the surface's own hue, in practice a dark step from the project's grey ramp rather than `hsl(0,0%,0%)`, whenever the surface under it is anything other than near-white. On a white page, keep the simpler black-alpha values.
- **Why:** Over a white or near-white page, black at low alpha resolves to a neutral grey and is indistinguishable from a tinted shadow. Over a tinted, saturated or dark surface it is not. Black desaturates whatever it falls on, so the shadow reads as a grey smudge sitting on a coloured ground rather than as an absence of light.
- **When not to:** On a white page the simpler black-alpha values are correct.
- **Pitfall:** A tinted shadow on a white page adds work with no visible gain.
- **Support:** Judgment, no version gate.
- **See also:** [tokens.css](../assets/tokens.css) carries the black-alpha default.

### V26. Button anatomy

- **Rule:** A button that reads as a physical object stacks six treatments rather than one shadow: an outer hairline cut that seats it into the surface, an inset ambient highlight on all sides, an inset top highlight for the light from above, at least three external depth shadows, a text drop-shadow for contrast against the fill and a gradient so subtle that noticing it means it is too strong.
```css
.button {
  background: linear-gradient(to bottom,
    color-mix(in srgb, var(--grey-900) 100%, white 4%), var(--grey-900));
  color: var(--grey-100);
  box-shadow:
    0 0 0 0.5px hsla(0,0%,0%,.3),               /* cut into the surface */
    inset 0 0 0 1px hsla(0,0%,100%,.04),        /* ambient highlight */
    inset 0 1px 0 hsla(0,0%,100%,.07),          /* light from above */
    0 1px 2px hsla(0,0%,0%,.1),
    0 2px 4px hsla(0,0%,0%,.06),
    0 4px 8px hsla(0,0%,0%,.03);
  text-shadow: 0 1px 1px hsla(0,0%,0%,.15);
}
```
- **Why:** A real object seats into a surface, catches ambient and top light, casts layered shadows and keeps its label legible against the fill. The gradient adds a slight top-to-bottom shift that the eye reads as curvature.
- **When not to:** This is the layered system, so a project using it commits to layered elevation everywhere. It is worth the commitment only when buttons are a signature surface. A project where shadows are incidental should stay on the five-elevation scale and skip this.
- **Pitfall:** A gradient strong enough to notice is too strong.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-hierarchy.md](web-visual-hierarchy.md) covers the primary-action treatment this anatomy supports.

### V27. Depth without shadows

- **Rule:** Use colour, solid shadows and overlap. Lighter feels closer and darker feels further away. A short vertical offset with zero blur, such as `0 3px 0 hsl(220,7%,83%)`, lifts a card off the page without breaking a flat aesthetic. Overlap is the strongest cue. Offset a card so it straddles two background sections with `margin-bottom: -60px`, or make an element taller than its parent with `margin: -60px 0`. At component scale, pull carousel arrows outside the visible panel with negative margins.
- **Why:** Flat design still conveys depth with different cues, and overlap is the strongest of them.
- **When not to:** A surface that already uses shadows does not need a second depth language.
- **Pitfall:** When overlapping images, give them a border in the page background colour. That invisible border guarantees a visual gap so the images never clash.
- **Support:** Judgment, no version gate.
- **See also:** [web-layout-and-sizing.md](web-layout-and-sizing.md) covers overlap as a layout technique.

---

## 6. RADIUS, BORDERS AND COMPONENT SHAPE

### V28. Border radius and concentric radius

- **Rule:** Pick one radius and stay consistent. Small radius reads neutral, large reads playful and none reads serious or formal. Mixing square and rounded corners in one interface always looks worse. For nested elements, the inner radius equals the outer radius minus the padding between them:
```css
.outer {
  --padding: 8px;
  --inner-radius: 8px;
  border-radius: calc(var(--inner-radius) + var(--padding));
  padding: var(--padding);
}
.inner { border-radius: var(--inner-radius); }
```
- **Why:** Giving both the same radius produces curves that visibly do not run parallel. Deriving the outer radius from the inner one plus the padding keeps the relationship correct when either value changes.
- **When not to:** A full pill uses `--radius-full: 9999px` and has no meaningful inner radius.
- **Pitfall:** A 4px inner radius inside a 4px outer radius with 8px padding produces two curves that visibly disagree. The token file ships a 4px neutral default, `0` for formal and `12px+` for playful.
- **Support:** Judgment, no version gate.
- **See also:** [tokens.css](../assets/tokens.css) carries `--radius` and `--radius-full`.

### V29. Semi-transparent borders

- **Rule:** Prefer an alpha border over a hardcoded colour when a component appears on more than one background. Keep two border roles. A decorative divider can be a low-alpha neutral. A functional border such as an input outline or checkbox edge still has to clear 3:1 against every background it sits on.
- **Why:** A hardcoded border colour is tuned to exactly one background. An alpha border adapts to whatever sits behind it, which matters for a component that appears on the page, in a well and inside a modal.
- **When not to:** A border that is purely decorative has no contrast obligation, so a low-alpha neutral is enough.
- **Pitfall:** Alpha does not exempt a functional border from the measurement. It just means the measurement has to be taken more than once.
- **Support:** Judgment, no version gate.
- **See also:** [web-accessibility-patterns.md](web-accessibility-patterns.md) covers control boundaries.

### V30. Grids and fixed sizing

- **Rule:** Treat a grid as fluid percentage widths chosen from a constrained set, and do not use it where an element has an optimal fixed size. Sidebars get a fixed width sized to their contents, while the main area flexes and runs its own internal grid. Cards and forms get a `max-width` and shrink only when the viewport is actually smaller. Inside components, do not use a percentage unless the thing genuinely should scale.
- **Why:** Sizing a login card as "6 columns, then 8 columns at medium" produces the absurd result of the card being wider on medium screens than on large ones. Do not compromise a component's size until the screen actually forces it.
- **When not to:** A genuinely fluid region, such as a media strip that should fill its container, is the case percentages are for.
- **Pitfall:** When a component wants to stay narrow but sits in a wide layout, do not stretch it to fill the space. Split the supporting content into its own column instead, such as a hint or error message beside the input rather than wrapped under it.
- **Support:** Judgment, no version gate.
- **See also:** [web-layout-and-sizing.md](web-layout-and-sizing.md) covers grid tracks and intrinsic sizing.

### V31. Component shape

- **Rule:** Break the default component shape when the inherited picture is the only thing holding it back. A dropdown is a floating box, so it can have sections, multiple columns, icons, descriptions under each item and a "NEW" badge. A table column does not have to hold one field, so merge a non-sortable column into a related one, such as name over role or amount over policy type, and add avatars and coloured status pills. A radio group that decides something central can become selectable cards showing the actual differences.
- **Why:** Most components look generic because of an inherited mental picture, not a constraint. Constraints are powerful, but a design occasionally needs freedom from an assumption nobody checked.
- **When not to:** A platform control with a fixed contract, such as a native select on a small screen, should keep its expected shape.
- **Pitfall:** Adding sections or columns to a dropdown without a grouping rule turns it into a maze.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-hierarchy.md](web-visual-hierarchy.md) covers grouping and emphasis.

---

## 7. IMAGES AND MEDIA

### V32. Text over photos

- **Rule:** Reduce the image's dynamics rather than hunting for one text colour that works everywhere. Use a semi-transparent overlay, such as `hsla(0,0%,0%,.55)` for light text or white for dark text. Or lower the image's contrast and raise brightness to compensate, with brightness `+40%` and contrast `-70%` as a reasonable start before adjusting by eye. Or colourise: lower contrast, desaturate, then a solid fill in `multiply` blend mode. Or use a text-shadow as a glow with a large blur and no offset: `text-shadow: 0 0 50px hsla(0,0%,0%,.4)`.
- **Why:** Photos have bright and dark regions, so no single text colour works everywhere. The glow preserves the most of the photo.
- **When not to:** A photo with a naturally even, dark or light field may need no treatment.
- **Pitfall:** A weak overlay leaves the text legible in one region and lost in another.
- **Support:** Judgment, no version gate.
- **See also:** [web-accessibility-patterns.md](web-accessibility-patterns.md) covers text contrast.

### V33. Intended size for icons and screenshots

- **Rule:** Draw or place every asset at its intended size. Icons drawn for 16 to 24px look chunky and detail-starved at 48px, and icons drawn large look choppy when shrunk. If small icons are all that exists, put them at their real size inside a larger coloured shape. For screenshots, capture a smaller viewport, crop to one region or draw a simplified illustration. Never shrink a full desktop screenshot by 70%. For favicons, redraw a simplified mark at the target size rather than letting the browser downscale the logo.
- **Why:** Every asset has a size it was drawn for, and scaling far from that size loses either detail or crispness.
- **When not to:** A vector icon designed for a wide size range can scale within that range.
- **Pitfall:** A downscaled screenshot keeps the layout but loses every label.
- **Support:** Judgment, no version gate.
- **See also:** [web-performance-and-loading.md](web-performance-and-loading.md) covers image loading.

### V34. User-uploaded content and photography

- **Rule:** Contain user-uploaded content in fixed-size containers with `background-size: cover`, cropping the overflow. Prevent background bleed, where a user photo's edges match the UI background, with a subtle inset shadow such as `box-shadow: inset 0 0 0 1px hsla(0,0%,0%,.1)` rather than a border. For photography itself, use a photographer or good stock and never design against placeholders while planning to shoot something on a phone later.
- **Why:** User content cannot be controlled, so it must be contained. Borders clash with the image's own colours, while nobody notices the shadow. Bad photography ruins an otherwise good design.
- **When not to:** A deliberately full-bleed hero image still needs its text treatment from V32.
- **Pitfall:** A border on a user photo fights the photo's own colours and reads as part of the image.
- **Support:** Judgment, no version gate.
- **See also:** [web-performance-and-loading.md](web-performance-and-loading.md) covers media loading.

---

## 8. DESIGN TOKENS AND ROLES

### V35. Reference roles, not raw ramps

- **Rule:** Components reference semantic roles, never raw ramps. The role layer is what makes a dark-mode block work, because the dark override redefines only the roles. A component that points at `--text-secondary` follows automatically, while a component pointing at `--grey-700` does not:
```css
/* Right - follows the mode */
.card { background: var(--surface-raised); color: var(--text-primary); }

/* Wrong - locked to light mode */
.card { background: #fff; color: var(--grey-900); }
```
- **Why:** Copy the token file in and retune the hues. The file groups its custom properties by scale, from `--space-1` through `--space-16` and `--text-xs` through `--text-7xl` to the semantic roles. It is not a theme, a component library or a brand. It is the decisions, made once, with the hues chosen to be replaced. Re-deriving the scales from prose wastes the work already done and reintroduces the ad hoc values the system exists to eliminate.
- **When not to:** A project with an established token layer keeps its own roles. The rule is the indirection, not these names.
- **Pitfall:** A raw ramp reference is locked to one mode and silently ignores the dark override.
- **Support:** Judgment, no version gate.
- **See also:** [tokens.css](../assets/tokens.css) carries the role layer and the dark-mode block.

### V36. Decorative and functional borders

- **Rule:** Keep `--border` decorative and `--border-strong` functional. `--border` covers dividers and separators at about 1.3:1 and has no contrast obligation. `--border-strong` covers input outlines, checkbox edges and focus rings. Anything that is the only thing identifying a control needs 3:1 against its background under WCAG 1.4.11.
- **Why:** Collapsing them into one token either makes dividers too loud or makes controls unidentifiable.
- **When not to:** A project with no decorative dividers can keep only the functional role.
- **Pitfall:** The pair is the one most often collapsed by mistake.
- **Support:** Judgment, no version gate.
- **See also:** [web-accessibility-patterns.md](web-accessibility-patterns.md) and [tokens.css](../assets/tokens.css).

### V37. Which grey carries which text

- **Rule:** Use the grey ramp by role, not interchangeably. `--grey-400` at 2.7:1 is disabled text only. WCAG exempts inactive components, but it does not exempt placeholders, which are active content. `--grey-500` at 3.9:1 is large text only, meaning 24px regular or 18.66px bold, and is not safe for a 12px eyebrow label. `--grey-600` at 5.6:1 is tertiary text such as footnotes and copyright. `--grey-700` at 8.0:1 is secondary text. `--grey-900` at 13.4:1 is primary text. On pure white each ratio is about 10% higher than these figures.
- **Why:** Each step has a verified role. The three-text-colour maximum maps to `--text-primary`, `--text-secondary` and `--text-tertiary`, and all three carry body-size text, so all three clear 4.5:1. That is why tertiary is `--grey-600` and not something paler.
- **When not to:** A value on a non-white surface needs its own measurement against that surface.
- **Pitfall:** Using `--grey-400` for a placeholder makes active content look disabled and fails 4.5:1.
- **Support:** Judgment, no version gate.
- **See also:** [tokens.css](../assets/tokens.css) carries the measured ratios in comments.

### V38. Retuning the token file for a project

- **Rule:** Change the primary hue first, rotating all nine `--primary-*` shades together and keeping their lightness and saturation relationships intact. Re-check the base, because `--primary-500` must still work as a button background with white text and different hues need different lightness to do that. Decide grey temperature, moving cool greys at hue 209 to 212 to warm greys at about 39 to 41 while keeping the saturation pattern. Keep saturation rising toward the ends. Expand accents only when used heavily, since the `100/500/800` trio covers pills, badges and alerts and a full nine-shade ramp is worth building only when a colour carries a real surface. Re-verify every text and surface pair after retuning.
- **Why:** The shipped ratios are measured against the shipped values, and a hue rotation changes them. Retuning the hues keeps the work already done. Re-deriving the scales from prose wastes it and reintroduces ad hoc values.
- **When not to:** A project with its own verified ramp does not start from this file.
- **Pitfall:** A rotation that preserves lightness can still break the button background test. Verify rather than assuming. The deliberate sub-threshold values, disabled text, decorative dividers and the large-text-only step, are exempt by criterion and commented inline in the file. Keep the comments when copying because they are why the next person does not "fix" a value that is correct.
- **Support:** Judgment, no version gate.
- **See also:** [tokens.css](../assets/tokens.css) and [web-accessibility-patterns.md](web-accessibility-patterns.md).

---

## 9. HARD RULES

### V39. ALWAYS

- **Rule:** Seven rules always hold.
  1. Pick values from the scales in this file. A value off the scale is the defect these rules exist to prevent, and timing is a scale too.
  2. Put more space around a group than within it. For bullet lists, the gap must exceed the line-height.
  3. Meet 4.5:1 for normal text. Meet 3:1 for large text at 24px regular or 18.66px bold. Meet 3:1 for functional non-text under WCAG 1.4.11. A hairline that merely divides content has no such obligation, and text and non-text are two different tokens.
  4. Give large elements a faster shrink rate across breakpoints than small ones. A 2.5em headline over 14px mobile body text computes to 35px, which is far too big, so it wants 20 to 24px there. A button's padding should get proportionally tighter as the button shrinks, not scale with its font size.
  5. Add a second signal alongside colour, such as an icon, a shape or a text cue. For charts, distinguish series by contrast, using light to dark shades of one colour, because colourblind users read lightness reliably and hue unreliably.
  6. Give interactive elements their full state set: hover, focus, active and disabled, plus loading and error where they apply. The `:active` state needs a scale transform, or the element feels unresponsive under a finger.
  7. Read the matching reference before acting, and map the request to a stated cause first. Changing UI from a vague complaint without mapping it to a cause is a guess.
- **Why:** These are the failure modes that make a correct-looking interface read as amateur or behave as broken.
- **When not to:** Never. A deviation is stated with its reason rather than taken silently.
- **Pitfall:** The most common miss is treating timing or opacity as exempt from the scale rule.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-hierarchy.md](web-visual-hierarchy.md) and [web-accessibility-patterns.md](web-accessibility-patterns.md).

### V40. NEVER

- **Rule:** Seven rules never yield.
  1. Never put grey text on a coloured background. Grey on white works because it reduces contrast, while grey on colour just looks dirty. White at reduced opacity looks washed out and disabled and lets patterns show through the glyphs. Hand-pick a colour at the background's hue, adjusting saturation and lightness.
  2. Never use `em` for the type scale. Use `px` or `rem`, because `em` compounds through nesting and silently produces values that are not on the scale. The exception is line length, where `max-width` in `em` is correct.
  3. Never generate shades at runtime with `lighten()` or `darken()`. Define every shade up front or the palette drifts into dozens of near-identical colours.
  4. Never use a percentage width for something that should not scale. Sidebars get fixed widths and the main area flexes. Elements get a `max-width` and shrink only when the screen is actually smaller, so a login card must not be wider at medium screens than at large.
  5. Never scale an icon far from its intended size. A 16 to 24px icon at 48px looks chunky and detail-starved. Put it at its real size inside a coloured circle instead.
  6. Never animate high-frequency interactions or keyboard navigation. Focus movement is instant, and a search input that animates on every keystroke is a tax paid on every keystroke.
  7. Never mix two systems of the same kind in one project, such as the five-elevation and two-part shadow scales or two sets of motion durations. Parallel systems make the thing they encode unreadable.
- **Why:** Each rule names a specific way a value system collapses.
- **When not to:** Never within one project. An established system that supersedes these defaults is the only replacement, and it replaces the whole set rather than one rule.
- **Pitfall:** Focus styling is not here by omission. A5 in [web-accessibility-patterns.md](web-accessibility-patterns.md#a5-focus-visible-styling) owns the visible replacement for a removed outline.
- **Support:** Judgment, no version gate.
- **See also:** [web-accessibility-patterns.md](web-accessibility-patterns.md) and [web-motion-and-interaction.md](web-motion-and-interaction.md).

### V41. ESCALATE IF

- **Rule:** Five cases stop for a decision.
  1. ESCALATE IF an existing design system or measured reference conflicts with these defaults. The established system wins. Ask which one governs before overwriting tokens, and say which values would change.
  2. ESCALATE IF a brand colour cannot reach 4.5:1 in its required role. Both escape hatches are in V18, but changing a brand colour is the operator's decision.
  3. ESCALATE IF the request implies a redesign wider than the named surface. A value fix often wants to touch competing elements outside the stated scope. Name what would need to change and get agreement first.
  4. ESCALATE IF the complaint stays vague after it is mapped to a cause. Ask which specific element feels wrong and what it should communicate instead, rather than restyling broadly.
  5. ESCALATE IF a review finds accessibility defects the requester did not ask about. Report them and do not silently fix code outside the requested scope.
- **Why:** Each case changes a decision that belongs to the operator or to a system the project already chose.
- **When not to:** A local value inside the stated scope that these rules already decide needs no escalation.
- **Pitfall:** Silently fixing an unrequested defect hides a change the operator never approved.
- **Support:** Judgment, no version gate.
- **See also:** [web-visual-hierarchy.md](web-visual-hierarchy.md) and [web-accessibility-patterns.md](web-accessibility-patterns.md).

---

## 10. REFERENCES AND RELATED RESOURCES

- [tokens.css](../assets/tokens.css) carries every scale in this file as custom properties, including the role layer and the dark-mode block.
- [web-visual-hierarchy.md](web-visual-hierarchy.md) covers visual order, emphasis and the weight-versus-contrast trade.
- [web-motion-and-interaction.md](web-motion-and-interaction.md) covers easing curves, springs, staging and when to animate.
- [web-accessibility-patterns.md](web-accessibility-patterns.md) covers focus styling, widget contracts and contrast-sensitive controls.
