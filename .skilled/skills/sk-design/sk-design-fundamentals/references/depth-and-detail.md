---
title: Depth and Detail Techniques
description: Emulating a light source, two-part shadows, flat depth cues, baseline alignment, letter-spacing, typeface selection, grids, component shape, and handling images.
trigger_phrases:
  - "emulate a light source css"
  - "two part box shadow"
  - "raised and inset elements"
  - "choose a typeface for ui"
  - "text over photos readable"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Depth and Detail Techniques

The techniques that turn a correctly-scaled layout into something that looks finished: light, shadow, alignment, type detail, and images.

---

## 1. OVERVIEW

### Core Principle

Borrow the real-world cue and stop. Depth comes from mimicking one light source consistently, not from chasing photorealism.

### When to Use

- An element needs to read as raised, inset, or pressed.
- Shadows are prominent in the design and the five-elevation default is not enough.
- Typography looks subtly wrong at the detail level: mixed sizes on a line, all-caps labels, headline tracking.
- A component looks generic and nobody can say why.
- Images, screenshots, icons or user-uploaded content are breaking the layout.

### Prerequisites

The default five-elevation shadow scale is in `SKILL.md` Section 3. Section 3 of this document gives the refined two-part alternative. The two are parallel systems — never mix them in one project.

---

## 2. EMULATING A LIGHT SOURCE

Raised and inset are the same trick: decide the element's **profile**, then mimic how light would hit that shape. Light comes from above, and people look slightly *down* at their screens, so the top edge of a raised element is visible and the bottom edge of an inset one is.

Each element needs **both** effects — the lit edge and the blocked light. They go in a single comma-separated `box-shadow`. Two `box-shadow` declarations on one selector do not combine; the second silently discards the first.

**Raised**, for a button or card: lit top edge, shadow cast below.

```css
box-shadow:
  inset 0 1px 0 hsl(224, 84%, 74%),   /* top edge, angled toward the light */
  0 1px 3px hsla(0, 0%, 0%, .2);      /* light blocked beneath the element */
```

**Inset**, for a well, text input or checkbox: lit bottom lip, shadow blocked at the top. The lip must be **lighter than the element's own face**, so the values depend entirely on how dark that face is.

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

Copying dark-surface values onto a white input paints a dark line along the bottom, which reads as a stray border — the opposite of the intended cue. Always check the lip against the face.

Both lit edges are `inset`. A non-inset shadow with a negative Y offset draws *above* the element, not on its bottom lip.

Two rules govern the lit edge:

- **Hand-pick the lighter color** rather than overlaying semi-transparent white. White overlays drain the saturation out of the underlying color, which is why both examples above use a solid `hsl()` sampled from the element's own hue. On a neutral grey or near-black surface there is no saturation to lose, so `hsla(0,0%,100%,.15)` is fine there.
- **Keep blur radii tiny.** These edges are sharp in the real world, like the shadow under a wall outlet.

---

## 3. TWO-PART SHADOWS

Good shadows are usually two shadows doing two different jobs.

- **Cast shadow**: larger and softer, bigger Y offset and blur. The shadow thrown behind the object by direct light.
- **Contact shadow**: tighter, small offset and blur. The area *underneath* the object that even ambient light cannot reach. This is what keeps the element's edges defined.

```css
box-shadow:
  0 10px 20px hsla(0, 0%, 0%, .15),  /* cast    - larger, softer */
  0 3px 6px   hsla(0, 0%, 0%, .10);  /* contact - tighter, sharper */
```

The two parts must differ *substantially* in offset and blur or the effect is invisible — about a threefold difference in both, as above.

**Which one is darker depends on elevation, and that is the whole point.** At rest on the surface the contact shadow is the darker of the two (`.24` against the cast shadow's `.12`). As the object lifts, the contact shadow fades out and ends up lighter, until at the top of the scale it is gone entirely. Do not fix the alphas; let them cross over. Keep both inside `.05` to `.25`, because anything heavier reads as a smudge.

```css
/* lowest  */ 0 1px 3px hsla(0,0%,0%,.12), 0 1px 2px hsla(0,0%,0%,.24);
/*         */ 0 3px 6px hsla(0,0%,0%,.15), 0 2px 4px hsla(0,0%,0%,.12);
/*         */ 0 10px 20px hsla(0,0%,0%,.15), 0 3px 6px hsla(0,0%,0%,.10);
/*         */ 0 15px 25px hsla(0,0%,0%,.15), 0 5px 10px hsla(0,0%,0%,.05);
/* highest */ 0 20px 40px hsla(0,0%,0%,.2);
```

Distinct at the lowest elevation, gone entirely at the highest — lift an object off a desk and the dark contact shadow disappears first.

The tradeoff: at the lowest elevations the two shadows converge in geometry (`0 1px 3px` plus `0 1px 2px`) and the technique buys little beyond a slightly crisper edge. That is why the plain five-elevation scale in `SKILL.md` remains the default when shadows are not prominent in the design.

### Three parallel systems, pick one

There is also a **layered** system — three shadows with increasing blur and decreasing opacity, mimicking how real light falls off:

```css
box-shadow:
  0 1px 2px  rgba(17, 24, 39, .06),
  0 4px 8px  rgba(17, 24, 39, .04),
  0 12px 24px rgba(17, 24, 39, .03);
```

That makes three systems in this skill: the **five-elevation** single shadow in `SKILL.md`, the **two-part** cast-plus-contact scale above, and this **layered** three-part set. They are parallel, not compatible, and mixing them in one project makes elevation unreadable — the same rule that applies between the first two.

Choose by how much work shadows do in the design. Five-elevation when they are incidental. Two-part when elevation is a real signal and press or drag states change it. Layered when the surface treatment is itself the design and the shadows are close to invisible individually.

### Shadow color, and the pure-black question

The five-elevation scale uses `hsla(0,0%,0%,.2)` — pure black at low alpha. The layered system above deliberately does not, using a deep neutral (`rgba(17,24,39,…)`) instead, on the grounds that pure black reads harsh and artificial.

Both are right about different surfaces. Over a white or near-white page, black at low alpha resolves to a neutral grey and is indistinguishable from a tinted shadow. Over a **tinted, saturated or dark** surface it is not: black desaturates whatever it falls on, so the shadow reads as a grey smudge sitting on a colored ground rather than as an absence of light.

The rule: **tint the shadow toward the surface's own hue** — in practice, a dark step from the project's grey ramp rather than `hsl(0,0%,0%)` — whenever the surface under it is anything other than near-white. On a white page, keep the simpler black-alpha values.

The alpha difference between the two systems is not a disagreement. A single shadow carrying all the depth needs roughly `.2`; three stacked shadows each carry a fraction, which is why they sit near `.03` to `.06`. Do not port an alpha from one system into the other.

### Animating a shadow

Transitioning `box-shadow` directly forces an expensive repaint on every frame. Put the target shadow on a pseudo-element and animate its `opacity` instead:

```css
.card { position: relative; box-shadow: var(--shadow-1); }
.card::after {
  content: ''; position: absolute; inset: 0; border-radius: inherit;
  box-shadow: var(--shadow-3); opacity: 0; transition: opacity 180ms ease;
  pointer-events: none;
}
.card:hover::after { opacity: 1; }
```

The duration belongs to the state-change band in [`motion-principles.md`](motion-principles.md) Section 5.

### Full button anatomy

A button that reads as a physical object stacks six treatments rather than one shadow: an outer hairline cut that seats it into the surface, an inset ambient highlight on all sides, an inset top highlight for the light from above, at least three external depth shadows, a text drop-shadow for contrast against the fill, and a gradient so subtle that noticing it means it is too strong.

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

This is the layered system, so a project using it commits to layered elevation everywhere. It is worth the commitment only when buttons are a signature surface; a project where shadows are incidental should stay on the five-elevation scale and skip this entirely.

---

## 4. DEPTH WITHOUT SHADOWS

Flat design still conveys depth; it uses different cues.

- **Color.** Lighter feels closer, darker feels further away. A white card on a grey page pops forward; a grey well on a white page recedes.
- **Solid shadows.** A short vertical offset with **zero blur** — `0 3px 0 hsl(220,7%,83%)` — lifts a card off the page without breaking the flat aesthetic.
- **Overlap.** The strongest cue of all. Offset a card so it straddles the boundary between two background sections (`margin-bottom: -60px`), or make an element taller than its parent so it breaks out on both sides (`margin: -60px 0`). It works at component scale too: pull carousel arrows outside the slide with negative margins.

When overlapping images, give them a border in the **page background color** — an invisible border that guarantees a visual gap so the images never clash.

---

## 5. TYPOGRAPHY DETAIL

### Baseline, not center

When two different font sizes sit on the same line — a card title and its "See all" action — vertical centering offsets their baselines and looks subtly wrong, especially when the sizes are close. Align to the baseline the eye is already reading from.

```css
align-items: baseline;
```

### Letter-spacing

Default to trusting the type designer. There are two exceptions.

- **Headline use of a body typeface.** Faces built for legibility at small sizes have wider tracking than faces built for headlines. Tighten by about `-0.05em` to get that condensed headline feel. The reverse does not work — a headline face does not become legible at small sizes just because it was loosened.
- **All-caps.** Lowercase letters vary in shape through ascenders, descenders and x-height, which is what makes them scannable. Caps are uniform blocks, so default tracking crowds them. Add about `+0.05em`.

### Line breaking

- **`text-wrap: balance` on headings.** Without it a headline commonly breaks into one long line and a short orphan. Balance evens the line lengths.
- **`text-wrap: pretty` on body text**, which reduces orphans without the cost of balancing every line.
- **Pair `text-align: justify` with `hyphens: auto`**, or do not justify. Justified text without hyphenation opens rivers of whitespace.

### Underlines and synthesis

- **Offset underlines below descenders** so they read as intentional: `text-underline-offset: 3px` with `text-decoration-skip-ink: auto`. A default underline collides with every `g`, `p` and `y`.
- **`font-synthesis: none`** where a face lacks a real bold or italic. A browser-faked weight is a smeared outline, and it also breaks the two-weight rule by inventing a third.
- **Leave `font-optical-sizing: auto`** so variable faces adapt their glyphs to the rendered size.

### Numerals

Use `font-variant-numeric: tabular-nums` wherever a digit change must not shift the layout: tables, dashboards, pricing, counters, timers. Use the default proportional figures in running prose, where tabular spacing looks mechanical.

For code-adjacent interfaces, a slashed zero removes the `0` versus `O` ambiguity, and a disambiguation stylistic set does the same for `I`, `l` and `1`.

### Choosing typefaces without taste

- Neutral sans-serif is the safe default. The system font stack is a legitimate choice: `-apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue`.
- **Ignore families with fewer than five weights.** Filtering a font library to 10 or more styles cuts about 85% of the options, and what remains skews toward carefully-made families.
- Optimize for legibility: taller x-height, wider default tracking. Avoid condensed faces with short x-heights for UI text.
- Sort by popularity. A widely used font is usually a good font. Inspect sites worth admiring.

---

## 6. PERSONALITY IS FOUR DECISIONS

Personality is not a vibe. It is four concrete levers.

1. **Typeface.** Serif reads elegant or classic. Rounded sans reads playful. Neutral sans reads plain and lets other elements carry the personality.
2. **Color.** Blue is safe and nobody objects. Gold reads expensive. Pink reads fun.
3. **Border radius.** Small is neutral, large is playful, none is formal. Be consistent.
4. **Language.** "Thank you Mr. Benson" versus "Sweet, thanks Steve!" changes the product's character more than any color choice.

If the decision will not come, look at the other sites the users spend time in. Do not imitate direct competitors, or the result looks like a lesser version of them.

---

## 7. LAYOUT AND COMPONENT SHAPE

### Grids are overrated

A grid is fluid percentage widths chosen from a constrained set. That is the wrong tool whenever an element has an optimal *fixed* size.

- **Sidebars** get a fixed width sized to their contents; the main area flexes and runs its own internal grid.
- **Cards and forms** get a `max-width` and shrink only when the viewport is actually smaller. Sizing a login card as "6 columns, then 8 columns at medium" produces the absurd result of the card being *wider* on medium screens than on large ones.
- Inside components, do not use a percentage unless the thing genuinely should scale.

Do not compromise a component's size until the screen actually forces it.

**Think in columns, not width.** When a component wants to stay narrow — a form field — but sits in a wide layout, do not stretch it to fill the space. Split the supporting content into its own column instead: a hint or error message beside the input rather than wrapped under it. That solves the "feels unbalanced" complaint without breaking the component's own sizing.

### Concentric radius

When a rounded element sits inside another, the inner radius must equal the outer radius **minus the gap between them**. Giving both the same radius produces curves that visibly do not run parallel.

```css
.outer {
  --padding: 8px;
  --inner-radius: 8px;
  border-radius: calc(var(--inner-radius) + var(--padding));
  padding: var(--padding);
}
.inner { border-radius: var(--inner-radius); }
```

Deriving the outer radius from the inner one plus the padding keeps the relationship correct when either value changes.

### Semi-transparent borders

A hardcoded border color is tuned to exactly one background. An alpha border adapts to whatever sits behind it, which matters for a component that appears on the page, in a well, and inside a modal.

This composes with the two border roles in `SKILL.md`: a decorative divider can be a low-alpha neutral, but a **functional** border still has to clear 3:1 against every background it will actually sit on. Alpha does not exempt it from the measurement; it just means the measurement has to be taken more than once.

### Break the default component shape

Most components look generic because of an inherited mental picture, not a constraint.

- **Dropdown**: it is just a floating box. Give it sections, multiple columns, icons, descriptions under each item, a "NEW" badge.
- **Table**: columns do not have to hold one field each. Merge a non-sortable column into a related one — name over role, amount over policy type — to create hierarchy. Add avatars and colored status pills.
- **Radio group**: if the choice is central to the page, make them selectable cards showing the actual differences, not a stack of circles.

Constraints are powerful, but a design occasionally needs freedom from an assumption nobody checked.

---

## 8. WORKING WITH IMAGES

### Text over photos

The problem is the image, not the text. Photos have bright and dark regions, so no single text color works everywhere. Reduce the image's dynamics:

- a semi-transparent overlay — `hsla(0,0%,0%,.55)` for light text, white for dark text
- lower the image's contrast, raising brightness to compensate; brightness `+40%` and contrast `-70%` is a reasonable start, then adjust by eye
- colorize: lower contrast, desaturate, then a solid fill in `multiply` blend mode
- a text-shadow used as a glow: large blur, no offset — `text-shadow: 0 0 50px hsla(0,0%,0%,.4)`

The glow preserves the most of the original photo.

### Everything has an intended size

Icons drawn for 16 to 24px look chunky and detail-starved at 48px; icons drawn large look choppy when shrunk. If small icons are all that exists, put them at their real size inside a larger colored shape.

For screenshots, capture a smaller viewport, crop to one region, or draw a simplified illustration. Never shrink a full desktop screenshot by 70%. For favicons, redraw a simplified mark at the target size rather than letting the browser downscale the logo.

### User-uploaded content

It cannot be controlled, so contain it.

- Fixed-size containers with `background-size: cover`, cropping the overflow.
- Prevent background bleed, where a user photo's edges match the UI background, with a subtle inset shadow — `box-shadow: inset 0 0 0 1px hsla(0,0%,0%,.1)` — rather than a border. Borders clash with the image's own colors; nobody notices the shadow.

### Photos themselves

Bad photography ruins an otherwise good design. Hire a photographer or use good stock. Never design against placeholders while planning to shoot something on a phone later.

---

## 9. REFERENCES AND RELATED RESOURCES

- [`color-system.md`](color-system.md) — picking the `hsl()` values the lit edges and solid shadows above sample from.
- [`diagnosis-table.md`](diagnosis-table.md) Sections 5 and 6 — the typography and image symptoms these techniques fix.
- [`../assets/tokens.css`](../assets/tokens.css) — the five elevations as custom properties, plus the role layer these techniques sit on top of.
