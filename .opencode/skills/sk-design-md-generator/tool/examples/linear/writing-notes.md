# Writing Notes: Linear DESIGN.md

Annotations explaining key writing decisions in the Linear gold standard example.

---

## Opening Sentence

The opening -- "Linear's website is a masterclass in dark-mode-first product design -- a near-black canvas (`#08090a`) where content emerges from darkness like starlight" -- was chosen because it satisfies three requirements simultaneously:

1. **Essence capture**: "dark-mode-first" immediately distinguishes Linear from sites that bolt on a dark theme. This is darkness as the native medium.
2. **Unique metaphor**: "content emerges from darkness like starlight" gives a mental image that survives comparison with the real site -- sparse bright elements on a near-black field.
3. **Specificity test**: This sentence could not describe Vercel (monochrome but not dark-native), Stripe (light-first), or Notion (warm neutral). It passes the "could this describe three other sites?" gate.

The em-dash structure (`[framing] -- [elaboration]`) introduces a tension: "masterclass" sets high expectations, then the elaboration justifies them with the specific hex value `#08090a` and the starlight metaphor.

---

## Color Naming Strategy for Dark-Mode-First

Naming dark-mode colors is harder than light-mode because the conventional vocabulary breaks down. "Background" is ambiguous when there are four background levels. The strategy used here:

- **Marketing Black** (`#08090a`): Named for its usage context (marketing pages), not its visual quality. Avoids generic "Dark Background" which would collide with the other three dark levels.
- **Panel Dark** (`#0f1011`): Named for structural role (panels, sidebars) -- distinguishes it from the canvas-level black.
- **Surface Dark** (`#161718`), **Elevated Surface** (`#202122`), **Secondary Surface** (`#28282c`): Progressive naming that implies the luminance ladder. "Elevated" signals its position in the stacking order.
- **Primary/Light/Silver/Tertiary/Quaternary Text**: The text scale uses conventional ordinal naming because the four-step text hierarchy is the system's core organizing principle. Adding personality names would obscure the ladder.
- **Workflow Colors**: Grouped separately because they serve a different purpose (status/category) than the achromatic UI chrome. Named by visual impression ("Soft Green", "Sky Blue", "Hot Pink") because workflow colors carry personality -- they identify categories in the product UI.

The key decision: avoid the word "gray" for dark backgrounds. `#08090a` is not gray -- it is near-black. `#202122` is not gray -- it is dark charcoal. "Gray" starts at the text colors (`#62666d` and above). This prevents the common confusion of calling everything on the dark end "gray."

---

## Atmospheric Description and Linear's Identity

The atmosphere section captures three layers of Linear's identity:

1. **Precision engineering** (paragraph 1): Linear markets itself as a tool built by engineers for engineers. The prose mirrors this with technical language -- "calibrated hierarchy of luminance," "subtle gradations of white opacity." The vocabulary matches the product's self-image.
2. **The 510 weight as signature** (paragraph 2): Most design system descriptions would skip over a non-standard font weight. The 510 weight is Linear's most distinctive typographic choice -- it creates the feeling of care and intentionality that separates Linear from tools using standard 400/500/600 weights.
3. **Chromatic restraint** (paragraph 3): The single-accent-color observation defines the entire visual system. Saying "almost entirely achromatic" and then naming the one exception (`#5e6ad2`) gives the reader the complete color strategy in two sentences.

The three paragraphs follow the writing guide's zoom pattern: canvas (macro) > letterforms (meso) > accent philosophy (micro).

---

## Do's and Don'ts Decisions

The strongest entries are the counter-intuitive ones:

- **"Don't use solid colored backgrounds for buttons"**: Every developer's instinct is to give buttons a solid `background-color`. Linear's entire button system runs on `rgba(255,255,255,0.05)` -- near-zero white opacity. This is the single most likely mistake an implementer would make.
- **"Don't use weight 700 (bold)"**: Developers default to `font-weight: bold` for emphasis. Linear's maximum is 590, with 510 as the workhorse. Without this warning, every heading would be too heavy.
- **"Don't use pure white (#ffffff) as primary text"**: `#f7f8f8` has 25,002 frequency in the token data vs. occasional `#ffffff`. The near-white prevents eye strain -- a subtle but critical difference on dark backgrounds.
- **"Don't skip the OpenType features"**: The temptation to skip `font-feature-settings` is strong because Inter looks fine without it. But `cv01` and `ss03` are what make it Linear's Inter, not generic Inter.

Weaker alternatives that were excluded: "Don't use too many colors" (obvious, not system-specific), "Don't forget accessibility" (generic web advice, not a design system rule), "Don't make text too small" (no threshold, applicable to everything).

---

## Agent Prompt Guide Self-Containment

Each prompt was tested against the self-containment requirement: could a developer copy exactly one prompt into an AI tool and get a correct component?

Key decisions:

- **Every prompt includes `font-feature-settings: 'cv01', 'ss03'`** even though it is repetitive. Without this, an AI would use vanilla Inter, which looks visibly different.
- **Shadow stacks are written in full** rather than referencing "the standard shadow." The command palette prompt includes the complete four-layer shadow value because an agent has no ability to "look up" a reference.
- **Letter-spacing is always specified alongside font-size** because the two are coupled in Linear's system. Providing size without tracking would produce incorrect results at every display level.
- **Colors use hex values, not semantic names** like "brand indigo." An AI tool does not know what "brand indigo" resolves to. The hex is the only unambiguous reference.
- **Transition values are included** where they define the component's feel. The ghost button's `cubic-bezier(0.25, 0.46, 0.45, 0.94)` easing was extracted directly from the tokens.json component data.

The Quick Color Reference uses a flat list with no grouping because its purpose is fast lookup, not education. A developer scanning for "what color is body text?" needs `#d0d6e0` in under three seconds.

---

## Typography Table Construction

The typography table has 25 rows, exceeding the spec's 12-20 range, but this is justified by Linear's unusually granular weight system. Most design systems have 3-4 weights at each size. Linear uses three weights (400, 510, 590) at multiple sizes, plus a rare 300 weight for chat-style de-emphasis. Each row represents a genuinely distinct typographic role observed in the tokens.json `typographyLevels` array.

Key construction decisions:

- **Roles are named for function, not size**: "Nav Item" and "Nav Emphasis" rather than "13px Regular" and "13px Medium." This helps a developer find the right style by intent.
- **Berkeley Mono gets three dedicated rows**: Code typography is a first-class concern in a developer tools product. Separating Mono Body (14px), Mono Caption (13px), and Mono Label (12px) reflects the three distinct code typography contexts observed in the extraction.
- **Line height uses unitless ratios**: The tokens.json provides line-height in px (e.g., `24px` for `16px` font = 1.50 ratio). The table converts to unitless ratios for implementation portability, with descriptors for extremes: `1.00 (tight)` and `1.60 (relaxed)`.
- **The `text-transform: uppercase` note**: Only two typography levels use uppercase (Tiny at 10px and Mono Label at 12px). This is noted in the table rather than in prose because it is a property of those specific levels, not a system-wide principle.

---

## Depth Section Philosophy

The shadow philosophy paragraph addresses the fundamental challenge of dark-mode elevation: shadows are dark-on-dark and therefore invisible. Rather than listing this as a limitation, the DESIGN.md frames it as the design problem that Linear's system solves, then names the two solutions:

1. **Semi-transparent white borders** as depth indicators (light-on-dark is visible)
2. **Background luminance stepping** where elevation = brighter surface via white opacity

The four-layer CTA button shadow stack deserves special attention because it combines both inset white highlights and outer dark rings -- a technique that creates a three-dimensional bevel effect that would be impossible with traditional single-layer shadows. This is the kind of system-specific detail that separates useful documentation from generic guidance.

---

## Token Data Sourcing

Every hex value in the DESIGN.md comes from the `colorTokens` array in tokens.json. Every typography value comes from `typographyLevels`. Every shadow value comes from `shadowTokens`. Every radius value comes from `radiusTokens`. The component styling section cross-references `components` variant data for exact background colors, border values, and transition timing functions.

Values from the reference DESIGN.md that did not appear in the extracted tokens.json (e.g., `#7170ff`, `#828fff`, `#010102`, `#7a7fad`, `rgba(255,255,255,0.02)`) were excluded from this version. The gold standard must be reproducible from the extraction pipeline's actual output.

---

## Differences from the Reference DESIGN.md

The reference file in `/tmp/awesome-design-md/` includes values that were manually observed or inferred but not present in the automated extraction output. This gold standard intentionally restricts itself to token-sourced values to serve as a realistic benchmark for what the generator pipeline can produce. Key differences:

- **Fewer accent color variants**: The reference includes `#7170ff` (accent violet) and `#828fff` (accent hover) which were not captured in the extraction. The gold standard uses `#6d78d5` and `#8fa4ff` which are the closest indigo-violet variants actually present in `colorTokens`.
- **Component section is leaner**: The reference describes six button variants; the gold standard documents the three variants (`Ghost`, `Secondary`, `Primary`) plus one structural pattern (`Circle`) found in the `components` array. This reflects extraction reality.
- **No Section 6.5 (Motion)**: While transitions are documented per-component (e.g., `background 0.16s cubic-bezier(...)`) from the component data, no standalone motion tokens were extracted, so the optional section is correctly omitted.
