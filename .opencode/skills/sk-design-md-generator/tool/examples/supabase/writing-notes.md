# Writing Notes: Supabase DESIGN.md

Annotations on writing decisions, data interpretation, and quality tradeoffs.

---

## Section 1: Visual Theme & Atmosphere

**Opening sentence**: Used the "born in a terminal" metaphor to capture the developer-tool-
that-became-a-marketing-surface tension. Avoided "dark mode design system" (too generic).

**Paragraph 3 (signature technique)**: Chose border-defined depth over the green accent
as the distinguishing technique. The `#2e2e2e` token at 25,197 uses is the most-used color
in the system -- frequency data makes the border hierarchy the objectively dominant
design mechanism, not just an opinion.

---

## Section 2: Color Palette

**Grouping**: Three groups -- Brand (greens), Neutral Scale, Functional. The green serves
double duty as brand and interactive, so a separate "Interactive" group would duplicate it.
Neutral scale stays as one progression since tokens serve both background and text roles.

**`#2e2e2e` naming**: Called it "Standard Border" because 24,968 border uses makes it the
single most dominant design token. Frequency data transforms observation into a claim.

**Low-frequency colors included**: Warning amber (`#db8e00`) and focus blue
(`rgba(147, 197, 253, 0.5)`) demonstrate the functional color layer. Omitting them
would make the system seem purely monochromatic.

---

## Section 3: Typography

**18 table rows**: Source Code Pro appears at 48px, 36px, 24px, 20px, 12px, and 11px --
more monospace levels than expected. Each gets a row because sizes serve distinct roles.

**Weight 700**: A single Source Code Pro 18px/700 instance exists ("$25" price callout).
Mentioned as an exception in principles rather than a table row since confidence was "low."

**Letter spacing -0.16px**: Only one level uses negative tracking. Called out in both table
and principles because it separates faithful reproduction from generic dark-mode cards.

---

## Section 4: Components

**Input background**: `rgba(250, 250, 250, 0.027)` is a striking detail -- a developer
would never guess this value. They would use `transparent` or solid dark, both wrong.

**Card radius 11px**: Tokens.json shows 11px as primary card radius (72 uses), not 12px
or 8px. An unusual value a developer would round without precise documentation.

**Button naming**: Kept extracted styling exactly as measured even where the variant name
("Primary" for a subtle `#242424` bg button) does not match typical naming conventions.

---

## Section 5-6: Layout & Depth

**Base unit conflict**: Tokens.json reports 4px base, but scale includes 6px, 10px, 1px.
Reported as-extracted. High-frequency values (8, 12, 16, 24) do align to 4px.

**Shadow philosophy**: Most extracted shadows are literally `rgba(0, 0, 0, 0) 0px 0px 0px 0px`
-- transparent and zero everywhere. This is not "minimal shadows" but an architectural
decision. Wrote the philosophy to explain WHY (dark backgrounds make shadows invisible).

---

## Section 6.5: Motion

**Included because**: Tokens.json contains five duration tiers, three timing functions,
and nine keyframe animations -- enough for a meaningful section.

**180000ms excluded**: The 3-minute "xl" duration is likely infinite marquee timing,
not a meaningful interaction duration. Excluded to avoid confusion.

---

## Section 7: Do's and Don'ts

**Counter-intuitive test**: Each Don't targets something a competent developer would
naturally do wrong: using `#000000` (most dark systems use true black), weight 700 for
headings (standard convention), green on backgrounds (natural brand expression).

**Contrast ratio data**: Used extracted contrast pairs to support the `#898989` Don't.
The 5.12:1 ratio passes AA but fails AAA. `#fafafa` at 17.18:1 is the correct choice.

---

## Section 9: Agent Prompts

**Self-containment**: Each prompt passes the deletion test -- a developer can copy one
prompt and build a correct component without reading anything else in the document.

**Pricing card added**: The pricing page combines Source Code Pro for tier names/prices
with Circular for body -- a pattern that would not be guessed from general typography rules.

---

## Values Not Included

**Radix tokens**: The reference mentions HSL-based Radix tokens (`--colors-crimson4`, etc.).
These do not appear in tokens.json (extraction captured computed hex values). Omitted
rather than fabricating variable names.

**Breakpoints**: Tokens.json has no breakpoint data. Used Tailwind defaults (640, 768, 1024)
since the detected framework is Tailwind.
