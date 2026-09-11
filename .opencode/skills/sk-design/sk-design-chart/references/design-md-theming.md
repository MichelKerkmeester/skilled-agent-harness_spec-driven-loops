---
title: "Theming a chart from DESIGN.md"
description: "The local, gated path from a v3 Style Reference to a deterministic chart delivery."
trigger_phrases:
  - "theme chart from DESIGN.md"
  - "apply style reference to chart"
  - "measured site's look"
  - "design-md chart delivery"
importance_tier: normal
contextType: reference
version: 0.23.0.9
---

# Theming a chart from DESIGN.md

`DESIGN.md` is a style reference, not a chart form. The chart packet applies one locally available
v3 reference to a copy of an existing form; it does not extract a site, open a URL or change the
stock palette. Extraction belongs to `sk-design-md-generator`.

## The command

```bash
node .opencode/skills/sk-design/sk-design-chart/scripts/apply-design-md.cjs \
  path/to/DESIGN.md --forms grouped-bars,daily-line --out scratch/themed
```

Use `--all` instead of `--forms` to copy every form. `--scheme light|dark|both` selects which
ground receives the reference: `light` derives the light ground and keeps the stock dark chrome,
`dark` derives the dark ground and keeps the stock light chrome, and `both` derives both when the
reference declares dark support. If a reference is light-only, its dark half is the stock dark
chrome with series re-derived against it. `--tokens tokens.json` supplies the optional sibling
token inventory explicitly; otherwise a sibling `tokens.json` is used when present.

The input must be a local file. A URL is refused. The output directory is created only after every
chosen form has a complete derived palette and both theme validations have passed. There is no
force option.

## What the parser reads

The parser follows the v3 headings rather than searching for arbitrary prose:

| Reference section | Required shape | Used for |
| --- | --- | --- |
| `## Tokens — Colors` | `Name`, `Value`, `Token`, `Role` table | Chrome roles, chromatic series and emphasis |
| `## Tokens — Typography` | First typeface heading and its immediate `Substitute` line | Body stack, and mono heading when the reference supplies one |
| `## Tokens — Spacing & Shapes` → `### Border Radius` | `Element`, `Value` table | The five chart corner rungs |

A missing heading, table or substitute is reported by name and stops the run. Six-digit colour
values are the usable rows; gradients are not silently turned into flat colours.

## The role mapping

The mapping preserves the chart packet's role vocabulary and uses table order as prominence:

| Chart role | Selection |
| --- | --- |
| `surface` | The lightest colour whose role names a background, surface, canvas, ground, panel or fill |
| `ink` | The darkest text-role colour on the light ground, and the lightest text-role colour on the dark ground |
| `muted` | A text-role colour nearest the stock muted ratio that still clears the text gate |
| `rule` | The selected ink colour held at the stock dark-rule alpha |
| `series-1` through `series-4` | Chromatic table values that clear the mark gate, each taken verbatim, chosen greedily by hue distance from the hues already chosen so no two neighbours share a hue; a pair that is both under the separation ratio and within thirty degrees of hue is refused as one colour. When fewer than four clear, the table's own neutral text tones fill the remaining series darkest first, with the ink held back until last so it stays free for emphasis. No value is adjusted |
| `emphasis` | The most saturated remaining chromatic value that clears the mark gate and the emphasis floor against series 1; when every clearing hue is spent on series, the ink, as the stock categorical system does |

The lightest and darkest background/text choices are calculated separately for each ground. A
declared dark `DESIGN.md` theme, or a supported `darkMode` in `tokens.json`, supplies the dark
ground. Otherwise the stock dark surface, ink, muted value and alpha rule stay in place and only
the series are re-derived against that ground. No colour is borrowed from the three stock semantic
systems to fill a missing chromatic role.

The corner ladder uses the largest measured radius that does not exceed each stock rung. A rung
with no measured value below its ceiling becomes `0px`; it never grows a corner beyond the stock
ladder. The measured primary typeface precedes its substitute stack in every body declaration, and every declaration that already names a monospace face takes the reference's mono stack; the choice is by what the declaration is, not by where it sits. A
dedicated mono typeface is used when the reference supplies one; otherwise the primary stack is
used for the mono declarations as well.

A table colour counts as chromatic when its HSL saturation is at least 24 percent; below that it
is a neutral and can only serve the chrome roles or fill a missing series. The threshold keeps a
warm grey out of the series ladder while letting a muted brand hue in.

## Ordered forms and the default reference

An ordered form (`bullet`, `calendar-grid`, `heat-matrix`, `progress-single`) paints a single-hue
magnitude ramp with step and end gates of its own. A colour table does not supply such a ramp, so
the script never themes an ordered form: naming one is refused, and `--all` skips it with a note.
Those forms keep the stock ordered system inside an otherwise themed set.

When a request names no Style Reference, `--default` themes from
`assets/style-reference/evilcharts/DESIGN.md`, the one reference this packet carries beside its
forms and the one the stock palette source is derived from since v0.18.0.0. Theming from it
reproduces the stock palette and the stock corner ladder exactly, which is the property that says
the default is still the reference the corpus came from; the corpus check holds it through the
`palette-derivation` family.

The copy is severed from its source on purpose. A reference that is regenerated elsewhere would
change what `--default` produces without a diff, and leave the stock palette derived from a file
that no longer exists. `assets/style-reference/evilcharts/origin.md` records where the copy came from
and pins each file by hash. Overriding is unchanged: pass any other `DESIGN.md` path, including one
`sk-design-md-generator` has just produced, and the script themes from that instead.

## The corner ladder is a floor, not a mapping

Each of the corpus's five rungs takes the largest corner the reference publishes that still fits it.
A reference with nothing that small has said nothing about that rung and the corpus value stands,
the way an ordered form keeps the stock ramp when a colour table cannot supply one. It used to
collapse to zero instead, which squared every data mark, legend swatch and progress capsule in a
themed set and said nothing about having done so.

The stock reference publishes 4.4, 6.4, 8.4 and 12.4px. Under the floor its 4.4 lands on track,
swatch and pill and its 8.4 on the card, which is the stock ladder exactly; the 2px mark corner is
below anything it publishes, so the corpus value stands. What the floor costs is worth stating rather
than leaving to be discovered: a reference whose corners are all larger than the corpus rungs
contributes none of them.

Mapping by the reference's own element names instead — its `cards` row straight to the card rung —
was measured and rejected. It happens to agree with the floor for this reference, whose `cards` row
is 8.4px, and it disagreed for the one before it, which named a 4px card and would have handed the
rung a corner the stock ladder had deliberately not taken. The floor is the rule that reproduced the
stock ladder from both, which is the one property that says the default is still the reference the
corpus came from. It buys that property at the cost of a reference with larger corners contributing
fewer of them, and that is the right side of the trade.

## Gates before writing

The thresholds come from `assets/style-reference/evilcharts/palettes.json` on every run. The applicator uses the shared
colour arithmetic module that the checker requires, so the same transfer curve, luminance and
rounding produce both results.

- `textOnSurface` applies to ink and muted.
- `markOnSurface` applies to all four series and emphasis.
- Any two series must differ by the separation ratio or by thirty degrees of hue.
- Every colour role must be a six-digit hex; the checker errors on anything else rather than skipping the gates.
- `emphasisAgainstFirstSeries` applies to emphasis against series 1.
- `rule` remains ungated by design, but a dark rule must be its theme's ink followed by a non-full alpha.

Every failure names the role, measured ratio, gate and nearest table colour that clears it. The
script prints `RESULT: FAILED` and writes no output on a failure. A pass prints one `MAPPING` line
per role for both grounds, then writes the selected form copies and ends with `RESULT: PASSED`.

## What changes in a delivery

The writer changes only the two sentinel-marked palette regions, their provenance comments, the
font-family declarations and the light corner ladder inside the palette. `CHART_DATA`, `READOUT`,
`CURVE`, geometry, the chart identity and every other byte remain unchanged. Each block starts with
the same deterministic comment shape:

```css
/* CHART_PALETTE:BEGIN system=design-md */
/* DESIGN.md provenance: path=path/to/DESIGN.md sha256=<64 hex> generator=1.4.0.0 */
```

The dark block carries the matching comment directly under its begin marker. The input path is
the path supplied to the command, not a rewritten absolute path, and the hash is the SHA-256 of
the input file.

`check-corpus.cjs` keeps the stock source-equality branch for `neutral`, `ordered` and
`categorical`. For a `design-md` block it instead requires the provenance comment and checks the
inline values in both themes against the same gates. `--extra DIR` runs the file-level checks over
HTML deliveries outside the package without adding them to the catalog:

```bash
node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs --extra scratch/themed
```

That separation is the safety line: a themed copy can be accepted by evidence without putting
client colours into the stock palette or weakening equality for stock forms.
