# Writing Notes: Stripe DESIGN.md

Annotations on writing decisions made during generation.

---

## Opening Sentence

Kept the reference file's opening ("gold standard of fintech design") because it
passes the specificity test -- no other site could credibly claim this framing.
The tension pair "technical and luxurious, precise and warm" maps directly to
extracted tokens: weight 300 headlines (luxurious) + `"tnum"` tabular numerals (technical).

## Paragraph Structure: Macro > Meso > Micro

- **P2 (Macro)**: Three hex values (`#ffffff`, `#061b31`, `#533afd`). The "not
  cold, clinical purple" contrast avoids the banned word "premium."
- **P3 (Meso)**: `sohne-var`, `"ss01"`, weight 300, size range 44-56px, letter-spacing.
  "Whispered authority" names the effect of weight 300 at display sizes.
- **P4 (Micro)**: Shadow system as distinguishing technique. Used actual extracted
  `rgba(50,50,93,0.12)`, not reference file's `rgba(50,50,93,0.25)`.

---

## Token Fidelity Decisions

**Shadow values differ from reference.** The reference uses 0.25 opacity and multi-
layer stacks. Extracted data shows 0.12 opacity and single-layer shadows. Used
actual values throughout -- the blue-tinted principle remains; opacity differs.

**Color frequency as evidence.** Included counts to ground claims in data. Frequency
revealed `#000000` is primarily a border color (3869 border vs 1592 text), which
informed the Don't about pure black headings.

**`#50617a` added.** Frequency 1029 (second-highest token), absent from reference.
Added as "Slate Blue" to fill a gap in the color documentation.

**Max content width 1266px.** Preserved exact extracted value. Reference file uses
"approximately 1080px" which does not match the data.

---

## Typography

**22 rows** -- exceeds the 12-20 spec slightly. Justified: 26 distinct levels in
data; collapsing further loses meaningful distinctions (44px hero vs 48px display,
`"tnum"` vs `"ss01"` at 14px).

**Weight 600 discovery.** Reference describes "two-weight simplicity" (300/400).
Extracted data shows 600 at 16px (82 occurrences) and 14px (9 occurrences) for
CTAs and nav. Updated to "three-weight discipline."

**Line height conversions.** Raw values (e.g., "57.68px" at 56px) converted to
unitless ratios (1.03) per format spec.

---

## Components

**Button padding asymmetry.** Primary button `11.5px 20px 14.5px 20px` preserved
verbatim -- intentional optical alignment, not a rounding error.

**Footer added.** tokens.json includes Footer variant with distinctive `rgb(248,250,253)`
background. Reference does not document the footer.

---

## Motion Section (6.5)

Included because tokens.json contains five duration tiers, multiple timing functions,
and named CSS variables (`--navigation-easing`, `--card-ease`). Format spec: include
6.5 only when observable motion data exists.

`cubic-bezier(0.25, 1, 0.5, 1)` at 21 occurrences -- overshoot-dampened ease-out for
buttons. Called out in Do's and Iteration Guide.

---

## Do's and Don'ts

Counter-intuitive test applied to each Don't:
- Weight 600+ for headlines (convention says heavy = important)
- Pill radius for buttons (many systems do this)
- Neutral gray shadows (the default instinct)
- `#000000` for headings (the obvious choice)
- Mixing `"ss01"` and `"tnum"` (both OpenType features, tempting to combine)

`#b9b9f9` border-only rule: 40 occurrences, all borderColor, zero text/bg.
A constraint a developer would not guess without token analysis.

---

## Layout

**71px anomaly.** Spacing map shows 71px at 24 occurrences -- not a 4px or 8px
multiple. Called out as distinctive vertical rhythm in Whitespace Philosophy.

---

## Quality Checks

Banned words: zero instances. One near-miss ("premium feel" in P2) replaced with
"financially authoritative."

Final line count: ~310 lines, within the 280-350 target.
