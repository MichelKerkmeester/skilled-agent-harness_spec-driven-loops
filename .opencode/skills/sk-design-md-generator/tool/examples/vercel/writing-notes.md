# Writing Notes: Vercel

Annotations explaining key writing decisions in the Vercel DESIGN.md gold standard. Use these notes to understand what makes a DESIGN.md go from "specification dump" to "publication-quality design documentation."

---

## Section 1: Visual Theme & Atmosphere

### Opening Sentence Choice

**Original:** "Vercel's website is the visual thesis of developer infrastructure made invisible -- a design system so restrained it borders on philosophical."

**Why this works:**
- "Visual thesis" frames the entire site as a deliberate argument, not a collection of choices. This tells the reader there is a unifying idea behind every decision.
- "Developer infrastructure made invisible" captures Vercel's actual product promise (deploy without thinking about servers) and maps it to the visual language (design without visible decoration).
- "So restrained it borders on philosophical" introduces productive tension. Restraint is common; philosophical restraint is a specific, memorable observation. It signals that the absence of color and ornament is not laziness -- it is the design.
- The em-dash structure (`[macro observation] -- [micro elaboration]`) follows the style guide's prescribed pattern and lets the reader absorb two ideas at different scales in one sentence.

**Alternative rejected:** "Vercel uses a clean, minimal design with a monochrome palette and custom fonts."

**Why it fails:** Five banned or near-banned words ("clean", "minimal", "design"), zero hex values, zero personality. This sentence describes Stripe, Linear, Apple, and any other monochrome site equally well. It passes the "could describe three other sites" test -- which means it fails the opening sentence test.

### Key Technique Highlighted

The atmosphere section highlights the **shadow-as-border technique** (`box-shadow: 0px 0px 0px 1px rgba(0,0,0,0.08)`) as the single most distinctive micro-decision. This was chosen over typography or color because:

1. Every developer would default to `border: 1px solid #ebebeb` -- the shadow technique is genuinely surprising.
2. It has cascading implications (box model behavior, transition smoothness, rounded corner rendering) that affect every component.
3. It is the technical decision that most separates Vercel from other monochrome systems.

Typography (Geist with negative tracking) is also distinctive but less counter-intuitive -- negative letter-spacing is well-known in display type.

---

## Section 2: Color Palette & Roles

### Color Naming Strategy

Colors are named with **brand-semantic names** ("Vercel Black", "Ship Red", "Preview Pink") rather than generic system names ("Primary Black", "Accent Red", "Secondary Pink").

**Why "Vercel Black" instead of "Primary Black":**
- "Vercel Black" instantly communicates that `#171717` is THE brand color. A developer encountering this name knows it is deliberate, not arbitrary.
- "Primary Black" implies a system with Secondary Black, Tertiary Black -- a generic naming scheme that says nothing about the color's identity.
- The name also signals that this is not pure black (`#000000`), which is a common mistake. "Vercel Black" invites the question "why not just black?" -- and the answer (micro-warmth, reduced harshness) is documented.

**Why workflow colors are grouped separately:**
The tokens.json data reveals three chromatic accents with near-identical frequency patterns: `#0068d6` (freq 44), `#bd2864` (freq 42), and `#e5484d` (freq 35). These are not general accent colors -- they map 1:1 to Vercel's Develop/Preview/Ship pipeline. Grouping them under "Workflow Accent Colors" communicates that they are **not available for decorative use**. This prevents the most common misuse of accent colors.

### Personality Descriptions

**Good example:** "Not pure black -- the slight warmth prevents harshness" (for `#171717`).

**What makes it work:**
- States what the color is NOT (pure black) before what it IS.
- "Slight warmth" is a measurable observation -- `#171717` has equal R/G/B channels (23,23,23), so "warmth" here means the perceptual softness of lifting off `#000000` by 23 units.
- "Prevents harshness" names the design intent. A developer now knows that if they accidentally use `#000000`, they will violate the system's micro-contrast principle.
- Entire personality is 10 words. No filler.

---

## Section 7: Do's and Don'ts

### Best Don't Example

**"Don't skip the inner `#fafafa` ring in card shadows -- it's the glow that makes the system work."**

**Why this is the strongest Don't in the document:**

1. **Counter-intuitive:** When building a card shadow, a developer will naturally add the border layer (`rgba(0,0,0,0.08) 0px 0px 0px 1px`) and the elevation layer (`rgba(0,0,0,0.04) 0px 2px 2px`). The inner `#fafafa` ring looks decorative and would be the first thing cut. This Don't warns against exactly the cut a competent developer would make.

2. **Has a specific value:** The Don't names the exact color (`#fafafa`) that must not be omitted. A developer can search for this value and verify their implementation.

3. **Helps an AI agent:** An AI generating a Vercel-style card would almost certainly produce a two-layer shadow and stop. This Don't ensures the three-layer stack (border + elevation + inner glow) is preserved, which is the signature that makes Vercel cards look built rather than floating.

### Rejected Don't (correctly excluded)

**"Don't forget about accessibility."**

This generic Don't was correctly excluded because:
- It applies to every design system ever created -- it is not Vercel-specific.
- It has no threshold, no value, no specific technique to implement.
- Accessibility guidance belongs in the focus ring spec and contrast pairs documentation, not in a vague Don't.

The Vercel DESIGN.md instead includes specific accessibility information inline: focus ring values (`hsla(212, 100%, 48%, 1)`), the contrast rationale for `#171717` vs `#000000`, and touch target padding values.

---

## Section 9: Agent Prompt Guide

### Self-Containment Check

**Selected prompt:** "Design a card: white background, no CSS border. Use shadow stack: rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px, #fafafa 0px 0px 0px 1px. Radius 8px. Title at 24px Geist weight 600, letter-spacing -0.96px. Body at 16px weight 400, #4d4d4d."

**Verification -- does it work without DESIGN.md context?**

Checklist of required values:
- Background color: yes (`white`)
- Border technique: yes (`no CSS border` + full shadow stack)
- Border radius: yes (`8px`)
- Title font: yes (family: `Geist`, size: `24px`, weight: `600`)
- Title letter-spacing: yes (`-0.96px`)
- Body font: yes (size: `16px`, weight: `400`)
- Body color: yes (`#4d4d4d`)
- Shadow values: yes (complete three-layer stack with exact rgba values)

**What makes it complete:** An AI receiving this prompt has zero ambiguity about any visual property. Every value that affects rendering is present. The prompt also includes the anti-pattern ("no CSS border") which prevents the most common implementation mistake.

**What would make it fail:** Removing the shadow stack and replacing it with "use the brand's shadow system" -- this forces the AI to look up values elsewhere, breaking self-containment.

---

## Section 3: Typography Rules

### Table vs. Prose Balance

The typography section uses a table for the hierarchy (21 rows of scannable data) and a Principles sub-section for the narrative. This division is deliberate:

- **Table**: every concrete value (size, weight, line-height, letter-spacing, features). A developer looking up "what weight for a card title?" scans the table in seconds.
- **Principles**: the design reasoning that tables cannot convey. "Compression as identity" explains WHY the letter-spacing is -2.88px, not just that it is. "Three weights, strict roles" explains the constraint system that makes individual values coherent.

The principles never restate the table. Instead they synthesize patterns across multiple table rows: the progressive tracking relaxation from -2.88px at 48px to normal at 16px, the weight ceiling of 600 for everything except micro-badges. Each principle paragraph contains 3-5 values as evidence, meeting the density target.

### Weight Naming

The document uses numeric weights exclusively (400, 500, 600, 700) and never writes "regular", "medium", "semibold", or "bold". This is mandated by the format spec, but it also serves a practical purpose: when an AI agent reads "weight 600", it can write `font-weight: 600` directly. "Semibold" requires a lookup table.

---

## Section 4: Component Stylings

### Shadow Stack Documentation

The most critical component detail is the full shadow stack for cards. The document reproduces the exact multi-value `box-shadow` string rather than describing it abstractly:

```
rgba(0, 0, 0, 0.08) 0px 0px 0px 1px,
rgba(0, 0, 0, 0.04) 0px 2px 2px 0px,
rgb(250, 250, 250) 0px 0px 0px 1px
```

This was pulled directly from the tokens.json `shadowTokens` array where this exact three-layer stack appears at frequency 26 -- the most common shadow in the system. The featured card stack (six layers, frequency 18) adds the `rgba(0, 0, 0, 0.04) 0px 8px 8px -8px` ambient distance layer and two transparent reset layers.

Reproducing the exact string rather than paraphrasing ("a subtle shadow with border and glow") ensures copy-paste fidelity. A developer should be able to grab this value and use it directly.

---

## Section 6: Depth & Elevation

### Shadow Philosophy Paragraph

The style guide requires every DESIGN.md to include a shadow philosophy paragraph. The Vercel version names four architectural purposes for shadow layers (border, ambient softness, depth at distance, inner glow) and contrasts with the Material Design convention of elevation-as-altitude.

This paragraph exists because a shadow stack like `rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px 0px, rgba(0,0,0,0.04) 0px 8px 8px -8px, rgb(250,250,250) 0px 0px 0px 1px` is opaque without explanation. The philosophy paragraph transforms a string of values into an understandable system: each layer has a job, and omitting any layer (especially the inner ring) breaks the architecture.

---

## General Writing Observations

### Value Embedding Pattern

The strongest sentences in the Vercel DESIGN.md follow a consistent pattern: **[observation] ([value]) [consequence]**. Example: "The aggressive negative letter-spacing (-2.88px at display sizes) creates text that feels minified for production."

Three components in one sentence: what you see (negative tracking), what it measures (-2.88px), and what it means (minified for production). This pattern is repeatable and ensures every paragraph meets the 2-4 values density target.

### Metaphor Strategy

The document uses engineering metaphors ("compressed infrastructure", "minified for production", "code optimized for production") rather than aesthetic metaphors ("beautiful typography", "elegant spacing"). This aligns with the audience (frontend engineers) and the brand (developer infrastructure). Metaphors from the audience's own domain create instant recognition.

### Structural Completeness

Every component spec in Section 4 includes enough values to reconstruct the component from scratch. The test: could a developer build this without opening a browser? If yes, the spec is complete. If they need to guess any property, the spec has a gap.

### Data Fidelity

The DESIGN.md must use values from the actual tokens.json extraction, not from memory or convention. For example, the reference DESIGN.md lists workflow colors as `#ff5b4f` (Ship Red), `#de1d8d` (Preview Pink), and `#0a72ef` (Develop Blue). Our extraction found `#e5484d`, `#bd2864`, and `#0068d6` -- different hex values that reflect what the crawler actually observed on the live site. The gold standard DESIGN.md uses OUR extracted values, not the reference's. This is the difference between documentation and speculation.

### Banned Word Enforcement

A quick audit of the DESIGN.md prose should find zero instances of: clean, modern, sleek, professional, user-friendly, intuitive, elegant, beautiful, stunning, gorgeous, polished, refined, sophisticated, seamless, cutting-edge, state-of-the-art, next-generation, innovative, revolutionary, world-class, premium, crisp, delightful, lovely, nice, or simple (used approvingly). Every one of these words is a placeholder for a specific observation. The Vercel DESIGN.md replaces each with that observation.
