# Origin of this Style Reference

Unlike the cursor reference beside it, this one was not captured by the style library. It was
read out of the evilcharts source and written here, so what is measured and what is authored
are recorded separately below.

**Source:** the evilcharts component library, `src/app/globals.css`, its `:root` and `.dark`
custom-property blocks. Both blocks are carried verbatim beside this file as `source-globals.css`,
so every converted hex can be checked against the `oklch()` it came from without reaching for the
library clone, which lives in another packet's research context.
**Read:** 2026-09-09

## Measured

Every hex in the colour table is a conversion of an `oklch()` value declared in that stylesheet.
The conversion is the standard OKLab to linear sRGB matrix followed by the sRGB transfer
function, with out-of-gamut channels clamped. Two examples so the arithmetic can be checked:
`oklch(0.646 0.222 41.116)` is `#f54900`, and `oklch(0.488 0.243 264.376)` is `#1447e6`.

The radius ladder is `--radius: 0.525rem` (8.4px) with the file's own `calc` steps at -4, -2,
+0 and +4. The typefaces are the three the stylesheet binds: Geist Sans, JetBrains Mono and
Inter.

## Authored

The prose - the summary line, the role column, the dark-theme note and the do's and don'ts -
is a reading of the source, not a quotation from it. Two claims in it are measured rather than
asserted: Gold and Amber reach 1.72:1 and 2.13:1 against this reference's own white, computed
with the packet's own gate arithmetic, which is why they are described as fill colours.

`tokens.json` is authored, not captured. The applicator picks up a file under exactly that name
beside a DESIGN.md and reads `darkMode` from it; without it a reference that has a dark theme
is themed onto the corpus stock dark chrome instead of its own ground. evilcharts does have one,
so the file declares it.

## What it produces

```
node scripts/apply-design-md.cjs assets/style-reference/evilcharts/DESIGN.md --all --out <dir>
```

Light resolves to a white ground with Flame, Deep, Violet and Rose and Cobalt for emphasis;
dark resolves to evilcharts' own `#090909` with Flame, Teal, Violet and Rose and Gold for
emphasis. Four of the twenty-nine forms are ordered ramps the applicator refuses by design, so
a run themes twenty-five.

| File | sha256 | Read by |
|------|--------|---------|
| `DESIGN.md` | `ec8c6f693516026f…` | `scripts/apply-design-md.cjs` — its colour table, its typography blocks, its border-radius table and its theme line |
| `source-globals.css` | `133dd40285d513f4…` | a reader checking a converted hex against the oklch it came from; nothing loads it |
| `tokens.json` | `90d5a56c859b6103…` | `scripts/apply-design-md.cjs` — `darkMode`, which decides whether the dark theme derives from this reference or from stock chrome |
